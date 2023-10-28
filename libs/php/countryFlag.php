<?php
$curl = curl_init();

$countryCode = $_REQUEST['countryCode'];
$url = "https://flagsapi.com/{$countryCode}/shiny/64.png";

    echo $url;

?>
