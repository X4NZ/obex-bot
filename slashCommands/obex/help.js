const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const fs = require("fs")
module.exports = {
  name: "help",
  description: "Sends list of commands",
  cooldown: 3000,
  type: ApplicationCommandType.ChatInput,
  dm_permission: true,

  run: async (client, interaction) => {
    const slashCommands = [];

    fs.readdirSync("./slashCommands/").forEach(async (dir) => {
      const files = fs
        .readdirSync(`./slashCommands/${dir}/`)
        .filter((file) => file.endsWith(".js"));

      for (const file of files) {
        const slashCommand = require(`../../slashCommands/${dir}/${file}`);
        if(slashCommand.name == "generate" || slashCommand.name == "role" || slashCommand.name == "lookup" || slashCommand.name == "remove" || slashCommand.name == "blacklist" || slashCommand.name == "unblacklist") {
        } else {
        slashCommands.push({
          name: `/${slashCommand.name}`,
          value: slashCommand.description,
        });}
      }
    });
    const embed = new EmbedBuilder()
      .setTitle("List of commands")
      .setColor("8945e0")
      .setFields(slashCommands)
      .setTimestamp()
      .setFooter({
        text: "mylua.com",
      });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
