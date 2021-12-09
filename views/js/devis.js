$(document).ready(function() {
  $('#datatable-basic').DataTable({
    autoWidth: false,
    columns: [{
        width: "10%"
      }, {
        width: "30%"
      },
      {
        width: "30%"
      },
      {
        width: "10%"
      }
    ],
    dom: 'fltpB',
    buttons: [{
      text: 'Faire un Devis',
      className: 'btn-sm mt-3 mt-md-0',
      action: function(e, dt, node, config) {
        window.location.href = '/app/select'
      }
    }],
    language: {
      search: "<i class='fas fa-search mb-3 mb-md-0'></i>",
      searchPlaceholder: "Rechercher",
      zeroRecords: "Aucun devis trouvé.",
      lengthMenu: "Afficher _MENU_ Devis.",
      emptyTable: "Aucun devis trouvé.",
      oPaginate: {
        sNext: "<i class='fas fa-angle-right'></i>",
        sPrevious: "<i class='fas fa-angle-left'></i>",
      }
    },
    bInfo: false
  });
});

// function change() {
//   setTimeout(function() {
//     document.getElementById('datatable-basic_next').children[0].innerHTML = '<i class="fas fa-angle-right"></i>';
//     document.getElementById('datatable-basic_previous').children[0].innerHTML = '<i class="fas fa-angle-left"></i>';
//   }, 10);
// }
//
// $(document).ready(function() {
//   window.addEventListener("load", function(event) {
//     change();
//     $('body').on('DOMSubtreeModified', '#datatable-basic', function() {
//       change();
//     });
//   });
// });

function print(pdf) {
  var iframe = document.createElement('iframe');
  iframe.style.visibility = "hidden";
  iframe.src = pdf;
  document.body.appendChild(iframe);
  iframe.contentWindow.focus();
  iframe.contentWindow.print();
}

const urlParams = new URLSearchParams(window.location.search);
var factureDevisForms = document.getElementsByClassName('factureDevisForm');
// var tdsDevis = document.getElementsByClassName('tdDevis');
var reloadBtns = document.getElementsByClassName('reloadBtn');
var printBtns = document.getElementsByClassName('printBtn');
var displayBtns = document.getElementsByClassName('displayBtn');

if (urlParams.has('newDevisPath')) {
  window.open('display/' + urlParams.get('newDevisPath'));
  window.history.replaceState({}, document.title, "/app/devis");
}

for (var i = 0; i < factureDevisForms.length; i++) {
  factureDevisForms[i].addEventListener("submit", function(event) {
    event.preventDefault();

    Swal.fire({
      title: 'Confirmer la facturation du devis ?',
      type: 'success',
      showCancelButton: true,
      confirmButtonColor: '#34C925',
      cancelButtonColor: '#2C75FF',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value == true) {
        $(this).unbind('submit').submit()
      } else {
        return false;
      }
    })
  });
}

// for (var i = 0; i < tdsDevis.length; i++) {
//   tdsDevis[i].addEventListener("click", function(event) {
//     if (confirm('Afficher le devis?'))
//       window.open(event.path[1].id);
//   });
// }

for (var i = 0; i < reloadBtns.length; i++) {
  reloadBtns[i].addEventListener("click", function() {
    return document.location.reload();
  });
}

for (var i = 0; i < printBtns.length; i++) {
  printBtns[i].addEventListener("click", function(event) {
    return print(event.target.getAttribute("data-href"));
  });
}


for (var i = 0; i < displayBtns.length; i++) {
  displayBtns[i].addEventListener("click", function(event) {
    event.preventDefault();

    Swal.fire({
      html: '<iframe title="devis" class="iframe" src="/app/' + event.target.getAttribute("data-href").toString() + '"></iframe>',
      customClass: 'swal-custom',
      focusConfirm: false,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#2C75FF',
      cancelButtonColor: '#2C75FF',
      confirmButtonText: 'Imprimer',
      cancelButtonText: 'Fermer'
    }).then((result) => {
      if (result.value == true) {
        print("/app/" + event.target.getAttribute("data-href").toString());
      } else {
        return false;
      }
    });
  });
}
