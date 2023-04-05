<?php
session_start();
require_once "./bdd/dbconnect.php";
require_once "./bdd/bddmanager.php";

$data = selectUserById($_SESSION['id'], $db);

$favoris = getFavorisByUserId($_SESSION['id'], $db);

function convertToHHMM($seconds)
{
    $hours = floor($seconds / 3600);
    $minutes = floor(($seconds % 3600) / 60);
    return sprintf("%2dH%02d", $hours, $minutes);
}

function convertChars($thisChaine)
{
    $chaine = $thisChaine;
    $genres = explode(',', $chaine);
    $nouvelleChaine = implode(' - ', $genres);
    return $nouvelleChaine;
}





if (isset($_COOKIE['id']) || isset($_SESSION['id'])) {

?>

    <!DOCTYPE html>
    <html lang="fr">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bedflix: Favoris</title>
        <meta name="description" content="Recherche d'un film/série à regarder ?" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
        <script src=" https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js "></script>

        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css" />

        <link href="./style/style.css" rel="stylesheet" type="text/css">
        <link href="./style/responsive.css" rel="stylesheet" type="text/css">
        <link rel="icon" type="image/x-icon" href="imgs/favicon.ico" />
    </head>

    <body class="bg-dark">
        <header>
            <?php include 'navbar.php'; ?>
        </header>

        <main>
            <div class="favBg">
                <img src="./imgs/carrousels background.png" alt="gradient_background" class="w-100 position-fixed start-0 bgcar2">
            </div>
            <div class="favList">
                <section class="section-film">
                    <h1 class="text-center favListTitle">Favoris</h1>
                    <div class="filmContainer">
                        <?php foreach ($favoris as $favori) {
                            $id_film = $favori['id_films'];
                            $movie = getMoviesById($id_film, $db);
                            $duree = convertToHHMM($movie['duree']);
                            $genres = convertChars($movie['genre']);
                        ?>
                            <a href="#" class="imgFavLink" id="linkFav<?= $id_film ?>" data-bs-toggle="modal" data-bs-target="#<?= $id_film ?>" onmouseenter="$('.favBg').attr('style', 'background-image: url(\'<?= $movie['affiche'] ?>\')');">
                                <img src="<?= $movie['poster'] ?>" alt="<?= $movie['titre'] ?>" class="allImgs imgFav">
                            </a>

                            <div class="modal fade" id="<?= $id_film ?>" tabindex="-1" aria-labelledby="favoriteModal" aria-hidden="true">
                                <div class="modal-dialog modal-xl">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h2 class="modal-title text-white" id="favoriteModal"><?= $movie['titre'] . ' - ' . $movie['annee'] ?></h2>
                                            <div class="float-right">
                                                <button type="button" class="btn btn-secondary favBtn me-2" onclick="favBtn(<?= $id_film ?>)">
                                                    <i class="fas fa-star" style="color: gold;"></i>
                                                </button>
                                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal"> X </button>
                                            </div>
                                        </div>
                                        <div class="modal-body">
                                            <iframe allow="autoplay; encrypted-media" allowfullscreen height="500" width="100%" id="video" src="https://www.youtube.com/embed/<?= $movie['ba'] ?>"></iframe>

                                            <p class="synopsisModal"><?= $movie['synopsis'] ?></p>
                                            <p class="dureeFilm">Durée du film : <?= $duree ?></p>
                                            <p class="genreFilm">Genres : <?= $genres ?></p>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary">Save changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php } ?>
                    </div>

                </section>
            </div>


        </main>

        <script src="./scripts/modalFavoris.js"></script>
    </body>

    </html>
<?php
} else {
    header('Location: ./connexion-view.php');
    exit;
}
?>