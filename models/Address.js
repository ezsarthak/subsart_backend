const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  id: String,
  code: String,
  title: String,
  fullAddress: String,
  icon: String
});

module.exports = mongoose.model('Address', addressSchema);
