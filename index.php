<!-- Rectifications / ajout / bugs / a faire: 
BUGS:
    - Mettre l'icone de favoris A JOUR quand on ouvre un film dans l'index
    - La video sur l'index est dispo mais impossible de l'afficher dans la recherhce, video disponible que sur le lecteur youtube
    - Impossible d'ouvrir les séries dans lesquelles une acteur a joué
    - Au moment de la venu sur le site, il est possible que les videos ne fonctionnent pas, end-seconds ?

RECTIFICATIONS:
    - Supprimer l'email de vérification et mdp oublié au bout de 10min
    - Quand on clique sur l'index pour réafficher l'index, il faut juste que ça réaffiche les infos mais que le clique soit pas pris en compte si par exemple on clique sur une image
    - Ne pas relancer le film si le meme film est déja lancé
    - Ajouter bouton editer sur le modal favoris
    
AMELIORATIONS:
    - Ajouter la petite étoile de favoris pour les retirer directement depuis l'onglet favoris
    - Option signaler un bug
    - Demande d'amélioration / changement
    - Possibilité de mettre vu sur un film et d'avoir un espace ou voir tous ses films vu
    - Trier les films par plateforme ( Netflix, Amazon Prime Video, Disney+ etc...)
    - Ajouter un ami et voir ses favoris, ses films vu, ses commentaires / notes...
    - Ajouter un tri par films par genre : exemple dans le dropdown : Action, Aventure, Comédie, Drame, Horreur, Science-fiction, Thriller, Western
    - Systeme de back-office avec gestion admin : 
        - Bannir un utilisateur de commentaires 

    - statistiques : 
        - nombre de commentaires 
        - nombre de films vu + bouton pour voir les films vu
        - nombre de temps passé sur le site

-->



<?php
session_start();
require_once "./bdd/dbconnect.php";
require_once "./bdd/bddmanager.php";

$data = selectUserById($_SESSION['id'], $db);


