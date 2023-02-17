# Frothfinder

Frothfinder is a single page web application that can be used to find your next favorite brewery. Visiting a new city and want to know where to find a drink? Type in the city name and Frothfinder will generate a list of suggestions. Create a profile and save your favorites. Search results provide website URLs to take a closer look. Check off the ones you've visited, or keep your favorites around to reference later.

# User Stories
As a traveller, I want to be able to list breweries in the town/city I am visiting so that I can find a drink.

As a new brewer, I want to be able to see what kinds of breweries are around my area to ensure I can remain competetive.

As a beer connoisseur, I want to be able to add breweries to a list where I can check them off later as I visit them.

# Original Wireframe

https://wireframe.cc/crld4M

# Usage Instructions

To use this website, first select what criteria will be used for your search in the "Search By:" dropdown, then enter a search value. The search will be executed and results will be listed under the "Search Results heading. Number of results listed is determined using the "Per Page:" dropdown.

Clicking a search result or favorites list element will populate the "Details" section with additional information about the brewery.

The user can click "Profile Select" to choose or create a new profile. To create a profile, click on the "Profile Select" button, then click on "Create Profile". Once your profile has been created, you can select it from the "Profile Select" drop-down menu. When the profile has been selected, the "Profile Select" menu will close and the active profile will be displayed above the button. With a profile selected, you can click the "Favorite!" button under "Details" to add that brewery to your favorites list. Favorites entries can be deleted by clicking the 'X' placed before the entry. This will prompt the user to confirm they would like to delete the entry. Clicking the 'X' will automatically pull up the details for the associated entry.

Use of this profile feature requires hosting of a json-server watching the db.json file included in this repository. Currently all profile-based fetch requests are targetting "http://localhost:3000/profiles" or "http://localhost:3000/profiles/<profile id>". Without a connected server, the site will behave as normal, however, created profiles will be non-persistent.

# Code Notes

The JavaScript code for this project is organized as follows:

-Global variables and functions to run on page load.  
-Core event listeners.  
-Functions loosely organized by relation to eachother.  
-Helper functions used to keep repetetive code down. 


 Code written by Henry Yun and Jayson Ambrose

 Open Brewery DB API created by Chris J Mears and Wandering Leaf Studios LLC.  
 With initial dataset provided by Brewers Association.