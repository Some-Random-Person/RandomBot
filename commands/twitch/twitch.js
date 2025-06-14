const {
  SlashCommandBuilder,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  category: "twitch",
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("twitch")
    .setDescription("Sets the channel for Twitch notifications")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel for Twitch notifications")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const twitchClientID = process.env.TWITCH_CLIENT_ID;
    const twitchSecret = process.env.TWITCH_SECRET;
    let twitchStreamers = [
      { name: "whoisredux", isLive: false },
      { name: "graylyrain", isLive: false },
      { name: "double_eagle", isLive: false },
      { name: "wrp_beater", isLive: false },
      { name: "some_random_person", isLive: false },
      { name: "gkpunk", isLive: false },
      { name: "jasper_2077", isLive: false },
      { name: "wakey_bakey_", isLive: false },
      { name: "alonzo_lafayette", isLive: false },
      { name: "scroobiusjib", isLive: false },
      { name: "megtheartist", isLive: false },
      { name: "anomadness", isLive: false },
      { name: "arnavk17jee", isLive: false },
      { name: "sisterzhe", isLive: false },
      { name: "mrmike227", isLive: false },
      { name: "mobpsychologist", isLive: false },
      { name: "supremecmdrikeoakfield", isLive: false },
      { name: "karma4d", isLive: false },
      { name: "uhnoobis", isLive: false },
      { name: "mungadungalis", isLive: false },
      { name: "agentsnail47", isLive: false },
      { name: "ageingfps", isLive: false },
      { name: "icacj", isLive: false },
      { name: "itzdibs", isLive: false },
      { name: "rickdangerous", isLive: false },
      { name: "grey_bearded_gamer", isLive: false },
      { name: "therealfuzk", isLive: false },
    ];

    await interaction.reply(`Twitch notifications will be sent to ${channel}`);

    // gets twitchToken
    const resPost = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${twitchClientID}&client_secret=${twitchSecret}&grant_type=client_credentials`
    );

    const twitchToken = resPost.data.access_token;

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
    async function sendLiveNotification(resStream) {
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
          { name: "Game", value: resStream.game_name },
          { name: "Viewers", value: resStream.viewer_count.toString() }
        )
        .setImage(thumbnailUrl);

      channel.send({ embeds: [embed] });
    }

    async function checkLive() {
      for (const streamer of twitchStreamers) {
        try {
          const res = await axios.get(
            `https://api.twitch.tv/helix/streams?user_login=${streamer.name}`,
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
              sendLiveNotification(resStream);
            }
            streamer.isLive = true;
          } else {
            streamer.isLive = false;
          }
        } catch (error) {
          console.error(error);
          streamer.isLive = false;
        }
      }
    }

    setInterval(() => {
      checkLive();
    }, 60 * 1000); // seconds * milliseconds
  },
};
