import {
  createPlatformLinks,
  createSvod,
  createGoogleSearch,
  createStars,
  createComments,
  createActors,
  getSimilarMovies,
  getSimilarShows
} from './createPlatforms.js';
import { modalCreation, createEditAdminModal } from './modal.js';
//import { createCarousel } from './createCarousel.js'
import { afficherPopUp, cacherPopUp } from './popUp.js';
import {
  insererFilm,
  insererSerie,
  selectUserById,
  addFav,
  checkFav,
  addFilmVu,
  checkFilmVu,
  setComments,
} from "./requetes.js";

let searchResults = JSON.parse(sessionStorage.getItem("searchResults")); //films
let searchResults2 = JSON.parse(sessionStorage.getItem("searchResults2")); //series
let searchResults3 = JSON.parse(sessionStorage.getItem("searchResults3")); //Dropdown trailer ou all

let searchResultsDropdown = JSON.parse(
  sessionStorage.getItem("searchResultsDropdown")
);
let searchResultsDropdownSelectText = JSON.parse(
  sessionStorage.getItem("searchResultsDropdownSelectText")
);
let searchResultsDropdownSelect = JSON.parse(
  sessionStorage.getItem("searchResultsDropdownSelect")
);
let searchResultsDropdownSelectNews = JSON.parse(
  sessionStorage.getItem("searchResultsDropdownSelectNews")
);

//console.log("Films : ", searchResults);
//console.log("Series : ", searchResults2);
//console.log("Value du dropdown : ", searchResultsDropdown);
//console.log("Value du dropdownSelect : ", searchResultsDropdownSelectText);
//console.log("Films aléatoires : ", searchResultsDropdownSelect);
//console.log("Series aléatoires : ", searchResultsDropdownSelectNews);

//AFFICHE LES FILMS/SERIES SIMILAIRE
//https://api.betaseries.com/movies/similars?key=${api_key}&id=${id}&details=true
//https://api.betaseries.com/shows/similars?key=${api_key}&id=${id}&details=true

//LISTE DE TOUS LES FILMS LES PLUS POPULAIRES :
//https://api.betaseries.com/movies/list?key=3cd5a087f940&order=popularity&limit=100

//LISTE DE TOUS LES FILMS LES PLUS RECENTS :
//https://api.betaseries.com/movies/list?key=3cd5a087f940

//AFFICHE 5 FILMS LES PLUS RECENTS
//https://api.betaseries.com/movies/list?key=3cd5a087f940&order=recent&limit=5

//AFFICHE 5 SERIES LES PLUS RECENTS
//https://api.betaseries.com/shows/list?key=3cd5a087f940&order=recent&limit=5

//AFFICHE LES 100 DERNIERES NEWS
//https://api.betaseries.com/news/last?key=3cd5a087f940&number=100

//AFFICHE LES FILMS QUI ONT UN GENRE ACTION
//https://api.betaseries.com/movies/search?key=3cd5a087f940&genre=Action

//AFFICHE LES SERIES QUI ONT UN GENRE ACTION
//https://api.betaseries.com/shows/search?key=3cd5a087f940&genre=Action

//AFFICHE LES RESULTATS DU FILM GRACE A SON ID
//https://api.betaseries.com/movies/movie?key=3cd5a087f940&id=70502

let nameFilm;
let yearFilm;
let nameSerie;
let yearSerie;
let urlStream;
let trailer;
let type;
let background;
let poster;
let synopsis;
let note;
let api_key = "2d216cf10e57";
// let token = "5ca6e64e7566";
// let api_key = "3cd5a087f940";
let researchBtn;
let researchInput = document.querySelector(".input_research");
let researchtxt;
let isMouseOver = false;
let isTransitioning = false;
let imdb;
let duree;
let genres;
let platformLink;
let platformSvod;
let id;
let comment;
let boxResearch = document.querySelector(".boxResearch");

/* Alerte */
function displayAlert(alertClass, alertMessage) {
  let style = document.createElement("style");
  style.innerHTML =
    ".alert { position: fixed; top: 10%; left: 50%; transform: translateX(-50%); z-index: 999; width: fit-content; opacity: 1; transition: opacity 0.5s ease-in-out; } .alert.sticky { position: fixed !important; top: 10% !important; } @media (max-width: 767px) { .alert { width: 80%; text-align: center; } }";
  document.head.appendChild(style);

  let alertDiv = document.createElement("div");
  alertDiv.classList.add("alert");
  alertDiv.classList.add(alertClass);
  alertDiv.setAttribute("role", "alert");
  alertDiv.innerHTML = alertMessage;
  document.body.appendChild(alertDiv);

  function adjustAlertPosition() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 0) {
      alertDiv.classList.add("sticky");
    } else {
      alertDiv.classList.remove("sticky");
    }
    requestAnimationFrame(adjustAlertPosition);
  }

  window.addEventListener("scroll", adjustAlertPosition);

  setTimeout(function () {
    window.removeEventListener("scroll", adjustAlertPosition);
    alertDiv.style.opacity = "0";
    setTimeout(function () {
      alertDiv.style.display = "none";
    }, 500);
  }, 5000);

  adjustAlertPosition(); // Démarrer la mise à jour continue de la position de l'alerte
}

/* Fin alerte */

/* BOUTON AVATAR */

const avatarContainer = document.getElementById("avatar-container");
const tooltip = document.getElementById("tooltip");
const imgAvatar = document.getElementById("avatar");
let isMouseOverTooltip = false;

/* avatarContainer.addEventListener('click', function (event) {
    event.preventDefault();
}); */

avatarContainer.addEventListener("mouseenter", function () {
  imgAvatar.style.transform = "scale(1.2)";
  imgAvatar.style.transition = "transform 200ms ease-in-out";
  tooltip.style.display = "block";
  setTimeout(() => {
    tooltip.style.transition = "opacity 200ms ease-in-out";
    tooltip.style.opacity = 1;
    tooltip.style.right = "1.2rem";
    tooltip.style.top =
      avatarContainer.offsetTop + avatarContainer.offsetHeight + "px";
  }, 100);
});

avatarContainer.addEventListener("click", function () {
  tooltip.style.display = "block";
});

avatarContainer.addEventListener("mouseleave", function () {
  setTimeout(() => {
    if (!isMouseOverTooltip) {
      tooltip.style.transition = "opacity 200ms ease-in-out";
      tooltip.style.opacity = 0;
      setTimeout(() => {
        tooltip.style.display = "none";
      }, 200);
      isMouseOverTooltip = false;
      imgAvatar.style.transform = "scale(1)";
      imgAvatar.style.transition = "transform 200ms ease-in-out";
    }
  }, 100);
});

tooltip.addEventListener("mouseenter", function () {
  isMouseOverTooltip = true;
});

tooltip.addEventListener("mouseleave", function () {
  tooltip.style.transition = "opacity 200ms ease-in-out";
  tooltip.style.opacity = 0;
  setTimeout(() => {
    tooltip.style.display = "none";
  }, 200);
  isMouseOverTooltip = false;
  imgAvatar.style.transform = "scale(1)";
  imgAvatar.style.transition = "transform 200ms ease-in-out";
});

/* FIN BOUTON AVATAR */

const app = document.createElement("div");
app.setAttribute("id", "app");
document.body.appendChild(app);

// ANCRES NAVBAR
const navbar = document.querySelector(".navbar");
const navItems = navbar.querySelectorAll(".nav-item");
const filmAnchor = document.createElement("a");
filmAnchor.setAttribute("href", "#section-film");
filmAnchor.setAttribute("id", "filmAnchor");
filmAnchor.innerText = "^ Films ^";

filmAnchor.addEventListener("click", function (event) {
  event.preventDefault();
  const sectionFilm = document.querySelector("#section-film");
  const sectionPosition = sectionFilm.getBoundingClientRect().top;
  const offset = sectionPosition + window.pageYOffset - 120;

  window.scrollTo({
    top: offset,
    behavior: "smooth",
  });
});

