

var streets = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
    }
  );
  
  var satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
  );
  var basemaps = {
    "Streets": streets,
    "Satellite": satellite
  };
  
  var map = L.map("map", {
    layers: [streets]
  }).setView([54.5, -4], 6);
  
  var layerControl = L.control.layers(basemaps).addTo(map);
  let myLayer;
  myLayer = L.geoJSON().addTo(map);
  
  L.easyButton("fa-info fa-lg", function (btn, map) {
    $("#myModal").modal("show");
  }).addTo(map); 

  L.easyButton("fa-solid fa-cloud-moon-rain", function (btn, map) {
    $("#modal1").modal("show");
  }).addTo(map);

  L.easyButton("fa-solid fa-clock fa-xl", function (btn, map) {
    $("#timezone").modal("show");
  }).addTo(map);

  L.easyButton("fa-solid fa-newspaper", function (btn, map) {
    $("#modal4").modal("show");
    }).addTo(map);

  L.easyButton("fa-solid fa-money-bill fa-xl", function (btn, map) {
    $("#exchangeRate").modal("show");
    }).addTo(map);

    L.easyButton("fa-solid fa-globe fa-xl", function (btn, map) {
        $("#modal3").modal("show");
      }).addTo(map);
    
  let testing = "";
  map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        
    L.circle(e.latlng, radius).addTo(map);
    testing = e.latlng;
}



map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);



 /*var geojsonFeature = {
  "type": "Feature",
  "properties": {
      "name": "Heathrow Airport",
      "amenity": "Airport",
      "popupContent": "This is Heathrow Airport!"
  },
  "geometry": {
      "type": "Point",
      "coordinates": [0.4494, 51.4697]
  }
};

L.geoJSON(geojsonFeature).addTo(map);*/

//ajax request for the countries select box


const countryContainer = document.getElementById('country');
let userCurrency = "";

