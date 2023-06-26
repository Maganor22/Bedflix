<?php
session_start();
require_once "./bdd/dbconnect.php";
require_once "./bdd/bddmanager.php";

define("URL", str_replace("routes.php", "", (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[PHP_SELF]"));

try {
    if (isset($_GET['page'])) {
        $url = explode("/", filter_var($_GET['page']), FILTER_SANITIZE_URL);
    }
    // si GET page est vide on redirige vers l'accueil
    if (empty($url[0])) {
        require "cinerama";
    } else {
        //switch de GET page pour savoir vers quelle page renvoyer l'utilisateur
        switch ($url[0]) {

            case "fonctions":
                if ($url[1] == "deconnexion") {
                    require "./fonctions/deconnexion.php";
                    break;
                }

            case "validateComment":
                validateComment($url[1], $db);
                break;

            case "deleteComment":
                deleteComment($url[1], $db);
                break;

            case "banUserComment":
                banUserComment($url[1], $db);
                break;

            case "connexion":
                require "connexion_view.php";
                break;

            case "inscription":
                require "inscription_view.php";
                break;

            case "change_password":
                require "change_password_view.php";
                break;

            case "forgot_password":
                require "forgot_password_view.php";
                break;

            case "deconnexion":
                require "./fonctions/deconnexion.php";
                break;

            case "admin":
                require "admin.php";
                break;

            case "maintenance":
                require "maintenance.php";
                break;

            case "recherche":
                require "researchpage.php";
                break;

            case "favoris":
                require "favoris.php";
                break;

            case "accueil":
                require "index.php";
                break;


            default:
                throw new Exception("La page n'existe pas");
        }
    }
} catch (Exception $e) {
    echo $e->getMessage();
}
