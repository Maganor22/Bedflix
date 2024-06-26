const background = document.querySelector(".background_image");
const backgroundPause = document.querySelector(".background_index");
let timeoutContent;
const carousel = document.querySelector("#myCarousel .carousel-inner");
const nav = document.querySelector(".navbarContent");
const contentElements = document.querySelectorAll('.content');
let isPlaying;
let duree;
let note;
let nbNotes;
let platformSvod;
let platformLink;
let date;
const indexTitle = document.querySelector(".indexTitle");
let starsTitle = document.createElement("h5");
let isOverElement;

// 1. Définir les variables nécessaires
let player;

// 2. Charger l'API Player IFrame de YouTube
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. Créer l'iframe YouTube
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: '',
        playerVars: { 'autoplay': 1, 'controls': 0 },
        //playerVars: { 'autoplay': 1 },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. Démarrer la vidéo lorsque le player est prêt
function onPlayerReady(event) {
    document.getElementById("player").style.display = "none";
    event.target.stopVideo();
    isPlaying = "end";
}

// 5. Arrêter la vidéo lorsque la lecture est terminée
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        isPlaying = "play";
        console.log(isPlaying)
        background.style.opacity = 0
        document.getElementById("player").style.opacity = 1;
        document.getElementById("player").style.display = "block";
        hideElements();
        checkLengthTrailer();
    } else if (event.data == YT.PlayerState.PAUSED) {
        isPlaying = "pause";
        console.log(isPlaying)
        clearInterval(displayInterval);
    } else if (event.data == YT.PlayerState.ENDED) {
        isPlaying = "end";
        console.log(isPlaying)
        displayElements();
        player.stopVideo();
        document.getElementById("player").style.display = "none";
        clearInterval(displayInterval);
    } else {
        clearInterval(displayInterval);
    }
}

function stopVideo() {
    player.stopVideo();
}

function changeVideo(trailer) {
    console.log(player.getVideoUrl())
    if (player.getVideoUrl() != undefined || player.getVideoUrl() != "none" || player.getVideoUrl() != "undefined" || player.getVideoUrl() != null) {
        if (!player.getVideoUrl().includes(trailer)) {
            player.loadVideoById(trailer, 0, "large");
            player.playVideo();
            player.setVolume(30);
            /*             setTimeout(() => {
                            document.getElementById("player").style.display = "none";
                        }, 1000); */
        }
    }
}

function displayElements() {
    isOverElement = true
    clearTimeout(timeoutContent);
    carousel.style.opacity = 1;
    carousel.style.transition = "opacity 0.5s ease-in-out";
    nav.style.opacity = 1;
    nav.style.transition = "opacity 0.5s ease-in-out";
    contentElements.forEach(element => {
        element.style.opacity = '1';
        element.style.transition = "opacity 0.5s ease-in-out";
    });
    if (isPlaying == "pause" || isPlaying == "end") {
        document.getElementById("player").style.display = "none";
        background.style.opacity = 0.5;
        background.style.transition = "opacity 0.5s ease-in-out";
    } else {
        background.style.opacity = 0;
        background.style.transition = "opacity 0.5s ease-in-out";
    }
}

function hideElements() {
    if (isPlaying == "pause" || isPlaying == "end") {
        background.style.opacity = 0.5;
    } else {
        background.style.opacity = 0;
    }

    timeoutContent = setTimeout(async () => {
        if (isPlaying == "play" && isOverElement == false) {
            contentElements.forEach(element => {
                element.classList.add("fadeout")
                element.style.transition = 'opacity 2s'; // Définit une transition de 0.5 seconde pour la propriété opacity
                element.style.opacity = '0'; // Change l'opacité à 0
            });
            carousel.style.transition = 'opacity 2s'; // Définit une transition de 0.5 seconde pour la propriété opacity
            carousel.style.opacity = 0.1;
            nav.style.transition = 'opacity 2s'; // Définit une transition de 0.5 seconde pour la propriété opacity
            nav.style.opacity = 0.1;
            if (isPlaying == "pause") {
                background.style.opacity = 1;
            }
        }
    }, 3000);
}

