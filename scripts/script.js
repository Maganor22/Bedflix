import { createPlatformLinks, createSvod, createGoogleSearch, createStars, createComments, createActors } from './createPlatforms.js';
import { modalCreation, createEditAdminModal } from './modal.js';
//import { createCarousel } from './createCarousel.js' 
import { afficherPopUp, cacherPopUp } from './popUp.js';

let searchResults = JSON.parse(sessionStorage.getItem("searchResults")); //films
let searchResults2 = JSON.parse(sessionStorage.getItem("searchResults2")); //series
let searchResults3 = JSON.parse(sessionStorage.getItem("searchResults3")); //Dropdown trailer ou all

let searchResultsDropdown = JSON.parse(sessionStorage.getItem("searchResultsDropdown"));
let searchResultsDropdownSelectText = JSON.parse(sessionStorage.getItem("searchResultsDropdownSelectText"));
let searchResultsDropdownSelect = JSON.parse(sessionStorage.getItem("searchResultsDropdownSelect"));
let searchResultsDropdownSelectNews = JSON.parse(sessionStorage.getItem("searchResultsDropdownSelectNews"));

console.log("Films : ", searchResults);
console.log("Series : ", searchResults2);
console.log("Value du dropdown : ", searchResultsDropdown);
console.log("Value du dropdownSelect : ", searchResultsDropdownSelectText);
console.log("Films aléatoires : ", searchResultsDropdownSelect);
console.log("Series aléatoires : ", searchResultsDropdownSelectNews);

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



/* Au moment de la recherche, fait un 

SELECT name_research FROM FILMS, 

if (name_research) { //Si le texte de la recherche est trouvé
    SELECT info_films, name_film FROM FILMS WHERE name_research = name_film //Selectionne tous les films avec ce nom
}else{ 
    Fetch api //Fetch sur l'api beta serie
    INSERT INTO FILMS(infos_film, name_film etc..)
    VALUES(...)
} */


let nameFilm;
let yearFilm;
let nameSerie;
let yearSerie;
let urlStream;
let trailer;
let type;
let background;
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
let platformLink;
let platformSvod;
let id;
let comment;
let boxResearch = document.querySelector(".boxResearch");


/* BOUTON AVATAR */

const avatarContainer = document.getElementById('avatar-container');
const tooltip = document.getElementById('tooltip');
const imgAvatar = document.getElementById('avatar');
let isMouseOverTooltip = false;

/* avatarContainer.addEventListener('click', function (event) {
    event.preventDefault();
}); */

avatarContainer.addEventListener('mouseenter', function (event) {
    imgAvatar.style.transform = "scale(1.2)";
    imgAvatar.style.transition = "transform 200ms ease-in-out";
    tooltip.style.display = "block";
    setTimeout(() => {
        tooltip.style.transition = "opacity 200ms ease-in-out";
        tooltip.style.opacity = 1;
        tooltip.style.right = "1.2rem"
        tooltip.style.top = avatarContainer.offsetTop + avatarContainer.offsetHeight + 'px';
    }, 100);
});

