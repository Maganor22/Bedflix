import { modalCreation } from "./modal.js";
import { createAdminEditButton, createFavButton } from "./script.js";
import { insertActorBase, selectActorsByIdFilm, setComments } from "./requetes.js";

let api_key = "2d216cf10e57";

export function createPlatformLinks(platformLink, modalContent) {
    let deletePlatLink = document.querySelectorAll(".platLinkElements")
    for (let i = 0; i < deletePlatLink.length; i++) {
        deletePlatLink[i].remove();
    }
    if (platformLink.length > 0) {
        let titlePlatLink = document.createElement("h2");
        titlePlatLink.classList.add("platLinkElements");
        titlePlatLink.innerHTML = "Plateformes achat/location";
        titlePlatLink.style.color = "white";
        titlePlatLink.style.marginTop = "0.9375rem";
        titlePlatLink.style.fontSize = "2rem";
        titlePlatLink.style.fontWeight = "normal";
        modalContent.appendChild(titlePlatLink);

        if (platformLink.length == 1) {
            let platformLinkBtn = document.createElement("button");
            platformLinkBtn.classList.add("btn", "btn-primary", "platLinkElements");
            platformLinkBtn.setAttribute("data-link", platformLink[0].link);
            platformLinkBtn.target = "_blank";
            platformLinkBtn.textContent = platformLink[0].platform;
            platformLinkBtn.style.color = "white";
            platformLinkBtn.style.marginTop = "0.625rem";
            modalContent.appendChild(platformLinkBtn);

            platformLinkBtn.addEventListener("click", function () {
                window.open(this.getAttribute("data-link"), "_blank");
            });
        } else {
            let dropdownPlatLink = document.createElement("select");
            dropdownPlatLink.classList.add("btn", "btn-secondary", "dropdown-toggle", "platLinkElements");

            // Crée l'option pour chaque lien de plateforme
            for (let i = 0; i < platformLink.length; i++) {
                let option = document.createElement("option");
                option.value = platformLink[i].platform;
                option.text = platformLink[i].platform;
                option.setAttribute("href", platformLink[i].link);
                dropdownPlatLink.add(option);
            }

            dropdownPlatLink.style.marginTop = "0.625rem";
            modalContent.appendChild(dropdownPlatLink);

            let isDropdownOpen = false;

            dropdownPlatLink.addEventListener("blur", function () {
                isDropdownOpen = false;
            });

            dropdownPlatLink.addEventListener("click", function () {
                const selectedOption = this.options[this.selectedIndex];
                if (isDropdownOpen) {
                    window.open(selectedOption.getAttribute("href"), "_blank");
                    isDropdownOpen = false;
                } else {
                    isDropdownOpen = true;
                }
            });
        }
    } else {
        //Supprime les éléments si il n'y a rien à ajouter
        let deletePlatLink = document.querySelectorAll(".platLinkElements")
        for (let i = 0; i < deletePlatLink.length; i++) {
            deletePlatLink[i].remove();
        }
    }
}

export function createSvod(platformSvod, modalContent) {
    let deleteSvod = document.querySelectorAll(".svodElements")
    for (let i = 0; i < deleteSvod.length; i++) {
        deleteSvod[i].remove();F
    }
    if (platformSvod.length > 0) {
        let titleSvod = document.createElement("h2");
        titleSvod.classList.add("svodElements")
        titleSvod.innerHTML = "Vidéo à la demande";
        titleSvod.style.color = "white";
        titleSvod.style.marginTop = "0.9375rem";
        titleSvod.style.fontSize = "2rem";
        titleSvod.style.fontWeight = "normal";
        modalContent.appendChild(titleSvod);

        const imagesContainer = document.createElement("div");
        imagesContainer.classList.add("svodElements");
        imagesContainer.style.display = "flex";
        imagesContainer.style.flexWrap = "wrap";
        modalContent.appendChild(imagesContainer);

        for (let i = 0; i < platformSvod.length; i++) {
            const a = document.createElement("a");
            a.href = platformSvod[i].link_url;
            a.target = "_blank";
            a.style.display = "inline-block";
            a.style.marginRight = "0.625rem";
            a.style.marginBottom = "0.625rem";
            imagesContainer.appendChild(a);

            let imgSvod = document.createElement("img");
            imgSvod.classList.add("svodElements", "imgSvod")
            imgSvod.setAttribute("src", platformSvod[i].logo);
            a.appendChild(imgSvod);
        }
    } else {
        //Supprime les éléments si il n'y a rien à ajouter
        let deleteSvod = document.querySelectorAll(".svodElements")
        for (let i = 0; i < deleteSvod.length; i++) {
            deleteSvod[i].remove();
        }
    }
}



export function createGoogleSearch(platformLink, platformSvod, title, type, year, modalContent) {

    if (platformLink.length == 0 && platformSvod == 0) {
        //Crée le bouton de recherche google si il n'y a pas de plateforme de streaming ni de vidéos à la demande
        let googleLinkBtn = document.createElement("button");
        googleLinkBtn.classList.add("btn", "btn-primary", "googleBtnLink");
        googleLinkBtn.setAttribute("data-link", `https://www.google.fr/search?q="${type} ${title} ${year}"`);
        googleLinkBtn.target = "_blank";
        googleLinkBtn.textContent = "Recherche sur Google";
        googleLinkBtn.style.color = "white";
        googleLinkBtn.style.marginTop = "0.625rem";
        modalContent.appendChild(googleLinkBtn);

        googleLinkBtn.addEventListener("click", function () {
            window.open(this.getAttribute("data-link"), "_blank");
        });
    }

}

