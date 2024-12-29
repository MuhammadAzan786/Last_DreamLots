const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'authentication', // Reference to your User model
    required: true 
  },
  items: [
    {
      productId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product', // Reference to your Product model
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1 ,
        default:1
      },
      name: {
        type: String,
    
      },
      // Store price at the time of adding to cart to handle potential price changes later
      price: { 
        type: Number, 
       
      },
      type :{
        type:String,
      },
      color:{
        type:String
      },
      stock:{
        type:Number
      },

      imageUrl:{
        type:String
      }
      // ... other product-specific details you might need (e.g., name, image) 
    }
  ],
  totalAmount: {
    type: Number,
    default: 0 // Calculate and update this when adding/updating items
  },
  // ... other fields you need for the cart (e.g., discounts, coupons)
});

module.exports = mongoose.model('Cart', cartSchema);