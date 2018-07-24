$(document).ready(initializeApp);

var movieArray = [];

function initializeApp(){
    getMovieInfoApi();
}



function getMovieInfoApi(){
    console.log('inside fnct');
    var movieInfo = {
          dataType:'json',
          url: 'https://api.themoviedb.org/3/movie/now_playing?api_key=90ec7552787d25df49e8eac53f951398&language=en-US&page=1',
          data:{api_key:'90ec7552787d25df49e8eac53f951398'},
          method:"GET",
          success:function(response){
                console.log(response);
            
          }
          }
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