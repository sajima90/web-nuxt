const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");
const { News } = require('../../models/index')
module.exports = {
    name: "news",
    category: "admin",
    permissions: ["ADMINISTRATOR"],
    ownerOnly: true,
    usage: "/news <options>",
    examples: ["/news"],
    description: "tkt c'est pas pour toi x)",
    run(client, message, args) {
        message.channel.send({ content: "Uniquement en slash" });
    },
    options: [
        {
            name: 'titre',
            description: 'Maintenance du serveur ?',
            type: 'STRING',
            required: true
        },
        {
            name: 'content',
            description: 'la connexion par crack ?',
            type: 'STRING',
            required: true
        }
    ],
    async runInteraction(client, interaction) {
        const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL);

        //co a la db
        await mongoose.connect(process.env.DATABASE_URI, {
            autoIndex: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
        }).then(() => {
            console.log("- connecté à la base de données");
        }).catch((err) => {
            console.log(err);
        });
        const getIDNews = await News.findOne().count() + 1
        // console.log(getIDNews)
        const newNews = new News({
            id: getIDNews,
            title: interaction.options.getString("titre"),
            content: interaction.options.getString("content"),
            author: interaction.user.username,
        })

        const EmbedCreate = new MessageEmbed()
            .setColor("#6e4aff")
            .addFields({
                name: "News ajouté : ",
                value: `\`\`\`json\n${await newNews.save()}\`\`\``,
                inline: true
            })
            .setTimestamp()
            .setFooter({ text: `Nouvelle News crée par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        interaction.reply({ embeds: [EmbedCreate], ephemeral: true });
        logChannel.send({ embeds: [EmbedCreate], ephemeral: true });
        
    }
}