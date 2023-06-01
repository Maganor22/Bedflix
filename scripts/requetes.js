import { addFromBdd, createModalUserParams, createAvatarModal } from './modal.js';
import { createAdminButton } from './script.js';
import { actorsInBdd } from './createPlatforms.js'

export function selectFilm(id) {
    fetch(`../Bedflix/fonctions/requetes.php?requete=selectFilm&id_du_media=${id}`)
        .then(response => response.json())
        .then(data => {
            // Utilisez les données JSON ici
            addFromBdd(data);
        })
        .catch(error => {
            console.error(`Une erreur s'est produite:`, error);
        });
}

export function selectGenre(genre) {
    fetch(`../Bedflix/fonctions/requetes.php?requete=selectGenre&genres=${genre}`)
        .then(response => response.json())
        .then(data => {
            // Utilisez les données JSON ici
            console.log(data);
        })
        .catch(error => {
            console.error(`Une erreur s'est produite:`, error);
        });
}


export function insererFilm(mediaTitleOriginal, mediaTitleFr, mediaType, mediaAnnee, mediaPoster, mediaBackdrop, mediaId, mediaImdb, mediaBa, mediaSynopsis, mediaDuree, mediaNote, mediaNbNote, mediaGenre) {
    // Envoyer les données en utilisant la méthode POST de l'objet XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../Bedflix/fonctions/requetes.php?requete=insertFilm", true);
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
    xhr.send("titre=" + mediaTitleOriginal +
        "&titre_fr=" + mediaTitleFr +
        "&type=" + mediaType +
        "&annee=" + mediaAnnee +
        "&poster=" + mediaPoster +
        "&affiche=" + mediaBackdrop +
        "&id_du_media=" + mediaId +
        "&imdb=" + mediaImdb +
        "&ba=" + mediaBa +
        "&synopsis=" + mediaSynopsis +
        "&duree=" + mediaDuree +
        "&note=" + mediaNote +
        "&nbNote=" + mediaNbNote +
        "&genre=" + mediaGenre);
}

export function insererSerie(mediaTitle, mediaAnnee, mediaPoster, mediaBackdrop, mediaId, mediaImdb, mediaBa, mediaSynopsis, mediaGenre, mediaSaisons) {
    //console.log(mediaGenre, mediaSaisons)
    // Envoyer les données en utilisant la méthode POST de l'objet XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../Bedflix/fonctions/requetes.php?requete=insertSerie", true);
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
    xhr.send("titre=" + mediaTitle +
        "&annee=" + mediaAnnee +
        "&poster=" + mediaPoster +
        "&affiche=" + mediaBackdrop +
        "&id_du_media=" + mediaId +
        "&imdb=" + mediaImdb +
        "&ba=" + mediaBa +
        "&synopsis=" + mediaSynopsis +
        "&genre=" + mediaGenre +
        "&nombre_saisons=" + JSON.stringify(mediaSaisons));
    //"&nombre_episodes_par_saison=" + JSON.stringify(mediaEpisodes));
}

