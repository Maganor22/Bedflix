<?php
session_start();
require_once "../bdd/dbconnect.php";
require_once "../bdd/bddmanager.php";

$prenom = $_POST['prenom'];
$nom = $_POST['nom'];
$email = $_POST['email'];
$pseudo = $_POST['pseudo'];
$passwordActuel = $_POST['passwordActuel'];
$password = $_POST['password'];
$passwordConfirm = $_POST['passwordConfirm'];
$photo_profil = $_POST['photo_profil'];
$id = $_SESSION['id'];

if (!isset($_SESSION['id'])) {
    //header("Location: ../index.php?error=1");
    $_SESSION["error"] = "Erreur 1";
    exit(json_encode($_SESSION['error']));
}

if (!isset($passwordActuel) || empty($passwordActuel)) {
    //header("Location: ../index.php?error=2");
    $_SESSION["error"] = "Erreur 2";
    exit($_SESSION['error']);
}

$selectUser = $db->prepare("SELECT * FROM utilisateurs WHERE id = :id");
$selectUser->execute(array(
    'id' => $id
));
$selectUser = $selectUser->fetch();

if (!$selectUser || !password_verify($passwordActuel, $selectUser['mdp'])) {
    $_SESSION['error'] = "Erreur 3";
    exit($_SESSION['error']);
}



if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $_SESSION["error"] = "Erreur 4";
    exit($_SESSION['error']);
}
/* if (!preg_match("/^[a-zA-ZÀ-ÖØ-öø-ÿ]{3,}$/u", $pseudo) && !empty($pseudo)) {
    //$_SESSION["error"] = "Le pseudo doit contenir au moins 3 caractères et ne doit contenir que des lettres et des espaces.";
    $_SESSION["error"] = "Erreur 5";
    //header("Location: ../index.php?error=6");
    exit($_SESSION['error']);
} */
if (!preg_match("/^[a-zA-Z0-9À-ÖØ-öø-ÿ]{3,}$/u", $pseudo) && !empty($pseudo)) {
    $_SESSION["error"] = "Erreur 5";
    exit($_SESSION['error']);
}
if (!preg_match("/^[a-zA-ZÀ-ÖØ-öø-ÿ -]{2,}$/u", $nom) && !empty($nom)) {
    //$_SESSION["error"] = "Le nom doit contenir au moins 2 caractères et ne doit contenir que des lettres et des espaces.";
    $_SESSION["error"] = "Erreur 6";
    //header("Location: ../index.php?error=7");
    exit($_SESSION['error']);
}
if (!preg_match("/^[a-zA-ZÀ-ÖØ-öø-ÿ -]{2,}$/u", $prenom) && !empty($prenom)) {
    //$_SESSION["error"] = "Le prénom doit contenir au moins 2 caractères et ne doit contenir que des lettres et des espaces.";
    $_SESSION["error"] = "Erreur 7";
    //header("Location: ../index.php?error=8");
    exit($_SESSION['error']);
}

if (!empty($password)) {
    if (!preg_match('/^(?=.*[A-Z])(?=.*[\W])(?=.*[a-z]).{8,}$/', $password)) {
        //$_SESSION["error"] = "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial";
        $_SESSION["error"] = "Erreur 8";
        //header("Location: ../index.php?error=9");
        exit($_SESSION['error']);
    }
    if ($password !== $passwordConfirm) {
        //$_SESSION["error"] = "Les mots de passe ne correspondent pas";
        $_SESSION["error"] = "Erreur 9";
        //header("Location: ../index.php?error=10");
        exit($_SESSION['error']);
    }
    $result = $db->prepare("UPDATE utilisateurs SET prenom = :prenom, nom = :nom, email = :email, pseudo = :pseudo, mdp = :mdp, photo_profil = :photo_profil WHERE id = :id");
    $result->execute(array(
        'prenom' => $prenom,
        'nom' => $nom,
        'email' => $email,
        'pseudo' => $pseudo,
        'mdp' => password_hash($password, PASSWORD_BCRYPT, array("cost" => 12)),
        'photo_profil' => $photo_profil,
        'id' => $id
    ));
    //header("Location: ../index.php?success=1");
}

$result = $db->prepare("UPDATE utilisateurs SET prenom = :prenom, nom = :nom, email = :email, pseudo = :pseudo, photo_profil = :photo_profil WHERE id = :id");
$result->execute(array(
    'prenom' => $prenom,
    'nom' => $nom,
    'email' => $email,
    'pseudo' => $pseudo,
    'photo_profil' => $photo_profil,
    'id' => $id
));
//header("Location: ../index.php?success=1");
