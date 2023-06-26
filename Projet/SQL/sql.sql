#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------

CREATE TABLE films(
        id          Int  Auto_increment  NOT NULL ,
        titre       Varchar (50) NOT NULL ,
        titre_fr    Varchar (50) NOT NULL ,
        type        Varchar (10) NOT NULL ,
        annee       Int NOT NULL ,
        poster      Text NOT NULL ,
        affiche     Text NOT NULL ,
        id_du_media Int NOT NULL ,
        imdb        Varchar (50) NOT NULL ,
        ba          Text NOT NULL ,
        synopsis    Text NOT NULL ,
        duree       Int NOT NULL ,
        note        Decimal (10,2) NOT NULL ,
        nbNote      Int NOT NULL ,
        genre       Text NOT NULL
        ,CONSTRAINT films_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


CREATE TABLE commentaires(
        id       Int  Auto_increment  NOT NULL ,
        user     Varchar(100) NOT NULL ,
        picture  Text NOT NULL ,
        note     Decimal (10,2) DEFAULT NULL ,
        date     Date NOT NULL ,
        commentaire     Longtext NOT NULL ,
        id_films Int NOT NULL
        ,CONSTRAINT commentaires_PK PRIMARY KEY (id)

        ,CONSTRAINT commentaires_films_FK FOREIGN KEY (id_films) REFERENCES films(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: utilisateurs
#------------------------------------------------------------

CREATE TABLE utilisateurs(
        id               Int  Auto_increment  NOT NULL ,
        role             Varchar (10) NOT NULL ,
        nom              Varchar (50) NOT NULL ,
        prenom           Varchar (50) NOT NULL ,
        email            Varchar (50) NOT NULL ,
        pseudo           Varchar (50) NOT NULL ,
        mdp              Varchar (64) NOT NULL ,
        photo_profil     Varchar (100) NOT NULL ,
        actif            Bool NOT NULL ,
        date_inscription Datetime NOT NULL
        ,CONSTRAINT utilisateurs_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: series
#------------------------------------------------------------

CREATE TABLE series(
        id          Int  Auto_increment  NOT NULL ,
        titre       Varchar (50) NOT NULL ,
        type        Varchar (10) NOT NULL ,
        annee       Int NOT NULL ,
        poster      Text NOT NULL ,
        affiche     Text NOT NULL ,
        id_du_media Int NOT NULL ,
        imdb        Varchar (50) NOT NULL ,
        ba          Text NOT NULL ,
        synopsis    Text NOT NULL ,
        genre       Text NOT NULL
        ,CONSTRAINT series_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: acteurs
#------------------------------------------------------------

CREATE TABLE acteurs(
        id         Int  Auto_increment  NOT NULL ,
        nom        Varchar (50) NOT NULL ,
        age        Int NOT NULL ,
        date       Varchar (10) NOT NULL ,
        poster     Text NOT NULL ,
        biographie Text NOT NULL
        ,CONSTRAINT acteurs_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: photo_profil
#------------------------------------------------------------

CREATE TABLE photo_profil(
        id        Int  Auto_increment  NOT NULL ,
        nom       Varchar (50) NOT NULL ,
        url       Varchar (50) NOT NULL ,
        categorie Varchar (50) NOT NULL
        ,CONSTRAINT photo_profil_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: email_verification
#------------------------------------------------------------

CREATE TABLE email_verification(
        id              Int  Auto_increment  NOT NULL ,
        cle_unique      Varchar (50) NOT NULL ,
        id_utilisateurs Int NOT NULL
        ,CONSTRAINT email_verification_PK PRIMARY KEY (id)

        ,CONSTRAINT email_verification_utilisateurs_FK FOREIGN KEY (id_utilisateurs) REFERENCES utilisateurs(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: mdp_oublie
#------------------------------------------------------------

CREATE TABLE mdp_oublie(
        id              Int  Auto_increment  NOT NULL ,
        cle_unique      Varchar (50) NOT NULL ,
        id_utilisateurs Int NOT NULL
        ,CONSTRAINT mdp_oublie_PK PRIMARY KEY (id)

        ,CONSTRAINT mdp_oublie_utilisateurs_FK FOREIGN KEY (id_utilisateurs) REFERENCES utilisateurs(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: episodes
#------------------------------------------------------------

CREATE TABLE episodes(
        id             Int  Auto_increment  NOT NULL ,
        nom            Varchar (200) NOT NULL ,
        numero_episode Int NOT NULL
        ,CONSTRAINT episodes_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: saisons
#------------------------------------------------------------

CREATE TABLE saisons(
        id        Int NOT NULL ,
        id_series Int NOT NULL
        ,CONSTRAINT saisons_PK PRIMARY KEY (id,id_series)

        ,CONSTRAINT saisons_episodes_FK FOREIGN KEY (id) REFERENCES episodes(id)
        ,CONSTRAINT saisons_series0_FK FOREIGN KEY (id_series) REFERENCES series(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: favoris_film
#------------------------------------------------------------

CREATE TABLE favoris_film(
        id       Int NOT NULL ,
        id_films Int NOT NULL
        ,CONSTRAINT favoris_film_PK PRIMARY KEY (id,id_films)

        ,CONSTRAINT favoris_film_utilisateurs_FK FOREIGN KEY (id) REFERENCES utilisateurs(id)
        ,CONSTRAINT favoris_film_films0_FK FOREIGN KEY (id_films) REFERENCES films(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: joue_film
#------------------------------------------------------------

CREATE TABLE joue_film(
        id       Int NOT NULL ,
        id_films Int NOT NULL ,
        alias    Varchar (50) NOT NULL
        ,CONSTRAINT joue_film_PK PRIMARY KEY (id,id_films)

        ,CONSTRAINT joue_film_acteurs_FK FOREIGN KEY (id) REFERENCES acteurs(id)
        ,CONSTRAINT joue_film_films0_FK FOREIGN KEY (id_films) REFERENCES films(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: joue_serie
#------------------------------------------------------------

CREATE TABLE joue_serie(
        id        Int NOT NULL ,
        id_series Int NOT NULL
        ,CONSTRAINT joue_serie_PK PRIMARY KEY (id,id_series)

        ,CONSTRAINT joue_serie_acteurs_FK FOREIGN KEY (id) REFERENCES acteurs(id)
        ,CONSTRAINT joue_serie_series0_FK FOREIGN KEY (id_series) REFERENCES series(id)
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: commentaires_users
#------------------------------------------------------------

CREATE TABLE commentaires_users(
        id              Int  Auto_increment  NOT NULL ,
        note            Int NOT NULL ,
        commentaire     Text NOT NULL ,
        id_films        Int NOT NULL ,
        id_utilisateurs Int NOT NULL
    ,CONSTRAINT commentaires_users_PK PRIMARY KEY (id)

    ,CONSTRAINT commentaires_users_films_FK FOREIGN KEY (id_films) REFERENCES films(id)
    ,CONSTRAINT commentaires_users_utilisateurs0_FK FOREIGN KEY (id_utilisateurs) REFERENCES utilisateurs(id)
)ENGINE=InnoDB;



#------------------------------------------------------------
# INSERTIONS:
#------------------------------------------------------------

INSERT INTO `photo_profil`(`nom`, `url`, `categorie`) VALUES 
('Deadpool', 'deadpool.png', 'Marvel'),
('Spider-man', 'spider-man.png', 'Marvel'),
('Scarlett', 'scarlett.png', 'Marvel'),
('Groot', 'groot.png', 'Marvel'),
('Iron-Man', 'iron-man.png', 'Marvel'),
('Captain america', 'captain_america.png', 'Marvel'),
('Hulk', 'hulk.png', 'Marvel'),
('Locky', 'locky.png', 'Marvel'),
('Thor', 'thor.png', 'Marvel'),
('Doctor Strange', 'doctor_strange.png', 'Marvel'),
('Wolverine', 'wolverine.png', 'Marvel'),
('Black Panther', 'black_panther.png', 'Marvel'),
('Ant-Man', 'ant-man.png', 'Marvel'),
('Venom', 'venom.png', 'Marvel'),
('Thanos', 'thanos.png', 'Marvel'),
('Joker', 'joker.png', 'DC-Comics'),
('Superman', 'superman.png', 'DC-Comics'),
('Batman', 'batman.png', 'DC-Comics'),
('Walter White', 'walter_white.png', 'Breaking Bad'),
('Jessie Pinkman', 'jessie_pinkman.png', 'Breaking Bad'),
('Assassin\'s Creed', 'assassin\'s_creed.png', 'Jeux Vidéos'),
('Link Zelda', 'link_zelda.png', 'Jeux Vidéos'),
('Panda', 'panda.png', 'Animaux'),
('Harry Potter', 'harry_potter.png', 'Autre');

CREATE TABLE `commentaires_users` (
  `id` int(11) NOT NULL,
  `note` int(11) NOT NULL,
  `commentaire` text NOT NULL,
  `valide` tinyint(1) NOT NULL DEFAULT 0,
  `id_films` int(11) NOT NULL,
  `id_utilisateurs` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

ALTER TABLE `commentaires_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `commentaires_users_films_FK` (`id_films`),
  ADD KEY `commentaires_users_utilisateurs0_FK` (`id_utilisateurs`);

ALTER TABLE `commentaires_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `commentaires_users`
  ADD CONSTRAINT `commentaires_users_films_FK` FOREIGN KEY (`id_films`) REFERENCES `films` (`id`),
  ADD CONSTRAINT `commentaires_users_utilisateurs0_FK` FOREIGN KEY (`id_utilisateurs`) REFERENCES `utilisateurs` (`id`);
COMMIT;

ALTER TABLE utilisateurs ALTER COLUMN photo_profil SET DEFAULT 'avatar.png';
ALTER TABLE utilisateurs ALTER COLUMN actif SET DEFAULT 0;
ALTER TABLE favoris_film DROP FOREIGN KEY favoris_film_utilisateurs_FK;
ALTER TABLE favoris_film ADD CONSTRAINT favoris_film_utilisateurs_FK_new FOREIGN KEY (id) REFERENCES utilisateurs (id) ON DELETE CASCADE;

ALTER TABLE commentaires
DROP FOREIGN KEY commentaires_films_FK;
ALTER TABLE commentaires
ADD CONSTRAINT commentaires_films_FK 
FOREIGN KEY (id_films) REFERENCES films(id) ON DELETE CASCADE;
ALTER TABLE utilisateurs
ADD COLUMN banComment BOOL DEFAULT 0;



ALTER TABLE films AUTO_INCREMENT = 0;






