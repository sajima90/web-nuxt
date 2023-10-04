const { MessageEmbed } = require("discord.js");


module.exports = {
    name: "userinfo",
    type : "USER",
    category: "users",
    permissions: ["SEND_MESSAGES"],
    ownerOnly: false,
    usage: "Sur le profil utilisateur",
    examples: ["ping"],
    async runInteraction(client, interaction) {
        const member = await interaction.guild.members.fetch(interaction.targetId);

        const embed = new MessageEmbed()
            .setAuthor({ name: `${member.user.tag} (${member.id})`, iconURL: member.user.bot ? '' : '' })
            .setColor('#00a3b5')
            .setImage(member.user.displayAvatarURL())
            .setFields(
                { name: 'Nom', value: `${member.displayName}`, inline: true },
                { name: 'Modérateur', value: `${member.kickable ? '🔴' : '🟢'}`, inline: true },
                { name: 'Bot', value: `${member.user.bot ? '🟢' : '🔴'}`, inline: true },
                { name: 'Roles', value: `${member.roles.cache.map(role => role).join(' | ').replace('| @everyone', ' ')}`, inline: false },
                { name: 'A créé son compte le ', value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)`, inline: false },
                { name: 'A rejoint le serveur le ', value: `<t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)`, inline: true }
            )

            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            });

        interaction.reply({ content: " ", embeds: [embed], ephemereal: true });
    }
}