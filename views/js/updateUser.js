var updateUserForms = document.getElementsByClassName('updateUserForm');
var deleteBtns = document.getElementsByClassName('deleteBtn');

for (var i = 0; i < updateUserForms.length; i++) {
  updateUserForms[i].addEventListener("submit", function(event) {
    event.preventDefault();

    Swal.fire({
      title: 'Confirmer les modifications ?',
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

for (var i = 0; i < deleteBtns.length; i++) {
  deleteBtns[i].addEventListener("click", function() {
    event.preventDefault();

    Swal.fire({
      title: 'Supprimer votre profil ? Cette action est irréversible, vous perdrez toutes vos données !',
      type: 'error',
      showCancelButton: true,
      confirmButtonColor: '#FE1B01',
      cancelButtonColor: '#2C75FF',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value == true) {
        document.location = $(this)[0].attributes.href.value;
      } else {
        return false;
      }
    })
  });
}
