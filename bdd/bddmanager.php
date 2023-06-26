<?php
/* ECRIRE DANS LA CONSOLE DANS UN TRY */
/* echo "<script>console.log('Variable value:', " . json_encode($id_user) . ");</script>";
die(); */

function getRandomBackground($db)
{
    $sql = "SELECT affiche FROM films WHERE affiche IS NOT NULL AND affiche != '' ORDER BY RAND() LIMIT 1";
    $req = $db->prepare($sql);
    $req->execute();
    $background = $req->fetch(PDO::FETCH_ASSOC);
    return $background;
}



/* USERS */

function selectUserInfo($email, $nickname, $db)
{
    $sql = "SELECT * FROM utilisateurs WHERE email = :email OR pseudo = :nickname";
    $req = $db->prepare($sql);
    $result = $req->execute(array('email' => $email, 'nickname' => $nickname));
    $user = $req->fetch(PDO::FETCH_ASSOC);
    return $user;
}

function selectUser($identifier, $db)
{
    $stmt = $db->prepare("SELECT * FROM utilisateurs WHERE pseudo = :identifier OR email = :identifier");
    $stmt->bindParam(":identifier", $identifier);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_OBJ);
    return $user;
}

function selectUserById($id, $db)
{
    try {
        $sql = "SELECT * from utilisateurs WHERE id = :id";
        $req =  $db->prepare($sql);
        $result = $req->execute([
            ":id" => $id
        ]);
        $data = $req->fetch(PDO::FETCH_OBJ);
        return $data;
    } catch (PDOException $e) {
        echo "Erreur SQL (id: $id) : " . $e->getMessage();
    }
}

function selectProfilPictures($db)
{
    $sql = "SELECT * from photo_profil";
    $req =  $db->prepare($sql);
    $result = $req->execute();
    $data = $req->fetchAll(PDO::FETCH_OBJ);
    return $data;
}

function updateUser($lastname, $firstname, $email, $pseudo, $password, $db)
{
    $sql = "UPDATE utilisateurs SET nom = :lastname, prenom = :firstname, email = :email, pseudo = :pseudo, mdp = :password WHERE pseudo = :pseudo";
    $req = $db->prepare($sql);
    $password = password_hash($password, PASSWORD_BCRYPT, array("cost" => 12));
    $result = $req->execute(array(
        'lastname' => $lastname,
        'firstname' => $firstname,
        'email' => $email,
        'pseudo' => $pseudo,
        'password' => $password
    ));
    return $result;
}

function getUserEmail($email, $db)
{
    $sql = "SELECT * FROM utilisateurs where email = :email";
    $req = $db->prepare($sql);
    $result = $req->execute(array('email' => $email));
    $email = $req->fetch(PDO::FETCH_ASSOC);
    return $email;
}

function getIdUserByKey($cle, $db)
{
    $sql = "SELECT * FROM mdp_oublie WHERE cle_unique = :cle";
    $req = $db->prepare($sql);
    $result = $req->execute(array('cle' => $cle));
    $id_user = $req->fetch(PDO::FETCH_ASSOC);
    return $id_user;
}

function updatePassword($id_user, $password, $db)
{
    $sql = "UPDATE utilisateurs SET mdp = :password WHERE id = :id_user";
    $req = $db->prepare($sql);
    $password = password_hash($password, PASSWORD_BCRYPT, array("cost" => 12));
    $result = $req->execute(array(
        'password' => $password,
        'id_user' => $id_user
    ));
    return $result;
}

function deleteKeyPassword($id_user, $db)
{
    $sql = "DELETE FROM mdp_oublie WHERE id_utilisateurs = :id_user";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_user' => $id_user));
    return $result;
}

/* FIN USERS */


/* AVATAR */

function getAvatar($id_user, $db)
{
    $sql = "SELECT photo_profil FROM utilisateurs WHERE id = :id_user";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_user' => $id_user));
    $avatar = $req->fetch(PDO::FETCH_ASSOC);
    return $avatar;
}

