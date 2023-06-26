<?php
session_start();
//Appel des fichiers nécessaires
require_once "../bdd/dbconnect.php";

//Définition des variables
$password = $_POST['password'];
$id = $_SESSION['id'];

//Vérification des données
if (!isset($_SESSION['id'])) {
    //Une erreur est survenue.);
    header("Location: ../index.php?error=1");
    exit();
}

if (!isset($_POST['password']) || empty($_POST['password'])) {
    //Veuillez mettre votre mot de passe pour confirmer la suppression.);
    header("Location: ../index.php?error=2");
    exit();
}
//Récupération de l'utilisateur grâce à l'id de la session
$selectUser = $db->prepare("SELECT * FROM utilisateurs WHERE id = :id");
$selectUser->execute(array(
    'id' => $id
));
$selectUser = $selectUser->fetch();

//Vérification du mot de passe
if (!$selectUser || !password_verify($password, $selectUser['mdp'])) {
    //Mot de passe incorrect;
    header("Location: ../index.php?error=3");
    exit();
}

//Suppression de l'utilisateur
$result = $db->prepare("DELETE FROM utilisateurs WHERE id = :id");
$result->execute(array(
    'id' => $id
));

//Déconnexion de l'utilisateur
header("Location: ./deconnexion");


