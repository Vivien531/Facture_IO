const mongoose = require('mongoose');

const PrestationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  priceHT: {
    type: String,
    required: true
  },
  priceTTC: {
    type: String,
    required: true
  },
  tva: {
    type: String,
    required: true
  },
  tvaValue: {
    type: String,
    required: true
  },
  tvaAmount: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

const Prestation = mongoose.model('Prestation', PrestationSchema);

module.exports = Prestation;
