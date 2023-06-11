<?php
session_start();
require_once "../bdd/dbconnect.php";
require_once "../bdd/bddmanager.php";

if (!empty($_POST["identifier"]) && !empty($_POST["password"])) {

    $user = selectUser($_POST['identifier'], $db);


    if ($user) {
        // Vérification du mot de passe
        if (password_verify($_POST["password"], $user->mdp)) {
            if ($user->actif == 0) {
                header("Location: ../connexion-view.php?failed=3");
                exit();
            }
            $_SESSION['id'] = $user->id;
            $_SESSION['pseudo'] = $user->pseudo;
            $_SESSION['email'] = $user->email;
            $_SESSION['role'] = $user->role;
            if (!empty($_POST['remember'])) {
                setcookie('id', $user->id, time() + 31556926, null, null, true, true);
                setcookie('pseudo', $user->pseudo, time() + 31556926, null, null, true, true);
                setcookie('email', $user->email, time() + 31556926, null, null, true, true);
                setcookie('role', $user->role, time() + 31556926, null, null, true, true);
            }
            header("Location: ../index.php");
        } else {
            header("Location: ../connexion-view.php?failed=1");
        }
    } else {
        header("Location: ../connexion-view.php?failed=1");
    }
} else {
    $_SESSION["error"] = "Veuillez remplir tous les champs";
    header("Location: ../connexion-view.php?failed=2");
}
