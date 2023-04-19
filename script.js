const search = document.getElementById('search-box');
const apiKey = '861f6306dc7b4b6aa5a0a457bfe0e967';
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
    document.getElementById('back-btn').style.display ='none';
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
