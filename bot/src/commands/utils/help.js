const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const commandFolder = readdirSync("./bot/src/commands");


const prefix = process.env.PREFIX;
const contextDescription = {
  userinfo: "Renvoie des informations sur l'utilisateur",
};
module.exports = {
  name: "help",
  category: "utils",
  permissions: ["SEND_MESSAGES"],
  ownerOnly: false,
  usage: "help <command>",
  examples: ["help", "help ping", "help emit"],
  description: "Renvoie une liste de commande filtrée par catégorie!",
  async run(client, message, args) {

    if (!args.length) {
      const noArgsEmbed = new MessageEmbed()
        .setColor("#6e4aff")
        .addField(
          "Liste des commandes",
          `Une liste de toutes les catégories disponibles et leurs commandes.\nPour plus d'informations sur une commande, tapez \`${prefix}help <command>\``
        );

      for (const category of commandFolder) {
        noArgsEmbed.addField(
          `${category.replace(/(^\w|\s\w)/g, (firstLetter) =>
            firstLetter.toUpperCase()
          )}`,
          `\`${client.commands
            .filter(cmd => cmd.category == category.toLowerCase())
            .map(cmd => cmd.name)
            .join(", ")}\``
        );
      }

      return message.channel.send({ embeds: [noArgsEmbed] });
    }

    const cmd = client.commands.get(args[0]);
    if (!cmd) return message.reply(`Aucune informations trouvées pour la commande : __${args[0]}__\nVerifier la syntaxe!`);

    const embedInfoCommand = new MessageEmbed()
      .setTitle(`Informations sur la commande => **${cmd.name}** ${cmd.ownerOnly ? "/!\\ Uniquement Pour les admins du bot /!\\" : ""}`)
      .setDescription(`Description :\n${cmd.description ? cmd.description : contextDescription[`${cmd.name}`]}`)
      .setFields(
        {
          name: "Utilisation",
          value: `\`\`\`${cmd.description ? `${prefix}${cmd.usage}\`\`\`` : "La commande s'execute via le profil de l'utilisateur"}`,
          inline: true,
        },
        {
          name: "Exemples",
          value: `\`\`\`${cmd.description ? `${prefix}${cmd.examples.join(` | ${prefix}`)}` : "Aucun"}\`\`\``,
          inline: false,
        },
        {
          name: "Permissions",
          value: `\`\`\`${cmd.permissions.join(", ")}\`\`\``,
          inline: false,
        },
        {
          name: "Utilisation : ", value: `
          Vous pouvez aussi utiliser les slash commands => \`/ping\`
          \`${prefix}\` = prefix utilisé => \`!ping\`
          Ne pas inclure ces caractères -> {}, [] et <> dans vos commandes.
        `, inline: false
        }
      )
      .setColor("#f00020")
      .setTimestamp()
      .setFooter({
        text: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      });

    return message.reply({ embeds: [embedInfoCommand] });



  },
  options: [
    {
      name: "command",
      description: "Taper le nom de votre commande",
      type: "STRING",
      required: false,
      autocomplete: true
    },
  ],
  async runInteraction(client, interaction) {
    const prefix = "/";
    const cmdName = interaction.options.getString("command");

    if (!cmdName) {
      const noArgsEmbed = new MessageEmbed()
        .setColor("#6e4aff")
        .addFields({
          name: "Liste des commandes",
          value: `Une liste de toutes les catégories disponibles et leurs commandes.\nPour plus d'informations sur une commande, tapez \`${prefix}help <command>\``,
          inline: true
        });

      for (const category of commandFolder) {
        noArgsEmbed.addFields({
          name: `${category.replace(/(^\w|\s\w)/g, (firstLetter) =>
            firstLetter.toUpperCase()
          )}`,
          value: `\`${client.commands
            .filter((cmd) => cmd.category == category.toLowerCase())
            .map((cmd) => cmd.name)
            .join(", ")}\``,
          inline: false
        });
      }

      return interaction.reply({ embeds: [noArgsEmbed], ephemeral: false });
    }

    const cmd = client.commands.get(cmdName);
    if (!cmd)
      return interaction.reply({
        content: "cette commande n'existe pas!",
        ephemeral: true,
      });


    const embedInfoCommand = new MessageEmbed()
      .setTitle(`Informations sur la commande => **${cmd.name}** ${cmd.ownerOnly ? "/!\\ Uniquement Pour les admins du bot /!\\" : ""}`)
      .setDescription(`Description :\n${cmd.description ? cmd.description : contextDescription[`${cmd.name}`]}`)
      .setFields(
        {
          name: "Utilisation",
          value: `\`\`\`${cmd.description ? `${prefix}${cmd.usage}\`\`\`` : "La commande s'execute via le profil de l'utilisateur"}`,
          inline: true,
        },
        {
          name: "Exemples",
          value: `\`\`\`${cmd.description ? `${prefix}${cmd.examples.join(` | ${prefix}`)}` : "Aucun"}\`\`\``,
          inline: false,
        },
        {
          name: "Permissions",
          value: `\`\`\`${cmd.permissions.join(", ")}\`\`\``,
          inline: false,
        },
        {
          name: "Utilisation : ", value: `
          Vous pouvez aussi utiliser les slash commands => \`/ping\`
          \`${prefix}\` = prefix utilisé => \`!ping\`
          Ne pas inclure ces caractères -> {}, [] et <> dans vos commandes.
        `, inline: false
        }
      )
      .setColor("#f00020")
      .setTimestamp()
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      });

    return interaction.reply({ content: " ", embeds: [embedInfoCommand], ephemeral: false });

  },
  async runAutocomplete(client, interaction) {
    const focusedOption = interaction.options.getFocused(true);
    const choices = client.commands?.map(cmd => cmd.name);
    if (!choices) return;
    const filtered = choices.filter(choice => choice.includes(focusedOption.value.toLowerCase()));
    const filteredLimit = filtered.slice(0, 15);
    await interaction.respond(filteredLimit.map(choice => ({ name: choice, value: choice })));
  }
};
