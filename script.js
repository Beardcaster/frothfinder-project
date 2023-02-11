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

console.log(searchBy);

submitForm.addEventListener('submit', e => {
    e.preventDefault() //gotta have this

    const query = searchBy.value; //value of dropdown to query to pass into get
    const searchValue = e.target.item.value; //assigns string in form to search value
    
    initiateSearch(query, searchValue); //runs search
   
})



function hook (id) {
    return document.getElementById(`${id}`); //hook accepts a string and grabs an element from the dom by id   
}

function initiateSearch(query, searchValue) {
    debugger
    fetch(`https://api.openbrewerydb.org/breweries?${query}=${searchValue}`)
    .then(resp => resp.json())
    .then(result => {
        console.log(result);
        debugger
        result.forEach(renderResults)
        submitForm.reset();        
    })   
}

function spawnElement(string) {
    return document.createElement(`${string}`) //string passed in should be type of element to create.
}

function renderResults(object) {

    const result = spawnElement("li")
    result.innerText = object.name
    hook("search-result").appendChild(result);        

}


 // fetch("https://api.openbrewerydb.org/breweries/search?query=prost-brewing") 
    // .then(resp => resp.json())
    // .then(data => console.log(data)) 




