// The recipe app should fetch recipes and displays them as cards on a web page
// Features:
        // Users searches by recipe name.
        // The app fetches the recipe and display it in a card
        // Each card displays recipe name, ingredients and image
        // Users can click on a recipe card to view the full recipe and its instructions.




const search = document.getElementById('search-box');
const apiKey = '2c59ff1b45ea4c959f7af539f664e8e7';
// const apiKey = '03c16dff40a94fb38083740aae95e62e';
// const apiKey = '5618568abf454ca5994063601ebc4ba2';
// const apiKey = '861f6306dc7b4b6aa5a0a457bfe0e967';
// const apiKey = '19088892fbf842ec94bf493e139bb3af';
const cardBox = document.querySelector('.card-container');
const form = document.querySelector('form');
// let recipeId = '';

// localStorage.setItem('1','value');
// The above code works which means that we increment the key values and store the queries in individual keys.

// ----------CODE for getting a card through local storage------------
// let response = JSON.parse(localStorage.getItem('data'));
// console.log(response.results);
// document.getElementById('recipe').innerText = 'Name: ' + response.results[1].title;
// let source = response.results[1].image;
// let idRec = response.results[1].id;
// document.getElementById('food-img').setAttribute('src', source)

// form.addEventListener('submit', (event)=>{
//     event.preventDefault();
// })




// --------------CODE for getting card through local storage----------
// let idArray = JSON.parse(localStorage.getItem('data1'));
// console.log(idArray.extendedIngredients);
// let ingArray = idArray.extendedIngredients;
// let stringArray = [];
// ingArray.forEach(element => stringArray.push(element.name));
// document.getElementById('ingredients').innerText = 'Ingredients: ' + stringArray.join(', ')






let resultsArray;

form.addEventListener('submit', (event)=>{

    resultsArray = [];
    event.preventDefault();
    const cardDivs = document.querySelectorAll('.card');
    console.log(cardDivs);
    removePrevious(cardDivs);
    let query = search.value;
    // let check = checkCache(query);
    // let recipeId = '';
    // console.log(query);
    fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}`)
    .then(response => response.json())
    .then(data => data.results)
    .then(array => {
        array.forEach(element => {
            let returnArray = addCards(element);
            // let card = document.createElement('div');
            // let imgSource = element.image;
            // let recipeId = element.id;
            // document.querySelector('.card-container').append(card);
            // card.setAttribute('class','card')

            // let image = document.createElement('img');
            // card.append(image);
            // let nameSpan = document.createElement('span');
            // card.setAttribute('value', recipeId);
            // card.append(nameSpan);
            // let namePara = document.createElement('p');
            // card.append(namePara);
            // let ingrSpan = document.createElement('span');
            // card.append(ingrSpan);
            // let ingrPara = document.createElement('p');
            // card.append(ingrPara);
            // let button = document.createElement('button');
            // card.append(button);
            // button.setAttribute('class', 'btn');
            // button.setAttribute('href', 'recipe-details.html')
            // button.innerText = 'Learn complete recipe'
            // nameSpan.innerText = 'Name:'
            // ingrSpan.innerText = 'Ingredients:'
            // namePara.innerText = element.title;
            // console.log(button);
            let recipeId = returnArray[0];
            let ingrPara = returnArray[1];

            // button.addEventListener('click', showRecipe);
            // image.setAttribute('src', imgSource)
            fetch(`https://api.spoonacular.com/recipes/${recipeId}/ingredientWidget.json?apiKey=${apiKey}`)
            .then(response => response.json())
            .then(data => data.ingredients)
            .then(array => {
                let ingredients = [];
                array.forEach(object => {
                    ingredients.push(object.name);
                })
                ingrPara.innerText = ingredients.join(', ')
                let foodItem = {image:imgSource, name:element.title, ingredients:ingredients}
                resultsArray.push(foodItem);
                localStorage.setItem(query, JSON.stringify(resultsArray));
            })
        })
    })

// function getRecipe(event) {
//     let card = event.target;
//     console.log(card);
//     return true;
// }



    // .then(data => console.log(data.results[0]))
    // .then(display => document.getElementById('recipe').innerText = display)
    //     // let query = search.value;
    // console.log(query);
    // fetch(`https://api.spoonacular.com/recipes/{id}/ingredientWidget.json?apiKey=${apiKey}`)
    // .then(response => response.json())
    // .then(data => localStorage.setItem('data1',JSON.stringify(data)))

    // .then(data => console.log(data.results[0]))
    // .then(display => document.getElementById('recipe').innerText = display)

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
        let title = paraTitle.previousElementSibling;
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
            document.getElementById('title').innerText = title.innerText;
        })
}


// function checkCache(search) {

// }


function addCards (object) {
    let card = document.createElement('div');
    let imgSource = object.image;
    let recipeId = object.id;
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
    return [recipeId, ingrPara];
}
