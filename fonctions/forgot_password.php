<?php
session_start();
require_once "../bdd/dbconnect.php";
require_once "../bdd/bddmanager.php";
include_once "../mail/mail.php";
$mail = new Mail();

$email = $_POST["email"];
$uniqId = uniqid();

if (isset($email) && !empty($email)) {
    // Vérifier le délai entre les demandes de récupération
    $recoveryDelay = 120; // Délai de récupération en secondes (2 minutes)
    $lastRecoveryTime = isset($_COOKIE['last_recovery_time']) ? $_COOKIE['last_recovery_time'] : 0;
    $currentTime = time();

    if ($currentTime - $lastRecoveryTime < $recoveryDelay) {
        $_SESSION["error"] = "Vous devez attendre encore " . ($recoveryDelay - ($currentTime - $lastRecoveryTime)) . " secondes avant de soumettre une nouvelle demande de récupération.";
        header("Location: ../forgot_password_view.php?error=4");
        exit;
    }

    $getMail = getUserEmail($email, $db);
    $email = $getMail['email'];
    $id = $getMail['id'];

    if ($email) {
        // Vérifier si une clé unique est déjà présente pour l'utilisateur
        $query = $db->prepare("SELECT cle_unique FROM mdp_oublie WHERE id_utilisateurs = :id");
        $query->execute(["id" => $id]);
        $existingKey = $query->fetchColumn();

        if ($existingKey) {
            // Supprimer la clé unique existante
            $query = $db->prepare("DELETE FROM mdp_oublie WHERE cle_unique = :existingKey");
            $query->execute(["existingKey" => $existingKey]);
        }

        // Insérer la clé unique dans la base de données
        $query = $db->prepare("INSERT INTO mdp_oublie (cle_unique, id_utilisateurs) VALUES (:cle_unique, :id)");
        $query->execute([
            "cle_unique" => $uniqId,
            "id" => $id
        ]);

        $body = '<div style="padding:2rem; background-color:#212529;"><h1 style="font-size:2rem; color:red; margin-top: 0; text-shadow: rgb(255, 255, 255) 0.0625rem 0 0.15rem;">CINERAMA</h1></br>
        <p style="color:white">Récupération de mot de passe</p></br>
        <p style="color:white">Vous avez demandé à changer votre mot de passe, cliquez sur le bouton ci-dessous pour le changer.</p></br>
        <p style="color:white">Si vous n\'avez pas demandé à changer votre mot de passe, ignorez ce mail.</p></br>
        <div style="display:inline-block; background-color:#0077cc; color:white; padding:10px 20px; border-radius:4px;">
        <a href="http://51.210.104.251/cinerama/change_password_view.php?recuperation=' . $uniqId . '" style="color:white; text-decoration:none;">Changer mon mot de passe</a>
        </div>';

        if ($mail->sendMail($email, "Cinérama mot de passe oublié", $body, true)) {
            // Mettre à jour le timestamp du dernier temps de récupération
            setcookie('last_recovery_time', $currentTime, $currentTime + $recoveryDelay);

            header("Location: ../forgot_password_view.php?success=email_send");
            exit;
        } else {
            $_SESSION["error"] = "Une erreur est survenue";
            header("Location: ../forgot_password_view.php?error=3");
            exit;
        }
    } else {
        $_SESSION["error"] = "L'email n'existe pas";
        header("Location: ../forgot_password_view.php?success=email_send");
        exit;
        //Message pour dire qu'un email est envoyé à l'adresse indiquée alors qu'il ne l'est pas pour ne pas donner d'informations sur les emails.
    }
} else {
    $_SESSION["error"] = "Veuillez remplir tous les champs";
    header("Location: ../forgot_password_view.php?error=2");
    exit;
}
