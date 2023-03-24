let seasonsTotal = [];
export function modalCreation(type, title, year, trailer, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, link, imdb, synopsisModal, synopsis, duree, background, api_key) {
    if (type == "film" || type == "movie") {
        modalTitle.textContent = `${title} - ${year}`;

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
            videoFrame.setAttribute("src", `https://www.youtube.com/embed/${trailer}`);
            videoFrame.style.marginTop = "1.25rem";
        }

        seasonsSelect.style.display = "none"
        episodesSelect.style.display = "none"
        validateBtn.textContent = `Streaming`;
        validateBtn.classList.remove("btn-danger");
        validateBtn.classList.add("btn-primary");
        async function checkStreamFilm() {
            try {
                let url = `https://www.g2stream.com/api/status?imdb=${imdb}&type=movie`;
                const Response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
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
                console.log(Data)
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
            videoFrame.setAttribute("src", `https://www.dailymotion.com/embed/video/${trailer}`);
            videoFrame.style.marginTop = "1.25rem";
        }
        seasonsSelect.style.display = "block"
        episodesSelect.style.display = "block"
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
                seasonsTotal = data.show.seasons_details
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
            let seasonNum = parseInt(selectedSeason.split(' ')[1]);

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
            let seasonNum = parseInt(selectedSeason.split(' ')[1]);

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
            let seasonNum = parseInt(selectedSeason.split(' ')[1]);

            saison = seasonNum;
            link = link.replace(/&sea=\d+/, `&sea=${saison}`);
            link = link.replace(/&epi=\d+/, `&epi=1`);
            let selectedEpisode = episodesSelect.value;
            let episodenNum = parseInt(selectedEpisode.split(' ')[1]);
            episode = episodenNum;
            validateBtn.setAttribute("data-link", link);
            checkStream();
        });

        episodesSelect.addEventListener("change", function () {
            let selectedEpisode = this.value;
            let episodenNum = parseInt(selectedEpisode.split(' ')[1]);
            episode = episodenNum;
            link = link.replace(/&epi=\d+/, `&epi=${episode}`);
            validateBtn.setAttribute("data-link", link);
            checkStream();
        });

        //Check si l'épisode existe ou peut être lu
        async function checkStream() {
            try {
                let url = `https://www.g2stream.com/api/status?imdb=${imdb}&sea=${saison}&epi=${episode}&type=tv`;
                const Response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
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
                console.log(Data)
            } catch (error) {
                console.error(error);
            }
        }
        checkStream();
    }
    validateBtn.setAttribute("data-link", link);
    linkYtbBtn.setAttribute("data-link", `https://www.youtube.com/results?search_query=${title}+trailer+fr+`);
    synopsisModal.textContent = synopsis;

    if (type == "film" && duree != 0) {
        //Récupération de la durée du film
        let dureeFilm = document.createElement("p");
        dureeFilm.classList.add("dureeFilm");
        synopsisModal.appendChild(dureeFilm);

        const secondes = duree;
        const heures = Math.floor(secondes / 3600); // Nombre d'heures
        const minutes = Math.floor((secondes % 3600) / 60); // Nombre de minutes
        let temps = "";
        minutes == 0 ? temps = `${heures}h` : temps = `${heures}h${minutes}`;
        dureeFilm.textContent = `Durée du film : ${temps}`
    } else {
        let deleteDureeFilm = document.getElementsByClassName("dureeFilm");
        if (deleteDureeFilm.length > 0) {
            deleteDureeFilm[0].remove();
        }
    }
    //validateBtn.style.display = "none";
}

