$(document).ready(initializeApp);
var map;
var geocoder;
var globalMarkers = [];

function initializeApp() {
    // myMap();
    displayFoodInArea();
    getCustomPlaces();
    addHandlers();
}

function addHandlers() {
    $(".topHalf button").on('click', determineStartCoords);
}

function getCustomPlaces(result, status) {
    var lat = 33.6694444;
    var lng = -117.8222222;
    if (result) {
        lat = result[0].geometry.location.lat();
        lng = result[0].geometry.location.lng();
    }
    var coords = new google.maps.LatLng(lat, lng);
    var request = {
        location: coords,
        radius: 50,
        query: 'theater'
    }

    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, placeCallback);
}

function placeCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            console.log(marker)
            globalMarkers.push(marker);
        }
    }
}

function removeMarkers() {
    for (var i = 0; i < globalMarkers.length; i++) {
        globalMarkers[i].setMap(null);
    }
}

function determineStartCoords() {
    removeMarkers();
    var address = $("#pac-input").val();
    var latLng = geocoder.geocode({
        'address': address
    }, getCustomPlaces);
}



function displayFoodInArea() {
    var ajaxOptions = {
        "url": "https://yelp.ongandy.com/businesses",
        "method": "POST",
        "dataType": "JSON",
        "data": {
            term: "restauraunts",
            location: "cerritos",
            api_key: "XSyryzoREYThrY1P0pDAkbK9uJV0j7TVklsKegO9g9aqqqGz87SZPuhQ0Cob0jzZ6G1BCVE9JaycPHyB2OI7hXgTJYs_enS7SKr1G21Jf45cDBYbUAHOFnh-r3FWW3Yx"
        },
        success: function (response) {
            var userInput = $('#searchbar').val();
            $('button').on('click', function () {
                // console.log(userInput)
            })
            var arrayOfBusinesses = response.businesses;
            // console.log(arrayOfBusinesses[0].coordinates.latitude, arrayOfBusinesses[0].coordinates.longitude);


        },
        error: function () {
            console.log('error');
        }
    }
    $.ajax(ajaxOptions)
}

function myMap() {
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: new google.maps.LatLng(33.85998, -118.07172),
        zoom: 10 // how we center our map
    };
    var map = new google.maps.Map(mapCanvas, mapOptions);
    var marker = new google.maps.Marker({
        position: mapOptions.center,
        animation: google.maps.Animation.DROP
    });
    marker.setMap(map);
}

function initAutocomplete() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -33.8688,
            lng: 151.2195
        },
        zoom: 13,
        mapTypeId: 'roadmap'
    });
    geocoder = new google.maps.Geocoder();

    // Create the search box and link it to the UI element.
    var input = $('#pac-input')[0];
    var searchBox = new google.maps.places.SearchBox(input);
    console.log('search box', searchBox);
    // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}