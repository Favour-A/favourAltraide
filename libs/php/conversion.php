<?php
   
    ini_set('display_errors', 'on');
    error_reporting(E_ALL);
    
    $executionStartTime = microtime(true);

    $from_currency = $_REQUEST['from_currency'];
    
    
    $url= "https://prepaid.currconv.com/api/v7/convert?q=USD_{$from_currency}&compact=ultra&apiKey=pr_7d313e08a26a45af8d9e7416d8b6125c";
    
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