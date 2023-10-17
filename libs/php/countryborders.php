<?php

$geoJsonFilePath = 'ccountryBorders.geo.json';

// Check if the file exists
if (file_exists($geoJsonFilePath)) {
    // Read the GeoJSON file
    $geoJsonData = file_get_contents($geoJsonFilePath);
    
    if ($geoJsonData === false) {
        // There was an error reading the file
        error_log("Error reading geoJSON file: $geoJsonFilePath");
    } else {
        // Parse the GeoJSON data as a JSON object
        $geoJsonObject = json_decode($geoJsonData);

        if (json_last_error() !== JSON_ERROR_NONE) {
            // There was an error parsing the JSON
            error_log("Error parsing geoJSON data: " . json_last_error_msg());
        } else {
            // To extract the geometry of a particular country, loop through the features
            foreach ($geoJsonObject->features as $feature) {
                // Extract the country information
                $countryCode = $feature->properties->iso_a2;
                $countryName = $feature->properties->name;
                
                // Extract the geometry of the country
                $countryGeometry = $feature->geometry;
                
                // Do something with the extracted data
                // You can echo or store this data as required
                echo "Country Code: $countryCode, Country Name: $countryName\n";
                echo "Country Geometry: ";
                var_dump($countryGeometry);
            }
        }
    }
} else {
    // The file does not exist
    error_log("GeoJSON file not found: $geoJsonFilePath");
}

?>