if (isset($_COOKIE['id']) || isset($_SESSION['id'])) {

    function displayAlert($alertClass, $alertMessage)
    {
        echo "<style>";
        echo ".alert { position: absolute; top: 12%; left: 50%; transform: translateX(-50%); z-index: 999; width: fit-content; opacity: 1; transition: opacity 0.5s ease-in-out; }";
        echo "@media (max-width: 767px) { .alert { width: 80%; text-align: center; } }";
        echo "</style>";
        echo "<div class='alert $alertClass' role='alert'>$alertMessage</div>";
        echo "<script>setTimeout(function(){ var alert = document.querySelector('.alert'); alert.style.opacity = '0'; setTimeout(function(){ alert.style.display = 'none'; }, 500); }, 8000);</script>";
    }

    if (isset($_GET["success"])) {
        $success = $_GET["success"];
        if ($success == 1) {
            displayAlert("alert-success", "Votre compte a bien été crée.");
        }
    }

    if (isset($_GET["error"])) {
        $error = $_GET["error"];
        switch ($error) {
            case 1:
                displayAlert("alert-danger", "Une erreur est survenue.");
                break;
            case 2:
                displayAlert("alert-danger", "Veuillez mettre votre mot de passe pour confirmer la suppression.");
                break;
            case 3:
                displayAlert("alert-danger", "Mot de passe incorrect.");
                break;
            default:
                break;
        }
    }
    $allFavs = array(); // Initialisation de la variable $allFavs

    $favoris = getFavorisIdFilmsByUserId($_SESSION['id'], $db);
    foreach ($favoris as $favori) {
        $id_film = $favori['id_du_media'];
        array_push($allFavs, $id_film); // Ajouter l'ID du film à $allFavs
    }

    /*  $durations = getFilmVuDurationOfUser($_SESSION['id'], $db);

    $seconds = 0; // Initialise la variable $seconds à zéro

    foreach ($durations as $duration) {
        $seconds += intval($duration); // Convertit la durée en nombre entier avant de l'ajouter
    }

    $days = floor($seconds / (60 * 60 * 24)); // Nombre de jours complets
    $seconds -= $days * (60 * 60 * 24); // Soustrait les secondes correspondant aux jours

    $hours = floor($seconds / (60 * 60)); // Nombre d'heures complètes
    $seconds -= $hours * (60 * 60); // Soustrait les secondes correspondant aux heures

    $minutes = floor($seconds / 60); // Nombre de minutes complètes
    $seconds -= $minutes * 60; // Soustrait les secondes correspondant aux minutes

    // Affichage des résultats
    echo "Durée totale : $days jours, $hours heures, $minutes minutes, $seconds secondes"; */
?>

    <!DOCTYPE html>
    <html lang="fr">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cinérama: accueil</title>
        <meta name="description" content="Recherche d'un film/série à regarder ?" />
        <!-- <link href="reset.css" rel="stylesheet" type="text/css"> -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
        <script src=" https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js "></script>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css" />

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
        <link href="./style/style.css" rel="stylesheet" type="text/css">
        <link href="./style/responsive.css" rel="stylesheet" type="text/css">
        <link rel="icon" type="image/x-icon" href="imgs/favicon.ico" />

    </head>

    <body class="dark-bg">
        <header>
            <?php include 'navbar.php'; ?>
        </header>

        <main>
            <div id="lecteur-container">
                <div id="player"></div>
            </div>
            <div class="background_index">
                <div class="background_image"></div>
                <div class="d-flex justify-content-start ms-1">
                    <p class="ms-2 indexFilmTitle"></p>
                </div>
                <div id="progress-bar-container">
                    <p class="pbTextVolume text-white me-1">Volume</p>
                    <div id="progress-bar" class="me-2"></div>
                </div>

                <img src="./imgs/b logo.png" alt="img_logo_B" class="content" id="B_logo">
                <h1 class="text-white indexType content"></h1>
                <h2 class="text-white indexTitle content">CHARGEMENT EN COURS</h2>
                <h3 class="text-white indexLookType content"></h3>
                <p class="text-white fs-5 indexSynopsis content" id="desc"></p>
                <button class="content expandButton btn btn-secondary">Lire la suite</button>

                <div class="firstCarousel content">
                    <div id="myCarousel" class="carousel slide" data-bs-ride="carousel">
                        <div class="d-flex d-gender">
                            <h4 class="text-white fs-2 filmGender content">Films par genre :</h4>
                            <div class="dropdown ms-3 z-3 content">
                                <button class="btn border border-1 dropdown-toggle text-white" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Genres
                                </button>
                                <ul class="dropdown-menu multi-column columns-3 bg-dark text-white dropdown-menu-scroll">
                                    <!-- <ul class="dropdown-menu multi-column columns-3 bg-dark text-white"> -->
                                    <div class="row">
                                        <div class="col-sm-4">
                                            <ul class="multi-column-dropdown">
                                                <li><a href="#" class="text-white genre-button" data-genre="Action">Action</a></li>
                                                <li><a href="#" class="text-white genre-button" data-genre="Animation">Animation</a></li>
                                                <li><a href="#" class="text-white genre-button" data-genre="Aventure">Aventure</a></li>
                                                <li><a href="#" class="text-white genre-button" data-genre="Comedie">Comédie</a></li>
                                                <li><a href="#" class="text-white genre-button" data-genre="Crime">Crime</a></li>
                                                <li><a href="#" class="text-white genre-button" data-genre="Documentaire">Documentaire</a></li>
                                            </ul>
                                        </div>
                                        <div class="col-sm-4">
                                            <ul class="multi-column-dropdown">
                                                <li><a href="#" class="text-white genre-button" data-genre="Drame">Drame</a></li>
                                                <li><a href="#" class="text-white genre-button" data-genre="Familial">Familial</a></li>
                                                <li><a href="#" class="text-white genre-button" data-genre="Fantastique">Fantastique</a></li>
                                                <li><a href="#" class="text-white genre-button" data-genre="Guerre">Guerre</a></li>
                                                <li><a href="#" class="text-white genre-button" data-genre="Histoire">Histoire</a></li>
                                                <li><a href="#" class="text-white genre-button" data-genre="Horreur">Horreur</a></li>
                                            </ul>
                                        </div>
                                        <div class="col-sm-4">
                                            <ul class="multi-column-dropdown">
                                                <li><a href="#" class="text-white genre-button" data-genre="Musique">Musique</a></li>
                                                <li><a href="#" class="text-white genre-button" data-genre="Mystere">Mystère</a></li>
                                                <li><a href="#" class="text-white genre-button" data-genre="Romance">Romance</a></li>
                                                <li><a href="#" class="text-white genre-button" data-genre="Science-Fiction">Science-Finction</a></li>
                                                <li><a href="#" class="text-white genre-button" data-genre="Thriller">Thriller</a></li>
                                                <li><a href="#" class="text-white genre-button" data-genre="Western">Western</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </ul>
                            </div>
                        </div>

                        <button class="carousel-control-prev previous" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <div class="carousel-inner"></div>
                        <button class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>



            <!-- <div class="secondCarousel content">
                <div id="myCarousel2" class="carousel slide">
                    <h4 class="text-white fs-2 favTitle content">Ajoutés aux favoris :</h4>
                    <button class="carousel-control-prev previous prevCar2" type="button" data-bs-target="#myCarousel2" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <div class="carousel-inner2"></div>
                    <button class="carousel-control-next nextCar2" type="button" data-bs-target="#myCarousel2" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div> -->

            <img src="./imgs/carrousels background.png" alt="gradient_background" class="w-100 position-absolute start-0 bgcar content">
            <p type="hidden" class="favLabel"></p>
            <p type="hidden" class="delFavLabel"></p>
            <p type="hidden" class="allFavs">
                <?php
                foreach ($allFavs as $fav) {
                    echo $fav . ", "; // Afficher chaque ID de film suivi d'une virgule
                }
                ?>
            </p>
            <!-- <h5 class="position-absolute text-white fs-2 serieGender">Séries du moment</h5> -->
        </main>

        <!-- <footer class="content fixed-bottom"> -->
        <!--     <footer class="content">
        <div>
            <a href="https://www.youtube.com/?hl=FR" target="_blank"><img src="./imgs/youtube.png" alt=""
                    class="position-relative z-3 w-10 m-2 bigger"></a>
            <a href="https://fr-fr.facebook.com/" target="_blank"><img src="./imgs/facebook.png" alt=""
                    class="position-relative z-3 w-5 m-2 bigger"></a>
            <a href="https://www.instagram.com/" target="_blank"><img src="./imgs/instagram.png" alt=""
                    class="position-relative z-3 w-10 m-2 bigger"></a>
            <a href="https://twitter.com/?lang=fr" target="_blank"><img src="./imgs/twitter.png" alt=""
                    class="position-relative z-3 w-10 m-2 bigger"></a>
        </div>
        <p class="text-white z-3 fs-5 position-sticky">© 2022-2023 Cinérama, Inc.</p>
    </footer> -->

        <script type="module" src="./scripts/script.js"></script>
        <script src="https://www.youtube.com/iframe_api"></script>
        <script src="./scripts/createCarousel.js"></script>
        <script type="module" src="./scripts/popUp.js"></script>
    </body>

    </html>
<?php
} else {
    require "connexion_view.php";
}
?>