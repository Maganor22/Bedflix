<?php

session_start();
require_once "../bdd/dbconnect.php";
require_once "../bdd/bddmanager.php";
include_once "../mail/mail.php";
$mail = new Mail();

if (!empty($_POST['password']) && !empty($_POST['passwordConfirm'])) {
    if ($_POST['password'] == $_POST['passwordConfirm']) {

        $password = $_POST['password'];
        $cle = $_POST['uniqueId'];
        $user = getIdUserByKey($cle, $db);
        $id = $user['id_utilisateurs'];
        $userInfos = selectUserById($id, $db);
        $email = $userInfos->email;

        if ($user) {
            updatePassword($id, $password, $db);
            deleteKeyPassword($id, $db);
            $body = '<div style="padding:2rem; background-color:#212529;"><h1 style="font-size:2rem; color:red; text-shadow: rgb(255, 255, 255) 0.0625rem 0 0.15rem;">BEDFLIX</h1></br>
                    <p style="color:white">Votre mot de passe a été modifié avec succès !</p></br>
                    <p style="color:white">Vous pouvez dès à présent vous connecter à votre compte .</p>';

            if ($mail->sendMail($email, "Bedflix mot de passe modifié", $body, true)) {
                header("Location: ../connexion-view.php?success=mdp_change");
            }
        } else {
            $_SESSION['error'] = "Une erreur est survenue";
            header("Location: ../change_password-view.php?error=1");
            exit();
        }
    } else {
        $_SESSION['error'] = "Les mots de passe ne correspondent pas";
        header("Location: ../change_password-view.php?error=2");
        exit();
    }
} else {
    $_SESSION['error'] = "Veuillez remplir tous les champs";
    header("Location: ../change_password-view.php?error=3");
    exit();
}
