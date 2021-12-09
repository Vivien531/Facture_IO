const generateUniqueId = require('generate-unique-id');
const schedule = require('node-schedule');
const nodemailer = require("nodemailer");
const express = require('express');
const path = require('path');
const fs = require('fs');
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');
const {
  capitalize,
  formatDate,
  getNumber,
  getDate,
  getLimitDate,
  getClient,
  getContent,
  getTotal,
  createDevis,
  createFacture
} = require('../config/functions');

const ObjectId = require('mongodb').ObjectID;
const Prestation = require('../models/Prestation');
const Client = require('../models/Client');
const User = require('../models/User');
const Devis = require('../models/Devis');
const Facture = require('../models/Facture');

var fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf'
  }
};

const PdfPrinter = require('pdfmake');
const printer = new PdfPrinter(fonts);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'IO.factureplus@gmail.com',
    pass: 'C0DE4fun3142'
  }
});

var j = schedule.scheduleJob('0 0 1 * *', function() {
  User.updateMany({}, {
    factureCounter: 0,
    devisCounter: 0
  }, function(err, docs) {
    if (err)
      console.log(err)
    else
      console.log("Reset counters\n" + docs);
  });
});

const router = express.Router();

router.get('/dashboard', ensureAuthenticated, function(req, res) {
  User.findOne({
    _id: req.user._id
  }).then(user => {
    var errors = [];
    if (user.completed == false) {
      errors.push({
        msg: "Complétez votre profil pour utiliser l'application."
      })
    }
    if (user.confirmed == false) {
      errors.push({
        msg: "Vérifiez votre compte pour utiliser l'application."
      })
    }
    res.render('dashboard', {
      user: user,
      date: formatDate(req.user.date),
      errors: errors
    });
  });
});

router.get('/prestations', ensureAuthenticated, function(req, res) {
  var query = {
    userId: req.user._id,
  };
  if (req.session.prestationsSearch && req.session.prestationsSearch != undefined) {
    query = {
      userId: req.user._id,
      $or: [{
          "name": {
            $regex: new RegExp(req.session.prestationsSearch, 'i')
          }
        },
        {
          "priceHT": {
            $regex: new RegExp(req.session.prestationsSearch, 'i')
          }
        },
        {
          "priceTTC": {
            $regex: new RegExp(req.session.prestationsSearch, 'i')
          }
        },
        {
          "tva": {
            $regex: new RegExp(req.session.prestationsSearch, 'i')
          }
        },
        {
          "tvaAmount": {
            $regex: new RegExp(req.session.prestationsSearch, 'i')
          }
        }
      ]
    };
  }
  Prestation.find(query, null, {
    sort: {
      name: 1
    }
  }, function(err, prestations) {
    var search = '';
    if (req.session.prestationsSearch && req.session.prestationsSearch != undefined) {
      search += req.session.prestationsSearch
    } else {
      search += 'any'
    }
    delete req.session.prestationsSearch;
    res.render('prestations', {
      prestations,
      search
    });
  });
});

router.post('/prestationsSearch', ensureAuthenticated, function(req, res) {
  req.session.prestationsSearch = req.body.prestationsSearch;
  res.redirect('/app/prestations');
});

router.get('/addPrestation', ensureAuthenticated, function(req, res) {
  res.render('addPrestation');
});

router.post('/addPrestation', ensureAuthenticated, function(req, res) {
  var prestation = new Prestation({
    name: capitalize(req.body.name),
    priceHT: Number(req.body.priceHT).toFixed(2).toString(),
    priceTTC: ((Number(req.body.priceHT) * Number(JSON.parse(req.body.tva).tvaValue) * 100) / 100).toFixed(2).toString(),
    tva: JSON.parse(req.body.tva).tva,
    tvaValue: JSON.parse(req.body.tva).tvaValue,
    tvaAmount: (((((Number(req.body.priceHT) * Number(JSON.parse(req.body.tva).tvaValue) * 100) / 100) - Number(req.body.priceHT)) * 100) / 100).toFixed(2).toString(),
    userId: req.user._id
  });
  prestation.save(function(err) {
    if (err) return console.log(err);
    req.flash(
      'success_msg',
      'La prestation a été créée.'
    );
    res.redirect('/app/prestations');
  });
});

