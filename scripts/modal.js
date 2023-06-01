import {
  updateFilm,
  selectFilm,
  selectGenre,
  selectUserParams,
  selectProfilPictures,
  updateAvatar,
} from "./requetes.js";

let seasonsTotal = [];
export function modalCreation(
  type,
  title,
  year,
  trailer,
  backgroundModal,
  linkYtbBtn,
  videoFrame,
  modalTitle,
  seasonsSelect,
  episodesSelect,
  validateBtn,
  link,
  imdb,
  synopsisModal,
  synopsis,
  duree,
  background,
  api_key,
  genres
) {
  if (type == "film" || type == "movie") {
    modalTitle.textContent = `${title} - ${year}`;
    modalTitle.style.fontSize = "1.8rem";

    if (trailer == null) {
      backgroundModal.style.opacity = "1";
      linkYtbBtn.style.display = "block";
      videoFrame.style.display = "none";
      backgroundModal.style.display = "block";
      if (background != null && background != undefined && background != "") {
        backgroundModal.setAttribute("src", background);
      } else {
        backgroundModal.setAttribute("src", "./imgs/logo bedflix.png");
        backgroundModal.style.opacity = "0.5";
      }
      backgroundModal.style.marginTop = "1.25rem";
    } else {
      linkYtbBtn.style.display = "none";
      backgroundModal.style.display = "none";
      videoFrame.style.display = "block";
      videoFrame.setAttribute(
        "src",
        `https://www.youtube.com/embed/${trailer}`
      );
      videoFrame.style.marginTop = "1.25rem";
    }

    seasonsSelect.style.display = "none";
    episodesSelect.style.display = "none";
    validateBtn.textContent = `Streaming`;
    validateBtn.classList.remove("btn-danger");
    validateBtn.classList.add("btn-primary");
    validateBtn.style.display = "none";
    async function checkStreamFilm() {
      try {
        let url = `https://www.g2stream.com/api/status?imdb=${imdb}&type=movie`;
        const Response = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
        );
        const Data = await Response.json();
        if (Data.contents.includes("success")) {
          validateBtn.disabled = false;
          validateBtn.textContent = `Streaming`;
          validateBtn.classList.remove("btn-danger");
          validateBtn.classList.add("btn-primary");
        } else {
          validateBtn.disabled = true;
          validateBtn.textContent = `Film indisponible`;
          validateBtn.classList.remove("btn-primary");
          validateBtn.classList.add("btn-danger");
        }
        console.log(Data);
      } catch (error) {
        console.error(error);
      }
    }
    checkStreamFilm();
  } else if (type == "serie" || type == "show") {
    modalTitle.textContent = `${title} - ${year}`;
    if (trailer == null) {
      videoFrame.style.display = "none";
      linkYtbBtn.style.display = "block";
      backgroundModal.style.display = "block";
      if (background != null) {
        backgroundModal.setAttribute("src", background);
      } else {
        backgroundModal.setAttribute("src", "./imgs/logo bedflix.png");
      }
      backgroundModal.style.marginTop = "1.25rem";
    } else {
      backgroundModal.style.display = "none";
      linkYtbBtn.style.display = "none";
      videoFrame.style.display = "block";
      videoFrame.setAttribute(
        "src",
        `https://www.dailymotion.com/embed/video/${trailer}`
      );
      videoFrame.style.marginTop = "1.25rem";
    }
    seasonsSelect.style.display = "block";
    episodesSelect.style.display = "block";
    seasonsSelect.innerHTML = "";
    episodesSelect.innerHTML = "";

    let saison = 1;
    let episode = 1;
    link = link.replace(/&sea=\d+/, `&sea=1`);
    link = link.replace(/&epi=\d+/, `&epi=1`);
    validateBtn.setAttribute("data-link", link);

    async function checkSeasonsWithImdb() {
      try {
        let url = `https://api.betaseries.com/shows/display?imdb_id=${imdb}&key=${api_key}`;
        const Response = await fetch(url);
        const data = await Response.json();
        seasonsTotal = data.show.seasons_details;
        updateSeasons();
      } catch (error) {
        console.error(error);
      }
    }

    function updateSeasons() {
      for (let i = 0; i < seasonsTotal.length; i++) {
        let option = document.createElement("option");
        option.text = `Saison ${seasonsTotal[i].number}`;
        seasonsSelect.add(option);
      }
      let selectedSeason = seasonsSelect.value;
      let seasonNum = parseInt(selectedSeason.split(" ")[1]);

      for (let i = 0; i < seasonsTotal.length; i++) {
        if (seasonsTotal[i].number === seasonNum) {
          let numEpisodes = seasonsTotal[i].episodes;
          for (let j = 0; j < numEpisodes; j++) {
            let option = document.createElement("option");
            option.text = `Episode ${j + 1}`;
            episodesSelect.add(option);
          }
        }
      }
    }

    checkSeasonsWithImdb();

    function updateEpisodes() {
      episodesSelect.innerHTML = "";
      let selectedSeason = seasonsSelect.value;
      let seasonNum = parseInt(selectedSeason.split(" ")[1]);

      for (let i = 0; i < seasonsTotal.length; i++) {
        if (seasonsTotal[i].number === seasonNum) {
          let numEpisodes = seasonsTotal[i].episodes;
          for (let j = 0; j < numEpisodes; j++) {
            let option = document.createElement("option");
            option.text = `Episode ${j + 1}`;
            episodesSelect.add(option);
          }
        }
      }
    }

    seasonsSelect.addEventListener("change", function () {
      updateEpisodes(seasonsSelect);
      let selectedSeason = this.value;
      let seasonNum = parseInt(selectedSeason.split(" ")[1]);

      saison = seasonNum;
      link = link.replace(/&sea=\d+/, `&sea=${saison}`);
      link = link.replace(/&epi=\d+/, `&epi=1`);
      let selectedEpisode = episodesSelect.value;
      let episodenNum = parseInt(selectedEpisode.split(" ")[1]);
      episode = episodenNum;
      validateBtn.setAttribute("data-link", link);
      checkStream();
    });

    episodesSelect.addEventListener("change", function () {
      let selectedEpisode = this.value;
      let episodenNum = parseInt(selectedEpisode.split(" ")[1]);
      episode = episodenNum;
      link = link.replace(/&epi=\d+/, `&epi=${episode}`);
      validateBtn.setAttribute("data-link", link);
      checkStream();
    });

    //Check si l'épisode existe ou peut être lu
    async function checkStream() {
      try {
        let url = `https://www.g2stream.com/api/status?imdb=${imdb}&sea=${saison}&epi=${episode}&type=tv`;
        const Response = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
        );
        const Data = await Response.json();
        if (Data.contents.includes("success")) {
          validateBtn.disabled = false;
          validateBtn.textContent = `Streaming : Saison ${saison} Episode ${episode}`;
          validateBtn.classList.remove("btn-danger");
          validateBtn.classList.add("btn-primary");
        } else {
          validateBtn.disabled = true;
          validateBtn.textContent = `Episode indisponible`;
          validateBtn.classList.remove("btn-primary");
          validateBtn.classList.add("btn-danger");
        }
        console.log(Data);
      } catch (error) {
        console.error(error);
      }
    }
    checkStream();
  }
  validateBtn.setAttribute("data-link", link);
  linkYtbBtn.setAttribute(
    "data-link",
    `https://www.youtube.com/results?search_query=${title}+trailer+fr+`
  );
  synopsisModal.textContent = synopsis;

  if (type == "film" && duree != 0) {
    let dureeFilm = document.createElement("p");
    dureeFilm.classList.add("dureeFilm");
    synopsisModal.appendChild(dureeFilm);

    const secondes = duree;
    const heures = Math.floor(secondes / 3600); // Nombre d'heures
    const minutes = Math.floor((secondes % 3600) / 60); // Nombre de minutes
    let temps = "";
    minutes == 0 ? (temps = `${heures}h`) : (temps = `${heures}h${minutes}`);
    dureeFilm.innerHTML = `<strong>Durée du film</strong> : ${temps}`;
  } else {
    let deleteDureeFilm = document.getElementsByClassName("dureeFilm");
    if (deleteDureeFilm.length > 0) {
      deleteDureeFilm[0].remove();
    }
  }

