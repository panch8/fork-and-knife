import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, API_KEY } from './config';
import { getJson, ajaxJson } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export async function loadRecipe(id) {
  try {
    const data = await ajaxJson(`${API_URL}/${id}?key=${API_KEY}`, 'GET');
    const { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image_url,
      publisher: recipe.publisher,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      src: recipe.source_url,
      servings: recipe.servings,
      ...(recipe.key && { key: recipe.key }),
    };

    if (state.bookmarks.some(b => b.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error('smth go wrong loading recipe');
    throw err;
  }
}

export async function searchRecipe(query) {
  try {
    state.search.query = query;
    const data = await ajaxJson(
      `${API_URL}/?search=${query}&key=${API_KEY}`,
      'GET'
    );
    const { recipes } = data.data;

    state.search.results = recipes.map(rec => {
      const recipe = {
        id: rec.id,
        title: rec.title,
        image: rec.image_url,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }),
      };
      return recipe;
    });
  } catch (error) {
    throw error;
  }
}

export async function uploadData(data) {
  try {
    //transform data
    let payload;
    payload = Object.fromEntries(data);
    payload.ingredients = [];

    for (key in payload) {
      if (key.includes('ingredient-') && payload[key] !== '') {
        const ingArr = payload[key].split(',');
        const ing = {
          quantity: ingArr[0],
          unit: ingArr[1],
          description: ingArr[2],
        };
        payload.ingredients.push(ing);
      }
    }
    state.addRecipe = {
      title: payload.title,
      image_url: payload.image,
      publisher: payload.publisher,
      cooking_time: payload.cookingTime,
      ingredients: payload.ingredients,
      source_url: payload.sourceUrl,
      servings: payload.servings,
    };

    //await send JSON fn}
    const post = await ajaxJson(
      `${API_URL}?key=${API_KEY}`,
      'POST',
      state.addRecipe
    );
    state.recipe = post.data.recipe;
    return post.data.recipe;
  } catch (err) {
    throw err;
  }
}

export async function deleteData(id) {
  // ajax DELETE call
  try {
    return await ajaxJson(`${API_URL}/${id}?key=${API_KEY}`, 'DELETE');
  } catch (err) {
    throw err;
  }
}

// deleteData('645423ab8db18f00145df042');
function persistStorage() {
  const store = JSON.stringify(state.bookmarks);
  localStorage.setItem('bookmarks', store);
}

function restoreData() {
  const storage = JSON.parse(localStorage.getItem('bookmarks'));
  if (storage) state.bookmarks = storage;
}

export function addBookmark(recipe) {
  // add recipe to bookmarks array
  state.bookmarks.push(recipe);
  state.recipe.bookmarked = true;
  persistStorage();
}

export function deleteBookmark(id) {
  const index = state.bookmarks.findIndex(b => b.id === id);
  //removes item from bookmark array
  state.recipe.bookmarked = false;
  state.bookmarks.splice(index, 1);
  persistStorage();
}

export function resolvePagination(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}

export function updateServing(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
}
restoreData();
