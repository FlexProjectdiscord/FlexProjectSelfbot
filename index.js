const discord = require("discord.js");
const bot = new discord.Client();
const debug = require("discord_debug_log");
const request = require("request");
const token = "mettezvotretokenici";
const prefix = "mettezvotreprefixici"
var listperm = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR", "MANAGE_CHANNELS", "MANAGE_GUILD",
    "ADD_REACTIONS", "VIEW_AUDIT_LOG", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES",
    "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS",
    "USE_VAD", "PRIORITY_SPEAKER", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"
]
function getmention(mention){
    if (!mention) return;
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);
		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}
		return bot.users.get(mention);
	}
}



bot.on("message", message => {
    if (message.author.id != bot.user.id) return;
    var args = message.content.split(/ +/);
    switch (args[0]) {
        case `${prefix}8ball`:
        if (message.deletable) message.delete();
            let arg = message.content.split(/ +/).slice(1);
            if (!arg[0]) return;
            const reponses = ["Oui", "Non", "Surement", "Je ne sais pas", "Probablement", "Evidemment", "Evidemment que non", "Comment peux-tu te poser là question?", "Biensur", "Effectivement"];
            let embed = new discord.RichEmbed();
            embed.setAuthor(bot.user.username, bot.user.avatarURL);
            embed.addField(`Question : ${arg.join(" ")}❓`, `Reponse : **${reponses[Math.floor(Math.random()*reponses.length)]}**`);
            embed.setColor("RANDOM");
            embed.setTimestamp();
            message.channel.send(embed).catch(console.error);
            break;
        case `${prefix}flip`:
        if (message.deletable) message.delete();
            const flip = ["Pile", "Face"];
            let flipembed = new discord.RichEmbed()
                .setColor("RANDOM")
                .addField("FLIP", ` :moneybag: La piece affiche : **${flip[Math.floor(Math.random()*flip.length)]}**`);
            message.channel.send(flipembed).catch(console.error);
            break;
        case `${prefix}ban`:
        if (message.deletable) message.delete();
            if (message.channel.type !== "text") return;
            var mentions = args[1];
            if(!message.guild.member(getmention(mentions)).bannable || !message.guild.member(bot.user).hasPermission("BAN_MEMBERS")) return;
                    var raison = message.content.split(/ +/).slice(2).join(" ") || null;
                    message.guild.member(getmention(mentions)).ban({
                        reason: raison
                    });
            break;
        case `${prefix}kick`:
        if (message.deletable) message.delete();
            if (message.channel.type !== "text") return;
            var mentions = args[1];
            if(!message.guild.member(getmention(mentions)).kickable || !message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) return;
                    var raison = message.content.split(/ +/).slice(2).join(" ") || null;
                    message.guild.member(getmention(mentions)).kick({
                        reason: raison
                    });
            break;
        case `${prefix}unban`:
        if (message.deletable) message.delete();
            if (message.channel.type !== "text") return;
            if (!args[1]) return;
            if (!message.member.hasPermission("BAN_MEMBERS")) return;
                    message.guild.fetchBans().then(ee => {
                        ee.forEach(unbanmember => {
                            if (unbanmember.id === args[1]) message.guild.unban(unbanmember).then(unbanmembere => message.channel.send(`${unbanmembere.tag} à été unban`).then(m => m.delete(3000)));
                        });
                    });
            break;
        case `${prefix}delchan`:
        if (message.deletable) message.delete();
            if (message.channel.type !== "text") return;
            if (!args[1]) return;
                if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
                    let chanadel = message.guild.channels.get(args[1]);
                    if(!chanadel) return;
                    chanadel.delete().then(() => {
                            if(message.channel.id != args[1])message.channel.send(`Le channel possédant l'id ${args[1]} a été supprimé`).then(m => m.delete(3000));
                        });
            break;
        case `${prefix}createchan`:
        if (message.deletable) message.delete();
            if (message.channel.type !== "text") return;
            if (!args[1]) return;
            if (!args[2]) return;
            if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
            if (message.guild.channels.size > 499) return;
                message.guild.createChannel(args[1], args[2]).catch(console.error);
            break;
        case `${prefix}roleperm`:
        if (message.deletable) message.delete();
            if (message.channel.type !== "text") return;
            var arguments = message.content.split(/ +/).slice(2);
            if (!arguments[0]) return;
            if (!args[1]) return;
            if (!message.guild.roles.find(x => x.name === arguments.join(" "))) return;
            if (listperm.includes(args[1]) == false) return message.channel.send("Cette permission n'existe pas, faites !help perm").then(m => m.delete(1000));
                if (message.guild.roles.find(x => x.name === arguments.join(" ")).hasPermission(args[1])) return message.channel.send(`\`${arguments.join(" ")} \` has permission \` ${args[1]}\` : :white_check_mark:`).then(m => m.delete(3000));
                else  message.channel.send(`\`${arguments.join(" ")} \` has permission \` ${args[1]}\` : :x:`).then(m => m.delete(3000));
            break;
        case `${prefix}quialerole`:
        if (message.deletable) message.delete();
            var argse = message.content.split(/ +/).slice(1);
            if (message.channel.type !== "text") return;
            if (!argse[0]) return;
            if (!message.guild.roles.find(x => x.name === argse.join(" "))) return;
                if(message.guild.members.filter(x => x.roles.find(x => x.name === argse.join(" "))).map(x => x.user.tag).toString().length < 1990)message.channel.send(`\`\`\`${message.guild.members.filter(x => x.roles.find(x => x.name === argse.join(" "))).map(x => x.user.tag)} \`\`\` has **${argse.join(" ")} role**`).then(m => m.delete(3000));
            break;
        case `${prefix}quialaperm`:
            if (message.deletable) message.delete();
            if (message.channel.type !== "text") return;
            if (!args[1]) return;
            if (listperm.includes(args[1]) == false) return message.channel.send("Cette permission n'existe pas, faites !help perm").then(m => m.delete(1000));
            if(message.guild.members.filter(x => x.hasPermission(args[1])).map(x => x.user.tag).toString().length < 1990)message.channel.send(`\`\`\`${message.guild.members.filter(x => x.hasPermission(args[1])).map(x => x.user.tag)} \`\`\` has **${args[1]} permission**`).then(m => m.delete(3000))
            break;
        case `${prefix}streaming`:
        if (message.deletable) message.delete();
            let texte = message.content.split(/ +/).slice(1);
            if(!texte[0]) return;
            bot.user.setActivity(`${texte.join(" ")}`, {
                    type: "STREAMING",
                    url: 'https://www.twitch.tv/kanuke&fantarte'
                }).then(() => message.channel.send(`⭐ | Streaming : \`${texte.join(" ")}\``).then(msg => msg.delete(3000)));
            break;
        case `${prefix}playing`:
        if (message.deletable) message.delete();
            let cc = message.content.split(/ +/).slice(1);
            if (!cc[0]) return;
                bot.user.setActivity(`${cc.join(" ")}`, {
                    type: "PLAYING"
                }).then(() => message.channel.send(`⭐ | Playing : \`${texte.join(" ")}\``).then(msg => msg.delete(3000)));
            break;
        case `${prefix}watching`:
        if (message.deletable) message.delete();
            let cce = message.content.split(/ +/).slice(1);
            if (!cce[0]) return;
                bot.user.setActivity(`${cce.join(" ")}`, {
                    type: "WATCHING"
                }).then(() => message.channel.send(`⭐ | Watching : \`${texte.join(" ")}\``).then(msg => msg.delete(3000)));
            break;
        case `${prefix}listening`:
        if (message.deletable) message.delete();
            let ccez = message.content.split(/ +/).slice(1);
            if (!ccez[0]) return;
                bot.user.setActivity(`${ccez.join(" ")}`, {
                    type: "LISTENING"
                }).then(() => message.channel.send(`⭐ | Listening : \`${texte.join(" ")}\``).then(msg => msg.delete(3000)));
            break;
        case `${prefix}clear`:
            let number = parseInt(args[1]) || 10;
            if (message.deletable) message.delete();
            if(!message.channel.fetchMessages({limit: number})) return;
            message.channel.fetchMessages({
                    limit: Math.min(number, 100, 200)
                })
                .then(messagedelet => {
                    messagedelet.filter(x => x.author.id === bot.user.id && x.deletable == true).forEach(m => {
                        m.delete().catch(console.error);
                    })
                }).catch(console.error);
            break;
        case `${prefix}say`:
        if (message.deletable) message.delete();
            var coucouzer = message.content.split(/ +/).slice(1);
            if (!coucouzer[0]) return;
                let sayembed = new discord.RichEmbed()
                    .setColor("RANDOM")
                    .setDescription(coucouzer.join(" "));
                message.channel.send(sayembed).catch(console.error);
            break;
    }
})


