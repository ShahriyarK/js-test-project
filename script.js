// The recipe app should fetch recipes and displays them as cards on a web page
// Features:
        // Users searches by recipe name.
        // The app fetches the recipe and display it in a card
        // Each card displays recipe name, ingredients and image
        // Users can click on a recipe card to view the full recipe and its instructions.




const search = document.getElementById('search-box');
// const apiKey = '2c59ff1b45ea4c959f7af539f664e8e7';
const apiKey = '58742c857a574bed8323d6cb97426a95';
const cardBox = document.querySelector('.card-container');
const form = document.querySelector('form');
let recipeId = '';

// localStorage.setItem('1','value');
// The above code works which means that we increment the key values and store the queries in individual keys.
let response = JSON.parse(localStorage.getItem('data'));
console.log(response.results);
document.getElementById('recipe').innerText = 'Name: ' + response.results[1].title;
let source = response.results[1].image;
let idRec = response.results[1].id;
document.getElementById('food-img').setAttribute('src', source)
form.addEventListener('submit', (event)=>{
    event.preventDefault();
    // let query = search.value;
    // // console.log(query);
    // fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}`)
    // .then(response => response.json())
    // .then(data => localStorage.setItem('data',JSON.stringify(data)))

    // // .then(data => console.log(data.results[0]))
    // // .then(display => document.getElementById('recipe').innerText = display)
        let query = search.value;
    // console.log(query);
    // fetch(`https://api.spoonacular.com/recipes/${idRec}/information?apiKey=${apiKey}`)
    // .then(response => response.json())
    // .then(data => localStorage.setItem('data1',JSON.stringify(data)))

    // .then(data => console.log(data.results[0]))
    // .then(display => document.getElementById('recipe').innerText = display)

})

let idArray = JSON.parse(localStorage.getItem('data1'));
console.log(idArray.extendedIngredients);
let ingArray = idArray.extendedIngredients;
let stringArray = [];
ingArray.forEach(element => stringArray.push(element.name));
document.getElementById('ingredients').innerText = 'Ingredients: ' + stringArray.join(', ')
