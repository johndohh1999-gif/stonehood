const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{ id: String, name: String, price: Number, quantity: Number }],
  amount: Number,
  paymentMethod: String,
  status: { type: String, default: 'pending' },
  customerInfo: {
    name: String,
    phone: String,
    address: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);