export function createEditAdminModal(mediaInfo) {

    console.log('ADMIN MODAL', mediaInfo)
  
        const editAdminModal = document.createElement("div");
        editAdminModal.classList.add("modal", "adminModal");
        editAdminModal.style.display = "block";
        const maxZIndex = Math.max(
            ...Array.from(document.querySelectorAll('*'))
                .map((el) => parseFloat(getComputedStyle(el).zIndex))
                .filter((z) => !isNaN(z))
        );
        console.log(maxZIndex)
        editAdminModal.style.zIndex = maxZIndex + 1;
    
        const editAdminModalContent = document.createElement("div");
        editAdminModalContent.classList.add("modal-content");
        editAdminModalContent.style.backgroundColor = "#333333";
        editAdminModalContent.style.boxShadow = "rgb(255, 255, 255) 1px 0 0.625rem";
        editAdminModalContent.style.padding = "2rem";
    
        const modalTitle = document.createElement("h4")
        modalTitle.textContent = `Modification de ${mediaInfo.title}`;
        modalTitle.style.color = "white";
        modalTitle.style.marginBottom = "1rem";
        modalTitle.style.borderBottom = "1px solid white";
        modalTitle.style.paddingBottom = "1rem";
        editAdminModalContent.appendChild(modalTitle);

        const pTitle = document.createElement("h5")
        pTitle.textContent = `Titre :`;
        pTitle.style.color = "orange";
        editAdminModalContent.appendChild(pTitle);

        const mediaTitle = document.createElement("input");
        mediaTitle.value = mediaInfo.title;
        mediaTitle.style.marginBottom = "1rem";
        editAdminModalContent.appendChild(mediaTitle);

        const pAnnee = document.createElement("h5")
        pAnnee.textContent = `Année :`;
        pAnnee.style.color = "orange";
        editAdminModalContent.appendChild(pAnnee);

        const mediaAnnee = document.createElement("input");
        mediaAnnee.value = mediaInfo.production_year;
        mediaAnnee.style.marginBottom = "1rem";
        editAdminModalContent.appendChild(mediaAnnee);

        const pBa = document.createElement("h5")
        pBa.textContent = `Bande-Annonce :`;
        pBa.style.color = "orange";
        editAdminModalContent.appendChild(pBa);

        const mediaBa = document.createElement("input");
        mediaBa.value = mediaInfo.trailer;
        mediaBa.style.marginBottom = "1rem";
        editAdminModalContent.appendChild(mediaBa);

        const pSynopsis = document.createElement("h5")
        pSynopsis.textContent = `Synopsis :`;
        pSynopsis.style.color = "orange";
        editAdminModalContent.appendChild(pSynopsis);

        const mediaSynopsis = document.createElement("textarea");
        mediaSynopsis.value = mediaInfo.synopsis;
        mediaSynopsis.style.marginBottom = "1rem";
        editAdminModalContent.appendChild(mediaSynopsis);

        const pDuree = document.createElement("h5")
        pDuree.textContent = `Durée :`;
        pDuree.style.color = "orange";
        editAdminModalContent.appendChild(pDuree);

        const mediaDuree = document.createElement("input");
        mediaDuree.value = mediaInfo.length;
        mediaDuree.style.marginBottom = "1rem";
        editAdminModalContent.appendChild(mediaDuree);

        const pPoster = document.createElement("h5")
        pPoster.textContent = `Poster :`;
        pPoster.style.color = "orange";
        editAdminModalContent.appendChild(pPoster);

        const mediaPoster = document.createElement("input");
        mediaPoster.value = mediaInfo.poster;
        mediaPoster.style.marginBottom = "1rem";
        editAdminModalContent.appendChild(mediaPoster);

        const pBackdrop = document.createElement("h5")
        pBackdrop.textContent = `Backdrop :`;
        pBackdrop.style.color = "orange";
        editAdminModalContent.appendChild(pBackdrop);

        const mediaBackdrop = document.createElement("input");
        mediaBackdrop.value = mediaInfo.backdrop;
        mediaBackdrop.style.marginBottom = "1rem";
        editAdminModalContent.appendChild(mediaBackdrop);

        if (mediaInfo.platforms_svod.length > 0) {
            const pSvod = document.createElement("h5")
            pSvod.textContent = `SVODS :`;
            pSvod.style.color = "orange";
            pSvod.style.marginBottom = "1rem";
            editAdminModalContent.appendChild(pSvod);
    
            mediaInfo.platforms_svod.forEach(function(platform) {
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

        }

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Valider";
        saveBtn.classList.add("btn", "btn-success");
        saveBtn.addEventListener("click", function () {
            
        });
        editAdminModalContent.appendChild(saveBtn);
    
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "X";
        closeBtn.classList.add("btn", "btn-danger");
        closeBtn.style.width = "2.2rem";
        closeBtn.style.float = "right";
        closeBtn.addEventListener("click", function () {
            editAdminModal.style.display = "none";
        });
        editAdminModal.appendChild(closeBtn);

        editAdminModal.appendChild(editAdminModalContent)
        document.body.appendChild(editAdminModal)   
    
}

