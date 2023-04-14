// The recipe app should fetch recipes and displays them as cards on a web page
// Features:
        // Users searches by recipe name.
        // The app fetches the recipe and display it in a card
        // Each card displays recipe name, ingredients and image
        // Users can click on a recipe card to view the full recipe and its instructions.




const search = document.getElementById('search-box');
const apiKey = '2c59ff1b45ea4c959f7af539f664e8e7';
// const apiKey = '5618568abf454ca5994063601ebc4ba2';
const cardBox = document.querySelector('.card-container');
const form = document.querySelector('form');
let recipeId = '';

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








form.addEventListener('submit', (event)=>{
    event.preventDefault();
    const cardDivs = document.querySelectorAll('.card');
    console.log(cardDivs);
    removePrevious(cardDivs);
    let query = search.value;
    // console.log(query);
    fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}`)
    .then(response => response.json())
    .then(data => data.results)
    .then(array => {
        array.forEach(element => {
            let card = document.createElement('div');
            let imgSource = element.image;
            let recipeId = element.id;
            document.querySelector('.card-container').append(card);
            card.setAttribute('class','card')
            let image = document.createElement('img');
            card.append(image);
            let nameSpan = document.createElement('span');
            card.append(nameSpan);
            let namePara = document.createElement('p');
            card.append(namePara);
            let ingrSpan = document.createElement('span');
            card.append(ingrSpan);
            let ingrPara = document.createElement('p');
            card.append(ingrPara);
            nameSpan.innerText = 'Name:'
            ingrSpan.innerText = 'Ingredients:'
            namePara.innerText = element.title;
            image.setAttribute('src', imgSource)
            fetch(`https://api.spoonacular.com/recipes/${recipeId}/ingredientWidget.json?apiKey=${apiKey}`)
            .then(response => response.json())
            .then(data => data.ingredients)
            .then(array => {
                let ingredients = [];
                array.forEach(object => {
                    ingredients.push(object.name);
                })
                ingrPara.innerText = ingredients.join(', ')
            })
        })
    })


    

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
