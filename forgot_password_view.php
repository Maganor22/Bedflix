<?php
session_start();

$recoveryDelay = 120; // Délai de récupération en secondes (2 minutes)

if (isset($_GET["success"])) {
    $success = $_GET["success"];
}

if (!isset($_COOKIE['id']) || !isset($_SESSION['id'])) {

    function displayAlert($alertClass, $alertMessage)
    {
        echo "<style>";
        echo ".alert { position: absolute; top: 5%; left: 50%; transform: translateX(-50%); z-index: 999; width: fit-content; opacity: 1; transition: opacity 0.5s ease-in-out; }";
        echo "@media (max-width: 767px) { .alert { width: 80%; text-align: center; } }";
        echo "</style>";
        echo "<div class='alert $alertClass' role='alert'>$alertMessage</div>";
        echo "<script>setTimeout(function(){ var alert = document.querySelector('.alert'); alert.style.opacity = '0'; setTimeout(function(){ alert.style.display = 'none'; }, 500); }, 8000);</script>";
    }

    if (isset($_GET["error"])) {
        $error = $_GET["error"];
        switch ($error) {
            case 1:
                displayAlert("alert-danger", "Email incorrect.");
                break;
            case 2:
                displayAlert("alert-danger", "Veuillez remplir tous les champs.");
                break;
            case 3:
                displayAlert("alert-danger", "Une erreur est survenue. Veuillez réessayer ulterieurement.");
                break;
            default:
                break;
        }
    }
    if (isset($_GET["success"])) {
        $success = $_GET["success"];
        switch ($success) {
            case "email_send":
                displayAlert("alert-success", "Un email de récupération de mot de passe a été envoyé à l'adresse indiquée.");
                break;

            default:
                break;
        }
    }

    // Vérifier le délai entre les demandes de récupération
    $lastRecoveryTime = isset($_COOKIE['last_recovery_time']) ? $_COOKIE['last_recovery_time'] : 0;
    $currentTime = time();

    if ($success === "email_send" && $currentTime - $lastRecoveryTime < $recoveryDelay) {
        $remainingTime = $recoveryDelay - ($currentTime - $lastRecoveryTime);
        $remainingMinutes = floor($remainingTime / 60);
        $remainingSeconds = $remainingTime % 60;
        displayAlert("alert-danger", "Vous devez attendre encore $remainingMinutes minute(s) et $remainingSeconds seconde(s) avant de soumettre une nouvelle demande de récupération.");
    } else {
        // Mettre à jour le timestamp du dernier temps de récupération
        if ($success === "email_send") {
            setcookie('last_recovery_time', $currentTime, $currentTime + $recoveryDelay);
        }
    }



?>

    <!DOCTYPE html>
    <html lang="fr">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bedflix: mot de passe</title>
        <meta name="description" content="Recherche d'un film/série à regarder ?" />
        <!-- <link href="reset.css" rel="stylesheet" type="text/css"> -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
        <script src=" https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js "></script>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css" />

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
        <link href="./style/style.css" rel="stylesheet" type="text/css">
        <link href="./style/responsive.css" rel="stylesheet" type="text/css">
        <link rel="icon" type="image/x-icon" href="imgs/favicon.ico" />

    </head>

    <body class="bg-dark">
        <div class="center">
            <div class="background"></div>
            <div class="row justify-content-center">
                <div class="mdpDiv">
                    <div class="logoConnexion d-flex justify-content-center">
                        <img src="./imgs/logo bedflix.png" alt="logo" class="w-75 mb-5">
                    </div>
                    <h3 class="text-white mb-3">Mot de passe oublié ?</h3>
                    <form action="../Bedflix/fonctions/forgot_password.php" method="POST" class="d-flex flex-column flex-md-row" id="mdpForm">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="email" class="text-white fw-bold">Votre adresse email :</label>
                                <input type="text" name="email" placeholder="Email" class="form-control">
                            </div>
                            <div class="button-group mt-4 mb-3">
                                <button class="btn btn-warning w-100" type="submit">Envoyer</button>
                            </div>
                            <a href="./connexion-view.php" class="btn btn-secondary w-100">Retour</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </body>

    </html>
<?php
} else {
    header('Location: ./index.php');
}
?>