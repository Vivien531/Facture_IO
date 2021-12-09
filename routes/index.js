const express = require('express');
const path = require('path');
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');

const router = express.Router();

router.get('/', (req, res) => res.render('index'));

module.exports = router;
