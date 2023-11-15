

let countryFlag;
const flagContainer = document.getElementById('flags');
const resultConvert = document.getElementById('conversion');
const amount = document.getElementById('amount');
const convert = document.getElementById('convertButton');
const finalAmount = document.getElementById('finalRate');
const icon1 = document.getElementById('todayIcon');
const icon2 = document.getElementById('day1Icon');
const maxTemp0 = document.getElementById('todayMaxTemp');
const minTemp0 = document.getElementById('todayMinTemp');
const maxTemp1 = document.getElementById('day1MaxTemp');
const minTemp1 = document.getElementById('day1MinTemp');
const maxTemp2 = document.getElementById('day2MaxTemp');
const minTemp2 = document.getElementById('day2MinTemp');
const day1Date = document.getElementById('day1Date');
const day2Date = document.getElementById('day2Date');
const icon3 = document.getElementById('day2Icon');
const modalLabel = document.getElementById('weatherModalLabel');
const lastUpdated = document.getElementById('lastUpdated');
// const feelsLike = document.getElementById('feelslike');
const description = document.getElementById('todayConditions');
const dateForecast = document.getElementById('date');
const maxTemp = document.getElementById('maxtemp');
const minTemp = document.getElementById('mintemp');
const description2 = document.getElementById('weatherDescriptionForecast');
const countryContainer = document.getElementById('country');
let userCurrency = "";
let capitalCity;
let fetched = false;




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

airports = L.markerClusterGroup({
    polygonOptions: {
      fillColor: '#fff',
      color: '#000',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5
    }}).addTo(map);

    hotels = L.markerClusterGroup({
        polygonOptions: {
          fillColor: '#fff',
          color: '#000',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.5
        }}).addTo(map);

    hospitals = L.markerClusterGroup({
            polygonOptions: {
              fillColor: '#fff',
              color: '#000',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.5
            }}).addTo(map);
        universities = L.markerClusterGroup({
                    polygonOptions: {
                    fillColor: '#fff',
                    color: '#000',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.5
                    }}).addTo(map);
                    
    
    
 overlays = {
"Airports": airports,
"Hotels": hotels,
"Hospitals": hospitals,
"Universities": universities,

};

  
  var layerControl = L.control.layers(basemaps, overlays).addTo(map);
  let myLayer;
  myLayer = L.geoJSON().addTo(map);
  
L.easyButton("fa-info fa-lg", function (btn, map) {
    $("#myModal").modal("show");
  }).addTo(map); 

L.easyButton("fa-solid fa-cloud-moon-rain", function (btn, map) {
    $("#weatherModal").modal("show");
  }).addTo(map);

L.easyButton("fa-solid fa-calendar-days", function (btn, map) {
    $("#Public-holidays").modal("show");
  }).addTo(map);


L.easyButton("fa-solid fa-newspaper", function (btn, map) {
    $("#modal4").modal("show");
    }).addTo(map);

L.easyButton("fa-solid fa-money-bill fa-xl", function (btn, map) {
    $("#currencyConversion").modal("show");
    }).addTo(map);

L.easyButton("fa-solid fa-globe fa-xl", function (btn, map) {
        $("#modal3").modal("show");
      }).addTo(map);

  
map.locate({setView: true, maxZoom: 8});

function onLocationFound(e) {
     var radius = e.accuracy;
        
    L.circle(e.latlng, radius).addTo(map);
    
 }



map.on('locationfound', onLocationFound);


let longitude;
let latitude;

var airportsIcon = L.ExtraMarkers.icon({
    prefix: 'fa',
    icon: 'fa-plane',
    iconColor: 'black',
    markerColor: 'white',
    shape: 'square'
  });



if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        longitude = lng;
        latitude = lat;

        fetchOpenCage(lat, lng);
        selectCountry();
        
        
      },
      function(error) {
        if (error.code === error.PERMISSION_DENIED) {
          console.log("User denied the geolocation request.");
        } else {
          console.error("Geolocation error: " + error.message);
        }
      }
    );
  } else {
    console.log("Geolocation is not available in your browser.");
  }
 

