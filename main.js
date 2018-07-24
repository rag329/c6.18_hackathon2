$(document).ready(initializeApp);

var movieArray = [];
var movieObj = {};

function initializeApp(){
    getMovieInfoApi();
    clickHandlers();
}

function clickHandlers(){
    $('search_button').click(getInputValue);
}

function getInputValue(){

    var inputValue = $('search_button').val();
    if(isNaN(inputValue)){
        return;
    }

}





function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = $('#pac-input')[0];
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
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









function getMovieInfoApi(){
    var movieInfo = {
          dataType:'json',
          url: 'https://api.themoviedb.org/3/movie/now_playing?api_key=90ec7552787d25df49e8eac53f951398&language=en-US&page=1',
          data:{api_key:'90ec7552787d25df49e8eac53f951398'},
          method:"GET",
          success:function(response){
              console.log(response);
            displayMovieList(response);
          }
    }
    $.ajax(movieInfo);

}

function displayMovieList(response){
      var movies = response.results;
      var webAdd = "https://image.tmdb.org/t/p/w185";
      
      for(var index = 0; index < movies.length; index++){
            var webImage = movies[index].poster_path;
            var moviePoster = webAdd + webImage;
            var movieRating = movies[index].vote_average + ' out of 10';
            movieObj = {
                  moviePoster,
                  movieRating
            };
            movieArray.push(movieObj);
            renderMovieOnDom(movieObj);
      }
}

function renderMovieOnDom(movie){
    debugger;
      var bodyDiv = $('body');
      var poster = $('<img>', {
            src: movie.moviePoster,
            width: '200px',
            height: '100px'
      });
      var rating = $('<div>').text(movie.movieRating);
      bodyDiv.append(poster, rating);
}


    function myMap() {
        var mapCanvas = document.getElementById("map");
        var mapOptions = {
          center: new google.maps.LatLng(40.5, -0.2), zoom: 10 // how we center our map
        };
        var map = new google.maps.Map(mapCanvas, mapOptions);
        var marker = new google.maps.Marker({position:mapOptions.center ,animation:google.maps.Animation.DROP});
        marker.setMap(map);
      }