function updateAvatar($photo_profil, $id, $db)
{
    $sql = "UPDATE utilisateurs SET photo_profil = :photo_profil WHERE id = :id";
    $req = $db->prepare($sql);
    $result = $req->execute(array(
        'photo_profil' => $photo_profil,
        'id' => $id
    ));

    $sql = "SELECT pseudo FROM utilisateurs WHERE id = :id";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id' => $id));
    $pseudonyme = $req->fetch(PDO::FETCH_ASSOC);

    $pseudo = $pseudonyme['pseudo'];

    $sql = "UPDATE commentaires SET picture = CONCAT('./imgs/avatars/', :photo_profil) WHERE user = :pseudo";
    $req = $db->prepare($sql);
    $result = $req->execute(array(
        'photo_profil' => $photo_profil,
        'pseudo' => $pseudo
    ));
    return $result;
}

/* FIN AVATAR */


/* FILMS */

function selectFilm($id_du_media, $db)
{
    $sql = "SELECT * FROM films WHERE id_du_media = :id_du_media";
    $req = $db->prepare($sql);
    $result = $req->execute([
        ":id_du_media" => $id_du_media
    ]);
    $data = $req->fetch(PDO::FETCH_OBJ);
    return $data;
}

function selectFilmById($id, $db)
{
    $sql = "SELECT * FROM films WHERE id = :id";
    $req = $db->prepare($sql);
    $result = $req->execute([
        ":id" => $id
    ]);
    $data = $req->fetch(PDO::FETCH_OBJ);
    return $data;
}

function selectGenre($genres, $db)
{
    $sql = "SELECT * FROM films WHERE genre LIKE CONCAT('%', :genres, '%')";
    $req = $db->prepare($sql);
    $result = $req->execute(['genres' => $genres]);
    $json = $req->fetchAll(PDO::FETCH_ASSOC);
    return $json;
}

function insertFilm($titre, $titre_fr, $type, $annee, $poster, $affiche, $id_du_media, $imdb, $ba, $synopsis, $duree, $note, $nbNote, $genre, $db)
{
    $sql = "SELECT * FROM films WHERE id_du_media = :id_du_media";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_du_media' => $id_du_media));
    $film = $req->fetch(PDO::FETCH_ASSOC);

    if (!$film) {
        $sql = "INSERT INTO films (titre, titre_fr, type, annee, poster, affiche, id_du_media, imdb, ba, synopsis, duree, note, nbNote, genre) VALUES (:titre, :titre_fr, :type, :annee, :poster, :affiche, :id_du_media, :imdb, :ba, :synopsis, :duree, :note, :nbNote, :genre)";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'titre' => $titre,
            'titre_fr' => $titre_fr,
            'type' => $type,
            'annee' => $annee,
            'poster' => $poster,
            'affiche' => $affiche,
            'id_du_media' => $id_du_media,
            'imdb' => $imdb,
            'ba' => $ba,
            'synopsis' => $synopsis,
            'duree' => $duree,
            'note' => $note,
            'nbNote' => $nbNote,
            'genre' => $genre
        ));
    }
    return $result;
}

function updateFilm($titre, $titre_fr, $annee, $poster, $affiche, $ba, $synopsis, $duree, $genre, $id_du_media, $db)
{
    $sql = "UPDATE films SET titre = :titre, titre_fr = :titre_fr, annee = :annee, poster = :poster, affiche = :affiche, 
    ba = :ba, synopsis = :synopsis, duree = :duree, genre = :genre WHERE id_du_media = :id_du_media";
    $req = $db->prepare($sql);
    $result = $req->execute(array(
        'titre' => $titre,
        'titre_fr' => $titre_fr,
        'annee' => $annee,
        'poster' => $poster,
        'affiche' => $affiche,
        'ba' => $ba,
        'synopsis' => $synopsis,
        'duree' => $duree,
        'genre' => $genre,
        'id_du_media' => $id_du_media
    ));
    return $result;
}

function getMoviesById($id_media, $db)
{
    $sql = "SELECT * FROM films WHERE id = :id_media";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_media' => $id_media));
    $movie = $req->fetch(PDO::FETCH_ASSOC);
    return $movie;
}

