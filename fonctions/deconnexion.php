<?php
session_start();

session_destroy();
setcookie('id', "", 1);
setcookie('pseudo', "", 1);
setcookie('mail', "", 1);
setcookie('role', "", 1);

header("Location: " . URL . "connexion");
