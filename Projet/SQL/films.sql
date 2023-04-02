
CREATE TABLE `films` (
  `id` int(11) NOT NULL,
  `titre` varchar(50) NOT NULL,
  `titre_fr` varchar(50) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `annee` int(11) NOT NULL,
  `poster` text DEFAULT NULL,
  `affiche` text DEFAULT NULL,
  `id_du_media` int(11) NOT NULL,
  `imdb` varchar(50) NOT NULL,
  `ba` text DEFAULT NULL,
  `synopsis` text DEFAULT NULL,
  `duree` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;


--
ALTER TABLE `films`
  ADD PRIMARY KEY (`id`);

