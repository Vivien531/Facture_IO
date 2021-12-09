var addClientForms = document.getElementsByClassName('addClientForm');
for (var i = 0; i < addClientForms.length; i++) {
  addClientForms[i].addEventListener("submit", function(event) {
    event.preventDefault();

    Swal.fire({
      title: 'Ajouter le Client ?',
      type: 'success',
      showCancelButton: true,
      confirmButtonColor: '#34C925',
      cancelButtonColor: '#2C75FF',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value == true) {
        $(this).submit();
      } else {
        return false;
      }
    })

  });
}
