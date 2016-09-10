

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



 // ========Initialize Firebase=========
 var config = {
   apiKey: "AIzaSyBBH_dVCGulO-Q4XVW2VVGPhjv-Q5J8i5E",
   authDomain: "day-with-your-do-1473393896412.firebaseapp.com",
   databaseURL: "https://day-with-your-do-1473393896412.firebaseio.com",
   storageBucket: "day-with-your-do-1473393896412.appspot.com",
 };
 firebase.initializeApp(config);