function setComments($user, $picture, $note, $date, $commentaire, $id_films, $db)
{
    // Vérification l'existance du commentaire
    $sql = "SELECT id FROM commentaires WHERE commentaire = :commentaire AND user = :user";
    $req = $db->prepare($sql);
    $req->execute(array(
        'commentaire' => $commentaire,
        'user' => $user
    ));
    $existingComment = $req->fetch(PDO::FETCH_ASSOC);

    if ($existingComment) {
        // Le commentaire existe, on arrete ici
        return false;
    }

    //Sinon on sélectionne l'id unique (primary key) du film par rapport à l'id du film
    $sql = "SELECT id FROM films WHERE id_du_media = :id_films";
    $req = $db->prepare($sql);
    $req->execute(array('id_films' => $id_films));
    $id_media_row = $req->fetch(PDO::FETCH_ASSOC);

    //On stock l'ID unique dans la variable $id_films
    $id_films = $id_media_row['id'];

    // Le commentaire n'existe pas, on l'insert
    $sql = "INSERT INTO `commentaires` (`user`, `picture`, `note`, `date`, `commentaire`, `id_films`) 
             VALUES (:user, :picture, :note, :date, :commentaire, :id_films)";
    $req = $db->prepare($sql);
    $result = $req->execute(array(
        'user' => $user,
        'picture' => $picture,
        'note' => $note,
        'date' => $date,
        'commentaire' => $commentaire,
        'id_films' => $id_films
    ));

    //On retourne le résultat
    return $result;
}


function getComments($id_films, $db)
{
    // Sinon on sélectionne l'id unique (primary key) du film par rapport à l'id du film
    $sql = "SELECT id FROM films WHERE id_du_media = :id_films";
    $req = $db->prepare($sql);
    $req->execute(array('id_films' => $id_films));
    $id_media_row = $req->fetch(PDO::FETCH_ASSOC);

    // On stocke l'ID unique dans la variable $id_films
    $id_films = $id_media_row['id'];
    $sql = "SELECT * FROM commentaires WHERE `id_films` = :id_films";
    $req = $db->prepare($sql);
    $req->execute(array('id_films' => $id_films));
    $commentaires = $req->fetchAll(PDO::FETCH_ASSOC);

    return $commentaires;
}



/* FIN FILMS */


/* SERIES */

/*  function insertSerie($titre, $annee, $poster, $affiche, $id_du_media, $imdb, $ba, $synopsis, $genre, $saisons, $db)
{
    $sql = "SELECT * FROM series WHERE id_du_media = :id_du_media";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_du_media' => $id_du_media));
    $serie = $req->fetch(PDO::FETCH_ASSOC);

    if (!$serie) {
        $sql = "INSERT INTO series (titre, annee, poster, affiche, id_du_media, imdb, ba, synopsis, genre) VALUES (:titre, :annee, :poster, :affiche, :id_du_media, :imdb, :ba, :synopsis, :genre)";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'titre' => $titre,
            'annee' => $annee,
            'poster' => $poster,
            'affiche' => $affiche,
            'id_du_media' => $id_du_media,
            'imdb' => $imdb,
            'ba' => $ba,
            'synopsis' => $synopsis,
            'genre' => $genre/* ,
            'nombre_episodes_par_saison' => $nombre_episodes_par_saison 
        ));

        $id_serie = $db->lastInsertId();

        $sql = "INSERT INTO saisons (id_series) VALUES (:id_series)";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_series' => $id_serie
        ));


    }
    return $result;
}  */

function insertSerie($titre, $annee, $poster, $affiche, $id_du_media, $imdb, $ba, $synopsis, $genre, $saisons, $db)
{
    $sql = "SELECT * FROM series WHERE id_du_media = :id_du_media";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_du_media' => $id_du_media));
    $serie = $req->fetch(PDO::FETCH_ASSOC);

    if (!$serie) {
        $db->beginTransaction();

        // Insérer la série
        $sql = "INSERT INTO series (titre, annee, poster, affiche, id_du_media, imdb, ba, synopsis, genre) VALUES (:titre, :annee, :poster, :affiche, :id_du_media, :imdb, :ba, :synopsis, :genre)";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'titre' => $titre,
            'annee' => $annee,
            'poster' => $poster,
            'affiche' => $affiche,
            'id_du_media' => $id_du_media,
            'imdb' => $imdb,
            'ba' => $ba,
            'synopsis' => $synopsis,
            'genre' => $genre
        ));

        $id_series = $db->lastInsertId();

        // Insérer les saisons et les épisodes
        foreach ($saisons as $index => $nombre_episodes_par_saison) {
            $id_saison = $index + 1;

            // Insérer la saison
            $sql = "INSERT INTO saisons (id, id_series) VALUES (:id, :id_series)";
            $req = $db->prepare($sql);
            $result = $req->execute(array(
                'id' => $id_saison,
                'id_series' => $id_series
            ));

            /*  // Insérer les épisodes
            for ($i = 1; $i <= $nombre_episodes_par_saison; $i++) {
                $nom_episode = "Saison " . $id_saison . " Episode " . $i;
                $numero_episode = $i;

                $sql = "INSERT INTO episodes (nom, numero_episode) VALUES (:nom, :numero_episode)";
                $req = $db->prepare($sql);
                $result = $req->execute(array(
                    'nom' => $nom_episode,
                    'numero_episode' => $numero_episode
                ));
            } */
        }

        if ($result) {
            $db->commit();
        } else {
            $db->rollback();
        }
    }
    return $result;
}

