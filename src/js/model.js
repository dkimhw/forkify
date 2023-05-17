
import { API_URL, RES_PER_PAGE, KEY } from "./config";
import { getJSON, sendJSON } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
}

const createRecipeObject = function(data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key })
  };
}

export const loadRecipe = async function (id) {
  try {
    data = await getJSON(`${API_URL}${id}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(b => b.id === recipe.id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    return recipe;
  } catch (err) {
    throw err;
  }
}

export const loadSearchResults = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.query = query;
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      }
    });

  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = 1) {
  const perPage = state.search.resultsPerPage;
  const start = (page - 1) * perPage;
  const end = page * perPage;
  state.search.page = page;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  if (state.recipe.ingredients) {
    state.recipe.ingredients.forEach(ingredient => {
      ingredient.quantity = Number(ingredient.quantity) * newServings / state.recipe.servings;
    });

    state.recipe.servings = newServings;
  }
}

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
}

export const deleteBookmark = function(id) {
  // Remove bookmark from the array
  let findRecipeIdx = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(findRecipeIdx, 1);

  // Mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
}

export const uploadRecipe = async function(newRecipe) {
  try{
    const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      const ingArr = ing[1].replaceAll(' ', '').split(',');
      if (ingArr.length !== 3) throw new Error('Wrong ingredient format!');

      const [quantity, unit, description] = ingArr;
      return { quantity: quantity ? +quantity : null, unit, description };
    });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: Number(newRecipe.cookingTime),
      servings: Number(newRecipe.servings),
      ingredients: ingredients,
    }

    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}

const init = function() {
  const storage = localStorage.getItem('bookmarks');

  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
};

init();