const serieAnchor = document.createElement("a");
serieAnchor.setAttribute("href", "#section-serie");
serieAnchor.setAttribute("id", "serieAnchor");
serieAnchor.innerText = "v Séries v";

serieAnchor.addEventListener("click", function (event) {
  event.preventDefault();
  const sectionSerie = document.querySelector("#section-serie");
  const sectionPosition = sectionSerie.getBoundingClientRect().top;
  const offset = sectionPosition + window.pageYOffset - 120;

  window.scrollTo({
    top: offset,
    behavior: "smooth",
  });
});

let dropdown = document.createElement("select");
dropdown.classList.add(
  "btn",
  "btn-secondary",
  "dropdown-toggle",
  "dropdownsTop"
);

function createDropdown() {
  let option1 = document.createElement("option");
  option1.value = "all";
  option1.text = "Tout afficher";
  dropdown.add(option1);

  let option2 = document.createElement("option");
  option2.value = "trailer";
  option2.text = "Avec trailer";
  dropdown.add(option2);

  document.body.appendChild(dropdown);
}
createDropdown();

dropdown.addEventListener("change", function () {
  if (
    dropdownSelect.value === "fiveFilms" ||
    dropdownSelect.value === "fiveNews"
  ) {
    //researchFiveFilms();
    return;
  }

  if (dropdown.value === "trailer") {
    researchInput.value = searchResults3;
    researchtxt = searchResults3;
    research();
  }
  if (dropdown.value === "all") {
    researchInput.value = searchResults3;
    researchtxt = searchResults3;
    research();
  }
});

dropdown.value = searchResultsDropdown;
if (dropdown.value == "") {
  let option1 = document.createElement("option");
  option1.value = "all";
  option1.text = "Tout afficher";
  dropdown.add(option1);
}

let dropdownSelect = document.createElement("select");
dropdownSelect.classList.add(
  "btn",
  "btn-secondary",
  "dropdown-toggle",
  "dropdownsTop"
);

function createDropdownSelect() {
  let option1 = document.createElement("option");
  option1.value = "nothing";
  option1.text = "Sélectionner";
  dropdownSelect.add(option1);

  let option2 = document.createElement("option");
  option2.value = "fiveFilms";
  option2.text = "Films/Séries aléatoires";
  dropdownSelect.add(option2);

  let option3 = document.createElement("option");
  option3.value = "fiveNews";
  option3.text = "Dernières nouveautés";
  dropdownSelect.add(option3);
  document.body.appendChild(dropdownSelect);
}
createDropdownSelect();

dropdownSelect.addEventListener("change", function () {
  if (dropdownSelect.value === "fiveFilms") {
    researchFiveFilms();
  }
  if (dropdownSelect.value === "fiveNews") {
    researchFiveNews();
  }
});

//if (dropdownSelect.value == "") {
dropdownSelect.value = searchResultsDropdownSelectText;
if (dropdownSelect.value == "") {
  let option1 = document.createElement("option");
  option1.value = "nothing";
  option1.text = "Sélectionner";
  dropdownSelect.add(option1);
}
//}

// Scroll Event Listener
if (
  document.location.pathname === "../recherche" ||
  document.location.pathname === "/cinerama/recherche"
) {
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 100) {
      if (!navItems[navItems.length - 1].contains(filmAnchor)) {
        navItems[navItems.length - 1].appendChild(filmAnchor);
      }
      if (!navItems[navItems.length - 1].contains(serieAnchor)) {
        navItems[navItems.length - 1].appendChild(serieAnchor);
      }
    } else {
      if (navItems[navItems.length - 1].contains(filmAnchor)) {
        navItems[navItems.length - 1].removeChild(filmAnchor);
      }
      if (navItems[navItems.length - 1].contains(serieAnchor)) {
        navItems[navItems.length - 1].removeChild(serieAnchor);
      }
    }
  });
}

const filmTitle = document.createElement("img");
filmTitle.classList.add("hide-title", "filmTitle");
filmTitle.setAttribute("src", "./imgs/films.png");
filmTitle.setAttribute("alt", "film_title");

const sectionFilm = document.createElement("section");
sectionFilm.classList.add("section-film");
sectionFilm.setAttribute("id", "section-film");
app.appendChild(sectionFilm);

const dropdownSection = document.createElement("div");
dropdownSection.classList.add("dropdown-section");
sectionFilm.appendChild(dropdownSection);

const actuBtn = document.createElement("button");
actuBtn.classList.add("btn", "btn-secondary", "dropdownsTop", "actuBtn");
actuBtn.innerText = "🗘";

dropdownSection.appendChild(dropdown);
dropdownSection.appendChild(dropdownSelect);
dropdownSection.appendChild(actuBtn);
dropdownSection.style.display = "flex";
dropdownSection.style.flexWrap = "wrap";
/* dropdownSection.style.justifyContent = "space-between";
dropdownSection.style.alignItems = "center"; */
dropdownSection.style.margin = "5rem 0 0 0px";

sectionFilm.appendChild(filmTitle);

actuBtn.addEventListener("click", function () {
  if (dropdownSelect.value === "fiveFilms") {
    researchFiveFilms();
  }
  if (dropdownSelect.value === "fiveNews") {
    researchFiveNews();
  }
});

const filmContainer = document.createElement("div");
filmContainer.classList.add("filmContainer");
sectionFilm.appendChild(filmContainer);

const serieTitle = document.createElement("img");
serieTitle.classList.add("hide-title", "serieTitle");
serieTitle.setAttribute("src", "./imgs/series.png");
serieTitle.setAttribute("alt", "serie_title");
const sectionSerie = document.createElement("section");
sectionSerie.appendChild(serieTitle);
app.appendChild(sectionSerie);
sectionSerie.setAttribute("id", "section-serie");
sectionSerie.classList.add("section-serie");

const serieContainer = document.createElement("div");
serieContainer.classList.add("serieContainer");

sectionSerie.appendChild(serieContainer);

const background_research = document.createElement("img");
background_research.src = "";
background_research.setAttribute("alt", "fond");
background_research.style.objectFit = "cover";

background_research.classList.add("background_research");
document.body.appendChild(background_research);

const container = document.createElement("div");
container.setAttribute("id", "image-container");
document.body.appendChild(container);

const modal = document.createElement("div");
modal.classList.add("modal");
document.body.appendChild(modal);

const modalContent = document.createElement("div");
modalContent.classList.add("modal-content");
modalContent.style.boxShadow = "rgb(255, 255, 255) 1px 0 0.625rem";
modal.appendChild(modalContent);

const divBtns = document.createElement("div");
divBtns.classList.add("divBtns");
divBtns.style.display = "flex";
divBtns.style.justifyContent = "space-between";
//divBtns.style.marginBottom = "1rem";
divBtns.style.float = "right";
divBtns.style.gap = "1rem";

if (screen.width < 768) {
  modalContent.appendChild(divBtns);

  const nextButton = document.querySelector(".boxResearch");
  const avatar = document.getElementById("avatar-container");
  const parentElement = nextButton.parentNode;

  parentElement.insertBefore(avatar, nextButton);

  /*   setTimeout(function () {
  let divBtnsCommentsFav = document.querySelector(".divBtnsCommentsFav");
  let modalHeaderFav = document.querySelector(".modal-header-fav");
  const parentElement2 = modalHeaderFav.parentNode;

  parentElement2.insertBefore(divBtnsCommentsFav, modalHeaderFav);
  divBtnsCommentsFav.style.display = "flex";
  divBtnsCommentsFav.style.justifyContent = "space-between";
}, 100); */

  setTimeout(function () {
    let modalHeadersFav = document.querySelectorAll(".modal-header-fav");

    modalHeadersFav.forEach(function (modalHeaderFav) {
      let idFilm = modalHeaderFav.getAttribute("id").replace("modalHeader", "");
      let divBtnsCommentsFav = document.querySelector(
        "#divBtnsCommentsFav" + idFilm
      );
      let parentElement = modalHeaderFav.parentNode;

      parentElement.insertBefore(divBtnsCommentsFav, modalHeaderFav);

      divBtnsCommentsFav.style.display = "flex";
      divBtnsCommentsFav.style.justifyContent = "space-between";
    });
  }, 1000);
}

