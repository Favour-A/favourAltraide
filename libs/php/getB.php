
<?php
$string_json = file_get_contents("../json/ccountryBorders.geo.json");

$decoded = json_decode($string_json);
$features = $decoded->features;
$countryCode = $_GET['countryCode'];
$poly = "";

for($i=0;$i<sizeof($features);$i++){
    $feature = $features[$i];
    if($feature->properties->iso_a2 == $countryCode){
        $poly = $feature->geometry;
    }
}

//header('Content-Type: application/json; charset=UTF-8');

echo json_encode($poly);
?>
