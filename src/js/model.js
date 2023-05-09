
import { API_URL, RES_PER_PAGE } from "./config";
import { getJSON } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
}

export const loadRecipe = async function (id) {
  try {
    data = await getJSON(`${API_URL}${id}`);

    let { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients
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
