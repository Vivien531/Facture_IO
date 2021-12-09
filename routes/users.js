const express = require('express');
const router = express.Router();
const generateUniqueId = require('generate-unique-id');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require("nodemailer");
var rimraf = require("rimraf");
var fs = require('fs');
const User = require('../models/User');
const Prestation = require('../models/Prestation');
const Client = require('../models/Client');
const Devis = require('../models/Devis');
const Facture = require('../models/Facture');
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');
const {
  capitalize
} = require('../config/functions');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'IO.factureplus@gmail.com',
    pass: 'C0DE4fun3142'
  }
});

router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

router.post('/register', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    password2
  } = req.body;
  let errors = [];

  if (!firstName || !lastName || !email || !password || !password2) {
    errors.push({
      msg: 'Veuillez compléter tous les champs.'
    });
  }

  if (password != password2) {
    errors.push({
      msg: 'Les mots de passe ne correspondent pas.'
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: 'Le mot de passe doit faire au moins 6 caractères.'
    });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      firstName,
      lastName,
      email,
      password,
      password2
    });
  } else {
    User.findOne({
      email: email
    }).then(user => {
      if (user) {
        errors.push({
          msg: 'Cet email est déjà associé à un compte.'
        });
        res.render('register', {
          errors,
          firstName,
          lastName,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          firstName,
          lastName,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                fs.mkdir(newUser._id.toString(), function(err) {
                  if (err) {
                    errors.push({
                      msg: 'Une erreur est survenue, veuillez réessayer.'
                    });
                    res.render('register', {
                      errors,
                      firstName,
                      lastName,
                      email,
                      password,
                      password2
                    });
                  } else {
                    req.flash(
                      'success_msg',
                      'Vous êtes maintenant enregistré, vous pouvez vous connecter.'
                    );
                    res.redirect('/users/login');
                  }
                })
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/app/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Vous êtes déconnecté.');
  req.session.destroy((err) => res.redirect('/users/login'));
});

router.get('/updateUser', ensureAuthenticated, (req, res) => {
  res.render('updateUser', {
    user: req.user
  });
});

router.post('/updateUser', ensureAuthenticated, (req, res) => {
  if (req.body.cp.length != 5) {
    var errors = [];
    errors.push({
      msg: 'Code postal invalide.'
    });
    res.render('updateUser', {
      user: req.body,
      errors
    });
  } else {
    var update = {};
    if (req.body.lastName) update.lastName = capitalize(req.body.lastName);
    if (req.body.firstName) update.firstName = capitalize(req.body.firstName);
    if (req.body.email) update.email = req.body.email;
    if (req.body.cp) update.cp = req.body.cp;
    if (req.body.city) update.city = capitalize(req.body.city);
    if (req.body.address) update.address = req.body.address.split(' ').map(capitalize).join(' ');
    if (req.body.phone && req.body.phone.length != 14) update.phone = req.body.phone.match(/.{1,2}/g).join(" ");
    if (req.body.formeJuridique) update.formeJuridique = req.body.formeJuridique;
    if (req.body.raisonSociale) update.raisonSociale = req.body.raisonSociale;
    if (req.body.identifiantTva) update.identifiantTva = req.body.identifiantTva;
    if (req.body.lastName && req.body.firstName && req.body.email && req.body.cp && req.body.city && req.body.address && req.body.phone && req.body.formeJuridique && req.body.raisonSociale && req.body.identifiantTva) {
      update.completed = true;
    } else {
      update.completed = false;
    }
    User.findOneAndUpdate({
      _id: req.user._id
    }, update, function(err) {
      if (err) return console.log(err);
      req.flash(
        'success_msg',
        'Votre profil a été mis à jour.'
      );
      res.redirect('/app/dashboard');
    });
  }
});

router.get('/updatePassword', ensureAuthenticated, (req, res) => {
  res.render('updatePassword');
});

router.post('/updatePassword', ensureAuthenticated, (req, res) => {
  var errors = [];
  bcrypt.compare(req.body.password, req.user.password, (err, isMatch) => {
    if (err) throw err;
    if (isMatch) {
      if (req.body.newPassword == req.body.newPassword2) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
            if (err) throw err;
            User.findOneAndUpdate({
              _id: req.user._id
            }, {
              password: hash
            }, {
              new: true
            }, function(err, response) {
              if (err) {
                console.log(err);
              } else {
                req.flash(
                  'success_msg',
                  'Le mot de passe a été modifié.'
                );
                res.redirect('/app/dashboard');
              }
            });
          });
        });
      } else {
        errors.push({
          msg: 'Les mots de passe ne correspondent pas.'
        });
        res.render('updatePassword', {
          errors
        });
      }
    } else {
      errors.push({
        msg: 'Mot de passe incorrect.'
      });
      res.render('updatePassword', {
        errors
      });
    }
  });
});

router.get('/deleteUser', ensureAuthenticated, function(req, res) {
  var userId = '' + req.user._id;
  var folder = './' + req.user._id;
  User.findOneAndDelete({
    _id: userId
  }).then(user => {
    Client.deleteMany({
      userId: userId
    }).then(clients => {
      Devis.deleteMany({
        userId: userId
      }).then(devis => {
        Facture.deleteMany({
          userId: userId
        }).then(factures => {
          Prestation.deleteMany({
            userId: userId
          }).then(prestations => {
            rimraf(folder, function() {
              req.flash(
                'success_msg',
                'Votre compte a été supprimé.'
              );
              res.redirect('/users/login');
            });
          });
        });
      });
    });
  });
});

router.get('/confirmAccount', ensureAuthenticated, (req, res) => {
  if (!req.session.code) {
    const code = generateUniqueId({
      length: 5,
      useLetters: false
    });
    var mailOptions = {
      from: 'no-reply@factureplus.com',
      to: req.user.email,
      subject: 'Vérification du compte',
      text: 'Utilisez ce code: ' + code + ' ou Cliquez sur ce lien pour vérifier votre compte. http://193.70.115.34:3000/users/confirmAccount/' + code
    };
    req.session.code = code;
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      }
    });
  }
  res.render('confirmAccount');
});

router.get('/confirmAccount/:code', ensureAuthenticated, (req, res) => {
  if (req.session.code == req.params.code) {
    User.findOneAndUpdate({
      _id: req.user._id
    }, {
      confirmed: true
    }, {
      new: true
    }, function(err, response) {
      if (err) {
        console.log(err);
      } else {
        delete req.session.code
        req.flash(
          'success_msg',
          'Votre profil a été vérifié.'
        );
        res.redirect('/app/dashboard');
      }
    });
  } else {
    req.flash(
      'error_msg',
      'Code invalide.'
    );
    res.redirect('/users/confirmAccount')
  }
});

router.post('/confirmAccount', ensureAuthenticated, (req, res) => {
  if (req.session.code == req.body.code) {
    User.findOneAndUpdate({
      _id: req.user._id
    }, {
      confirmed: true
    }, {
      new: true
    }, function(err, response) {
      if (err) {
        console.log(err);
      } else {
        delete req.session.code
        req.flash(
          'success_msg',
          'Votre profil a été vérifié.'
        );
        res.redirect('/app/dashboard');
      }
    });
  } else {
    req.flash(
      'error_msg',
      'Code invalide.'
    );
    res.redirect('/users/confirmAccount')
  }
});


module.exports = router;