const modalHeader = document.createElement("div");
modalHeader.classList.add("modal-header");
modalHeader.style.display = "flex";
modalHeader.style.alignItems = "baseline";
modalHeader.style.padding = "0 0 1rem 0";
modalContent.appendChild(modalHeader);

/* const modalBackground = document.createElement("img");
modalBackground.classList.add("modal-background");
modalContent.appendChild(modalBackground); */

const modalTitle = document.createElement("h2");
modalTitle.style.color = "white";
modalTitle.style.textAlign = "left"; // Aligner le titre à gauche
modalTitle.textContent = "Titre de la modale";
modalHeader.appendChild(modalTitle);

if (screen.width > 768) {
  modalHeader.appendChild(divBtns);
}

const closeBtn = document.createElement("button");
closeBtn.textContent = "X";
closeBtn.classList.add("btn", "btn-danger", "closeBtn");
/* closeBtn.setAttribute("id", "closeBtn"); */

closeBtn.addEventListener("click", function () {
  modal.classList.add("fadeOut");
  seasonsSelect.innerHTML = "";
  episodesSelect.innerHTML = "";
  //Supprime le bouton si il y a une vidéo à la demande
  let deleteGoogleBtn = document.querySelector(".googleBtnLink");
  if (deleteGoogleBtn) {
    deleteGoogleBtn.remove();
  }
  //Supprime les éléments de la plateforme
  let deletePlatLink = document.querySelectorAll(".platLinkElements");
  for (let i = 0; i < deletePlatLink.length; i++) {
    deletePlatLink[i].remove();
  }
  //Supprime les éléments du SVOD
  let deleteSvod = document.querySelectorAll(".svodElements");
  for (let i = 0; i < deleteSvod.length; i++) {
    deleteSvod[i].remove();
  }
  //Supprime les votes
  let deleteStars = document.querySelectorAll(".stars");
  for (let i = 0; i < deleteStars.length; i++) {
    deleteStars[i].remove();
  }
  setTimeout(function () {
    modal.classList.remove("fadeOut");
    modal.style.display = "none";
    videoFrame.setAttribute("src", ``);
    document.body.style.overflowY = "scroll";
  }, 500);
  setTimeout(function () {
    //Supprime les boutons de favoris
    let favBtnsAll = document.querySelectorAll(".favBtn");
    for (let i = 0; i < favBtnsAll.length; i++) {
      favBtnsAll[i].style.display = "none";
    }
    //Supprime les boutons d'admin
    let editBtnsAll = document.querySelectorAll(".myAdminEditBtn");
    for (let i = 0; i < editBtnsAll.length; i++) {
      editBtnsAll[i].style.display = "none";
    }
  }, 500);
});

const modalBg = document.createElement("div");
modalBg.classList.add("modalBg");
modal.appendChild(modalBg);

const backgroundModal = document.createElement("img");
backgroundModal.classList.add("backgroundModal");
modalContent.appendChild(backgroundModal);

const videoFrame = document.createElement("iframe");
videoFrame.setAttribute("allow", "autoplay; encrypted-media");
videoFrame.setAttribute("allowfullscreen", "");
videoFrame.setAttribute("height", "500");
videoFrame.setAttribute("id", "video");
videoFrame.style.borderRadius = "0.625rem";
videoFrame.style.boxShadow = "rgb(0, 0, 0) 0px 0px 1.25rem 0px";
modalContent.appendChild(videoFrame);

const linkYtbBtn = document.createElement("button");
linkYtbBtn.textContent = "Trailer sur Youtube";
linkYtbBtn.classList.add("btn", "btn-primary");
linkYtbBtn.style.marginTop = "1.25rem";
modalContent.appendChild(linkYtbBtn);

let synopsisModal = document.createElement("p");
synopsisModal.classList.add("synopsisModal");
modalContent.appendChild(synopsisModal);

//Création du dropdown des saisons
const parentElement = document.createElement("div");
parentElement.classList.add("d-flex");

const seasonsSelect = document.createElement("select");
seasonsSelect.classList.add(
  "btn",
  "btn-secondary",
  "dropdown-toggle",
  "seasonsSelect"
);
parentElement.appendChild(seasonsSelect);

const seasons = [];
seasons.forEach((season) => {
  const option = document.createElement("option");
  option.value = season;
  option.textContent = season;
  seasonsSelect.appendChild(option);
});

//Création du dropdown des épisodes
const episodesSelect = document.createElement("select");
episodesSelect.classList.add(
  "btn",
  "btn-secondary",
  "dropdown-toggle",
  "episodesSelect"
);
parentElement.appendChild(episodesSelect);

const episodes = [];
episodes.forEach((episode) => {
  const option = document.createElement("option");
  option.value = episode;
  option.textContent = episode;
  episodesSelect.appendChild(option);
});

//Ajout de l'élément parent à la page
modalContent.appendChild(parentElement);

//Creation du bouton streaming
const validateBtn = document.createElement("button");
validateBtn.textContent = "Streaming";
validateBtn.classList.add("btn", "btn-primary");
validateBtn.style.marginTop = "1.25rem";
modalContent.appendChild(validateBtn);

const titles = document.querySelectorAll(".hide-title");
titles.forEach(function (title) {
  if (
    document.location.pathname === "/recherche" ||
    document.location.pathname === "/cinerama/recherche"
  ) {
    title.style.display = "block";
  } else {
    title.style.display = "none";
  }
});

