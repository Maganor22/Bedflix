import {
  addFromBdd,
  createModalUserParams,
  createModalUserStats,
  createAvatarModal,
} from "./modal.js";
import { createAdminButton, getFav, getFilmVu } from "./script.js";
import {
  actorsInBdd,
  responseComment,
  createCommentsModal,
  getBanned,
} from "./createPlatforms.js";

export function selectFilm(id) {
  fetch(
    `../cinerama/fonctions/requetes.php?requete=selectFilm&id_du_media=${id}`
  )
    .then((response) => response.json())
    .then((data) => {
      // Utilisez les données JSON ici
      addFromBdd(data);
    })
    .catch((error) => {
      console.error(`Une erreur s'est produite:`, error);
    });
}

export function selectGenre(genre) {
  fetch(
    `../cinerama/fonctions/requetes.php?requete=selectGenre&genres=${genre}`
  )
    .then((response) => response.json())
    .then((data) => {
      // Utilisez les données JSON ici
      //console.log(data);
    })
    .catch((error) => {
      console.error(`Une erreur s'est produite:`, error);
    });
}

export function insererFilm(
  mediaTitleOriginal,
  mediaTitleFr,
  mediaType,
  mediaAnnee,
  mediaPoster,
  mediaBackdrop,
  mediaId,
  mediaImdb,
  mediaBa,
  mediaSynopsis,
  mediaDuree,
  mediaNote,
  mediaNbNote,
  mediaGenre
) {
  // Envoyer les données en utilisant la méthode POST de l'objet XHR (XMLHttpRequest)
  // Cette ligne crée un nouvel objet XMLHttpRequest, qui est utilisé pour envoyer des requêtes HTTP asynchrones.
  let xhr = new XMLHttpRequest();
  //Ici on appelle la fonction insertFilm dans requetes.php sous méthode POST
  xhr.open(
    "POST",
    "../cinerama/fonctions/requetes.php?requete=insertFilm",
    true
  );
  //Les données sont encodées en utilisant le format application/x-www-form-urlencoded.
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  // On défini la fonction de rappel pour traiter la réponse
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (!xhr.status === 200) {
        // Si la requête a échoué, afficher le message d'erreur
        alert("Erreur: " + xhr.status);
      }
    }
  };
  // Envoie des données au serveur
  xhr.send(
    "titre=" +
      mediaTitleOriginal +
      "&titre_fr=" +
      mediaTitleFr +
      "&type=" +
      mediaType +
      "&annee=" +
      mediaAnnee +
      "&poster=" +
      mediaPoster +
      "&affiche=" +
      mediaBackdrop +
      "&id_du_media=" +
      mediaId +
      "&imdb=" +
      mediaImdb +
      "&ba=" +
      mediaBa +
      "&synopsis=" +
      mediaSynopsis +
      "&duree=" +
      mediaDuree +
      "&note=" +
      mediaNote +
      "&nbNote=" +
      mediaNbNote +
      "&genre=" +
      mediaGenre
  );
}

export function insererSerie(
  mediaTitle,
  mediaAnnee,
  mediaPoster,
  mediaBackdrop,
  mediaId,
  mediaImdb,
  mediaBa,
  mediaSynopsis,
  mediaGenre,
  mediaSaisons
) {
  //console.log(mediaGenre, mediaSaisons)
  // Envoyer les données en utilisant la méthode POST de l'objet XMLHttpRequest
  let xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "../cinerama/fonctions/requetes.php?requete=insertSerie",
    true
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Définir la fonction de rappel pour traiter la réponse
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (!xhr.status === 200) {
        // Si la requête a échoué, afficher le message d'erreur
        alert("Erreur: " + xhr.status);
      }
    }
  };

  // Envoyer les données au serveur
  xhr.send(
    "titre=" +
      mediaTitle +
      "&annee=" +
      mediaAnnee +
      "&poster=" +
      mediaPoster +
      "&affiche=" +
      mediaBackdrop +
      "&id_du_media=" +
      mediaId +
      "&imdb=" +
      mediaImdb +
      "&ba=" +
      mediaBa +
      "&synopsis=" +
      mediaSynopsis +
      "&genre=" +
      mediaGenre +
      "&nombre_saisons=" +
      JSON.stringify(mediaSaisons)
  );
  //"&nombre_episodes_par_saison=" + JSON.stringify(mediaEpisodes));
}

