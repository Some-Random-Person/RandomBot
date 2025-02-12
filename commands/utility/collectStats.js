const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const apiUrl = "https://api.bring.com/tracking/api/v2/tracking.json";

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("collect-stats")
    .setDescription(
      "Collects all parcels in Bring's system and gathers info for them"
    )
    .addIntegerOption((option) =>
      option
        .setName("max_value")
        .setDescription("The max value of the tracking number")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("start_string")
        .setDescription(
          "The first few characters of the tracing number, if applicable"
        )
    )
    .addStringOption((option) =>
      option
        .setName("end_string")
        .setDescription(
          "The last few characters of the tracking number, if applicable"
        )
    ),
  async execute(interaction) {
    const startString = interaction.options.getString("start_string") || "";
    const maxValue = interaction.options.getInteger("max_value");
    const endString = interaction.options.getString("end_string") || "";

    await interaction.deferReply();

    const batchSize = 120;
    const delay = 1000;
    const totalBatches = Math.ceil(maxValue / batchSize);

    let completedRequests = 0;

    const fetchBatch = async (batchIndex) => {
      const promises = [];
      const start = batchIndex * batchSize;
      const end = Math.min(start + batchSize, maxValue);

      for (let i = start; i < end; i++) {
        const varNum = i.toString().padStart(8, "0");
        const trackingNumber = startString + varNum + endString;

        promises.push(
          await fetch(`${apiUrl}?q=${trackingNumber}`, {
            headers: {
              "X-MyBring-API-Uid": process.env.BRING_API_UID,
              "X-MyBring-API-Key": process.env.BRING_API_KEY,
              "X-Bring-Client-URL": "https://example.com",
            },
          })
            .then((response) => {
              if (!response.ok)
                throw new Error(`HTTP error ${response.status}`); // needs change for database
              return response.json();
            })
            .then((data) => {
              if (
                data.consignmentSet &&
                data.consignmentSet[0] &&
                data.consignmentSet[0].error
              ) {
                console.log(
                  `Error for ${trackingNumber}: ${data.consignmentSet[0].error.message}`
                );
                return null;
              }

              if (!data.consignmentSet || data.consignmentSet.length === 0) {
                throw new Error(`No consignment data for ${trackingNumber}`);
              }
              return data;
            })
            .catch((err) => {
              console.error(`Error for ${trackingNumber}:`, err.message);
              return null;
            })
        );
      }

      const results = await Promise.all(promises);
      completedRequests += results.filter(Boolean).length;
      return results;
    };

    const updateEmbedProgress = async () => {
      const percentage = ((completedRequests / maxValue) * 100).toFixed(2);
      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Tracking Progress")
        .setDescription(`Processing parcels... \nProgress: **${percentage}%**`);
      await interaction.editReply({ embeds: [embed] });
    };

    const intervalId = setInterval(updateEmbedProgress, 5 * 60 * 1000);

    try {
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        await fetchBatch(batchIndex);

        if (batchIndex < totalBatches - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      clearInterval(intervalId);
      await updateEmbedProgress();

      await interaction.followUp("All parcels have been processed!");
    } catch (err) {
      console.error("Error during processing:", err);
      clearInterval(intervalId);
      await interaction.followUp(
        `An error occurred while processing parcels: ${err.message}`
      );
    }
  },
};
