<?php

/*             $movies = array();
            foreach ($favoris as $favori) {
                $id_film = $favori['id_films'];
                $movie = getMoviesById($id_film, $db);
                $movies[] = $movie;
            } */


session_start();
require_once "./bdd/dbconnect.php";
require_once "./bdd/bddmanager.php";

$data = selectUserById($_SESSION['id'], $db);

$favoris = getFavorisByUserId($_SESSION['id'], $db);

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
            <div class="favList">
                <section class="section-film">
                    <h1 class="text-center favListTitle">Favoris</h1>
                    <div class="filmContainer">
                        <?php foreach ($favoris as $favori) {
                            $id_film = $favori['id_films'];
                            $movie = getMoviesById($id_film, $db);
                        ?>
                            <a href="#" class="imgFavLink">
                                <img src="<?= $movie['poster'] ?>" alt="<?= $movie['titre'] ?>" class="allImgs imgFav">
                            </a>


                        <?php } ?>
                    </div>

                </section>
            </div>

            <div id="background_research"></div>
            <div id="image-container"></div>
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