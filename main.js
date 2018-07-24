$(document).ready(initializeApp);

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

    