const path = require("path");
const fs = require("fs");
const Cart = require("../model/cartModel");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/AsyncHandler");
const Product = require("../model/productModel");

module.exports = {
  // Add item to cart
  addToCart: asyncHandler(async (req, res) => {
    console.log("Adding item to cart");
    try {
      const { name, productId, quantity, type, color, price, imageUrl, stock } =
        req.body;
      const userId = req.userId; // Get userId from middleware
      let cart = await Cart.findOne({ userId });
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      let outOfStock = false;
      product.sizes?.forEach((sizeItem) => {
        sizeItem.colors?.forEach((itemColor) => {
          if (itemColor.color === color) {
            const cartItem = cart?.items?.find(
              (itema) =>
                itema.color === color &&
                itema.productId.toString() === productId
            );
            const totalRequestedQuantity = cartItem
              ? cartItem.quantity + quantity
              : quantity;
            if (itemColor.stock < totalRequestedQuantity) {
              outOfStock = true;
              console.log(
                itemColor.stock,
                "compared to",
                totalRequestedQuantity
              );
            }
          }
        });
      });
      if (outOfStock) {
        return res
          .status(404)
          .json({ message: "Not enough stock for this item" });
      }
      if (!cart) {
        // Cart doesn't exist, create a new one
        cart = new Cart({
          userId,
          items: [],
        });
      }
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.type === type &&
          item.color === color
      );
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({
          name,
          productId,
          quantity,
          type,
          color,
          price,
          imageUrl,
          stock,
        });
      }
      const newCart = await cart.save();
      console.log("Response from backend");
      res.status(201).json({ message: "Item added to cart", newCart });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ error: error.message });
    }
  }),

  // Get cart contents for a user
  getCart: asyncHandler(async (req, res) => {
    try {
      const userId = req.userId; // Get userId from middleware

      const cart = await Cart.findOne({ userId }).populate({
        path: "items.productId", // Populate the 'productId' field within the 'items' array
        model: "Product", // The model to use for population (your Product model)
        select: "name ", // Select only the 'name' and 'id' fields from the Product
      });
      if (!cart) {
        // You might return an empty cart here if it's more appropriate for your frontend
        return res.status(404).json({ message: "Cart not found" });
      }

      res.json(cart);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }),

  // Update cart item quantity
  updateCartItemQuantity: asyncHandler(async (req, res) => {
    try {
      const { itemId, quantity, color, type } = req.body;
      console.log(itemId, quantity, color, type);

      const userId = req.userId; // Get userId from middleware
      console.log("index is");
      const cart = await Cart.findOne({ userId });
      console.log(cart);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === itemId &&
          item.type === type &&
          item.color === color
      );

      console.log(itemIndex);
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }

      // ... (Recalculate cart total if needed)

      await cart.save({ validateBeforeSave: false });

      res.json({ message: "Cart updated", cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }),

  // Remove item from cart
  removeItemFromCart: asyncHandler(async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const color = req.query.color;
      const type = req.query.type;
      const userId = req.userId;

      const cart = await Cart.findOne({ userId });
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === itemId &&
          item.type === type &&
          item.color === color
      );

      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" });
      } else {
        cart.items.splice(itemIndex, 1);
      }

      // ... (Recalculate cart total if needed)

      await cart.save({ validateBeforeSave: false });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      res.json({ message: "Item removed from cart", cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }),

  // Clear the entire cart
  clearCart: asyncHandler(async (req, res) => {
    try {
      const userId = req.userId; // Get userId from middleware

      const cart = await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [] } },
        { new: true }
      );

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      res.json({ message: "Cart cleared", cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }),
};
