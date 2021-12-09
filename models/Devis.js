const mongoose = require('mongoose');

const DevisSchema = new mongoose.Schema({
  date: {
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
  devisNumber: {
    type: String,
    required: true
  },
  devisName: {
    type: String,
    required: true
  },
  prestations: {
    type: Array,
    required: true
  },
  factured: {
    type: Boolean,
    default: false
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

const Devis = mongoose.model('Devis', DevisSchema);

module.exports = Devis;
