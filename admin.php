<?php
session_start();
require_once "./bdd/dbconnect.php";
require_once "./bdd/bddmanager.php";

$data = selectUserById($_SESSION['id'], $db);

$users = selectAllUsers($db);

foreach ($users as $user) {
    $user['pseudo'];
}

$allCommentsToValidate = getAllCommentsToValidate($db);



if (isset($_COOKIE['id']) || isset($_SESSION['id']) && $_SESSION['role'] == "admin") {


?>

    <!DOCTYPE html>
    <html lang="fr">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cinérama: Administration</title>
        <meta name="description" content="Recherche d'un film/série à regarder ?" />
        <!-- <link href="reset.css" rel="stylesheet" type="text/css"> -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
        <script src=" https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js "></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.5/font/bootstrap-icons.css" integrity="sha512-0yYhCyiMB+6XOis4qvWA42kPkKb54+uMaOhbsta6m+aQ7cZOm5hzERPrRkkknlpEdoxVCwYui+yM0jRazpDFuA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css" />

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
        <link href="./style/style.css" rel="stylesheet" type="text/css">
        <link href="./style/responsive.css" rel="stylesheet" type="text/css">
        <link rel="icon" type="image/x-icon" href="imgs/favicon.ico" />

    </head>

    <body class="bg-dark" onload="changeDivURL()">


        <header>
            <?php include 'navbar.php'; ?>
        </header>

        <main>
            <div class="background"></div>


            <div class="space d-flex flex-wrap gap-5">
                <div class="block p-4 adminUserList">
                    <h2 class="text-warning mb-3">Utilisateurs</h2>
                    <?php
                    foreach ($users as $user) {
                        // Appeler la fonction depuis "bddmanager.php" pour exécuter la requête SQL et récupérer l'état de l'utilisateur
                        $banStatus = checkBanComment($user['id'], $db);
                    ?>
                        <hr>
                        <div class="usersList">
                            <?php
                            if ($banStatus) {
                            ?>
                                <p class="user" style="color: red; font-weight: bold;"><?= $user['pseudo'] ?></p>
                            <?php
                            } else {
                            ?>
                                <p class="user" style="font-weight:lighter;"><?= $user['pseudo'] ?></p>
                            <?php
                            }
                            ?>
                            <div class="d-flex gap-3">
                                <a href="#" data-bs-toggle="modal" data-bs-target="#<?= $user['id'] ?>"><i class="fa fa-eye fs-5"></i></a>
                                <!-- <a href="#"><i class="fa-solid fa-xmark redCross"></i></a> -->
                                <a href="banUserComment/<?= $user['id'] ?>"><i class="fa-solid fa-ban redCross fs-5"></i></a>
                            </div>

                        </div>

                        <div class="modal fade" id="<?= $user['id'] ?>" tabindex="-1" aria-labelledby="userModal" aria-hidden="true">
                            <div class="modal-dialog modal-xl modal-user-list">
                                <div class="modal-content modal-content-user">

                                    <div class="modal-header modal-header-user p-0 pb-3" id="modalHeader<?= $user['id'] ?>">
                                        <h2 class="modal-title text-white" id="userModal">Apercu de <?= $user['pseudo'] ?></h2>
                                        <div class="float-right" id="divBtnsUserAdmin<?= $user['id'] ?>">
                                            <button type="button" class="btn btn-danger close-btn-fav" data-bs-dismiss="modal"> X </button>
                                        </div>
                                    </div>

                                    <div class="modal-body-user">
                                        <p class="text-white">Nom : <?= $user['nom'] ?></p>
                                        <p class="text-white">Prénom : <?= $user['prenom'] ?></p>
                                        <p class="text-white">Email : <?= $user['email'] ?></p>
                                        <p class="text-white">Date d'inscription : <?= $user['date_inscription'] ?></p>
                                    </div>
                                    <hr>
                                    <div class="listCommentsUser">
                                        <h5 class="text-white">Liste des commentaires de <?= $user['pseudo'] ?></h5>
                                        <div class="table-responsive">
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" class="text-white fs-4">Film</th>
                                                        <th scope="col" class="text-white fs-4">Commentaire</th>
                                                        <th scope="col" class="text-white fs-4">Note</th>
                                                        <th scope="col" class="text-white text-end fs-4">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <?php
                                                    $allUserComments = getUserComments($user['pseudo'], $db);
                                                    foreach ($allUserComments as $comment) {
                                                    ?>
                                                        <tr>
                                                            <td class="text-white align-middle"><?= getNameOfFilmByFilmId($comment['id'], $db); ?></td>
                                                            <td class="text-white align-middle"><?= htmlspecialchars($comment['commentaire']); ?></td>
                                                            <td class="text-white align-middle"><?= $comment['note'] ?></td>
                                                            <td class="text-end align-middle">
                                                                <span class="ms-4">
                                                                    <a href="deleteComment/<?= $comment['id'] ?>"><i class="bi bi-trash fs-3 text-danger"></i></a>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    <?php
                                                    }
                                                    ?>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    <?php } ?>


                </div>
                <div class="block w-75 p-4 adminCommentaireUserList">
                    <h2 class="text-warning">Commentaires</h2>
                    <hr>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col" class="text-white fs-3">Pseudo</th>
                                    <th scope="col" class="text-white fs-3">Commentaire</th>
                                    <th scope="col" class="text-white fs-3">Film</th>
                                    <th scope="col" class="text-white fs-3">Note</th>
                                    <th scope="col" class="text-white text-end fs-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                foreach ($allCommentsToValidate as $comment) {
                                    $user = selectUserById($comment['id_utilisateurs'], $db);
                                    $userPicture = "./imgs/avatars/" . $user->photo_profil;
                                    $film = selectFilmById($comment['id_films'], $db);
                                ?>
                                    <tr>
                                        <td class="text-white align-middle"><?= $user->pseudo ?></td>
                                        <td class="text-white align-middle"><?= htmlspecialchars($comment['commentaire']) ?></td>
                                        <td class="text-white align-middle"><?= $film->titre ?></td>
                                        <td class="text-white align-middle"><?= $comment['note'] ?></td>
                                        <td class="text-end align-middle">
                                            <span>
                                                <a href="validateComment/<?= $comment['id'] ?>"><i class="bi bi-check-circle fs-3 text-success"></i></a>
                                            </span>
                                            <span class="ms-4">
                                                <a href="deleteComment/<?= $comment['id'] ?>"><i class="bi bi-trash fs-3 text-danger"></i></a>
                                            </span>
                                        </td>
                                    </tr>
                                <?php
                                }
                                ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>




        </main>
        <script type="module" src="./scripts/script.js"></script>
        <script src="./scripts/randomBackground.js"></script>
        <script src="https://kit.fontawesome.com/14a5e94ac0.js" crossorigin="anonymous"></script>
    </body>

    </html>
<?php
} else {
    /* header("Location: index.php"); */
    header("Location: " . URL . "connexion");
}
?>