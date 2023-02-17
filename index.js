//global variables
const availableProfiles = [];
let currentBrewery;
let activeProfile;

//functions to run on page load
renderRandom();
checkProfiles();

////////////////////////////////
//////CORE EVENT LISTENERS//////
////////////////////////////////

hook("search-form").addEventListener('submit', e => {
    e.preventDefault();
    const query = hook("search-dropdown").value;
    const perPage = hook("per-page").value;
    const searchValue = e.target.item.value;
    initiateSearch(query, searchValue, perPage);    
})

hook("favorite-button").addEventListener('click', () => { 
    if(activeProfile === undefined){
        renderError("No profile selected. Select or create a profile to track your favorite breweries!", 5000);
    }   
    else if (verifyNonDuplicate(currentBrewery.id) === true) {
        renderFavorite(currentBrewery)
        confirmFavorites(currentBrewery)    
    } 
    else {
        renderError("This is already one of your favorite breweries.", 3000)
    }
})

hook("create-profile").addEventListener('click', () => {
    addProfile();
})

hook("create-profile").addEventListener('mouseover', () => {
    const createProfileOpt = hook("create-profile")
    highlightOnMouseover(createProfileOpt);
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
    //searches API based on query, search value and num per page.
    if(searchValue.length === 0){
        renderError("No search value enterred. Please enter a search value.", 3000);
        return;
    }
    
    fetch(`https://api.openbrewerydb.org/breweries?${query}=${searchValue}&per_page=${perPage}`)
    .then(resp => resp.json())
    .then(result => {   
        hook("search-result").innerHTML = "";    
        result.forEach(renderResults);
        hook("search-form").reset();        
    })
}

function renderResults(object) {
    //renders results to search-result.
    const result = spawn("li");
    result.innerText = object.name;
    result.classList = ("search-res");
    hook("search-result").appendChild(result);

    result.addEventListener('click', (e) => {
        renderDetails(object);
        animateSelect(result);
    })
}

function checkProfiles() {
    //checks the database for available profiles.
    fetch("http://localhost:3000/profiles")
    .then(resp => resp.json())
    .then(data => {
        data.forEach(renderProfileList);
    })
}

function renderProfileList(profile) {
    //renders profile list to profile select dropdown.
    const profileEntry = spawn("li");
    profileEntry.innerText = profile.name;
    availableProfiles.push(profile);
        
    profileEntry.addEventListener('click', (e)=> {
        const currentProfile = profile.name    
        learnProfileFavorites(currentProfile, availableProfiles);
        renderActiveProfile(currentProfile);
        hook("prof-list").style.display = "none"})

    profileEntry.addEventListener('mouseover', (e) => {
        element = e.target;
        highlightOnMouseover(element);
    })
    
    hook("prof-list").appendChild(profileEntry);    
}


function addProfile() {
    //adds a newly created profile to the profile list and database
    let profileName = prompt("Please enter your name (15 character max).", "new user")
    
    if(checkProfileNameValid(profileName) === false) {
        renderError("Invalid profile name. Please choose a different name.", 4000)
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

function confirmFavorites(currentBrewery) {
    //confirms and saves changes to the profile favorites list persistently.
    const currentProfileId = activeProfile.id;

    if(activeProfile.favorites.includes(currentBrewery.id)) {
        renderError("Duplicate favorite found. This is already one of your favorite breweries.", 4000);
    } 
    else {
        activeProfile.favorites.push(currentBrewery.id)

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

function learnProfileFavorites(string, array){
    //learns favorites already saved to selcted profile.
    activeProfile = array.find(object => object.name === string);
    clearFavoritesList()
    activeProfile.favorites.forEach(getProfileFavoriteFromAPI) 
}

function getProfileFavoriteFromAPI(string) {
    //gathers relevant information from api for each brewery in selected profile.
    fetch(`https://api.openbrewerydb.org/breweries/${string}`)
    .then(resp => resp.json())
    .then(data => renderFavorite(data))
}

function renderActiveProfile(string) {
    //renders active profile to the active profile field above select profile dropdown
    hook("active-profile-name").innerText = string;
}

function renderFavorite(object){
    //takes in an object and renders it as a favorite for the selected profile on the DOM.
    //also adds event listeners for pulling up details and deleting farvorites entry. now with persistance.

    const fav = spawn('li');
    const remove = spawn('button')
    
    fav.textContent = " " + object.name;
    fav.classList = "favorite"   
    
    remove.innerText = 'X'
    fav.prepend(remove);
    
    grab('#favorite-list').append(fav);
    
    fav.addEventListener('click', e => {
        renderDetails(object)
        animateSelect(fav);
    })

    remove.addEventListener('click', e => {
        if(confirm("Delete favorite?") === true) {
            removeFavorite(object, fav); 
        } else {renderError("Cancelled delete.", 2500)}       
    })
}

function removeFavorite (object, element) {
    //removes favorite from active profile on client and server.
    const removedId = object.id
    const removeArray = activeProfile.favorites
    const removeIndex = removeArray.indexOf(removedId)

    removeArray.splice(removeIndex, 1);

    activeProfile.favorites = removeArray;

    element.remove()
    
    fetch(`http://localhost:3000/profiles/${activeProfile.id}`,{
    method: "PATCH",
    headers: {
        "Content-Type":"application/json",
        Accept: "application/json"},
    body:JSON.stringify(activeProfile)}    
    )
}

function renderDetails (object){
    //renders the details for a selected brewery name anywhere on the page. will not render null data for url or address.   
    hook("brewery").innerText = object.name;
    hook("phone").innerText = `Phone: ${object.phone}`;

    if(object.website_url != null) {
        hook("url-container").innerText = `${object.website_url}`;
        hook("anchor").setAttribute("href", `${object.website_url}`);
        hook("anchor").setAttribute("target", "_blank");
    } else {
        hook("url-container").innerText = 'No website found.';
        hook("anchor").setAttribute("href", "none");
    }

    if(object.street != null){
        hook("street").innerText = `${object.street}`;
    } else {
        hook("street").innerText = "";
    }

    hook("city-state-zip").innerText = `${object.city}, ${object.state} ${object.postal_code}`
    
    currentBrewery = object;
}

function animateSelect(string) {
    //causes clicked brewery names to flash blue momentarily to confirm command receipt.
    string.style.color = "blue"
    setTimeout(() => string.style.color = "", 100)
}

function highlightOnMouseover(element) {
    //highlights element on mouseover. used primarily in profile select dropdown. Requires mouseover event listener.
    element.style.color = "#ffcc00"
    element.addEventListener("mouseout", () => {
        element.style.color = ""
    })   
}

function renderRandom(){
    //renders a random brewery from the API on site load.
    fetch("https://api.openbrewerydb.org/breweries/random")
    .then(resp => resp.json())
    .then(data => renderDetails(data[0]))
}

function clearFavoritesList() {   
    //clears the favorites list in several circumstances. 
    hook("favorite-list").innerHTML = '';
}

function checkProfileNameValid(string) {
    //checks enterred profile name to ensure that it will not interfere with other operations.
    
    const invalidResponses = ['new user', 'Create Profile', 'create-profile'];

    availableProfiles.forEach(obj => {invalidResponses.push(obj.name)})
    
    if(string === null || string === undefined ||string.length > 15){
        return false;}

    else if(invalidResponses.includes(string) === true){
        return false;}

    else if(string.trim().length === 0) {
        return false;}

    else {return true}
}

function renderError(string, num) {
    //takes in string and number of milliseconds to display type of error occurring.
    hook("error-display").innerText = string;
    setTimeout(() => {hook("error-display").innerText = ""}, num);
}

function verifyNonDuplicate(string) {
    if(activeProfile.favorites.includes(string) === true) {
        return false;
    } else {return true;}
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