$(document).ready(initializeApp);

var movieArray = [];
var movieObj = {};

function initializeApp() {
    $('#trailerModal').modal('hide');
    getMovieInfoApi();
    displayFoodInArea();
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

      for(var index = 0; index < 16; index++){
            var webImage = movies[index].poster_path;
            var movieTitle = movies[index].title;
            var moviePoster = webAdd + webImage;
            var movieRating = movies[index].vote_average + ' /10';
            movieObj = {
                  movieTitle,
                  moviePoster,
                  movieRating
            };
            movieArray.push(movieObj);
            renderMovieOnDom(movieObj);
      }
}

function renderMovieOnDom(movie){
      var movieDiv = $('<div>');
      movieDiv.addClass('item');
      var poster = $('<img>', {
            src: movie.moviePoster,
            height: '85%'
      });
      var rating = $('<div>').text("Rating:  " + movie.movieRating);
      movieDiv.append(poster, rating);
      movieDiv.on('click', movieTrailer)
      $('.movie-library').append(movieDiv)
      $('.item').first().addClass('active');
}

function displayFoodInArea(){
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
            console.log("it's in");
            var arrayOfBusinesses = response.businesses;
            console.log(arrayOfBusinesses);
            for(var i = 0; i < 6; i++){
                var newDiv = $('<div>');
                $(newDiv).addClass('food');
                $(newDiv).addClass('item');
                var newh3 = $('<div>');
                var newImage = $('<img>');
                newh3.text(arrayOfBusinesses[i].name);
                newImage.attr('src', arrayOfBusinesses[i]['image_url']);
                newDiv.append(newh3, newImage);
                console.log(newDiv);
                $('.food-library').append(newDiv);
                $('.food').first().addClass('active');
                var newPtag = $('<div>').text(`Phone Number: ${arrayOfBusinesses[i].phone.slice(2)}`);
                var pricePTag = $('<div>').text(`Price: ${arrayOfBusinesses[i].price}`)
                newDiv.append(newPtag, pricePTag)
            }

        },
        error: function () {
            console.log('error');
        }
    }
    $.ajax(ajaxOptions)
}

function clickMovieTheaters(){
      var yelpTheaters = {
            "url": "https://yelp.ongandy.com/businesses",
            "method": "POST",
            "dataType": "JSON",
            "data": {
                term: "theaters",
                location: "long beach",
                api_key: "XSyryzoREYThrY1P0pDAkbK9uJV0j7TVklsKegO9g9aqqqGz87SZPuhQ0Cob0jzZ6G1BCVE9JaycPHyB2OI7hXgTJYs_enS7SKr1G21Jf45cDBYbUAHOFnh-r3FWW3Yx"
            },
            success: function (response){

            }
      }
}

