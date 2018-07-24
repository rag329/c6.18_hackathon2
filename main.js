$(document).ready(initializeApp);

function initializeApp() {
    // $('#trailerModal').modal('show');
    getMovieInfoApi();
    handleEvents();
    displayFoodInArea();
}

function handleEvents() {
    $('#movielist > button').on('click', movieTrailer)
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
            // console.log(response);

        }
    }
    $.ajax(movieInfo);
}

function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(33.6846, -117.8265),
        zoom: 12,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
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

function displayFoodInArea(cityName){
    var ajaxOptions = {
        "url": "https://yelp.ongandy.com/businesses",
        "method": "POST",
        "dataType": "JSON",
        "data": {
            term: "restauraunts",
            location: "irvine",
            api_key: "XSyryzoREYThrY1P0pDAkbK9uJV0j7TVklsKegO9g9aqqqGz87SZPuhQ0Cob0jzZ6G1BCVE9JaycPHyB2OI7hXgTJYs_enS7SKr1G21Jf45cDBYbUAHOFnh-r3FWW3Yx"
        },
        success: function (response) {
            var arrayOfBusinesses = response.businesses;
            console.log(arrayOfBusinesses);
            for(var i = 0; i < 6; i++){
                var newDiv = $('<div>');
                var newh3 = $('<h3>');
                var newImage = $('<img>');
                newh3.text(arrayOfBusinesses[i].name);
                newImage.attr('src', arrayOfBusinesses[i]['image_url']);
                newDiv.append(newh3, newImage);
                $('.bottom_area').append(newDiv);
                var newPtag = $('<h3>').text(`Phone Number: ${arrayOfBusinesses[i].phone.slice(2)}`);
                var pricePTag = $('<h3>').text(`Price: ${arrayOfBusinesses[i].price}`)
                newDiv.append(newPtag, pricePTag)
            }

        },
        error: function () {
            console.log('error');
        }
    }
    $.ajax(ajaxOptions)
}

