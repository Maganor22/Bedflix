<?php

use PHPMailer\PHPMailer\PHPMailer; // On importe la classe tout en haut

class Mail {
    public function sendMail(String $mailTo, String $subject, String $body, $bEstHtml = true) {
        require 'vendor/autoload.php';
        $mail = new PHPMailer(true);
        // Paramètres du serveur
        $mail->isSMTP();
        $mail->SMTPDebug = 0;
        $mail->Debugoutput = 'html';
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        // Informations envoyeur/réceptionneur 
        $mail->Username = 'bedflix21@gmail.com';
        $mail->Password = 'sbwavugttiomorrz';
        $mail->From = 'bedflix21@gmail.com';
        $mail->FromName = 'Bedflix';
        $mail->addAddress($mailTo);
        // Contenu
        $mail->isHTML($bEstHtml); // Permet l'interprétation de l'HTML dans le mail
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';
        $mail->Subject = $subject;
        $mail->Body = $body;
        return $mail->send();
    }
}