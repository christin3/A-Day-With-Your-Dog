##Project Notes: 


####Potential Title: Day with your Dog
####Slogan: Lifestyle for your Dog, Everything Dog-Friendly. 

####Purpose: To locate pet-friendly everything. There are a few similar App is BarkHappy, and Fetch (https://github.com/florenceloi/hackbright-project). 



####Topics to include: 

Dog-Friendly: 
* Hotels, 
* Parks, 
* Bars, 
* Restaurants,
* Shopping, 
* Vets
* Local dogs to play with (user based)
* Food supply stores
* Dog botiques


APIs Needed: 

* Yelp for restaurants (https://github.com/Yelp/dataset-examples)
* Google API for location services
* Provab for hotels


####1st Week: 
* Design Layout
* Add Google API and then use Yelp API to pull data for restaurants and parks
* Start with two catagories, restaurants(bars) and parks. 
* Start with Bars (since there is no filtering out of food type)

####1st Week Assignments: 
* Christine: 512 API research
* Saidi: YELP API research
* Nigel: Mock up basic site using Materialize


2nd Week: 
* If everything is completed from above work to create a register and login page
* Work to implement other features

//Pseduo Code: 

####HTML: 
* Start page Modal asking the user to accept using their location to use the website (maybe add a Dog giphy)
* Nav Bar/ Header: 
  * Logo, search, location, GO button,
* Body: 
  * Row 1: Map (use Google or Yelp API)
  * Row 2: Cards to display
    * List: Bar Name, Distance, Rating, and Happy Hour (yepl API or DO512 API)
      * When card is clicked will take you to a detailed version of the bar/restaurant information  
* Footer: 
*   About(vision/bios)
*   Contact Us
*   Copyright CNS Galaxy Group

###LOGIC:

* User goes to the website and first thing is it captures the current location (using GOOGLE API)
* Automatically uses search bar and fills in the Drinks as the option (will add more in week 2 once we get drinks working)
  * Search would have a placeholder that says "What would you like to do?"
  * Ultimately there will be a drop down on the search bar that would give you a couple catagories to choose from
* Populates the cards based on the search bar
* When User hovers on the map it would put a drop shadow on the current card selected basically make it 'featured'
* If the user clicks on either the map or a card it will bring the user to a detailed page of the topic (bar/restaurant). 




Future Ideas: 
* Add Coupons
* Add Image of the DAY - APOD
* Add Open Table to book your table
* Add hotel bookings










