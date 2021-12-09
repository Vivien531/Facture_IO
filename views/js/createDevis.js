function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}
var reloadBtns = document.getElementsByClassName('reloadBtn');

for (var i = 0; i < reloadBtns.length; i++) {
  reloadBtns[i].addEventListener("click", function() {
    Swal.fire({
      title: 'Remettre à zéro ?',
      type: 'error',
      showCancelButton: true,
      confirmButtonColor: '#FE1B01',
      cancelButtonColor: '#2C75FF',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value == true) {
        document.location.reload();
      }
    })
  });
}

document.getElementById('createDevisForm').addEventListener("submit", function(event) {
  event.preventDefault();

  Swal.fire({
    title: 'Valider le Devis ?',
    type: 'success',
    showCancelButton: true,
    confirmButtonColor: '#34C925',
    cancelButtonColor: '#2C75FF',
    confirmButtonText: 'Confirmer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.value == true) {
      document.getElementById('createDevisForm').submit();
    } else {
      return false;
    }
  })
});

var add = document.getElementById('add');
var table = document.getElementById("table")
var prestation = document.getElementById('prestation');
var prestations = document.getElementById('prestations');

add.addEventListener("click", function() {
  if (prestation.value) {
    if (!document.getElementById(JSON.parse(prestation.value)._id)) {
      var input = document.createElement("input");
      setAttributes(input, {
        "style": "display:none;",
        "id": JSON.parse(prestation.value)._id,
        "type": "text",
        "value": prestation.value,
        "name": "prestation"
      });
      prestations.appendChild(input);

      var tr = document.createElement("tr");
      setAttributes(tr, {
        "id": "tr_" + JSON.parse(prestation.value)._id
      });

      var designation_td = document.createElement("td");
      setAttributes(designation_td, {
        "class": "align-middle"
      });
      designation_td.innerHTML = JSON.parse(prestation.value).name;

      var price_td = document.createElement("td");
      setAttributes(price_td, {
        "class": "align-middle"
      });
      price_td.innerHTML = JSON.parse(prestation.value).priceHT + '€';

      var quantity_td = document.createElement("td");
      setAttributes(quantity_td, {
        "class": "align-middle",
        "style": "word-wrap: break-word;min-width: 160px;max-width: 160px;"
      });

      var div = document.createElement("div");
      setAttributes(div, {
        "class": "input-group input-group-sm"
      });

      var down_span = document.createElement("span");
      setAttributes(down_span, {
        "class": "input-group-prepend"
      });

      var down_button = document.createElement("button");
      setAttributes(down_button, {
        "class": "btn btn-outline-primary",
        "type": "button",
        "data-href": JSON.parse(prestation.value)._id
      });

      down_button.addEventListener("click", function(event) {
        if (event.target.getAttribute("data-href") && document.getElementById('quantity_' + event.target.getAttribute("data-href")).value > 0) {
          return document.getElementById('quantity_' + event.target.getAttribute("data-href")).value--;
        } else if (event.path[1].getAttribute("data-href") && document.getElementById('quantity_' + event.path[1].getAttribute("data-href")).value > 0) {
          return document.getElementById('quantity_' + event.path[1].getAttribute("data-href")).value--;
        } else if (event.path[2].getAttribute("data-href") && document.getElementById('quantity_' + event.path[2].getAttribute("data-href")).value > 0) {
          return document.getElementById('quantity_' + event.path[2].getAttribute("data-href")).value--;
        }
      })

      var down_icon = document.createElement("i");
      setAttributes(down_icon, {
        "class": "ni ni-bold-down align-middle",
        "style": "transform: scale(1.6);"
      });

      var quantity = document.createElement("input");
      setAttributes(quantity, {
        "id": "quantity_" + JSON.parse(prestation.value)._id,
        "type": "number",
        "name": JSON.parse(prestation.value)._id,
        "min": "1",
        "step": "1",
        "required": "required",
        "class": "form-control"
      });

      var up_span = document.createElement("span");
      setAttributes(up_span, {
        "class": "input-group-append"
      });

      var up_button = document.createElement("button");
      setAttributes(up_button, {
        "class": "btn btn-outline-primary",
        "type": "button",
        "data-href": JSON.parse(prestation.value)._id
      });

      up_button.addEventListener("click", function(event) {
        if (event.target.getAttribute("data-href")) {
          return document.getElementById('quantity_' + event.target.getAttribute("data-href")).value++;
        } else if (event.path[1].getAttribute("data-href")) {
          return document.getElementById('quantity_' + event.path[1].getAttribute("data-href")).value++;
        } else if (event.path[2].getAttribute("data-href")) {
          return document.getElementById('quantity_' + event.path[2].getAttribute("data-href")).value++;
        }
      })

      var up_icon = document.createElement("i");
      setAttributes(up_icon, {
        "class": "ni ni-bold-up align-middle",
        "style": "transform: scale(1.6);"
      });

      var delete_td = document.createElement("td");
      setAttributes(delete_td, {
        "class": "align-middle",
        "data-href": JSON.parse(prestation.value)._id
      });

      var delete_icon = document.createElement("i");
      setAttributes(delete_icon, {
        "class": "ni ni-fat-remove align-middle deleteIcon"
      });

      delete_td.addEventListener("click", function(event) {
        Swal.fire({
          title: 'Supprimer la prestation ?',
          type: 'error',
          showCancelButton: true,
          confirmButtonColor: '#FE1B01',
          cancelButtonColor: '#2C75FF',
          confirmButtonText: 'Supprimer',
          cancelButtonText: 'Annuler'
        }).then((result) => {
          if (result.value == true) {
            if (event.path[2].getAttribute("data-href") != undefined) {
              document.getElementById(event.path[2].getAttribute("data-href")).remove();
              document.getElementById('tr_' + event.path[2].getAttribute("data-href")).remove();
            } else if (event.path[1].getAttribute("data-href") != undefined) {
              document.getElementById(event.path[1].getAttribute("data-href")).remove();
              document.getElementById('tr_' + event.path[1].getAttribute("data-href")).remove();
            }
          }
        })
      })

      delete_td.appendChild(delete_icon);
      down_button.appendChild(down_icon);
      down_span.appendChild(down_button);
      up_button.appendChild(up_icon);
      up_span.appendChild(up_button);

      div.appendChild(down_span);
      div.appendChild(quantity);
      div.appendChild(up_span);
      quantity_td.appendChild(div);

      tr.appendChild(designation_td);
      tr.appendChild(price_td);
      tr.appendChild(quantity_td);
      tr.appendChild(delete_td);
      table.appendChild(tr);
    } else {
      $.notify({
        icon: "ni ni-bell-55",
        message: "La prestation est déjà dans le devis."
      }, {
        type: 'danger',
        timer: 10,
        placement: {
          from: 'bottom',
          align: 'right'
        },
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        }
      });
    }
  } else {
    $.notify({
      icon: "ni ni-bell-55",
      message: "Veuillez sélectionner une prestation."
    }, {
      type: 'danger',
      timer: 10,
      placement: {
        from: 'bottom',
        align: 'right'
      },
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      }
    });
  }
});
