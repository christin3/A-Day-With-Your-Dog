//displayYelpResults();


//  ======= YELP API NODE CALL ===============
// Request API access: http://www.yelp.com/developers/getting_started/api_access

//function displayYelpResults(){

	var Yelp = require('yelp');

	var config = require('./config.json');


	var yelp = new Yelp({
	  consumer_key: config.consumerKey,
	  consumer_secret: config.consumerSecret,
	  token: config.token,
	  token_secret: config.tokenSecret
	});

	//See http://www.yelp.com/developers/documentation/v2/search_api
	yelp.search({ term: 'bar dogs allowed', location: 'Austin', limit: 1 })
	.then(function (data) {
		console.log(data);
		// var results = data.businesses;


		// for (var i = 0; i < results.length; i++){

	 // 		var name = results[i].name;
  //           var image = results[i].snippet_image_url;
	 //  		var lat = results[i].location.coordinate.latitute;
	 //  		var lng = results[i].location.coordinate.longitude;
	 //  		var address = results[i].location.display_address["0"] + ", " + results[i].location.display_address["2"];
	 //  		var phone = results[i].display_phone;
	 //  		var yelpURL = results[i].url;

	 //  }


	})
	.catch(function (err) {
	  console.error(err);
	});

//}




// // See http://www.yelp.com/developers/documentation/v2/business
// yelp.business('yelp-san-francisco')
//   .then(console.log)
//   .catch(console.error);

// yelp.phoneSearch({ phone: '+15555555555' })
//   .then(console.log)
//   .catch(console.error);

// // A callback based API is also available:
// yelp.business('yelp-san-francisco', function(err, data) {
//   if (err) return console.log(error);
//   console.log(data);
// });