function getCountries() {
    if(fetched) return;

    $.ajax({
        type: "GET",
        url: "libs/php/getCountryList.php",
        dataType: "json",
        success: function (result) {

        
            var options = '<option value=""></option>';
            for (var i = 0; i < result.length; i++) {
                options += '<option value="' + result[i][1] + '">' + result[i][0] + '</option>';
            }
            $('#countryContainer').html(options);
            



            countryContainer.addEventListener('change', function (e){
                const target = e.target;
                const longitude = target.options[target.selectedIndex].dataset.lng;
                const latitude = target.options[target.selectedIndex].dataset.lat;
                let countryCode = target.value;
                let Countries = target.options[target.selectedIndex].innerHTML;
                let unspacedCountryName = Countries.split(" ").length > 1 ? Countries.split(" ").join("") : Countries;
                userCurrency = target.options[target.selectedIndex].dataset.currencies;
                

                document.getElementById('localCurrency').innerHTML = userCurrency;
                getWeather(latitude, longitude);
                getCountryInfo(countryCode);
                getWiki(unspacedCountryName);
                getNews(countryCode);
                allMarkers(countryCode);
                //getConversion(userCurrency);
                getBorder(countryCode);
                getFlag(countryCode);
                getHolidays(countryCode);
               
                
                
               
            
            

            map.setView([longitude, latitude], 12);
            L.marker([longitude, latitude]).addTo(map);

             
        });
  

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });
}

$(document).ready(function () {
    

    getCountries();

             

});

function getHolidays(countryCode) {
$.ajax({
    url: "libs/php/holidays.php",
    type: "GET",
    dataType: "json",

    data: {
        country : countryCode
    },
    success: function (result) {
    var holidays = JSON.parse(result);
      console.log(holidays);

                
                 holidays.forEach(function(holiday) {
                     $('#holidayName').append('<div>' + holiday.name + '</div>');
                     $('#holidayDate').append('<div>' + holiday.date + '</div>');
                     $('#holidayType').append('<div>' + holiday.type + '</div>');
                     $('#holidayDescription').append('<div>' + holiday.description + '</div>');
                 });
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
    }
});
}

    // $.ajax({
    //     url: "libs/php/getB.php",
    //     type: 'POST',
    //     dataType: 'json',
    //     data: {
    //       countryCode: countryCode
    //     },
    //     success: function (result) {
                
    //       if (result.status.code == 200) {
            
    //         result.data.forEach(function(item) {
              
    //           L.marker([item.lat, item.lng], {icon: airportsIcon})
    //             .bindTooltip(item.name, {direction: 'top', sticky: true})
    //             .addTo(airports);
              
    //         })
           
    //       } else {
    
    //         showToast("Error retrieving airport data", 4000, false);
    
    //       } 
    
    //     },
    //     error: function (jqXHR, textStatus, errorThrown) {
    //       showToast("Airports - server error", 4000, false);
    //     }
    //   });      
         

function getBorder(countryCode) {
    $.ajax({
        
        url: "libs/php/getB.php",
     type: "GET",
    data: {
       countryCode: countryCode
     },
      success: function (data) {
        

// Clear existing layers if needed (optional)
myLayer.clearLayers();

// Add the new polygon data and set its style
myLayer.addData(data).setStyle(polyStyle);

// Fit the map to the bounds of the polygon
const bounds = myLayer.getBounds();
map.fitBounds(bounds);

// Get the bounds of the polygon
const north = bounds.getNorth();
const south = bounds.getSouth();
const east = bounds.getEast();

// Polygon styling
function polyStyle() {
return {
color: "#994444",
weight: 7,
opacity: 0.5,
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


function getConversion(userCurrency) {
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
           
            
           
        },
        error: function (jqXHR, textStatus, errorThrown) {
           
            const data = JSON.parse(jqXHR.responseText.replace("*", ""));
            resultConvert.innerHTML =  data.data[`USD_${userCurrency}`] + "";
           
            
            
        }
    });

}

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
           
            
           
        },
        error: function (jqXHR, textStatus, errorThrown) {
            const data = JSON.parse(jqXHR.responseText.replace("*", ""));
            const exchangeRate = parseInt(amount.value)/data.data[`USD_${userCurrency}`] + "";
            finalAmount.innerHTML = exchangeRate.substring(0, 5);
           
            
            
        }
    });
});



