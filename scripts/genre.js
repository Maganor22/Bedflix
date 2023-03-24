/* DROPDOWN GENRE */
const genreButtons = document.querySelectorAll(".genre-button");


genreButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        const genreName = button.dataset.genre;
        defineGender(genreName);
    });
});


async function defineGender(genre) {
    let api_key = "2d216cf10e57";
    try {
        const movieResponse = await fetch(`https://api.betaseries.com/search/movies?key=${api_key}&genres=${genre}&limit=50`);
        const movieData = await movieResponse.json();
        //console.log(movieData)

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
        createCarousel(movieData, api_key);

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