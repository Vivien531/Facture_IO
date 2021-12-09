  document.getElementById('updatePasswordForm').addEventListener("submit", function(event) {
    if (!confirm('Confirmer les modifications?') == true) {
      event.preventDefault();
      return false;
    }
  });