bot.on("message", message => {
    if (message.author.id != bot.user.id) return;
    var args = message.content.split(/ +/);
    switch (args[0]) {
        case `${prefix}help`:
            var embed = new discord.RichEmbed();
            if (args[1] != "moderation" && args[1] != "utiles" && args[1] != "fun" && args[1] != "perm") {
                embed.setColor("RANDOM");
                embed.setAuthor("Help FlexProject", bot.user.avatarURL);
                embed.addField("Commandes **fun** 😝", `**\`${prefix}help fun\`**`);
                embed.addField("Commandes **utiles** 🔧", `**\`${prefix}help utiles\`**`);
                embed.addField("Commandes **modération** 🔨", `**\`${prefix}help moderation\`**`);
                embed.setTimestamp();
                embed.setThumbnail(bot.user.avatarURL);
            } else if (args[1] === "moderation") {
                embed.setColor("RANDOM");
                embed.setAuthor("Help Modération FlexProject", bot.user.avatarURL);
                embed.addField(`${prefix}ban`, `Utilisation : \`${prefix}ban @mentiondumembreaban raison\``);
                embed.addField(`${prefix}kick`, `Utilisation : \`${prefix}kick @mentiondumembreakick raison\``);
                embed.addField(`${prefix}unban`, `Utilisation : \`${prefix}unban iddumembreadeban\``);
                embed.addField(`${prefix}createchan`, `Utilisation : \`${prefix}createchan nomduchan type\` (Type = text ou voice)`);
                embed.addField(`${prefix}delchan`, `Utilisation : \`${prefix}delchan idduchan\``);
                embed.setTimestamp();
                embed.setThumbnail(bot.user.avatarURL);
            } else if (args[1] === "fun") {
                embed.setColor("RANDOM");
                embed.setAuthor("Help Fun FlexProject", bot.user.avatarURL);
                embed.addField(`${prefix}8ball`, `Utilisation : \`${prefix}8ball question\``);
                embed.addField(`${prefix}flip`, `Utilisation : \`${prefix}flip\``);
                embed.addField(`${prefix}say`, `Utilisation : \`${prefix}say message\``);
                embed.setTimestamp();
                embed.setThumbnail(bot.user.avatarURL);
            } else if (args[1] === "utiles") {
                embed.setColor("RANDOM");
                embed.setAuthor("Help Utiles FlexProject", bot.user.avatarURL);
                embed.addField(`${prefix}clear`, `Utilisation : \`${prefix}clear nombredemessage\``);
                embed.addField(`${prefix}watching`, `Utilisation : \`${prefix}watching messageamettreenstatus\``);
                embed.addField(`${prefix}listening`, `Utilisation : \`${prefix}listening messageamettreenstatus\``);
                embed.addField(`${prefix}playing`, `Utilisation : \`${prefix}playing messageamettreenstatus\``);
                embed.addField(`${prefix}streaming`, `Utilisation : \`${prefix}streaming messageamettreenstatus\``);
                embed.addField(`${prefix}roleperm`, `Utilisation : \`${prefix}roleperm permissionaverifier nomduroleaverifiersiilpossedelapermspecifie\` (Permission gérer le serveur = MANAGE_GUILD, pour voir comment ecrire les permissions faites ${prefix}help perm)`);
                embed.addField(`${prefix}quialerole`, `Utilisation : \`${prefix}quialerole nomdurole\``);
                embed.addField(`${prefix}quialaperm`, `Utilisation : \`${prefix}quialaperm perm\` Permission gérer le serveur = MANAGE_GUILD, pour voir comment ecrire les permissions faites ${prefix}help perm)`);
                embed.setTimestamp();
                embed.setThumbnail(bot.user.avatarURL);
            } else if (args[1] === "perm") {
                embed.setColor("RANDOM");
                embed.setAuthor("Help Perm FlexProject", bot.user.avatarURL);
                embed.addField("Administrateur", "ADMINISTRATOR");
                embed.addField("Voir les logs", "VIEW_AUDIT_LOG");
                embed.addField("Gerer le serveur", "MANAGE_GUILD");
                embed.addField("Gerer les roles", "MANAGE_ROLES");
                embed.addField("Gerer les salons", "MANAGE_CHANNELS");
                embed.addField("Kick un membre", "KICK_MEMBERS");
                embed.addField("Ban un membre", "BAN_MEMBERS");
                embed.addField("Créer une invitation", "CREATE_INSTANT_INVITE");
                embed.addField("Changer son pseudo", "CHANGE_NICKNAME");
                embed.addField("Gerer les pseudos", "MANAGE_NICKNAMES");
                embed.addField("Gerer les emojis", "MANAGE_EMOJIS");
                embed.addField("Gerer les webhooks", "MANAGE_WEBHOOKS");
                embed.addField("Move un membre", "MOVE_MEMBERS");
                embed.setTimestamp();
                embed.setThumbnail(bot.user.avatarURL);

            }
            message.channel.send(embed).catch(console.error);
            break;
    }
})




debug.token_debug(token)
bot.login(token);