/* export function insererSerie(mediaTitle, mediaAnnee, mediaPoster, mediaBackdrop, mediaId, mediaImdb, mediaBa, mediaSynopsis, mediaGenre, mediaSaisons) {
    console.log(mediaGenre, mediaSaisons)
    // Envoyer les données en utilisant la méthode POST de l'objet XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../cinerama/fonctions/requetes.php?requete=insertSerie", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // Définir la fonction de rappel pour traiter la réponse
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (!xhr.status === 200) {
                // Si la requête a échoué, afficher le message d'erreur
                alert("Erreur: " + xhr.status);
            }
        }
    };

    // Envoyer les données au serveur
    let formData = new FormData();
    formData.append('titre', mediaTitle);
    formData.append('annee', mediaAnnee);
    formData.append('poster', mediaPoster);
    formData.append('affiche', mediaBackdrop);
    formData.append('id_du_media', mediaId);
    formData.append('imdb', mediaImdb);
    formData.append('ba', mediaBa);
    formData.append('synopsis', mediaSynopsis);
    formData.append('genre', mediaGenre);
    formData.append('nombre_saisons', mediaSaisons.length);

    for (let i = 0; i < mediaSaisons.length; i++) {
        let saison = mediaSaisons[i];
        formData.append('saison' + (i + 1), saison);

        for (let j = 0; j < saison.episodes.length; j++) {
            let episode = saison.episodes[j];
            formData.append('saison' + (i + 1) + '_episode' + (j + 1), episode);
        }
    }

    xhr.send(formData);
} */

export function updateFilm() {
  let mediaTitleOriginal = document.querySelector(".mediaTitleOriginal").value;
  let mediaTitleFr = document.querySelector(".mediaTitleFr").value;
  let mediaAnnee = document.querySelector(".mediaAnnee").value;
  let mediaPoster = document.querySelector(".mediaPoster").value;
  let mediaBackdrop = document.querySelector(".mediaBackdrop").value;
  let mediaId = document.querySelector(".mediaId").value;
  let mediaBa = document.querySelector(".mediaBa").value;
  let mediaSynopsis = document.querySelector(".mediaSynopsis").value;
  let mediaDuree = document.querySelector(".mediaDuree").value;
  let mediaGenre = document.querySelector(".mediaGenre").value;

  // Envoyer les données en utilisant la méthode POST de l'objet XMLHttpRequest
  let xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "../cinerama/fonctions/requetes.php?requete=updateFilm",
    true
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Définir la fonction de rappel pour traiter la réponse
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (!xhr.status === 200) {
        // Si la requête a échoué, afficher le message d'erreur
        alert("Erreur: " + xhr.status);
      } else {
        alert("Film modifié avec succès !");
      }
    }
  };

  // Envoyer les données au serveur
  xhr.send(
    "titre=" +
      mediaTitleOriginal +
      "&titre_fr=" +
      mediaTitleFr +
      "&annee=" +
      mediaAnnee +
      "&poster=" +
      mediaPoster +
      "&affiche=" +
      mediaBackdrop +
      "&ba=" +
      mediaBa +
      "&synopsis=" +
      mediaSynopsis +
      "&duree=" +
      mediaDuree +
      "&genre=" +
      mediaGenre +
      "&id_du_media=" +
      mediaId
  );
}

export function updateAvatar(photo_profil) {
  // Envoyer les données en utilisant la méthode POST de l'objet XMLHttpRequest
  let xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "../cinerama/fonctions/requetes.php?requete=updateAvatar",
    true
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Définir la fonction de rappel pour traiter la réponse
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (!xhr.status === 200) {
        // Si la requête a échoué, afficher le message d'erreur
        alert("Erreur: " + xhr.status);
      }
    }
  };
  // Envoyer les données au serveur
  xhr.send("photo_profil=" + photo_profil);
}

export function getAvatarFromUser() {
  console.log("test");
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      fetch(`../cinerama/fonctions/requetes.php?requete=getAvatar`)
        .then((response) => response.json())
        .then((data) => {
          // Utilisez les données JSON ici
          //alert(data);
          //putAvatar(data);
        })
        .catch((error) => {
          console.error(`Une erreur s'est produite:`, error);
        });
    }
  };
  xhttp.open("GET", "../cinerama/fonctions/endpoint.php", true);
  xhttp.send();
}

export function selectUserById(id, myMedia, type) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let infoUser = JSON.parse(this.responseText);
      let pseudo = infoUser.pseudo;
      fetch(`../cinerama/fonctions/requetes.php?requete=selectUserById`)
        .then((response) => response.json())
        .then((data) => {
          // Utilisez les données JSON ici
          if (data.role == "admin") {
            createAdminButton(id, myMedia, type);
          }
        })
        .catch((error) => {
          console.error(`Une erreur s'est produite:`, error);
        });
    }
  };
  xhttp.open("GET", "../cinerama/fonctions/endpoint.php", true);
  xhttp.send();
}

