

 <?php
$curl = curl_init();

// Set the required URL and other cURL options
$url = "http://api.weatherapi.com/v1/forecast.json?key=03a38c7145004526888115159232610&q=" . $_REQUEST['lat'] . ",". $_REQUEST['lng'] .
 "&days=1&aqi=no&alerts=no";
curl_setopt_array($curl, array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo "cURL Error #:" . $err;
} else {
    echo $response;
}
?>

