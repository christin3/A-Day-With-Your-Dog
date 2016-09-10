

// ========Google Maps API FUNCTION===========

// Function to locate the user using Google MAPS API
// Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
      function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 10
        });
        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('You Are Here.');
            // addMarker(pos, map);
            // Figure out how to add a custom marker to the map
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }


// ========YELP API FUNCTION===========
yelpPull();

function yelpPull() {
      // API DATA
      var yelp = $(this).data();
      // Add the YELP QUERY SEARCH url 

        var queryURL= "https://api.yelp.com/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972"


        // Ajax call that pulls the data from the api
        $.ajax({
                headers: {
                  Authorization: 'Bearer ZnwGiu-0nb6TYZyFYQUzA8gsqcbMLT0vjUYDMC5qW00zIxWtum0xCXcW23EXU3lH8o7Iuw7b2or7rWbwW0oNYIhDTv_UkDLX7gvqXfOYd0gKAEfdhpOyFm56yzvUV3Yx',
                  'Access-Control-Allow-Origin': '*'
                },
                url: queryURL,
                method: 'GET'
            })
            .done(function(response) {
              // Logs entire response
                console.log("This is the YELP API response: " + JSON.stringify(response));

              //Sets the variable results = the entire data set coming from the API
              var results = response.data; 

              console.log(results);
              // Empties the cards view  before adding a new buttons
              // $('#cardsAppearHere').empty();

                // NOT USING THE UNDERSCORE LIBRARY
              // Loops through array and prints out all items to the screen
       //          for (var i = 0; i < results.length; i++) {

       //           // creates the materialize 'card'
                    // var starDiv = $('<div class="col s12 m4 l3"><div class="card"><div class="card-image"><img src="'+ results[i].images.fixed_height_small_still.url + '" data-still="'+ results[i].images.fixed_height_small_still.url+ '" data-animate="'+ results[i].images.fixed_height_small.url +'" data-state="still"></div><div class="card-content"><p class="rate"> Rating: '  + results[i].rating + '</p></div></div></div>');
       //              // Writes the card to the page
       //              $('#gifsAppearHere').prepend(starDiv);

          // }

          // using Underscore.js and template the image changes. 
          // var $gifs = $('#gifsAppearHere');
          // // Targeting the underscore template housed in the html
          // var $giphyTemplate = _.template($('#giphyTmpl').html());
          // // for each loop similar to that used in Star wars game
          // results.forEach(function(result) {
          //       $gifs.prepend($giphyTemplate({result: result }));
          //   });


      });
    } 

//$('.button1').on('click', function(){
  
  //yelpPull();
 // console.log(this);

//});
//$(document).on('click', '.star', giphyObj.displayStarInfo);
    


// ========GOOGLE PLACE API FUNCTION===========




