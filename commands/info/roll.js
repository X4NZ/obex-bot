module.exports = {
  name: "roll",
  description: "Check bot's ping.",
  cooldown: 3000,
  userPerms: [],
  botPerms: [],
  run: async (client, message, args) => {
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
    message.delete();
    message.channel.send({
      content: `**${message.author.username}** rolled ${getRandomInt(1, 6)}`,
    });
  },
};
