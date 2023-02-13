const availableProfiles = [];

renderRandom();
checkProfiles();

hook("search-form").addEventListener('submit', e => {
    e.preventDefault();
    const query = hook("search-dropdown").value; //value of dropdown to query to pass into get
    const perPage = hook("per-page").value; //per page dropdown value for get
    const searchValue = e.target.item.value; //assigns string in form to search value  
    initiateSearch(query, searchValue, perPage);    
})

hook("profile-select").addEventListener('change',  (e) => {
    const currentProfile = e.target.value;
    swapFavoritesByProfile(currentProfile, availableProfiles);
})

function initiateSearch(query, searchValue, perPage) {

    if(searchValue.length === 0){
        console.log('no search value enterred')
        return;
    }
    
    fetch(`https://api.openbrewerydb.org/breweries?${query}=${searchValue}&per_page=${perPage}`)
    .then(resp => resp.json())
    .then(result => {   
        hook("search-result").innerHTML = "";    
        result.forEach(renderResults)
        hook("search-form").reset();        
    })
    .catch(console.log("search failed"));
}

function renderResults(object) {
    //what other results should be rendered to the dom in this area. phone? city? address?
    const result = spawn("li")
    result.innerText = object.name
    hook("search-result").appendChild(result);

    result.addEventListener('click', () => {

        renderDetails(object)
    })
}

function checkProfiles() {
    fetch("http://localhost:3000/profiles")
    .then(resp => resp.json())
    .then(data => {
        data.forEach(renderProfileList);
    })
}

function renderProfileList(profile) {
    const profileEntry = spawn("option");
    profileEntry.innerText = profile.name;
    profileEntry.setAttribute("value", profile.name);
    hook("profile-select").appendChild(profileEntry);
    availableProfiles.push(profile); //stores object in global scoped array for use elsewhere   
}

function swapFavoritesByProfile(string, array){
    
    const activeProfile = array.find(object => object.name === string);   
    console.log(activeProfile);
    activeProfile.favorites.forEach(getFavoriteId) 
}

function getFavoriteId(string) {    
    console.log(string)
    fetch(`https://api.openbrewerydb.org/breweries/${string}`)
    .then(resp => resp.json())
    .then(data => console.log(data))
}

function renderDetails (object){

    console.log(object)
    const detailResults = hook('details');

    hook("brewery").innerText = object.name;
    hook("phone").innerText = `Phone: ${object.phone}`;
    hook("url-container").innerText = `${object.website_url}`;
    hook("anchor").setAttribute("href", `${object.website_url}`)
    hook("street").innerText = `${object.street}`
    hook("city-state-zip").innerText = `${object.city}, ${object.state} ${object.postal_code}`  
}

function renderRandom(){
    fetch("https://api.openbrewerydb.org/breweries/random")
    .then(resp => resp.json())
    .then(data => renderDetails(data[0]))
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





