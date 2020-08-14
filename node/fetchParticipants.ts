import TwitterClient from 'twitter-api-client';
import fs from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

const TWEET_ID = '<YOUR_TWEET_ID>';
const API_KEY = '<YOUR_API_KEY>';
const API_SECRET = '<YOUR_API_SECRET>';
const ACCESS_TOKEN = '<YOUR_ACCESS_TOKEN>';
const ACCESS_TOKEN_SECRET = '<YOUR_ACCESS_TOKEN_SECRET>';

const twitterClient = new TwitterClient({
  apiKey: API_KEY,
  apiSecret: API_SECRET,
  accessToken: ACCESS_TOKEN,
  accessTokenSecret: ACCESS_TOKEN_SECRET,
});

const writeFile = promisify(fs.writeFile);

async function init() {
  await writeFile(resolve(__dirname, '../src/data/users.json'), '[]');
  const followers = await getFollowers();

  // We loop through all the users.
  // To avoid hitting the rate limit, we need to go through each one-by-one.
  for (const follower of followers) {
    console.log('Evaluation:', follower);

    const evaluate = async () => {
      const liked = await didLike(follower);
      const retweeted = await didRetweet(follower);

      if (liked && retweeted) {
        const [user] = await twitterClient.accountsAndUsers.usersLookup({ user_id: follower });

        const smallUser = {
          username: user.name,
          handle: user.screen_name,
          profileImage: user.profile_image_url.replace('normal', '400x400'),
        };

        const list = require('../src/data/users.json');
        list.push(smallUser);

        await writeFile(
          resolve(__dirname, '../src/data/users.json'),
          JSON.stringify(list, null, 2),
        );
      }

      console.log('Evaluation finished. Qualified: ', liked && retweeted);
    };

    try {
      await evaluate();
    } catch (error) {
      // If we hit a rate limit, we pause for 15 minutes and continue
      if (error.statusCode === 429) {
        console.log('Rate limit exceeded. Pausing for 15 minutes.');
        await new Promise((r) => setTimeout(r, 5 * 60 * 1000));
        console.log('10 minutes to go...');
        await new Promise((r) => setTimeout(r, 5 * 60 * 1000));
        console.log('5 minutes to go...');
        await new Promise((r) => setTimeout(r, 5.5 * 60 * 1000));
        console.log('Continuing...');

        try {
          await evaluate();
        } catch (error) {
          console.log('Evalution failed. Continuing...');
        }
      } else {
        console.log('Evalution failed. Continuing...');
      }
    }

    console.log('----------');

    await new Promise((r) => setTimeout(r, 3000));
  }
}

/**
 * Get all followers
 * @param cursor
 */
async function getFollowers(cursor?: string) {
  const params = cursor ? { cursor } : {};

  const followerRequest = await twitterClient.accountsAndUsers.followersIds({
    stringify_ids: true,
    ...params,
  });

  if (!followerRequest) {
    return [];
  }

  let followers = (followerRequest.ids as any) as string[];

  if (followerRequest.next_cursor_str !== '0') {
    const nextFollowers = await getFollowers(followerRequest.next_cursor_str);

    if (nextFollowers) {
      followers = [...followers, ...nextFollowers];
    }
  }

  return followers;
}

/**
 * Returns true if the user liked the tweet
 * @param userID
 */
async function didLike(userID: string) {
  const likes = await twitterClient.tweets.favoritesList({
    user_id: userID,
    max_id: TWEET_ID,
    count: 1,
  });

  const [like] = likes;

  return like?.id_str === TWEET_ID;
}

/**
 * Return true if the user retweetet the tweet
 * @param userID
 */
async function didRetweet(userID: string) {
  const retweets = await twitterClient.tweets.statusesUserTimeline({
    user_id: userID,
    count: 200,
    include_rts: true,
    exclude_replies: true,
  });

  const isQuoted = retweets.some((rt) => rt.quoted_status?.id_str === TWEET_ID);
  const isRetweeted = retweets.some((rt) => rt.retweeted_status?.id_str === TWEET_ID);

  return isQuoted || isRetweeted;
}

init();