/* FIN SERIES */


/* FAVORIS */

function addFav($id_user, $id_media, $db)
{
    // Sélectionne l'ID unique du film par rapport à l'ID du média
    $sql = "SELECT id FROM films WHERE id_du_media = :id_media";
    $req = $db->prepare($sql);
    $req->execute(array('id_media' => $id_media));
    $id_media_row = $req->fetch(PDO::FETCH_ASSOC);

    $id_media = $id_media_row['id'];

    // Vérifie si l'entrée existe déjà dans la table des favoris
    $sql = "SELECT id_films FROM favoris_film WHERE id_films = :id_media AND id = :id_user";
    $req = $db->prepare($sql);
    $req->execute(array(
        'id_media' => $id_media,
        'id_user' => $id_user
    ));
    $id_media_row2 = $req->fetch(PDO::FETCH_ASSOC);

    if (!$id_media_row2) {
        // Ajoute le film aux favoris de l'utilisateur
        $sql = "INSERT INTO favoris_film (id, id_films) VALUES (:id_user, :id_media)";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_user' => $id_user,
            'id_media' => $id_media
        ));
    } else {
        // Supprime le film des favoris de l'utilisateur
        $sql = "DELETE FROM favoris_film WHERE id = :id_user AND id_films = :id_media";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_user' => $id_user,
            'id_media' => $id_media
        ));
    }

    return $result;
}



function delFav($id_user, $id_media, $db)
{
    $sql = "SELECT id_films FROM favoris_film WHERE id_films = :id_media";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_media' => $id_media));
    $id_media_row2 = $req->fetch(PDO::FETCH_ASSOC);

    if ($id_media_row2) {
        $sql = "DELETE FROM favoris_film WHERE id = :id_user AND id_films = :id_media";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_user' => $id_user,
            'id_media' => $id_media
        ));
    }

    return $result;
}

function getFavorisByUserId($id_user, $db)
{
    $sql = "SELECT * FROM favoris_film WHERE id = :id_user";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_user' => $id_user));
    $favoris = $req->fetchAll(PDO::FETCH_ASSOC);
    return $favoris;
}

function getFavorisIdFilmsByUserId($id_user, $db)
{
    $sql = "SELECT * FROM favoris_film WHERE id = :id_user";
    $req = $db->prepare($sql);
    $req->execute(array('id_user' => $id_user));
    $favoris = $req->fetchAll(PDO::FETCH_ASSOC);

    // Récupérer id_du_media pour chaque favori en utilisant id_films
    foreach ($favoris as &$favori) {
        $id_films = $favori['id_films'];
        $sql = "SELECT id_du_media FROM films WHERE id = :id_films";
        $req = $db->prepare($sql);
        $req->execute(array('id_films' => $id_films));
        $result = $req->fetch(PDO::FETCH_ASSOC);
        $favori['id_du_media'] = $result['id_du_media'];
    }

    return $favoris;
}



function getCommentairesByFilmId($id_film, $db)
{

    $sql = "SELECT * FROM commentaires WHERE id_films = :id_film";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_film' => $id_film));
    $commentaires = $req->fetchAll(PDO::FETCH_ASSOC);
    return $commentaires;
}

function getFilmVuByUserIdAndFilmId($id_user, $id_film, $db)
{
    $sql = "SELECT * FROM films_vu WHERE id = :id_user AND id_films = :id_film";
    $req = $db->prepare($sql);
    $result = $req->execute(array(
        'id_user' => $id_user,
        'id_film' => $id_film
    ));
    $film_vu = $req->fetch(PDO::FETCH_ASSOC);
    return $film_vu;
}

function getFilmsVuByUserId($id_user, $db)
{
    $sql = "SELECT * FROM films_vu WHERE id = :id_user";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_user' => $id_user));
    $films_vu = $req->fetchAll(PDO::FETCH_ASSOC);
    return $films_vu;
}

