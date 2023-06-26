<?php
try {
    $db = new PDO('mysql:host=51.210.104.251;dbname=cinerama;port=3306;charset=utf8', 'maganor', 'azerty123');
    /* $db = new PDO( 'mysql:host=localhost;dbname=cinerama;charset=utf8', 'root', '' ); */
} catch (Exception $e) {
    die($e->getMessage());
}
