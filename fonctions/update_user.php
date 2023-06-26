<?php
//On démarre la session puis on se connecte à la base de données grace à dbconnect, puis on inclut le manager de la base de données
session_start();
require_once "../bdd/dbconnect.php";
require_once "../bdd/bddmanager.php";

//On récupère les données du formulaire et on les stocke dans des variables
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
    //Erreur en rapport avec l'id de la session, utilisateur déconnecté
    $_SESSION["error"] = "Erreur 1";
    exit(json_encode($_SESSION['error']));
}

if (!isset($passwordActuel) || empty($passwordActuel)) {
    //Le mot de passe est requis
    $_SESSION["error"] = "Erreur 2";
    exit($_SESSION['error']);
}

//Si il n'y a pas d'erreurs, on vérifie que l'utilisateur existe bien et que le mot de passe est correct
$selectUser = $db->prepare("SELECT * FROM utilisateurs WHERE id = :id");
$selectUser->execute(array(
    'id' => $id
));
$selectUser = $selectUser->fetch();

if (!$selectUser || !password_verify($passwordActuel, $selectUser['mdp'])) {
    //Mot de passe incorrect
    $_SESSION['error'] = "Erreur 3";
    exit($_SESSION['error']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    //Email incorrect
    $_SESSION["error"] = "Erreur 4";
    exit($_SESSION['error']);
}

/* ^ : Début de la chaîne.
[a-zA-Z0-9À-ÖØ-öø-ÿ] : Un caractère alphanumérique ou un caractère accentué. Les lettres de l'alphabet (majuscules et minuscules), les chiffres de 0 à 9 et certains caractères accentués sont autorisés.
{3,} : Représente une quantité, dans ce cas précis, il indique que le motif précédent ([a-zA-Z0-9À-ÖØ-öø-ÿ]) doit se répéter au moins 3 fois.
$ : Fin de la chaîne.
/u : Modificateur "u" qui indique que le texte est encodé en UTF-8. Cela permet de gérer correctement les caractères accentués. */

if (!preg_match("/^[a-zA-Z0-9À-ÖØ-öø-ÿ]{3,}$/u", $pseudo) && !empty($pseudo)) {
    //Le pseudo doit contenir au moins 3 caractères et ne doit contenir que des lettres et des espaces.
    $_SESSION["error"] = "Erreur 5";
    exit($_SESSION['error']);
}
if (!preg_match("/^[a-zA-ZÀ-ÖØ-öø-ÿ -]{2,}$/u", $nom) && !empty($nom)) {
    //"Le nom doit contenir au moins 2 caractères et ne doit contenir que des lettres et des espaces.";
    $_SESSION["error"] = "Erreur 6";
    exit($_SESSION['error']);
}
if (!preg_match("/^[a-zA-ZÀ-ÖØ-öø-ÿ -]{2,}$/u", $prenom) && !empty($prenom)) {
    //"Le prénom doit contenir au moins 2 caractères et ne doit contenir que des lettres et des espaces.";
    $_SESSION["error"] = "Erreur 7";
    exit($_SESSION['error']);
}

if (!empty($password)) {
    if (!preg_match('/^(?=.*[A-Z])(?=.*[\W])(?=.*[a-z]).{8,}$/', $password)) {
        //"Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial";
        $_SESSION["error"] = "Erreur 8";
        exit($_SESSION['error']);
    }
    if ($password !== $passwordConfirm) {
        //"Les mots de passe ne correspondent pas";
        $_SESSION["error"] = "Erreur 9";
        exit($_SESSION['error']);
    }
    //Si il n'y a pas d'erreurs, et que la case du nouveau mot de passe n'est pas vide, on met à jour le mot de passe et le sinformations de l'utilisateur
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
} else {
    //Sinon si il n'y a pas d'erreurs et que la case du nouveau mot de passe est vide, on met à jour les informations de l'utilisateur
    $result = $db->prepare("UPDATE utilisateurs SET prenom = :prenom, nom = :nom, email = :email, pseudo = :pseudo, photo_profil = :photo_profil WHERE id = :id");
    $result->execute(array(
        'prenom' => $prenom,
        'nom' => $nom,
        'email' => $email,
        'pseudo' => $pseudo,
        'photo_profil' => $photo_profil,
        'id' => $id
    ));
}