/*   console.log("GENRES", genres); */
  const chaine = genres;
  const nouvelleChaine = chaine.join(",");
  const genresFormat = nouvelleChaine.replace(/,/g, " - ");

  let genreFilm = document.createElement("p");
  genreFilm.classList.add("genreFilm");
  /*   genreFilm.textContent = `Genres : ${genresFormat}`; */
  genreFilm.innerHTML = `<strong>Genres</strong> : ${genresFormat}`;
  synopsisModal.appendChild(genreFilm);

  //validateBtn.style.display = "none";
}

export function createEditAdminModal(mediaInfo) {
  //Récuperation des infos du film depuis la BDD
  selectFilm(mediaInfo.id);
  selectGenre("Action");
}

export function addFromBdd(mediaInfo) {
  console.log("MEDIA INFO BDD", mediaInfo);

  const editAdminModal = document.createElement("div");
  editAdminModal.classList.add("modal", "adminModal");
  editAdminModal.style.display = "block";
  const maxZIndex = Math.max(
    ...Array.from(document.querySelectorAll("*"))
      .map((el) => parseFloat(getComputedStyle(el).zIndex))
      .filter((z) => !isNaN(z))
  );

  editAdminModal.style.zIndex = maxZIndex + 1;

  const editAdminModalContent = document.createElement("div");
  editAdminModalContent.classList.add("modal-content");
  editAdminModalContent.style.backgroundColor = "#333333";
  editAdminModalContent.style.boxShadow = "rgb(255, 255, 255) 1px 0 0.625rem";
  editAdminModalContent.style.padding = "2rem";

  if (mediaInfo.type == "movie" || mediaInfo.type == "film") {
    const modalTitle = document.createElement("h4");
    let nameFilm;
    if (mediaInfo.titre_fr != "") {
      nameFilm = mediaInfo.titre_fr;
    } else {
      nameFilm = mediaInfo.titre;
    }
    modalTitle.textContent = `Modification de ${nameFilm}`;
    modalTitle.style.color = "white";
    modalTitle.style.marginBottom = "1rem";
    modalTitle.style.borderBottom = "1px solid white";
    modalTitle.style.paddingBottom = "1rem";
    editAdminModalContent.appendChild(modalTitle);

    const pTitleOriginal = document.createElement("h5");
    pTitleOriginal.textContent = `Titre Original :`;
    pTitleOriginal.style.color = "orange";
    editAdminModalContent.appendChild(pTitleOriginal);

    const mediaTitleOriginal = document.createElement("input");
    mediaTitleOriginal.classList.add("editBtnsAdmin", "mediaTitleOriginal");
    mediaTitleOriginal.value = mediaInfo.titre;
    mediaTitleOriginal.style.marginBottom = "1rem";
    editAdminModalContent.appendChild(mediaTitleOriginal);

    const pTitleFr = document.createElement("h5");
    pTitleFr.textContent = `Titre Français:`;
    pTitleFr.style.color = "orange";
    editAdminModalContent.appendChild(pTitleFr);

    const mediaTitleFr = document.createElement("input");
    if (mediaInfo.titre_fr != "") {
      mediaTitleFr.value = mediaInfo.titre_fr;
    } else {
      mediaTitleFr.value = "";
    }
    mediaTitleFr.classList.add("editBtnsAdmin", "mediaTitleFr");
    mediaTitleFr.style.marginBottom = "1rem";
    editAdminModalContent.appendChild(mediaTitleFr);

    const pId = document.createElement("h5");
    pId.textContent = `ID :`;
    pId.style.color = "orange";
    editAdminModalContent.appendChild(pId);

    const mediaId = document.createElement("input");
    mediaId.classList.add("editBtnsAdmin", "mediaId");
    mediaId.value = mediaInfo.id_du_media;
    mediaId.disabled = true;
    mediaId.style.marginBottom = "1rem";
    editAdminModalContent.appendChild(mediaId);

    const pImdb = document.createElement("h5");
    pImdb.textContent = `IMDB :`;
    pImdb.style.color = "orange";
    editAdminModalContent.appendChild(pImdb);

    const mediaImdb = document.createElement("input");
    mediaImdb.classList.add("editBtnsAdmin", "mediaImdb");
    mediaImdb.value = mediaInfo.imdb;
    mediaImdb.disabled = true;
    mediaImdb.style.marginBottom = "1rem";
    editAdminModalContent.appendChild(mediaImdb);

    const pAnnee = document.createElement("h5");
    pAnnee.textContent = `Année :`;
    pAnnee.style.color = "orange";
    editAdminModalContent.appendChild(pAnnee);

    const mediaAnnee = document.createElement("input");
    mediaAnnee.classList.add("editBtnsAdmin", "mediaAnnee");
    mediaAnnee.value = mediaInfo.annee;
    mediaAnnee.style.marginBottom = "1rem";
    editAdminModalContent.appendChild(mediaAnnee);

    const pBa = document.createElement("h5");
    pBa.textContent = `Bande-Annonce :`;
    pBa.style.color = "orange";
    editAdminModalContent.appendChild(pBa);

    const mediaBa = document.createElement("input");
    mediaBa.classList.add("editBtnsAdmin", "mediaBa");
    mediaBa.value = mediaInfo.ba;
    mediaBa.style.marginBottom = "1rem";
    editAdminModalContent.appendChild(mediaBa);

    const pSynopsis = document.createElement("h5");
    pSynopsis.textContent = `Synopsis :`;
    pSynopsis.style.color = "orange";
    editAdminModalContent.appendChild(pSynopsis);

    const mediaSynopsis = document.createElement("textarea");
    mediaSynopsis.classList.add("editBtnsAdmin", "mediaSynopsis");
    mediaSynopsis.value = mediaInfo.synopsis;
    mediaSynopsis.style.height = "auto";
    mediaSynopsis.style.minHeight = "100px";
    mediaSynopsis.style.maxHeight = "300px";
    mediaSynopsis.style.resize = "vertical";
    mediaSynopsis.style.marginBottom = "1rem";
    editAdminModalContent.appendChild(mediaSynopsis);

    const pDuree = document.createElement("h5");
    pDuree.textContent = `Durée :`;
    pDuree.style.color = "orange";
    editAdminModalContent.appendChild(pDuree);

    const mediaDuree = document.createElement("input");
    mediaDuree.classList.add("editBtnsAdmin", "mediaDuree");
    mediaDuree.value = mediaInfo.duree;
    mediaDuree.style.marginBottom = "1rem";
    editAdminModalContent.appendChild(mediaDuree);

    const pPoster = document.createElement("h5");
    pPoster.textContent = `Poster :`;
    pPoster.style.color = "orange";
    editAdminModalContent.appendChild(pPoster);

    const mediaPoster = document.createElement("input");
    mediaPoster.classList.add("editBtnsAdmin", "mediaPoster");
    mediaPoster.value = mediaInfo.poster;
    mediaPoster.style.marginBottom = "1rem";
    editAdminModalContent.appendChild(mediaPoster);

    const pBackdrop = document.createElement("h5");
    pBackdrop.textContent = `Affiche :`;
    pBackdrop.style.color = "orange";
    editAdminModalContent.appendChild(pBackdrop);

    const mediaBackdrop = document.createElement("input");
    mediaBackdrop.classList.add("editBtnsAdmin", "mediaBackdrop");
    mediaBackdrop.value = mediaInfo.affiche;
    mediaBackdrop.style.marginBottom = "1rem";
    editAdminModalContent.appendChild(mediaBackdrop);

    const pGenre = document.createElement("h5");
    pGenre.textContent = `Genres :`;
    pGenre.style.color = "orange";
    editAdminModalContent.appendChild(pGenre);

    const mediaGenre = document.createElement("input");
    mediaGenre.classList.add("editBtnsAdmin", "mediaGenre");
    mediaGenre.value = mediaInfo.genre;
    mediaGenre.style.marginBottom = "1rem";
    editAdminModalContent.appendChild(mediaGenre);

    /* if (mediaInfo.platforms_svod.length > 0) {
            const pSvod = document.createElement("h5")
            pSvod.textContent = `SVODS :`;
            pSvod.style.color = "orange";
            pSvod.style.marginBottom = "1rem";
            editAdminModalContent.appendChild(pSvod);

            mediaInfo.platforms_svod.forEach(function (platform) {
                const pSvodTitle = document.createElement("p")
                pSvodTitle.textContent = `SVOD ${platform.name} :`;
                pSvodTitle.style.color = "white";
                pSvodTitle.style.marginBottom = "1rem";
                editAdminModalContent.appendChild(pSvodTitle);

                const mediaSVODS = document.createElement("input");
                mediaSVODS.value = platform.link_url;
                mediaSVODS.style.marginBottom = "1rem";
                editAdminModalContent.appendChild(mediaSVODS);
            });

        } */

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Valider";
    saveBtn.classList.add("btn", "btn-success");
    saveBtn.addEventListener("click", function () {
      //requete("filmComplet");
      //insererFilm();
      updateFilm();
    });

    editAdminModalContent.appendChild(saveBtn);

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "X";
    closeBtn.classList.add("btn", "btn-danger");
    closeBtn.style.width = "2.2rem";
    closeBtn.style.float = "right";
    closeBtn.addEventListener("click", function () {
      let deleteBtns = document.querySelectorAll(".editBtnsAdmin");
      for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].remove();
      }
      editAdminModal.style.display = "none";
    });
    modalTitle.appendChild(closeBtn);
  }
  editAdminModal.appendChild(editAdminModalContent);
  document.body.appendChild(editAdminModal);
}

