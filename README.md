*The recipe app should fetch recipes and displays them as cards on a web page*
Features:
        1. Users searches by recipe name.
        2. The app fetches the recipe and displays it in a card
        3. Each card displays recipe name, ingredients and image.
        4. Users can click on a button on recipe card to view the full recipe and its instructions.

List of api keys that can be used in case, daily limit of 150 is reached:
    1. const apiKey = '03c16dff40a94fb38083740aae95e62e';
    2. const apiKey = '5618568abf454ca5994063601ebc4ba2';
    3. const apiKey = '861f6306dc7b4b6aa5a0a457bfe0e967';
    4. const apiKey = '19088892fbf842ec94bf493e139bb3af';


**About the Code**
1. The code first fetches data of random recipes from the api and displays them on the first page.
2. A submit event is added on the form to display a list of cards matching the query typed in the search box.
3. The response from the api is an array of objects, each containing different recipes matching the query.
4. For each object of the array, a card is created using an addCards () function.
5. The recipeID is extracted for each card and then it is subsequently used to access the list of ingredients and that list is then displayed in the respective card.
6. A button is created at the end of each card and an event listener of 'click' is added to the button.
7. When this button is clicked, the api containing the recipe information is fetched. This api contains the recipe instructions and summary corresponding to the recipe id.
8. Meanwhile, the data is simultaneously being stored in the local storage to prevent multiple api hits for the same query.
9. The day stored in local storage is identified by a key which is the same as the search query and a conditional is used to ensure that if the key name matches the search query, the data is fetched from local storage rather than from the api.
