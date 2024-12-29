const Product = require("../model/productModel");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("../utils/AsyncHandler");
const mongoose = require("mongoose");
const { uploadOnCloudinary, deleteImage } = require("../utils/cloudinary");

module.exports = {
  createProduct: asyncHandler(async (req, res) => {
    const files = req.files; // Correctly access files
    const sizes = JSON.parse(req.body.sizes); // Parse sizes from body
    const filesLength = files ? files.length : 0;

    console.log(files);
    console.log(req.uniqueIdentifier);

    const { id, name, description, category, currentType } = req.body;
    const uniqueIdentifier = req.uniqueIdentifier;

    try {
      // Create an array to store file details
      const fileDetails = await Promise.all(
        files.productImages.map(async (file) => {
          const ImageUrl = await uploadOnCloudinary(file.path);
          return {
            public_id: ImageUrl.public_id,
            created_at: ImageUrl.created_at,
            bytes: ImageUrl.bytes,
            url: ImageUrl.secure_url,
            format: ImageUrl.format,
            original_filename: ImageUrl.original_filename,
          };
        })
      );
      const thumbnailDetails = await Promise.all(
        files.thumbnail.map(async (file) => {
          const ThumbnailUrl = await uploadOnCloudinary(file.path);
          return {
            public_id: ThumbnailUrl.public_id,
            created_at: ThumbnailUrl.created_at,
            bytes: ThumbnailUrl.bytes,
            url: ThumbnailUrl.secure_url,
            format: ThumbnailUrl.format,
            original_filename: ThumbnailUrl.original_filename,
          };
        })
      );

      console.log("Request coming here");

      // Save file details array to the database
      const newProduct = new Product({
        category: category,
        id: id,
        name: name,
        description: description,
        Main_images: fileDetails,
        thumbnail: thumbnailDetails,
        currentType: currentType,
        uniqueIdentity: uniqueIdentifier,
        sizes: sizes,
      });
      await newProduct.save();

      res.status(200).send("Product uploaded successfully");
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error code
        res.status(400).send("Duplicate ID detected. The ID must be unique.");
      } else {
        res.status(500).send("An unexpected error occurred adding Product.");
      }
    }
  }),

  getAllProducts: asyncHandler(async (req, res) => {
    const {
      page,
      limit,
      category, // Category ID for filtering
      minPrice, // Minimum price for filtering
      maxPrice, // Maximum price for filtering
      search, // Search query
    } = req.query;
    console.log(category, minPrice, maxPrice, search);
    const options = {
      page,
      limit,
    };

    // Building the filter stage of the aggregation pipeline
    const filterStage = [];

    if (category) {
      filterStage.push({
        $match: { category: new mongoose.Types.ObjectId(category) },
      });
    }

    if (search) {
      filterStage.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } }, // Case-insensitive name search
            { description: { $regex: search, $options: "i" } }, // Case-insensitive description search
          ],
        },
      });
    }
    const pipeline = [
      {}, // Filter documents
    ];
    try {
      const aggregate = Product.aggregate(filterStage); // Pass the filter stage to the aggregation

      const {
        docs,
        totalDocs,
        limit: actualLimit,
        page: actualPage,
        totalPages,
      } = await Product.aggregatePaginate(
        // Empty aggregate pipeline (no additional filtering needed)
        aggregate,
        options
      );

      res.status(200).json({
        success: true,
        message: "Products retrieved successfully.",
        products: docs,
        pagination: {
          totalDocs,
          totalPages,
          currentPage: actualPage,
          perPage: actualLimit,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }),

  getUniqueProducts: asyncHandler(async (req, res, next) => {
    const categoryId = req.params.id;

    try {
      // Find all products where the category field matches the given categoryId
      const products = await Product.find({ category: categoryId });
      if (products.length === 0) {
        return res
          .status(404)
          .json({ message: "No products found for the given category ID." });
      }

      // Send the products as a JSON response
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the products." });
    }
  }),

  getProducts: asyncHandler(async (req, res, next) => {
    try {
      const productId = req.params.id;
      console.log(productId);

      if (!productId) {
        a;
        res.status(400).json({ error: "Product not found" });
      }
      const product = await Product.findById(productId);
      if (!product) {
        res.status(400).json({ error: "Product not found" });
      }
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ error: "Error Getting Product" });
    }
  }),

  deleteProduct: asyncHandler(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).send("Product not found");
      }

      const images = product.Main_images || [];

      // Delete associated images in parallel using Promise.all
      await Promise.all(
        images.map(async (image) => {
          const filePath = image.public_id;
          console.log(`Deleting image: ${filePath}`);
          try {
            await deleteImage(filePath);
          } catch (err) {
            console.error(`Failed to delete image ${filePath}:`, err);
          }
        })
      );

      // Delete the thumbnail image
      if (product.thumbnail && product.thumbnail.length > 0) {
        const oldThumbnailPath = product.thumbnail[0].public_id;
        console.log(`Deleting thumbnail: ${oldThumbnailPath}`);
        try {
          await deleteImage(oldThumbnailPath);
        } catch (err) {
          console.error(`Failed to delete thumbnail ${oldThumbnailPath}:`, err);
        }
      }

      // Delete the product after images are deleted
      await Product.findByIdAndDelete(productId);

      res.status(200).send("Product and associated files deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).send("Error deleting product");
    }
  }),

  getProductsByIds: asyncHandler(async (req, res) => {
    try {
      const productIds = req.body.productIds;

      // Input validation: Make sure it's an array and not empty
      if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({
          error: "Invalid request: Please provide an array of product IDs.",
        });
      }

      // Find products by multiple IDs
      const products = await Product.find({ _id: { $in: productIds } });

      // Check if any products were found
      if (products.length === 0) {
        return res
          .status(404)
          .json({ message: "No products found with the provided IDs" });
      }

      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching products" });
    }
  }),

  editProduct: asyncHandler(async (req, res) => {
    const productId = req.params.id;
    console.log("Edit Product");

    const files = req.files; // Access files correctly
    const sizes = JSON.parse(req.body.sizes); // Parse sizes from body
    const {
      id,
      name,
      description,
      category,
      currentType,
      filePath,
      thumbnail,
    } = req.body;
    try {
      const product = await Product.findById(productId);
      const previous = [];

      // Handle existing images based on filePath (if it's an array or string)
      if (Array.isArray(filePath)) {
        filePath.forEach((fp) => {
          product.Main_images.forEach((item) => {
            if (item.url === fp) {
              previous.push(item);
            }
          });
        });
      } else {
        product.Main_images.forEach((item) => {
          if (item.url === filePath) {
            previous.push(item);
          }
        });
      }

      // Helper function to find unique elements between two arrays
      const findUniqueElements = (array1, array2) => {
        const set1 = new Set(array1.map((item) => item.public_id));
        const set2 = new Set(array2.map((item) => item.public_id));
        const uniqueToArray1 = [...set1].filter((item) => !set2.has(item));
        const uniqueToArray2 = [...set2].filter((item) => !set1.has(item));
        return uniqueToArray1.concat(uniqueToArray2);
      };

      // Find images to delete
      const ImagesToUpdate = findUniqueElements(previous, product.Main_images);

      console.log("Data to save:", previous);
      console.log("Data to delete:", ImagesToUpdate);

      // Delete images from the filesystem
      ImagesToUpdate.forEach(async (image) => {
        // const filePath = path.join(uploadDir, image); // Use image directly since we mapped filePath above
        console.log("Removing image", image);

        try {
          await deleteImage(image); // Delete old thumbnail
        } catch (err) {
          console.error(`Failed to delete thumbnail ${oldThumbnailPath}:`, err);
        }

        // console.log(filePath);

        // if (fs.existsSync(filePath)) {
        //   fs.unlinkSync(filePath);
        // }
      });

      // Update Main_images with new files (if any)
      if (files?.productImages) {
        const fileDetails = await Promise.all(
          files.productImages.map(async (file) => {
            const ImageUrl = await uploadOnCloudinary(file.path);
            return {
              public_id: ImageUrl.public_id,
              created_at: ImageUrl.created_at,
              bytes: ImageUrl.bytes,
              url: ImageUrl.secure_url,
              format: ImageUrl.format,
              original_filename: ImageUrl.original_filename,
            };
          })
        );
        product.Main_images = previous.concat(fileDetails);
      } else {
        product.Main_images = previous;
      }

      // Update thumbnail if necessary
      if (files?.thumbnail && product.thumbnail[0]?.url !== thumbnail) {
        const oldThumbnailPath = product.thumbnail[0]?.url;
        console.log(oldThumbnailPath);

        try {
          await deleteImage(product.thumbnail[0]?.public_id); // Delete old thumbnail
        } catch (err) {
          console.error(`Failed to delete thumbnail ${oldThumbnailPath}:`, err);
        }

        // Add new thumbnail
        const thumbnailDetails = await Promise.all(
          files.thumbnail.map(async (file) => {
            const ThumbnailUrl = await uploadOnCloudinary(file.path);
            return {
              public_id: ThumbnailUrl.public_id,
              created_at: ThumbnailUrl.created_at,
              bytes: ThumbnailUrl.bytes,
              url: ThumbnailUrl.secure_url,
              format: ThumbnailUrl.format,
              original_filename: ThumbnailUrl.original_filename,
            };
          })
        );
        product.thumbnail = thumbnailDetails;
      }

      // Update other product fields
      if (category) product.category = category;
      if (id) product.id = id;
      if (name) product.name = name;
      if (description) product.description = description;
      if (currentType) product.currentType = currentType;
      if (sizes) product.sizes = sizes;

      await product.save();

      res.status(201).send("Product updated Successfully");
    } catch (error) {
      if (error.code === 11000) {
        // Handle MongoDB duplicate key error
        res.status(400).send("Duplicate ID detected. The ID must be unique.");
      } else {
        console.error("Error occurred while updating the product:", error);
        res
          .status(500)
          .send("An unexpected error occurred while updating the product.");
      }
    }
  }),

  editstock: asyncHandler(async (req, res) => {
    const ProductId = req.params.id;
    const { sizes } = req.body;
    console.log("id", ProductId);
    console.log("sizes", sizes);
    try {
      const productWithUpdatedStock = await Product.findByIdAndUpdate(
        { _id: ProductId },
        { $set: { sizes } },
        { new: true }
      );
      if (!productWithUpdatedStock) {
        return res.status(404).send("Product not found");
      }
      res.status(200).send("Product stock updated successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error updating product stock");
    }
  }),

  getProductsWithoutfilter: asyncHandler(async (req, res) => {
    try {
      const products = await Product.find({});
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching products");
    }
  }),
};