//Création des images dans la section de recherche
function createDomImg(
  src,
  count,
  link,
  type,
  trailer,
  title,
  background,
  synopsis,
  year,
  imdb,
  platformLink,
  platformSvod,
  duree,
  note,
  id,
  comment,
  myMedia,
  genres
) {
  const a = document.createElement("a");
  a.href = "#";
  a.style.width = "fit-content";
  container.appendChild(a);

  const img = document.createElement("img");
  img.src = src;
  img.setAttribute("id", `affiche${count}`);
  img.classList.add("allImgs");
  img.setAttribute("data-link", link);
  img.setAttribute("alt", title);
  a.appendChild(img);

  //Réduit la taille des images en fonction de la taille des écrans
  if (screen.width < 480) {
    img.style.margin = "1.25rem 0.625rem 0 0.625rem!important";
    img.style.width = "6.25rem";
    img.style.height = "8,9375rem";
    container.style.marginTop = "0px";
  } else {
    img.style.margin = "1.875rem 0.9375rem 0 0.9375rem";
    img.style.width = "18.75rem";
    img.style.height = "26.8125rem";
    container.style.marginTop = "0px";
  }

  if (type == "film") {
    filmContainer.appendChild(a);
  } else {
    serieContainer.appendChild(a);
  }

  background_research.addEventListener("transitionstart", function () {
    isTransitioning = true;
  });
  background_research.addEventListener("transitionend", function () {
    isTransitioning = false;
  });

  img.style.transition =
    "transform 0.2s ease-in-out, opacity 0.2s ease-in-out, box-shadow 0.2s ease-in-out";

  img.addEventListener("mouseenter", async function () {
    afficherPopUp(img, title, year);
    isMouseOver = true;
    img.style.transform = "scale(1.1)";
    img.style.opacity = "1";
    img.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 1.5625rem";
    if (
      background_research.src != "" &&
      background_research != null &&
      background !== "" &&
      background != null
    ) {
      if (!isTransitioning) {
        if (isMouseOver) {
          background_research.style.opacity = "1";
          background_research.src = background;
        }
      } else {
        setTimeout(() => {
          if (isMouseOver) {
            background_research.style.opacity = "1";
            background_research.src = background;
          }
        }, 1000);
      }
    } else {
      background_research.style.opacity = "0";
    }
  });

  img.addEventListener("mouseleave", function () {
    cacherPopUp();
    if (screen.width > 480) {
      background_research.style.opacity = "0";
    }
    isMouseOver = false;
    img.style.transform = "scale(1)";
    img.style.opacity = "0.6";
    img.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 0.625rem";
  });

  img.addEventListener("click", function () {
    //Cache la barre de défilement
    document.body.style.overflow = "hidden";
    //Empeche le rechargement de page pour tous les liens
    document.querySelector("a").addEventListener("click", function (event) {
      event.preventDefault();
    });
    modalInformations();

    function modalInformations() {
      linkYtbBtn.setAttribute(
        "data-link",
        `https://www.youtube.com/results?search_query=${title}+trailer+fr+`
      );

      //Empeche le background derriere la modal de remonter en haut de la page
      const elements = document.querySelectorAll(
        'a[href="#"], button[type="submit"]'
      );
      elements.forEach((element) => {
        element.addEventListener("click", (event) => {
          if (!event.target.classList.contains("avatar")) {
            event.preventDefault();
            modal.style.display = "block";
          }
        });
      });

      modal.style.display = "block";
      modalBg.style.backgroundImage = `url(${background})`;
      modalBg.style.backgroundSize = "cover";
      modalContent.style.backgroundSize = "cover";

      validateBtn.classList.remove("btn-danger");
      validateBtn.classList.add("btn-primary");
      validateBtn.textContent = "Streaming";

      //Fonction de création de note
      createStars(note, modalContent, id, type, title, comment);

      //Fonction de création des commentaires
      createComments(id, type, title, comment, modalContent);

      //Fonction de création des acteurs
      createActors(
        id,
        type,
        title,
        modalContent,
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

      //Fonction de création des plateformes de streaming
      createPlatformLinks(platformLink, modalContent);

      //Fonction de création des liens de streaming
      createSvod(platformSvod, modalContent);

      //Fonction de création de la recherche google
      createGoogleSearch(
        platformLink,
        platformSvod,
        title,
        type,
        year,
        modalContent
      );

      //Fonction de création du modal
      modalCreation(
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
      );

      //Affiche les films/séries similaire du média sélectionné
      if (type == "film" || type == "movie") {
        getSimilarMovies(id, title, modalContent);
      } else {
        getSimilarShows(id, title, modalContent);
      }

      //Fonction de création du bouton d'édition du média
      createAdminEditButton(id, myMedia, type);

      //Fonction de création du bouton favoris
      createFavButton(id);

      //Fonction de création du bouton pour savoir si l'utilisateur à vu ou non le média
      createSeeButton(id);

      //Fonction d'ajout des commentaires à la bdd
      sendComments(id);
    }
  });
}

validateBtn.addEventListener("click", function () {
  const selectedImg = this.getAttribute("data-link");
  let video = document.getElementById("video");
  let src = video.src;
  video.src = src.substring(0) + "?autoplay=0";
  window.open(selectedImg, "_blank");
});

linkYtbBtn.addEventListener("click", function () {
  const selectedImg = this.getAttribute("data-link");
  window.open(selectedImg, "_blank");
});

if (
  document.location.pathname === "/recherche" ||
  document.location.pathname === "/cinerama/recherche"
) {
  //Création de 5 films aléatoires
  if (searchResultsDropdownSelect) {
    if (
      searchResultsDropdownSelectText === "fiveFilms" ||
      searchResultsDropdownSelectText === "fiveNews"
    ) {
      sectionFilm.style.display = "block";
      sectionSerie.style.display = "block";
      sectionFilm.style.marginTop = "6.25rem";
      let countFilms = 0;
      for (let films in searchResultsDropdownSelect.movies) {
        if (countFilms === 5) {
          break; // Stop la boucle si on a déjà affiché 5 films avec poster
        }
        const myFilm = searchResultsDropdownSelect.movies[films];
        if (myFilm.poster != "" && myFilm.poster != null) {
          if (myFilm.imdb_id != "" && myFilm.imdb_id != null) {
            if (
              dropdown.value === "all" ||
              (dropdown.value === "trailer" && myFilm.trailer != null)
            ) {
              if (
                myFilm.other_title != null &&
                myFilm.other_title != "" &&
                myFilm.other_title.language == "fr"
              ) {
                nameFilm = myFilm.other_title.title;
              } else {
                nameFilm = myFilm.title;
              }
              yearFilm = myFilm.production_year;
              urlStream = `https://www.g2stream.com/stream/movie?imdb=${imdb}`;
              type = "film";
              trailer = myFilm.trailer;
              background = myFilm.backdrop;
              synopsis = myFilm.synopsis;
              imdb = myFilm.imdb_id;
              platformLink = myFilm.platform_links;
              platformSvod = myFilm.platforms_svod;
              duree = myFilm.length;
              note = myFilm.notes;
              id = myFilm.id;
              comment = myFilm.comments;
              let genreList = [];
              for (let i = 0; i < myFilm.genres.length; i++) {
                genreList.push(myFilm.genres[i]);
              }
              genres = genreList;
              createDomImg(
                myFilm.poster,
                films,
                urlStream,
                type,
                trailer,
                nameFilm,
                background,
                synopsis,
                yearFilm,
                imdb,
                platformLink,
                platformSvod,
                duree,
                note,
                id,
                comment,
                myFilm,
                genres
              );

              //INSERER LES FILMS DANS LA BDD
              if (
                myFilm.other_title != null &&
                myFilm.other_title != "" &&
                myFilm.other_title.language == "fr"
              ) {
                insererFilm(
                  myFilm.title,
                  myFilm.other_title.title,
                  type,
                  yearFilm,
                  myFilm.poster,
                  background,
                  id,
                  imdb,
                  trailer,
                  synopsis,
                  duree,
                  myFilm.notes.mean,
                  myFilm.notes.total,
                  genres
                );
              } else {
                insererFilm(
                  myFilm.title,
                  "",
                  type,
                  yearFilm,
                  myFilm.poster,
                  background,
                  id,
                  imdb,
                  trailer,
                  synopsis,
                  duree,
                  myFilm.notes.mean,
                  myFilm.notes.total,
                  genres
                );
              }

              countFilms++;
            }
          }
        }
      }

      //Création des séries par la fonction aléatoire
      let countSeries = 0;
      for (let series in searchResultsDropdownSelectNews.shows) {
        if (countSeries === 5) {
          break; // Stop la boucle si on a déjà affiché 5 séries avec poster
        }
        const mySerie = searchResultsDropdownSelectNews.shows[series];
        if (mySerie.images.poster != "" && mySerie.images.poster != null) {
          if (mySerie.imdb_id != "" && mySerie.imdb_id != null) {
            if (
              dropdown.value === "all" ||
              (dropdown.value === "trailer" && mySerie.next_trailer != null)
            ) {
              nameSerie = mySerie.original_title;
              yearSerie = mySerie.creation;
              type = "serie";
              urlStream = `https://www.g2stream.com/stream/series?imdb=${imdb}&language=fr&sea=1&epi=1`;
              trailer = mySerie.next_trailer;
              background = mySerie.images.show;
              poster = mySerie.images.poster;
              synopsis = mySerie.description;
              imdb = mySerie.imdb_id;
              if (mySerie.platforms == null) {
                platformLink = "";
                platformSvod = "";
              } else {
                platformLink = "";
                platformSvod = mySerie.platforms.svods;
              }
              note = mySerie.notes;
              id = mySerie.id;
              comment = mySerie.comments;
              let genreList = [];
              for (let genre in mySerie.genres) {
                genreList.push(mySerie.genres[genre]);
              }
              genres = genreList;
              createDomImg(
                poster,
                series,
                urlStream,
                type,
                trailer,
                nameSerie,
                background,
                synopsis,
                yearSerie,
                imdb,
                platformLink,
                platformSvod,
                duree,
                note,
                id,
                comment,
                mySerie,
                genres
              );

              let saisonsList = [];
              for (let i = 0; i < mySerie.seasons_details.length; i++) {
                saisonsList.push(mySerie.seasons_details[i].episodes);
              }
              insererSerie(
                nameSerie,
                yearSerie,
                poster,
                background,
                id,
                imdb,
                trailer,
                synopsis,
                genres,
                saisonsList
              );

              countSeries++;
            }
          }
        }
      }
    }
  } else if (searchResults) {
    //Création des films par la fonction recherche
    sectionFilm.style.display = "block";
    sectionSerie.style.marginTop = "0px";
    for (let films in searchResults.movies) {
      const myFilm = searchResults.movies[films];
      if (
        dropdown.value === "all" ||
        (dropdown.value === "trailer" && myFilm.trailer != null)
      ) {
        if (myFilm.poster != "" && myFilm.poster != null) {
          //Si le film a un titre en Français on le stock dans la variable sinon on stock l'original
          if (
            myFilm.other_title != null &&
            myFilm.other_title != "" &&
            myFilm.other_title.language == "fr"
          ) {
            nameFilm = myFilm.other_title.title;
          } else {
            nameFilm = myFilm.title;
          }
          yearFilm = myFilm.production_year;
          imdb = myFilm.imdb_id;
          urlStream = `https://www.g2stream.com/stream/movie?imdb=${imdb}`;
          type = "film";
          trailer = myFilm.trailer;
          background = myFilm.backdrop;
          synopsis = myFilm.synopsis;
          platformLink = myFilm.platform_links;
          platformSvod = myFilm.platforms_svod;
          imdb = myFilm.imdb_id;
          duree = myFilm.length;
          note = myFilm.notes;
          id = myFilm.id;
          comment = myFilm.comments;
          let genreList = [];
          for (let i = 0; i < myFilm.genres.length; i++) {
            genreList.push(myFilm.genres[i]);
          }
          genres = genreList;
          createDomImg(
            myFilm.poster,
            films,
            urlStream,
            type,
            trailer,
            nameFilm,
            background,
            synopsis,
            yearFilm,
            imdb,
            platformLink,
            platformSvod,
            duree,
            note,
            id,
            comment,
            myFilm,
            genres
          );

          if (
            myFilm.other_title != null &&
            myFilm.other_title != "" &&
            myFilm.other_title.language == "fr"
          ) {
            insererFilm(
              myFilm.title,
              myFilm.other_title.title,
              type,
              yearFilm,
              myFilm.poster,
              background,
              id,
              imdb,
              trailer,
              synopsis,
              duree,
              myFilm.notes.mean,
              myFilm.notes.total,
              genres
            );
          } else {
            insererFilm(
              myFilm.title,
              "",
              type,
              yearFilm,
              myFilm.poster,
              background,
              id,
              imdb,
              trailer,
              synopsis,
              duree,
              myFilm.notes.mean,
              myFilm.notes.total,
              genres
            );
          }
        }
      }
    }
  } else {
    //Si il n'y a pas de films, on cache la section des films
    if (!searchResultsDropdownSelect) {
      sectionFilm.style.display = "none";
    }
    sectionSerie.style.marginTop = "6.25rem";
  }
  if (searchResults2) {
    //Création des séries par la fonction recherche
    sectionSerie.style.display = "block";
    sectionFilm.style.marginTop = "0px";
    for (let series in searchResults2.shows) {
      const mySerie = searchResults2.shows[series];
      if (
        dropdown.value === "all" ||
        (dropdown.value === "trailer" && mySerie.next_trailer != null)
      ) {
        if (mySerie.images.poster != "" && mySerie.images.poster != null) {
          nameSerie = mySerie.original_title;
          yearSerie = mySerie.creation;
          imdb = mySerie.imdb_id;
          type = "serie";
          urlStream = `https://www.g2stream.com/stream/series?imdb=${imdb}&language=fr&sea=1&epi=1`;
          trailer = mySerie.next_trailer;
          background = mySerie.images.show;
          poster = mySerie.images.poster;
          synopsis = mySerie.description;
          if (mySerie.platforms == null) {
            platformLink = "";
            platformSvod = "";
          } else {
            platformLink = "";
            platformSvod = mySerie.platforms.svods;
          }
          note = mySerie.notes;
          id = mySerie.id;
          comment = mySerie.comments;
          let genreList = [];
          for (let genre in mySerie.genres) {
            genreList.push(mySerie.genres[genre]);
          }
          genres = genreList;
          createDomImg(
            poster,
            series,
            urlStream,
            type,
            trailer,
            nameSerie,
            background,
            synopsis,
            yearSerie,
            imdb,
            platformLink,
            platformSvod,
            duree,
            note,
            id,
            comment,
            mySerie,
            genres
          );

          let saisonsList = [];
          for (let i = 0; i < mySerie.seasons_details.length; i++) {
            saisonsList.push(mySerie.seasons_details[i].episodes);
          }
          insererSerie(
            nameSerie,
            yearSerie,
            poster,
            background,
            id,
            imdb,
            trailer,
            synopsis,
            genres,
            saisonsList
          );
        }
      }
    }
  } else {
    if (!searchResultsDropdownSelect) {
      sectionSerie.style.display = "none";
    }
    sectionFilm.style.marginTop = "6.25rem";
  }

  //Bouton pour remonter en haut de la modal
  let scrollTopBtn = document.createElement("button");
  scrollTopBtn.classList.add("scroll-top-btn", "btn", "btn-secondary");
  scrollTopBtn.innerHTML = `<i class="fas fa-arrow-up"></i>`;

  modalContent.appendChild(scrollTopBtn);

  scrollTopBtn.addEventListener("click", () => {
    modal.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

let rechercheTrouvee = false;

async function research() {
  //Si il n'y a rien dans la barre de recherche, on affiche 5 films et séries aléatoire
  if (!researchtxt) {
    researchFiveFilms();
    dropdownSelect.value = "fiveFilms";
    return;
  }
  //Mot clé pour faire les ajouts de médias dans la bdd ( très très très très très très looooong )
  if (researchtxt == "magasearch") {
    try {
      //const maxId = 123534; // Nombre maximum d'ID à parcourir
      const maxId = 6; // Nombre maximum d'ID à parcourir

      for (let i = 1; i < maxId; i++) {
        const movieResponse = await fetch(
          `https://api.betaseries.com/movies/movie?id=${i}&key=${api_key}`
        );
        const movieData = await movieResponse.json();
        if (movieData.movie) {
          let commentaires;
          if (movieData.movie.comments > 0) {
            const movieCommentsResponse = await fetch(
              `https://api.betaseries.com/comments/comments?key=${api_key}&id=${i}&type=movie&order=desc&replies=0&nbpp=500`
            );
            commentaires = await movieCommentsResponse.json();
            console.log(commentaires);
          }
          if (movieData.other_title != null) {
            insererFilm(
              movieData.movie.title,
              movieData.movie.other_title.title,
              "film",
              movieData.movie.production_year,
              movieData.movie.poster,
              movieData.movie.backdrop,
              movieData.movie.id,
              movieData.movie.imdb_id,
              movieData.movie.trailer,
              movieData.movie.synopsis,
              movieData.movie.length,
              movieData.movie.notes.mean,
              movieData.movie.notes.total,
              movieData.movie.genres
            );
          } else {
            insererFilm(
              movieData.movie.title,
              "",
              "film",
              movieData.movie.production_year,
              movieData.movie.poster,
              movieData.movie.backdrop,
              movieData.movie.id,
              movieData.movie.imdb_id,
              movieData.movie.trailer,
              movieData.movie.synopsis,
              movieData.movie.length,
              movieData.movie.notes.mean,
              movieData.movie.notes.total,
              movieData.movie.genres
            );
          }
          if (movieData.movie.comments > 0) {
            for (let j = 0; j < commentaires.comments.length; j++) {
              /* if (commentaires.comments[j].user_note == null) {
                                commentaires.comments[j].user_note = 0;
                            } */

              if (commentaires.comments[j].avatar == null) {
                setComments(
                  commentaires.comments[j].login,
                  "null",
                  commentaires.comments[j].user_note,
                  commentaires.comments[j].date,
                  commentaires.comments[j].text,
                  i
                );
              } else {
                setComments(
                  commentaires.comments[j].login,
                  commentaires.comments[j].avatar,
                  commentaires.comments[j].user_note,
                  commentaires.comments[j].date,
                  commentaires.comments[j].text,
                  i
                );
              }
              console.log(
                commentaires.comments[j].login,
                commentaires.comments[j].avatar,
                commentaires.comments[j].user_note,
                commentaires.comments[j].date,
                commentaires.comments[j].text,
                i
              );
            }
          }
          /* } else {
                        break; // Sortir de la boucle si la page courante ne contient pas de résultats */
        }
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    //Execute la requete de recherche de média
    try {
      const movieResponse = await fetch(
        `https://api.betaseries.com/movies/search?title=${researchtxt}&key=${api_key}&nbpp=1000`
      );
      const showResponse = await fetch(
        `https://api.betaseries.com/shows/search?title=${researchtxt}&key=${api_key}&nbpp=1000`
      );
      const movieData = await movieResponse.json();
      const showData = await showResponse.json();

      sessionStorage.clear();

      //Pas de média trouvé, affichage de l'erreur
      if (!movieData.movies.length && !showData.shows.length) {
        if (!rechercheTrouvee) {
          displayAlert("alert-danger", "Aucun film/série n'a été trouvé.");
          rechercheTrouvee = true;

          setTimeout(() => {
            rechercheTrouvee = false;
          }, 5500);
        }
        return;
      } else {
        //Media trouvé, on stock le nom de l'input dans les sessions storage pour le retrouver sur l'autre page
        if (movieData.movies.length > 0) {
          sessionStorage.setItem("searchResults", JSON.stringify(movieData));
        }
        if (showData.shows.length > 0) {
          sessionStorage.setItem("searchResults2", JSON.stringify(showData));
        }
        sessionStorage.setItem("searchResults3", JSON.stringify(researchtxt));
        sessionStorage.setItem(
          "searchResultsDropdown",
          JSON.stringify(dropdown.value)
        );
        window.location.href = "./recherche";
      }
    } catch (error) {
      console.error(error);
    }
  }
}

async function researchFiveFilms() {
  try {
    const movieResponse = await fetch(
      `https://api.betaseries.com/movies/random?key=${api_key}&nb=50`
    );
    const movieData = await movieResponse.json();
    const showsResponse = await fetch(
      `https://api.betaseries.com/shows/random?key=${api_key}&nb=50`
    );
    const showsData = await showsResponse.json();

    sessionStorage.clear();

    if (movieData.movies.length > 0) {
      sessionStorage.setItem(
        "searchResultsDropdownSelect",
        JSON.stringify(movieData)
      );
    }
    if (showsData.shows.length > 0) {
      sessionStorage.setItem(
        "searchResultsDropdownSelectNews",
        JSON.stringify(showsData)
      );
    }

    sessionStorage.setItem(
      "searchResultsDropdownSelectText",
      JSON.stringify(dropdownSelect.value)
    );
    sessionStorage.setItem(
      "searchResultsDropdown",
      JSON.stringify(dropdown.value)
    );
    window.location.href = "./recherche";
  } catch (error) {
    console.error(error);
  }
}

async function researchFiveNews() {
  try {
    const movieResponse = await fetch(
      `https://api.betaseries.com/movies/list?key=${api_key}&order=recent&limit=20`
    );
    const movieData = await movieResponse.json();
    const showResponse = await fetch(
      `https://api.betaseries.com/shows/list?key=${api_key}&order=recent&limit=20`
    );
    const showData = await showResponse.json();

    sessionStorage.clear();

    if (movieData.movies.length > 0) {
      sessionStorage.setItem(
        "searchResultsDropdownSelect",
        JSON.stringify(movieData)
      );
      sessionStorage.setItem(
        "searchResultsDropdownSelectNews",
        JSON.stringify(showData)
      );
    }

    sessionStorage.setItem(
      "searchResultsDropdownSelectText",
      JSON.stringify(dropdownSelect.value)
    );
    sessionStorage.setItem(
      "searchResultsDropdown",
      JSON.stringify(dropdown.value)
    );
    window.location.href = "./recherche";
  } catch (error) {
    console.error(error);
  }
}

if (
  document.location.pathname === "../cinerama/accueil" ||
  document.location.pathname === "/cinerama/accueil" ||
  document.location.pathname === "/accueil"
) {
  //Génère un genre aléatoire
  const genres = [
    "Comédie",
    "Drame",
    "Crime",
    "Horreur",
    "Action",
    "Aventure",
    "Fantastique",
    "Animation",
    "Science-Fiction",
    "Documentaire",
    "Romance",
    "Western",
    "Thriller",
    "Familial",
    "Mystère",
    "Guerre",
    "Histoire",
    "Musique",
  ];
  const randomIndex = Math.floor(Math.random() * genres.length);
  const genre = genres[randomIndex];

  randomGender();
  async function randomGender() {
    try {
      const movieResponse = await fetch(
        `https://api.betaseries.com/search/movies?key=${api_key}&genres=${genre}&limit=50`
      );
      const movieData = await movieResponse.json();

      const randomMovieIds = [];
      while (randomMovieIds.length < 20) {
        const randomMovieIndex = Math.floor(
          Math.random() * movieData.movies.length
        );
        const randomMovieId = movieData.movies[randomMovieIndex].id;
        if (!randomMovieIds.includes(randomMovieId)) {
          randomMovieIds.push(randomMovieId);
        }
      }

      const movies = await Promise.all(
        randomMovieIds.map(async (id) => {
          const movieResponse = await fetch(
            `https://api.betaseries.com/movies/movie?key=${api_key}&id=${id}`
          );
          const movieData = await movieResponse.json();
          return movieData.movie;
        })
      );

      if (movies.length > 0) {
        const randomIndex = Math.floor(Math.random() * movies.length);
        const randomMovie = movies[randomIndex];

        let titleGender = document.querySelector(".filmGender");
        titleGender.textContent = `Films par genre : ${genre}`;

        const backgroundImageElement =
          document.querySelector(".background_image");
        backgroundImageElement.style.backgroundImage = `url(${randomMovie.backdrop})`;
        backgroundImageElement.style.opacity = 0.5;

        const indexType = document.querySelector(".indexType");
        indexType.textContent = "Film";

        const indexTitle = document.querySelector(".indexTitle");
        if (
          randomMovie.other_title != null &&
          randomMovie.other_title != "" &&
          randomMovie.other_title.language == "fr"
        ) {
          indexTitle.textContent = randomMovie.other_title.title;
        } else {
          indexTitle.textContent = randomMovie.title;
        }

        note = randomMovie.notes.mean;
        nbNotes = randomMovie.notes.total;
        date = randomMovie.production_year;
        duree = randomMovie.length;

        const indexLookType = document.querySelector(".indexLookType");

        if (randomMovie.platforms_svod.length > 0) {
          indexLookType.textContent = "Le regarder maintenant !";
          indexLookType.style.display = "block";
        } else {
          indexLookType.style.display = "none";
        }

        const indexSynopsis = document.querySelector(".indexSynopsis");
        indexSynopsis.textContent = randomMovie.synopsis;

        createStars2(note, nbNotes);
        createSvodindex(randomMovie, indexLookType);
        expandSynopsis(randomMovie);

        if (duree != 0) {
          let duration = document.createElement("h5");
          duration.classList.add("content", "dureeFilm", "dureeFilmIndex");
          indexTitle.appendChild(duration);

          const secondes = duree;
          const heures = Math.floor(secondes / 3600); // Nombre d'heures
          const minutes = Math.floor((secondes % 3600) / 60); // Nombre de minutes
          let temps = "";
          minutes == 0
            ? (temps = `${heures}h`)
            : (temps = `${heures}h${minutes}`);
          duration.innerHTML = `<strong>Durée du film</strong> : ${temps}`;
        } else {
          let deleteDureeFilm = document.getElementsByClassName("dureeFilm");
          if (deleteDureeFilm.length > 0) {
            deleteDureeFilm[0].remove();
          }
        }

        //createCarousel(movieData, api_key, movieData2);

        /*         const indexLookType = document.querySelector(".indexLookType");
        indexLookType.textContent = "Le regarder maintenant !";

        const indexSynopsis = document.querySelector(".indexSynopsis");
        indexSynopsis.textContent = randomMovie.synopsis; */

        createCarousel(
          {
            movies,
          },
          api_key,
          seasonsSelect,
          episodesSelect,
          validateBtn,
          linkYtbBtn,
          videoFrame
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}

function createStars2(note, nbNotes) {
  let starsTitle = document.createElement("h5");

  function style() {
    starsTitle.classList.add("stars");
    starsTitle.style.color = "white";
    starsTitle.style.marginTop = "0.9375rem";
  }

  if (note === 0) {
    style();
    starsTitle.innerHTML = "Aucune note";
    indexTitle.appendChild(starsTitle);
    return;
  }

  let notation = Math.round(note * 2) / 2;
  let fullStars = Math.floor(notation);
  let halfStar = notation % 1 >= 0.25 && notation % 1 <= 0.75;
  let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  style();
  if (note == 1 || note == 2 || note == 3 || note == 4 || note == 5) {
    if (nbNotes > 1) {
      starsTitle.innerHTML =
        `<strong>Note</strong> : ` +
        note.toFixed(0) +
        " / 5 (" +
        nbNotes +
        " votes)";
    } else {
      starsTitle.innerHTML =
        `<strong>Note</strong> : ` +
        note.toFixed(0) +
        " / 5 (" +
        nbNotes +
        " vote)";
    }
  } else {
    if (nbNotes > 1) {
      starsTitle.innerHTML =
        `<strong>Note</strong> : ` +
        note.toFixed(2) +
        " / 5 (" +
        nbNotes +
        " votes)";
    } else {
      starsTitle.innerHTML =
        `<strong>Note</strong> : ` +
        note.toFixed(2) +
        " / 5 (" +
        nbNotes +
        " vote)";
    }
  }

  indexTitle.appendChild(starsTitle);

  let stars = document.createElement("span");
  stars.classList.add("stars", "indexStars");
  stars.style.margin = "0.9375rem 0 0 0.625rem";

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

let researchBtnNav = document.querySelector(".researchLink");

document.addEventListener("DOMContentLoaded", function () {
  researchBtn = document.getElementById("reseachLink");
  researchInput = document.querySelector(".input_research");

  researchBtn.addEventListener("click", function () {
    sessionStorage.clear();
    researchtxt = researchInput.value;
    research();
  });

  researchInput.addEventListener("focus", function () {
    boxResearch.style.setProperty("border-color", "white", "important");
    researchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        researchtxt = researchInput.value;
        research();
      }
    });
  });

  researchBtnNav.addEventListener("click", function () {
    if (!searchResults || !searchResults2) {
      researchtxt = researchInput.value;
      research();
    } else {
      window.location.href = "./recherche";
    }
  });
});
if (
  document.location.pathname === "/recherche" ||
  document.location.pathname === "/cinerama/recherche"
) {
  dropdown.style.display = "block";
  dropdownSelect.style.display = "block";
} else {
  sectionFilm.style.display = "none";
  sectionSerie.style.display = "none";
  dropdown.style.display = "none";
  dropdownSelect.style.display = "none";
}

export function createAdminEditButton(id, myMedia, type) {
  // Check si l'utilisateur est admin
  selectUserById(id, myMedia, type);
}

export function createAdminButton(id, myMedia, type) {
  // Vérifie si le bouton existe déjà
  if (document.getElementById(`myAdminEditBtn${id}`)) {
    document.getElementById(`myAdminEditBtn${id}`).style.display = "block";
    return;
  }

  let allbtns = document.querySelectorAll(".myAdminEditBtn");
  allbtns.forEach((btn) => {
    btn.style.display = "none";
  });

  const editBtn = document.createElement("button");
  editBtn.classList.add(
    "btn",
    "btn-warning",
    "myAdminEditBtn",
    "fas",
    "fa-pen"
  );
  editBtn.setAttribute("id", `myAdminEditBtn${id}`);

  divBtns.appendChild(editBtn);
  // Find the seeBtn element
  const seeBtn = document.querySelector(".seeBtn");

  // Insert the editBtn before the seeBtn
  seeBtn.parentNode.insertBefore(editBtn, seeBtn);

  const myEditBtn = document.getElementById(`myAdminEditBtn${id}`);
  myEditBtn.addEventListener("click", function () {
    //affiche la modal d'édition du film
    createEditAdminModal(myMedia, type);
  });
}

/* export function createFavButton(id) {
  // Vérifie si le bouton editer existe déjà
  if (document.getElementById(`myFavBtn${id}`)) {
    document.getElementById(`myFavBtn${id}`).style.display = "block";
    return;
  }

  let allbtns = document.querySelectorAll(".favBtn");
  allbtns.forEach((btn) => {
    btn.style.display = "none";
  });

  const favBtn = document.createElement("button");
  favBtn.classList.add("btn", "btn-secondary", "favBtn");
  favBtn.setAttribute("id", `myFavBtn${id}`);

  const starFav = document.createElement("i");
  starFav.classList.add("fas", "fa-star");
  starFav.style.color = "white";
  starFav.setAttribute("id", `myStarFav${id}`);

  favBtn.appendChild(starFav);
  divBtns.appendChild(favBtn);
  divBtns.appendChild(closeBtn);

  const myFavBtn = document.getElementById(`myFavBtn${id}`);
  const myStarFav = document.getElementById(`myStarFav${id}`);

  myFavBtn.addEventListener("click", function () {
    myStarFav.style.color === "gold"
      ? (myStarFav.style.color = "white")
      : (myStarFav.style.color = "gold");
    addFav(id);
  });
} */

async function sendComments(id) {
  let type = "movie";
  try {
    const response = await fetch(
      `https://api.betaseries.com/comments/comments?key=${api_key}&id=${id}&type=${type}&order=desc&replies=0&nbpp=50`
    );
    const comments = await response.json();
    //console.log(comments)

    for (let i = 0; i < comments.comments.length; i++) {
      if (comments.comments[i].avatar == null) {
        setComments(
          comments.comments[i].login,
          "null",
          comments.comments[i].user_note,
          comments.comments[i].date,
          comments.comments[i].text,
          id
        );
      } else {
        setComments(
          comments.comments[i].login,
          comments.comments[i].avatar,
          comments.comments[i].user_note,
          comments.comments[i].date,
          comments.comments[i].text,
          id
        );
      }
    }
  } catch (err) {
    console.error(err);
    let error = document.createElement("p");
    error.innerHTML =
      "Une erreur est survenue lors du chargement des commentaires.";
    error.style.color = "white";
    commentsModalContent.appendChild(error);
  }
}

export function createSeeButton(id) {
  let allSeeBtns = document.querySelectorAll(".seeBtn");
  allSeeBtns.forEach((btn) => {
    btn.style.display = "none";
  });

  if (document.getElementById(`mySeeBtn${id}`)) {
    document.getElementById(`mySeeBtn${id}`).style.display = "block";
    return;
  }

  const seeBtn = document.createElement("button");
  seeBtn.classList.add("btn", "btn-secondary", "seeBtn");
  seeBtn.setAttribute("id", `mySeeBtn${id}`);

  const eyeInBtn = document.createElement("i");
  eyeInBtn.classList.add("fa", "fa-eye-slash");
  eyeInBtn.style.color = "white";
  eyeInBtn.setAttribute("id", `myEyeBtn${id}`);

  seeBtn.appendChild(eyeInBtn);
  divBtns.appendChild(seeBtn);
  setTimeout(function () {
    const myFavBtn = document.querySelector(".favBtn");

    // Insert the seeBtn before the myFavBtn
    myFavBtn.parentNode.insertBefore(seeBtn, myFavBtn);

    const mySeeBtn = document.getElementById(`mySeeBtn${id}`);
    const myEyeBtn = document.getElementById(`myEyeBtn${id}`);

    /* mySeeBtn.addEventListener("click", function () {
      myEyeBtn.style.color === "greenyellow"
        ? (myEyeBtn.style.color = "white")
        : (myEyeBtn.style.color = "greenyellow");
      addFilmVu(id);
      console.log("addFilmVu");
    }); */
    mySeeBtn.addEventListener("click", function () {
      if (myEyeBtn.style.color === "greenyellow") {
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
      addFilmVu(id);
    });
  }, 200);
  checkFilmVu(id);
}

export function createFavButton(id) {
  // Vérifie si le bouton editer existe déjà
  if (document.getElementById(`myFavBtn${id}`)) {
    document.getElementById(`myFavBtn${id}`).style.display = "block";
    return;
  }
  let allbtns = document.querySelectorAll(".favBtn");
  allbtns.forEach((btn) => {
    btn.style.display = "none";
  });

  const favBtn = document.createElement("button");
  favBtn.classList.add("btn", "btn-secondary", "favBtn");
  favBtn.setAttribute("id", `myFavBtn${id}`);

  const starFav = document.createElement("i");
  starFav.classList.add("fas", "fa-star");
  starFav.style.color = "white";
  starFav.setAttribute("id", `myStarFav${id}`);

  favBtn.appendChild(starFav);

  setTimeout(() => {
    // Trouver le bouton après lequel vous souhaitez insérer le bouton "suivant"
    const nextButton = document.querySelector(".closeBtn");

    // Vérifier si l'élément "closeBtn" existe
    if (nextButton) {
      // Insérer le bouton "suivant" avant le bouton existant
      divBtns.insertBefore(favBtn, nextButton);
    } else {
      // Si l'élément "closeBtn" n'existe pas, ajouter le bouton à la fin
      divBtns.appendChild(favBtn);
    }

    divBtns.appendChild(closeBtn);

    const myFavBtn = document.getElementById(`myFavBtn${id}`);
    const myStarFav = document.getElementById(`myStarFav${id}`);

    myFavBtn.addEventListener("click", function () {
      myStarFav.style.color === "gold"
        ? (myStarFav.style.color = "white")
        : (myStarFav.style.color = "gold");
      addFav(id);
    });
  }, 100);

  checkFav(id);
}

export function getFav(data, id) {
  setTimeout(() => {
    let myStarFav = document.getElementById(`myStarFav${id}`);
    if (data == "true") {
      myStarFav.style.color = "gold";
    } else if (data == "false") {
      myStarFav.style.color = "white";
    }
  }, 100);
}

export function getFilmVu(data, id) {
  setTimeout(() => {
    let myEyeBtn = document.getElementById(`myEyeBtn${id}`);
    if (data == "true") {
      myEyeBtn.style.color = "greenyellow";
      myEyeBtn.classList.remove("fa-eye");
      myEyeBtn.classList.remove("fa-eye-slash");
      myEyeBtn.classList.add("fa-eye");
    } else if (data == "false") {
      myEyeBtn.style.color = "white";
      myEyeBtn.classList.remove("fa-eye");
      myEyeBtn.classList.remove("fa-eye-slash");
      myEyeBtn.classList.add("fa-eye-slash");
    }
  }, 100);
}

//Split function:
/*let theFilm = searchResults.movies[films].title
if (searchResults.movies[films].title.includes(":")) {
    nameFilmSplit = theFilm.split(':')[0];
} else if (theFilm.includes("-")) {
    nameFilmSplit = theFilm.split('-')[0];
} else if (theFilm.includes("(")) {
    nameFilmSplit = theFilm.split('(')[0];
} else {
    nameFilmSplit = searchResults.movies[films].title
} */

/* Links de la navbar */
let indexLink = document.querySelector(".indexLink");
let researchLink = document.querySelector(".researchLink");
let favLink = document.querySelector(".favLink");

if (
  document.location.pathname === "../accueil" ||
  document.location.pathname === "/cinerama/accueil"
) {
  indexLink.classList.add("fw-bold");
  researchLink.classList.remove("fw-bold");
  favLink.classList.remove("fw-bold");
}
if (
  document.location.pathname === "../recherche" ||
  document.location.pathname === "/cinerama/recherche"
) {
  indexLink.classList.remove("fw-bold");
  researchLink.classList.add("fw-bold");
  favLink.classList.remove("fw-bold");
}
if (
  document.location.pathname === "../favoris" ||
  document.location.pathname === "/cinerama/favoris"
) {
  indexLink.classList.remove("fw-bold");
  researchLink.classList.remove("fw-bold");
  favLink.classList.add("fw-bold");
}
/* FIN Links de la navbar */

let favLabel = document.querySelector(".favLabel");
let favLabel2 = " ";

let delFavLabel = document.querySelector(".delFavLabel");
let delFavLabel2 = " ";

if (
  document.location.pathname === "../accueil" ||
  document.location.pathname === "/cinerama/accueil"
) {
  favLabel.addEventListener("DOMSubtreeModified", function () {
    //console.log("FavLabel 1 ", favLabel.textContent);
    //console.log("FavLabel 2 ", favLabel2);
    if (favLabel.textContent != favLabel2 && favLabel.textContent != "") {
      favLabel2 = favLabel.textContent;

      addToFav(favLabel2);
      async function addToFav(id) {
        try {
          let api_key = "2d216cf10e57";
          const movieResponse2 = await fetch(
            `https://api.betaseries.com/movies/movie?key=${api_key}&id=${id}`
          );
          const movieData2 = await movieResponse2.json();
          const myFilm = movieData2.movie;
          //console.log("myFilm", myFilm);

          //INSERE LE FILMS DANS LA BDD
          type = "film";
          trailer = myFilm.trailer;
          background = myFilm.backdrop;
          synopsis = myFilm.synopsis;
          imdb = myFilm.imdb_id;
          platformLink = myFilm.platform_links;
          platformSvod = myFilm.platforms_svod;
          duree = myFilm.length;
          note = myFilm.notes;
          id = myFilm.id;
          comment = myFilm.comments;
          yearFilm = myFilm.production_year;
          let genreList = [];
          for (let i = 0; i < myFilm.genres.length; i++) {
            genreList.push(myFilm.genres[i]);
          }
          genres = genreList;

          if (
            myFilm.other_title != null &&
            myFilm.other_title != "" &&
            myFilm.other_title.language == "fr"
          ) {
            insererFilm(
              myFilm.title,
              myFilm.other_title.title,
              type,
              yearFilm,
              myFilm.poster,
              background,
              id,
              imdb,
              trailer,
              synopsis,
              duree,
              myFilm.notes.mean,
              myFilm.notes.total,
              genres
            );
          } else {
            insererFilm(
              myFilm.title,
              "",
              type,
              yearFilm,
              myFilm.poster,
              background,
              id,
              imdb,
              trailer,
              synopsis,
              duree,
              myFilm.notes.mean,
              myFilm.notes.total,
              genres
            );
          }

          addFav(favLabel2);
          //console.log("ajoute aux favs", favLabel2);
        } catch (error) {
          console.error(error);
        }
      }
    }
  });

  delFavLabel.addEventListener("DOMSubtreeModified", function () {
    if (
      delFavLabel.textContent != delFavLabel2 &&
      delFavLabel.textContent != ""
    ) {
      delFavLabel2 = delFavLabel.textContent;
      addFav(delFavLabel2);
    }
  });
}

validateBtn.style.display = 'none';
