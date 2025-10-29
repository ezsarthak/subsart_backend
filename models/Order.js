const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  calories: Number,
  fat: Number,
  protein: Number,
  carbohydrates: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  dateIndex: Number,
  orderNumber: String,
  status: String,
  addressId: String,
  timeSlot: String,
  deliverySlotEnabled: Boolean,
  editDeadline: String,
  meals: [mealSchema]
});

module.exports = mongoose.model('Order', orderSchema);
