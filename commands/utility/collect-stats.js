const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Bottleneck = require("bottleneck"); // To manage rate limits
const { BRING_API_UID, BRING_API_KEY } = process.env;
const apiUrl = "https://api.bring.com/tracking/api/v2/tracking.json";

// Initialize Bottleneck (adjust settings based on Bring API limits)
const limiter = new Bottleneck({
  maxConcurrent: 20, //Example.  Adjust based on Bring's limit.
  minTime: 100, //Example.  Adjust based on Bring's limit.
});

module.exports = {
  category: "utility",
  cooldown: 5,
  devOnly: true,
  data: new SlashCommandBuilder()
    .setName("collect-stats")
    .setDescription("Collects parcel info from Bring's system")
    .addIntegerOption((option) =>
      option
        .setName("max_value")
        .setDescription("Max tracking number value")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("start_string").setDescription("Tracking number prefix")
    )
    .addStringOption((option) =>
      option.setName("end_string").setDescription("Tracking number suffix")
    ),
  async execute(interaction) {
    const startString = interaction.options.getString("start_string") || "";
    const maxValue = interaction.options.getInteger("max_value");
    const endString = interaction.options.getString("end_string") || "";

    await interaction.deferReply();

    const batchSize = 120;
    const totalBatches = Math.ceil(maxValue / batchSize);
    let completedRequests = 0;
    let errorCount = 0; // Track errors
    let NotFound = 0;

    const fetchParcelData = async (trackingNumber) => {
      try {
        const response = await limiter.schedule(() =>
          // Use rate limiter
          fetch(`${apiUrl}?q=${trackingNumber}`, {
            headers: {
              "X-MyBring-API-Uid": BRING_API_UID,
              "X-MyBring-API-Key": BRING_API_KEY,
              "X-Bring-Client-URL": "https://example.com",
            },
          })
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error ${response.status} for ${trackingNumber}`
          );
        }

        const data = await response.json();

        if (data.consignmentSet[0]?.error?.message) {
          const errorMessage = data.consignmentSet[0].error.message;
          const errorCode = data.consignmentSet[0].error.code;
          console.log(
            `API Error for ${trackingNumber}: (${errorCode}) ${errorMessage}`
          );
          //await saveErrorToDatabase(trackingNumber, errorMessage); //Implement this function to save errors

          if (errorCode == 404) {
            NotFound++;
          } else {
            errorCount++;
          }

          return null;
        }

        if (!data.consignmentSet || data.consignmentSet.length === 0) {
          //await saveErrorToDatabase(trackingNumber, "No consignment data"); //Implement this function to save errors
          errorCount++;
          console.warn(`No data for ${trackingNumber}`);
          return null;
        }

        // await saveParcelDataToDatabase(data); //  Implement this function to save parcel data
        return data;
      } catch (error) {
        console.error(`Fetch error for ${trackingNumber}:`, error);
        //await saveErrorToDatabase(trackingNumber, error.message); //Implement this function to save errors
        errorCount++;
        return null;
      }
    };

    const updateEmbedProgress = async () => {
      const percentage = ((completedRequests / maxValue) * 100).toFixed(2);
      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Tracking Progress")
        .setDescription(
          `Processing ${totalBatches} batches of ${batchSize} size`
        )
        .setFields(
          {
            name: "Progress",
            value: `${percentage}%`,
          },
          { name: "Errors", value: ` ${errorCount}`, inline: true },
          { name: "Not found", value: `${NotFound}`, inline: true }
        ); //Show errors
      await interaction.editReply({ embeds: [embed] });
    };

    await updateEmbedProgress();

    const intervalId = setInterval(updateEmbedProgress, 60 * 1000); // Update every minute

    try {
      for (let batch = 0; batch < totalBatches; batch++) {
        const promises = [];

        for (
          let i = batch * batchSize;
          i < Math.min((batch + 1) * batchSize, maxValue);
          i++
        ) {
          const varNum = i.toString().padStart(8, "0");
          const trackingNumber = startString + varNum + endString;
          promises.push(fetchParcelData(trackingNumber));
        }

        await Promise.allSettled(promises);
        completedRequests += promises.length;
        await updateEmbedProgress();
      }

      // After all batches are processed
      clearInterval(intervalId);

      await interaction.followUp(
        `All parcels processed!  Total Errors: ${errorCount}`
      );
    } catch (err) {
      console.error("Overall processing error:", err);
      clearInterval(intervalId);
      await interaction.followUp(`An error occurred: ${err.message}`);
    }
  },
};
