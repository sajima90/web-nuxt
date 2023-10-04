const { MessageEmbed } = require("discord.js");

const { readFileSync, writeFileSync } = require("fs");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
module.exports = {
    name: "config",
    category: "admin",
    permissions: ["ADMINISTRATOR"],
    ownerOnly: true,
    usage: "/maintenance <options>",
    examples: ["/maintenance"],
    description: "tkt c'est pas pour toi x)",
    run(client, message, args) {
        message.channel.send({ content: "Uniquement en slash" });
    },
    options: [
        {
            name: 'maintenance',
            description: 'Maintenance du serveur ?',
            type: 'BOOLEAN',
            required: false
        }, {
            name: 'crack',
            description: 'la connexion par crack ?',
            type: 'BOOLEAN',
            required: false
        }, {
            name: 'verif',
            description: 'Verification des fichiers ?',
            type: 'BOOLEAN',
            required: false
        }

        // ,{
        //     name: 'game_version',
        //     description: 'Version de minecraft ?',
        //     type: 'STRING',
        //     required: false
        // }
        // {
        //     name: "command",
        //     description: "Taper le nom du parametre",
        //     type: "STRING",
        //     required: false,
        //     autocomplete: true
        // },
        // {
        //     name: 'maintenance_message',
        //     description: 'Choisir un événement à emettre',
        //     type: 'STRING',
        //     required: false,
        //     choices: [
        //         {
        //             name: 'on',
        //             value: 'true'
        //         }, {
        //             name: 'off',
        //             value: 'false'
        //         }
        //     ]
        // }
    ],
    async runInteraction(client, interaction) {
        const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL);

        //co a la db
        const DBclient = new MongoClient(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await DBclient.connect().then(() => {
            console.log("- connecté à la base de données de la config");
        }).catch((err) => {
            console.log("Impossible de se connecter a la config" + err);
            DBclient.close();
        });
        const collection = DBclient.db("RedEarth").collection("config");
        const configColl = await collection.findOne({ _id: ObjectId('635402679c063d6cc66a1b29') });


        // console.log(interaction.options._hoistedOptions[0] == null)
        // send le config de la db
        if (interaction.options._hoistedOptions[0] == null) {
            const noArgsEmbed = new MessageEmbed()
                .setColor("#6e4aff")
                .addFields({
                    name: "Config : ",
                    value: `\`\`\`json\n${JSON.stringify(configColl, null, 2)}\`\`\``,
                    inline: true
                })
            return interaction.reply({ embeds: [noArgsEmbed], ephemeral: true });
        } else {
            interaction.reply({ content: "Changement effectué dans la base de donnée : (je ferais un embed plus tard x))" })
        }

        const maintenanceInteraction = interaction.options.getBoolean('maintenance');
        let oldmaintenance = configColl.maintenance;
        // console.log(`Ancien : ${oldmaintenance}`);
        // console.log(`New : ${maintenanceInteraction}`);
        //config

        //Maintenance
        if (maintenanceInteraction != null) {
            if (oldmaintenance == true && maintenanceInteraction == true && maintenanceInteraction == oldmaintenance) {
                await interaction.channel.send({ content: `\`\`La maintenance pour le launcher est deja activée\`\` '-'`, ephemeral: true });
            } else if (oldmaintenance == false && maintenanceInteraction == false) {
                await interaction.channel.send({ content: `\`\`La maintenance pour le launcher est deja désactivée\`\` '--`, ephemeral: true });
            } else if (!maintenanceInteraction == oldmaintenance && maintenanceInteraction == true) {
                collection.updateOne({ _id: ObjectId('635402679c063d6cc66a1b29') }, {
                    $set: { maintenance: maintenanceInteraction }
                }).then(async () => {
                    logChannel.send({ content: `> Maintenance : 🟢  Activé par ${interaction.user}! ` });
                    await interaction.channel.send({ content: `> La **maintenance** du launcher à été **activé**  🟢!`, ephemeral: true });
                });
            } else if (!maintenanceInteraction == oldmaintenance && maintenanceInteraction == false) {
                collection.updateOne({ _id: ObjectId('635402679c063d6cc66a1b29') }, {
                    $set: { maintenance: maintenanceInteraction }
                }).then(async () => {
                    await interaction.channel.send({ content: `> La **maintenance** du launcher à été **désactivé** 🔴!`, ephemeral: true });
                    logChannel.send({ content: `> Maintenance : 🔴  Désactivé par ${interaction.user}! ` });
                });
            } else {
                await interaction.channel.send({ content: `PROBLEME CONFIG`, ephemeral: true });
            }
        }


        //Crack
        const crackInteraction = interaction.options.getBoolean('crack');
        let oldCrack = !configColl.online;
        console.log(`Ancien : ${oldCrack}`);
        console.log(`New : ${crackInteraction}`);
        if (crackInteraction != null) {
            if (oldCrack == true && crackInteraction == true && crackInteraction == oldCrack) {
                await interaction.channel.send({ content: `\`\`Les cracks sont deja activé\`\` '-'`, ephemeral: true });
            } else if (oldCrack == false && crackInteraction == false) {
                await interaction.channel.send({ content: `\`\`Les cracks sont deja désactivé\`\` '--`, ephemeral: true });
            } else if (!crackInteraction == oldCrack && crackInteraction == true) {
                console.log(crackInteraction)
                collection.updateOne({ _id: ObjectId('635402679c063d6cc66a1b29') }, {
                    $set: { online: !crackInteraction }
                }).then(async () => {
                    await interaction.channel.send({ content: `> **Crack activé** 🟢!`, ephemeral: true });
                    logChannel.send({ content: `> Connexion par **Crack** : 🟢  Activé par ${interaction.user}! ` });
                });
            } else if (!crackInteraction == oldCrack && crackInteraction == false) {
                console.log(crackInteraction)

                collection.updateOne({ _id: ObjectId('635402679c063d6cc66a1b29') }, {
                    $set: { online: !crackInteraction }
                }).then(async () => {
                    await interaction.channel.send({ content: `> **Crack désactivé** 🔴!`, ephemeral: true });
                    logChannel.send({ content: `> Connexion par **Crack** : 🔴  Désactivé par ${interaction.user}! ` });
                });
            } else {
                await interaction.reply({ content: `PROBLEME CONFIG`, ephemeral: true });
            }
        }


        const verifyInteraction = interaction.options.getBoolean('verif');
        let oldverify = configColl.verify;
        // console.log(`Ancien : ${oldmaintenance}`);
        // console.log(`New : ${maintenanceInteraction}`);
        //config

        //Maintenance
        if (verifyInteraction != null) {
            if (oldverify == true && verifyInteraction == true && verifyInteraction == oldverify) {
                await interaction.channel.send({ content: `\`\`La verification des fichers pour le launcher est deja activée\`\` '-'`, ephemeral: true });
            } else if (oldverify == false && verifyInteraction == false) {
                await interaction.channel.send({ content: `\`\`La verification des fichers pour le launcher est deja désactivée\`\` '--`, ephemeral: true });
            } else if (!verifyInteraction == oldverify && verifyInteraction == true) {
                collection.updateOne({ _id: ObjectId('635402679c063d6cc66a1b29') }, {
                    $set: { verify: verifyInteraction }
                }).then(async () => {
                    logChannel.send({ content: `> verification : 🟢  Activé par ${interaction.user}! ` });
                    await interaction.channel.send({ content: `> La **verification** du launcher à été **activé**  🟢!`, ephemeral: true });
                });
            } else if (!verifyInteraction == oldverify && verifyInteraction == false) {
                collection.updateOne({ _id: ObjectId('635402679c063d6cc66a1b29') }, {
                    $set: { verify: verifyInteraction }
                }).then(async () => {
                    await interaction.channel.send({ content: `> La **verification** du launcher à été **désactivé** 🔴!`, ephemeral: true });
                    logChannel.send({ content: `> verification : 🔴  Désactivé par ${interaction.user}! ` });
                });
            } else {
                await interaction.channel.send({ content: `PROBLEME CONFIG`, ephemeral: true });
            }
        }


        // const game_versionInteraction = interaction.options.getBoolean('game_version');
        // let oldgame_version = configColl.game_version;
        // // console.log(`Ancien : ${oldgame_version}`);
        // // console.log(`New : ${game_versionInteraction}`);
        // //config

        // //game_version
        // if (game_versionInteraction != null) {
        //     if (oldgame_version == true && game_versionInteraction == true && game_versionInteraction == oldgame_version) {
        //         await interaction.channel.send({ content: `\`\`La verification des fichers pour le launcher est deja activée\`\` '-'`, ephemeral: true });
        //     } else if (oldgame_version == false && game_versionInteraction == false) {
        //         await interaction.channel.send({ content: `\`\`La verification des fichers pour le launcher est deja désactivée\`\` '--`, ephemeral: true });
        //     } else if (!game_versionInteraction == oldgame_version && game_versionInteraction == true) {
        //         collection.updateOne({ _id: ObjectId('635402679c063d6cc66a1b29') }, {
        //             $set: { game_version: game_versionInteraction }
        //         }).then(async () => {
        //             logChannel.send({ content: `> verification : 🟢  Activé par ${interaction.user}! ` });
        //             await interaction.channel.send({ content: `> La **verification** du launcher à été **activé**  🟢!`, ephemeral: true });
        //         });
        //     } else if (!game_versionInteraction == oldgame_version && game_versionInteraction == false) {
        //         collection.updateOne({ _id: ObjectId('635402679c063d6cc66a1b29') }, {
        //             $set: { game_version: game_versionInteraction }
        //         }).then(async () => {
        //             await interaction.channel.send({ content: `> La **verification** du launcher à été **désactivé** 🔴!`, ephemeral: true });
        //             logChannel.send({ content: `> verification : 🔴  Désactivé par ${interaction.user}! ` });
        //         });
        //     } else {
        //         await interaction.channel.send({ content: `PROBLEME CONFIG`, ephemeral: true });
        //     }
        // }


    },
    async runAutocomplete(client, interaction) {
        // const focusedOption = interaction.options.getFocused(true);
        // const choices = client.commands?.map(cmd => cmd.name);
        // if (!choices) return;
        // const filtered = choices.filter(choice => choice.includes(focusedOption.value.toLowerCase()));
        // const filteredLimit = filtered.slice(0, 15);
        // await interaction.respond(filteredLimit.map(choice => ({ name: choice, value: choice })));
    }
}





/*await DBclient.connect().then(() => {
        console.log("- connecté à la base de données de la config");
    }).catch((err) => {
        console.log("Impossible de se connecter a la config");
        DBclient.close();
    });
    const collection = DBclient.db("RedEarth").collection("config");

    //config
    const configColl = await collection.findOne({ _id: ObjectId('635402679c063d6cc66a1b29') });

    let oldmaintenance = configColl.maintenance;

    configColl.maintenance = oldmaintenance ? false : true;

    console.log(configColl.maintenance);

    console.log(oldmaintenance + " => " + configColl.maintenance);

    const updateColl = collection.updateOne({ _id: ObjectId('635402679c063d6cc66a1b29') }, {
        $set: { maintenance: configColl.maintenance }
    });
    console.log(await updateColl); // log channel*/
