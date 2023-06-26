<?php
require_once "../bdd/dbconnect.php";
require_once "../bdd/bddmanager.php";

function validate($id, $db)
{
    validateComment($id, $db);
}

function decline()
{
}