let displayInterval;
function checkLengthTrailer() {
    if (
        player.getVideoUrl() != undefined ||
        player.getVideoUrl() != "none" ||
        player.getVideoUrl() != "undefined" ||
        player.getVideoUrl() != null
    ) {
        let lengthTrailer = player.getDuration();
        let currentTime = player.getCurrentTime();
        /*         console.log(player.getDuration());
                console.log(player.getCurrentTime()); */
        displayInterval = setInterval(() => {
            currentTime = player.getCurrentTime();
            // Vérifier si currentTime est égal à (lengthTrailer - 5)
            if (currentTime >= lengthTrailer - 5) {
                displayElements();
                document.getElementById("player").style.transition = 'opacity 3s'; // Définit une transition de 0.5 seconde pour la propriété opacity
                document.getElementById("player").style.opacity = 0;
                setTimeout(() => {
                    player.stopVideo();
                    stopVideo()
                    player.loadVideoById("");
                    clearInterval(displayInterval);
                    background.style.opacity = 0.5;
                    background.style.transition = "opacity 0.5s ease-in-out";
                    isPlaying = "end";
                }, 3000);
                clearInterval(displayInterval);
            }
        }, 500);
    }
}


function createCarousel(movieData, api_key, movieData2) {
    console.log("movie data2", movieData2)
    console.log(movieData.movies)
    const moviesPerSlide = 5;
    const fetchedMovieData = {}; // Tableau pour stocker les fetchs de chaque film
    let timeoutId;

    document.getElementById("player").style.display = "none";
    let fullCarousel = document.querySelector(".carousel-inner");

    for (let i = 0; i < movieData.movies.length; i += moviesPerSlide) {
        // Création de l'élément de diapositive du carousel dans le HTML
        const slide = document.createElement("div");
        slide.classList.add("carousel-item");
        if (i === 0) {
            slide.classList.add("active");
        }
        carousel.appendChild(slide);

        // Ajout des films à la diapositive
        for (let j = i; j < i + moviesPerSlide && j < movieData.movies.length; j++) {
            console.log(movieData)
            const movie = movieData.movies[j];

            if (movie.poster != null || movie.poster != "") {
                const img = document.createElement("img");
                img.classList.add("carouselImgs");
                img.src = movie.poster;
                img.alt = movie.title;
                let myFilm;
                //Attibue à l'image l'ID du film si movieData2.movie.id existe et que c'est un INT
                if (movieData2.movie && typeof movieData2.movie.id === 'number' && Number.isInteger(movieData2.movie.id)) {
                    img.setAttribute("id", movieData2.movie.id)
                    theFilm();
                    async function theFilm() {
                        try {
                            const movieResponse = await fetch(`https://api.betaseries.com/movies/movie?key=${api_key}&id=${movieData2.movie.id}`);
                            const myMovie = await movieResponse.json();
                            myFilm = myMovie.movie;
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }

                const btnFav = document.createElement("button");
                btnFav.classList.add("btn", "btn-secondary", "btn-sm", "fas", "fa-star", "btnFav", `btnFav${movie.id}`);
                btnFav.style.background = "transparent"
                //btnFav.style.marginLeft = "-4.6%";
                btnFav.style.marginLeft = img.offsetLeft - "3" + "%";

                btnFav.addEventListener("click", () => {
                    if (btnFav.style.color == "gold") {
                        btnFav.style.color = "white";
                        delFav(movie);
                        console.log(`${movie.title} retiré des favoris`);
                    } else {
                        btnFav.style.color = "gold";
                        addFav(movie);
                        console.log(`${movie.title} ajouté aux favoris`);
                    }
                });

                btnFav.addEventListener("mouseover", () => {
                    btnFav.style.transition = "transform 0.1s ease-in-out";
                    btnFav.style.transform = "scale(1.4)";
                });

                btnFav.addEventListener("mouseout", () => {
                    btnFav.style.transition = "transform 0.1s ease-in-out";
                    btnFav.style.transform = "scale(1)";
                });

                img.addEventListener("mouseover", hover);
                img.addEventListener("mouseout", mouseOut);
                nav.addEventListener("mouseover", displayElements, isOverElement = true);
                nav.addEventListener("mouseout", mouseOut, isOverElement = false);
                document.querySelectorAll(".content").forEach((element) => {
                    element.addEventListener("mouseover", displayElements, isOverElement = true);
                    element.addEventListener("mouseout", mouseOut, isOverElement = false);
                });
                //fullCarousel.addEventListener("mouseover", displayElements);
                //fullCarousel.addEventListener("mouseout", mouseOut);

                img.addEventListener("click", () => {
                    background.style.opacity = 0.1;
                    let trailer = movie.trailer;
                    if (trailer == undefined || trailer == "undefined") {
                        trailer = myFilm.trailer
                    }
                    document.getElementById("player").style.display = "block";
                    player.stopVideo();
                    changeVideo(trailer);
                    player.playVideo();
                });

                backgroundPause.addEventListener("click", function () {
                    if (isPlaying == "play") {
                        player.pauseVideo();
                        displayElements();
                    } else {
                        isOverElement = false;
                        player.playVideo();
                    }
                });

                function hover() {
                    img.style.transition = "transform 0.2s ease-in-out, opacity 0.2s ease-in-out, box-shadow 0.2s ease-in-out";
                    img.style.transform = "scale(1.1)";
                    img.style.opacity = "1";
                    isOverElement = true;

                    displayElements();

                    timeoutId = setTimeout(async () => {
                        // Vérification si les données du film ont déjà été récupérées
                        if (fetchedMovieData[movie.id]) {
                            displayMovieInfos(fetchedMovieData[movie.id]); // Affiche les informations du film
                            let title = fetchedMovieData[movie.id].movie.title;
                            let year = fetchedMovieData[movie.id].movie.production_year;
                            afficherPopUp(img, title, year);
                        } else {
                            const movieIDResponse = await fetch(`https://api.betaseries.com/movies/movie?key=${api_key}&id=${movie.id}`);
                            const movieIDData = await movieIDResponse.json();
                            fetchedMovieData[movie.id] = movieIDData; // Stocke le fetch dans le tableau
                            displayMovieInfos(movieIDData); // Affiche les informations du film
                            let title = movieIDData.movie.title;
                            let year = movieIDData.movie.production_year;
                            afficherPopUp(img, title, year);
                        }
                    }, 1);
                }

                function mouseOut() {
                    cacherPopUp();
                    isOverElement = false;
                    img.style.transform = "scale(1)";
                    img.style.opacity = "0.6";
                    clearTimeout(timeoutId);
                    hideElements();
                }

                // Création de l'élément de lien cliquable pour l'image
                const link = document.createElement("a");
                link.appendChild(img);
                link.appendChild(btnFav);

                // Ajout de l'image à la diapo
                slide.appendChild(link);
            }
        }
    }
}

function createSvodindex(movieData, indexLookType) {
    let movieSvod = movieData.movie.platforms_svod
    //console.log(movieSvod)
    if (movieSvod.length > 0) {
        const imagesContainer = document.createElement("div");
        imagesContainer.style.display = "flex";
        imagesContainer.style.marginRight = "0.625rem"; // Ajout de la marge entre les images
        indexLookType.appendChild(imagesContainer);

        for (let i = 0; i < movieSvod.length; i++) {
            const a = document.createElement("a");
            a.href = movieSvod[i].link_url;
            a.target = "_blank";
            a.style.display = "inline-block";
            a.style.marginRight = "0.625rem";
            a.style.marginBottom = "0.625rem";
            imagesContainer.appendChild(a);

            let imgSvod = document.createElement("img");
            imgSvod.classList.add("svodElements", "imgSvod")
            imgSvod.setAttribute("src", movieSvod[i].logo);
            imgSvod.style.width = "2.8rem"
            imgSvod.style.height = "2.8rem"
            imgSvod.style.margin = "0.2rem 0 -0.1rem 0"
            a.appendChild(imgSvod);
        }
    }
}


function createStars(note, nbNotes) {
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
    let halfStar = (notation % 1 >= 0.25 && notation % 1 <= 0.75);
    let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    style();
    if (note == 1 || note == 2 || note == 3 || note == 4 || note == 5) {
        if (nbNotes > 1) {
            starsTitle.innerHTML = "Note : " + note.toFixed(0) + " / 5 (" + nbNotes + " votes)";
        } else {
            starsTitle.innerHTML = "Note : " + note.toFixed(0) + " / 5 (" + nbNotes + " vote)";
        }
    } else {
        if (nbNotes > 1) {
            starsTitle.innerHTML = "Note : " + note.toFixed(2) + " / 5 (" + nbNotes + " votes)";
        } else {
            starsTitle.innerHTML = "Note : " + note.toFixed(2) + " / 5 (" + nbNotes + " vote)";
        }
    }

    indexTitle.appendChild(starsTitle);

    let stars = document.createElement("span");
    stars.classList.add("stars");
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








let currentImg; // Stock l'image actuelle

// Fonction pour afficher le popUp du film
function afficherPopUp(img, title, year) {
    // Création de l'élément de pop-up
    const popUp = document.createElement('div');
    popUp.classList.add('pop-up');
    popUp.textContent = `${title} - ${year}`;
    popUp.id = 'monPopUp';

    // Ajout de l'élément de pop-up au corps de la page
    document.body.appendChild(popUp);

    // Écouteur d'événement pour suivre les mouvements de la souris
    img.addEventListener('mousemove', deplacerPopUp);
}

// Fonction pour déplacer le pop-up avec la souris
function deplacerPopUp(event) {
    const popUp = document.querySelector('.pop-up');
    if (popUp) {
        // Utilisation de setTimeout pour limiter la fréquence de mise à jour de la position du pop-up
        clearTimeout(popUp.timerId); // annule le délai d'attente précédent (s'il existe)
        popUp.timerId = setTimeout(() => {
            popUp.style.top = (event.clientY + 0) + 'px'; // décaler le pop-up vers le bas de 15 pixels pour qu'il ne soit pas exactement sur la souris
            popUp.style.left = (event.clientX + 30) + 'px'; // décaler le pop-up vers la droite de 30 pixels pour qu'il soit un peu plus éloigné de la souris
        }, 10); // délai d'attente de 10 millisecondes
    }
}

// Fonction à exécuter lorsque la souris quitte l'élément
function cacherPopUp() {
    // Suppression de l'élément de pop-up s'il existe
    const popUp = document.getElementById('monPopUp');
    if (popUp) {
        document.body.removeChild(popUp);
        //popUp.removeEventListener('mousemove', deplacerPopUp); // supprimer l'écouteur d'événement
    }
}


let c2 = document.querySelector(".secondCarousel");
let fullCarousel = document.querySelector(".carousel-inner2");
let childCar = fullCarousel.firstElementChild;
// Vérifier si une diapositive active avec la classe carousel2 existe déjà


// variable pour stocker la liste des favoris
let favList = [];

function addFav(movie) {
    favList.push(movie);
    console.log("favList", favList);
    createSecCarousel(movie);
}

function delFav(movie) {
    const favImgs = document.querySelectorAll(".favImgs");
    favImgs.forEach(img => {
        if (img.alt === movie.title) {
            const slide = img.closest(".carousel-item");
            const index = Array.from(slide.children).indexOf(img.parentElement);
            slide.removeChild(slide.children[index]);
            favList.pop(movie)
            console.log("favList", favList);
            let favCarOne = document.querySelector(`.btnFav${movie.id}`)
            favCarOne.style.color = "white";
            // Si la diapo est vide, on la supprime et affiche la slide précédente
            if (slide.children.length === 0) {
                const prevSlide = slide.previousElementSibling;
                slide.parentElement.removeChild(slide);
                if (prevSlide) {
                    prevSlide.classList.add("active");
                }
            }
        }
    });
    let activeSlide = fullCarousel.querySelector(".carousel-item.active.carousel2");
    let slide;
    const otherSlide = document.querySelector(".carousel-item.carousel2:not(.active)");
    if (activeSlide && otherSlide) {
        slide = otherSlide.firstChild;
        activeSlide.appendChild(slide);
    }
    if (favList == "") {
        c2.style.display = "none";
    }
    updateArrows();
}

function updateArrows() {
    //Met à jour les flèches du carousel
    let prev = document.querySelector(".prevCar2");
    let next = document.querySelector(".nextCar2");
    if (favList.length > 5) {
        prev.style.display = "block";
        next.style.display = "block";
    } else {
        prev.style.display = "none";
        next.style.display = "none";
    }
}


function createSecCarousel(movieData, movieData2) {
    let api_key = "2d216cf10e57";
    const fetchedMovieData = {}; // Tableau pour stocker les fetchs de chaque film

    document.getElementById("player").style.display = "none";
    let activeSlide = fullCarousel.querySelector(".carousel-item.active.carousel2");
    let slide;


    let c2 = document.querySelector(".secondCarousel");
    c2.style.display = "flex";

    updateArrows();

    if (activeSlide) {
        if (activeSlide.children.length === 5) {
            const slides = document.querySelectorAll(".carousel-item.carousel2");
            for (let i = 0; i < slides.length; i++) {
                if (slides[i].children.length < 5) {
                    slide = slides[i];
                    break;
                }
            }
            if (!slide) {
                slide = document.createElement("div");
                slide.classList.add("carousel-item", "carousel2");
                fullCarousel.appendChild(slide);
            }

        } else {
            slide = activeSlide;
        }
    } else {
        slide = document.createElement("div");
        slide.classList.add("carousel-item", "active", "carousel2");
        fullCarousel.appendChild(slide);
    }


    const movie = movieData;

    if (movie.poster != null || movie.poster != "") {
        const img = document.createElement("img");
        img.classList.add("carouselImgs", "favImgs");
        img.src = movie.poster;
        img.alt = movie.title;

        const btnFav = document.createElement("button");
        btnFav.classList.add("btn", "btn-secondary", "btn-sm", "fas", "fa-star", "btnFav");
        btnFav.style.background = "transparent"
        btnFav.style.marginLeft = img.offsetLeft - "3" + "%";
        btnFav.style.color = "gold";

        btnFav.addEventListener("click", () => {
            delFav(movie);
        });

        btnFav.addEventListener("mouseover", () => {
            btnFav.style.transition = "transform 0.1s ease-in-out";
            btnFav.style.transform = "scale(1.4)";
        });

        btnFav.addEventListener("mouseout", () => {
            btnFav.style.transition = "transform 0.1s ease-in-out";
            btnFav.style.transform = "scale(1)";
        });

        img.addEventListener("mouseover", hover);
        img.addEventListener("mouseout", mouseOut);
        nav.addEventListener("mouseover", displayElements, isOverElement = true);
        nav.addEventListener("mouseout", mouseOut, isOverElement = false);

        img.addEventListener("click", () => {
            background.style.opacity = 0.1;
            let trailer = movie.trailer;
            document.getElementById("player").style.display = "block";
            changeVideo(trailer);
        });

        backgroundPause.addEventListener("click", function () {
            if (isPlaying == "play") {
                player.pauseVideo();
                displayElements();
            } else {
                player.playVideo();
            }
        });

        function hover() {
            img.style.transition = "transform 0.2s ease-in-out, opacity 0.2s ease-in-out, box-shadow 0.2s ease-in-out";
            img.style.transform = "scale(1.1)";
            img.style.opacity = "1";
            isOverElement = true;

            displayElements();

            timeoutId = setTimeout(async () => {
                const movie = movieData; // on prend le premier film dans la liste}
                // Vérification si les données du film ont déjà été récupérées
                if (fetchedMovieData[movie.id]) {
                    displayMovieInfos(fetchedMovieData[movie.id]); // Affiche les informations du film
                    let title = fetchedMovieData[movie.id].movie.title;
                    let year = fetchedMovieData[movie.id].movie.production_year;
                    afficherPopUp(img, title, year);
                } else {
                    const movieIDResponse = await fetch(`https://api.betaseries.com/movies/movie?key=${api_key}&id=${movie.id}`);
                    const movieIDData = await movieIDResponse.json();
                    fetchedMovieData[movie.id] = movieIDData; // Stocke le fetch dans le tableau
                    displayMovieInfos(movieIDData); // Affiche les informations du film
                    let title = movieIDData.movie.title;
                    let year = movieIDData.movie.production_year;
                    afficherPopUp(img, title, year);
                }
            }, 1);
        }


        function mouseOut() {
            cacherPopUp();
            isOverElement = false;
            img.style.transform = "scale(1)";
            img.style.opacity = "0.6";
            clearTimeout(timeoutId);
            hideElements();
        }

        // Création de l'élément de lien cliquable pour l'image
        const link = document.createElement("a");
        link.appendChild(img);
        link.appendChild(btnFav);

        // Ajout de l'image à la diapo
        slide.appendChild(link);
    }

}

// Affiche les informations du film
function displayMovieInfos(movie) {
    const myFilm = movie.movie
    background.style.backgroundImage = `url(${myFilm.backdrop})`;
    note = myFilm.notes.mean;
    nbNotes = myFilm.notes.total
    date = myFilm.production_year;
    duree = myFilm.length;

    if (myFilm.other_title != null && myFilm.other_title != "" && myFilm.other_title.language == "fr") {
        indexTitle.textContent = myFilm.other_title.title
    } else {
        indexTitle.textContent = myFilm.title;
    }

    const indexLookType = document.querySelector(".indexLookType");
    indexLookType.textContent = "Le regarder maintenant !";

    const indexSynopsis = document.querySelector(".indexSynopsis");
    indexSynopsis.textContent = myFilm.synopsis;

    createStars(note, nbNotes);
    createSvodindex(movie, indexLookType);


    if (duree != 0) {
        let duration = document.createElement("h5");
        duration.classList.add("content", "dureeFilm");
        indexTitle.appendChild(duration)

        const secondes = duree;
        const heures = Math.floor(secondes / 3600); // Nombre d'heures
        const minutes = Math.floor((secondes % 3600) / 60); // Nombre de minutes
        let temps = "";
        minutes == 0 ? temps = `${heures}h` : temps = `${heures}h${minutes}`;
        duration.textContent = `Durée du film : ${temps}`
    } else {
        let deleteDureeFilm = document.getElementsByClassName("dureeFilm");
        if (deleteDureeFilm.length > 0) {
            deleteDureeFilm[0].remove();
        }
    }
}














/* DROPDOWN GENRE */
const genreButtons = document.querySelectorAll(".genre-button");

genreButtons.forEach(button => {
    button.addEventListener("click", () => {
        /* event.preventDefault(); */
        const genreName = button.dataset.genre;
        defineGender(genreName);
    });
});


async function defineGender(genre) {
    let api_key = "2d216cf10e57";
    try {
        const movieResponse = await fetch(`https://api.betaseries.com/search/movies?key=${api_key}&genres=${genre}&limit=50`);
        const movieData = await movieResponse.json();

        const randomMovieIds = [];
        while (randomMovieIds.length < 20) {
            const randomMovieIndex = Math.floor(Math.random() * movieData.movies.length);
            const randomMovieId = movieData.movies[randomMovieIndex].id;
            if (!randomMovieIds.includes(randomMovieId)) {
                randomMovieIds.push(randomMovieId);
            }
        }

        const randomMovieId = randomMovieIds[Math.floor(Math.random() * randomMovieIds.length)];

        const movieResponse2 = await fetch(`https://api.betaseries.com/movies/movie?key=${api_key}&id=${randomMovieId}`);
        const movieData2 = await movieResponse2.json();
        const randomMovie = movieData2.movie;

        const carouselItems = document.querySelectorAll(".carousel-item");
        if (carouselItems.length > 0) {
            carouselItems.forEach(item => {
                item.remove();
            });
        }

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

        createSvod(movieData2, indexLookType);
        createCarousel(movieData, api_key, movieData2);
        console.log("RANDOM", randomMovieIds)


    } catch (error) {
        console.error(error);
    }
}

function createSvod(movieData, indexLookType) {
    let movieSvod = movieData.movie.platforms_svod
    console.log(movieSvod)
    if (movieSvod.length > 0) {
        const imagesContainer = document.createElement("div");
        imagesContainer.style.display = "flex";
        imagesContainer.style.flexWrap = "wrap";
        indexLookType.appendChild(imagesContainer);

        for (let i = 0; i < movieSvod.length; i++) {
            const a = document.createElement("a");
            a.href = movieSvod[i].link_url;
            a.target = "_blank";
            a.style.display = "inline-block";
            a.style.marginRight = "0.625rem";
            a.style.marginBottom = "0.625rem";
            imagesContainer.appendChild(a);

            let imgSvod = document.createElement("img");
            imgSvod.classList.add("svodElements", "imgSvod")
            imgSvod.setAttribute("src", movieSvod[i].logo);
            imgSvod.style.width = "2.8rem"
            imgSvod.style.height = "2.8rem"
            imgSvod.style.margin = "0.2rem 0 -0.1rem 0"
            a.appendChild(imgSvod);
        }
    }
}


/* FIN DROPDOWN GENRE */