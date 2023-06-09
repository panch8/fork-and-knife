import * as model from './model';
import recipeview from './views/recipeview';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchResultsView from './views/searchResultsView';
import searchView from './views/searchView';
import PaginationView from './views/PaginationView.js';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlReceipes = async function () {
  try {
    //get hash id
    let id = window.location.hash.slice(1);
    if (!id) return;
    recipeview.renderSpinner();
    searchResultsView.update(model.resolvePagination());
    bookmarksView.render(model.state.bookmarks);
    await model.loadRecipe(id);
    recipeview.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeview.renderError();
  }
};

const controlSearch = async function () {
  try {
    //get query
    const query = searchView.getQuery();
    if (!query) return;
    //async searching
    searchResultsView.renderSpinner();
    await model.searchRecipe(query);
    //render results
    //render pagination btns
    controlPagination(1);
  } catch (err) {
    console.error(err);
    searchResultsView.renderError();
  }
};
const controlPagination = function (goTo) {
  searchResultsView.render(model.resolvePagination(goTo));
  PaginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServing(newServings);
  // render recipe again
  recipeview.update(model.state.recipe);
};

const controlBookmark = function () {
  const recipe = model.state.recipe;
  if (!recipe.bookmarked) {
    model.addBookmark(recipe);
    recipeview.update(recipe);
  } else {
    model.deleteBookmark(recipe.id);
    recipeview.update(recipe);
  }
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (data) {
  try {
    const uploadedRecipe = await model.uploadData(data);
    addRecipeView._toggleWindow();
    model.addBookmark(uploadedRecipe);
    recipeview.render(model.state.recipe);
    searchResultsView.render([uploadedRecipe]);
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    console.error(err);
  }
};

const controlDeleteRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    model.deleteBookmark(id);
    searchResultsView.render(model.state.bookmarks);
    bookmarksView.render(model.state.bookmarks);

    await model.loadRecipe(model.state.bookmarks[0].id);
    recipeview.render(model.state.recipe);
    await model.deleteData(id);
    // window.location.assign(rootInit);
  } catch (error) {
    console.error(error);
  }
};

const init = function () {
  addRecipeView.addHandlerUpload(controlAddRecipe);
  bookmarksView.addHandlerBookmarks(controlBookmarks);
  recipeview.addHandlerRender(controlReceipes);
  recipeview.addHandlerServings(controlServings);
  recipeview.addHandlerBookmark(controlBookmark);
  recipeview.addHandlerDelete(controlDeleteRecipe);
  searchView.addHandlerSearch(controlSearch);
  PaginationView.addHandlerGoTO(controlPagination);
};
init();
