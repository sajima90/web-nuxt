const { MessageEmbed } = require("discord.js");


module.exports = {
    name: "emit",
    category: "admin",
    permissions: ["ADMINISTRATOR"],
    ownerOnly: true,
    usage: "emit",
    examples: ["emit"],
    description: "Emmettre un événement au choix !",
    async run(client, message, args) {
        if (!args[0] || !args[0].match(/^(guildMemberAdd|guildMemberRemove|guildCreate)$/)) return message.reply('Merci d\'entrer un événement valide (\`guildMemberAdd\`/\`guildMemberRemove\`/\`guildCreate\`)');
        if (args[0] == 'guildMemberAdd') {
            client.emit('guildMemberAdd', message.member);
            message.reply('Event guildMemberAdd émit !');
        } else if (args[0] == 'guildCreate') {
            client.emit('guildCreate', message.guild);
            message.reply('Event guildCreate émit !');
        } else if (args[0] == 'guildMemberRemove') {
            client.emit('guildMemberRemove', message.member);
            message.reply('Event guildMemberRemove émit !');
        }
    },
    options: [
        {
            name: 'event',
            description: 'Choisir un événement à emettre',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'guildMemberAdd',
                    value: 'guildMemberAdd'
                }, {
                    name: 'guildMemberRemove',
                    value: 'guildMemberRemove'
                }, {
                    name: 'guildCreate',
                    value: 'guildCreate'
                }
            ]
        }
    ],
    async runInteraction(client, interaction) {
        const evtChoices = interaction.options.getString('event');

        if (evtChoices == 'guildMemberAdd') {
            client.emit('guildMemberAdd', interaction.member);
            interaction.reply({ content: 'Event guildMemberAdd émit !', ephemereal: true });
        } else if (evtChoices == 'guildCreate') {
            client.emit('guildCreate', interaction.guild);
            interaction.reply({ content: 'Event guildCreate émit !', ephemereal: true });
        } else {
            client.emit('guildMemberRemove', interaction.member);
            interaction.reply({ content: 'Event guildMemberRemove émit !', ephemereal: true });
        }

    }
}