// The recipe app should fetch recipes and displays them as cards on a web page
// Features:
        // Users searches by recipe name.
        // The app fetches the recipe and display it in a card
        // Each card displays recipe name, ingredients and image
        // Users can click on a recipe card to view the full recipe and its instructions.



// ----------PENDING STUFF PENDING STUFF PENDING STUFF---------
// 1. Add caching to additional information as well
// 2. Add decent styling and make responsive
// 3. Add random recipes on start
// 4. Add error handling (DONE)
// 5. Try storing data in only one key value pair in local storage. The value could be an object or list of objects with key name
// same as the name of the query
// 6. Maybe try to limit 3 cards in one row.


const search = document.getElementById('search-box');
// const apiKey = '2c59ff1b45ea4c959f7af539f664e8e7';
// const apiKey = '03c16dff40a94fb38083740aae95e62e';
// const apiKey = '5618568abf454ca5994063601ebc4ba2';
// const apiKey = '861f6306dc7b4b6aa5a0a457bfe0e967';
const apiKey = '19088892fbf842ec94bf493e139bb3af';
const cardBox = document.querySelector('.card-container');
const form = document.querySelector('form');

fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=6`)
.then(response => handleError(response))
.then(data => data.recipes)
.then(array => {
    document.querySelector('.search-title').innerText = `Popular Recipes`;
    array.forEach(element => {
        let ingrPara = addCards(element);
        let ingredientsList = getIngredients(element.extendedIngredients);
        ingrPara.innerText = ingredientsList.join(', ');
    })
});

let resultsArray;
form.addEventListener('submit', (event)=>{
    resultsArray = [];
    document.querySelector('.recipe-details').style.display = 'none';
    document.querySelector('.card-container').style.display = 'flex';
    document.querySelector('.search-title').style.display = 'block';
    document.querySelector('#recipe-info-title').style.display = 'none';
    event.preventDefault();
    const cardDivs = document.querySelectorAll('.card');
    removePrevious(cardDivs);
    let query = search.value;
    let checkLocal = checkLocalStorage(query);
    if (checkLocal) {
        let localArray = JSON.parse(localStorage.getItem(checkLocal));
        let count = localArray.length;
        document.querySelector('.search-title').innerText = `${query}-${count} result(s)`
        localArray.forEach(element => {
            let ingrPara = addCards(element);
            let ingredients = element.ingredients;
            ingrPara.innerText = ingredients.join(', ');
        })
    }
    else {
        fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}`)
        .then(response => handleError(response))
        .then(data => data.results)
        .then(array => {
            let count = array.length;
            document.querySelector('.search-title').innerText = `${query}-${count} result(s)`
            array.forEach(element => {
                let ingrPara = addCards(element);
                let recipeId = element.id;
                let imgSource = element.image;
                fetch(`https://api.spoonacular.com/recipes/${recipeId}/ingredientWidget.json?apiKey=${apiKey}`)
                .then(response => handleError(response))
                .then(data => data.ingredients)
                .then(array => {
                    let ingredientsList = getIngredients(array);
                    ingrPara.innerText = ingredientsList.join(', ');
                    let foodItem = {image:imgSource, title:element.title, ingredients:ingredientsList, id:recipeId}
                    resultsArray.push(foodItem);
                    localStorage.setItem(query, JSON.stringify(resultsArray));
                })
            })
        })
    }
})

function removePrevious(elmCollection) {
    if (elmCollection.length > 0) {
        elmCollection.forEach(element => element.remove());
        document.querySelector('.search-title').innerText = '';
        return true;
    }
}

function checkLocalStorage(search) {
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
    card.setAttribute('value', recipeId);
    card.setAttribute('class','card')
    let image = document.createElement('img');
    card.append(image);
    image.setAttribute('src', imgSource)
    let nameSpan = document.createElement('span');
    card.append(nameSpan);
    nameSpan.innerText = 'Recipe Name';
    let namePara = document.createElement('p');
    card.append(namePara);
    namePara.innerText = object.title;
    let ingrSpan = document.createElement('span');
    card.append(ingrSpan);
    ingrSpan.innerText = 'Ingredients';
    let ingrPara = document.createElement('p');
    card.append(ingrPara);
    let button = document.createElement('button');
    card.append(button);
    button.setAttribute('class', 'btn');
    button.innerText = 'Click for more information';
    button.addEventListener('click', showRecipe);
    return ingrPara;
}

function showRecipe(event) {
    let elm = event.target;
    let ingrPara = elm.previousElementSibling;
    let ingrHeading = ingrPara.previousElementSibling;
    let recipeName = ingrHeading.previousElementSibling;
    let cardDiv = elm.parentElement;
    let recipeId = cardDiv.getAttribute('value');
    document.querySelector('.search-title').style.display = 'none';
    const returnButton = document.getElementById('back-btn');
    returnButton.style.display = 'block';

    returnButton.addEventListener('click', () => {
        cardBox.style.display = 'flex';
        returnButton.style.display = 'none';
        document.querySelector('.recipe-details').style.display = 'none';
        document.querySelector('#recipe-info-title').style.display = 'none'
        document.querySelector('.search-title').style.display = 'block';
    })

    fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`)
    .then(response => handleError(response))
    .then(data => {
        document.querySelector('.recipe-details').style.display = 'block';
        document.querySelector('.card-container').style.display = 'none';
        document.getElementById('summary').innerHTML = data.summary;
        document.querySelector('.recipe-details img').setAttribute('src',data.image);
        document.getElementById('instructions').innerHTML = data.instructions;
        document.getElementById('ingredients').innerText = ingrPara.innerText;
        document.querySelector('#recipe-info-title').style.display = 'block';
        document.querySelector('#recipe-info-title').innerText = recipeName.innerText;
    })
}

function handleError(apiResponse) {
    if (apiResponse.ok) {
        document.getElementById('error').innerText = '';
    } else {
        document.getElementById('error').innerText = 'Failed to retrieve complete data';
    }
    return apiResponse.json();
}

function getIngredients (ingredientsArray) {
    let ingredientsName = [];
    ingredientsArray.forEach(element => {
        ingredientsName.push(element.name);
    })
    return ingredientsName;
}
