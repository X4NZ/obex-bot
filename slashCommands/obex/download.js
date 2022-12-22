const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const fs = require("fs");
const fetch = require("node-fetch");

module.exports = {
  name: "download",
  description: "Sends obex loader",
  cooldown: 3000,
  type: ApplicationCommandType.ChatInput,
  dm_permission: true,

  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      let response = await fetch("https://obex.pink/loader.php", {
        method: "POST",
      });
      let data = await response.text();
      if (!data.startsWith("--")) {
        return interaction.editReply({
          content: `Sorry, something failed but here is the latest loader i have saved! (PROBABLY OBEX ISSUE)`,
          files: ["loader/obex.lua"],
          ephemeral: true,
        });
      } else {
        fs.writeFile("loader/obex.lua", data, (err) => {
          if (err) console.log(err);
          console.log("The file has been saved!");
        });

        return interaction.editReply({
          files: ["loader/obex.lua"],
          ephemeral: true,
        });
      }
    } catch {
      return interaction.editReply({
        content: `Sorry, something failed! Try again later!`,
        ephemeral: true,
      });
    }
  },
};
