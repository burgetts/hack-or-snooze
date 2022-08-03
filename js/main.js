"use strict";

// Select necessary DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");

// Story lists
const $allStoriesList = $("#all-stories-list");
const $favStoriesList = $('#favorite-stories-list');
const $ownStoriesList = $('#own-stories-list');

// Forms
const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $submitStoryForm = $("#submit-story");

// Nav bar links
const $navAll = $('#nav-all')
const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");
const $navSubmit = $("#nav-submit");
const $navFavorites = $('#nav-favorites');
const $navMyStories = $('#nav-my-stories')


/** Hides most components on the page to make individual components easier to show themselves. */

function hidePageComponents() {
  const components = [
    // Story lists
    $allStoriesList,
    $favStoriesList,
    $ownStoriesList,
    // Forms
    $loginForm,
    $signupForm,
    $submitStoryForm
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */
async function start() {
  console.debug("start");

  // Remember logged-in user and login if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // Update user UI if user is logged in
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app
console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);