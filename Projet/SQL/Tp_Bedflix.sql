DROP DATABASE IF EXISTS Bedflix;

CREATE DATABASE IF NOT EXISTS Bedflix;

Use Bedflix;

CREATE TABLE IF NOT EXISTS ROLES(
	id_role INT NOT NULL PRIMARY KEY,
    libelle_role VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS UTILISATEURS(
	id_utilisateur INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	nom_utilisateur VARCHAR(50) NOT NULL,
	prenom_utilisateur VARCHAR(50) NOT NULL,
	email_utilisateur VARCHAR(50) NOT NULL UNIQUE,
    pseudo_utilisateur VARCHAR(50) NOT NULL UNIQUE,
    mdp_utilisateur VARCHAR(64) NOT NULL,
    photo_profil_utilisateur TEXT,
    id_role INT NOT NULL,
    FOREIGN KEY (id_role) REFERENCES ROLES (id_role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS RECHERCHE(
	id_recherche INT AUTO_INCREMENT NOT NULL,
    libelle_recherche VARCHAR(50) NOT NULL
);

/*CREATE TABLE IF NOT EXISTS FILMS(
	id_film INT NOT NULL PRIMARY KEY,
    titre_film VARCHAR(50) NOT NULL,
    description_film TEXT NOT NULL,
    affiche_film TEXT NOT NULL,
    lien_film TEXT NOT NULL,
    duree_film VARCHAR(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;*/

CREATE TABLE IF NOT EXISTS Films (
    id_film INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    titre_film VARCHAR(50) NOT NULL,
    titre_fr_film VARCHAR(50),
    annee_film INT NOT NULL,
    poster_film TEXT,
    affiche_film TEXT,
    id_du_film INT NOT NULL,
    imdb_film INT NOT NULL,
    ba_film TEXT,
    synopsis_film TEXT,
    duree_film INT
);

SELECT titre_film FROM FILMS 

CREATE TABLE IF NOT EXISTS FILMS_GENRES(
	id_genre INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    libelle_genre VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_film) REFERENCES FILMS (id_film)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS MEDIAS_PLATEFORMES(
	id_plateforme INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    libelle_plateforme VARCHAR(20) NOT NULL,
    lien_plateforme TEXT NOT NULL,
    FOREIGN KEY (id_film) REFERENCES FILMS (id_film),
    FOREIGN KEY (id_serie) REFERENCES SERIES (id_serie),
    FOREIGN KEY (id_serie) REFERENCES PLATEFORMES (id_serie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS PLATEFORMES(
	id_plateformes INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	libelle_plateforme VARCHAR(50),
    FOREIGN KEY (id_plateforme) REFERENCES MEDIAS_PLATEFORMES (id_plateforme)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS MEDIAS_VOD(
	id_vod INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    libelle_vod VARCHAR(20) NOT NULL,
    lien_vod TEXT NOT NULL,
    FOREIGN KEY (id_film) REFERENCES FILMS (id_film)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS MEDIAS_NOTES(
	id_note INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    moyenne_note FLOAT NOT NULL,
    nombre_note INT NOT NULL,
    FOREIGN KEY (id_film) REFERENCES FILMS (id_film)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Series (
    id_serie INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    titre_serie VARCHAR(255) NOT NULL,
    titre_fr_serie VARCHAR(255),
    annee_serie INT NOT NULL,
    poster_serie TEXT,
    affiche_serie TEXT,
    genre_serie VARCHAR(255),
    id_du_serie INT NOT NULL,
    imdb_serie VARCHAR(255) NOT NULL,
    ba_serie TEXT,
    synopsis_serie TEXT
);

CREATE TABLE IF NOT EXISTS SERIES_GENRES(
	id_genre INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    libelle_genre VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_serie) REFERENCES SERIES (id_serie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS SAISONS(
	id_saison INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    numero_saison INT NOT NULL,
    titre_saison VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_serie) REFERENCES SERIES (id_serie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS EPISODES(
	id_episode INT NOT NULL PRIMARY KEY,
    numero_episode INT NOT NULL,
    titre_episode VARCHAR(100) NOT NULL,
    duree_episode VARCHAR(5) NOT NULL,
	id_saison INT NOT NULL,
    FOREIGN KEY (id_saison) REFERENCES SAISONS (id_saison)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS UTILISATEURS_FILMS(
	date_utilisateur_visionnage DATE NOT NULL,
	id_utilisateur INT NOT NULL,
	id_film INT NOT NULL,
	FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEURS (id_utilisateur),
	FOREIGN KEY (id_film) REFERENCES FILMS (id_film),
	PRIMARY KEY (id_utilisateur, id_film)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS UTILISATEURS_SERIES(
	date_utilisateur_visionnage DATE NOT NULL,
	id_utilisateur INT NOT NULL,
	id_serie INT NOT NULL,
	FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEURS (id_utilisateur),
	FOREIGN KEY (id_serie) REFERENCES SERIES (id_serie),
	PRIMARY KEY (id_utilisateur, id_serie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*ALTER TABLE UTILISATEUR_SERIES 
MODIFY id_serie INT;

ALTER TABLE SAISONS ADD id_serie INT NOT NULL;
ALTER TABLE EPISODES ADD (
	duree_episode VARCHAR(5) NOT NULL,
	id_saison INT NOT NULL
);*/

INSERT INTO ROLES (id_role, libelle_role) VALUES
(1, 'Admin'),
(2, 'Utilisateur'),
(3, 'Invité');

INSERT INTO FILMS (id_film, titre_film, titre_fr_film, annee_film, poster_film, affiche_film, id_du_film, imdb_film, ba_film, synopsis_film, duree_film) VALUES
(1, 'Avengers : Endgame', 'Avengers : Endgame', '2019', 'https://pictures.betaseries.com/films/affiches/original/22951.jpg', 'https://pictures.betaseries.com/films/backdrops/original/22951.jpg', '22951', 'tt4154796', 'jTC2fgxMwxU', "Après leur défaite face au Titan Thanos qui dans le film précédent s'est approprié toutes les pierres du Gant de l'infini , les Avengers et les Gardiens de la Galaxie ayant survécu à son claquement de doigts qui a pulvérisé « la moitié de toute forme de vie dans l'Univers », Captain America, Thor, Bruce Banner, Natasha Romanoff, War Machine, Tony Stark, Nébula et Rocket, vont essayer de trouver une solution pour ramener leurs coéquipiers disparus et vaincre Thanos en se faisant aider par Ronin alias Clint Barton, Captain Marvel et Ant-Man.", '10860');

INSERT INTO FILMS_CATEGORIES(id_categorie, libelle_categorie) VALUES 
(1, 'Action'),
(2, 'Comédie'),
(3, 'Horreur'),
(4, 'Thriller'),
(5, 'Science-fiction');

INSERT INTO SERIES (id_serie, titre_serie, description_serie, affiche_serie, lien_serie) VALUES
(1, 'Breaking Bad', 'Walter White, un professeur de chimie atteint d\'un cancer, décide de se lancer dans la fabrication de méthamphétamine pour subvenir aux besoins de sa famille.', 'breaking_bad.png', 'https://www.netflix.com/title/70143836'),
(2, 'Stranger Things', 'En 1983, à Hawkins, une ville de l\'Indiana, le jeune Will Byers disparaît brusquement. Ses amis, sa famille et la police locale vont alors partir à sa recherche, qui les mènera dans un monde parallèle terrifiant.', 'stranger_things.png', 'https://www.netflix.com/title/80057281'),
(3, 'Game of Thrones', 'Dans un monde fantastique, plusieurs familles nobles se battent pour le contrôle des sept royaumes de Westeros. La série suit notamment les membres de la famille Stark et de la famille Lannister.', 'game_of_thrones.png', 'https://www.hbo.com/game-of-thrones');

INSERT INTO SERIES_CATEGORIES (id_categorie, libelle_categorie) VALUES
(1, 'Action'),
(2, 'Science-fiction'),
(3, 'Fantasy'),
(4, 'Horreur'),
(5, 'Comédie');

INSERT INTO SAISONS (numero_saison, titre_saison, id_serie) VALUES 
(1, 'Première saison', 1),
(2, 'Deuxième saison', 1),
(3, 'Troisième saison', 1),
(4, 'Quatrième saison', 1),
(5, 'Cinquième saison', 1),
(1, 'Première saison', 2),
(2, 'Deuxième saison', 2),
(3, 'Troisième saison', 2),
(4, 'Quatrième saison', 2),
(1, 'Première saison', 3),
(2, 'Deuxième saison', 3),
(3, 'Troisième saison', 3),
(4, 'Quatrième saison', 3),
(5, 'Cinquième saison', 3),
(6, 'Sixième saison', 3),
(7, 'Septième saison', 3),
(8, 'Huitième saison', 3);


INSERT INTO EPISODES (id_episode, numero_episode, titre_episode, duree_episode, id_saison) VALUES 
(1, 1, 'Le début de l\'aventure', '5220', '1'),
(2, 2, 'Le mystérieux coffre', '4150', '2'),
(3, 3, 'La découverte du trésor', '3851', '1'),
(4, 4, 'L\'arrivée des pirates', '6510', '3'),
(5, 5, 'Le combat final', '6010', '16');

INSERT INTO UTILISATEURS (nom_utilisateur, prenom_utilisateur, email_utilisateur, pseudo_utilisateur, mdp_utilisateur, photo_profil_utilisateur, id_role) VALUES
('Dupont', 'Pierre', 'pierre.dupont@example.com', 'pierrot', 's3cr3t', 'http://example.com/photo.jpg', 2),
('Martin', 'Sophie', 'sophie.martin@example.com', 'soso', '123456', 'http://example.com/photo2.jpg', 1),
('Lefebvre', 'Julie', 'julie.lefebvre@example.com', 'julie123', 'password', 'http://example.com/photo3.jpg', 3);

UPDATE UTILISATEURS SET mdp_utilisateur = SHA2(mdp_utilisateur, 256);

       
INSERT INTO UTILISATEURS_FILMS (id_utilisateur, id_film, date_utilisateur_visionnage) VALUES
(1, 3, '2022-02-01'),
(2, 1, '2022-02-15'),
(3, 3, '2022-02-27'),
(1, 2, '2022-03-10');

INSERT INTO UTILISATEURS_SERIES (id_utilisateur, id_serie, date_utilisateur_visionnage) VALUES
(1, 3, '2022-03-02'),
(2, 2, '2022-02-20'),
(3, 1, '2022-03-11');


SELECT pseudo_utilisateur FROM UTILISATEURS;

SELECT u.nom_utilisateur, u.prenom_utilisateur, u.email_utilisateur, u.pseudo_utilisateur, r.libelle_role
FROM UTILISATEURS u
JOIN ROLES r
ON u.id_role = r.id_role;

SELECT titre_film AS Titre FROM FILMS
UNION
SELECT titre_serie FROM SERIES;

SELECT titre_film, duree_film FROM FILMS;

SELECT DATE_ADD(CURTIME(), INTERVAL duree_film SECOND) AS "Fin_du_film", titre_film FROM FILMS;

SELECT s.titre_serie, COUNT(sa.id_saison) 
AS nombre_saisons 
FROM SERIES s 
JOIN SAISONS sa 
ON s.id_serie = sa.id_serie 
GROUP BY s.id_serie 
ORDER BY s.titre_serie ASC;

SELECT s.titre_serie, sa.titre_saison, SUM(e.duree_episode) AS duree_totale
FROM SERIES s
JOIN SAISONS sa ON s.id_serie = sa.id_serie
JOIN EPISODES e ON sa.id_saison = e.id_saison
GROUP BY s.titre_serie, sa.id_saison;





