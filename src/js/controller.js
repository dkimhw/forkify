import 'core-js/stable';
import 'regenerator-runtime/runtime'
import * as model from './model.js';
import recipeView from './views/recipeView.js';

const recipeContainer = document.querySelector('.recipe');


// https://forkify-api.herokuapp.com/v2
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
    alert(err);
  }
};

window.addEventListener('hashchange', controlRecipes);
window.addEventListener('load', controlRecipes);
