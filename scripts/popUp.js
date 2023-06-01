
// Fonction à exécuter lorsque la souris survole l'élément
function afficherPopUp(img, title, year) {
    if (screen.width < 768) return; // ne pas afficher le pop-up sur les petits écrans (smartphones, tablettes, etc.
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

export { afficherPopUp, cacherPopUp };