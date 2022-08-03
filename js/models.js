"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    // Use object destructuring to get hostname from URL object
    const {hostname} = new URL(this.url);
    return hostname.replace("www.", "");
  }
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {

    /** Static method so you can call a method on a class and NOT individual instances */

    // Request stories from API
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // Make a new Story instance out of each story returned from API
    const stories = response.data.stories.map(story => new Story(story));

    // Return array of stories as instance of StoryList
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory(user, {title, author, url}) {
    const token = user.loginToken
    
    // Post request for new story
    const response = await axios.post(`${BASE_URL}/stories`, {token, story: {title, author, url}})

    // Get relevant data from response and make a new Story instance out of it
    const respData = response.data.story
    const story = new Story({'storyId': respData.storyId, 'title': respData.title, 'author': respData.author, 'url': respData.url, 'username': respData.username, 'createdAt': respData.createdAt})
    return story
  }

    /** Return array of favorite stories only as instance of Storylist */

    static getFavoriteStories(favStories) {
      const favStoryList = favStories.map(s => new Story(s) )
      return favStoryList
    }
}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // Instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

/** Check if story is already favorited or not */

  isFavorite(story) {
    for (let favStory of this.favorites) {
      if (story.storyId === favStory.storyId)
      return true
    }
    return false
  }

/** Add story to favorites both locally and remotely */

 async addFavorite(story) {

    // Add to user favorites
    this.favorites.push(story);
    
    // Add to API
    await axios.post(`${BASE_URL}/users/${currentUser.username}/favorites/${story.storyId}?token=${currentUser.loginToken}`)
  }

/** Remove story from favorites both locally and remotely */
  async removeFavorite(story) {
    // Remove from user favorites
    this.favorites = this.favorites.filter(s => s.storyId !== story.storyId);
    // Remove from API
    await axios.delete(`${BASE_URL}/users/${currentUser.username}/favorites/${story.storyId}?token=${currentUser.loginToken}`)
  }
}