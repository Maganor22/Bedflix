<?php

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
    $sql = "SELECT * from utilisateurs WHERE id = :id";
    $req =  $db->prepare($sql);
    $result = $req->execute([
        ":id" => $id
    ]);
    $data = $req->fetch(PDO::FETCH_OBJ);
    return $data;
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

function selectGenre($genres, $db)
{
    $sql = "SELECT * FROM films WHERE genre LIKE CONCAT('%', :genres, '%')";
    $req = $db->prepare($sql);
    $result = $req->execute(['genres' => $genres]);
    $json = $req->fetchAll(PDO::FETCH_ASSOC);
    return $json;
}

function insertFilm($titre, $titre_fr, $type, $annee, $poster, $affiche, $id_du_media, $imdb, $ba, $synopsis, $duree, $genre, $db)
{
    $sql = "SELECT * FROM films WHERE id_du_media = :id_du_media";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_du_media' => $id_du_media));
    $film = $req->fetch(PDO::FETCH_ASSOC);

    if (!$film) {
        $sql = "INSERT INTO films (titre, titre_fr, type, annee, poster, affiche, id_du_media, imdb, ba, synopsis, duree, genre) VALUES (:titre, :titre_fr, :type, :annee, :poster, :affiche, :id_du_media, :imdb, :ba, :synopsis, :duree, :genre)";
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
            'genre' => $genre
        ));
    }
    return $result;
}

function updateFilm($titre, $titre_fr, $annee, $poster, $affiche, $ba, $synopsis, $duree, $genre, $id_du_media, $db)
{
    $sql = "UPDATE films SET titre = :titre, titre_fr = :titre_fr, annee = :annee, poster = :poster, affiche = :affiche, ba = :ba, synopsis = :synopsis, duree = :duree, genre = :genre WHERE id_du_media = :id_du_media";
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
    //Selectionne l'ID unique du film par rapport à l'ID du film
    $sql = "SELECT id FROM films WHERE id_du_media = :id_media";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_media' => $id_media));
    $id_media_row = $req->fetch(PDO::FETCH_ASSOC);

    $id_media = $id_media_row['id'];

    $sql = "SELECT id_films FROM favoris_film WHERE id_films = :id_media";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_media' => $id_media));
    $id_media_row2 = $req->fetch(PDO::FETCH_ASSOC);

    if (!$id_media_row2) {
        $sql = "INSERT INTO favoris_film (id, id_films) VALUES (:id_user, :id_media)";
        $req = $db->prepare($sql);
        $result = $req->execute(array(
            'id_user' => $id_user,
            'id_media' => $id_media
        ));
    } else {
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

/* FIN FAVORIS */


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