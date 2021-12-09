const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  cp: {
    type: String
  },
  city: {
    type: String
  },
  phone: {
    type: String
  },
  formeJuridique: {
    type: String
  },
  raisonSociale: {
    type: String
  },
  identifiantTva: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  facturesCounter: {
    type: Number,
    default: 0
  },
  devisCounter: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
