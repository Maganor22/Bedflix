function changeDivURL() {
  let xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "../cinerama/fonctions/requetes.php?requete=getRandomBackground",
    true
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // La requête a réussi, récupérer la réponse JSON
        let response = JSON.parse(xhr.responseText);
        let background = response.affiche;

        // Précharger l'image
        let image = new Image();
        image.src = background;
        image.onload = function () {
          // L'image est chargée, procéder à l'animation en fondu
          let div = document.querySelector(".background");
          div.style.transition = "opacity 1s ease-in-out";
          div.style.opacity = "0"; // Réduire l'opacité à 0

          setTimeout(function () {
            div.style.backgroundImage = "url(" + background + ")";
            if (
              document.location.pathname === "../admin" ||
              document.location.pathname === "/cinerama/admin"
            ) {
              div.style.opacity = "0.1"; // Rétablir l'opacité à 1 après un délai
            } else {
              div.style.opacity = "0.3"; // Rétablir l'opacité à 1 après un délai
            }
          }, 1000); // Attendre 1.1s avant de changer l'image de fond et rétablir l'opacité
        };
      } else {
        // Si la requête a échoué, afficher le message d'erreur
        // alert("Erreur: " + xhr.status);
      }
    }
  };

  xhr.send();
}

setInterval(changeDivURL, 6000);
