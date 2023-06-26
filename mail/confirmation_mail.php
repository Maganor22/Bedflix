<?php
require_once "../bdd/dbconnect.php";
require_once "../bdd/bddmanager.php";

$code = $_GET['verif'];

$query = $db->prepare("SELECT * FROM email_verification WHERE cle_unique = :cle_unique");
$query->execute([
    "cle_unique" => $code
]);
$data = $query->fetch();
if ($data["cle_unique"] == $code) {
    $query = $db->prepare("UPDATE utilisateurs SET actif = 1 WHERE id = :id");
    $query->execute([
        "id" => $data["id_utilisateurs"]
    ]);
    $query = $db->prepare("DELETE FROM email_verification WHERE cle_unique = :cle_unique");
    $query->execute([
        "cle_unique" => $code
    ]);
    header("Location: ../connexion_view.php?success=1");
    exit();
} else {
    header("Location: ../connexion_view.php?failed=4");
    exit();
}
