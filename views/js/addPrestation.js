document.getElementById('addPrestationForm').addEventListener("submit", function(event) {
  event.preventDefault();

  Swal.fire({
    title: 'Ajouter la prestation ?',
    type: 'success',
    showCancelButton: true,
    confirmButtonColor: '#34C925',
    cancelButtonColor: '#2C75FF',
    confirmButtonText: 'Confirmer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.value == true) {
      document.getElementById('addPrestationForm').submit();
    } else {
      return false;
    }
  })

});
