$(document).ready(function() {
  $('#datatable-basic').DataTable({
    dom: 'fltpB',
    buttons: [{
      text: 'Ajouter une Prestation',
      className: 'btn-sm mt-3 mt-md-0',
      action: function(e, dt, node, config) {
        window.location.href = '/app/addPrestation'
      }
    }],language: {
      search: "<i class='fas fa-search mb-3 mb-md-0'></i>",
      searchPlaceholder: "Rechercher",
      zeroRecords: "Aucune prestation trouvée.",
      lengthMenu: "Afficher _MENU_ Prestations.",
      emptyTable: "Aucune prestation trouvée.",
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

var deleteBtns = document.getElementsByClassName('deleteBtn');
var reloadBtns = document.getElementsByClassName('reloadBtn');

for (var i = 0; i < deleteBtns.length; i++) {
  deleteBtns[i].addEventListener("click", function(event) {
    event.preventDefault();

    Swal.fire({
      title: 'Supprimer la Prestation ?',
      type: 'error',
      showCancelButton: true,
      confirmButtonColor: '#FE1B01',
      cancelButtonColor: '#2C75FF',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value == true) {
        window.location.href = event.path[0].id;
      } else {
        return false;
      }
    })
  });
}

for (var i = 0; i < reloadBtns.length; i++) {
  reloadBtns[i].addEventListener("click", function() {
    return document.location.reload();
  });
}
