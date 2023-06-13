<?php
session_start();
require_once "../bdd/dbconnect.php";
require_once "../bdd/bddmanager.php";

$password = $_POST['password'];
$id = $_SESSION['id'];

if (!isset($_SESSION['id'])) {
    header("Location: ../index.php?error=1");
    exit();
}

if (!isset($_POST['password']) || empty($_POST['password'])) {
    header("Location: ../index.php?error=2");
    exit();
}

$selectUser = $db->prepare("SELECT * FROM utilisateurs WHERE id = :id");
$selectUser->execute(array(
    'id' => $id
));
$selectUser = $selectUser->fetch();


if (!$selectUser || !password_verify($password, $selectUser['mdp'])) {
    $_SESSION['error'] = "Mot de passe incorrect";
    echo $_SESSION['error'];
    //header("Location: ../Bedflix/index.php?error=3");
    exit();
}

$result = $db->prepare("DELETE FROM utilisateurs WHERE id = :id");
$result->execute(array(
    'id' => $id
));

header("Location: deconnexion.php");
