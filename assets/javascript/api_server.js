//displayYelpResults();


//  ======= YELP API NODE CALL ===============
// Request API access: http://www.yelp.com/developers/getting_started/api_access

var Yelp = require('yelp');

var config = require('./config.json');

var firebase = require('firebase');

// Initialize Firebase
var firebaseConfig = {
	apiKey: "AIzaSyA1XI9xxScQ1bRjHmi8c9mVbzFpADIICLM",
	authDomain: "yelptest-bcf7a.firebaseapp.com",
	databaseURL: "https://yelptest-bcf7a.firebaseio.com",
	storageBucket: "yelptest-bcf7a.appspot.com",
	messagingSenderId: "595638809354"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var yelp = new Yelp({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
  token: config.token,
  token_secret: config.tokenSecret
});

//See http://www.yelp.com/developers/documentation/v2/search_api
yelp.search({ term: 'bar dogs allowed', location: 'Austin', offset: 2})
.then(function (data) {
	console.log(data);
	var results = data.businesses;


	for (var i = 0; i < results.length; i++){

 		var name = results[i].name;
        var image = results[i].snippet_image_url;
  		var lat = results[i].location.coordinate.latitude;
  		var lng = results[i].location.coordinate.longitude;
  		var address = results[i].location.display_address["0"] + ", " + results[i].location.display_address["2"];
  		var phone = results[i].display_phone;
  		var yelpURL = results[i].url;

		database.ref('bars').push({
			name: name,
			image: image,
			loc:{
				lat: lat,
				lng: lng},
			address: address,
			phone: phone,
			url: yelpURL
		});
  }

  console.log(bars);

})
.catch(function (err) {
  console.error(err);
});



