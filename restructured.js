$(document).ready(initializeApp);
var map;
var geocoder;
var globalMarkers = [];
var movieArray = [];
var movieObj = {}
/**
 * @param  {} {getMovieInfoApi(
 * @param  {} ;$('#trailerModal'
 * @param  {} .modal('hide'
 * @param  {} ;getCustomPlaces(
 * @param  {} ;addHandlers(
 */
function initializeApp() {
    getMovieInfoApi();
    $('#trailerModal').modal('hide');
    getCustomPlaces();
    addHandlers();
}
/**
 * @param  {} {$(".topHalfbutton"
 * @param  {} .on('click'
 * @param  {} determineStartCoords
 */
function addHandlers() {
    $(".topHalf button").on('click', determineStartCoords);
    // $(".topHalf button").on('click', displayFoodInArea);

}
/**
 * @param  {} title
 * @param  {'https:dataType:'json'} {varajaxOptions={url
 * @param  {'post'} method
 * @param  {{'q':title+'trailer'} data
 * @param  {1}} 'maxResults'
 * @param  {function(response} success
 */
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
/**
 * @param  {} movie
 * @param  {} {varmovieDiv=$('<div>'
 * @param  {} ;movieDiv.addClass('item'
 * @param  {} .attr('title'
 * @param  {} movie.movieTitle
 * @param  {} ;varposter=$('<img>'
 * @param  {movie.moviePoster} {src
 * @param  {'85%'}} height
 */
function renderMovieOnDom(movie) {

    var movieDiv = $('<div>');
    movieDiv.addClass('item').attr('title',movie.movieTitle);
    var poster = $('<img>', {
        src: movie.moviePoster,
        height: '85%'
    });
    var rating = $('<div>').text(movie.movieRating);
    movieDiv.append(poster, rating);
    movieDiv.on('click', function(){
        
        movieTrailer(this.title);
       
    })
    $('.movie-library').append(movieDiv)
    $('.item').first().addClass('active');
}
/**
 * @param  {} response
 * @param  {for(varindex=0;index<16;index++} {varmovies=response.results;varwebAdd="https
 */
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
/**
 * @param  {'json'} {varmovieInfo={dataType
 * @param  {'https:data:{api_key:'90ec7552787d25df49e8eac53f951398'}} url
 * @param  {"GET"} method
 * @param  {function(response} success
 */
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
/**
 * @param  {} result
 * @param  {} status
 * @param  {} {varlat=33.6694444;varlng=-117.8222222;if(result
 * @param  {} {lat=result[0].geometry.location.lat(
 * @param  {} ;lng=result[0].geometry.location.lng(
 * @param  {} ;}varcoords=newgoogle.maps.LatLng(lat
 * @param  {} lng
 * @param  {coords} ;varrequest={location
 * @param  {50} radius
 * @param  {'theater'}varservice=newgoogle.maps.places.PlacesService(map} query
 */
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
/**
 * @param  {} results
 * @param  {} status
 * @param  {} {if(status==google.maps.places.PlacesServiceStatus.OK
 * @param  {} {for(vari=0;i<results.length;i++
 * @param  {} {varplace=results[i];map.setCenter(results[0].geometry.location
 * @param  {map} ;varmarker=newgoogle.maps.Marker({map
 * @param  {place.geometry.location} position
 * @param  {google.maps.Animation.DROP}} animation
 */
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
/**
 * @param  {} {for(vari=0;i<globalMarkers.length;i++
 * @param  {} {globalMarkers[i].setMap(null
 */
function removeMarkers() {
    for (var i = 0; i < globalMarkers.length; i++) {
        globalMarkers[i].setMap(null);
    }
}
/**
 * @param  {} {removeMarkers(
 * @param  {} ;varaddress=$("#pac-input"
 * @param  {} .val(
 * @param  {} ;displayFoodInArea(address
 * @param  {address}} ;varlatLng=geocoder.geocode({'address'
 * @param  {} getCustomPlaces
 */
function determineStartCoords() {
    removeMarkers();
    var address = $("#pac-input").val();
    displayFoodInArea(address);
    var latLng = geocoder.geocode({
        'address': address
    }, getCustomPlaces);
}


/**
 * @param  {} cityname
 * @param  {"https:"method":"POST"} {varajaxOptions={"url"
 * @param  {"JSON"} "dataType"
 * @param  {{term:"restauraunts"} "data"
 * @param  {cityname} location
 * @param  {"XSyryzoREYThrY1P0pDAkbK9uJV0j7TVklsKegO9g9aqqqGz87SZPuhQ0Cob0jzZ6G1BCVE9JaycPHyB2OI7hXgTJYs_enS7SKr1G21Jf45cDBYbUAHOFnh-r3FWW3Yx"}} api_key
 * @param  {function(response} success
 */
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
            for (var i = 0; i < arrayOfBusinesses.length; i++) {
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
/**
 * @param  {} {varmapCanvas=document.getElementById('map'
 * @param  {newgoogle.maps.LatLng(33.85998} ;varmapOptions={center
 * @param  {} -118.07172
 * @param  {10};varmap=newgoogle.maps.Map(mapCanvas} zoom
 * @param  {} mapOptions
 * @param  {mapOptions.center} ;varmarker=newgoogle.maps.Marker({position
 * @param  {google.maps.Animation.DROP}} animation
 */
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
/**
 * @param  {"https:"method":"POST"} {varyelpTheaters={"url"
 * @param  {"JSON"} "dataType"
 * @param  {{term:"theaters"} "data"
 * @param  {"longbeach"} location
 * @param  {"XSyryzoREYThrY1P0pDAkbK9uJV0j7TVklsKegO9g9aqqqGz87SZPuhQ0Cob0jzZ6G1BCVE9JaycPHyB2OI7hXgTJYs_enS7SKr1G21Jf45cDBYbUAHOFnh-r3FWW3Yx"}} api_key
 * @param  {function(response} success
 */
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
/**
 * @param  {} {map=newgoogle.maps.Map(document.getElementById('map'
 * @param  {{lat:-33.8688} {center
 * @param  {151.2195}} lng
 * @param  {13} zoom
 * @param  {'roadmap'}} mapTypeId
 */
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