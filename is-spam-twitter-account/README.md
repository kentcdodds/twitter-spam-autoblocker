# is-spam-twitter-account

This simply takes twitter account info and returns a score from 0 - 100 indicating how likely it is that the given account is spam. 0 is low, 100 is high.

## Usage

```javascript
const spamRank = isSpamTwitterAccount({
  // https://dev.twitter.com/rest/reference/get/users/show
  username: 'sammy65572',
  name: 'StokesSammy65572',
  followerCount: 2,
  followingCount: 0,
  likesCount: 900,
  timeSinceJoined: 160363857,
  bio: 'I am a naughty girl looking for fun! Click http://fake.com/some-gibberish', // I got this by literally opening my twitter notifications, immediately recognizing the second notification as favorite spam and copying the bio (I changed the URL).

  // you don't have to provide these. It's recommended that you first provide everything from the
  // basic user data request, and if the rating is mid-range, then make requests for these resources
  timeline: [], // https://dev.twitter.com/rest/reference/get/statuses/user_timeline
  likes: [], // https://dev.twitter.com/rest/reference/get/favorites/list

})

console.assert(spamRank > 90) // yeah, for real
```
