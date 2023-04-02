<?php
session_start();

$response = array();

if (isset($_SESSION['pseudo'])) {
    $response['pseudo'] = $_SESSION['pseudo'];
} else {
    $response['pseudo'] = '';
}
if (isset($_SESSION['id'])) {
    $response['id'] = $_SESSION['id'];
} else {
    $response['id'] = '';
}

echo json_encode($response);