function checkFav($id_user, $id_media, $db)
{
    // Sélectionne l'ID unique du film par rapport à l'ID du média
    $sql = "SELECT id FROM films WHERE id_du_media = :id_media";
    $req = $db->prepare($sql);
    $req->execute(array('id_media' => $id_media));
    $id_media_row = $req->fetch(PDO::FETCH_ASSOC);

    $id_media = $id_media_row['id'];

    // Vérifie si l'entrée existe déjà dans la table des favoris
    $sql = "SELECT id_films FROM favoris_film WHERE id_films = :id_media AND id = :id_user";
    $req = $db->prepare($sql);
    $req->execute(array(
        'id_media' => $id_media,
        'id_user' => $id_user
    ));

    // Vérifie si des résultats ont été retournés
    if ($req->rowCount() > 0) {
        return true; // L'entrée existe déjà dans la table des favoris
    } else {
        return false; // L'entrée n'existe pas dans la table des favoris
    }
}

/* FIN FAVORIS */

/* FILMS VU */

function addFilmVu($id_user, $id_media, $fav, $db)
{
    if ($fav == 0) {
        // Sélectionne l'ID unique du film par rapport à l'ID du média
        $sql = "SELECT id FROM films WHERE id_du_media = :id_media";
        $req = $db->prepare($sql);
        $req->execute(array('id_media' => $id_media));
        $id_media_row = $req->fetch(PDO::FETCH_ASSOC);

        $id_media = $id_media_row['id'];
    }

    // Vérifie si l'entrée existe déjà dans la table des favoris
    $sql = "SELECT id_films FROM films_vu WHERE id_films = :id_media AND id = :id_user";
    $req = $db->prepare($sql);
    $req->execute(array(
        'id_media' => $id_media,
        'id_user' => $id_user
    ));
    $id_media_row2 = $req->fetch(PDO::FETCH_ASSOC);

    if (!$id_media_row2) {
        // Ajoute le film aux vus de l'utilisateur
        $sql = "INSERT INTO films_vu (id, id_films) VALUES (:id_user, :id_media)";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_user' => $id_user,
            'id_media' => $id_media
        ));
    } else {
        // Supprime le film des vus de l'utilisateur
        $sql = "DELETE FROM films_vu WHERE id = :id_user AND id_films = :id_media";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_user' => $id_user,
            'id_media' => $id_media
        ));
    }

    return $result;
}


function getFilmVuByUserId($id_user, $db)
{
    $sql = "SELECT * FROM favoris_film WHERE id = :id_user";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_user' => $id_user));
    $favoris = $req->fetchAll(PDO::FETCH_ASSOC);
    return $favoris;
}


function getFilmVuByFilmId($id_film, $db)
{

    $sql = "SELECT * FROM commentaires WHERE id_films = :id_film";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_film' => $id_film));
    $commentaires = $req->fetchAll(PDO::FETCH_ASSOC);
    return $commentaires;
}

function checkFilmVu($id_user, $id_media, $db)
{
    // Sélectionne l'ID unique du film par rapport à l'ID du média
    $sql = "SELECT id FROM films WHERE id_du_media = :id_media";
    $req = $db->prepare($sql);
    $req->execute(array('id_media' => $id_media));
    $id_media_row = $req->fetch(PDO::FETCH_ASSOC);

    $id_media = $id_media_row['id'];

    // Vérifie si l'entrée existe déjà dans la table
    $sql = "SELECT id_films FROM films_vu WHERE id_films = :id_media AND id = :id_user";
    $req = $db->prepare($sql);
    $req->execute(array(
        'id_media' => $id_media,
        'id_user' => $id_user
    ));

    // Vérifie si des résultats ont été retournés
    if ($req->rowCount() > 0) {
        return true; // L'entrée existe déjà dans la table
    } else {
        return false; // L'entrée n'existe pas dans la table
    }
}

function getFilmVuDurationOfUser($id_user, $db)
{
    // Vérifie si l'entrée existe déjà dans la table
    $sql = "SELECT id_films FROM films_vu WHERE id = :id_user";
    $req = $db->prepare($sql);
    $req->execute(array('id_user' => $id_user));
    $id_media_rows = $req->fetchAll(PDO::FETCH_ASSOC);

    $durations = array();

    foreach ($id_media_rows as $id_media_row) {
        $id_media = $id_media_row['id_films'];

        $sql = "SELECT duree FROM films WHERE id = :id_media";
        $req = $db->prepare($sql);
        $req->execute(array('id_media' => $id_media));
        $duration_row = $req->fetch(PDO::FETCH_ASSOC);

        if ($duration_row) {
            $duration = $duration_row['duree'];
            $durations[] = $duration;
        }
    }

    return $durations;
}



