const { MessageEmbed } = require("discord.js");


module.exports = {
    name: "sond",
    category: "utils",
    permissions: ["SEND_MESSAGES"],
    ownerOnly: false,
    usage: "sond",
    examples: ["sond"],
    description: "Faire un sondage !",
    async run(client, message, args) {
        message.reply("Uniquement en Slash Command")

    },
    options: [
        {
            name: 'titre',
            description: 'Taper le titre de votre sondage',
            type: 'STRING',
            required: true,
        }, {
            name: 'contenu',
            description: 'Taper la question de votre sondage',
            type: 'STRING',
            required: true,
        }
    ],
    async runInteraction(client, interaction) {
        const pollTitle = interaction.options.getString('titre');
        const pollContent = interaction.options.getString('contenu');

        const embed = new MessageEmbed()
        .setTitle(pollTitle)
        .setColor('#00a3b5')
        .setDescription(pollContent)
        .setTimestamp()
        .setFooter({text: `Nouveau sondage crée par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL()})
        const poll = await interaction.reply({ embeds: [embed], fetchReply: true });
        poll.react('✅');
        poll.react('❌');
    }
}