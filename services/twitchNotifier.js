const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const db = require("../models");
const streamerService = new (require("../services/streamerService"))(db);
const optionService = new (require("../services/optionService"))(db);

// const channel = interaction.options.getChannel("channel");
const twitchClientID = process.env.TWITCH_CLIENT_ID;
const twitchSecret = process.env.TWITCH_SECRET;

// gets twitchToken
let twitchToken = null;
let tokenExpiresAt = 0;

async function getTwitchToken() {
  const now = Date.now() / 1000; // seconds
  if (twitchToken && now < tokenExpiresAt - 60) {
    // renew 1 minute before expiry
    return twitchToken;
  }
  const res = await axios.post(
    `https://id.twitch.tv/oauth2/token?client_id=${twitchClientID}&client_secret=${twitchSecret}&grant_type=client_credentials`
  );
  twitchToken = res.data.access_token;
  tokenExpiresAt = now + res.data.expires_in;
  return twitchToken;
}

// Function to get twitch avatar for the user
async function getProfileImage(streamerName) {
  const res = await axios.get(
    `https://api.twitch.tv/helix/users?login=${streamerName}`,
    {
      headers: {
        "Client-ID": `${twitchClientID}`,
        Authorization: `Bearer ${twitchToken}`,
      },
    }
  );

  return res.data.data[0].profile_image_url;
}

// Function to send a live notification to Discord
async function sendLiveNotification(resStream, channelId, client) {
  const rawThumbnailUrl = resStream.thumbnail_url;
  const thumbnailWidth = 1280;
  const thumbnailHeight = 720;
  const thumbnailUrl = rawThumbnailUrl
    .replace("{width}", thumbnailWidth)
    .replace("{height}", thumbnailHeight);

  const profileImageUrl = await getProfileImage(resStream.user_login);

  const embed = new EmbedBuilder()
    .setColor("9146FF")
    .setAuthor({
      name: `${resStream.user_name} is now live!`,
      url: `https://twitch.tv/${resStream.user_login}`,
    })
    .setThumbnail(`${profileImageUrl}`)
    .setTitle(resStream.title)
    .setURL(`https://twitch.tv/${resStream.user_login}`)
    .addFields(
      { name: "Game", value: resStream.game_name, inline: true },
      {
        name: "Viewers",
        value: resStream.viewer_count.toString(),
        inline: true,
      }
    )
    .setImage(thumbnailUrl);

  const channel = await client.channels.fetch(channelId);

  if (channel && channel.isTextBased()) {
    channel.send({
      content: `${resStream.user_name} is now live on Twitch!`,
      embeds: [embed],
    });
  } else {
    console.error(
      `Channel with ID ${channelId} not found, or is not a text based channel`
    );
  }
}

async function twitchCheckLive(client) {
  await getTwitchToken();
  const twitchStreamers = await streamerService.getAllLive();

  Promise.allSettled(
    twitchStreamers.map(async (streamer) => {
      const streamerName = streamer.streamerName;
      const channelId = streamer.channelId;
      try {
        const res = await axios.get(
          `https://api.twitch.tv/helix/streams?user_login=${streamerName}`,
          {
            headers: {
              "Client-ID": `${twitchClientID}`,
              Authorization: `Bearer ${twitchToken}`,
            },
          }
        );

        if (res.data.data.length > 0) {
          const resStream = res.data.data[0];

          if (!streamer.isLive) {
            sendLiveNotification(resStream, channelId, client);
          }
          streamerService.updateLiveStatus(
            streamer.guildId,
            streamer.streamerName,
            true
          );
        } else {
          streamerService.updateLiveStatus(
            streamer.guildId,
            streamer.streamerName,
            false
          );
        }
      } catch (error) {
        console.error(error);
        streamerService.updateLiveStatus(
          streamer.guildId,
          streamer.streamerName,
          false
        );
      }
    })
  );
}

module.exports = { twitchCheckLive };
