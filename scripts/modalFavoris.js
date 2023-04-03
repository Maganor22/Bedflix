/* function modalInformations() {

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
    modalContent.style.backgroundSize = "cover";


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
    modalCreation(type, title, year, trailer, backgroundModal, linkYtbBtn, videoFrame, modalTitle, seasonsSelect, episodesSelect, validateBtn, link, imdb, synopsisModal, synopsis, duree, background, api_key, genres);

    //Fonction de création du bouton d'édition du média
    createAdminEditButton(id, myMedia, type);

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
            }, 1000); 
} */