<?php
session_start();

if (!isset($_COOKIE['id']) || !isset($_SESSION['id'])) {

    if (isset($_GET["error"])) {
        $error = $_GET["error"];
    }

    /*     function displayError($errorMessage)
    {
        echo "<style>.alert { top: 5%; left: 50%; transform: translateX(-50%); z-index: 999; width: fit-content; opacity: 1; transition: opacity 0.5s ease-in-out; }</style>";
        echo "<div class='alert alert-danger' role='alert'>$errorMessage</div>";
        echo "<script>setTimeout(function(){ var alert = document.querySelector('.alert'); alert.style.opacity = '0'; setTimeout(function(){ alert.style.display = 'none'; }, 500); }, 10000);</script>";
    } */

    function displayError($alertMessage)
    {
        echo "<style>";
        echo ".alert { position: absolute; top: 5%; left: 50%; transform: translateX(-50%); z-index: 999; width: fit-content; opacity: 1; transition: opacity 0.5s ease-in-out; }";
        echo "@media (max-width: 767px) { .alert { width: 90%; text-align: center; top: 1%} }";
        echo "</style>";
        echo "<div class='alert alert-danger' role='alert'>$alertMessage</div>";
        echo "<script>setTimeout(function(){ var alert = document.querySelector('.alert'); alert.style.opacity = '0'; setTimeout(function(){ alert.style.display = 'none'; }, 500); }, 8000);</script>";
    }

    if (isset($_GET["error"])) {
        $error = $_GET["error"];
        if ($error == 1) {
            displayError("L'adresse email n'est pas valide.");
        } else if ($error == 2) {
            displayError("Le pseudo ne doit contenir que des lettres et des chiffres, et doit comporter au moins deux caractères.");
        } else if ($error == 3) {
            displayError("Le nom ne doit contenir que des lettres et doit comporter au moins deux caractères.");
        } else if ($error == 4) {
            displayError("Le prénom ne doit contenir que des lettres et doit comporter au moins deux caractères.");
        }
    }
    if (isset($_GET["failed"])) {
        $failed = $_GET["failed"];
        if ($failed == 1) {
            displayError("Les mots de passe ne correspondent pas.");
        } else if ($failed == 2) {
            displayError("Le pseudo existe déja.");
        } else if ($failed == 3) {
            displayError("L'email existe déja.");
        } else if ($failed == 4) {
            displayError("Veuillez remplir tous les champs.");
        }
    }

?>
    <!DOCTYPE html>
    <html lang="fr">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bedflix: inscription</title>
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
                <div class="inscriptionDiv">
                    <div class="logoInscription d-flex justify-content-center">
                        <img src="./imgs/logo bedflix.png" alt="logo" class="w-50 mb-3">
                    </div>
                    <h2 class="text-white">Inscription</h2>
                    <p class="error text-warning">* champs obligatoires</p>
                    <form action="../Bedflix/fonctions/inscription.php" method="POST" class="mb-2" id="inscriptionForm">
                        <div class="d-flex flex-column flex-md-row divInsc">
                            <div class="col-md-6 ">
                                <div class="form-group">
                                    <label for="nickname" class="text-white fw-bold">Pseudo* :<?php if (!empty($error) && $error == "2") { ?>
                                        <small class="text-danger">incorrect</small>
                                    <?php } ?></label>
                                    <input type="text" name="nickname" placeholder="Pseudonyme" class="form-control" width="90">
                                </div>
                                <div class="form-group">
                                    <label for="name" class="text-white fw-bold">Nom* :<?php if (!empty($error) && $error == "3") { ?>
                                        <small class="text-danger">incorrect</small>
                                    <?php } ?></label>
                                    <input type="text" name="name" placeholder="Dupont" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label for="firstname" class="text-white fw-bold">Prénom* :<?php if (!empty($error) && $error == "4") { ?>
                                        <small class="text-danger">incorrect</small>
                                    <?php } ?></label>
                                    <input type="text" name="firstname" placeholder="Olivier" class="form-control">
                                </div>
                                <!--                             <div class="button-group">
                                <button class="btn w-100 mt-2 redbtn">Effacer</button>
                            </div> -->
                            </div>
                            <div class="col-md-6 ">
                                <div class="form-group">
                                    <label for="email" class="text-white fw-bold">Email* :<?php if (!empty($error) && $error == "1") { ?>
                                        <small class="text-danger">incorrect</small>
                                    <?php } ?></label>
                                    <input type="email" name="email" placeholder="olivier.dupont@mail.com" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label for="password" class="text-white fw-bold">Mot de passe* :<?php if (!empty($error) && $error == "5") { ?>
                                        <small class="text-danger">incorrect</small>
                                    <?php } ?></label>
                                    <input type="password" name="password" placeholder="********" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label for="password" class="text-white fw-bold">Confirmation* :</label>
                                    <input type="password" name="passwordConfirmation" placeholder="********" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="button-group">
                            <button type="submit" class="btn btn-warning w-100">Valider</button>
                        </div>
                    </form>
                    <span class="text-white">Déjà inscrit ? <a href="./connexion-view.php">Se connecter</a></span>
                </div>
            </div>
        </div>

        <script>
            const form = document.querySelector('form');
            const passwordInput = document.querySelectorAll('input[type="password"]');
            const pseudo = document.querySelector("input[name='nickname']");
            //const delFormBtn = document.querySelector(".redbtn");

            /*             //EFFACER LE FORMULAIRE
                        delFormBtn.addEventListener('click', (event) => {
                            event.preventDefault();
                            form.reset();
                        }); */

            const regexPassword = /^(?=.*[A-Z])(?=.*[\W])(?=.*[a-z]).{8,}$/;

            passwordInput.forEach(element => {
                element.addEventListener('input', () => {
                    if (regexPassword.test(element.value)) {
                        element.style.borderColor = "green"
                    } else {
                        element.style.borderColor = "red"
                    }
                });
            });
        </script>

    </body>

    </html>
<?php
} else {
    header('Location: ./index.php');
}
?>