router.get('/deletePrestation/:id', ensureAuthenticated, function(req, res) {
  Prestation.findOneAndDelete({
    _id: req.params.id
  }, function(err) {
    if (err) return console.log(err);
    req.flash(
      'success_msg',
      'La prestation a été supprimée.'
    );
    res.redirect('/app/prestations');
  });
});

router.get('/clients', ensureAuthenticated, function(req, res) {
  var query = {
    userId: req.user._id,
  };
  if (req.session.clientsSearch && req.session.clientsSearch != undefined) {
    query = {
      userId: req.user._id,
      $or: [{
          "name": {
            $regex: new RegExp(req.session.clientsSearch, 'i')
          }
        },
        {
          "address": {
            $regex: new RegExp(req.session.clientsSearch, 'i')
          }
        },
        {
          "addressBis": {
            $regex: new RegExp(req.session.clientsSearch, 'i')
          }
        },
        {
          "city": req.session.clientsSearch
        },
        {
          "cp": {
            $regex: new RegExp(req.session.clientsSearch, 'i')
          }
        },
        {
          "phone": {
            $regex: new RegExp(req.session.clientsSearch, 'i')
          }
        },
        {
          "email": {
            $regex: new RegExp(req.session.clientsSearch, 'i')
          }
        },
        {
          "uid": {
            $regex: new RegExp(req.session.clientsSearch, 'i')
          }
        }
      ]
    };
  }
  Client.find(query, null, {
    sort: {
      name: 1
    }
  }, function(err, clients) {
    var search = '';
    if (req.session.clientsSearch && req.session.clientsSearch != undefined) {
      search += req.session.clientsSearch
    } else {
      search += 'any'
    }
    delete req.session.clientsSearch;
    res.render('clients', {
      clients,
      search
    });
  });
});

router.post('/clientsSearch', ensureAuthenticated, function(req, res) {
  req.session.clientsSearch = req.body.clientsSearch;
  res.redirect('/app/clients');
});

router.get('/client/:id', ensureAuthenticated, function(req, res) {
  Client.findOne({
    _id: req.params.id
  }).then(client => {
    res.render('client', {
      _client: client,
      date: formatDate(client.date)
    });
  });
});

router.get('/addClient', ensureAuthenticated, function(req, res) {
  res.render('addClient');
});

router.post('/addClient', ensureAuthenticated, function(req, res) {
  if (req.body.cp.length != 5) {
    var errors = [];
    errors.push({
      msg: 'Code postal invalide.'
    });
    res.render('addClient', {
      _client: req.body,
      errors
    });
  } else {
    var client = new Client({
      name: req.body.name.split(' ').map(capitalize).join(' '),
      address: req.body.address.split(' ').map(capitalize).join(' '),
      city: capitalize(req.body.city),
      cp: req.body.cp,
      factures: [],
      devis: [],
      userId: req.user._id,
      uid: generateUniqueId({
        length: 5
      })
    });
    if (req.body.addressBis) client.addressBis = req.body.addressBis.split(' ').map(capitalize).join(' ');
    if (req.body.phone) client.phone = req.body.phone.match(/.{1,2}/g).join(" ");
    if (req.body.email) client.email = req.body.email;
    client.save(function(err) {
      if (err) return handleError(err);
      req.flash(
        'success_msg',
        'Le profil du client a été créé.'
      );
      res.redirect('/app/clients')
    });
  }
});

router.get('/updateClient/:id', ensureAuthenticated, function(req, res) {
  Client.findOne({
    _id: req.params.id
  }).then(client => {
    res.render('updateClient', {
      _client: client
    });
  });
});

router.post('/updateClient', ensureAuthenticated, function(req, res) {
  if (req.body.cp.length != 5) {
    var errors = [];
    errors.push({
      msg: 'Code postal invalide.'
    });
    res.render('updateClient', {
      _client: req.body,
      errors
    });
  } else {
    var update = {};
    if (req.body.name) update.name = req.body.name.split(' ').map(capitalize).join(' ');
    if (req.body.address) update.address = req.body.address.split(' ').map(capitalize).join(' ');
    if (req.body.addressBis) update.addressBis = req.body.addressBis.split(' ').map(capitalize).join(' ');
    if (req.body.city) update.city = capitalize(req.body.city);
    if (req.body.cp) update.cp = req.body.cp;
    if (req.body.email) update.email = req.body.email;
    if (req.body.phone && req.body.phone.length != 14) update.phone = req.body.phone.match(/.{1,2}/g).join(" ");
    Client.findOneAndUpdate({
      _id: req.body._id
    }, update, function(err) {
      if (err) return console.log(err);
      req.flash(
        'success_msg',
        'Le profil du client a été mis à jour.'
      );
      res.redirect('/app/client/' + req.body._id);
    });
  }
});

