"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/**  Show add story form when click "submit" */

function navSubmitClick(evt){
  console.debug("navSubmit", evt)
  hidePageComponents()
  $allStoriesList.show()
  $submitStoryForm.show()
}

$navSubmit.on("click", navSubmitClick)

/** Show login/signup when click "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick");
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logs in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  // Show all nav links, hide login/signup buttons
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navSubmit.show();
  $navFavorites.show(); 
  $navMyStories.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $(".account-forms-container").hide();
}

/** Get StoryList of user favorites */

function getFavorites() {

  const favStories = currentUser.favorites.map(s => new Story(s));
  const favsStoryList = StoryList.getFavoriteStories(favStories)
  return favsStoryList
}

/** Put markup of favorites on favorites list page */

function putFavoritesOnPage(favsStoryList) {
  
  hidePageComponents();
  $favStoriesList.empty();
  $favStoriesList.show();

  // If user has no favorites, tell them
  if (favsStoryList.length === 0) {
    $($favStoriesList).append('<p> No favorites yet! </p>')
    return
  }

  // Otherwise, generate markup and put favorite stories on the page
  for (let story of favsStoryList) {
    const $story = generateStoryMarkup(story);
    $favStoriesList.append($story);
  }
}

/** Show favorite stories list when click on "favorites" */
function handleFavoritesClick() {
  const favoriteStories = getFavorites();
  putFavoritesOnPage(favoriteStories);
}

$navFavorites.on("click", handleFavoritesClick);

/** Get StoryList of stories submitted by the user */

function getOwnStories() {
  const ownStories = currentUser.ownStories.map(s => new Story(s));
  const ownStoriesList = StoryList.getFavoriteStories(ownStories)
  return ownStoriesList
}

/** Generate markup and put user stories on my stories page */

function putOwnStoriesOnPage(ownStoriesList) {
  hidePageComponents();
  $ownStoriesList.empty();
  $ownStoriesList.show();
 
  // If the user has no stories, tell them
  if (ownStoriesList.length === 0) {
    $($ownStoriesList).append('<p> You have not posted any stories yet! </p>')
    return
  }

  // Otherwise, generate markup and put user stories on the page
  for (let story of ownStoriesList) {
    const $story = generateStoryMarkup(story);
    $ownStoriesList.append($story);
  }
}

/** Show user stories when click on "my stories" */

function handleMyStoriesClick() {
  const ownStories = getOwnStories()
  putOwnStoriesOnPage(ownStories)
}

$navMyStories.on("click", handleMyStoriesClick)