avatarContainer.addEventListener('mouseleave', function (event) {
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

tooltip.addEventListener('mouseenter', function (event) {
    isMouseOverTooltip = true;
});

tooltip.addEventListener('mouseleave', function (event) {
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

const serieAnchor = document.createElement("a");
serieAnchor.setAttribute("href", "#section-serie");
serieAnchor.setAttribute("id", "serieAnchor");
serieAnchor.innerText = "v Séries v";


let dropdown = document.createElement("select");
dropdown.classList.add("btn", "btn-secondary", "dropdown-toggle", "dropdownsTop");
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

    if (dropdownSelect.value === "fiveFilms" || dropdownSelect.value === "fiveNews") {
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

dropdown.value = searchResultsDropdown
if (dropdown.value == "") {
    let option1 = document.createElement("option");
    option1.value = "all";
    option1.text = "Tout afficher";
    dropdown.add(option1);
}


let dropdownSelect = document.createElement("select");
dropdownSelect.classList.add("btn", "btn-secondary", "dropdown-toggle", "dropdownsTop");

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
dropdownSelect.value = searchResultsDropdownSelectText
if (dropdownSelect.value == "") {
    let option1 = document.createElement("option");
    option1.value = "nothing";
    option1.text = "Sélectionner";
    dropdownSelect.add(option1);
}
//}



// Scroll Event Listener 
if (document.location.pathname === "../researchPage.html" || document.location.pathname === "/Bedflix/researchPage.html") {
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
sectionFilm.setAttribute("id", "section-film");
app.appendChild(sectionFilm);

const dropdownSection = document.createElement("div");
dropdownSection.classList.add("dropdown-section");
sectionFilm.appendChild(dropdownSection);


const actuBtn = document.createElement("button")
actuBtn.classList.add("btn", "btn-secondary", "dropdownsTop", "actuBtn")
actuBtn.innerText = "🗘"

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
})

const filmContainer = document.createElement("div");
filmContainer.classList.add("filmContainer");
sectionFilm.appendChild(filmContainer);
/*
const aloo = document.createElement("h1");
aloo.style.marginTop = "20px";
aloo.style.marginLeft = "50px"
aloo.style.fontSize = "50px"
aloo.style.color = "red"
sectionFilm.appendChild(aloo);

setInterval(() => {
    if (window.matchMedia("(orientation: portrait)").matches) {
        aloo.textContent = window.innerWidth + " X " + window.innerHeight + " portrait";
    } else if (window.matchMedia("(orientation: landscape)").matches) {
        aloo.textContent = window.innerWidth + " X " + window.innerHeight + " paysage";
    }
}, 1000); */
//mon tel 412 * 828

const serieTitle = document.createElement("img");
serieTitle.classList.add("hide-title", "serieTitle");
serieTitle.setAttribute("src", "./imgs/series.png");
serieTitle.setAttribute("alt", "serie_title");
const sectionSerie = document.createElement("section");
sectionSerie.appendChild(serieTitle);
app.appendChild(sectionSerie);
sectionSerie.setAttribute("id", "section-serie");
//sectionSerie.style.marginLeft = "-30px"

const serieContainer = document.createElement("div");
serieContainer.classList.add("serieContainer");

sectionSerie.appendChild(serieContainer);

/* const background_research = document.createElement("div");
background_research.style.backgroundImage = "url(``)"; */
const background_research = document.createElement("img");
background_research.src = "";
background_research.setAttribute("alt", "fond")
background_research.style.objectFit = "cover";


background_research.classList.add("background_research");
/* background_research.style.opacity = "0"; */
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

const modalHeader = document.createElement("div");
modalHeader.classList.add("modal-header");
modalContent.appendChild(modalHeader);

/* const modalBackground = document.createElement("img");
modalBackground.classList.add("modal-background");
modalContent.appendChild(modalBackground); */

const modalTitle = document.createElement("h2");
modalTitle.style.color = "white";
modalTitle.style.textAlign = "left"; // Aligner le titre à gauche
modalTitle.textContent = "Titre de la modale";
modalHeader.appendChild(modalTitle);

const divBtns = document.createElement("div");
divBtns.classList.add("divBtns");
divBtns.style.display = "flex";
divBtns.style.justifyContent = "space-between";
divBtns.style.float = "right";
divBtns.style.gap = "1rem";
modalHeader.appendChild(divBtns);


const closeBtn = document.createElement("button");
closeBtn.textContent = "X";
closeBtn.classList.add("btn", "btn-danger");



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
    let deletePlatLink = document.querySelectorAll(".platLinkElements")
    for (let i = 0; i < deletePlatLink.length; i++) {
        deletePlatLink[i].remove();
    }
    //Supprime les éléments du SVOD
    let deleteSvod = document.querySelectorAll(".svodElements")
    for (let i = 0; i < deleteSvod.length; i++) {
        deleteSvod[i].remove();
    }
    //Supprime les votes
    let deleteStars = document.querySelectorAll(".stars")
    for (let i = 0; i < deleteStars.length; i++) {
        deleteStars[i].remove();
    }
    setTimeout(function () {
        modal.classList.remove("fadeOut")
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
parentElement.classList.add("d-flex")

const seasonsSelect = document.createElement("select");
seasonsSelect.classList.add("btn", "btn-secondary", "dropdown-toggle", "seasonsSelect");
parentElement.appendChild(seasonsSelect);

const seasons = [];
seasons.forEach(season => {
    const option = document.createElement("option");
    option.value = season;
    option.textContent = season;
    seasonsSelect.appendChild(option);
});

//Création du dropdown des épisodes
const episodesSelect = document.createElement("select");
episodesSelect.classList.add("btn", "btn-secondary", "dropdown-toggle", "episodesSelect");
parentElement.appendChild(episodesSelect);

const episodes = [];
episodes.forEach(episode => {
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
    if (document.location.pathname === "/researchPage.html" || document.location.pathname === "/Bedflix/researchPage.html") {
        title.style.display = "block";
    } else {
        title.style.display = "none";
    }
});


function createDomImg(src, count, link, type, trailer, title, background, synopsis, year, imdb, platformLink, platformSvod, duree, note, id, comment, myMedia) {
    const a = document.createElement("a");
    a.href = "#";
    a.style.width = "fit-content"
    container.appendChild(a);

    const img = document.createElement("img");
    img.src = src;
    img.setAttribute("id", `affiche${count}`);
    img.classList.add("allImgs");
    img.setAttribute("data-link", link);
    img.setAttribute("alt", title);
    a.appendChild(img);

    if (screen.width < 480) {
        img.style.margin = "1.25rem 0.625rem 0 0.625rem";
    } else {
        img.style.margin = "1.875rem 0.9375rem 0 0.9375rem";
    }
    img.style.width = "18.75rem";
    img.style.height = "26.8125rem";
    container.style.marginTop = "0px";

    if (type == "film") {
        filmContainer.appendChild(a);
    } else {
        serieContainer.appendChild(a);
    };

    background_research.addEventListener("transitionstart", function () {
        isTransitioning = true;
    });
    background_research.addEventListener("transitionend", function () {
        isTransitioning = false;
    });

    img.style.transition = "transform 0.2s ease-in-out, opacity 0.2s ease-in-out, box-shadow 0.2s ease-in-out";
    img.addEventListener("mouseenter", async function () {
        afficherPopUp(img, title, year);
        isMouseOver = true;
        img.style.transform = "scale(1.1)";
        img.style.opacity = "1";
        img.style.boxShadow = "rgb(255, 255, 255) 0.0625rem 0 1.5625rem";
        if (background_research.src != "" && background_research != null && background !== "" && background != null) {
            if (!isTransitioning) {
                if (isMouseOver) {
                    background_research.style.opacity = "1";
                    background_research.src = background;
                }
            } else {
                //await new Promise(resolve => setTimeout(resolve, 1000));
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
        document.body.style.overflow = "hidden";
        document.querySelector('a').addEventListener('click', function (event) {
            event.preventDefault();
        });
        modalInformations();
        function modalInformations() {

            linkYtbBtn.setAttribute("data-link", `https://www.youtube.com/results?search_query=${title}+trailer+fr+`);

            //Empeche le background de remonter tout en haut de la page
            const elements = document.querySelectorAll('a[href="#"], button[type="submit"]');
            elements.forEach(element => {
                element.addEventListener('click', event => {
                    event.preventDefault();
                    modal.style.display = "block";
                });
            });

            modal.style.display = "block";
            modalBg.style.backgroundImage = `url(${background})`;
            modalBg.style.backgroundSize = "cover";
            //modalContent.style.backgroundImage = `url(${background})`;
            modalContent.style.backgroundSize = "cover";
            //modalBackground.setAttribute("src", background);
            //modalBackground.style.backgroundImage = `url(${background})`;


            validateBtn.classList.remove("btn-danger");
            validateBtn.classList.add("btn-primary");
            validateBtn.textContent = "Streaming";


            //Fonction de création de note
            createStars(note, modalContent, id, type, title, comment);

            //Fonction de création des commentaires
            createComments(id, type, title, comment, modalContent);

            //Fonction de création des acteurs
            createActors(id, type, title, modalContent, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, synopsisModal, background, modal, modalContent);

            //Fonction de création des plateformes 
            createPlatformLinks(platformLink, modalContent);

            //Fonction de création des liens de streaming
            createSvod(platformSvod, modalContent);

            //Fonction de création de la recherche google
            createGoogleSearch(platformLink, platformSvod, title, type, year, modalContent);

            //Fonction de création du modal
            modalCreation(type, title, year, trailer, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, link, imdb, synopsisModal, synopsis, duree, background, api_key);

            //Fonction de création du bouton d'édition du média
            createAdminEditButton(id, myMedia);

            //Fonction de création du bouton favoris
            createFavButton(id);



            /*         setInterval(() => {
            
                        if (screen.width < 480) {
                            console.log("test")
                            background_research.style.width = window.innerWidth;
                            background_research.style.height = window.innerHeight;
                            background_research.style.objectFit = "cover";
                        }
                        console.log(window.innerWidth)
                        console.log(background_research)
                    }, 1000); */
        }
    });
}


validateBtn.addEventListener("click", function () {
    const selectedImg = this.getAttribute("data-link");
    var video = document.getElementById("video");
    var src = video.src;
    video.src = src.substring(0) + "?autoplay=0";
    window.open(selectedImg, "_blank");
});

linkYtbBtn.addEventListener("click", function () {
    const selectedImg = this.getAttribute("data-link");
    window.open(selectedImg, "_blank");
});


if (document.location.pathname === "/researchPage.html" || document.location.pathname === "/Bedflix/researchPage.html") {
    //Création de 5 films aléatoires
    if (searchResultsDropdownSelect) {
        if (searchResultsDropdownSelectText === 'fiveFilms' || searchResultsDropdownSelectText === 'fiveNews') {
            sectionFilm.style.display = "block";
            sectionSerie.style.display = "block";
            sectionFilm.style.marginTop = "6.25rem"
            let countFilms = 0;
            for (let films in searchResultsDropdownSelect.movies) {
                if (countFilms === 5) {
                    break; // Stop la boucle si on a déjà affiché 5 films avec poster
                }
                const myFilm = searchResultsDropdownSelect.movies[films];
                if (myFilm.poster != "" && myFilm.poster != null) {
                    if (myFilm.imdb_id != "" && myFilm.imdb_id != null) {
                        if (dropdown.value === "all" || (dropdown.value === "trailer" && myFilm.trailer != null)) {
                            if (myFilm.other_title != null && myFilm.other_title != "" && myFilm.other_title.language == "fr") {
                                nameFilm = myFilm.other_title.title
                            } else {
                                nameFilm = myFilm.title
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
                            duree = myFilm.length
                            note = myFilm.notes;
                            id = myFilm.id;
                            comment = myFilm.comments;
                            createDomImg(myFilm.poster, films, urlStream, type, trailer, nameFilm, background, synopsis, yearFilm, imdb, platformLink, platformSvod, duree, note, id, comment, myFilm);
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
                        if (dropdown.value === "all" || (dropdown.value === "trailer" && mySerie.next_trailer != null)) {
                            nameSerie = mySerie.original_title;
                            yearSerie = mySerie.creation;
                            type = "serie";
                            urlStream = `https://www.g2stream.com/stream/series?imdb=${imdb}&language=fr&sea=1&epi=1`;
                            trailer = mySerie.next_trailer;
                            background = mySerie.images.show;
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
                            createDomImg(mySerie.images.poster, series, urlStream, type, trailer, nameSerie, background, synopsis, yearSerie, imdb, platformLink, platformSvod, duree, note, id, comment, mySerie);
                            countSeries++;
                        }
                    }
                }
            }
        }
    } else if (searchResults) {
        //Création des films par la fonction recherche
        sectionFilm.style.display = "block";
        sectionSerie.style.marginTop = "0px"
        for (let films in searchResults.movies) {
            const myFilm = searchResults.movies[films];
            if (dropdown.value === "all" || (dropdown.value === "trailer" && myFilm.trailer != null)) {
                if (myFilm.poster != "" && myFilm.poster != null) {
                    if (myFilm.other_title != null && myFilm.other_title != "" && myFilm.other_title.language == "fr") {
                        nameFilm = myFilm.other_title.title
                    } else {
                        nameFilm = myFilm.title
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
                    duree = myFilm.length
                    note = myFilm.notes;
                    id = myFilm.id;
                    comment = myFilm.comments;
                    createDomImg(myFilm.poster, films, urlStream, type, trailer, nameFilm, background, synopsis, yearFilm, imdb, platformLink, platformSvod, duree, note, id, comment, myFilm);
                }
            }
        }
    } else {
        if (!searchResultsDropdownSelect) {
            sectionFilm.style.display = "none";
        }
        sectionSerie.style.marginTop = "6.25rem"
    }
    if (searchResults2) {
        //Création des séries par la fonction recherche
        sectionSerie.style.display = "block";
        sectionFilm.style.marginTop = "0px"
        for (let series in searchResults2.shows) {
            const mySerie = searchResults2.shows[series]
            if (dropdown.value === "all" || (dropdown.value === "trailer" && mySerie.next_trailer != null)) {
                if (mySerie.images.poster != "" && mySerie.images.poster != null) {
                    nameSerie = mySerie.original_title;
                    yearSerie = mySerie.creation;
                    imdb = mySerie.imdb_id;
                    type = "serie";
                    urlStream = `https://www.g2stream.com/stream/series?imdb=${imdb}&language=fr&sea=1&epi=1`;
                    trailer = mySerie.next_trailer;
                    background = mySerie.images.show;
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
                    createDomImg(mySerie.images.poster, series, urlStream, type, trailer, nameSerie, background, synopsis, yearSerie, imdb, platformLink, platformSvod, duree, note, id, comment, mySerie);
                }
            }
        }
    } else {
        if (!searchResultsDropdownSelect) {
            sectionSerie.style.display = "none";
        }
        sectionFilm.style.marginTop = "6.25rem"
    }
}


async function research() {
    if (!researchtxt) {
        researchFiveFilms();
        dropdownSelect.value = "fiveFilms";
        /*  boxResearch.style.setProperty("border-color", "red", "important");
         setTimeout(() => {
             boxResearch.style.setProperty("border-color", "white", "important");
         }, "600") */
        return;
    }
    try {

        const movieResponse = await fetch(`https://api.betaseries.com/movies/search?title=${researchtxt}&key=${api_key}&nbpp=100`);
        const showResponse = await fetch(`https://api.betaseries.com/shows/search?title=${researchtxt}&key=${api_key}&nbpp=100`);
        const movieData = await movieResponse.json();
        const showData = await showResponse.json();

        sessionStorage.clear();

        if (!movieData.movies.length && !showData.shows.length) {
            alert("Aucun film/série n'a été trouvé.");
        } else {
            if (movieData.movies.length > 0) {
                sessionStorage.setItem("searchResults", JSON.stringify(movieData));
            }
            if (showData.shows.length > 0) {
                sessionStorage.setItem("searchResults2", JSON.stringify(showData));
            }
            sessionStorage.setItem("searchResults3", JSON.stringify(researchtxt));
            sessionStorage.setItem("searchResultsDropdown", JSON.stringify(dropdown.value));
            window.location.href = "./researchPage.html";
        }
    } catch (error) {
        console.error(error);
    }
}

async function researchFiveFilms() {
    try {
        const movieResponse = await fetch(`https://api.betaseries.com/movies/random?key=${api_key}&nb=50`);
        const movieData = await movieResponse.json();
        const showsResponse = await fetch(`https://api.betaseries.com/shows/random?key=${api_key}&nb=50`);
        const showsData = await showsResponse.json();

        sessionStorage.clear();

        if (movieData.movies.length > 0) {
            sessionStorage.setItem("searchResultsDropdownSelect", JSON.stringify(movieData));
        }
        if (showsData.shows.length > 0) {
            sessionStorage.setItem("searchResultsDropdownSelectNews", JSON.stringify(showsData));
        }

        sessionStorage.setItem("searchResultsDropdownSelectText", JSON.stringify(dropdownSelect.value));
        sessionStorage.setItem("searchResultsDropdown", JSON.stringify(dropdown.value));
        window.location.href = "./researchPage.html";

    } catch (error) {
        console.error(error);
    }
}

async function researchFiveNews() {
    try {
        const movieResponse = await fetch(`https://api.betaseries.com/movies/list?key=${api_key}&order=recent&limit=20`);
        const movieData = await movieResponse.json();
        const showResponse = await fetch(`https://api.betaseries.com/shows/list?key=${api_key}&order=recent&limit=20`);
        const showData = await showResponse.json();

        sessionStorage.clear();

        if (movieData.movies.length > 0) {
            sessionStorage.setItem("searchResultsDropdownSelect", JSON.stringify(movieData));
            sessionStorage.setItem("searchResultsDropdownSelectNews", JSON.stringify(showData));
        }

        sessionStorage.setItem("searchResultsDropdownSelectText", JSON.stringify(dropdownSelect.value));
        sessionStorage.setItem("searchResultsDropdown", JSON.stringify(dropdown.value));
        window.location.href = "./researchPage.html";

    } catch (error) {
        console.error(error);
    }
}

if (document.location.pathname === "../index.html" || document.location.pathname === "/Bedflix/index.html" || document.location.pathname === "/index.html") {

    //Génère un genre aléatoire
    const genres = ["Comédie", "Drame", "Crime", "Horreur", "Action", "Aventure", "Fantastique", "Animation", "Science-Fiction", "Documentaire", "Romance", "Western", "Thriller", "Familial", "Mystère", "Guerre", "Histoire", "Musique"];
    const randomIndex = Math.floor(Math.random() * genres.length);
    const genre = genres[randomIndex];

    randomGender();
    async function randomGender() {
        try {
            const movieResponse = await fetch(`https://api.betaseries.com/search/movies?key=${api_key}&genres=${genre}&limit=50`);
            const movieData = await movieResponse.json();

            console.log(movieData)
            const randomMovieIds = [];
            while (randomMovieIds.length < 20) {
                const randomMovieIndex = Math.floor(Math.random() * movieData.movies.length);
                const randomMovieId = movieData.movies[randomMovieIndex].id;
                if (!randomMovieIds.includes(randomMovieId)) {
                    randomMovieIds.push(randomMovieId);
                }
            }

            console.log(randomMovieIds)
            const movies = await Promise.all(randomMovieIds.map(async id => {
                const movieResponse = await fetch(`https://api.betaseries.com/movies/movie?key=${api_key}&id=${id}`);
                const movieData = await movieResponse.json();
                return movieData.movie;
            }));

            if (movies.length > 0) {
                const randomIndex = Math.floor(Math.random() * movies.length);
                const randomMovie = movies[randomIndex];

                let titleGender = document.querySelector(".filmGender");
                titleGender.textContent = `Films par genre : ${genre}`;

                const backgroundImageElement = document.querySelector('.background_image');
                backgroundImageElement.style.backgroundImage = `url(${randomMovie.backdrop})`;
                backgroundImageElement.style.opacity = 0.5;

                const indexType = document.querySelector(".indexType");
                indexType.textContent = "Film";

                const indexTitle = document.querySelector(".indexTitle");
                if (randomMovie.other_title != null && randomMovie.other_title != "" && randomMovie.other_title.language == "fr") {
                    indexTitle.textContent = randomMovie.other_title.title;
                } else {
                    indexTitle.textContent = randomMovie.title;
                }

                const indexLookType = document.querySelector(".indexLookType");
                indexLookType.textContent = "Le regarder maintenant !";

                const indexSynopsis = document.querySelector(".indexSynopsis");
                indexSynopsis.textContent = randomMovie.synopsis;

                createCarousel({ movies }, api_key, seasonsSelect, episodesSelect, validateBtn, linkYtbBtn, videoFrame);
            }
        } catch (error) {
            console.error(error);
        }
    }

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
            research()
        } else {
            window.location.href = "./researchPage.html";
        }
    });

});
if (document.location.pathname === "/researchPage.html" || document.location.pathname === "/Bedflix/researchPage.html") {
    dropdown.style.display = "block";
    dropdownSelect.style.display = "block";
} else {
    sectionFilm.style.display = "none";
    sectionSerie.style.display = "none";
    dropdown.style.display = "none";
    dropdownSelect.style.display = "none";
}


export function createAdminEditButton(id, myMedia) {
    // Vérifie si le bouton existe déjà
    if (document.getElementById(`myAdminEditBtn${id}`)) {
        document.getElementById(`myAdminEditBtn${id}`).style.display = "block";
        return;
    }

    let allbtns = document.querySelectorAll(".myAdminEditBtn");
    allbtns.forEach(btn => {
        btn.style.display = "none";
    });

    const editBtn = document.createElement("button");
    editBtn.classList.add("btn", "btn-warning", "myAdminEditBtn", "fas", "fa-pen");
    editBtn.setAttribute("id", `myAdminEditBtn${id}`);

    divBtns.appendChild(editBtn);

    const myEditBtn = document.getElementById(`myAdminEditBtn${id}`);

    console.log("BOUTON EDIT ", myMedia)
    myEditBtn.addEventListener("click", function () {
        //affiche la modal d'édition du film
        createEditAdminModal(myMedia);
    });
}

export function createFavButton(id) {
    // Vérifie si le bouton editer existe déjà
    if (document.getElementById(`myFavBtn${id}`)) {
        document.getElementById(`myFavBtn${id}`).style.display = "block";
        return;
    }

    let allbtns = document.querySelectorAll(".favBtn");
    allbtns.forEach(btn => {
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
        myStarFav.style.color === "gold" ? myStarFav.style.color = "white" : myStarFav.style.color = "gold";
    });
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