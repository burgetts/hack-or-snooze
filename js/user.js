"use strict";

// Global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/logout
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // Grab username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // Global currentUser instance of User
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // Global currentUser instance of User
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // Try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  // Add features for logged-in users only
  hidePageComponents();
  updateNavOnLogin();
  putStoriesOnPage();

  $allStoriesList.show();
  $navSubmit.show();
  $navFavorites.show();
}

/** Toggle star class */

function toggleStarClass(star){
  if (star.attr('class') === 'far fa-star') {
    star.attr('class','fas fa-star')
  }
  else {
    star.attr('class', 'far fa-star')
  }
}

/** Genereate markup for trash symbol */

function generateTrashMarkup() {
  if (currentUser) {
 return ` 
  <span class="trash">
    <i class="fas fa-trash-alt"></i>
  </span>`
}
  return ''
}

/** Generate markup for star symbol */

function getStarMarkup(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far"
  return ` <span class="star">
  <i class="${starType} fa-star"></i>
</span>`
}
