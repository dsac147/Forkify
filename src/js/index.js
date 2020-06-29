// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import {elements , renderLoader , clearLoader} from './views/base';//named export is imported like this
import * as searchView from './views/searchviews';
import * as recipeView from './views/recipeviews';

const state = {};

// Global state of the app
// Search Object
// Current recepi Object
// Shopping list Object
// Liked recepes


/*Search Controller*/
const controlSearch = async () => {//async function beacuse we use await;every async function returns a promise
    //get search query from view model 
    const query = searchView.getInput();

    if(query)//query present
    {
        //create new search object and add to state
        state.search = new Search(query);

        //prepare ui for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await state.search.getResults();//await the promise because we want the rendering to happen only when we receive the results from the API
    
            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Something wrong with the search...');
            clearLoader();
        }

    }
}


elements.searchForm.addEventListener('submit' , e => {
    e.preventDefault();//prevents the default action of page reload
    controlSearch();
});

elements.searchResPages.addEventListener('click', e=> {
    const btn = e.target.closest('.btn-inline');
    if (btn)
    {
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
        console.log(goToPage);
    }
});


/*Recepi Controller*/
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
            );

        } catch (err) {
            console.log(err);
            alert('Error processing recipe!');
        }
    }
};
 
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));