export function createStars(note, modalContent) {
    let deleteStars = document.querySelectorAll(".stars")
    for (let i = 0; i < deleteStars.length; i++) {
        if (note instanceof Object) {
            deleteStars[i].remove();
        }
    }

    if (note == null) {
        return;
    }

    let starsTitle = document.createElement("h5");

    function style() {
        starsTitle.classList.add("stars");
        starsTitle.style.color = "white";
        starsTitle.style.marginTop = "0.9375rem";
    }

    let notation;
    let fullStars;
    let halfStar;
    let emptyStars;

    //Vérifie si la note est un nombre ou un objet
    if (note instanceof Object) {
        notation = Math.round(note.mean * 2) / 2;
        fullStars = Math.floor(notation);
        halfStar = (notation % 1 >= 0.25 && notation % 1 <= 0.75);
        emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        if (note.mean === 0) {
            style();
            starsTitle.innerHTML = "Aucune note";
            modalContent.appendChild(starsTitle);
            return;
        }

        style();
        //if (note.mean == 1 || note.mean == 2 || note.mean == 3 || note.mean == 4 || note.mean == 5) {
        if ([1, 2, 3, 4, 5].includes(note.mean)) {
            if (note.total > 1) {
                starsTitle.innerHTML = `<strong>Note</strong> : ` + note.mean.toFixed(0) + " / 5 (" + note.total + " votes)";
            } else {
                starsTitle.innerHTML = `<strong>Note</strong> : ` + note.mean.toFixed(0) + " / 5 (" + note.total + " vote)";
            }
        } else {
            if (note.total > 1) {
                starsTitle.innerHTML = `<strong>Note</strong> : ` + note.mean.toFixed(2) + " / 5 (" + note.total + " votes)";
            } else {
                starsTitle.innerHTML = `<strong>Note</strong> : ` + note.mean.toFixed(2) + " / 5 (" + note.total + " vote)";
            }
        }

    } else {
        notation = Math.round(note * 2) / 2;
        fullStars = Math.floor(notation);
        halfStar = (notation % 1 >= 0.25 && notation % 1 <= 0.75);
        emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        starsTitle.style.float = "right";
    }
    modalContent.appendChild(starsTitle);

    let stars = document.createElement("span");
    stars.classList.add("stars");
    if (note instanceof Object) {
        stars.style.margin = "0.9375rem 0 0 0.625rem";
    }

    for (let i = 1; i <= fullStars; i++) {
        let star = document.createElement("i");
        star.classList.add("fas", "fa-star");
        star.style.color = "gold";
        stars.appendChild(star);
    }

    if (halfStar) {
        let star = document.createElement("i");
        star.classList.add("fas", "fa-star-half-alt");
        star.style.color = "gold";
        stars.appendChild(star);
    }

    for (let i = 1; i <= emptyStars; i++) {
        let star = document.createElement("i");
        star.classList.add("far", "fa-star");
        star.style.color = "gray";
        stars.appendChild(star);
    }

    starsTitle.appendChild(stars);
}


export function createComments(id, type, title, comment, modalContent) {
    if (comment != 0) {
        let commentLink = document.querySelector("#comment-link");
        if (commentLink) {
            commentLink.remove();
        }
        commentLink = document.createElement("a");
        commentLink.id = "comment-link";
        commentLink.innerHTML = `<u>Commentaires</u>(${comment})`;
        commentLink.href = "#";
        modalContent.appendChild(commentLink);
        commentLink.addEventListener("click", function () {
            createCommentsModal(id, type, title);
        });
    }
}


