$(document).ready(initializeApp);
var map;
var geocoder;
var globalMarkers = [];
var movieArray = [];
var movieObj = {}

function initializeApp() {
    getMovieInfoApi();
    $('#trailerModal').modal('hide');
    getCustomPlaces();
    addHandlers();
}

function addHandlers() {
    $(".topHalf button").on('click', determineStartCoords);
    // $(".topHalf button").on('click', displayFoodInArea);

}

function movieTrailer(title) {
    var ajaxOptions = {
        url: 'https://s-apis.learningfuze.com/hackathon/youtube/search.php',
        dataType: 'json',
        method: 'post',
        data: {
            'q': title + ' trailer',
            'maxResults': 1

        },
        success: function (response) {
            var videoID = response.video[0].id;
            $('#trailerModal').modal('show')
            $('#videoTrailer').attr('src', `https://www.youtube.com/embed/${videoID}?autoplay=1`);

        },
        error: function () {
            console.log('error')
        }
    }
    $.ajax(ajaxOptions)
}

function renderMovieOnDom(movie) {
    var movieDiv = $('<div>');
    movieDiv.addClass('item');
    var poster = $('<img>', {
        src: movie.moviePoster,
        height: '85%'
    });
    var rating = $('<div>').text(movie.movieRating);
    movieDiv.append(poster, rating);
    movieDiv.on('click', movieTrailer)
    $('.carousel-inner').append(movieDiv)
    $('.item').first().addClass('active');
}


function displayMovieList(response) {
    var movies = response.results;
    var webAdd = "https://image.tmdb.org/t/p/w185";

    for (var index = 0; index < 16; index++) {
        var webImage = movies[index].poster_path;
        var movieTitle = movies[index].title;
        var moviePoster = webAdd + webImage;
        var movieRating = 'Rating: ' + movies[index].vote_average + ' / 10';
        movieObj = {
            movieTitle,
            moviePoster,
            movieRating
        };
        movieArray.push(movieObj);
        renderMovieOnDom(movieObj);
    }
}

function getMovieInfoApi() {
    var movieInfo = {
        dataType: 'json',
        url: 'https://api.themoviedb.org/3/movie/now_playing?api_key=90ec7552787d25df49e8eac53f951398&language=en-US&page=1',
        data: {
            api_key: '90ec7552787d25df49e8eac53f951398'
        },
        method: "GET",
        success: function (response) {
            console.log(response);
            displayMovieList(response);
        }
    }
    $.ajax(movieInfo);

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
                position: place.geometry.location,
                animation: google.maps.Animation.DROP
            });
            var infoWindow = new google.maps.InfoWindow({
                content: place.name
            });
            (function () {
                var thisMarker = marker;
                var name = place.name;
                var thisInfoWindow = infoWindow;
                marker.addListener('click', function () {
                    thisInfoWindow.open(map, thisMarker);
                    $("#myModal").modal('show');
                    $(".modal-title").text(name)
                });
            })()
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
    displayFoodInArea(address);
    var latLng = geocoder.geocode({
        'address': address
    }, getCustomPlaces);
}



function displayFoodInArea(cityname) {
    var ajaxOptions = {
        "url": "https://yelp.ongandy.com/businesses",
        "method": "POST",
        "dataType": "JSON",
        "data": {
            term: "restauraunts",
            location: cityname,
            api_key: "XSyryzoREYThrY1P0pDAkbK9uJV0j7TVklsKegO9g9aqqqGz87SZPuhQ0Cob0jzZ6G1BCVE9JaycPHyB2OI7hXgTJYs_enS7SKr1G21Jf45cDBYbUAHOFnh-r3FWW3Yx"
        },
        success: function (response) {
            console.log("it's in");
            var arrayOfBusinesses = response.businesses;
            console.log(arrayOfBusinesses);
            for (var i = 0; i < 6; i++) {
                var newDiv = $('<div>');
                $(newDiv).addClass('food');
                $(newDiv).addClass('item');
                var newh3 = $('<h4>');
                var newImage = $('<img>');
                newh3.text(arrayOfBusinesses[i].name);
                newImage.attr('src', arrayOfBusinesses[i]['image_url']);
                newDiv.append(newh3, newImage);
                console.log(newDiv);
                $('.food-library').append(newDiv);
                $('.food').first().addClass('active');
                var newPtag = $('<h4>').text(`Phone Number: ${arrayOfBusinesses[i].phone.slice(2)}`);
                var pricePTag = $('<h4>').text(`Price: ${arrayOfBusinesses[i].price}`)
                newDiv.append(newPtag, pricePTag)
            }

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
    // google.maps.event.addListener(marker, 'click', function(){
    //     console.log('clicked');
    // });
}

function clickMovieTheaters() {
    var yelpTheaters = {
        "url": "https://yelp.ongandy.com/businesses",
        "method": "POST",
        "dataType": "JSON",
        "data": {
            term: "theaters",
            location: "long beach",
            api_key: "XSyryzoREYThrY1P0pDAkbK9uJV0j7TVklsKegO9g9aqqqGz87SZPuhQ0Cob0jzZ6G1BCVE9JaycPHyB2OI7hXgTJYs_enS7SKr1G21Jf45cDBYbUAHOFnh-r3FWW3Yx"
        },
        success: function (response) {

        }
    }
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
        return;
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

            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            });

            var infoWindow = new google.maps.InfoWindow({
                content: place.name
            });

            marker.addListener('click', function () {
                console.log("Yo what's up");
                infoWindow.open(map, marker);
            });
            // Create a marker for each place.
            markers.push(marker);

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