let paramsUsers = document.getElementById("userParams");
paramsUsers.addEventListener("click", function () {
  //Récuperation des infos de l'utilisateur depuis la BDD
  selectUserParams();
});

let activePopUp = false;
function displayPopUp(style, text, time) {
  if (activePopUp == false) {
    activePopUp = true;
    let divPopUp = document.createElement("div");
    divPopUp.classList.add("pop-up");
    divPopUp.style.position = "absolute";
    divPopUp.style.padding = "1rem";
    divPopUp.style.top = "10vh";
    divPopUp.style.left = "50%";
    divPopUp.style.transform = "translateX(-50%)";
    divPopUp.style.maxWidth = "20%";
    divPopUp.style.width = "fit-content";
    divPopUp.style.height = "fit-content";
    style == "success"
      ? (divPopUp.style.backgroundColor = "rgba(25,135,84,1)")
      : (divPopUp.style.backgroundColor = "rgba(255,0,0,1)");
    const maxZIndex = Math.max(
      ...Array.from(document.querySelectorAll("*"))
        .map((el) => parseFloat(getComputedStyle(el).zIndex))
        .filter((z) => !isNaN(z))
    );

    divPopUp.style.zIndex = maxZIndex + 1;
    document.body.appendChild(divPopUp);

    let divPopUpContent = document.createElement("div");
    divPopUpContent.classList.add("pop-up-content");
    divPopUp.appendChild(divPopUpContent);

    let pPopUp = document.createElement("p");
    pPopUp.textContent = text;
    pPopUp.style.color = "white";
    pPopUp.style.marginBottom = "0";
    divPopUpContent.appendChild(pPopUp);

    document.body.querySelector(".saveUserInfoBtn").disabled = true;

    setTimeout(() => {
      divPopUp.style.opacity = 0;
      divPopUp.style.transition = "opacity 0.3s ease-in-out";
      document.body.querySelector(".saveUserInfoBtn").disabled = false;
      activePopUp = false;
    }, time);
  }
}

