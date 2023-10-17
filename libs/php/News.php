

<?php

ini_set('display_errors', 'on');
error_reporting(E_ALL);

$executionStartTime = microtime(true);



$url= "https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=" . $_REQUEST['country'] . "&max=10&apikey=ff9e0c070245de3ddde4a48bc8d53815";
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);
curl_close($ch);

$decode = json_decode($result, true);
 

    
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);





?>




