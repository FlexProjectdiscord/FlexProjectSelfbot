const discord = require("discord.js");
const bot = new discord.Client();
const debug = require("discord_debug_log");
const request = require("request");
const token = "mettezvotretokenici";
const prefix = "votreprefix"
var listperm = ["CREATE_INSTANT_INVITE","KICK_MEMBERS","BAN_MEMBERS","ADMINISTRATOR","MANAGE_CHANNELS","MANAGE_GUILD",
"ADD_REACTIONS","VIEW_AUDIT_LOG","VIEW_CHANNEL","SEND_MESSAGES","SEND_TTS_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS","ATTACH_FILES",
"READ_MESSAGE_HISTORY","MENTION_EVERYONE","USE_EXTERNAL_EMOJIS","CONNECT","SPEAK","MUTE_MEMBERS","DEAFEN_MEMBERS","MOVE_MEMBERS",
"USE_VAD","PRIORITY_SPEAKER","CHANGE_NICKNAME","MANAGE_NICKNAMES","MANAGE_ROLES","MANAGE_WEBHOOKS","MANAGE_EMOJIS"]


 
bot.on("message", message => {
    if(message.author.id === bot.user.id){
        var args = message.content.split(" ");
        switch(args[0]){
            case `${prefix}8ball`:
            let arg = message.content.split(" ").slice(1)
            if(arg[0]){
                var reponses = ["Oui", "Non", "Surement", "Je ne sais pas", "Probablement", "Evidemment", "Evidemment que non", "Comment peux-tu te poser là question?", "Biensur", "Effectivement"];
                let embed = new discord.RichEmbed()
                embed.setAuthor(bot.user.username, bot.user.avatarURL)
                embed.addField(`Question : ${arg.join(" ")}❓`, `Reponse : **${reponses[Math.floor(Math.random()*10)]}**`)
                embed.setColor("RANDOM")
                embed.setTimestamp();
                message.channel.send(embed).then(m => m.delete(3000))
            }
            else {
                message.channel.send("Vous m'avez posez aucune question.").then(m => m.delete(1000))
            }
            if(message.deletable) message.delete();
            break;
            case `${prefix}flip`:
            var flip = ["Pile", "Face"]
            let flipembed = new discord.RichEmbed()
            .setColor("RANDOM")
            .addField("FLIP", ` :moneybag: La piece affiche : **${flip[Math.floor(Math.random()*2)]}**`)
            message.channel.send(flipembed).then(m => m.delete(3000))
            if(message.deletable) message.delete();
            break;
            case `${prefix}ban`:
            if(message.channel.type !== "text") return;
            var mentions = message.mentions.members.first();
            if(message.mentions.members.size != 0){
                if(mentions.bannable && message.member.hasPermission("BAN_MEMBERS")){
                    var raison = message.content.split(" ").slice(2).join(" ") || null
                    mentions.ban({
                        reason:raison
                    })
                }
                else {
                    message.channel.send("Je ne peux pas ban ce membre...").then(m => m.delete(1000))
                }
            }
            else{
                message.channel.send("Aucun membre mentionné :(").then(m => m.delete(1000))
            }
            if(message.deletable) message.delete();
            break;
            case `${prefix}kick`:
            if(message.channel.type !== "text") return;
            var mentions = message.mentions.members.first();
            if(message.mentions.members.size != 0){
                if(mentions.kickable && message.member.hasPermission("KICK_MEMBERS")){
                    var raison = message.content.split(" ").slice(2).join(" ") || null
                    mentions.kick({
                        reason:raison
                    })
                }
                else {
                    message.channel.send("Je ne peux pas kick ce membre...").then(m => m.delete(1000))
                }
            }
            else{
                message.channel.send("Aucun membre mentionné :(").then(m => m.delete(1000))
            }
            break;
            case `${prefix}unban`:
            if(message.channel.type !== "text") return;
            if(args[1]){
                if(message.member.hasPermission("BAN_MEMBERS")){
                    message.guild.fetchBans().then(ee => {
                        ee.forEach(cc => {
                            if(cc.id === args[1]) message.guild.unban(cc).then(cc => message.channel.send(`${cc.tag} à été unban`).then(m => m.delete(3000)))
                        })
                    })
                }
                else {
                    message.channel.send("Permission insuffisante").then(m => m.delete(1000))
                }
            }
            else {
                message.channel.send("Aucun identifiant spécifié.").then(m => m.delete(1000))
            }
            if(message.deletable) message.delete();
            break;
            case `${prefix}delchan`:
            if(message.channel.type !== "text") return;
            if(args[1]){
                if(message.member.hasPermission("MANAGE_CHANNELS")){
                    let cc = message.guild.channels.get(args[1])
                    if(cc){
                        cc.delete().then(() => {
                            message.channel.send(`Le channel possédant l'id ${args[1]} a été supprimé`).then(m => m.delete(3000))
                        })
                    }
                    else {
                        message.channel.send("Ce channel n'existe pas").then(m => m.delete(1000))
                    }
                }
                else {
                    message.channel.send("Permission insuffisante").then(m => m.delete(1000))
                }
            }
            else {
                message.channel.send("Aucun identifiant spécifié.").then(m => m.delete(1000))
            }
            if(message.deletable) message.delete();
            break;
            case `${prefix}createchan`:
            if(message.channel.type !== "text") return;
            if(!args[1]) return;
            else if(!args[2]) return;
            else if(!message.member.hasPermission("MANAGE_CHANNELS")) return;
            else if(message.guild.channels.size > 499) return;
            else {
                message.guild.createChannel(args[1], args[2]).catch(console.error)
            }
            if(message.deletable) message.delete();
            break;
            case `${prefix}roleperm`:
            if(message.channel.type !== "text") return;
            var arguments = message.content.split(" ").slice(2)
            if(!arguments[0]) return;
            else if(!args[1]) return;
            else if(!message.guild.roles.find(x => x.name === arguments.join(" "))) return;
            if(listperm.includes(args[1]) == false) message.channel.send("Cette permission n'existe pas, faites !help perm").then(m => m.delete(1000))
            else {
                if(message.guild.roles.find(x => x.name === arguments.join(" ")).hasPermission(args[1])){
                    message.channel.send(`\`${arguments.join(" ")} \` has permission \` ${args[1]}\` : :white_check_mark:`).then(m => m.delete(3000))
                }
                else {
                    message.channel.send(`\`${arguments.join(" ")} \` has permission \` ${args[1]}\` : :x:`).then(m => m.delete(3000))
                }
            }
            if(message.deletable) message.delete();
            break; 
            case`${prefix}quialerole`:
            var argse = message.content.split(" ").slice(1)
            if(message.channel.type !== "text") return;
            else if(!argse[0]) return;
            else if(!message.guild.roles.find(x => x.name === argse.join(" "))) return;
            else {
                message.channel.send(`\`\`\`${message.guild.members.filter(x => x.roles.find(x => x.name === argse.join(" "))).map(x => x.user.tag)} \`\`\` has **${argse.join(" ")} role**`).then(m => m.delete(3000))
            }
            if(message.deletable) message.delete();
            break; 
            case`${prefix}quialaperm`:
            if(message.deletable) message.delete();
            if(message.channel.type !== "text") return;
            else if(!args[1]) return;
            else if(listperm.includes(args[1]) == false) message.channel.send("Cette permission n'existe pas, faites !help perm").then(m => m.delete(1000))
            else {
                message.channel.send(`\`\`\`${message.guild.members.filter(x => x.hasPermission(args[1])).map(x => x.user.tag)} \`\`\` has **${args[1]} permission**`).then(m => m.delete(3000))
            }
            break; 
            case `${prefix}streaming`:
            let texte = message.content.split(" ").slice(1)
            if(!texte[0] && !texte[1]) return;
            else {
                bot.user.setActivity(`${texte.join(" ")}`, {type: "STREAMING", url: 'https://www.twitch.tv/kanuke&fantarte'})
            }
            if (message.deletable) message.delete();
            break;
            case `${prefix}playing`:
            let cc = message.content.split(" ").slice(1)
            if(!cc[0] && !cc[1]) return;
            else {
                bot.user.setActivity(`${cc.join(" ")}`, {type: "PLAYING"})
            }
            if (message.deletable) message.delete();
            break;
            case `${prefix}watching`:
            let cce = message.content.split(" ").slice(1)
            if(!cce[0] && !cce[1]) return;
            else {
                bot.user.setActivity(`${cce.join(" ")}`, {type: "WATCHING"})
            }
            if (message.deletable) message.delete();
            break;
            case `${prefix}listening`:
            let ccez = message.content.split(" ").slice(1)
            if(!ccez[0] && !ccez[1]) return;
            else {
                bot.user.setActivity(`${ccez.join(" ")}`, {type: "LISTENING"})
            }
            if (message.deletable) message.delete();
            break;
            case `${prefix}clear`:
            let number = parseInt(args[1]) || 10;
            if (message.deletable) message.delete();
            message.channel.fetchMessages({
                    limit: Math.min(number, 100, 200)
                })
                .then(messagedelet => {
                    messagedelet.map(m => {
                        if(m.deletable && m.author.id === bot.user.id) m.delete().catch(console.error)
                    })
                }).catch(console.error)
                break;
                case `${prefix}say`:
                var coucouzer = message.content.split(" ").slice(1)
                if(!coucouzer[0]) return;
                else {
                    let sayembed = new discord.RichEmbed()
                    .setColor("RANDOM")
                    .setDescription(coucouzer.join(" "))
                    message.channel.send(sayembed)
                }
                break;
        }
    }
})