export function createModalUserParams(userInfo) {
  const userParamsModal = document.createElement("div");
  userParamsModal.classList.add("modal", "userParamsModal");
  userParamsModal.style.display = "block";
  const maxZIndex = Math.max(
    ...Array.from(document.querySelectorAll("*"))
      .map((el) => parseFloat(getComputedStyle(el).zIndex))
      .filter((z) => !isNaN(z))
  );

  userParamsModal.style.zIndex = maxZIndex + 1;

  const userParamsModalContent = document.createElement("div");
  userParamsModalContent.classList.add("modal-content");
  if (screen.width < 768) {
    userParamsModalContent.style.width = "90%";
  } else {
    userParamsModalContent.style.width = "30%";
  }
  userParamsModalContent.style.backgroundColor = "#333333";
  userParamsModalContent.style.boxShadow = "rgb(255, 255, 255) 1px 0 0.625rem";
  userParamsModalContent.style.padding = "2rem";

  const modalTitle = document.createElement("h4");
  modalTitle.textContent = `Paramètres de votre compte`;
  modalTitle.style.color = "white";
  modalTitle.style.textShadow = "1px 1px 1px red";
  modalTitle.style.marginBottom = "1rem";
  modalTitle.style.borderBottom = "1px solid white";
  modalTitle.style.paddingBottom = "1rem";
  userParamsModalContent.appendChild(modalTitle);

  const userParamsForm = document.createElement("form");
  //userParamsForm.classList.add("userParamsForm");
  //userParamsForm.setAttribute("action", "../Bedflix/fonctions/update_user.php");
  //userParamsForm.setAttribute("method", "POST");
  userParamsModalContent.appendChild(userParamsForm);

  const pFirstname = document.createElement("h5");
  pFirstname.textContent = `Prénom :`;
  pFirstname.style.color = "orange";
  userParamsForm.appendChild(pFirstname);

  const pFirstnameSmall = document.createElement("small");
  pFirstnameSmall.classList.add("pUserSmall", "ms-2");
  pFirstnameSmall.style.color = "red";
  pFirstname.appendChild(pFirstnameSmall);

  const userFirstname = document.createElement("input");
  userFirstname.value = userInfo.prenom;
  userFirstname.classList.add("userFirstname", "w-100");
  userFirstname.setAttribute("name", "prenom");
  userFirstname.style.marginBottom = "1rem";
  userParamsForm.appendChild(userFirstname);

  const pLastname = document.createElement("h5");
  pLastname.textContent = `Nom :`;
  pLastname.style.color = "orange";
  userParamsForm.appendChild(pLastname);

  const pLastnameSmall = document.createElement("small");
  pLastnameSmall.classList.add("pUserSmall", "ms-2");
  pLastnameSmall.style.color = "red";
  pLastname.appendChild(pLastnameSmall);

  const userName = document.createElement("input");
  userName.value = userInfo.nom;
  userName.classList.add("userLastname", "w-100");
  userName.setAttribute("name", "nom");
  userName.style.marginBottom = "1rem";
  userParamsForm.appendChild(userName);

  const pEmail = document.createElement("h5");
  pEmail.textContent = `Email :`;
  pEmail.style.color = "orange";
  userParamsForm.appendChild(pEmail);

  const pEmailSmall = document.createElement("small");
  pEmailSmall.classList.add("pUserSmall", "ms-2");
  pEmailSmall.style.color = "red";
  pEmail.appendChild(pEmailSmall);

  const userEmail = document.createElement("input");
  userEmail.value = userInfo.email;
  userEmail.classList.add("userEmail", "w-100");
  userEmail.setAttribute("name", "email");
  userEmail.style.marginBottom = "1rem";
  userParamsForm.appendChild(userEmail);

  const pNickname = document.createElement("h5");
  pNickname.textContent = `Pseudo :`;
  pNickname.style.color = "orange";
  userParamsForm.appendChild(pNickname);

  const pNicknameSmall = document.createElement("small");
  pNicknameSmall.classList.add("pUserSmall", "ms-2");
  pNicknameSmall.style.color = "red";
  pNickname.appendChild(pNicknameSmall);

  const userNickname = document.createElement("input");
  userNickname.value = userInfo.pseudo;
  userNickname.classList.add("userNickname", "w-100");
  userNickname.setAttribute("name", "pseudo");
  userNickname.style.marginBottom = "1rem";
  userParamsForm.appendChild(userNickname);

  const pPasswordActuel = document.createElement("h5");
  pPasswordActuel.textContent = `Mot de passe actuel :`;
  pPasswordActuel.style.color = "orange";
  userParamsForm.appendChild(pPasswordActuel);

  const pPasswordActuelSmall = document.createElement("small");
  pPasswordActuelSmall.classList.add("pUserSmall", "ms-2");
  pPasswordActuelSmall.style.color = "red";
  pPasswordActuel.appendChild(pPasswordActuelSmall);

  const userPasswordActuel = document.createElement("input");
  userPasswordActuel.setAttribute("type", "password");
  userPasswordActuel.classList.add("userPasswordActuel", "w-100");
  userPasswordActuel.setAttribute("name", "passwordActuel");
  userPasswordActuel.style.marginBottom = "1rem";
  userParamsForm.appendChild(userPasswordActuel);

  const pPassword = document.createElement("h5");
  pPassword.textContent = `Nouveau mot de passe (facultatif): `;
  pPassword.style.color = "orange";
  userParamsForm.appendChild(pPassword);

  const pPasswordSmall = document.createElement("small");
  pPasswordSmall.classList.add("pUserSmall", "ms-2");
  pPasswordSmall.style.color = "red";
  pPassword.appendChild(pPasswordSmall);

  const userPassword = document.createElement("input");
  userPassword.setAttribute("type", "password");
  userPassword.classList.add("userPassword", "w-100");
  userPassword.setAttribute("name", "password");
  userPassword.style.marginBottom = "1rem";
  userParamsForm.appendChild(userPassword);

  const pPasswordConfirm = document.createElement("h5");
  pPasswordConfirm.textContent = `Confirmer le mot de passe (facultatif): `;
  pPasswordConfirm.style.color = "orange";
  userParamsForm.appendChild(pPasswordConfirm);

  const pPasswordConfirmSmall = document.createElement("small");
  pPasswordConfirmSmall.classList.add("pUserSmall", "ms-2");
  pPasswordConfirmSmall.style.color = "red";
  pPasswordConfirm.appendChild(pPasswordConfirmSmall);

  const userPasswordConfirm = document.createElement("input");
  userPasswordConfirm.setAttribute("type", "password");
  userPasswordConfirm.classList.add("userPasswordConfirm", "w-100");
  userPasswordConfirm.setAttribute("name", "passwordConfirm");
  userPasswordConfirm.style.marginBottom = "1rem";
  userParamsForm.appendChild(userPasswordConfirm);

  const saveUserInfoBtn = document.createElement("button");
  saveUserInfoBtn.textContent = "Sauvegarder";
  //saveUserInfoBtn.setAttribute("type", "submit");
  saveUserInfoBtn.classList.add(
    "btn",
    "btn-success",
    "w-100",
    "saveUserInfoBtn"
  );
  saveUserInfoBtn.style.marginBottom = "1rem";
  saveUserInfoBtn.addEventListener("click", function (e) {
    const elements = document.querySelectorAll(".pUserSmall");
    elements.forEach((element) => {
      element.textContent = "";
    });
    //console.log(avatarUserBtn.getAttribute("src"));
    changerDonnees(e);
  });
  userParamsForm.appendChild(saveUserInfoBtn);

  async function changerDonnees(e) {
    e.preventDefault();

    const url = avatarUserBtn.getAttribute("src");
    const prefix = "../Bedflix/imgs/avatars/";
    const imageName = url.substring(prefix.length);
    //console.log(imageName);

    var formData = new FormData();
    formData.append("prenom", userFirstname.value);
    formData.append("nom", userName.value);
    formData.append("email", userEmail.value);
    formData.append("pseudo", userNickname.value);
    formData.append("passwordActuel", userPasswordActuel.value);
    formData.append("password", userPassword.value);
    formData.append("passwordConfirm", userPasswordConfirm.value);
    formData.append("photo_profil", imageName);

    await fetch("../Bedflix/fonctions/update_user.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((result) => {
        if (result == "Erreur 1") {
          console.log("Une erreur est survenue.");
        } else if (result == "Erreur 2") {
          pPasswordActuelSmall.textContent = "Requis";
          displayPopUp("error", "Le mot de passe est requis.", "5000");
        } else if (result == "Erreur 3") {
          pPasswordActuelSmall.textContent = "Incorrect";
          displayPopUp("error", "Le mot de passe est incorrect.", "5000");
        } else if (result == "Erreur 4") {
          pEmailSmall.textContent = "Invalide";
          displayPopUp("error", "L'email est invalide.", "5000");
        } else if (result == "Erreur 5") {
          pNicknameSmall.textContent = "Invalide";
          displayPopUp(
            "error",
            "Le pseudo doit contenir au moins 3 caractères et ne doit contenir que des lettres et des espaces.",
            "5000"
          );
        } else if (result == "Erreur 6") {
          pLastnameSmall.textContent = "Invalide";
          displayPopUp(
            "error",
            "Le nom doit contenir au moins 2 caractères et ne doit contenir que des lettres et des espaces.",
            "5000"
          );
        } else if (result == "Erreur 7") {
          pFirstnameSmall.textContent = "Invalide";
          displayPopUp(
            "error",
            "Le prénom doit contenir au moins 2 caractères et ne doit contenir que des lettres et des espaces.",
            "5000"
          );
        } else if (result == "Erreur 8") {
          pPasswordSmall.textContent = "Invalide";
          displayPopUp(
            "error",
            "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial.",
            "5000"
          );
        } else if (result == "Erreur 9") {
          pPasswordConfirmSmall.textContent = "Invalide";
          displayPopUp(
            "error",
            "Les mots de passe ne correspondent pas.",
            "5000"
          );
        } else {
          displayPopUp(
            "success",
            "Vos informations ont été modifiées avec succès.",
            "3000"
          );
        }
      });
  }

  const deleteUserBtn = document.createElement("button");
  deleteUserBtn.textContent = "Supprimer mon compte";
  deleteUserBtn.classList.add("btn", "btn-danger", "mb-3");
  deleteUserBtn.addEventListener("click", function () {
    deleteUserModal();
  });
  userParamsModalContent.appendChild(deleteUserBtn);

  const giveInfos = document.createElement("a");
  giveInfos.textContent = "Demander mes informations.";
  giveInfos.setAttribute("href", "#");
  giveInfos.style.width = "fit-content";
  giveInfos.style.color = "white";
  giveInfos.style.textDecoration = "none";
  userParamsModalContent.appendChild(giveInfos);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "X";
  closeBtn.classList.add("btn", "btn-danger");
  closeBtn.style.width = "2.2rem";
  closeBtn.style.float = "right";
  closeBtn.addEventListener("click", function () {
    userParamsModal.style.display = "none";
  });
  modalTitle.appendChild(closeBtn);

  const avatarUserBtn = document.createElement("img");
  avatarUserBtn.setAttribute(
    "src",
    "../Bedflix/imgs/avatars/" + userInfo.photo_profil
  );
  avatarUserBtn.classList.add("avatarUserBtn", "avatar", "me-3");
  avatarUserBtn.setAttribute("alt", userInfo.photo_profil);
  avatarUserBtn.style.float = "right";
  avatarUserBtn.style.width = "2.5rem";
  avatarUserBtn.style.height = "2.5rem";
  avatarUserBtn.style.cursor = "pointer";
  avatarUserBtn.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 0.625rem";
  avatarUserBtn.addEventListener("click", function () {
    selectProfilPictures(userInfo.photo_profil);
  });
  avatarUserBtn.addEventListener("mouseenter", function () {
    avatarUserBtn.style.transform = "scale(1.1)";
    avatarUserBtn.style.transition = "transform 200ms ease-in-out";
    avatarUserBtn.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 1.0rem";
  });
  avatarUserBtn.addEventListener("mouseleave", function () {
    avatarUserBtn.style.transform = "scale(1)";
    avatarUserBtn.style.transition =
      "transform 200ms ease-in-out, boxShadow 200ms ease-in-out, opacity 200ms ease-in-out";
    avatarUserBtn.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 0.625rem";
  });
  modalTitle.appendChild(avatarUserBtn);

  userParamsModal.appendChild(userParamsModalContent);
  document.body.appendChild(userParamsModal);
}