router.get('/deleteClient/:id', ensureAuthenticated, function(req, res) {
  Client.findOneAndDelete({
    _id: req.params.id
  }).then(err => {
    if (err) {
      console.log(err);
    }
    req.flash(
      'success_msg',
      'Le profil du client a été supprimé.'
    );
    res.redirect('/app/clients');
  });
});

router.get('/display/:folder/:name', (req, res) => {
  const path = req.params.folder + '/' + req.params.name;
  if (fs.existsSync(path)) {
    res.contentType("application/pdf");
    fs.createReadStream(path).pipe(res);
  } else {
    res.status(500);
    console.log('Fichier non trouvé.');
    res.send('Fichier non trouvé.');
  }
})

router.get('/devis', ensureAuthenticated, function(req, res) {
  var query;
  if (req.session.search && req.session.search != undefined) {
    query = {
      $and: [{
          userId: req.user._id
        },
        {
          $or: [{
              "name": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "address": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "addressBis": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "city": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "cp": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "phone": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "email": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "devisNumber": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "devisName": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "clientId": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "uid": {
                $regex: new RegExp(req.session.search, 'i')
              }
            }
          ]
        }
      ]
    };
  } else {
    query = {
      userId: req.user._id
    };
  }
  Devis.find(query, null, {
    sort: {
      date: -1
    }
  }, function(err, devis) {
    var search = '';
    (req.session.search && req.session.search != undefined) ? search += req.session.search: search += 'any';
    delete req.session.search;
    res.render('devis', {
      devis,
      search
    });
  });
});

router.post('/devis/search', ensureAuthenticated, function(req, res) {
  req.session.search = req.body.devisSearch;
  res.redirect('/app/devis');
});

router.get('/devis/:id', ensureAuthenticated, function(req, res) {
  req.session.search = req.params.id;
  res.redirect('/app/devis');
});

router.post('/factures/search', ensureAuthenticated, function(req, res) {
  req.session.search = req.body.facturesSearch;
  res.redirect('/app/factures');
});

router.get('/factures/:id', ensureAuthenticated, function(req, res) {
  console.log(req.params.id);
  req.session.search = req.params.id;
  res.redirect('/app/factures');
});

router.get('/createDevis/:id', ensureAuthenticated, function(req, res) {
  if (req.user.completed == false)
    res.redirect('/app/dashboard');
  Client.findOne({
    _id: req.params.id
  }).then(client => {
    Prestation.find({
      userId: req.user._id,
    }, null, {
      sort: {
        name: 1
      }
    }, function(err, prestations) {
      res.render('createDevis', {
        _client: client,
        prestations
      });
    });
  });
});

router.post('/createDevis/:id', ensureAuthenticated, function(req, res) {
  if (!req.body.prestation) {
    req.flash(
      'error_msg',
      'Le devis est vide.'
    );
    res.redirect('/app/createDevis/' + req.params.id);
  } else {
    if (typeof req.body.prestation == "string")
      req.body.prestation = [req.body.prestation]
    var devis = [];
    for (var i = 0; i < req.body.prestation.length; i++) {
      var prestation = JSON.parse(req.body.prestation[i]);
      prestation.quantity = req.body[JSON.parse(req.body.prestation[i])._id]
      devis.push(prestation);
    }
    Client.findOne({
      _id: req.params.id
    }).then(client => {
      var devisName = req.user._id + '/Devis N°' + getNumber(req.user.devisCounter) + '.pdf';
      var newDevisName = req.user._id + '/Devis N°' + getNumber(req.user.devisCounter) + '.pdf';
      var pdfDoc = printer.createPdfKitDocument(createDevis(req.user, getClient(client), getNumber(req.user.devisCounter), getDate(), getContent(devis), getTotal(devis)), {});
      pdfDoc.pipe(fs.createWriteStream(devisName));
      pdfDoc.end();
      var newDevis = new Devis({
        date: new Date(),
        name: client.name,
        address: client.address,
        addressBis: client.addressBis,
        city: client.city,
        cp: client.cp,
        phone: client.phone,
        email: client.email,
        devisNumber: getNumber(req.user.devisCounter),
        devisName: devisName,
        prestations: devis,
        userId: req.user._id,
        clientId: client._id,
        uid: client.uid
      });
      newDevis.save(function(err) {
        if (err) return handleError(err);
        User.findOneAndUpdate({
          _id: req.user._id
        }, {
          $inc: {
            devisCounter: 1
          }
        }, function(err) {
          if (err) return console.log(err);
          var mailOptions = {
            to: client.email,
            subject: 'Devis',
            text: 'Un nouveau devis est disponible',
            attachments: [{
              path: newDevisName
            }]
          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error)
              console.log(error);
          });
          req.flash(
            'success_msg',
            'Le devis a été créé.'
          );
          res.redirect('/app/devis?newDevisPath=' + newDevisName);
        });
      });
    });
  }
});

