const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const fetch = require("node-fetch");
const FormData = require("form-data");
const generate_role = process.env.GENERATE_ROLE;
const obex_api_key = process.env.OBEX_API_KEY;

module.exports = {
  name: "generate",
  description: "Generates registration code using obex api",
  cooldown: 3000,
  type: ApplicationCommandType.ChatInput,
  dm_permission: false, // permission required
  options: [
    {
      name: "visible",
      description: "Generates registration code using obex api.",
      type: 1,
      options: [
        {
          name: "build",
          description: "The build you want to generate key for.",
          type: 3,
          required: true,
          choices: [
            {
              name: "User",
              value: "User",
            },
            {
              name: "Beta",
              value: "Beta",
            },
            {
              name: "Debug",
              value: "Debug",
            },
          ],
        },
      ],
    },
    {
      name: "invisible",
      description: "Generates registration code using obex api.",
      type: 1,
      options: [
        {
          name: "build",
          description: "The build you want to generate key for.",
          type: 3,
          required: true,
          choices: [
            {
              name: "User",
              value: "User",
            },
            {
              name: "Beta",
              value: "Beta",
            },
            {
              name: "Debug",
              value: "Debug",
            },
          ],
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    const author = interaction.member;
    if (!author.roles.cache.get(generate_role)) {
      return interaction.reply({ content: "Nice try!" });
    } else {
      if (interaction.options._subcommand === "visible") {
        await interaction.deferReply();
        try {
          const build = interaction.options.get("build").value;
          const apikey = obex_api_key;
          let bodyContent = new FormData();
          bodyContent.append("req_type", "generate");
          bodyContent.append("api_key", `${apikey}`);
          bodyContent.append("key_type", `${build}`);

          fetch("https://obex.pink/api/interact.php", {
            method: "POST",
            body: bodyContent,
          })
            .then(function (response) {
              return response.text();
            })
            .then(function (data) {
              if (!data || data.length != 64) {
                return interaction.editReply({
                  content: `Sorry, I failed generating a key! (probably an obex issue)`
                });
              }
              const buildupperfirst =
                build.charAt(0).toUpperCase() + build.slice(1);
              const embed = new EmbedBuilder()
                .setTitle("Registration key")
                .setDescription(`Successfully generated registration key!`)
                .setFields(
                  {
                    name: "Key",
                    value: `${data}`,
                  },
                  {
                    name: "Build",
                    value: `${buildupperfirst}`,
                  }
                )
                .setColor("8945e0")
                .setTimestamp()
                .setFooter({
                  text: "mylua.com",
                });

              return interaction.editReply({ content: "", embeds: [embed] });
            })
            .catch((error) => {
              console.log(error);
              return interaction.editReply({
                content: `Sorry, I failed generating a key! (probably an obex issue)`
              });
            });
        } catch {
          return interaction.editReply({
            content: `Sorry, I failed generating a key! Contact XanZ :)`
          });
        }
      } else if (interaction.options._subcommand === "invisible") {
        await interaction.deferReply({ephemeral: true});
        try {
          const build = interaction.options.get("build").value;
          const apikey = obex_api_key;
          let bodyContent = new FormData();
          bodyContent.append("req_type", "generate");
          bodyContent.append("api_key", `${apikey}`);
          bodyContent.append("key_type", `${build}`);

          fetch("https://obex.pink/api/interact.php", {
            method: "POST",
            body: bodyContent,
          })
            .then(function (response) {
              return response.text();
            })
            .then(function (data) {
              if (!data || data.length != 64) {
                return interaction.editReply({
                  content: `Sorry, I failed generating a key! (probably an obex issue)`,
                  ephemeral: true,
                });
              }
              const buildupperfirst =
                build.charAt(0).toUpperCase() + build.slice(1);
              const embed = new EmbedBuilder()
                .setTitle("Registration key")
                .setDescription(`Successfully generated registration key!`)
                .setFields(
                  {
                    name: "Key",
                    value: `${data}`,
                  },
                  {
                    name: "Build",
                    value: `${buildupperfirst}`,
                  }
                )
                .setColor("8945e0")
                .setTimestamp()
                .setFooter({
                  text: "mylua.com",
                });

              return interaction.editReply({ 
                content: "",
                embeds: [embed],
                ephemeral: true,
              });
            })
            .catch((error) => {
              console.log(error);
              return interaction.editReply({
                content: `Sorry, I failed generating a key! (probably an obex issue)`,
                ephemeral: true,
              });
            });
        } catch {
          return interaction.editReply({
            content: `Sorry, I failed generating a key!`,
            ephemeral: true,
          });
        }
      }
    }
  },
};