export function createAvatarModal(userPicture, data) {
  const avatarModal = document.createElement("div");
  avatarModal.classList.add("modal", "avatarModal");
  avatarModal.style.display = "block";
  const maxZIndex = Math.max(
    ...Array.from(document.querySelectorAll("*"))
      .map((el) => parseFloat(getComputedStyle(el).zIndex))
      .filter((z) => !isNaN(z))
  );

  avatarModal.style.zIndex = maxZIndex + 1;

  const avatarModalContent = document.createElement("div");
  avatarModalContent.classList.add("modal-content");
  if (screen.width < 768) {
    avatarModalContent.style.width = "90%";
  } else {
    avatarModalContent.style.width = "55%";
  }
  avatarModalContent.style.backgroundColor = "#333333";
  avatarModalContent.style.boxShadow = "rgb(255, 255, 255) 1px 0 0.625rem";
  avatarModalContent.style.padding = "2rem";
  avatarModal.appendChild(avatarModalContent);

  const modalTitle = document.createElement("h3");
  modalTitle.textContent = "Choisissez un avatar";
  modalTitle.style.color = "white";
  modalTitle.style.textShadow = "1px 1px 1px red";
  modalTitle.style.marginBottom = "1rem";
  modalTitle.style.borderBottom = "1px solid white";
  modalTitle.style.paddingBottom = "1rem";

  avatarModalContent.appendChild(modalTitle);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "X";
  closeBtn.classList.add("btn", "btn-danger");
  closeBtn.style.width = "2.2rem";
  closeBtn.style.float = "right";
  closeBtn.addEventListener("click", function () {
    avatarModal.style.display = "none";
  });
  modalTitle.appendChild(closeBtn);

  const myAvatar = document.createElement("img");
  myAvatar.setAttribute("src", "../Bedflix/imgs/avatars/" + userPicture);
  myAvatar.classList.add("userAvatar", "avatar", "me-3");
  myAvatar.setAttribute("alt", userPicture);
  myAvatar.style.width = "2.5rem";
  myAvatar.style.height = "2.5rem";
  myAvatar.style.float = "right";
  modalTitle.appendChild(myAvatar);

  // group images by categories using an object
  const categories = {};
  for (let i = 0; i < data.length; i++) {
    const category = data[i].categorie;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(data[i]);
    categories[category].sort((a, b) => a.nom.localeCompare(b.nom));
  }

  // iterate through the object and create a div for each category
  for (const category in categories) {
    const divCategory = document.createElement("div");
    divCategory.classList.add("category");
    avatarModalContent.appendChild(divCategory);

    const categoryTitle = document.createElement("h3");
    categoryTitle.innerText = category;
    categoryTitle.style.color = "white";
    categoryTitle.style.textShadow = "1px 1px 1px red";
    divCategory.appendChild(categoryTitle);

    const images = categories[category];
    for (let i = 0; i < images.length; i++) {
      const divImg = document.createElement("div");
      divImg.classList.add("divImg");
      divImg.style.display = "inline-block";
      if (screen.width < 768) {
        divImg.style.marginBottom = "1rem";
      } else {
        divImg.style.margin = "1rem";
      }
      divImg.style.border = "1px solid white";
      divImg.style.borderRadius = "0.5rem";
      divCategory.appendChild(divImg);

      const avatar1 = document.createElement("img");
      avatar1.setAttribute("src", `../Bedflix/imgs/avatars/${images[i].url}`);
      avatar1.setAttribute("alt", images[i].url);
      avatar1.classList.add("avatar", "mb-3");
      avatar1.style.width = "10rem";
      avatar1.style.height = "10rem";
      avatar1.style.cursor = "pointer";
      avatar1.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 0.625rem";
      divImg.appendChild(avatar1);

      const nameAvatar = document.createElement("p");
      nameAvatar.innerText = images[i].nom;
      nameAvatar.style.color = "white";
      nameAvatar.style.textAlign = "center";
      nameAvatar.style.marginBottom = "1rem";
      nameAvatar.style.paddingBottom = "1rem";
      divImg.appendChild(nameAvatar);

      // add event listeners for the image
      avatar1.addEventListener("click", function () {
        myAvatar.setAttribute(
          "src",
          `../Bedflix/imgs/avatars/${images[i].url}`
        );
        document.body
          .querySelector(".avatarUserBtn")
          .setAttribute("src", `../Bedflix/imgs/avatars/${images[i].url}`);
        document.body
          .querySelector("#avatar")
          .setAttribute("src", `../Bedflix/imgs/avatars/${images[i].url}`);
        displayPopUp("success", "Avatar modifié avec succès !", "3000");
        const url = avatar1.getAttribute("src");
        const prefix = "../Bedflix/imgs/avatars/";
        const imageName = url.substring(prefix.length);
        updateAvatar(imageName);
      });

      avatar1.addEventListener("mouseenter", function () {
        avatar1.style.transform = "scale(0.95)";
        avatar1.style.transition = "transform 200ms ease-in-out";
        avatar1.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 1.0rem";
      });

      avatar1.addEventListener("mouseleave", function () {
        avatar1.style.transform = "scale(1)";
        avatar1.style.transition =
          "transform 200ms ease-in-out, boxShadow 200ms ease-in-out, opacity 200ms ease-in-out";
        avatar1.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 0.625rem";
      });
    }
  }

  document.body.appendChild(avatarModal);
}

