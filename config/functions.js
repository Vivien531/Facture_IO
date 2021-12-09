module.exports = {
  formatDate: function(date) {
    var formatedDate = '';
    var months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    (date.getDate() < 10) ? formatedDate += '0' + date.getDate(): formatedDate += date.getDate()
    formatedDate += ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    return formatedDate;
  },
  capitalize: function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  getNumber: function getNumber(counter) {
    var number;
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    month++;
    if (month <= 9) {
      month = '0' + month;
    }
    number = year.toString() + '.' + month.toString() + '_' + counter.toString();
    return number;
  },
  getDate: function getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd <= 9)
      dd = '0' + dd;

    if (mm <= 9)
      mm = '0' + mm;

    var today = dd + '/' + mm + '/' + yyyy;
    return today;
  },
  getLimitDate: function getLimitDate() {
    var today = new Date();
    today.setMonth(today.getMonth() + 1);
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd <= 9)
      dd = '0' + dd;

    if (mm <= 9)
      mm = '0' + mm;

    var today = dd + '/' + mm + '/' + yyyy;
    return today;
  },
  getContent: function getContent(content) {
    var formattedContent = [];
    formattedContent.push([{
      text: 'Désignation',
      bold: true
    }, {
      text: 'Quantité',
      bold: true
    }, {
      text: 'Prix Unitaire HT',
      bold: true
    }, {
      text: 'Montant HT',
      bold: true
    }]);
    for (var i = 0; i < content.length; i++) {
      formattedContent.push([
        content[i].name,
        content[i].quantity,
        content[i].priceHT + "€",
        (Number(content[i].priceHT) * Number(content[i].quantity)).toFixed(2).toString() + "€",
      ]);
    }
    return formattedContent;
  },
  getTotal: function getTotal(content) {
    var formattedContent = [];
    var totalHT = 0;
    var totalTVA = 0;
    var totalTTC = 0;
    for (var i = 0; i < content.length; i++) {
      totalHT += Number(content[i].priceHT) * Number(content[i].quantity);
      totalTVA += Number(content[i].tvaAmount) * Number(content[i].quantity);
      totalTTC += Number(content[i].priceTTC) * Number(content[i].quantity);
    }
    formattedContent.push([{
      text: 'Total HT',
      bold: true
    }, totalHT.toFixed(2).toString() + "€"]);
    formattedContent.push([{
      text: 'Total TVA',
      bold: true
    }, totalTVA.toFixed(2).toString() + "€"]);
    formattedContent.push([{
      text: 'Total TTC',
      bold: true
    }, totalTTC.toFixed(2).toString() + "€"]);

    console.log("Montant HT : " + totalHT + "€");
    console.log("Montant TVA : " + totalTVA + "€");
    console.log("Montant HT : " + totalTTC + "€");

    console.log("707 | Vente de Marchandises | Débit: " + totalHT + "€");
    console.log("44571 | TVA Collectée | Débit: " + totalTVA + "€");
    console.log("411 | Clients | Crédit: " + totalTTC + "€");

    return formattedContent;
  },
  getClient: function getClient(client) {
    var formattedContent = {};
    (client.name) ? formattedContent.name = client.name: formattedContent.name = '';
    (client.address) ? formattedContent.address = client.address: formattedContent.address = '';
    (client.addressBis) ? formattedContent.addressBis = client.addressBis: formattedContent.addressBis = '';
    (client.city) ? formattedContent.city = client.city: formattedContent.city = '';
    (client.cp) ? formattedContent.cp = client.cp: formattedContent.cp = '';
    (client.phone) ? formattedContent.phone = client.phone: formattedContent.phone = '';
    (client.email) ? formattedContent.email = client.email: formattedContent.email = '';
    (client.uid) ? formattedContent.uid = client.uid: formattedContent.uid = '';
    return formattedContent;
  },
  createDevis: function createDevis(user, client, devisNumber, date, content, total) {
    var docDefinition = {
      pageMargins: [0, 100, 0, 0],
      header: {
        columns: [{
            image: 'views/src/logo/logo_small.png',
            width: 250,
            height: 68.5,
            margin: [15, 10, 0, 0],
            alignment: 'left',
          },
          {
            text: [{
              text: "Devis Numéro: " + devisNumber + "\nIdentifiant Client : " + client.uid + '\nDate du devis : ' + date,
              fontSize: 14,
              bold: true
            }],
            margin: [0, 30, 15, 0],
            alignment: 'right',
          }
        ]
      },
      content: [{
        columns: [{
          text: [{
            text: user.lastName + " " + user.firstName + "\n" +
              user.cp + " " + user.city + "\n" +
              user.address + "\n" +
              user.phone + "\n" +
              user.email + "\n",
            fontSize: 12
          }],
          alignment: 'left',
          margin: [30, 30, 0, 30]
        }, {
          text: [{
            text: client.name + '\n' +
              client.cp + ' ' + client.city + '\n' +
              client.address + '\n' +
              client.addressBis,
            fontSize: 12
          }],
          alignment: 'right',
          margin: [0, 30, 30, 30]
        }]
      }, {
        margin: [20, 0, 20, 10],
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', '*'],
          body: content
        }
      }, {
        margin: [320, 10, 70, 0],
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          body: total
        }
      }]
    };
    return docDefinition;
  },
  createFacture: function createFacture(user, client, factureNumber, date, limitDate, content, total, paid) {
    var paidCheck = '\n';
    if (paid == true) {
      paidCheck += 'Facture payée ce jour';
    } else {
      paidCheck += 'Date limite de paiement : ' + limitDate;
    }
    var docDefinition = {
      pageMargins: [0, 100, 0, 0],
      header: {
        columns: [{
            image: 'views/src/logo/logo_small.png',
            width: 250,
            height: 68.5,
            margin: [15, 10, 0, 0],
            alignment: 'left',
          },
          {
            text: [{
              text: "Facture Numéro: " + factureNumber + "\nIdentifiant Client : " + client.uid + '\nDate de la facture : ' + date + paidCheck,
              fontSize: 14,
              bold: true
            }],
            margin: [0, 25, 15, 0],
            alignment: 'right',
          }
        ]
      },
      content: [{
        columns: [{
          text: [{
            text: user.lastName + " " + user.firstName + "\n" +
              user.cp + " " + user.city + "\n" +
              user.address + "\n" +
              user.phone + "\n" +
              user.email + "\n",
            fontSize: 12
          }],
          alignment: 'left',
          margin: [30, 30, 0, 30]
        }, {
          text: [{
            text: client.name + '\n' +
              client.cp + ' ' + client.city + '\n' +
              client.address + '\n' +
              client.addressBis,
            fontSize: 12
          }],
          alignment: 'right',
          margin: [0, 30, 30, 30]
        }]
      }, {
        margin: [20, 0, 20, 10],
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', '*'],
          body: content
        }
      }, {
        margin: [320, 10, 70, 0],
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          body: total
        }
      }]
    };
    return docDefinition;
  }
};
