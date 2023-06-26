<nav class="navbar navbar-expand-lg fixed-top navbarContent">

    <div class="container-fluid navbarContent">
        <button class="navbar-toggler bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- <a class="navbar-brand" href="index.php"><img src="./imgs/logo bedflix.png" alt="img_logo_bedflix" class="w-50 logo"></a> -->
        <a class="navbar-brand" href="accueil">
            <p class="red cineramaLogo logo">CINÉRAMA</p>
        </a>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
            <div class="w-100">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0 d-flex justify-content-evenly">
                    <li class="nav-item">
                        <a class="nav-link text-light fs-4 fw-bold ms-5 me-5 resetIndex indexLink" aria-current="page" href="accueil">Accueil</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-light fs-4 ms-5 me-5 resetIndex researchLink" href="#">Recherche</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-light fs-4 ms-5 me-5 resetIndex favLink" href="./favoris">Favoris</a>
                    </li>
                </ul>
            </div>

            <form class="d-flex formIndex" role="search">
                <div class="border border-2 rounded p-1 boxResearch">
                    <a href="#"><img src="./imgs/loupe.png" alt="img_search" id="reseachLink" class="me-2"></a>
                    <input style="border: none;" placeholder="Titre film/serie" class="text-white bg-transparent input_research w-75 h-100">
                </div>
            </form>
            <!-- <a href="#"><img src="./imgs/Vector.png" alt="img_cloche" class="m-2" id="cloche"></a> -->
            <!-- <a href="#"><img src="./imgs/avatar.png" alt="img_avatar" class="m-2" id="avatar2"></a> -->

            <a href="#" id="avatar-container">
                <img src="./imgs/avatars/<?= $data->photo_profil ?>" alt="img_avatar" class="m-2 avatar" id="avatar">
            </a>

            <div class="bg-dark" id="tooltip">
                <?php if (!isset($_COOKIE['id']) && !isset($_SESSION['id'])) { ?>
                    <a href="./connexion" id="connect">Connexion / Inscription</a>
                <?php
                } else { ?>
                    <p class="text-white" id="hiMe">Bonjour <?= htmlspecialchars($_SESSION['pseudo']) ?></p>
                    <hr>
                    <div><a href="#" id="userParams">Paramètres</a></div>
                    <div class="mb-3"><a href="#" id="stats">Statistiques</a></div>
                    <hr>
                    <?php
                    if (isset($_SESSION['id']) && $_SESSION['role'] == "admin") { ?>
                        <div><a href="/cinerama/admin" id="administration">Administration</a></div>
                    <?php } ?>
                    <a href="../cinerama/deconnexion" id="deconnect">Se déconnecter</a>
                <?php } ?>
            </div>
        </div>
    </div>
</nav>