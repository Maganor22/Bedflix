function favBtn(id_media) {
    //Selectionne le link de l'image du film et le supprime
    const link = document.getElementById(`linkFav${id_media}`);
    link.remove();

    //Selectionne le bouton de fermeture du modal et simule un clique pour la fermer
    let closeButton = document.querySelector('[data-bs-dismiss="modal"]');
    closeButton.click();

    //Envoie de la requete PHP pour supprimer le film des favoris de l'utilisateur
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let info_user = JSON.parse(this.responseText);
            let id_user = info_user.id;
            console.log(id_media)
            fetch(`../Bedflix/fonctions/requetes.php?requete=delFav&id_user=${id_user}&id_media=${id_media}`)
                .then(response => response.json())
                .catch(error => {
                    console.error(`Une erreur s'est produite:`, error);
                });
        }
    };
    xhttp.open("GET", "../Bedflix/fonctions/endpoint.php", true);
    xhttp.send();
}