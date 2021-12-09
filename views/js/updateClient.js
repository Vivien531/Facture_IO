var updateClientForms = document.getElementsByClassName('updateClientForm');
var deleteBtns = document.getElementsByClassName('deleteBtn');

for (var i = 0; i < updateClientForms.length; i++) {
  updateClientForms[i].addEventListener("submit", function(event) {
    event.preventDefault();
    Swal.fire({
      title: 'Confirmer les Modifications ?',
      type: 'success',
      showCancelButton: true,
      confirmButtonColor: '#34C925',
      cancelButtonColor: '#2C75FF',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value == true) {
        event.path[0].submit();
      } else {
        return false;
      }
    })
  });
}

for (var i = 0; i < deleteBtns.length; i++) {
  deleteBtns[i].addEventListener("click", function() {
    event.preventDefault();
    Swal.fire({
      title: 'Supprimer le Client ?',
      type: 'error',
      showCancelButton: true,
      confirmButtonColor: '#FE1B01',
      cancelButtonColor: '#2C75FF',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value == true) {
        document.location = document.getElementById('url').value
      } else {
        return false;
      }
    })
  });
}