function deleteUserModal() {
  const deleteUserModal = document.createElement("div");
  deleteUserModal.classList.add("modal", "deleteUserModal");
  deleteUserModal.style.display = "block";
  const maxZIndex = Math.max(
    ...Array.from(document.querySelectorAll("*"))
      .map((el) => parseFloat(getComputedStyle(el).zIndex))
      .filter((z) => !isNaN(z))
  );

  deleteUserModal.style.zIndex = maxZIndex + 1;

  const deleteUserModalContent = document.createElement("div");
  deleteUserModalContent.classList.add("modal-content");
  deleteUserModalContent.style.width = "30%";
  deleteUserModalContent.style.backgroundColor = "#333333";
  deleteUserModalContent.style.boxShadow = "rgb(255, 255, 255) 1px 0 0.625rem";
  deleteUserModalContent.style.padding = "2rem";
  deleteUserModal.appendChild(deleteUserModalContent);

  const modalTitle = document.createElement("h4");
  modalTitle.textContent = `Suppression de votre compte`;
  modalTitle.style.color = "white";
  modalTitle.style.textShadow = "1px 1px 1px red";
  modalTitle.style.marginBottom = "1rem";
  modalTitle.style.borderBottom = "1px solid white";
  modalTitle.style.paddingBottom = "1rem";
  deleteUserModalContent.appendChild(modalTitle);

  const pPswd = document.createElement("h5");
  pPswd.textContent = `Mot de passe :`;
  pPswd.style.color = "orange";
  deleteUserModalContent.appendChild(pPswd);

  const deleteForm = document.createElement("form");
  deleteForm.setAttribute("action", "../Bedflix/fonctions/deleteuser.php");
  deleteForm.setAttribute("method", "POST");
  deleteUserModalContent.appendChild(deleteForm);

  const inputPswd = document.createElement("input");
  inputPswd.setAttribute("type", "password");
  inputPswd.setAttribute("name", "password");
  inputPswd.classList.add("userPassword", "w-100");
  inputPswd.setAttribute("placeholder", "Votre mot de passe");
  inputPswd.style.marginBottom = "1rem";
  deleteForm.appendChild(inputPswd);

  const pDeleteBtn = document.createElement("small");
  pDeleteBtn.textContent =
    "Attention la suppresion de votre compte est irréverssible, vous perdrez vos favoris !";
  pDeleteBtn.style.color = "orange";
  deleteForm.appendChild(pDeleteBtn);

  const deleteUserBtn = document.createElement("button");
  deleteUserBtn.textContent = "Supprimer mon compte";
  deleteUserBtn.classList.add("btn", "btn-danger", "w-100");
  deleteUserBtn.setAttribute("type", "submit");
  deleteUserBtn.disabled = "true";
  deleteForm.appendChild(deleteUserBtn);

  let timeLeft = 10;
  const countdown = setInterval(() => {
    timeLeft--;
    if (timeLeft === 0) {
      clearInterval(countdown);
      deleteUserBtn.disabled = false; // activer le bouton à la fin du compte à rebours
      deleteUserBtn.textContent = `Supprimer mon compte`;
    } else {
      deleteUserBtn.textContent = `Supprimer mon compte (${timeLeft})`;
    }
  }, 1000);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "X";
  closeBtn.classList.add("btn", "btn-danger");
  closeBtn.style.width = "2.2rem";
  closeBtn.style.float = "right";
  closeBtn.addEventListener("click", function () {
    deleteUserModal.style.display = "none";
  });
  modalTitle.appendChild(closeBtn);
  document.body.appendChild(deleteUserModal);
}
