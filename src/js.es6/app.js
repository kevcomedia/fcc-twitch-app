const $ = require("jquery");
const Promise = require("es6-promise").Promise;
const templateForInvalid = require("../templates/streamer-invalid.hbs");

function ajax(url) {
  return $.ajax({
    url,
    type: "GET",
    headers: { "Client-ID": "4xgieexxnaaham3kdib2a7ti96x51ae" }
  });
}

function template({ streamer, status = "Offline", url, logo } = {}) {
  const t = require("../templates/streamer.hbs");
  return t({ streamer, status, url, logo });
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
    if (data.stream) {
      const { url, logo, status } = data.stream.channel;
      $("#streamers-online").append(
        template({ url, logo, streamer, status }));

      // "Break" the promise chain after rendering online streamer.
      // Hackish, but better than the previous hack.
      return new Promise((resolve, reject) => { });
    }
    else {
      // Make another request for channel info
      return Promise.resolve(ajax(data._links.channel));
    }
  })
  .then(function fulfilled({ url, logo }) {
    $("#streamers-offline").append(template({ url, logo, streamer }));
  })
  .catch(function rejected(err) {
    $("#streamers-invalid").append(templateForInvalid({ streamer }));
  })
);
