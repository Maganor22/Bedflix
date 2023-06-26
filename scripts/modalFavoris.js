function favBtn(id_media) {
  //Selectionne le link de l'image du film et le supprime
  const link = document.getElementById(`linkFav${id_media}`);
  link.remove();

  /*     //Selectionne le bouton de fermeture du modal et simule un clique pour la fermer
    let closeButton = document.querySelector('[data-bs-dismiss="modal"]');
    closeButton.click(); */

  const modals = document.querySelectorAll(".modal");

  // Parcours de toutes les modales
  modals.forEach((modal) => {
    // Ajoutez un gestionnaire d'événements de clic sur chaque modale
    modal.style.display = "none";
  });

  //Envoie de la requete PHP pour supprimer le film des favoris de l'utilisateur
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let info_user = JSON.parse(this.responseText);
      let id_user = info_user.id;
      //console.log(id_media);
      fetch(
        `../cinerama/fonctions/requetes.php?requete=delFav&id_user=${id_user}&id_media=${id_media}`
      )
        .then((response) => response.json())
        .catch((error) => {
          console.error(`Une erreur s'est produite:`, error);
        });
    }
  };
  xhttp.open("GET", "../cinerama/fonctions/endpoint.php", true);
  xhttp.send();
}

function seeBtn(id_media, id_user) {
  let myEyeBtn = document.getElementById(`pEyeBtn${id_media}`);

  if (myEyeBtn.style.color == "greenyellow") {
    myEyeBtn.style.color = "white";
    myEyeBtn.classList.remove("fa-eye");
    myEyeBtn.classList.remove("fa-eye-slash");
    myEyeBtn.classList.add("fa-eye-slash");
  } else {
    myEyeBtn.style.color = "greenyellow";
    myEyeBtn.classList.remove("fa-eye");
    myEyeBtn.classList.remove("fa-eye-slash");
    myEyeBtn.classList.add("fa-eye");
  }

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      fetch(
        `../cinerama/fonctions/requetes.php?requete=addFilmVu&id_user=${id_user}&id_media=${id_media}&fav=1`
      )
        .then((response) => response.text())
        .then((data) => {
          // Utilisez les données JSON ici
          //console.log(data);
        })
        .catch((error) => {
          console.error(`Une erreur s'est produite:`, error);
        });
    }
  };
  xhttp.open("GET", "../cinerama/fonctions/endpoint.php", true);
  xhttp.send();
}

