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
      { name: "gkpunk", isLive: false },
      { name: "srph3", isLive: false },
      { name: "jembawls", isLive: false },
      { name: "marinemammalrescue", isLive: false },
    ];
    let twitchToken;

    await interaction.reply(`Twitch notifications will be sent to ${channel}`);

    // gets twitchToken
    await axios
      .post(
        `https://id.twitch.tv/oauth2/token?client_id=${twitchClientID}&client_secret=${twitchSecret}&grant_type=client_credentials`
      )
      .then((res) => {
        twitchToken = res.data.access_token;
      });

    // Function to send a live notification to Discord
    function sendLiveNotification(resStream) {
      const rawThumbnailUrl = resStream.thumbnail_url;
      const thumbnailWidth = 1280;
      const thumbnailHeight = 720;
      const thumbnailUrl = rawThumbnailUrl
        .replace("{width}", thumbnailWidth)
        .replace("{height}", thumbnailHeight);

      const embed = new EmbedBuilder()
        .setColor("9146FF")
        .setAuthor({
          name: `${resStream.user_name} is now live!`,
          url: `https://twitch.tv/${resStream.user_login}`,
        })
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
