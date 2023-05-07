import 'core-js/stable';
import 'regenerator-runtime/runtime'
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886
    // https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcc40
    // 1. Load Recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 2. Rendering recipe
    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);

    // render result
    resultsView.render(model.state.search.results);
  } catch (err) {
    resultsView.renderError(err);
  }
}

const init = function() {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
