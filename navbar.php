<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bedflix</title>
    <meta name="description" content="Recherche d'un film/série à regarder ?" />
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

<body>
    <nav class="navbar navbar-expand-lg fixed-top navbarContent">

        <div class="container-fluid navbarContent">
            <button class="navbar-toggler bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <a class="navbar-brand" href="index.php"><img src="./imgs/logo bedflix.png" alt="img_logo_bedflix" class="w-50 logo"></a>
            <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link text-light fs-4 fw-bold ms-5 me-5 resetIndex" aria-current="page" href="./index.php">Accueil</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-light fs-4 ms-5 me-5 resetIndex researchLink" href="./researchpage.php">Recherche</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-light fs-4 ms-5 me-5 resetIndex favLink" href="./favoris.php">Favoris</a>
                    </li>
                </ul>

                <form class="d-flex" role="search">
                    <div class="border border-2 rounded p-1 boxResearch">
                        <a href="#"><img src="./imgs/loupe.png" alt="img_search" id="reseachLink" class="me-2"></a>
                        <input style="border: none;" placeholder="Titre film/serie" class="text-white bg-transparent input_research w-75 h-100">
                    </div>
                </form>
                <!-- <a href="#"><img src="./imgs/Vector.png" alt="img_cloche" class="m-2" id="cloche"></a> -->
                <!-- <a href="#"><img src="./imgs/avatar.png" alt="img_avatar" class="m-2" id="avatar2"></a> -->

                <a href="#" id="avatar-container">
                    <img src="./imgs/avatars/<?= $data->photo_profil ?>" alt="img_avatar" class="m-2 avatar" id="avatar">
                </a>

                <div class="bg-dark" id="tooltip">
                    <?php if (!isset($_COOKIE['id']) && !isset($_SESSION['id'])) { ?>
                        <a href="./connexion-view.php" id="connect">Connexion / Inscription</a>
                    <?php
                    } else { ?>
                        <p class="text-white" id="hiMe">Bonjour <?= htmlspecialchars($_SESSION['pseudo']) ?></p>
                        <hr>
                        <div><a href="#" id="userParams">Paramètres</a></div>
                        <a href="../Bedflix/fonctions/deconnexion.php" id="deconnect">Se déconnecter</a>
                    <?php } ?>
                </div>
            </div>
        </div>
    </nav>


</body>

</html>