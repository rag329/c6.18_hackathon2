$(document).ready(initializeApp);

var movieArray = [];

function initializeApp(){
    getMovieInfoApi();
}

function getMovieInfoApi(){
    var movieInfo = {
          dataType:'json',
          url: 'https://api.themoviedb.org/3/movie/now_playing?api_key=90ec7552787d25df49e8eac53f951398&language=en-US&page=1',
          data:{api_key:'90ec7552787d25df49e8eac53f951398'},
          method:"GET",
          success:displayMovieList
          };
    $.ajax(movieInfo);
    }


function displayMovieList(response){
      var movies = response.results;

      for(var index = 0; index < movies.length; index++){
            var oneMovie = movies[index];
            var movieTitle = movies.title;
            var movieRating = Math.round(movies.vote_average / 2);
            var movieObj = {
                  movieTitle,
                  movieRating
            };
            movies.push(movieObj);
      }
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
