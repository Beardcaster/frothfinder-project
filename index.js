//global variables
const availableProfiles = [];
let currentBrewery;
let activeProfile;

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

hook("favorite-button").addEventListener('click', () => {
    confirmFavorites(currentBrewery),
    renderFavorite(currentBrewery)
})

hook("create-profile").addEventListener('click', () => {
    addProfile();
})

hook("prof-button").addEventListener('click', () => {
    const profileList = hook("prof-list");
    if(profileList.style.display === "none") {
        profileList.style.display = "inline-block";
    }  else { profileList.style.display = "none"}  
})

hook("prof-button").addEventListener('mouseover', (e) => {
    e.target.setAttribute("src", "./img/profile-select-highlight.png")
    })

hook("prof-button").addEventListener('mouseleave', (e) => {
    e.target.setAttribute("src", "./img/profile-select-norm.png")
    })

/////////////////////////////////////
////////////FUNCTIONS////////////////
/////////////////////////////////////

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
    const profileEntry = spawn("li");
    profileEntry.innerText = profile.name;
    profileEntry.value = profile.name    
    availableProfiles.push(profile);

    profileEntry.addEventListener('click', (e)=> {
        const currentProfile = e.target.innerText
        console.log(currentProfile)
        learnProfileFavorites(currentProfile, availableProfiles)
        renderActiveProfile(currentProfile);
        hook("prof-list").style.display = "none"
    })

    hook("prof-list").appendChild(profileEntry);    
}


function addProfile() {

    let profileName = prompt("Please enter your name (15 character max).", "new user")

    if(checkProfileNameValid(profileName) === false) {
        console.log("invalid profile name")
        return;
    }

    let newProfile = {
        name: profileName,
        favorites: [],
        id: availableProfiles.length + 1
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
    activeProfile = array.find(object => object.name === string);   
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

function renderActiveProfile(string) {
    hook("active-profile-name").innerText = string;
}

function renderFavorite(object){
    //this function renders an item to the favorites list.
    const fav = spawn('li');
    fav.textContent = object.name;
    fav.classList = "favorite"

    document.querySelector('#favorite-list').append(fav);

    fav.addEventListener('click', e => {
        renderDetails(object)
        animateSelect(fav)
        // console.log('click');
    })
    // currentBrewery = object;
}

function renderDetails (object){
    //renders details of selected search result or favorite from favorite list
    // console.log(object)
    const detailResults = hook('details');

    hook("brewery").innerText = object.name;
    hook("phone").innerText = `Phone: ${object.phone}`;
    hook("url-container").innerText = `${object.website_url}`;
    hook("anchor").setAttribute("href", `${object.website_url}`)
    hook("anchor").setAttribute("target", "_blank")
    hook("street").innerText = `${object.street}`
    hook("city-state-zip").innerText = `${object.city}, ${object.state} ${object.postal_code}`
    
    currentBrewery = object;
}

function renderRandom(){
    //renders a random brewery from the API on page load
    fetch("https://api.openbrewerydb.org/breweries/random")
    .then(resp => resp.json())
    .then(data => renderDetails(data[0]))
}

function clearFavoritesList() {    
    hook("favorite-list").innerHTML = '';
}

function checkProfileNameValid(string) {

    const invalidResponses = ['new user', 'Create Profile', 'create-profile'];

    if(string === null || string === undefined ||string.length > 15){
        return false;
    }
    else if(invalidResponses.includes(string) === true){
        return false;
    }
    else if(string.trim().length === 0) {
        return false;
    }
    else {return true}
}

///////////////////////////////////////////
///////////HELPER FUNCTIONS///////////////
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


// test

//PATCH FAVORITES LIST
function confirmFavorites(currentBrewery) {
    const currentProfileId = activeProfile.id;
    console.log(activeProfile);
    console.log(currentBrewery.id);

    if(activeProfile.favorites.includes(currentBrewery.id)) {
        console.log("duplicate found");
    } 
    else {
        activeProfile.favorites.push(currentBrewery.id)
        console.log(activeProfile);
        fetch(`http://localhost:3000/profiles/${currentProfileId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(activeProfile)
        })
        .then(response => response.json())
    }
}
