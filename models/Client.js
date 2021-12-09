const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  addressBis: {
    type: String
  },
  city: {
    type: String,
  },
  cp: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  geoloc: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    required: true
  },
  uid: {
    type: String,
    required: true
  }
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
