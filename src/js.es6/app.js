const $ = require("jquery");

function ajax(url) {
  return $.ajax({
    url,
    type: "GET",
    headers: { "Client-ID": "4xgieexxnaaham3kdib2a7ti96x51ae" }
  });
}

const streamers = [
  "ESL_SC2",
  "OgamingSC2",
  "cretetion",
  "freecodecamp",
  "storbeck",
  "habathcx",
  "RobotCaleb",
  "noobs2ninjas",
  "brunofin",
  "comster404",
  "probablynotexistent"
];

streamers.forEach(streamer =>
  Promise.resolve(ajax(`https://api.twitch.tv/kraken/streams/${streamer}`))
  .then(function fulfilled(data) {
    console.log(`${streamer} is online?`);
    if (!data.stream) {
      // Make another request for channel info
      return Promise.resolve(ajax(data._links.channel));
    }

    // output to list of online streamers using template
    // breaks the promise chain, since `undefined` is returned at this point
    console.log(data.stream);
  })
  .then(function fulfilled(data) {
    // output to list of offline streamers using template
    console.log(`${streamer} channel`);
    console.log(data);
  })
  .catch(function rejected(err) {
    // output to list of closed accounts
    console.log(`${streamer} is closed`);
    console.log(err);
  })
);