router.get('/devisFactured/:id', ensureAuthenticated, function(req, res) {
  Devis.findOne({
    _id: req.params.id
  }).then(devis => {
    Client.findOne({
      _id: devis.clientId
    }).then(client => {
      var factureName = req.user._id + '/Facture N°' + getNumber(req.user.facturesCounter) + '.pdf';
      var newFactureName = req.user._id + '/Facture N°' + getNumber(req.user.facturesCounter) + '.pdf';
      var pdfDoc = printer.createPdfKitDocument(createFacture(req.user, getClient(client), getNumber(req.user.facturesCounter), getDate(), getLimitDate(), getContent(devis.prestations), getTotal(devis.prestations), false), {});
      pdfDoc.pipe(fs.createWriteStream(factureName));
      pdfDoc.end();
      var limitDate = new Date();
      limitDate.setMonth(limitDate.getMonth() + 1);
      var newFacture = new Facture({
        date: new Date(),
        limitDate: limitDate,
        name: client.name,
        address: client.address,
        addressBis: client.addressBis,
        city: client.city,
        cp: client.cp,
        phone: client.phone,
        email: client.email,
        factureNumber: getNumber(req.user.facturesCounter),
        factureName: factureName,
        prestations: devis.prestations,
        userId: req.user._id,
        clientId: client._id,
        uid: client.uid,
        paid: false
      });
      newFacture.save(function(err) {
        if (err) return handleError(err);
        User.findOneAndUpdate({
          _id: req.user._id
        }, {
          $inc: {
            facturesCounter: 1
          }
        }, function(err) {
          if (err) return console.log(err);
          Devis.findOneAndUpdate({
            _id: req.params.id
          }, {
            factured: true
          }, function(err) {
            if (err) return console.log(err);
            var mailOptions = {
              to: client.email,
              subject: 'Facture',
              text: 'Une nouvelle facture est disponible',
              attachments: [{
                path: newFactureName
              }]
            };
            transporter.sendMail(mailOptions, function(error, info) {
              if (error)
                console.log(error);
            });
            req.flash(
              'success_msg',
              'Le devis a été facturé.'
            );
            res.redirect('/app/factures?newFacturePath=' + newFactureName);
          });
        });
      });
    });
  });
});

router.get('/factures', ensureAuthenticated, function(req, res) {
  var query;
  if (req.session.search && req.session.search != undefined) {
    query = {
      $and: [{
          userId: req.user._id
        },
        {
          $or: [{
              "name": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "address": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "addressBis": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "city": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "cp": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "phone": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "email": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "devisNumber": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "devisName": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "clientId": {
                $regex: new RegExp(req.session.search, 'i')
              }
            },
            {
              "uid": {
                $regex: new RegExp(req.session.search, 'i')
              }
            }
          ]
        }
      ]
    };
  } else {
    query = {
      userId: req.user._id
    };
  }
  Facture.find(query, null, {
    sort: {
      date: -1
    }
  }, function(err, factures) {
    var search = '';
    (req.session.search && req.session.search != undefined) ? search += req.session.search: search += 'any';
    delete req.session.search;
    res.render('factures', {
      factures,
      search
    });
  });
});

router.get('/createFacture/:id', ensureAuthenticated, function(req, res) {
  if (req.user.completed == false)
    res.redirect('/app/dashboard');
  Client.findOne({
    _id: req.params.id
  }).then(client => {
    Prestation.find({
      userId: req.user._id,
    }, null, {
      sort: {
        name: 1
      }
    }, function(err, prestations) {
      res.render('createFacture', {
        _client: client,
        prestations
      });
    });
  });
});