function getCountryInfo(countryCode) {
    const populationValue = document.getElementById('population');
            $.ajax({
                url: "libs/php/countryName.php",
                type: "POST",
                
                dataType: "json",
                data: {
                    countryCode : countryCode
                },
                success: function (result) {
                    const number = result.data[0].population;
                    const formatter = new Intl.NumberFormat('en-US', {
                       style: 'decimal',
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 0
             });
                    const formattedNumber = formatter.format(number);
                    const capitalCity = result.data[0].capital;

                   countryName.innerHTML = result.data[0].countryName;
                   capitalCity.innerHTML = capitalCity;
                   populationValue.innerHTML = formattedNumber;
                   document.getElementById('language').innerHTML = result.data[0].languages;
                   document.getElementById('continent').innerHTML = result.data[0].continentName;
                   document.getElementById('localCurrency').innerHTML = result.data[0].currencyCode;
                   document.getElementById('currency').innerHTML = result.data[0].currencyCode;
                   document.getElementById('areaInSqKm').innerHTML = result.data[0].areaInSqKm;
                   document.getElementById('isoAlpha2').innerHTML = result.data[0].countryCode;
                   document.getElementById('isoAlpha3').innerHTML = result.data[0].isoAlpha3;
        
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
            });
            }

function getWiki(countryName) {   
            $.ajax({
                url: "libs/php/wiki.php",
                type: "POST",
                
                dataType: "json",
                data: {
                  q : countryName
                },
                success: function (result) {
                    document.getElementById('initialInfo').innerHTML = result.data[0].summary;
                    wiki.innerHTML = `<a href="https://${result.data[0].wikipediaUrl}" target="_blank">Click Here To Read More</a>`
                   
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
            });
        }

        function getNews(countryCode) {
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

                    
                    
                   
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
            });
        }

