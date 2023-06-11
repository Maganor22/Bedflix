<?php
require_once "../bdd/dbconnect.php";
require_once "../bdd/bddmanager.php";

/* // Connexion à la base de données
$db = getDb(); */

// Durée de vie de la clé en minutes
$keyLifetime = 10;

// Date et heure actuelles
$currentDateTime = new DateTime();

// Calculer la date et l'heure limite pour la suppression des clés expirées
$expirationDateTime = $currentDateTime->sub(new DateInterval("PT" . $keyLifetime . "M"));

// Supprimer les enregistrements expirés de la table email_verification
$query = $db->prepare("DELETE FROM email_verification WHERE date_creation < :expirationDateTime");
$query->execute([
    "expirationDateTime" => $expirationDateTime->format("Y-m-d H:i:s")
]);

// Fermer la connexion à la base de données
$db = null;
