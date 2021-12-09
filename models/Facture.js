const mongoose = require('mongoose');

const FactureSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  limitDate: {
    type: Date,
    required: true
  },
  name: {
    type: String
  },
  address: {
    type: String
  },
  addressBis: {
    type: String
  },
  city: {
    type: String
  },
  cp: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  factureNumber: {
    type: String,
    required: true
  },
  factureName: {
    type: String,
    required: true
  },
  prestations: {
    type: Array,
    required: true
  },
  paid: {
    type: Boolean,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  uid: {
    type: String,
    required: true
  }
});

const Facture = mongoose.model('Facture', FactureSchema);

module.exports = Facture;