function getWeather(lat, lng) {
    $.ajax({
        url: "libs/php/getWeather.php",
        type: "GET",
        
        dataType: "json",
         data: {
             lat : lat,
             lng : lng
         },
        success: function (result) {
            console.log(result);
            const date = new moment(result.forecast.forecastday[0].date);
            
            modalLabel.innerHTML = `${result.location.name}, ${result.location.country}`;
            maxTemp0.innerHTML = result.forecast.forecastday[0].day.maxtemp_c;
            minTemp0.innerHTML = result.forecast.forecastday[0].day.mintemp_c;
            $('#icon1').attr("src", d.forecast[0].conditionIcon);
            description.innerHTML = result.forecast.forecastday[0].day.condition.text;
            
            day1Date.innerHTML = date.add(1, 'days').format('dddd, Do MMMM');
            maxTemp1.innerHTML = result.forecast.forecastday[1].day.maxtemp_c;
            minTemp1.innerHTML = result.forecast.forecastday[1].day.mintemp_c;
            $('#icon2').attr("src", d.forecast[1].conditionIcon);
                   
            day2Date.innerHTML = date.add(2, 'days').format('dddd, Do MMMM');
            maxTemp2.innerHTML = result.forecast.forecastday[2].day.maxtemp_c;
            minTemp2.innerHTML = result.forecast.forecastday[2].day.mintemp_c;
            $('#icon3').attr("src", d.forecast[2].conditionIcon);
                   
           lastUpdated.innerHTML = `Last Updated: ${result.current.last_updated}. moment().format('dddd, Do MMMM')`;
           
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });


  }
function getFlag(countryCode) {
    $.ajax({
        url: "libs/php/countryFlag.php",
        type: "GET",
        
        dataType: "json",
        data: {
            countryCode : countryCode
        },
        success: function (result) {
            countryFlag = result;
            flagContainer.src = countryFlag;

            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            countryFlag = jqXHR.responseText;
            flagContainer.src = countryFlag;

        }
    });
}

  function allMarkers(countryCode) {
    $.ajax({
        url: "libs/php/markers.php",
        type: "POST",
        
        dataType: "json",
        data: {
            q : "airport",
            country : countryCode
        },
        success: function (result) {

            var airportIcon = L.icon({
                iconUrl: 'libs/image/airport.png',
                shadowUrl: 'libs/image/airport_shadow.png',
            
                iconSize:     [18, 40], // size of the icon
                shadowSize:   [8, 24], // size of the shadow
                iconAnchor:   [11, 64], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 32],  // the same for the shadow
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            });
            for (let i = 0; i < result.data.geonames.length; i++) {
                const marker = L.marker([result.data.geonames[i].lat, result.data.geonames[i].lng], {icon: airportIcon}).addTo(airports);
                marker.bindPopup(` ${result.data.geonames[i].asciiName}</b>`).addTo(airports);
            }
           
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });

    $.ajax({
        url: "libs/php/markers.php",
        type: "POST",
        
        dataType: "json",
        data: {
            q : "hospital",
            country : countryCode
        },
        success: function (result) {

            var hospitalIcon = L.icon({
                iconUrl: 'libs/image/hospital.png',
                shadowUrl: 'libs/image/hospital_shadow.png',
            
                iconSize:     [28, 40], // size of the icon
                shadowSize:   [10, 34], // size of the shadow
                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            });
            for (let i = 0; i < result.data.geonames.length; i++) {
                const marker = L.marker([result.data.geonames[i].lat, result.data.geonames[i].lng], {icon: hospitalIcon}).addTo(hospitals);
                marker.bindPopup(`${result.data.geonames[i].asciiName}</b>`).addTo(hospitals);
            }
           
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });

    $.ajax({
        url: "libs/php/markers.php",
        type: "POST",
        
        dataType: "json",
        data: {
            q : "university",
            country : countryCode
        },
        success: function (result) {

            var universityIcon = L.icon({
                iconUrl: 'libs/image/university.png',
                shadowUrl: 'libs/image/university_shadow.png',
            
                iconSize:     [18, 40], // size of the icon
                shadowSize:   [8, 24], // size of the shadow
                iconAnchor:   [11, 64], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 32],  // the same for the shadow
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            });
            for (let i = 0; i < result.data.geonames.length; i++) {
                const marker = L.marker([result.data.geonames[i].lat, result.data.geonames[i].lng], {icon: universityIcon}).addTo(universities);
                marker.bindPopup(`${result.data.geonames[i].asciiName}</b>`).addTo(universities);
            }
           
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });

    $.ajax({
        url: "libs/php/markers.php",
        type: "POST",
        
        dataType: "json",
        data: {
            q : "hotel",
            country : countryCode
        },
        success: function (result) {

            var hotelIcon = L.icon({
                iconUrl: 'libs/image/hotel.png',
                shadowUrl: 'libs/image/hotel_shadow.png',
            
                iconSize:     [18, 40], // size of the icon
                shadowSize:   [8, 24], // size of the shadow
                iconAnchor:   [11, 64], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 32],  // the same for the shadow
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            });
            for (let i = 0; i < result.data.geonames.length; i++) {
                const marker = L.marker([result.data.geonames[i].lat, result.data.geonames[i].lng], {icon: hotelIcon}).addTo(hotels);
                marker.bindPopup(`${result.data.geonames[i].asciiName}</b>`).addTo(hotels);
            }
           
        },
       

    });

}

map.addLayer(airports);
    map.addLayer(hospitals);
    map.addLayer(universities);
    map.addLayer(hotels);

function selectCountry(){
    $.ajax({
        type: "GET",
        url: "libs/php/countries.php",
        dataType: "json",
        success: function (result) {
            
            countryContainer.innerHTML = result.data.map(country => {
                
    
                return `<option data-lng="${country.latlng[0]}" data-lat="${country.latlng[1]}" data-currencies="${country.currencies ? Object.keys(country.currencies)[0] : ""}" value="${country.cca2}">${country.name.common}</option>`;
            }).join(""); // Added the join() function to concatenate the option elements properly
    
            $("#country").html($("#country option").sort(function (a, b) {
                return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
            }));
    
            // Automatically select the country of location
            let userCountry = ""; // Set the user's country based on the location
            $("#country option").each(function () {
                if ($(this).text() === userCountry) {
                    $(this).prop('selected', true);
                    return false; // Break out of the loop once the country is selected
                    
                }
            });
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });
    
}

  function fetchOpenCage(lat, lng){
    $.ajax({
        url: "libs/php/opencage.php",
        type: "GET",
        
        dataType: "json",
        data: {
            lat : lat,
            lng : lng
        },
        
        success: function (result) {
            

            let countryCode = result.data.results[0].components.country_code.toUpperCase();
            userCurrency = result.data.results[0].annotations.currency.iso_code;
            let countryName = result.data.results[0].components.country;
            let unspacedCountryName = countryName.split(" ").length > 1 ? countryName.split(" ").join("") : countryName;
            let capitalCity = result.data.results[0].components.city;
            
            getWeather(lat, lng);
            getCountryInfo(countryCode);
            allMarkers(countryCode);
            getWiki(unspacedCountryName);
            getNews(countryCode);
            getBorder(countryCode);
            //getConversion(userCurrency);
            getCountries();
            getFlag(countryCode);
            getHolidays(countryCode);
            

            $.ajax({
                type: "GET",
                url: "libs/php/getCountryList.php",
                dataType: "json",
                success: function (result) {
        
                    let currencyCode = "";
                   
                    var options = '<option value=""></option>';
                    for (var i = 0; i < result.length; i++) {
                        options += '<option value="' + result[i][1] + '">' + result[i][0] + '</option>';
                    }
                    $('#countryContainer').html(options);
                    
            //     // automatically select the country of location
            setTimeout(() => {
                for(let i = 0; i < countryContainer.length; i++) {
                    if(countryContainer[i].innerHTML === countryName) {
                                 countryContainer.selectedIndex = i;
                                 break;
                             }
        
                   
                    }
            }, 1000);
            
        }, error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
           }});
        }
    });
}


  
  