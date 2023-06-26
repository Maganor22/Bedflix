<?php
session_start();
require_once '../bdd/dbconnect.php';
require_once '../bdd/bddmanager.php';

// Déterminer quelle requête a été appelée
if (isset($_GET['requete'])) {
    $requete = $_GET['requete'];

    // Exécuter la requête appropriée
    switch ($requete) {
        case 'selectUserById':
            $dataUser = selectUserById($_SESSION['id'], $db);
            echo json_encode($dataUser);
            break;

        case 'selectProfilPictures':
            $dataPp = selectProfilPictures($db);
            echo json_encode($dataPp);
            break;

        case 'selectFilm':
            $dataFilm = selectFilm($_GET['id_du_media'], $db);
            echo json_encode($dataFilm);
            break;

        case 'selectGenre':
            $dataGenre = selectGenre($_GET['genres'], $db);
            echo json_encode($dataGenre);
            break;

        case 'insertFilm':
            $dataInsertFilm = insertFilm($_POST['titre'], $_POST['titre_fr'], $_POST['type'], $_POST['annee'], $_POST['poster'], $_POST['affiche'], $_POST['id_du_media'], $_POST['imdb'], $_POST['ba'], $_POST['synopsis'], $_POST['duree'], $_POST['note'], $_POST['nbNote'], $_POST['genre'], $db);
            echo json_encode($dataInsertFilm);
            break;

        case 'updateFilm':
            $dataUpdateFilm = updateFilm($_POST['titre'], $_POST['titre_fr'], $_POST['annee'], $_POST['poster'], $_POST['affiche'], $_POST['ba'], $_POST['synopsis'], $_POST['duree'], $_POST['genre'], $_POST['id_du_media'], $db);
            echo json_encode($dataUpdateFilm);
            break;

        case 'updateAvatar':
            $dataUpdateAvatar = updateAvatar($_POST['photo_profil'], $_SESSION['id'], $db);
            echo json_encode($dataUpdateAvatar);
            break;

        case 'insertSerie':
            $dataInsertSerie = insertSerie($_POST['titre'], $_POST['annee'], $_POST['poster'], $_POST['affiche'], $_POST['id_du_media'], $_POST['imdb'], $_POST['ba'], $_POST['synopsis'], $_POST['genre'], $_POST['nombre_saisons'], $db);
            //$_POST[ 'nombre_episodes_par_saison' ], $db );
            echo json_encode($dataInsertSerie);
            break;

        case 'addFav':
            $dataAddFav = addFav($_GET['id_user'], $_GET['id_media'], $db);
            echo json_encode($dataAddFav);
            break;

        case 'checkFav':
            $dataCheckFav = checkFav($_GET['id_user'], $_GET['id_media'], $db);
            echo json_encode($dataCheckFav);
            break;

        case 'delFav':
            $dataDelFav = delFav($_GET['id_user'], $_GET['id_media'], $db);
            echo json_encode($dataDelFav);
            break;

        case 'addFilmVu':
            $dataFilmVu = addFilmVu($_GET['id_user'], $_GET['id_media'], $_GET['fav'], $db);
            echo json_encode($dataFilmVu);
            break;

        case 'checkFilmVu':
            $dataCheckFilmVu = checkFilmVu($_GET['id_user'], $_GET['id_media'], $db);
            echo json_encode($dataCheckFilmVu);
            break;

        case 'getAvatar':
            $dataGetAvatar = getAvatar($_SESSION['id'], $db);
            echo json_encode($dataGetAvatar);
            break;

        case 'insertActorBase':
            $dataInsertActorBase = insertActorBase($_POST['nom'], $_POST['alias'], $_POST['id_films'], $_POST['age'], $_POST['dNaissance'], $_POST['poster'], $_POST['biographie'], $db);
            echo json_encode($dataInsertActorBase);
            break;

        case 'selectActorsByIdFilm':
            $dataActorsByIdFilm = selectActorsByIdFilm($_GET['id_films'], $db);
            echo json_encode($dataActorsByIdFilm);
            break;

        case 'setComments':
            $dataSetComments = setComments($_POST['user'], $_POST['picture'], $_POST['note'], $_POST['date'], $_POST['commentaire'], $_POST['id_films'], $db);
            echo json_encode($dataSetComments);
            break;

        case 'getComments':
            $dataGetComments = getComments($_GET['id_media'], $db);
            echo json_encode($dataGetComments);
            break;

        case 'getRandomBackground':
            $background = getRandomBackground($db);
            echo json_encode($background);
            break;

        case 'addUserComment':
            $dataAddUserComment = addUserComment($_POST['note'], $_POST['commentaire'], $_POST['id_films'], $_POST['id_user'], $db);
            echo json_encode($dataAddUserComment);
            break;

        case 'getDurationFilm':
            $duration = getFilmVuDurationOfUser($_GET['id_user'], $db);
            echo json_encode($duration);
            break;

        case 'checkBanUser':
            $checkBanUser = checkBanComment($_GET['id_user'], $db);
            echo json_encode($checkBanUser);
            break;

        default:
            echo json_encode(array('message' => 'Requête invalide'));
            break;
    }
} else {
    echo json_encode(array('message' => 'Aucune requête spécifiée'));
}
