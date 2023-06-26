-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : ven. 23 juin 2023 à 20:45
-- Version du serveur : 10.6.12-MariaDB-0ubuntu0.22.04.1
-- Version de PHP : 8.1.2-1ubuntu2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `cinerama`
--

-- --------------------------------------------------------

--
-- Structure de la table `commentaires_users`
--

CREATE TABLE `commentaires_users` (
  `id` int(11) NOT NULL,
  `id_films` int(11) NOT NULL,
  `commentaire` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `commentaires_users`
--
ALTER TABLE `commentaires_users`
  ADD PRIMARY KEY (`id`,`id_films`),
  ADD KEY `commentaires_users_commentaire_FK` (`id_films`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `commentaires_users`
--
ALTER TABLE `commentaires_users`
  ADD CONSTRAINT `commentaires_users_commentaire_FK` FOREIGN KEY (`id_films`) REFERENCES `films` (`id`),
  ADD CONSTRAINT `commentaires_users_utilisateurs_FK` FOREIGN KEY (`id`) REFERENCES `utilisateurs` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
