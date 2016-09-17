// ====== Questions =========


 // ========Initialize Firebase=========

var config = {
  apiKey: "AIzaSyAv-6bOhqHPkkst-Aw7ULPb-xvTqHqTpeo",
  authDomain: "bars-backup.firebaseapp.com",
  databaseURL: "https://bars-backup.firebaseio.com",
  storageBucket: "bars-backup.appspot.com",
  messagingSenderId: "149078553518"
};
firebase.initializeApp(config);

// Intiliaze variable for database push
var databasePush = firebase.database().ref().push();

// Initialize variable for any database querying
var dbQuery = firebase.database();

// Create a new GeoFire instance at the random Firebase location
var geoFire = new GeoFire(databasePush);

// Initialize the variable for the AUSTIN PARK API push

// Global variables of pos (which is the user location and username in order to retrieve later)
var pos;
// Because our map is at a zoom of 13 which is 2 miles, 2 miles in km is 3.21869 Km / 2 = 1.609345
// Will use this radius to determine what results are populated into the map and cards (only this <= this radiu)
var resultRadius = 1; // distance in miles or our user location
var resultsArray = [];

// Array for the park info
var parkInfo = [];


// ================ FUNCTIONS =================

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 13
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
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
};

function getDistanceInKm(lat2, lng2){
  var  userLocation = JSON.parse(localStorage.getItem("userLocation", pos));
  console.log("This is the ARRAY user location: " +  userLocation);
  var lat1= userLocation.lat;
  var lng1 = userLocation.lng;
  var R = 3959; // Radius of the earth in miles
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLng = deg2rad(lng2-lng1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var distance = R * c; // Distance in km
  return distance;
};



function deg2rad(degrees) {
  return degrees * (Math.PI /180); 
  
};
// This will handle the user click in the dropdown
$('.categories a').on('click', getData);

// function to get the user click
function getData (){
  var category = $(this).data('category');
  console.log("User Click: " + category);




// Loop through users in order with the forEach() method. The callback provided
// to will be called synchronously with a DataSnapshot for each child:
// Pull out the information of the bars = then use the haversine forlumla to compare user Location and bar location. 
// Also need to set a radius to calculate distance (look at Geofire to see if call calculate it)
var query = dbQuery.ref($(this).data('category'));
// Tie this query to the user click data-category "bars" for example
query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // key will be the item the first time and the second item the second time
      var key = childSnapshot.key;
      // child lat and lng will be the actual contents of the child loc
      var childData = childSnapshot.val();
    
      var lat2= childData.loc.lat;
      var lng2  = childData.loc.lng;
      // Call the haversine formula that is defined above
      
      
      var distance =  getDistanceInKm(lat2, lng2);         
      console.log("This is the distance from user location to bar: " + distance);
      // Add the if logic to take the bar child if the radius is <= to result Radius
      if(distance <= resultRadius) {
        console.log("This is the bar closest to you: " + childSnapshot.val().id);
        console.log("This is the bar closest to you: " + JSON.stringify(childSnapshot.val()));

        // Push all of the relevant data to the page
      //   resultsArray.push(resultsData);
      } else {
        console.log ("This bar is not close to you");
      }

  });
});
};


// ======== AUSTIN PARKS API===============


// Austin Parks API
// $.ajax({
//     url: "https://data.austintexas.gov/resource/up6y-6ww4.json",
//     type: "GET",
//     data: {
//         "$limit": 5000,
//         "$$app_token": "BpQTL15Fi3PePMZUluMK7cKFy"
//     }
// }).done(function (response) {


//     var info = response;


//     console.log(response);

//     // Cleaning up data from the API
//     for (i = 0; i < response.length; i++) {

//         response[i].descriptio = response[i].descriptio.replace(
//                 /<DIV>|<BR>|<\/DIV>|<div dir="ltr">|<a href.*|<IMG src.*/ig, '');

//         response[i].descriptio = response[i].descriptio.replace(
//                 /LnAustin/ig, "Ln Austin");

//         response[i].descriptio = response[i].descriptio.replace(
//                 /TerraceAustin/ig, "Terrace Austin");

//         response[i].descriptio = response[i].descriptio.replace(
//                 /Blvd.Austin/ig, "Blvd Austin");

//     }
//     // ============= Put all of this in a FOR loop =========

//     // For loop to push all of the items from the Austin parks API into our database
//     for (var i=0; i < response.length; i++){
//       var address = response[i].descriptio; 
//       var name = response[i].name;
//       var loc = {
//             lat: response[i].the_geom.coordinates[1],
//             lng: response[i].the_geom.coordinates[0]
//       };
//       dbQuery.ref('parks').push({
//         address: address,
//         name: name, 
//         loc: loc,
//       });
//     };
// });


// ========= END AUSTIN PARKS API =================














// ======== 1st GOOGLE API AJAX FUNCTION===========
//====== Draft - by Nigel ==========
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
