<?php
session_start();
require_once "../bdd/dbconnect.php";
require_once "../bdd/bddmanager.php";
include_once "../mail/mail.php";
$mail = new Mail();
// Stock dans data le retour de ma fonction selectMail
$data = selectUserInfo($_POST["email"], $_POST["nickname"], $db);
// Stockage des données du formulaire
$nickname = $_POST["nickname"];
$name = $_POST["name"];
$firstname = $_POST["firstname"];
$email = $_POST["email"];
$password = $_POST["password"];
$passwordConfirmation = $_POST["passwordConfirmation"];
$uniqId = uniqid("confirmation_");


if (!empty($_POST["nickname"]) && !empty($_POST["name"]) && !empty($_POST["firstname"]) && !empty($_POST["email"]) && !empty($_POST["password"]) && !empty($_POST["passwordConfirmation"])) {

    if (!preg_match("/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/", $_POST["email"])) {
        $_SESSION["error"] = "L'adresse email n'est pas valide";
        header("Location: ../inscription_view.php?error=1");
        exit();
    }
    //if (!preg_match("/^[a-zA-ZÀ-ÖØ-öø-ÿ]{2,}$/u", $_POST["nickname"])) { //(sans chiffres)
    if (!preg_match("/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9]{2,}$/u", $_POST["nickname"])) {
        header("Location: ../inscription_view.php?error=2");
        exit();
    }
    if (!preg_match("/^[a-zA-ZÀ-ÖØ-öø-ÿ -]{2,}$/u", $_POST["name"])) {
        $_SESSION["error"] = "Le nom ne doit contenir que des lettres, des espaces et le tiret (-)";
        header("Location: ../inscription_view.php?error=3");
        exit();
    }
    if (!preg_match("/^[a-zA-ZÀ-ÖØ-öø-ÿ -]{2,}$/u", $_POST["firstname"])) {
        $_SESSION["error"] = "Le prénom ne doit contenir que des lettres, des espaces et le tiret (-)";
        header("Location: ../inscription_view.php?error=4");
        exit();
    }
    if (!preg_match('/^(?=.*[A-Z])(?=.*[\W])(?=.*[a-z]).{8,}$/', $_POST['password'])) {
        $_SESSION["error"] = "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial";
        header("Location: ../inscription_view.php?error=5");
        exit();
    }



    if (isset($_POST['email'])) {
        // Check si le mail existe déja
        if ($data["email"] != $_POST["email"]) {
            if ($data["pseudo"] != $_POST["nickname"]) {
                // Ajoute l'utilisateur
                if ($_POST["password"] == $_POST["passwordConfirmation"]) {
                    $nickname = $_POST["nickname"];
                    $name = $_POST["name"];
                    $firstname = $_POST["firstname"];
                    $email = $_POST["email"];
                    $password = $_POST["password"];
                    $password = password_hash($password, PASSWORD_BCRYPT, array("cost" => 12));

                    $query = $db->prepare("INSERT INTO utilisateurs (role, nom, prenom, email, pseudo, mdp, date_inscription) VALUES (:role, :name, :firstname, :email, :nickname, :password, :date_inscription)");
                    $query->execute([
                        "role" => "user",
                        "nickname" => $nickname,
                        "name" => $name,
                        "firstname" => $firstname,
                        "email" => $email,
                        "password" => $password,
                        "date_inscription" => date("Y-m-d H:i:s")
                    ]);
                    $query = $db->prepare("SELECT id FROM utilisateurs WHERE pseudo = :nickname");
                    $query->execute([
                        "nickname" => $nickname
                    ]);
                    $id = $query->fetch();
                    $id = $id["id"];
                    $query = $db->prepare("INSERT INTO email_verification (cle_unique, id_utilisateurs) VALUES (:cle_unique, :id)");
                    $query->execute([
                        "cle_unique" => $uniqId,
                        "id" => $id
                    ]);

                    $_SESSION["user"] = $nickname;
                    $body = '<div style="padding:2rem; background-color:#212529;"><h1 style="font-size:2rem; color:red; margin-top: 0; text-shadow: rgb(255, 255, 255) 0.0625rem 0 0.15rem;">CINERAMA</h1></br>
                    <p style="color:white">Bienvenue <span style="font-weight:bold; font-size: 14px;">' . $firstname . '</span> !</p></br>
                    <p style="color:white">Pour confirmer votre inscription à <span style="font-weight:bold; font-size: 14px;">Cinérama</span>, veuillez <span style="font-weight:bold; font-size: 14px;">confirmer votre adresse email</span> grâce au bouton ci-dessous.</p></br>
                    <p style="color:white">Vous pourrez ainsi vous connecter à votre compte avec votre pseudo : <span style="color:lightblue; font-weight:bold; font-size:14px;">' . $nickname . '</span> ou avec votre <span style="font-weight:bold; font-size:14px;">email</span>.</p>
                    <div style="display:inline-block; background-color:#0077cc; color:white; padding:10px 20px; border-radius:4px;">
                    <a href="http://51.210.104.251/cinerama/mail/confirmation_mail.php?verif=' . $uniqId . '" style="color:white; text-decoration:none;">Vérifiez mon email</a>
                    </div>';

                    /* <a href="http://localhost/Bedflix/mail/confirmation_mail.php?verif=' . $uniqId . '">Vérifiez mon email</a></div>'; */


                    if ($mail->sendMail($email, "Inscription Cinérama", $body, true)) {
                        header("Location: ../connexion_view.php?success=email_verif");
                    }
                } else {
                    $_SESSION["error"] = "Les mots de passe ne correspondent pas";
                    header("Location: ../inscription_view.php?failed=1");
                }
            } else {
                $_SESSION["error"] = "Le pseudo existe déja.";
                header("Location: ../inscription_view.php?failed=2");
            }
        } else {
            $_SESSION["error"] = "L'email existe déja.";
            header("Location: ../inscription_view.php?failed=3");
        }
    }
} else {
    $_SESSION["error"] = "Veuillez remplir tous les champs.";
    header("Location: ../inscription_view.php?failed=4");
}
