const { MessageEmbed } = require("discord.js");


const File = ("./web/config/launcher/config-launcher/config.json");

module.exports = {
    name: "clear",
    category: "admin",
    permissions: ["ADMINISTRATOR"],
    ownerOnly: false,
    usage: "clear",
    examples: ["clear"],
    description: "Clear les messages dans le salon",
    options: [
        {
            name: 'nombre',
            description: 'Le nombre de message a supprimer',
            type: 'NUMBER',
            required: true,
        }, {
            name: 'cible',
            description: 'La cible du clear',
            type: 'USER',
            required: false,
        }
    ],
    run(client, message, args) {

    },
    async runInteraction(client, interaction) {
        const Nombre = interaction.options.getNumber("nombre");
        const Cible = interaction.options.getMember("cible");

        const Messages = await interaction.channel.messages.fetch();

        const Reponse = new MessageEmbed()
            .setColor("AQUA")

        let filtered = [];
        if (Cible) {
            let i = 0;
            (await Messages).filter((m) => {
                if (m.author.id === Cible.id && Nombre > i) {
                    filtered.push(m);
                    i++;
                }
            })
            await interaction.channel.bulkDelete(filtered, true).then(messages => {
                Reponse.setDescription(`Clear de **${messages.size} messages ** de ${Cible}`);
                interaction.reply({ embeds: [Reponse], fetchReply: true });
            })
        } else  {
            let i = 0;
            (await Messages).filter((m) => {
                if (Nombre > i) {
                    filtered.push(m);
                    i++;
                }
            })
            await interaction.channel.bulkDelete(filtered, true).then(messages => {
                Reponse.setDescription(`Clear de **${messages.size}** messages du salon`);
                interaction.reply({ embeds: [Reponse], fetchReply: true });
            })
        } 
    }

}