$(document).ready(function () {

    $.ajax({
        type: "GET",
        url: "libs/php/countries.php",
        dataType: "json",
        success: function (result) {

            let currencyCode = "";
           // console.log(result.data[0].currencies);
            //console.log(result)
            //console.log(Object.keys(result.data[0].currencies));

            countryContainer.innerHTML = result.data.map(country => { 
                //console.log(country.currencies)
                
                return `<option data-lng="${country.latlng[0]}"  data-lat="${country.latlng[1]}"  data-currencies="${country.currencies ? Object.keys(country.currencies)[0]: ""}"  value="${country.cca2}">${country.name.common}</option>`
            });

            $("#country").html($("#country option").sort(function (a, b) {
                return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
            }));




            countryContainer.addEventListener('change', function (e){
                const target = e.target;
                const longitude = target.options[target.selectedIndex].dataset.lng;
                const latitude = target.options[target.selectedIndex].dataset.lat;
                let countryCode = target.value;
                let Countries = target.options[target.selectedIndex].innerHTML;
                console.log(Countries);
               
            
            

            map.setView([longitude, latitude], 12);
            L.marker([longitude, latitude]).addTo(map);

            let countryFlag = `https://flagsapi.com/${target.value}/shiny/64.png`;
            //console.log(countryFlag);
            const flagContainer = document.getElementById('flags');
            flagContainer.src = countryFlag;

            const countryName = document.getElementById('countryName');
            const capitalCity = document.getElementById('capitalCity');
            const populationValue = document.getElementById('population');
            
           

            $.ajax({
                url: "libs/php/countryName.php",
                type: "POST",
                
                dataType: "json",
                data: {
                    countryCode : target.value
                },
                success: function (result) {
                   countryName.innerHTML = result.data[0].countryName;
                   capitalCity.innerHTML = result.data[0].capital;
                   populationValue.innerHTML = result.data[0].population;
                   document.getElementById('language').innerHTML = result.data[0].languages;
                   document.getElementById('continent').innerHTML = result.data[0].continentName;
        
                   console.log(result);
                   
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
            });

            

            
            $.ajax({
                url: "libs/php/openweather.php",
                type: "POST",
                
                dataType: "json",
                data: {
                    q : target.options[target.selectedIndex].innerHTML
                },
                success: function (result) {
                    
                    document.getElementById('temperature').innerHTML = result.data.main.temp;
                    document.getElementById('feelsLike').innerHTML = result.data.main.feels_like;
                    document.getElementById('maxtemp').innerHTML = result.data.main.temp_max;
                    document.getElementById('mintemp').innerHTML = result.data.main.temp_min;
                    document.getElementById('forecast').innerHTML = result.data.weather[0].description;

                   console.log(result);
                   //console.log(target.options[target.selectedIndex].innerHTML);
                   
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
            });

            $.ajax({
                url: "libs/php/wiki.php",
                type: "POST",
                
                dataType: "json",
                data: {
                  q : target.options[target.selectedIndex].innerHTML
                },
                success: function (result) {
                    document.getElementById('initialInfo').innerHTML = result.data[0].summary;
                    wiki.innerHTML = `<a href="https://${result.data[0].wikipediaUrl}" target="_blank">Click Here To Read More</a>`
                   console.log(result);
                   
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
            });

            // Display border
         function getBorder(countryCode) {
            $.ajax({
                
                url: "libs/php/getB.php",
             type: "GET",
            data: {
               countryCode: countryCode
             },
              success: function (data) {
                 console.log("Received data:", data);
        //  // Parse the received JSON data
        //        const polygon = JSON.parse(data);
        
        //        console.log(polygon);
        //  // Clear existing layers if needed (optional)
        //        myLayer.clearLayers();
  
        // // Add the new polygon data and set its style
        //        myLayer.addData(polygon).setStyle(polyStyle);
  
        //  // Fit the map to the bounds of the polygon
        //        const bounds = myLayer.getBounds();
        //        map.fitBounds(bounds);

        
      // Clear existing layers if needed (optional)
      myLayer.clearLayers();

      // Add the new polygon data and set its style
      myLayer.addData(data).setStyle(polyStyle);

      // Fit the map to the bounds of the polygon
      const bounds = myLayer.getBounds();
      map.fitBounds(bounds);

      // Optionally, you can extract the bounding coordinates
      const north = bounds.getNorth();
      const south = bounds.getSouth();
      const east = bounds.getEast();

       // Polygon styling
       function polyStyle() {
        return {
        color: "#994444",
        weight: 9,
        opacity: 1.0,
        fillColor: "#fcb6b6",
        fillOpacity: 0.45
        };
    }
       },
       error: function (xhr, status, error) {
        console.error("Error:", error);
        console.log(xhr.responseText);
    }
    

       
     });
    }

        getBorder(countryCode);

     
    

            

    
  

            $.ajax({
                url: "libs/php/timezone.php",
                type: "POST",
                
                dataType: "json",
                data: {
                  lat : longitude,
                  lng : latitude
                  

                },
                success: function (result) {
                    document.getElementById('timeZone').innerHTML = result.data.timezoneId;
                    document.getElementById('currentTime').innerHTML = result.data.time;
                    document.getElementById('sunrise').innerHTML = result.data.sunrise;
                    document.getElementById('sunset').innerHTML = result.data.sunset;
			
                    
                   //console.log(result);
                   
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
            });

            
            

            $.ajax({
                url: "libs/php/opencage.php",
                type: "GET",
                
                dataType: "json",
                data: {
                    q : target.options[target.selectedIndex].innerHTML
                },
                success: function (result) {
                    
                    console.log(result);
                   
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
            });

            userCurrency = target.options[target.selectedIndex].dataset.currencies;
            document.getElementById('localCurrency').innerHTML = userCurrency;

            $.ajax({
                url: "libs/php/conversion.php",
                type: "GET",
                
                dataType: "json",
                data: {
                    
                    from_currency : userCurrency
                    
                },
                success: function (result) {
                    document.getElementById('conversion').innerHTML = result.data[`USD_${userCurrency}`];
                    console.log(result);
                   
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
            });

            $.ajax({
                url: "libs/php/News.php",
                type: "GET",
                
                dataType: "json",
                data: {
                    
                   country : countryCode
                    
                },
                success: function (result) {
                    document.getElementById('newsTitle').innerHTML = result.data.articles[0].title;
                    document.getElementById('newsDescription').innerHTML = result.data.articles[0].description;
                    document.getElementById('newsUrl').innerHTML = `<a href="${result.data.articles[0].url}" target="_blank">Click Here To Read More</a>`;
                    document.getElementById('publishedAt').innerHTML = result.data.articles[0].publishedAt;

                    document.getElementById('newsTitle1').innerHTML = result.data.articles[1].title;
                    document.getElementById('newsDescription1').innerHTML = result.data.articles[1].description;
                    document.getElementById('publishedAt1').innerHTML = result.data.articles[1].publishedAt;
                    document.getElementById('newsUrl1').innerHTML = `<a href="${result.data.articles[1].url}" target="_blank">Click Here To Read More</a>`;

                    document.getElementById('newsTitle2').innerHTML = result.data.articles[2].title;
                    document.getElementById('newsDescription2').innerHTML = result.data.articles[2].description;
                    document.getElementById('publishedAt2').innerHTML = result.data.articles[2].publishedAt;
                    document.getElementById('newsUrl2').innerHTML = `<a href="${result.data.articles[2].url}" target="_blank">Click Here To Read More</a>`;

                    document.getElementById('newsTitle3').innerHTML = result.data.articles[3].title;
                    document.getElementById('newsDescription3').innerHTML = result.data.articles[3].description;
                    document.getElementById('publishedAt3').innerHTML = result.data.articles[3].publishedAt;
                    document.getElementById('newsUrl3').innerHTML = `<a href="${result.data.articles[3].url}" target="_blank">Click Here To Read More</a>`;

                    document.getElementById('newsTitle4').innerHTML = result.data.articles[4].title;
                    document.getElementById('newsDescription4').innerHTML = result.data.articles[4].description;
                    document.getElementById('publishedAt4').innerHTML = result.data.articles[4].publishedAt;
                    document.getElementById('newsUrl4').innerHTML = `<a href="${result.data.articles[4].url}" target="_blank">Click Here To Read More</a>`;

                    document.getElementById('newsTitle5').innerHTML = result.data.articles[5].title;
                    document.getElementById('newsDescription5').innerHTML = result.data.articles[5].description;
                    document.getElementById('publishedAt5').innerHTML = result.data.articles[5].publishedAt;
                    document.getElementById('newsUrl5').innerHTML = `<a href="${result.data.articles[5].url}" target="_blank">Click Here To Read More</a>`;

                    document.getElementById('newsTitle6').innerHTML = result.data.articles[6].title;
                    document.getElementById('newsDescription6').innerHTML = result.data.articles[6].description;
                    document.getElementById('publishedAt6').innerHTML = result.data.articles[6].publishedAt;
                    document.getElementById('newsUrl6').innerHTML = `<a href="${result.data.articles[6].url}" target="_blank">Click Here To Read More</a>`;


                    console.log(result);
                   
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
            });

            
        });




            

           //console.log(result);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });

    

    



});

const amount = document.getElementById('amount');
const convert = document.getElementById('convertButton');
const finalAmount = document.getElementById('finalRate');
convert.addEventListener('click', function (e) {
    $.ajax({
        url: "libs/php/conversion.php",
        type: "GET",
        
        dataType: "json",
        data: {
            from_currency : userCurrency
            
        },
        success: function (result) {
            const exchangeRate = parseInt(amount.value)/result.data[`USD_${userCurrency}`] + "";
            finalAmount.innerHTML = exchangeRate.substring(0, 5);
            console.log(result);
           
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });
});


    


  
  
  