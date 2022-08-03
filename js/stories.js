"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  $ownStoriesList.hide();
  $favStoriesList.hide();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      ${($ownStoriesList.is(":visible") === true) ? generateTrashMarkup() : ''}
      ${currentUser ? getStarMarkup(story, currentUser) : " "}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // Loop through all stories and generate HTML for each one
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Allow user to submit a new story that is added to the API and appended to page when they 
 * click the submit button. */

async function submitNewStory() {
  // Get data from form
  console.debug('submitNewStory')
  const author = $('#author-name').val()
  const title = $('#story-title').val()
  const url = $('#story-url').val()
  
  // Create story instance and generate its markup
  const story = await storyList.addStory(currentUser, {title, author, url})
  const storyHTML = generateStoryMarkup(story)

  // Append to top of list
  $allStoriesList.prepend(storyHTML)

  // Clear form values
  $('#author-name').val('')
  $('#story-title').val('')
  $('#story-url').val('')

  $submitStoryForm.hide()
}

$("#add-new-story").on("click", submitNewStory)

/** Handle clicking star on all stories page and favorites page */

$allStoriesList.add($favStoriesList).add($ownStoriesList).on("click", function(evt) {
  const $target = $(evt.target);
  
  // If target is star icon...

  if ($target[0].className.includes('star') ){

    // Grab storyId from closest story li
    const $closestLi = $target.closest('li');
    const storyId = $closestLi.attr("id");

    // Find that story in storyList and update the star UI
    const story = storyList.stories.find(s => s.storyId === storyId);

    // Toggle star class
    if (evt.target.classList.contains("far")) {
      currentUser.addFavorite(story)
      toggleStarClass($target)
   }
    else if (evt.target.classList.contains("fas")) {
     currentUser.removeFavorite(story)
      toggleStarClass($target)
    } 
  }

  /** Handle clicking trash icon to delete story */

  // If target is trash icon...
  if ($target[0].className.includes('trash')){
  
    // Remove from API/storyList,favorites,ownStories
    const storyId = $target.closest('li').attr('id')
    $target.closest('li').remove()
    
    // Remove from favorites, ownStories, and storyList
    currentUser.favorites = currentUser.favorites.filter(s => s.storyId !== storyId)
    currentUser.ownStories = currentUser.ownStories.filter(s => s.storyId !== storyId)
    storyList.stories = storyList.stories.filter(s => s.storyId !== storyId)

    // Remove from API
    deleteStory(storyId)
  }  
})

/** Delete story from API */

async function deleteStory(storyId) {
  await axios.delete(`${BASE_URL}/stories/${storyId}?token=${currentUser.loginToken}`)
}