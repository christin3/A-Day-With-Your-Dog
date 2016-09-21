// ========Initialize Firebase=========

var config = {
    apiKey: "AIzaSyAv-6bOhqHPkkst-Aw7ULPb-xvTqHqTpeo",
    authDomain: "bars-backup.firebaseapp.com",
    databaseURL: "https://bars-backup.firebaseio.com",
    storageBucket: "bars-backup.appspot.com",
    messagingSenderId: "149078553518"
};
firebase.initializeApp(config);

var dbQuery = firebase.database();

var cardId = [];

getData();

function getData() {

	//change ref per depending if it's bars or restaurants
	var query = dbQuery.ref('bars');

	query.once("value")
        .then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				cardId.push(childSnapshot.val().id);
			});
		});
    console.log(cardId);
}


// ======== 1st GOOGLE API AJAX FUNCTION===========
//====== Draft - by Nigel ==========
// googlePlacesPull();
// var petStores = [];

var placeId = [];

var photoReference = [];

function googlePlacesPull() {
	// Add the GOOGLE QUERY SEARCH url 
	// Starting with Pet Store search
	//var searchParam = "pet_store"; 
	// var searchParam = "veterinary_care";
	// This current search will only yeild 19 results. Use the next_page_token to get more results
	for (i=0; i < cardId.length; i++){
        var queryURL= "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=30.2672,-97.7431&radius=50000&keyword=" + cardId[i] + "&key=AIzaSyBBH_dVCGulO-Q4XVW2VVGPhjv-Q5J8i5E"

		// Ajax call that pulls the data from the api
		$.ajax({
			headers: {
				'Access-Control-Allow-Origin': '*'
				},
			url: queryURL,
			method: 'GET'
		})
		.done(function(response) {
		// Logs entire response
		console.log("This is the GOOGLE place response: " + JSON.stringify(response));

		//Sets the variable results = the entire data set coming from the API
		var data = response.results[0];

		placeId.push(data.place_id);

		// // Create a for loop to loop through the results then pull out the various tags that we need
		// for (var i=0; i < data.length; i++){
		// 	var name = data[i].name;
		// 	var placeId = data[i].place_id;
		// 	var location = data[i].geometry.location;

		// 	// Store this in an objec and pushes it to the empty array called petStores
		// 	petStores.push({name: name, placeId: placeId, location: location, id: i });
		// 	// push these objects to an array which will then be pushed to the firebase database

		// }
		//googleDetails(petStores);

		});
    }
}

// // ===== 2ND function that pulls the data from the first petStores search and populates more detailed data =====

function googleDetails(imagesReference) {
      // API DATA

      // Add the GOOGLE QUERY SEARCH url 
        // Starting with Pet Store search details 
        // ChIJM89u8izKRIYRQ1idTtNkf9o  test place id for a pet store
    for (var j=0; j < placeId.length; j++){
        //var Id = petStores[i].placeId;
        var queryURL= "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeId[j] + "&key=AIzaSyBBH_dVCGulO-Q4XVW2VVGPhjv-Q5J8i5E"


        // Ajax call that pulls the data from the api
        $.ajax({
                headers: {
                  'Access-Control-Allow-Origin': '*'
                },
                // async: false,
                url: queryURL,
                method: 'GET'
        })
        .done(placeDetails);

        photoReference.push(placeDetails.photos.photo_reference);

            // Create this as a function outside of the ajax call
            
    }
  }

  function googleDetails(images) {
      // API DATA

      // Add the GOOGLE QUERY SEARCH url 
        // Starting with Pet Store search details 
        // ChIJM89u8izKRIYRQ1idTtNkf9o  test place id for a pet store
    for (var k=0; k < placeId.length; k++){
        //var Id = petStores[i].placeId;
        var queryURL= "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + photoReference[0] + "&key=AIzaSyBBH_dVCGulO-Q4XVW2VVGPhjv-Q5J8i5E"


        // Ajax call that pulls the data from the api
        $.ajax({
                headers: {
                  'Access-Control-Allow-Origin': '*'
                },
                // async: false,
                url: queryURL,
                method: 'GET'
        })
        .done(image);

        // add here the push to database!!!!

            // Create this as a function outside of the ajax call
            
    }
  } 

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