/* FILMS VU */


/* ACTEURS */

function insertActorBase($nom, $alias, $id_films, $age, $dNaissance, $poster, $biographie, $db)
{
    $sql = "SELECT * FROM acteurs WHERE nom = :nom";
    $req = $db->prepare($sql);
    $result = $req->execute(array(
        'nom' => $nom
    ));

    $actor = $req->fetch(PDO::FETCH_ASSOC);
    if (!$actor) {
        $sql = "INSERT INTO acteurs (nom, age, date, poster, biographie) VALUES (:nom, :age, :date, :poster, :biographie)";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'nom' => $nom,
            'age' => $age,
            'date' => $dNaissance,
            'poster' => $poster,
            'biographie' => $biographie
        ));

        $idActor = $db->lastInsertId();

        $sql = "SELECT id FROM films WHERE id_du_media = :id_films";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_films' => $id_films
        ));
        $id_films = $req->fetch(PDO::FETCH_ASSOC)['id'];

        $sql = "INSERT INTO joue_film (id, id_films, alias) VALUES (:id, :id_films, :alias)";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id' => $idActor,
            'id_films' => $id_films,
            'alias' => $alias
        ));
        return $result;
    }
}

function selectActorsByIdFilm($id_films, $db)
{
    $sql = "SELECT id FROM films WHERE id_du_media = :id_films";
    $req = $db->prepare($sql);
    $result = $req->execute(array(
        'id_films' => $id_films
    ));
    $id_films = $req->fetch(PDO::FETCH_ASSOC)['id'];
    $sql = "SELECT * FROM joue_film WHERE id_films = :id_films";
    $req = $db->prepare($sql);
    $result = $req->execute(array(
        'id_films' => $id_films
    ));
    $actors = $req->fetchAll(PDO::FETCH_ASSOC);

    foreach ($actors as &$actor) {
        $sql = "SELECT * FROM acteurs WHERE id = :id";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id' => $actor['id']
        ));
        $actor['infos'] = $req->fetch(PDO::FETCH_ASSOC);
    }

    return $actors;
}

/* FIN ACTEURS */

function selectAllUsers($db)
{
    $sql = "SELECT * FROM utilisateurs";
    $req = $db->prepare($sql);
    $result = $req->execute();
    $users = $req->fetchAll(PDO::FETCH_ASSOC);
    return $users;
}


/*Commentaires utilisateurs*/

function addUserComment($note, $commentaire, $id_films, $id_user, $db)
{
    try {
        $sql = "SELECT banComment FROM utilisateurs WHERE id = :id_user";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_user' => $id_user
        ));

        $banComment = $req->fetch(PDO::FETCH_ASSOC)['banComment'];

        if ($banComment == 1) {
            throw new Exception("Erreur : L'utilisateur est interdit de commenter.");
        }


        $sql = "SELECT id FROM films WHERE id_du_media = :id_films";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_films' => $id_films
        ));
        $id_films = $req->fetch(PDO::FETCH_ASSOC)['id'];

        $sql = "INSERT INTO commentaires_users (note, commentaire, id_films, id_utilisateurs) VALUES (:note, :commentaire, :id_films, :id_user)";
        $req = $db->prepare($sql);
        $result = $req->execute([
            'note' => $note,
            'commentaire' => $commentaire,
            'id_films' => $id_films,
            'id_user' => $id_user
        ]);

        return $result;
    } catch (PDOException $e) {
        echo "Erreur SQL (id_films: $id_films) (id_utilisateurs: $id_user) (note: $note) (commentaire: $commentaire) : " . $e->getMessage();
    }
}

function getUserComments($pseudo, $db)
{
    try {
        $sql = "SELECT * FROM commentaires WHERE user = :pseudo";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'pseudo' => $pseudo
        ));
        $comments = $req->fetchAll(PDO::FETCH_ASSOC);

        return $comments;
    } catch (PDOException $e) {
        echo "Erreur SQL (id_utilisateurs: $pseudo) : " . $e->getMessage();
    }
}

