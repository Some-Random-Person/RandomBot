const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
// const { BringAPIUID, BringAPIkey } = require("../../config/config.json");
require("dotenv").config();

const apiUrl = "https://api.bring.com/tracking/api/v2/tracking.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("track")
    .setDescription("Track a package using Bring API")
    .addStringOption((option) =>
      option
        .setName("trackingnumber")
        .setDescription("The tracking number of the package")
        .setRequired(true)
    ),

  async execute(interaction) {
    const trackingNumber = interaction.options.getString("trackingnumber");

    await interaction.deferReply();
    try {
      // const response = await fetch(`${apiUrl}?q=${trackingNumber}`, {
      //   headers: {
      //     "X-MyBring-API-Uid": BringAPIUID,
      //     "X-MyBring-API-Key": BringAPIkey,
      //     "X-Bring-Client-URL": "https://example.com",
      //   },
      // });

      const data = await response.json();

      const consignment = data.consignmentSet[0];
      const package = consignment.packageSet[0];

      const authorName = consignment.senderName || null;
      const authorLogo = consignment.senderLogo || null;

      if (package.eventSet[0].status === "READY_FOR_PICKUP") {
        const pickupUnitName = package.expectedPickupUnitName;
        const pickupUnitURL = package.expectedPickupUnitURL;
        const deliveredTo = `[${pickupUnitName}](${pickupUnitURL})`;
        const embed = new EmbedBuilder()
          .setColor("#0099ff")
          .setTitle(`Tracking information for ${trackingNumber}`)
          .addFields(
            { name: "Status", value: package.eventSet[0].status || "N/A" },
            { name: "Delivered to", value: deliveredTo || "N/A" },
            { name: "Shelf", value: package.shelfNumber || "N/A" },
            { name: "Return date", value: package.dateOfReturn || "N/A" }
          )
          .setTimestamp()
          .setFooter({
            text: "posten.no",
            iconURL:
              "https://lh4.ggpht.com/YRwJfMtDb7mtVqRO2gxUwx4qqrmLP1fvienbbEzx05DfQ1q9e05rE59DInC7X64ECw=w300",
          });

        if (authorName && authorLogo) {
          embed.setAuthor({
            name: `Sent from ${authorName}`,
            iconURL: authorLogo,
          });
        } else {
          embed.setAuthor({
            name: `Sent from ${authorName}`,
          });
        }

        await interaction.editReply({ embeds: [embed] });
      } else if (package.eventSet[0].status === "DELIVERED") {
        const pickupTime = `${package.eventSet[0].displayDate} ${package.eventSet[0].displayTime}`;
        const embed = new EmbedBuilder()
          .setColor("#0099ff")
          .setTitle(`Tracking information for ${trackingNumber}`)
          .addFields(
            { name: "Status", value: package.eventSet[0].status || "N/A" },
            { name: "Picked up", value: pickupTime || "N/A" }
          )
          .setTimestamp()
          .setFooter({
            text: "posten.no",
            iconURL:
              "https://lh4.ggpht.com/YRwJfMtDb7mtVqRO2gxUwx4qqrmLP1fvienbbEzx05DfQ1q9e05rE59DInC7X64ECw=w300",
          });

        if (authorName && authorLogo) {
          embed.setAuthor({
            name: `Sent from ${authorName}`,
            iconURL: authorLogo,
          });
        } else {
          embed.setAuthor({
            name: `Sent from ${authorName}`,
          });
        }

        await interaction.editReply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setColor("#0099ff")
          .setTitle(`Tracking information for ${trackingNumber}`)
          .addFields(
            { name: "Status", value: package.eventSet[0].status || "N/A" },
            {
              name: "Estimated Delivery",
              value: `${package.dateOfEstimatedDelivery}`,
            }
          )
          .setTimestamp()
          .setFooter({
            text: "posten.no",
            iconURL:
              "https://lh4.ggpht.com/YRwJfMtDb7mtVqRO2gxUwx4qqrmLP1fvienbbEzx05DfQ1q9e05rE59DInC7X64ECw=w300",
          });

        if (authorName && authorLogo) {
          embed.setAuthor({
            name: `Sent from ${authorName}`,
            iconURL: authorLogo,
          });
        } else {
          embed.setAuthor({
            name: `Sent from ${authorName}`,
          });
        }

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.error("Error:", error);
      await interaction.editReply(
        `An error has occourred while fetching tracking information. ${error}`
      );
    }
  },
};
