<?php
session_start();
require_once "../bdd/dbconnect.php";
require_once "../bdd/bddmanager.php";
include_once "../mail/mail.php";
$mail = new Mail();


$email = $_POST["email"];
$uniqId = uniqid();





if (isset($email) && !empty($email)) {

    $getMail = getUserEmail($email, $db);
    $email = $getMail['email'];
    $id = $getMail['id'];


    if ($email) {

        $query = $db->prepare("INSERT INTO mdp_oublie (cle_unique, id_utilisateurs) VALUES (:cle_unique, :id)");
        $query->execute([
            "cle_unique" => $uniqId,
            "id" => $id
        ]);

        $body = '<div style="padding:2rem; background-color:#212529;"><h1 style="font-size:2rem; color:red; margin-top: 0; text-shadow: rgb(255, 255, 255) 0.0625rem 0 0.15rem;">BEDFLIX</h1></br>
        <p style="color:white">Récupération de mot de passe</p></br>
        <p style="color:white">Vous avez demandé à changer votre mot de passe, cliquez sur le bouton ci-dessous pour le changer.</p></br>
        <p style="color:white">Si vous n\'avez pas demandé à changer votre mot de passe, ignorez ce mail.</p></br>
        <div style="display:inline-block; background-color:#0077cc; color:white; padding:10px 20px; border-radius:4px;">
        <a href="http://51.210.104.251/Bedflix/change_password_view.php?recuperation=' . $uniqId . '" style="color:white; text-decoration:none;">Changer mon mot de passe</a>
        </div>';


        if ($mail->sendMail($email, "Bedflix mot de passe oublié", $body, true)) {
            header("Location: ../forgot_password_view.php?success=email_send");
        } else {
            $_SESSION["error"] = "Une erreur est survenue";
            header("Location: ../forgot_password_view.php?error=3");
        }
    } else {
        $_SESSION["error"] = "L'email n'existe pas";
        header("Location: ../forgot_password_view.php?success=email_send");
        //Message pour dire qu'un email est envoyé alors qu'il ne l'est pas pour ne pas donner d'informations sur les emails

        /* $_SESSION["error"] = "L'email n'existe pas";
        header("Location: ../forgot_password_view.php?error=1"); */
    }
} else {
    $_SESSION["error"] = "Veuillez remplir tous les champs";
    header("Location: ../forgot_password_view.php?error=2");
}