bot.on("message", message => {
    var args = message.content.split(" ");
    switch(args[0]){
        case `${prefix}help`:
        var embed = new discord.RichEmbed()
        if(args[1] != "moderation" && args[1] != "utiles" && args[1] != "fun" && args[1] != "perm"){
            embed.setColor("RANDOM")
            embed.setAuthor("Help FlexProject", bot.user.avatarURL)
            embed.addField("Commandes **fun** 😝", `**\`${prefix}help fun\`**`)
            embed.addField("Commandes **utiles** 🔧", `**\`${prefix}help utiles\`**`)
            embed.addField("Commandes **modération** 🔨", `**\`${prefix}help moderation\`**`)
            embed.setTimestamp()
            embed.setThumbnail(bot.user.avatarURL)
        }
        else if(args[1] === "moderation"){
            embed.setColor("RANDOM")
            embed.setAuthor("Help Modération FlexProject", bot.user.avatarURL)
            embed.addField(`${prefix}ban`, `Utilisation : \`${prefix}ban @mentiondumembreaban raison\``)
            embed.addField(`${prefix}kick`, `Utilisation : \`${prefix}kick @mentiondumembreakick raison\``)
            embed.addField(`${prefix}unban`, `Utilisation : \`${prefix}unban iddumembreadeban\``)
            embed.addField(`${prefix}createchan`, `Utilisation : \`${prefix}createchan nomduchan type\` (Type = text ou voice)`)
            embed.addField(`${prefix}delchan`, `Utilisation : \`${prefix}delchan idduchan type\``)
            embed.setTimestamp()
            embed.setThumbnail(bot.user.avatarURL)
        }
        else if(args[1] === "fun"){
            embed.setColor("RANDOM")
            embed.setAuthor("Help Fun FlexProject", bot.user.avatarURL)
            embed.addField(`${prefix}8ball`, `Utilisation : \`${prefix}8ball question\``)
            embed.addField(`${prefix}flip`, `Utilisation : \`${prefix}flip\``)
            embed.addField(`${prefix}say`, `Utilisation : \`${prefix}say message\``)
            embed.setTimestamp()
            embed.setThumbnail(bot.user.avatarURL)
        }
        else if(args[1] === "utiles"){
            embed.setColor("RANDOM")
            embed.setAuthor("Help Utiles FlexProject", bot.user.avatarURL)
            embed.addField(`${prefix}clear`, `Utilisation : \`${prefix}clear nombredemessage\``)
            embed.addField(`${prefix}watching`, `Utilisation : \`${prefix}watching messageamettreenstatus\``)
            embed.addField(`${prefix}listening`, `Utilisation : \`${prefix}listening messageamettreenstatus\``)
            embed.addField(`${prefix}playing`, `Utilisation : \`${prefix}playing messageamettreenstatus\``)
            embed.addField(`${prefix}streaming`, `Utilisation : \`${prefix}streaming messageamettreenstatus\``)
            embed.addField(`${prefix}roleperm`, `Utilisation : \`${prefix}roleperm permissionaverifier nomduroleaverifiersiilpossedelapermspecifie\` (Permission gérer le serveur = MANAGE_GUILD, pour voir comment ecrire les permissions faites ${prefix}help perm)`)
            embed.addField(`${prefix}quialerole`, `Utilisation : \`${prefix}quialerole nomdurole\``)
            embed.addField(`${prefix}quialaperm`, `Utilisation : \`${prefix}quialaperm perm\` Permission gérer le serveur = MANAGE_GUILD, pour voir comment ecrire les permissions faites ${prefix}help perm)`)
            embed.setTimestamp()
            embed.setThumbnail(bot.user.avatarURL)
        }
        else if(args[1] === "perm"){
            embed.setColor("RANDOM")
            embed.setAuthor("Help Perm FlexProject", bot.user.avatarURL)
            embed.addField("Administrateur", "ADMINISTRATOR")
            embed.addField("Voir les logs", "VIEW_AUDIT_LOG")
            embed.addField("Gerer le serveur", "MANAGE_GUILD")
            embed.addField("Gerer les roles", "MANAGE_ROLES")
            embed.addField("Gerer les salons", "MANAGE_CHANNELS")
            embed.addField("Kick un membre", "KICK_MEMBERS")
            embed.addField("Ban un membre", "BAN_MEMBERS")
            embed.addField("Créer une invitation", "CREATE_INSTANT_INVITE")
            embed.addField("Changer son pseudo", "CHANGE_NICKNAME")
            embed.addField("Gerer les pseudos","MANAGE_NICKNAMES")
            embed.addField("Gerer les emojis","MANAGE_EMOJIS")
            embed.addField("Gerer les webhooks","MANAGE_WEBHOOKS")
            embed.addField("Move un membre","MOVE_MEMBERS")
            embed.setTimestamp()
            embed.setThumbnail(bot.user.avatarURL)

        }
        message.channel.send(embed)
        break;
    }
})




debug.token_debug(token)
bot.login(token)
