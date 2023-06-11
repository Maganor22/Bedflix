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

/* function setComments($user, $picture, $note, $date, $commentaire, $id_films, $db)
{

    $sql = "SELECT id FROM films WHERE id_du_media = :id_films";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_films' => $id_films));
    $id_films = $req->fetch(PDO::FETCH_ASSOC);


    $sql = "INSERT INTO `commentaires` (`user`, `picture`, `note`, `date`, `commentaire`, `id_films`) 
            VALUES (:user, :picture, :note, :date, :commentaire, :id_films)";
    $req = $db->prepare($sql);
    $result = $req->execute(array(
        'user' => $user,
        'picture' => $picture,
        'note' => $note,
        'date' => $date,
        'commentaire' => $commentaire,
        'id_films' => $id_films['id']
    ));
    return $result;
}
 */

function setComments($user, $picture, $note, $date, $commentaire, $id_films, $db)
{
    // Vérification du commentaire existant
    $sql = "SELECT id FROM commentaires WHERE commentaire = :commentaire AND user = :user";
    $req = $db->prepare($sql);
    $req->execute(array(
        'commentaire' => $commentaire,
        'user' => $user
    ));
    $existingComment = $req->fetch(PDO::FETCH_ASSOC);

    if ($existingComment) {
        // Le commentaire existe déjà, vous pouvez décider de gérer cette situation en conséquence
        return false;
    }

    $sql = "SELECT id FROM films WHERE id_du_media = :id_films";
    $req = $db->prepare($sql);
    $req->execute(array('id_films' => $id_films));
    $id_media_row = $req->fetch(PDO::FETCH_ASSOC);

    $id_films = $id_media_row['id'];

    // Le commentaire n'existe pas, on l'insert
    $sql =
    "INSERT INTO `commentaires` (`user`, `picture`, `note`, `date`, `commentaire`, `id_films`) 
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

    return $result;
}
 

function getComments($id_media, $db)
{
    $sql = "SELECT commentaires FROM films WHERE `id_du_media` = :id_media";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_media' => $id_media));
    $commentaires_json = $req->fetch(PDO::FETCH_COLUMN);
    $commentaires = json_decode($commentaires_json, true);
    if (!is_array($commentaires)) {
        $commentaires = array();
    }
    return $commentaires;
}


/* function setComments($id_media, $commentaires, $db)
{
    $sql = "UPDATE `films` SET `commentaires` = :commentaires WHERE `id_du_media` = :id_media";
    $req = $db->prepare($sql);
    $result = $req->execute(array(
        'commentaires' => json_encode($commentaires),
        'id_media' => $id_media
    ));
    return $result;
}

function getComments($id_media, $db)
{
    $sql = "SELECT commentaires FROM films WHERE `id_du_media` = :id_media";
    $req = $db->prepare($sql);  
    $result = $req->execute(array('id_media' => $id_media));
    $commentaires = $req->fetch(PDO::FETCH_ASSOC);
    return $commentaires;
} */

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

/* function addFav($id_user, $id_media, $db)
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
} */

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


function getCommentairesByFilmId($id_film, $db)
{
    
    $sql = "SELECT * FROM commentaires WHERE id_films = :id_film";
    $req = $db->prepare($sql);
    $result = $req->execute(array('id_film' => $id_film));
    $commentaires = $req->fetchAll(PDO::FETCH_ASSOC);
    return $commentaires;
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

function addFilmVu($id_user, $id_media, $db)
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



function delFilmVu($id_user, $id_media, $db)
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