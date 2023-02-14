//global variables
const availableProfiles = [];
let currentBrewery;

//functions to run on page load
renderRandom();
checkProfiles();

//event listener for submitting search
hook("search-form").addEventListener('submit', e => {
    e.preventDefault();
    const query = hook("search-dropdown").value; //value of dropdown to query to pass into get
    const perPage = hook("per-page").value; //per page dropdown value for get
    const searchValue = e.target.item.value; //assigns string in form to search value  
    initiateSearch(query, searchValue, perPage);    
})

//event listener for changing selection in profile dropdown
hook("profile-select").addEventListener('change',  (e) => {
    const currentProfile = e.target.value;
    learnProfileFavorites(currentProfile, availableProfiles);
})

//event listener for clicking favorite button
hook("favorite-button").addEventListener('click', () => {
    renderFavorite(currentBrewery);
})

hook("create-profile").addEventListener('click', () => {
    addProfile();
})

function initiateSearch(query, searchValue, perPage) {
//initiates search of API
    if(searchValue.length === 0){
        console.log('no search value entered')
        return;
    }
    
    fetch(`https://api.openbrewerydb.org/breweries?${query}=${searchValue}&per_page=${perPage}`)
    .then(resp => resp.json())
    .then(result => {   
        hook("search-result").innerHTML = "";    
        result.forEach(renderResults)
        hook("search-form").reset();        
    })
    // .catch(console.log("search failed")); //this catch goes off even if search successful.
}

function renderResults(object) {
    //renders list of results
    //what other results should be rendered to the dom in this area. phone? city? address?
    const result = spawn("li")
    result.innerText = object.name
    result.classList = ("search-res")
    hook("search-result").appendChild(result);

    result.addEventListener('click', (e) => {
        renderDetails(object)
        animateSelect(result)
    })
}

function animateSelect(result) {
    //animates selected search result with quick flash of blue can change later to match asthetic
    result.style.color = "blue"
    setTimeout(() => result.style.color = "black", 100)
}

function checkProfiles() {
    //checks the mock server for valid profiles.
    fetch("http://localhost:3000/profiles")
    .then(resp => resp.json())
    .then(data => {
        data.forEach(renderProfileList);
    })
}

function renderProfileList(profile) {
    //adds valid profile names to profiles dropdown
    const profileEntry = spawn("option");
    profileEntry.innerText = profile.name;
    profileEntry.setAttribute("value", profile.name);
    hook("profile-select").appendChild(profileEntry);
    availableProfiles.push(profile); //stores object in global scoped array for use elsewhere.   
}

function addProfile() {
    let profileName = prompt("Please enter your name.", "new user")

    let newProfile = {
        name: profileName,
        favorites: []
    }
    if( newProfile.name === null && newProfile.name != ' ' || newProfile.name || "new user") {
        console.log("enter a valid value")
        return;
    }
    
    fetch("http://localhost:3000/profiles/", {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
            },
        body: JSON.stringify(newProfile)
    })
    .then(resp => resp.json())

    renderProfileList(newProfile);
}

function updateProfileFavorites (object) {
    //DETERMINE CURRENT PROFILE
    //MAKE POST TO CURRENT PROFILE UPDATING FAVORITES LIST , THIS MAY NEED TO BE A PATCH Favorites: [ string of arrays here ]
}

function learnProfileFavorites(string, array){
    //this function gets the active profile's favorites from profile object and delivers them to API GET
    const activeProfile = array.find(object => object.name === string);   
    // console.log(activeProfile);
    clearFavoritesList()
    activeProfile.favorites.forEach(getProfileFavoriteFromAPI) 
}

function getProfileFavoriteFromAPI(string) { 
    //this function takes in favorite id values and searches the API to return renderable brewery objects.
    // console.log(string)
    fetch(`https://api.openbrewerydb.org/breweries/${string}`)
    .then(resp => resp.json())
    .then(data => renderFavorite(data))
}

function renderFavorite(object){
    //this function renders an item to the favorites list.
    const fav = spawn('li');
    fav.textContent = object.name;
    fav.classList = "favorite"

    debugger

    document.querySelector('#favorite-list').append(fav);

    fav.addEventListener('click', e => {
        renderDetails(object)
        animateSelect(fav)
    })
    currentBrewery = object;
}

function renderDetails (object){
    //renders details of selected search result or favorite from favorite list
    // console.log(object)
    const detailResults = hook('details');

    hook("brewery").innerText = object.name;
    hook("phone").innerText = `Phone: ${object.phone}`;
    hook("url-container").innerText = `${object.website_url}`;
    hook("anchor").setAttribute("href", `${object.website_url}`)
    hook("street").innerText = `${object.street}`
    hook("city-state-zip").innerText = `${object.city}, ${object.state} ${object.postal_code}`
    
    currentBrewery = object;
}


// hook("favorite-button").addEventListener('click', () => {
//     const fav = spawn('li');
//     fav.textContent = currentBrewery.name;
//     document.querySelector('#favorites-container').append(fav);
// })

function renderRandom(){
    //renders a random brewery from the API on page load
    fetch("https://api.openbrewerydb.org/breweries/random")
    .then(resp => resp.json())
    .then(data => renderDetails(data[0]))
}

function clearFavoritesList() {    
    hook("favorite-list").innerHTML = '';
}

///////////////////////////////////////////
///////////KEYWORD FUNCTIONS///////////////
///////////////////////////////////////////

function hook (string) {
    return document.getElementById(`${string}`); //hook accepts a string and grabs an element from the DOM by id   
}

function spawn (string) {
    return document.createElement(`${string}`) //spawn accepts a string and creates an element of that type on the DOM.
}

function grab (string) {
    return document.querySelector(`${string}`) //let me know if these things are helpful
}