export function selectUserParams() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let info_user = JSON.parse(this.responseText);
      let id_user = info_user.id;
      fetch(`../cinerama/fonctions/requetes.php?requete=selectUserById`)
        .then((response) => response.json())
        .then((data) => {
          // Utilisez les données JSON ici
          createModalUserParams(data);
        })
        .catch((error) => {
          console.error(`Une erreur s'est produite:`, error);
        });
    }
  };
  xhttp.open("GET", "../cinerama/fonctions/endpoint.php", true);
  xhttp.send();
}

export function selectProfilPictures(userPicture) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      fetch(`../cinerama/fonctions/requetes.php?requete=selectProfilPictures`)
        .then((response) => response.json())
        .then((data) => {
          // Utilisez les données JSON ici
          createAvatarModal(userPicture, data);
        })
        .catch((error) => {
          console.error(`Une erreur s'est produite:`, error);
        });
    }
  };
  xhttp.open("GET", "../cinerama/fonctions/endpoint.php", true);
  xhttp.send();
}

export function addFav(id_media) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let info_user = JSON.parse(this.responseText);
      let id_user = info_user.id;
      //console.log(id_user);
      //console.log(id_media);
      fetch(
        `../cinerama/fonctions/requetes.php?requete=addFav&id_user=${id_user}&id_media=${id_media}`
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

export function checkFav(id_media) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let info_user = JSON.parse(this.responseText);
      let id_user = info_user.id;
      //console.log(id_user);
      //console.log(id_media);
      fetch(
        `../cinerama/fonctions/requetes.php?requete=checkFav&id_user=${id_user}&id_media=${id_media}`
      )
        .then((response) => response.text())
        .then((data) => {
          // Utilisez les données JSON ici
          getFav(data, id_media);
        })
        .catch((error) => {
          console.error(`Une erreur s'est produite:`, error);
        });
    }
  };
  xhttp.open("GET", "../cinerama/fonctions/endpoint.php", true);
  xhttp.send();
}

/* FILMS VU */

export function addFilmVu(id_media) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let info_user = JSON.parse(this.responseText);
      let id_user = info_user.id;
      //console.log(id_user);
      //console.log(id_media);
      fetch(
        `../cinerama/fonctions/requetes.php?requete=addFilmVu&id_user=${id_user}&id_media=${id_media}&fav=0`
      )
        .then((response) => response.text())
        .then((data) => {
          // Utilisez les données JSON ici
          console.log(data);
        })
        .catch((error) => {
          console.error(`Une erreur s'est produite:`, error);
        });
    }
  };
  xhttp.open("GET", "../cinerama/fonctions/endpoint.php", true);
  xhttp.send();
}

export function checkFilmVu(id_media) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let info_user = JSON.parse(this.responseText);
      let id_user = info_user.id;
      //console.log(id_user);
      //console.log(id_media);
      fetch(
        `../cinerama/fonctions/requetes.php?requete=checkFilmVu&id_user=${id_user}&id_media=${id_media}`
      )
        .then((response) => response.text())
        .then((data) => {
          // Utilisez les données JSON ici
          getFilmVu(data, id_media);
        })
        .catch((error) => {
          console.error(`Une erreur s'est produite:`, error);
        });
    }
  };
  xhttp.open("GET", "../cinerama/fonctions/endpoint.php", true);
  xhttp.send();
}

/* FIN FILMS VU */

export function insertActorBase(
  nom,
  alias,
  id_films,
  age,
  dNaissance,
  poster,
  biographie
) {
  // Envoyer les données en utilisant la méthode POST de l'objet XMLHttpRequest
  let xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "../cinerama/fonctions/requetes.php?requete=insertActorBase",
    true
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Définir la fonction de rappel pour traiter la réponse
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (!xhr.status === 200) {
        // Si la requête a échoué, afficher le message d'erreur
        alert("Erreur: " + xhr.status);
      }
    }
  };
  // Envoyer les données au serveur

  xhr.send(
    "nom=" +
      nom +
      "&alias=" +
      alias +
      "&id_films=" +
      id_films +
      "&age=" +
      age +
      "&dNaissance=" +
      dNaissance +
      "&poster=" +
      poster +
      "&biographie=" +
      biographie
  );
}