/* export function insererSerie(mediaTitle, mediaAnnee, mediaPoster, mediaBackdrop, mediaId, mediaImdb, mediaBa, mediaSynopsis, mediaGenre, mediaSaisons) {
    console.log(mediaGenre, mediaSaisons)
    // Envoyer les données en utilisant la méthode POST de l'objet XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../Bedflix/fonctions/requetes.php?requete=insertSerie", true);
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
    xhr.open("POST", "../Bedflix/fonctions/requetes.php?requete=updateFilm", true);
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
    xhr.send("titre=" + mediaTitleOriginal +
        "&titre_fr=" + mediaTitleFr +
        "&annee=" + mediaAnnee +
        "&poster=" + mediaPoster +
        "&affiche=" + mediaBackdrop +
        "&ba=" + mediaBa +
        "&synopsis=" + mediaSynopsis +
        "&duree=" + mediaDuree +
        "&genre=" + mediaGenre +
        "&id_du_media=" + mediaId);
}

export function updateAvatar(photo_profil) {
    // Envoyer les données en utilisant la méthode POST de l'objet XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../Bedflix/fonctions/requetes.php?requete=updateAvatar", true);
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
    console.log("test")
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            fetch(`../Bedflix/fonctions/requetes.php?requete=getAvatar`)
                .then(response => response.json())
                .then(data => {
                    // Utilisez les données JSON ici
                    alert(data)
                    //putAvatar(data);
                })
                .catch(error => {
                    console.error(`Une erreur s'est produite:`, error);
                });
        }
    };
    xhttp.open("GET", "../Bedflix/fonctions/endpoint.php", true);
    xhttp.send();

}

export function selectUserById(id, myMedia, type) {

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let infoUser = JSON.parse(this.responseText);
            let pseudo = infoUser.pseudo;
            fetch(`../Bedflix/fonctions/requetes.php?requete=selectUserById`)
                .then(response => response.json())
                .then(data => {
                    // Utilisez les données JSON ici
                    if (data.role == "admin") {
                        createAdminButton(id, myMedia, type);
                    }
                })
                .catch(error => {
                    console.error(`Une erreur s'est produite:`, error);
                });
        }
    };
    xhttp.open("GET", "../Bedflix/fonctions/endpoint.php", true);
    xhttp.send();

}

export function selectUserParams() {

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            fetch(`../Bedflix/fonctions/requetes.php?requete=selectUserById`)
                .then(response => response.json())
                .then(data => {
                    // Utilisez les données JSON ici
                    createModalUserParams(data);
                })
                .catch(error => {
                    console.error(`Une erreur s'est produite:`, error);
                });
        }
    };
    xhttp.open("GET", "../Bedflix/fonctions/endpoint.php", true);
    xhttp.send();

}

export function selectProfilPictures(userPicture) {

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            fetch(`../Bedflix/fonctions/requetes.php?requete=selectProfilPictures`)
                .then(response => response.json())
                .then(data => {
                    // Utilisez les données JSON ici
                    createAvatarModal(userPicture, data);
                })
                .catch(error => {
                    console.error(`Une erreur s'est produite:`, error);
                });
        }
    };
    xhttp.open("GET", "../Bedflix/fonctions/endpoint.php", true);
    xhttp.send();
}


export function addFav(id_media) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let info_user = JSON.parse(this.responseText);
            let id_user = info_user.id;
            console.log(id_user);
            console.log(id_media)
            fetch(`../Bedflix/fonctions/requetes.php?requete=addFav&id_user=${id_user}&id_media=${id_media}`)
                .then(response => response.text())
                .then(data => {
                    // Utilisez les données JSON ici
                    //console.log("retour du data", data);
                })
                .catch(error => {
                    console.error(`Une erreur s'est produite:`, error);
                });
        }
    };
    xhttp.open("GET", "../Bedflix/fonctions/endpoint.php", true);
    xhttp.send();

}

export function insertActorBase(nom, alias, id_films, age, dNaissance, poster, biographie) {
    // Envoyer les données en utilisant la méthode POST de l'objet XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../Bedflix/fonctions/requetes.php?requete=insertActorBase", true);
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

    xhr.send("nom=" + nom +
        "&alias=" + alias +
        "&id_films=" + id_films +
        "&age=" + age +
        "&dNaissance=" + dNaissance +
        "&poster=" + poster +
        "&biographie=" + biographie);
}

export function selectActorsByIdFilm(id, type, title, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, synopsisModal, background, modal, modalContent) {
    //console.log(id)
    fetch(`../Bedflix/fonctions/requetes.php?requete=selectActorsByIdFilm&id_films=${id}`)
        .then(response => response.json())
        .then(data => {
            // Utilisez les données JSON ici
            actorsInBdd(data, id, type, title, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, synopsisModal, background, modal, modalContent);
            //console.log(data);
        })
        .catch(error => {
            actorsInBdd(error, id, type, title, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, synopsisModal, background, modal, modalContent);
            //console.error(`Une erreur s'est produite:`, error);
        });
}


/* export function setComments(commentaires, id_media) {
    // Envoyer les données en utilisant la méthode POST de l'objet XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../Bedflix/fonctions/requetes.php?requete=setComments", true);
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

    xhr.send("id_media=" + id_media +
        "&commentaires=" + commentaires);
} */
export function setComments(user, picture, note, date, commentaire, id_films) {
    // Envoyer les données en utilisant la méthode POST de l'objet XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../Bedflix/fonctions/requetes.php?requete=setComments", true);
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
    xhr.send("user=" + user +
        "&picture=" + picture +
        "&note=" + note +
        "&date=" + date +
        "&commentaire=" + commentaire +
        "&id_films=" + id_films);
}

export function getComments(id_media) {
    // Envoyer les données en utilisant la méthode POST de l'objet XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../Bedflix/fonctions/requetes.php?requete=getComments", true);
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
