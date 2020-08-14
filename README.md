## Twitter (Random) Winner Picker

![](https://i.imgur.com/MdtyGMQ.gif)

This app was created as part of my [10K giveaway on Twitter](https://twitter.com/SimonHoiberg/status/1292831801648525314).

The rules for the competition is:

- Like
- Retweet
- Follow

Feel free to use it in a similar competition.

### Generate mock data

```console
npm run generate
```

Generate some mock-data for the wheel.  
The mock-data will be found in `src/mock/users.json`.  
Go to `node/generate.ts` to configure the generation.

### Fetch participants

```console
npm run fetch
```

Fetch the participants from Twitter.  
This command will go through each of all your followers, and check if they both liked and retweeted.

> :warning: This can potentially take long time, depending on how many followers you have.  
> For me, it took almost 3 days to go through them all.

The data will be found in `src/data/users.json`.  
Go to `node/fetchParticipants.ts` to configure the twitter client.

### Start the wheel

In the `App.tsx` file, you can choose to import either the `mock/users.json` or `data/users.json`.  
Start the wheel application with

```console
npm start
```