async function createCommentsModal(id, type, title) {

    let modalCommentElements = document.querySelectorAll(".modalCommentElement");
    for (let i = 0; i < modalCommentElements.length; i++) {
        modalCommentElements[i].remove();
    }

    let commentsModal = document.createElement("div");
    commentsModal.classList.add("modal", "modalCommentElement");
    commentsModal.style.display = "block";
    const maxZIndex = Math.max(
        ...Array.from(document.querySelectorAll('*'))
            .map((el) => parseFloat(getComputedStyle(el).zIndex))
            .filter((z) => !isNaN(z))
    );
    console.log(maxZIndex)
    commentsModal.style.zIndex = maxZIndex + 1;


    let commentsModalContent = document.createElement("div");
    commentsModalContent.classList.add("modal-content");
    commentsModalContent.style.backgroundColor = "#333333";
    commentsModalContent.style.boxShadow = "rgb(255, 255, 255) 1px 0 0.625rem";
    commentsModalContent.style.padding = "2rem";

    let commentsTitle = document.createElement("h4");
    commentsTitle.innerHTML = `Commentaires de ${title}`;
    commentsTitle.style.color = "white";
    commentsTitle.style.marginBottom = "1rem";
    commentsModalContent.appendChild(commentsTitle);

    type == "film" || type == "movie" ? type = "movie" : type = "show";

    try {
        const response = await fetch(`https://api.betaseries.com/comments/comments?key=${api_key}&id=${id}&type=${type}&order=desc&replies=0&nbpp=50`);
        const comments = await response.json();
        console.log(comments);
        document.body.style.cursor = "auto";
        let commentsList = document.createElement("ul");
        commentsList.style.listStyleType = "none";
        commentsList.style.padding = "0";
        commentsList.style.margin = "0";
        let commentaireList = [];
        for (let comment of comments.comments) {
            let commentItem = document.createElement("li");
            commentItem.style.marginBottom = "1rem";

            let commentContainer = document.createElement("div");
            commentContainer.style.border = "1px solid white";
            commentContainer.style.borderRadius = "0.8rem";
            commentContainer.style.padding = "0.5rem";
            commentItem.appendChild(commentContainer);

            let commentAvatar = document.createElement("img");
            if (comment.avatar == null) {
                commentAvatar.src = "./imgs/b logo.png";
            } else {
                commentAvatar.src = comment.avatar;
            }
            commentAvatar.alt = "Avatar de " + comment.login;
            commentAvatar.width = 40;
            commentAvatar.height = 40;
            commentAvatar.style.borderRadius = "20%";
            commentAvatar.style.marginRight = "0.5rem";
            commentContainer.appendChild(commentAvatar);


            // Définir la date de naissance de l'acteur
            const dateComment = new Date(comment.date);
            // Formater la date de naissance dans le format JJ:MM:AAAA
            const jour = ('0' + dateComment.getDate()).slice(-2);
            const mois = ('0' + (dateComment.getMonth() + 1)).slice(-2);
            const annee = dateComment.getFullYear();
            const dateFormatee = `${jour}-${mois}-${annee}`;


            let commentAuthor = document.createElement("p");
            commentAuthor.innerHTML = `${comment.login} / ${dateFormatee}`;
            commentAuthor.style.color = "white";
            commentAuthor.style.display = "inline-block";
            commentAuthor.style.fontWeight = "bold";
            commentContainer.appendChild(commentAuthor);

            createStars(comment.user_note, commentContainer);

            let commentContent = document.createElement("p");
            commentContent.innerHTML = comment.text;
            commentContent.style.color = "white";
            commentContainer.appendChild(commentContent);

            commentsList.appendChild(commentItem);

            /* ENVOYER LA REQUETE D'INSERTION */
            commentaireList.push(comment.text)
        }
        commentsModalContent.appendChild(commentsList);
        setComments(commentaireList, id)
    } catch (err) {
        console.error(err);
        let error = document.createElement("p");
        error.innerHTML = "Une erreur est survenue lors du chargement des commentaires.";
        error.style.color = "white";
        commentsModalContent.appendChild(error);
    }

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "X";
    closeBtn.classList.add("btn", "btn-danger");
    closeBtn.style.width = "2.2rem";
    closeBtn.style.float = "right";
    closeBtn.addEventListener("click", function () {
        commentsModal.style.display = "none";
    });
    commentsTitle.appendChild(closeBtn);

    commentsModal.appendChild(commentsModalContent);

    document.body.appendChild(commentsModal);

    return commentsModal;
}




export function createActors(id, type, title, modalContent, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, synopsisModal, background, modal) {
    let actorsLink = document.querySelectorAll("#actors-link");
    for (let actor of actorsLink) {
        actor.remove();
    }
    /*     if (actorsLink) {
            actorsLink.remove();
        } */
    actorsLink = document.createElement("a");
    actorsLink.id = "actors-link";
    actorsLink.style.width = "fit-content";
    type == "film" ? actorsLink.textContent = `Acteurs du ${type}` : actorsLink.textContent = `Acteurs de la ${type}`
    //actorsLink.style.display = "block";
    actorsLink.style.marginTop = "0.5rem";
    actorsLink.style.color = "white";
    actorsLink.style.fontSize = "1.25rem";
    actorsLink.href = "#";
    modalContent.appendChild(actorsLink);
    actorsLink.addEventListener("click", function () {
        selectActorsByIdFilm(id, type, title, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, synopsisModal, background, modal, modalContent);
        document.body.style.cursor = "wait";
    });
}

// Fonction qui récupère les acteurs d'un film dans la bdd
export function actorsInBdd(data, id, type, title, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, synopsisModal, background, modal, modalContent) {
    //console.log(data);
    if (data != "") {
        createActorsModal(id, type, title, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, synopsisModal, background, modal, modalContent, data);
    } else {
        let data = "";
        createActorsModal(id, type, title, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, synopsisModal, background, modal, modalContent, data);
        document.body.style.cursor = "wait";
    }
}