export function selectActorsByIdFilm(
  id,
  type,
  title,
  backgroundModal,
  linkYtbBtn,
  videoFrame,
  modalTitle,
  seasonsSelect,
  episodesSelect,
  validateBtn,
  synopsisModal,
  background,
  modal,
  modalContent
) {
  //console.log(id)
  fetch(
    `../cinerama/fonctions/requetes.php?requete=selectActorsByIdFilm&id_films=${id}`
  )
    .then((response) => response.json())
    .then((data) => {
      // Utilisez les données JSON ici
      console.log(data);
      actorsInBdd(
        data,
        id,
        type,
        title,
        backgroundModal,
        linkYtbBtn,
        videoFrame,
        modalTitle,
        seasonsSelect,
        episodesSelect,
        validateBtn,
        synopsisModal,
        background,
        modal,
        modalContent
      );
      //console.log(data);
    })
    .catch((error) => {
      console.log(error);
      actorsInBdd(
        error,
        id,
        type,
        title,
        backgroundModal,
        linkYtbBtn,
        videoFrame,
        modalTitle,
        seasonsSelect,
        episodesSelect,
        validateBtn,
        synopsisModal,
        background,
        modal,
        modalContent
      );
      //console.error(`Une erreur s'est produite:`, error);
    });
}

export function setComments(user, picture, note, date, commentaire, id_films) {
  // Envoyer les données en utilisant la méthode POST de l'objet XMLHttpRequest
  let xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "../cinerama/fonctions/requetes.php?requete=setComments",
    true
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Fonction de rappel pour traiter la réponse
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (!xhr.status === 200) {
        // Si la requête a échoué, afficher le message d'erreur
        alert("Erreur: " + xhr.status);
      }
    }
  };
  // Envoi des informations au fichier requetes.php
  xhr.send(
    "user=" +
      user +
      "&picture=" +
      picture +
      "&note=" +
      note +
      "&date=" +
      date +
      "&commentaire=" +
      commentaire +
      "&id_films=" +
      id_films
  );
}

/* export function getComments(id_media, type, title) {
  // Envoyer les données en utilisant la méthode POST de l'objet XMLHttpRequest
  let xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "../cinerama/fonctions/requetes.php?requete=getComments",
    true
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Définir la fonction de rappel pour traiter la réponse
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (!xhr.status === 200) {
        // Si la requête a échoué, afficher le message d'erreur
        alert("Erreur: " + xhr.status);
      }
    }
  };
  // Envoyer les données au serveur

  xhr.send("id_media=" + id_media);
}
 */
export function getComments(id_media, type, title) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let info_user = JSON.parse(this.responseText);
      let id_user = info_user.id;
      fetch(
        `../cinerama/fonctions/requetes.php?requete=getComments&id_media=${id_media}`
      )
        .then((response) => response.text())
        .then((data) => {
          // Utilisez les données JSON ici
          //console.log(data);
          getBanned(data, id_media, type, title);
          /*  createCommentsModal(data, id_media, type, title) */
        })
        .catch((error) => {
          console.error(`Une erreur s'est produite:`, error);
        });
    }
  };
  xhttp.open("GET", "../cinerama/fonctions/endpoint.php", true);
  xhttp.send();
}

export function getDurationFilm() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let info_user = JSON.parse(this.responseText);
      let id_user = info_user.id;
      fetch(
        `../cinerama/fonctions/requetes.php?requete=getDurationFilm&id_user=${id_user}`
      )
        .then((response) => response.text())
        .then((data) => {
          // Utilisez les données JSON ici
          createModalUserStats(data);
        })
        .catch((error) => {
          console.error(`Une erreur s'est produite:`, error);
        });
    }
  };
  xhttp.open("GET", "../cinerama/fonctions/endpoint.php", true);
  xhttp.send();
}

export function addUserComment(id_films, note, commentaire) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let info_user = JSON.parse(this.responseText);
      let id_user = info_user.id;

      let formData = new FormData();
      formData.append("note", note);
      formData.append("commentaire", commentaire);
      formData.append("id_films", id_films);
      formData.append("id_user", id_user);

      fetch("../cinerama/fonctions/requetes.php?requete=addUserComment", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          // Utilisez les données JSON ici
          responseComment(data);
        })
        .catch((error) => {
          console.error(`Une erreur s'est produite:`, error);
        });
    }
  };
  xhttp.open("GET", "../cinerama/fonctions/endpoint.php", true);
  xhttp.send();
}

export function checkBanComment(dataComment, id, type, title) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let info_user = JSON.parse(this.responseText);
      let id_user = info_user.id;
      fetch(
        `../cinerama/fonctions/requetes.php?requete=checkBanUser&id_user=${id_user}`
      )
        .then((response) => response.text())
        .then((dataBan) => {
          // Utilisez les données JSON ici
          createCommentsModal(dataBan, dataComment, id, type, title);
        })
        .catch((error) => {
          console.error(`Une erreur s'est produite:`, error);
        });
    }
  };
  xhttp.open("GET", "../cinerama/fonctions/endpoint.php", true);
  xhttp.send();
}
