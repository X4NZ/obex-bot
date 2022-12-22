const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const fetch = require("node-fetch");
const FormData = require("form-data");
const generate_role = process.env.GENERATE_ROLE;
const obex_api_key = process.env.OBEX_API_KEY;

module.exports = {
  name: "blacklist",
  description: "Blacklist user",
  cooldown: 3000,
  type: ApplicationCommandType.ChatInput,
  dm_permission: false,
  options: [
    {
      name: "user",
      description: "User you want to blacklist",
      type: 3,
      required: true,
    },
    {
      name: "reason",
      description: "Blacklist reason",
      type: 3,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const author = interaction.member;
    if (!author.roles.cache.get(generate_role)) {
      return interaction.reply({ content: "Nice try!" });
    } else {
      await interaction.deferReply({ ephemeral: true });
      try {
        const user = interaction.options.get("user").value;
        let identifier = "";
        if (user.startsWith("<@")) {
          identifier = user.slice(2, user.length - 1);
        } else {
          identifier = user;
        }
        console.log(identifier);
        const reason = interaction.options.get("reason").value;
        const apikey =  obex_api_key;
        let bodyContent = new FormData();
        bodyContent.append("req_type", "blacklist");
        bodyContent.append("api_key", apikey);
        bodyContent.append("identifier", identifier);
        bodyContent.append("reason", reason);
        let response = await fetch("https://obex.pink/api/interact.php", {
          method: "POST",
          body: bodyContent,
        });
        let data = await response.text();

        if (data.startsWith("Invalid")) {
          if (user.startsWith("<@")) {
            const errorembed = new EmbedBuilder()
              .setTitle(`An error occured!`)
              .setDescription(data + " " + "Discord probably not linked.")
              .setColor("8945e0")
              .setTimestamp()
              .setFooter({
                text: "mylua.com",
              });
            return interaction.editReply({
              embeds: [errorembed],
              ephemeral: true,
            });
          } else {
            const errorembed = new EmbedBuilder()
              .setTitle(`An error occured!`)
              .setDescription(data)
              .setColor("8945e0")
              .setTimestamp()
              .setFooter({
                text: "mylua.com",
              });
            return interaction.editReply({
              embeds: [errorembed],
              ephemeral: true,
            });
          }
        } else if (data.startsWith("Successfully")) {
          const embed = new EmbedBuilder()
            .setTitle(`User blacklisted!`)
            .setDescription(data)
            .setColor("8945e0")
            .setTimestamp()
            .setFooter({
              text: "mylua.com",
            });
          return interaction.editReply({ embeds: [embed], ephemeral: true });
        } else {
          return interaction.editReply({
            content: "Something went wrong! (PROBABLY OBEX ISSUE)",
            ephemeral: true,
          });
        }
      } catch {
        return interaction.editReply({
          content: "Something went wrong!",
          ephemeral: true,
        });
      }
    }
  },
};
