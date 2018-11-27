// This is the JS file for the Firebase data



 // ========Initialize Firebase=========
// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyCEpW9nDBo5zu6lLgOFpo9dyzLXQ0I4yk4",
    authDomain: "day-with-your-dog-28aad.firebaseapp.com",
    databaseURL: "https://day-with-your-dog-28aad.firebaseio.com",
    projectId: "day-with-your-dog-28aad",
    storageBucket: "day-with-your-dog-28aad.appspot.com",
    messagingSenderId: "536513849790"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database().ref().push();


  // Create a new GeoFire instance at the random Firebase location
  var geoFire = new GeoFire(database);
  
    /* Callback method from the geolocation API which receives the current user's location */
  var geolocationCallback = function(location) {
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    log("Retrieved user's location: [" + latitude + ", " + longitude + "]");

    var username = "wesley";
    geoFire.set(username, [latitude, longitude]).then(function() {
      log("Current user " + username + "'s location has been added to GeoFire");

      // When the user disconnects from Firebase (e.g. closes the app, exits the browser),
      // remove their GeoFire entry
      firebaseRef.child(username).onDisconnect().remove();

      log("Added handler to remove user " + username + " from GeoFire when you leave this page.");
    }).catch(function(error) {
      log("Error adding user " + username + "'s location to GeoFire");
    });
  }