function getAllCommentsToValidate($db)
{
    try {
        $sql = "SELECT * FROM commentaires_users WHERE valide = 0";
        $req = $db->prepare($sql);
        $result = $req->execute();
        $comments = $req->fetchAll(PDO::FETCH_ASSOC);

        return $comments;
    } catch (PDOException $e) {
        echo "Erreur SQL : " . $e->getMessage();
    }
}


function validateComment($id_comment, $db)
{
    try {

        $sql = "SELECT id_utilisateurs FROM commentaires_users WHERE id = :id_comment";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_comment' => $id_comment
        ));
        $monId = $req->fetch(PDO::FETCH_ASSOC);

        $id_user = $monId['id_utilisateurs'];

        $sql = "SELECT photo_profil FROM utilisateurs where id = :id_user";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_user' => $id_user
        ));
        $maPicture = $req->fetch(PDO::FETCH_ASSOC);

        $picture = "./imgs/avatars/" . $maPicture['photo_profil'];

        //$picture = "https://img.betaseries.com/Tq2NaT5AI7Ax1CS1xoU8g_p5pp4=/250x250/smart/https://pictures.betaseries.com/avatars/80/80139f4232b7f90f86c3dea8778330c5.jpg";
        $sql = "SELECT c.*, u.pseudo FROM commentaires_users c INNER JOIN utilisateurs u ON c.id_utilisateurs = u.id WHERE c.id = :id_comment";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_comment' => $id_comment
        ));
        $comment = $req->fetch(PDO::FETCH_ASSOC);

        $pseudo = $comment['pseudo'];
        $note = $comment['note'];
        $commentaire = $comment['commentaire'];
        $id_films = $comment['id_films'];

        $date = date('Y-m-d H:i:s'); // Obtient la date et l'heure actuelles au format YYYY-MM-DD HH:MM:SS

        $sql = "INSERT INTO `commentaires` (`user`, `picture`, `note`, `date`, `commentaire`, `id_films`) 
             VALUES (:user, :picture, :note, :date, :commentaire, :id_films)";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'user' => $pseudo,
            'picture' => $picture,
            'note' => $note,
            'date' => $date,
            'commentaire' => $commentaire,
            'id_films' => $id_films
        ));

        $sql = "DELETE FROM commentaires_users WHERE id = :id_comment";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_comment' => $id_comment
        ));

        header('Location: ../admin');
    } catch (PDOException $e) {
        echo "Erreur SQL : " . $e->getMessage();
    }
}


function deleteComment($id_comment, $db)
{
    try {
        $sql = "DELETE FROM commentaires_users WHERE id = :id_comment";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_comment' => $id_comment
        ));

        header('Location: ../admin');
    } catch (PDOException $e) {
        echo "Erreur SQL : " . $e->getMessage();
    }
}

function banUserComment($id_user, $db)
{
    try {
        $sql = "SELECT banComment FROM utilisateurs WHERE id = :id_user";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_user' => $id_user
        ));

        $ban = $req->fetch(PDO::FETCH_ASSOC);

        if ($ban['banComment'] == 1) {
            $sql = "UPDATE utilisateurs SET banComment = 0 WHERE id = :id_user";
        } else {
            $sql = "UPDATE utilisateurs SET banComment = 1 WHERE id = :id_user";
        }

        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_user' => $id_user
        ));

        header('Location: ../admin');

        return $ban;
    } catch (PDOException $e) {
        echo "Erreur SQL : " . $e->getMessage();
    }
}

function checkBanComment($id_user, $db)
{
    // Effectuer une requête pour récupérer la valeur actuelle de banComment pour l'utilisateur
    $sql = "SELECT banComment FROM utilisateurs WHERE id = :id_user";
    $req = $db->prepare($sql);
    $req->execute(array('id_user' => $id_user));
    $userStatus = $req->fetch(PDO::FETCH_ASSOC);

    $banComment = $userStatus['banComment'];

    return $banComment;
}

function getNameOfFilmByFilmId($id_films, $db)
{
    try {
        $sql = "SELECT titre FROM films WHERE id = :id_films";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_films' => $id_films
        ));
        $film = $req->fetch(PDO::FETCH_ASSOC);

        return $film['titre'];
    } catch (PDOException $e) {
        echo "Erreur SQL : " . $e->getMessage();
    }
}
