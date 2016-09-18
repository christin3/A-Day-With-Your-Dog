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

// Global variables of pos (which is the user location and username in order to retrieve later)
var pos;
// Because our map is at a zoom of 13 which is 2 miles, 2 miles in km is 3.21869 Km / 2 = 1.609345
// Will use this radius to determine what results are populated into the map and cards (only this <= this radiu)
var resultRadius = 5; // distance in miles or our user location
var resultsArray = [];

var locationMarkers = [];
// var map; 

// ================ FUNCTIONS =================

function initMap() {
    var styles = [{
        "featureType": "all",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#8ac440"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [{
            "visibility": "on"
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "labels.text",
        "stylers": [{
            "visibility": "on"
        }]
    }, {
        "featureType": "road.local",
        "elementType": "labels.text",
        "stylers": [{
            "visibility": "on"
        }]
    }, {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#2196F3"
        }]
    }];
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });
    var infoWindow = new google.maps.InfoWindow();

    // The default marker color
    var defaultIcon = makeMarkerIcon('0091ff');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log("This is the user's location: [" + pos.lat + ", " + pos.lng + "]");
            // Setting the coordinates of user in local storage
            localStorage.setItem("userLocation", JSON.stringify(pos));
            // creates the user location marker
            var myMarker = new google.maps.Marker({
                map: map,
                position: pos,
                title: 'You and your Dog are Here!',
                animation: google.maps.Animation.DROP,
                icon: defaultIcon,

            });
            // Create an onclick event to open the large infowindow at each marker.
            myMarker.addListener('click', function() {
                populateInfoWindow(this, infoWindow);
            });
            // Two event listeners - one for mouseover, one for mouseout,
            // to change the colors back and forth.
            myMarker.addListener('mouseover', function() {
                this.setIcon(highlightedIcon);
            });
            myMarker.addListener('mouseout', function() {
                this.setIcon(defaultIcon);
            });

            infoWindow.setPosition(pos);
            
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


// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}



// Haversine function that calculates the distance between to coordinates with the result in miles
function getDistanceInKm(lat2, lng2) {
    var userLocation = JSON.parse(localStorage.getItem("userLocation", pos));
    console.log("This is the ARRAY user location: " + userLocation);
    var lat1 = userLocation.lat;
    var lng1 = userLocation.lng;
    var R = 3959; // Radius of the earth in miles
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLng = deg2rad(lng2 - lng1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c; // Distance in km
    return distance;
};



function deg2rad(degrees) {
    return degrees * (Math.PI / 180);

};

function showMarkers() {
        // var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < locationMarkers.length; i++) {
          locationMarkers[i].setMap(map);
          // bounds.extend(markers[i].position);
        }
        // map.fitBounds(bounds);
      }

// Maybe put all of this in an document on ready function
// This will handle the user click in the dropdown
$('.categories a').on('click', getData);

// function to get the user click
function getData() {
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

                var lat2 = childData.loc.lat;
                var lng2 = childData.loc.lng;
                // Call the haversine formula that is defined above


                var distance = getDistanceInKm(lat2, lng2);
                console.log("This is the distance from user location to bar: " + distance);
                // Add the if logic to take the bar child if the radius is <= to result Radius
                if (distance <= resultRadius) {
                    console.log("This is ID of the bar/park closest to you: " + JSON.stringify(childSnapshot.val().id));
                    console.log("This is the bar closest to you: " + JSON.stringify(childSnapshot.val()));
                    console.log("------------------------------");

                    // Push all of the relevant data to the page
                    //   resultsArray.push(resultsData);
                    // ======== MAP MARKER CREATION AND PUSH ========
                    var markerPosition = childSnapshot.val().loc;
                    var markerTitle = childSnapshot.val().name;
                    var markerId = childSnapshot.val().id;
                    var marker = new google.maps.Marker({
                      // setMap: map,
                      position: markerPosition,
                      title: markerTitle,
                      animation: google.maps.Animation.DROP,
                      // icon: defaultIcon,
                      id: markerId
                    });
                    // Push the marker to our array of markers.
                    locationMarkers.push(marker);
                    console.log("Marker: " + JSON.stringify(locationMarkers));
                    // marker.setMap(map);
                    showMarkers();

                    // ======= END MARKER CREATION ===========

                    // ======= TEMPLATE CREATION ==============


                } else {
                    console.log("This bar is not close to you");
                }

            });
        });
};
















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
