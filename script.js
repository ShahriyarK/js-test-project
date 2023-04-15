// The recipe app should fetch recipes and displays them as cards on a web page
// Features:
        // Users searches by recipe name.
        // The app fetches the recipe and display it in a card
        // Each card displays recipe name, ingredients and image
        // Users can click on a recipe card to view the full recipe and its instructions.




const search = document.getElementById('search-box');
// const apiKey = '2c59ff1b45ea4c959f7af539f664e8e7';
// const apiKey = '03c16dff40a94fb38083740aae95e62e';
const apiKey = '5618568abf454ca5994063601ebc4ba2';
// const apiKey = '861f6306dc7b4b6aa5a0a457bfe0e967';
// const apiKey = '19088892fbf842ec94bf493e139bb3af';
const cardBox = document.querySelector('.card-container');
const form = document.querySelector('form');

let resultsArray;

form.addEventListener('submit', (event)=>{
    resultsArray = [];
    event.preventDefault();
    const cardDivs = document.querySelectorAll('.card');
    removePrevious(cardDivs);
    let query = search.value;
    let check = checkCache(query);
    fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}`)
    .then(response => response.json())
    .then(data => data.results)
    .then(array => {

        if (check) {
            console.log("Yayyyy")
            let localArray = JSON.parse(localStorage.getItem(check));
            localArray.forEach(element => {
                let ingrPara = addCards(element);
                let recipeId = element.id;
                let imgSource = element.image;
                let ingredients = element.ingredients;
                ingrPara.innerText = ingredients.join(', ');
            })
        }
        else {
            console.log('BOOOO')
            array.forEach(element => {
                let ingrPara = addCards(element);
                let recipeId = element.id;
                let imgSource = element.image;
                fetch(`https://api.spoonacular.com/recipes/${recipeId}/ingredientWidget.json?apiKey=${apiKey}`)
                .then(response => response.json())
                .then(data => data.ingredients)
                .then(array => {
                    let ingredients = [];
                    array.forEach(object => {
                        ingredients.push(object.name);
                    })
                    ingrPara.innerText = ingredients.join(', ')
                    let foodItem = {image:imgSource, title:element.title, ingredients:ingredients, id:recipeId}
                    resultsArray.push(foodItem);
                    localStorage.setItem(query, JSON.stringify(resultsArray));
                })
            })
        }
    })
})

function removePrevious(elmCollection) {
    if (elmCollection.length > 0) {
        elmCollection.forEach(element => element.remove());
        return true;
    }
}

function showRecipe(event) {
    let elm = event.target;
    let paraIngr = elm.previousElementSibling;
    let headIngr = paraIngr.previousElementSibling;
    let paraTitle = headIngr.previousElementSibling;
    let cardDiv = elm.parentElement;
    let recipeId = cardDiv.getAttribute('value');

    fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        document.querySelector('.recipe-details').style.display = 'block';
        document.querySelector('.main-box').style.display = 'none';
        document.getElementById('summary').innerHTML = data.summary;
        document.getElementById('instructions').innerHTML = data.instructions;
        document.getElementById('ingredients').innerText = paraIngr.innerText;
        document.getElementById('title').innerText = paraTitle.innerText;
    })
}


function checkCache(search) {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (search.toLowerCase() == key.toLowerCase()) {
            return key;
        }
    }
    return false;
}


function addCards (object) {
    let imgSource = object.image;
    let recipeId = object.id;
    let card = document.createElement('div');

    document.querySelector('.card-container').append(card);
    card.setAttribute('class','card')

    let image = document.createElement('img');
    card.append(image);
    let nameSpan = document.createElement('span');
    card.setAttribute('value', recipeId);
    card.append(nameSpan);
    let namePara = document.createElement('p');
    card.append(namePara);
    let ingrSpan = document.createElement('span');
    card.append(ingrSpan);
    let ingrPara = document.createElement('p');
    card.append(ingrPara);
    let button = document.createElement('button');
    card.append(button);
    button.setAttribute('class', 'btn');
    image.setAttribute('src', imgSource)
    button.innerText = 'Learn complete recipe'
    nameSpan.innerText = 'Name:'
    ingrSpan.innerText = 'Ingredients:'
    namePara.innerText = object.title;
    button.addEventListener('click', showRecipe);
    return ingrPara;
}
