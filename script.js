//POSSIBLE QUERYS

// BY CITY https://api.openbrewerydb.org/breweries?by_city=san_diego&per_page=3
// BY NAME https://api.openbrewerydb.org/breweries?by_name=cooper&per_page=3
// BY STATE https://api.openbrewerydb.org/breweries?by_state=new_york&per_page=3
// BY POSTAL CODE GET https://api.openbrewerydb.org/breweries?by_postal=44107&per_page=3
// PER PAGE GET https://api.openbrewerydb.org/breweries?per_page=2
// SORT GET https://api.openbrewerydb.org/breweries?by_state=ohio&sort=type,name:asc&per_page=3
// GET SIZE https://api.openbrewerydb.org/breweries/random?size=3
// GET SEARCH https://api.openbrewerydb.org/breweries/search?query=dog&per_page=3
// AUTO COMPLETE FOR DROP-DOWN GET https://api.openbrewerydb.org/breweries/autocomplete?query=dog

//Starts by fetching random.

const searchBy = hook("search-dropdown")
const searchField = hook("search-feild")
const submitForm = hook("search-form")

submitForm.addEventListener('submit', e => {
    e.preventDefault();
    const query = searchBy.value; //value of dropdown to query to pass into get
    const searchValue = e.target.item.value; //assigns string in form to search value  
    initiateSearch(query, searchValue);   
})


function initiateSearch(query, searchValue) {

    if(searchValue.length === 0){
        console.log('no search value enterred') //without this an empty search returns 20 breweries from the front of the database.
        return;
    }
    
    fetch(`https://api.openbrewerydb.org/breweries?${query}=${searchValue}`)
    .then(resp => resp.json())
    .then(result => {   
        hook("search-result").innerHTML = "";    
        result.forEach(renderResults)
        submitForm.reset();        
    })   
}

function hook (id) {
    return document.getElementById(`${id}`); //hook accepts a string and grabs an element from the DOM by id   
}

function spawn(string) {
    return document.createElement(`${string}`) //spawn accepts a string and creates an element of that type on the DOM.
}

function renderResults(object) {
    
    const result = spawn("li")
    result.innerText = object.name
    hook("search-result").appendChild(result);
}




