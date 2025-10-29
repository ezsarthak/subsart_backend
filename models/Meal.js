const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  calories: Number,
  fat: Number,
  protein: Number,
  carbohydrates: Number
});

module.exports = mongoose.model('Meal', mealSchema);
