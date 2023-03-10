const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const generate_role = process.env.GENERATE_ROLE

module.exports = {
  name: "role",
  description: "Manage roles of the server or members.",
  cooldown: 3000,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "add",
      description: "Add role to a user.",
      type: 1,
      options: [
        {
          name: "role",
          description: "The role you want to add to the user.",
          type: 8,
          required: true,
        },
        {
          name: "user",
          description: "The user you want to add role to.",
          type: 6,
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Remove role from a user.",
      type: 1,
      options: [
        {
          name: "role",
          description: "The role you want to remove from the user.",
          type: 8,
          required: true,
        },
        {
          name: "user",
          description: "The user you want to remove role from.",
          type: 6,
          required: true,
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    const author = interaction.member;
    if (!author.roles.cache.get(generate_role)) {
      return interaction.reply({ content: "Nice try!" });
    } else {
    if (interaction.options._subcommand === "add") {
      try {
        const member = interaction.guild.members.cache.get(
          interaction.options.get("user").value
        );
        const role = interaction.options.get("role").role;

        await member.roles.add(role.id);
        const embed = new EmbedBuilder()
          .setTitle("Role Added")
          .setDescription(`Successfully added the role: ${role} to ${member}`)
          .setColor("Green")
          .setTimestamp()
          .setThumbnail(member.user.displayAvatarURL())
          .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL(),
          });

        return interaction.reply({ embeds: [embed], ephemeral: true });
      } catch {
        return interaction.reply({
          content: `Sorry, I failed adding that role to ${member}!`,
          ephemeral: true,
        });
      }
    } else if (interaction.options._subcommand === "remove") {
      try {
        const member = interaction.guild.members.cache.get(
          interaction.options.get("user").value
        );
        const role = interaction.options.get("role").role;

        await member.roles.remove(role.id);
        const embed = new EmbedBuilder()
          .setTitle("Role Removed")
          .setDescription(`Successfully removed the role: ${role} from ${member}`)
          .setColor("Green")
          .setTimestamp()
          .setThumbnail(member.user.displayAvatarURL())
          .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL(),
          });

        return interaction.reply({ embeds: [embed], ephemeral: true });
      } catch {
        return interaction.reply({
          content: `Sorry, I failed removing that role from ${member}!`,
          ephemeral: true,
        });
      }
    }
  }
  },
};