async function createActorsModal(id, type, title, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, synopsisModal, background, modal, modalContent, data) {
    let actorsModalElements = document.querySelectorAll(".modalActors");
    let bdd;
    for (let actorModal of actorsModalElements) {
        actorModal.remove();
    }

    const actorsModal = document.createElement("div");
    actorsModal.classList.add("modal", "modalActors");
    actorsModal.style.display = "block";

    const actorsModalContent = document.createElement("div");
    actorsModalContent.classList.add("modal-content");
    actorsModalContent.style.backgroundColor = "#333333";
    actorsModalContent.style.boxShadow = "rgb(255, 255, 255) 1px 0 0.625rem";
    actorsModalContent.style.padding = "2rem";

    const actorsTitle = document.createElement("h4");
    actorsTitle.innerHTML = `Acteurs de ${title}`;
    actorsTitle.style.color = "white";
    actorsTitle.style.marginBottom = "1rem";
    actorsModalContent.appendChild(actorsTitle);

    type = type === "film" ? "movies" : "shows";

    if (data != "") {
        /*         if (actors.characters.length === 0) {
                    let actorsLink = document.querySelector("#actors-link");
                    actorsLink.remove();
                    document.body.style.cursor = "auto"; // Set the cursor back to default
                    return
                } */
        document.body.style.cursor = "auto"; // Set the cursor back to default

        const actorsList = document.createElement("ul");
        actorsList.style.listStyleType = "none";
        actorsList.style.padding = "0";
        actorsList.style.margin = "0";
        actorsList.style.display = "flex";
        actorsList.style.flexWrap = "wrap";
        actorsList.style.justifyContent = "center";

        for (let actor of data) {
            const actorItem = document.createElement("li");
            actorItem.style.marginBottom = "1rem";
            actorItem.style.marginRight = "1rem";

            const actorContainer = document.createElement("div");
            actorContainer.style.border = "1px solid white";
            actorContainer.style.borderRadius = "0.8rem";
            actorContainer.style.padding = "0.7rem";
            if (screen.width > 768) {
                actorContainer.style.width = "fit-content";
            }
            actorItem.appendChild(actorContainer);

            const actorLink = document.createElement("a");
            actorLink.href = "#";
            actorContainer.appendChild(actorLink);

            const actorImg = document.createElement("img");
            actorImg.src = actor.infos.poster;
            actorImg.alt = `Photo de ${actor.infos.nom}`;
            actorImg.width = 250;
            actorImg.height = 350;
            actorImg.style.borderRadius = "5%";
            actorImg.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 0.625rem";
            actorLink.appendChild(actorImg);

            const actorAuthor = document.createElement("p");
            actorAuthor.textContent = `Acteur : ${actor.infos.nom}`;
            actorAuthor.style.color = "white";
            actorAuthor.style.fontWeight = "bold";
            actorAuthor.style.marginTop = "0.5rem";
            actorAuthor.style.marginBottom = "0.5rem";
            actorContainer.appendChild(actorAuthor);

            const actorContent = document.createElement("p");
            actorContent.textContent = `Alias : ${actor.alias}`;
            actorContent.style.color = "white";
            actorContent.style.marginBottom = "0";
            actorContainer.appendChild(actorContent);

            actorsList.appendChild(actorItem);

            actorImg.style.transition = "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out";
            actorImg.addEventListener("mouseover", function () {
                actorImg.style.transform = "scale(1.03)";
                actorImg.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 1.5625rem";
            });

            actorImg.addEventListener("mouseout", function () {
                actorImg.style.transform = "scale(1)";
                actorImg.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 0.625rem";
            });

            actorImg.addEventListener("click", function () {
                bdd = true;
                if (type == "movies") {
                    createActorModal(actor, bdd, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, synopsisModal, background, modal, modalContent);
                    fetch(`https://api.betaseries.com/persons/person?id=${actor.info.id}&key=${api_key}`)
                        .then(response => response.json())
                        .then(actorInfo => createActorModal(actorInfo, bdd, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, synopsisModal, background, modal, modalContent))
                        .catch(error => console.error(error));
                } else {
                    console.log("serie")
                }
            });

        }
        actorsModalContent.appendChild(actorsList);

    } else {
        try {
            const response = await fetch(`https://api.betaseries.com/${type}/characters?key=${api_key}&id=${id}`);
            const actors = await response.json();
            for (let i = 0; i < actors.characters.length; i++) {
                let actorInfo = actors.characters[i];

                const actorResponsePlus = await fetch(`https://api.betaseries.com/persons/person?id=${actorInfo.person_id}&key=${api_key}`);
                const actorInfoPlus = await actorResponsePlus.json();
                // Définir la date de naissance de l'acteur
                const dateNaissance = new Date(actorInfoPlus.person.birthday);

                // Obtenir la date actuelle
                const dateActuelle = new Date();

                // Calculer la différence entre les deux dates en millisecondes
                const difference = dateActuelle - dateNaissance;

                // Convertir la différence en années en utilisant l'année moyenne de 365,25 jours
                const age = Math.floor(difference / (365.25 * 24 * 60 * 60 * 1000));

                // Formater la date de naissance dans le format JJ:MM:AAAA
                const jour = ('0' + dateNaissance.getDate()).slice(-2);
                const mois = ('0' + (dateNaissance.getMonth() + 1)).slice(-2);
                const annee = dateNaissance.getFullYear();
                const dateFormatee = `${jour}-${mois}-${annee}`;
                insertActorBase(actorInfo.actor, actorInfo.name, actorInfo.movie_id, age, dateFormatee, actorInfoPlus.person.poster, actorInfoPlus.person.description);
            }

            if (actors.characters.length === 0) {
                let actorsLink = document.querySelector("#actors-link");
                actorsLink.remove();
                document.body.style.cursor = "auto"; // Set the cursor back to default
                return
            }
            const actorsList = document.createElement("ul");
            actorsList.style.listStyleType = "none";
            actorsList.style.padding = "0";
            actorsList.style.margin = "0";
            actorsList.style.display = "flex";
            actorsList.style.flexWrap = "wrap";
            actorsList.style.justifyContent = "center";

            for (let actor of actors.characters) {
                let actorAvatar = null;
                let actorInfos = null;
                if (type === 'movies' && actor.person_id) {
                    const actorResponse = await fetch(`https://api.betaseries.com/persons/person?id=${actor.person_id}&key=${api_key}`);
                    const actorInfo = await actorResponse.json();
                    actorAvatar = actorInfo.person.poster;
                    actorInfos = actorInfo;
                } else if (actor.picture) {
                    actorAvatar = actor.picture;
                }

                if (actorAvatar != null) {
                    const actorItem = document.createElement("li");
                    actorItem.style.marginBottom = "1rem";
                    actorItem.style.marginRight = "1rem";

                    const actorContainer = document.createElement("div");
                    actorContainer.style.border = "1px solid white";
                    actorContainer.style.borderRadius = "0.8rem";
                    actorContainer.style.padding = "0.7rem";
                    if (screen.width > 768) {
                        actorContainer.style.width = "fit-content";
                    }
                    actorItem.appendChild(actorContainer);

                    const actorLink = document.createElement("a");
                    actorLink.href = "#";
                    actorContainer.appendChild(actorLink);

                    const actorImg = document.createElement("img");
                    actorImg.src = actorAvatar;
                    actorImg.alt = `Photo de ${actor.actor}`;
                    actorImg.width = 250;
                    actorImg.height = 350;
                    actorImg.style.borderRadius = "5%";
                    actorImg.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 0.625rem";
                    actorLink.appendChild(actorImg);

                    const actorAuthor = document.createElement("p");
                    actorAuthor.textContent = `Acteur : ${actor.actor}`;
                    actorAuthor.style.color = "white";
                    actorAuthor.style.fontWeight = "bold";
                    actorAuthor.style.marginTop = "0.5rem";
                    actorAuthor.style.marginBottom = "0.5rem";
                    actorContainer.appendChild(actorAuthor);

                    // Suppression de texte inutile dans le nom de l'acteur
                    const name = actor.name.replaceAll('Additional Voices (voice) /', '')
                        .replaceAll('/ Additional Voices', '')
                        .replaceAll('(voice)', '');

                    const actorContent = document.createElement("p");
                    actorContent.textContent = `Alias : ${name}`;
                    actorContent.style.color = "white";
                    actorContent.style.marginBottom = "0";
                    actorContainer.appendChild(actorContent);

                    actorsList.appendChild(actorItem);

                    actorImg.style.transition = "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out";
                    actorImg.addEventListener("mouseover", function () {
                        actorImg.style.transform = "scale(1.03)";
                        actorImg.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 1.5625rem";
                    });

                    actorImg.addEventListener("mouseout", function () {
                        actorImg.style.transform = "scale(1)";
                        actorImg.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 0.625rem";
                    });

                    actorImg.addEventListener("click", function () {
                        bdd = false;
                        if (type == "movies") {
                            createActorModal(actorInfos, bdd, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, synopsisModal, background, modal, modalContent);
                        } else {
                            fetch(`https://api.betaseries.com/persons/person?id=${actor.person_id}&key=${api_key}`)
                                .then(response => response.json())
                                .then(actorInfo => createActorModal(actorInfo, bdd, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, synopsisModal, background, modal, modalContent))
                                .catch(error => console.error(error));
                        }
                    });
                }
            }

            actorsModalContent.appendChild(actorsList);
        } catch (err) {
            console.error(err);
            const error = document.createElement("p");
            error.innerHTML = "Une erreur est survenue lors du chargement des acteurs.";
            error.style.color = "white";
            actorsModalContent.appendChild(error);
            document.body.style.cursor = "auto"; // Set the cursor back to default
        }
    }

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "X";
    closeBtn.classList.add("btn", "btn-danger");
    closeBtn.style.width = "2.2rem";
    closeBtn.style.float = "right";
    closeBtn.addEventListener("click", function () {
        actorsModal.style.display = "none";
    });
    actorsTitle.appendChild(closeBtn);

    actorsModal.appendChild(actorsModalContent);

    document.body.appendChild(actorsModal);

    document.body.style.cursor = "auto"; // Set the cursor back to default
    return actorsModal;
}

