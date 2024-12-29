const mongoose = require("mongoose");
const mongooseAggregatePaginate =require("mongoose-aggregate-paginate-v2");
const colorSchema = new mongoose.Schema({
  color: { type: String, required: true },
  colorName: { type: String, required: true },
  stock: { type: Number, required: true },
});

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  specification: { type: String, required: true },
  size_price: { type: String, required: true },
  colors: [colorSchema],
});

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
    required: true,
  },
  name: { type: String, required: true },
  id: { type: String, required: true, unique: [true, 'The ID must be unique'], },
  description: { type: String, required: true },
  Main_images: { type: Array, required: true },
  thumbnail: { type: Array, required: true },
  currentType: { type: String, required: true },
  uniqueIdentity: { type: String, required: true },
  sizes: [sizeSchema],
});

productSchema.plugin(mongooseAggregatePaginate);


const Product = mongoose.model("Product", productSchema);

module.exports = Product;
