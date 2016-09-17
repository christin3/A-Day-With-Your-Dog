// ====== Questions =========
// 1. Can we use local storage to house the location of the user instead of using firebase? 
// 2. Look into .getkey and ask about promises (RSVP)

 // ========Initialize Firebase=========

var config = {
  apiKey: "AIzaSyA1XI9xxScQ1bRjHmi8c9mVbzFpADIICLM",
  authDomain: "yelptest-bcf7a.firebaseapp.com",
  databaseURL: "https://yelptest-bcf7a.firebaseio.com",
  storageBucket: "yelptest-bcf7a.appspot.com",
  messagingSenderId: "595638809354"
};
firebase.initializeApp(config);

// Intiliaze variable for database push
var databasePush = firebase.database().ref().push();

// Initialize variable for any database querying
var dbQuery = firebase.database();

// // // Create a new GeoFire instance at the random Firebase location
var geoFire = new GeoFire(databasePush);

// ========Google Maps API FUNCTION===========


// Function to locate the user using Google MAPS API
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

// Global variables of pos (which is the user location and username in order to retrieve later)
var pos;
var username ="";

 // Is the array where the user location is stored for manipulation later
var userLocation= [30.22655007765157, -97.86187313256364];

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 6
  });
  var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log("Retrieved user's location: [" + pos.lat + ", " + pos.lng + "]");
      // Setting the coordinates of user in local storage
      localStorage.setItem("userLocation", JSON.stringify(pos));
      // Currently comes out as an object, object, figure out how to get it reading the actual data
      console.log("This is the local Storage location: "+ JSON.parse(localStorage.getItem("userLocation")));
      
      // Might need to figure out how to randomly generate a new username or id
      var username = "test";
      geoFire.set(username, [pos.lat, pos.lng]).then(function() {
        console.log("Current user " + username + "'s location has been added to GeoFire");

      // When the user disconnects from Firebase (e.g. closes the app, exits the browser),
      // remove their GeoFire entry
        databasePush.child(username).onDisconnect().remove();

        console.log("Added handler to remove user " + username + " from GeoFire when you leave this page.");
      }).catch(function(error) {
        console.log("Error adding user " + username + "'s location to GeoFire");
      });
      
      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
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


// When the user clicks say drinks, it would then look into  'bars' in the database. It would need
// to loop through each child  (like a for each) to see if the location of the bars is within 
// a certain radius . Use the haversine formula or something to compare the locations to see if they
// are within a certain radius (need to set the radius)

// This will handle the user click in the dropdown
$('.categories a').on('click', getData);

// function to get the user click
function getData (){
  var category = $(this).data('category');
  console.log("User Click: " + category);
};

// Need to figure out whether we should pull out all of the data set from firebase then loop over it to 
// find the location or loop over it in firebase
// ChildAction function would be what looks at the radius
// 1. Start by figuring out how to access each location
// 

// Call the get user lcoation function
// getUserLoc();
// // use Geofire to pull key (location)
// // This has to do with promises (might need another library to reference like RSVP not sure)
// function getUserLoc (){
//   geoFire.get("username").then(function(location) {
//   if (location === null) {
//     console.log("Provided key is not in GeoFire");
//   }
//   else {
  // // Then push it to the userLocation arrary
//     userLocation.push(location);
//     console.log("Provided key has a location of " + location);
//   }
// }, function(error) {
//   console.log("Error: " + error);
// });


// } 

// Loop through users in order with the forEach() method. The callback provided
// to will be called synchronously with a DataSnapshot for each child:
// Pull out the information of the bars = then use the haversine forlumla to compare user Location and bar location. 
// Also need to set a radius to calculate distance (look at Geofire to see if call calculate it)
var query = dbQuery.ref("bars").orderByKey();
query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // key will be the item the first time and the second item the second time
      var key = childSnapshot.key;
      // childData will be the actual contents of the child
      var childData = childSnapshot.val("loc");
      console.log("This is the database child snapshot: " + JSON.stringify(childSnapshot.val()));
  });
});



// ======== 1st GOOGLE API AJAX FUNCTION===========
// googlePlacesPull();
// var petStores = [];

// function googlePlacesPull() {
//       // Add the GOOGLE QUERY SEARCH url 
//         // Starting with Pet Store search
//         var searchParam = "pet_store"; 
//          // var searchParam = "veterinary_care";
//          // This current search will only yeild 19 results. Use the next_page_token to get more results
//         var queryURL= "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=30.2672,-97.7431&radius=50000&type=" + searchParam + "&key=AIzaSyBBH_dVCGulO-Q4XVW2VVGPhjv-Q5J8i5E"


//         // Ajax call that pulls the data from the api
//         $.ajax({
//                 headers: {
//                   'Access-Control-Allow-Origin': '*'
//                 },
//                 url: queryURL,
//                 method: 'GET'
//             })
//             .done(function(response) {
//               // Logs entire response
//               // console.log("This is the GOOGLE place response: " + JSON.stringify(response));

//               //Sets the variable results = the entire data set coming from the API
//               var data = response.results; 

//               console.log(data);

//               // Create a for loop to loop through the results then pull out the various tags that we need
//               for (var i=0; i < data.length; i++){
//                 var name = data[i].name;
//                 var placeId = data[i].place_id;
//                 var location = data[i].geometry.location;

//                 // Store this in an objec and pushes it to the empty array called petStores
//                 petStores.push({name: name, placeId: placeId, location: location, id: i });
//                 // push these objects to an array which will then be pushed to the firebase database

//               }
//               googleDetails(petStores);
//       });
//     }

// // ===== 2ND function that pulls the data from the first petStores search and populates more detailed data =====

// function googleDetails(stores) {
//       // API DATA

//       // Add the GOOGLE QUERY SEARCH url 
//         // Starting with Pet Store search details 
//         // ChIJM89u8izKRIYRQ1idTtNkf9o  test place id for a pet store
//     for (var i=0; i < stores.length; i++){
//         var petStoreId = petStores[i].placeId;
//         var queryURL= "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + petStoreId + "&key=AIzaSyBBH_dVCGulO-Q4XVW2VVGPhjv-Q5J8i5E"


//         // Ajax call that pulls the data from the api
//         $.ajax({
//                 headers: {
//                   'Access-Control-Allow-Origin': '*'
//                 },
//                 // async: false,
//                 url: queryURL,
//                 method: 'GET'
//             })
//             // Create this as a function outside of the ajax call
//             .done(placeDetails); 
//     }
//   } 

// function placeDetails(response){
//  // Logs entire response
//               // console.log("This is the 2nd GOOGLE place response: " + JSON.stringify(response));

//               //Sets the variable results = the entire data set coming from the API
//               var dataSetTwo = response.result; 

//               console.log(dataSetTwo);

//               // Create a for loop to loop through the results then pull out the various tags that we need
//               // for (var i=0; i < petStores.length; i++){
//                 var address = dataSetTwo[i].formatted_address;
//                 var phone = dataSetTwo[i].formatted_phone_number;
//                 var icon = dataSetTwo[i].icon;
//                 var website = dataSetTwo[i].website;


//                 // Store this in an objec and pushes it to the empty array called petStores
//                 petStores.push({address: address, phone: phone, icon: icon, website: website});
//                 // push these objects to an array which will then be pushed to the firebase database


// }



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