router.post('/createFacture/:id', ensureAuthenticated, function(req, res) {
  if (!req.body.prestation) {
    req.flash(
      'error_msg',
      'La facture est vide.'
    );
    res.redirect('/app/createFacture/' + req.params.id);
  } else {
    if (typeof req.body.prestation == "string")
      req.body.prestation = [req.body.prestation]
    var facture = [];
    for (var i = 0; i < req.body.prestation.length; i++) {
      var prestation = JSON.parse(req.body.prestation[i]);
      prestation.quantity = req.body[JSON.parse(req.body.prestation[i])._id]
      facture.push(prestation);
    }
    Client.findOne({
      _id: req.params.id
    }).then(client => {
      var factureName = req.user._id + '/Facture N°' + getNumber(req.user.facturesCounter) + '.pdf';
      var newFactureName = req.user._id + '/Facture N°' + getNumber(req.user.facturesCounter) + '.pdf';
      var paid;
      (req.body.paid == 'check') ? paid = true: paid = false;
      var pdfDoc = printer.createPdfKitDocument(createFacture(req.user, getClient(client), getNumber(req.user.facturesCounter), getDate(), getLimitDate(), getContent(facture), getTotal(facture), paid), {});
      pdfDoc.pipe(fs.createWriteStream(factureName));
      pdfDoc.end();
      var limitDate = new Date();
      limitDate.setMonth(limitDate.getMonth() + 1);
      var newFacture = new Facture({
        date: new Date(),
        limitDate: limitDate,
        name: client.name,
        address: client.address,
        addressBis: client.addressBis,
        city: client.city,
        cp: client.cp,
        phone: client.phone,
        email: client.email,
        factureNumber: getNumber(req.user.facturesCounter),
        factureName: factureName,
        prestations: facture,
        userId: req.user._id,
        clientId: client._id,
        uid: client.uid,
        paid: paid
      });
      newFacture.save(function(err) {
        if (err) return handleError(err);
        User.findOneAndUpdate({
          _id: req.user._id
        }, {
          $inc: {
            facturesCounter: 1
          }
        }, function(err) {
          if (err) return console.log(err);
          var mailOptions = {
            to: client.email,
            subject: 'Facture',
            text: 'Une nouvelle facture est disponible',
            attachments: [{
              path: newFactureName
            }]
          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error)
              console.log(error);
          });
          req.flash(
            'success_msg',
            'La facture a été créée.'
          );
          res.redirect('/app/factures?newFacturePath=' + newFactureName);
        });
      });
    });
  }
});

router.get('/facturePaid/:id', ensureAuthenticated, function(req, res) {
  Facture.findOneAndUpdate({
    _id: req.params.id
  }, {
    paid: true
  }, function(err) {
    if (err) return console.log(err);
    req.flash(
      'success_msg',
      'La facture est payée.'
    );
    res.redirect('/app/factures');
  });
});

router.get('/select', ensureAuthenticated, function(req, res) {
  var query = {
    userId: req.user._id,
  };
  if (req.session.selectSearch && req.session.selectSearch != undefined) {
    query = {
      userId: req.user._id,
      $or: [{
          "name": {
            $regex: new RegExp(req.session.selectSearch, 'i')
          }
        },
        {
          "address": {
            $regex: new RegExp(req.session.selectSearch, 'i')
          }
        },
        {
          "addressBis": {
            $regex: new RegExp(req.session.selectSearch, 'i')
          }
        },
        {
          "city": req.session.selectSearch
        },
        {
          "cp": {
            $regex: new RegExp(req.session.selectSearch, 'i')
          }
        },
        {
          "phone": {
            $regex: new RegExp(req.session.selectSearch, 'i')
          }
        },
        {
          "email": {
            $regex: new RegExp(req.session.selectSearch, 'i')
          }
        },
        {
          "uid": {
            $regex: new RegExp(req.session.selectSearch, 'i')
          }
        }
      ]
    };
  }
  Client.find(query, null, {
    sort: {
      name: 1
    }
  }, function(err, clients) {
    var search = '';
    if (req.session.selectSearch && req.session.selectSearch != undefined) {
      search += req.session.selectSearch
    } else {
      search += 'any'
    }
    delete req.session.selectSearch;
    res.render('select', {
      clients,
      search
    });
  });
});

router.post('/selectSearch', ensureAuthenticated, function(req, res) {
  req.session.selectSearch = req.body.selectSearch;
  res.redirect('/app/select');
});

module.exports = router;