function createActorModal(actor, bdd, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, synopsisModal, background, modal, modalContent) {
    //console.log(actor)
    const actorModal = document.createElement("div");
    actorModal.classList.add("modal");
    actorModal.style.display = "block";

    const actorModalContent = document.createElement("div");
    actorModalContent.classList.add("modal-content");
    actorModalContent.style.backgroundColor = "#333333";
    actorModalContent.style.boxShadow = "rgb(255, 255, 255) 1px 0 0.625rem";
    actorModalContent.style.padding = "2rem";
    if (screen.width > 768) {
        actorModalContent.style.width = "50%";
    } else {
        actorModalContent.style.width = "80%";
    }

    const actorTitle = document.createElement("h4");

    if (bdd) {
        actorTitle.innerHTML = `Acteur : ${actor.infos.nom}`;
    } else {
        actorTitle.innerHTML = `Acteur : ${actor.person.name}`;
    }
    actorTitle.style.color = "white";
    actorTitle.style.marginBottom = "1rem";
    actorModalContent.appendChild(actorTitle);

    const actorContainer = document.createElement("div");
    actorContainer.style.border = "1px solid white";
    actorContainer.style.borderRadius = "0.8rem";
    actorContainer.style.padding = "0.5rem";
    if (screen.width > 768) {
        actorContainer.style.width = "fit-content";
    }
    actorModalContent.appendChild(actorContainer);

    const actorImg = document.createElement("img");
    if (bdd) {
        actorImg.src = actor.infos.poster;
        actorImg.alt = `Photo de ${actor.infos.nom}`;
    } else {
        actorImg.src = actor.person.poster;
        actorImg.alt = `Photo de ${actor.person.name}`;
    }
    if (screen.width < 768) {
        actorImg.style.width = "100%";
        actorImg.style.height = "100%";
    } else {
        actorImg.width = 400;
        actorImg.height = 550;
    }
    actorImg.style.borderRadius = "5%";
    actorContainer.appendChild(actorImg);

    const actorAge = document.createElement("p");
    if (!bdd) {
        // Définir la date de naissance de l'acteur
        const dateNaissance = new Date(actor.person.birthday);

        // Obtenir la date actuelle
        const dateActuelle = new Date();

        // Calculer la différence entre les deux dates en millisecondes
        const difference = dateActuelle - dateNaissance;

        // Convertir la différence en années en utilisant l'année moyenne de 365,25 jours
        const age = Math.floor(difference / (365.25 * 24 * 60 * 60 * 1000));

        // Formater la date de naissance dans le format JJ:MM:AAAA
        const jour = ('0' + dateNaissance.getDate()).slice(-2);
        const mois = ('0' + (dateNaissance.getMonth() + 1)).slice(-2);
        const annee = dateNaissance.getFullYear();
        const dateFormatee = `${jour}-${mois}-${annee}`;


        // Afficher l'âge et la date de naissance formatée
        if (actor.person.birthday != null && actor.person.birthday != "null" && actor.person.birthday != "") {
            actorAge.innerHTML = `<strong>Naissance :</strong> ${dateFormatee} / <strong>Age :</strong> ${age} ans`;
        } else {
            actorAge.innerHTML = `<strong>Age :</strong> Non connu`;
        }
    } else {
        // Afficher l'âge et la date de naissance formatée
        if (actor.infos.date != null && actor.infos.date != "null" && actor.infos.date != "") {
            actorAge.innerHTML = `<strong>Naissance :</strong> ${actor.infos.date} / <strong>Age :</strong> ${actor.infos.age} ans`;
        } else {
            actorAge.innerHTML = `<strong>Age :</strong> Non connu`;
        }
    }
    /* actorAge.innerHTML = `<strong>Naissance :</strong> ${dateFormatee} / <strong>Age :</strong> ${age} ans`; */
    actorAge.style.color = "white";
    actorAge.style.marginTop = "1rem";
    actorContainer.appendChild(actorAge);

    const actorDescription = document.createElement("p");
    actorDescription.style.color = "white";
    if (bdd) {
        if (actor.infos.biographie != null && actor.infos.biographie != "null" && actor.infos.biographie != "") {
            actorDescription.innerHTML = `<strong>Biographie :</strong> ${actor.infos.biographie}`;
        } else {
            actorDescription.innerHTML = `<strong>Biographie :</strong> Aucune biographie disponible`;
        }
    } else {
        if (actor.person.description != null && actor.person.description != "null" && actor.person.description != "") {
            actorDescription.innerHTML = `<strong>Biographie :</strong> ${actor.person.description}`;
        } else {
            actorDescription.innerHTML = `<strong>Biographie :</strong> Aucune biographie disponible`;
        }
    }
    /*     actorDescription != "null" ? actorDescription.innerHTML = `<strong>Biographie :</strong> ${actor.person.description}` : actorDescription.innerHTML = `<strong>Biographie :</strong> Aucune biographie disponible`; */

    actorContainer.appendChild(actorDescription);

    if (!bdd) {
        // FILMS
        if (actor.person.movies.length > 0) {
            // Liste des films dans lesquels l'acteur a joué
            const actorMoviesList = document.createElement("div");
            actorMoviesList.style.marginTop = "1rem";
            actorMoviesList.style.display = "flex";
            actorMoviesList.style.flexWrap = "wrap";
            actorMoviesList.style.padding = "1rem";
            actorMoviesList.style.border = "1px solid white";
            actorMoviesList.style.borderRadius = "0.8rem";
            actorContainer.appendChild(actorMoviesList);

            const actorMoviesTitle = document.createElement("h5");
            actorMoviesTitle.innerHTML = `Films dans lesquels ${actor.person.name} a joué :`;
            actorMoviesTitle.style.color = "white";
            actorMoviesTitle.style.marginBottom = "1rem";
            actorMoviesTitle.style.width = "100%";
            actorMoviesList.appendChild(actorMoviesTitle);


            // Parcourir l'array des films de l'acteur et ajouter chaque film à la liste
            for (let i = 0; i < actor.person.movies.length; i++) {
                if (actor.person.movies[i].movie.poster != null && actor.person.movies[i].movie.poster != "null" && actor.person.movies[i].movie.poster != "") {
                    const movie = actor.person.movies[i];
                    const movieContainer = document.createElement("div");
                    movieContainer.style.marginRight = "0.5rem";
                    actorMoviesList.appendChild(movieContainer);

                    const movieLink = document.createElement("a");
                    movieLink.href = "#";
                    movieLink.style.display = "inline-block";
                    movieLink.style.marginRight = "0.5rem";
                    movieContainer.appendChild(movieLink);

                    const moviePoster = document.createElement("img");
                    moviePoster.src = movie.movie.poster;
                    moviePoster.alt = `Affiche de ${movie.movie.title}`;
                    moviePoster.width = 150;
                    moviePoster.height = 225;
                    moviePoster.style.borderRadius = "5%";
                    moviePoster.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 0.625rem";
                    movieLink.appendChild(moviePoster);

                    const movieInfo = document.createElement("div");
                    movieContainer.appendChild(movieInfo);

                    const movieTitle = document.createElement("p");
                    movieTitle.innerHTML = `${movie.movie.title} (${movie.movie.production_year})`;
                    movieTitle.style.color = "white";
                    movieTitle.style.width = "150px";
                    movieTitle.style.marginTop = "0.5rem";
                    movieTitle.style.textAlign = "center";
                    movieContainer.appendChild(movieTitle);

                    const movieAlias = document.createElement("p");
                    // Suppression de texte inutile dans le nom de l'acteur
                    const name = movie.name.replaceAll('Additional Voices (voice) /', '')
                        .replaceAll('/ Additional Voices', '')
                        .replaceAll('(voice)', '');
                    movieAlias.innerHTML = `Alias : ${name}`;
                    movieAlias.style.color = "white";
                    movieAlias.style.marginTop = "0.5rem";
                    movieAlias.style.width = "150px";
                    movieAlias.style.textAlign = "center";
                    movieAlias.style.textDecoration = "none";
                    movieContainer.appendChild(movieAlias);


                    moviePoster.style.transition = "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out";
                    moviePoster.addEventListener("mouseover", function () {
                        moviePoster.style.transform = "scale(1.03)";
                        moviePoster.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 1.5625rem";
                    });

                    moviePoster.addEventListener("mouseout", function () {
                        moviePoster.style.transform = "scale(1)";
                        moviePoster.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 0.625rem";
                    });

                    moviePoster.addEventListener("click", function () {
                        console.log(actor.person.movies[i].movie.tmdb_id)
                        fetch(`https://api.betaseries.com/movies/movie?key=${api_key}&id=${actor.person.movies[i].movie.id}`)
                            .then(response => response.json())
                            .then(filmInfo => filmInformations(filmInfo))
                            .catch(error => console.error(error));

                        function filmInformations(filmInfo) {
                            console.log("INFO DU FILM", filmInfo);
                            let info = filmInfo.movie;
                            let note = info.notes;
                            let id = info.id;
                            let type = "movie";
                            let title = info.title;
                            let comment = info.comments;
                            let platformLink = info.platform_links;
                            let platformSvod = info.platforms_svod;
                            let year = info.production_year;
                            let trailer = info.trailer;
                            let imdb = info.imdb_id;
                            let duree = info.length;
                            let synopsis = info.synopsis;
                            let link = `https://www.g2stream.com/stream/movie?imdb=${imdb}`;
                            let genreList = [];
                            for (let i = 0; i < info.genres.length; i++) {
                                genreList.push(info.genres[i])
                            }

                            createComments(id, type, title, comment, modalContent);
                            createStars(note, modalContent, id, type, title, comment);
                            createPlatformLinks(platformLink, modalContent);
                            createSvod(platformSvod, modalContent);
                            createGoogleSearch(platformLink, platformSvod, title, type, year, modalContent);
                            modalCreation(type, title, year, trailer, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, link, imdb, synopsisModal, synopsis, duree, background, api_key, genreList);
                            modal.style.display = "block";
                            const maxZIndex = Math.max(
                                ...Array.from(document.querySelectorAll('*'))
                                    .map((el) => parseFloat(getComputedStyle(el).zIndex))
                                    .filter((z) => !isNaN(z))
                            );
                            modal.style.zIndex = maxZIndex + 1;
                            createAdminEditButton(id, filmInfo, type);

                            //Fonction de création du bouton favoris
                            createFavButton(id);
                        };
                    });
                }
            }
        }

        // SERIES
        if (actor.person.shows.length > 0) {
            // Liste des series dans lesquels l'acteur a joué
            const actorSeriesList = document.createElement("div");
            actorSeriesList.style.marginTop = "1rem";
            actorSeriesList.style.display = "flex";
            actorSeriesList.style.flexWrap = "wrap";
            actorSeriesList.style.padding = "1rem";
            actorSeriesList.style.border = "1px solid white";
            actorSeriesList.style.borderRadius = "0.8rem";
            actorContainer.appendChild(actorSeriesList);

            const actorSeriesTitle = document.createElement("h5");
            actorSeriesTitle.textContent = `Séries dans lesquels ${actor.person.name} a joué :`;
            actorSeriesTitle.style.color = "white";
            actorSeriesTitle.style.marginBottom = "1rem";
            actorSeriesTitle.style.width = "100%";
            actorSeriesList.appendChild(actorSeriesTitle);


            // Parcourir l'array des films de l'acteur et ajouter chaque film à la liste
            for (let i = 0; i < actor.person.shows.length; i++) {
                if (actor.person.shows[i].show.poster != null && actor.person.shows[i].show.poster != "null" && actor.person.shows[i].show.poster != "") {
                    const serie = actor.person.shows[i];
                    const serieContainer = document.createElement("div");
                    serieContainer.style.marginRight = "0.5rem";
                    actorSeriesList.appendChild(serieContainer);

                    const serieLink = document.createElement("a");
                    serieLink.href = "#";
                    serieLink.style.display = "inline-block";
                    serieLink.style.marginRight = "0.5rem";
                    serieContainer.appendChild(serieLink);

                    const seriePoster = document.createElement("img");
                    seriePoster.src = serie.show.poster;
                    seriePoster.alt = `Affiche de ${serie.show.title}`;
                    seriePoster.width = 150;
                    seriePoster.height = 225;
                    seriePoster.style.borderRadius = "5%";
                    seriePoster.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 0.625rem";
                    serieLink.appendChild(seriePoster);

                    const serieInfo = document.createElement("div");
                    serieContainer.appendChild(serieInfo);

                    const serieTitle = document.createElement("p");
                    serieTitle.innerHTML = `${serie.show.title} (${serie.show.creation})`;
                    serieTitle.style.color = "white";
                    serieTitle.style.width = "150px";
                    serieTitle.style.marginTop = "0.5rem";
                    serieTitle.style.textAlign = "center";
                    serieContainer.appendChild(serieTitle);

                    const serieAlias = document.createElement("p");
                    // Suppression de texte inutile dans le nom de l'acteur
                    const name = serie.name.replaceAll('Additional Voices (voice) /', '')
                        .replaceAll('/ Additional Voices', '')
                        .replaceAll('(voice)', '');
                    serieAlias.innerHTML = `Alias : ${name}`;
                    serieAlias.style.color = "white";
                    serieAlias.style.marginTop = "0.5rem";
                    serieAlias.style.width = "150px";
                    serieAlias.style.textAlign = "center";
                    serieAlias.style.textDecoration = "none";
                    serieContainer.appendChild(serieAlias);

                    seriePoster.style.transition = "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out";
                    seriePoster.addEventListener("mouseover", function () {
                        seriePoster.style.transform = "scale(1.03)";
                        seriePoster.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 1.5625rem";
                    });

                    seriePoster.addEventListener("mouseout", function () {
                        seriePoster.style.transform = "scale(1)";
                        seriePoster.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 0.625rem";
                    });

                    seriePoster.addEventListener("click", function () {
                        console.log(actor.person.shows[i].show.thetvdb_id)
                        fetch(`https://api.betaseries.com/shows/display?key=${api_key}&id=${actor.person.shows[i].show.id}`)
                            .then(response => response.json())
                            .then(serieInfo => filmInformations(serieInfo))
                            .catch(error => console.error(error));

                        function filmInformations(serieInfo) {
                            console.log(serieInfo);
                            let info = serieInfo.show;
                            let note = info.notes;
                            let id = info.id;
                            let type = "show";
                            let title = info.title;
                            let comment = info.comments;
                            let platformLink;
                            let platformSvod;
                            let year = info.creation;
                            let trailer = info.next_trailer;
                            let imdb = info.imdb_id;
                            let duree = "0";
                            let synopsis = info.description;
                            let link = `https://www.g2stream.com/stream/series?imdb=${imdb}&language=fr&sea=1&epi=1`;
                            if (info.platforms == null) {
                                platformLink = "";
                                platformSvod = "";
                            } else {
                                platformLink = "";
                                platformSvod = info.platforms.svods;
                            }

                            createComments(id, type, title, comment, modalContent);
                            createStars(note, modalContent, id, type, title, comment);
                            createPlatformLinks(platformLink, modalContent);
                            createSvod(platformSvod, modalContent);
                            createGoogleSearch(platformLink, platformSvod, title, type, year, modalContent);
                            modalCreation(type, title, year, trailer, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, link, imdb, synopsisModal, synopsis, duree, background, api_key);
                            modal.style.display = "block";
                            const maxZIndex = Math.max(
                                ...Array.from(document.querySelectorAll('*'))
                                    .map((el) => parseFloat(getComputedStyle(el).zIndex))
                                    .filter((z) => !isNaN(z))
                            );
                            console.log(maxZIndex)
                            modal.style.zIndex = maxZIndex + 1;
                            createAdminEditButton(id, serieInfo, type);

                            //Fonction de création du bouton favoris
                            createFavButton(id);
                        };
                    });


                }
            }
        }
    }

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "X";
    closeBtn.classList.add("btn", "btn-danger");
    closeBtn.style.width = "2.2rem";
    closeBtn.style.float = "right";
    closeBtn.addEventListener("click", function () {
        actorModal.style.display = "none";
    });
    actorTitle.appendChild(closeBtn);

    actorModal.appendChild(actorModalContent);

    document.body.appendChild(actorModal);

    return actorModal;

}

