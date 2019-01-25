const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const talkedRecently = new Set();

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    client.user.setStatus('available')
    client.user.setActivity(`with money | $help`, {type: "PLAYING"});
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setStatus('available')
    client.user.setActivity(`with money | $help`, {type: "PLAYING"});
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setStatus('available')
    client.user.setActivity(`with money | $help`, {type: "PLAYING"});
});
let money = JSON.parse(fs.readFileSync("./money.json", "utf8"));
const prefix = "$";

client.on('message', message => {
	if (!message.content.startsWith(prefix)) return;
	if(message.author.bot) return;
	if (!message.guild) return;

	const args = message.content.slice(1).trim().split(/ +/g);
  	const command = args.shift().toLowerCase();

	if (command === "help") {
		message.delete(0);
		const workembed = new Discord.RichEmbed()
		.setTitle("Command List")
	    .setColor("#00ff00")
	    .addField("$help", "Show the list of commands.", false)
	    .addField("$money | $balance | $bal", "Show your current account balance.", false)
	    .addField("$work", "Go to work to earn some money.", false)
	    .addField("$titles", "Show the list of titles and thier prices.", false)
	    .addField("$buy <title>", "Buy prestigious Titles for your money.", false)

	    message.channel.send(workembed);
	}
	if (command === "work") {
		const cdembed = new Discord.RichEmbed()
		.setAuthor(message.author.tag)
		.setColor("#ff0000")
		.addField("⏲ You need to wait 3 minutes to go to work again!", "Please wait 3 minutes before working.");

		if (talkedRecently.has(message.author.id)) {
			message.channel.send(cdembed);
			message.delete(0); 
			return
		} else {
			talkedRecently.add(message.author.id);
			setTimeout(() => {
				talkedRecently.delete(message.author.id);
			}, 180000);
		}

		let userData = money[message.author.id];

		let earned = Math.floor(Math.random() * (300 - 10 + 1)) + 10;

		userData.money = userData.money + earned;

		
		message.delete(0);

		const workembed = new Discord.RichEmbed()
		.setTitle("Work :construction_worker:")
		.setDescription("You went to work and earned $" + earned)
		.setColor('#00FF00')
		.setTimestamp()
		.setAuthor(message.author.tag)

		message.channel.send(workembed);
	}
	if (command === "moneytop" || command === "balancetop" || command === "baltop" || command === "top") {
		message.delete(0);
		message.reply("Coming soon!");
	}
	if (command === "money" || command === "balance" || command === "bal") {
		let userData = money[message.author.id];

		message.delete(0);

		const balembed = new Discord.RichEmbed()
		.setTitle("Account Balance :moneybag:")
		.setDescription(userData.money)
		.setColor('#00FF00')
		.setTimestamp()
		.setAuthor(message.author.tag)

		message.channel.send(balembed);
	}
	if (command === "buy") {
		message.delete(0);
		if (!args[0]) {
			const titleembed = new Discord.RichEmbed()
			.setTitle("List of Titles")
		    .setDescription("Title progression applies. For example you need to buy Talker to unlock Worker.")
		    .setColor("#00ff00")
		    .addField("1. Talker", "$5,000", false)
		    .addField("2. Worker", "$50,000", false)
		    .addField("3. Greedy", "$250,000", false)
		    .addField("4. Moneybags", "$500,000", false)
		    .addField("5. Milionare", "$1,000,000", false)
		    .addField("6. Elite", "$5,000,000", false)
		    .addField("7. Overlord", "$10,000,000", false)

		    message.channel.send(titleembed);
		} else {
			const choice = args[0].toLowerCase();
			if (choice === "talker") {
				if(message.member.roles.find("name", "Talker") || message.member.roles.find("name", "Worker") || message.member.roles.find("name", "Greedy") || message.member.roles.find("name", "Moneybags") || message.member.roles.find("name", "Milionare") || message.member.roles.find("name", "Elite") || message.member.roles.find("name", "Overlord")){
			        const tembed = new Discord.RichEmbed()
					.setTitle("Error")
				    .setDescription("You already have the Talker Title or higher.")
				    .setColor("#ff0000")
				    .setAuthor(message.author.tag)
				    message.channel.send(tembed);
			    } else {
			    	let userData = money[message.author.id];
			    	if (userData.money >= 5000) {
				    	let role = message.guild.roles.find("name", "Talker");
				    	message.member.addRole(role).catch(console.error);
				    	userData.money = userData.money - 5000;
				    	const tembed = new Discord.RichEmbed()
						.setTitle("Title Bought :money_with_wings:")
					    .setDescription("You have successfuly purchased the **Talker** Title.")
					    .setColor("#00ff00")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    	} else {
						const tembed = new Discord.RichEmbed()
						.setTitle("Error")
					    .setDescription("You do not have enough money.")
					    .setColor("#ff0000")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    	}
			    }
			}
			if (choice === "worker") {
				if(message.member.roles.find("name", "Worker") || message.member.roles.find("name", "Greedy") || message.member.roles.find("name", "Moneybags") || message.member.roles.find("name", "Milionare") || message.member.roles.find("name", "Elite") || message.member.roles.find("name", "Overlord")){
			        const tembed = new Discord.RichEmbed()
					.setTitle("Error")
				    .setDescription("You already have the Worker Title or higher.")
				    .setColor("#ff0000")
				    .setAuthor(message.author.tag)
				    message.channel.send(tembed);
			    } else if (message.member.roles.find("name", "Talker")) {
			    	let userData = money[message.author.id];
			    	if (userData.money >= 50000) {
				    	let role = message.guild.roles.find("name", "Worker");
				    	let rolep = message.guild.roles.find("name", "Talker");
				    	message.member.addRole(role).catch(console.error);
				    	message.member.removeRole(rolep).catch(console.error);
				    	userData.money = userData.money - 50000;
				    	const tembed = new Discord.RichEmbed()
						.setTitle("Title Bought :money_with_wings:")
					    .setDescription("You have successfuly purchased the **Worker** Title.")
					    .setColor("#00ff00")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    	} else {
						const tembed = new Discord.RichEmbed()
						.setTitle("Error")
					    .setDescription("You do not have enough money.")
					    .setColor("#ff0000")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    	}
			    } else {
			    	const tembed = new Discord.RichEmbed()
						.setTitle("Error")
					    .setDescription("You need to buy the Talker Title to unlock Worker.")
					    .setColor("#ff0000")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    }

			}
			if (choice === "greedy") {
				if(message.member.roles.find("name", "Greedy") || message.member.roles.find("name", "Moneybags") || message.member.roles.find("name", "Milionare") || message.member.roles.find("name", "Elite") || message.member.roles.find("name", "Overlord")){
			        const tembed = new Discord.RichEmbed()
					.setTitle("Error")
				    .setDescription("You already have the Greedy Title or higher.")
				    .setColor("#ff0000")
				    .setAuthor(message.author.tag)
				    message.channel.send(tembed);
			    } else if (message.member.roles.find("name", "Worker")) {
			    	let userData = money[message.author.id];
			    	if (userData.money >= 250000) {
				    	let role = message.guild.roles.find("name", "Greedy");
				    	let rolep = message.guild.roles.find("name", "Worker");
				    	message.member.addRole(role).catch(console.error);
				    	message.member.removeRole(rolep).catch(console.error);
				    	userData.money = userData.money - 250000;
				    	const tembed = new Discord.RichEmbed()
						.setTitle("Title Bought :money_with_wings:")
					    .setDescription("You have successfuly purchased the **Greedy** Title.")
					    .setColor("#00ff00")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    	} else {
						const tembed = new Discord.RichEmbed()
						.setTitle("Error")
					    .setDescription("You do not have enough money.")
					    .setColor("#ff0000")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    	}
			    } else {
			    	const tembed = new Discord.RichEmbed()
						.setTitle("Error")
					    .setDescription("You need to buy the Worker Title to unlock Greedy.")
					    .setColor("#ff0000")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    }
			    
			}
			if (choice === "moneybags") {
				if(message.member.roles.find("name", "Moneybags") || message.member.roles.find("name", "Milionare") || message.member.roles.find("name", "Elite") || message.member.roles.find("name", "Overlord")){
			        const tembed = new Discord.RichEmbed()
					.setTitle("Error")
				    .setDescription("You already have the Moneybags Title or higher.")
				    .setColor("#ff0000")
				    .setAuthor(message.author.tag)
				    message.channel.send(tembed);
			    } else if (message.member.roles.find("name", "Greedy")) {
			    	let userData = money[message.author.id];
			    	if (userData.money >= 500000) {
				    	let role = message.guild.roles.find("name", "Moneybags");
				    	let rolep = message.guild.roles.find("name", "Greedy");
				    	message.member.addRole(role).catch(console.error);
				    	message.member.removeRole(rolep).catch(console.error);
				    	userData.money = userData.money - 500000;
				    	const tembed = new Discord.RichEmbed()
						.setTitle("Title Bought :money_with_wings:")
					    .setDescription("You have successfuly purchased the **Moneybags** Title.")
					    .setColor("#00ff00")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    	} else {
						const tembed = new Discord.RichEmbed()
						.setTitle("Error")
					    .setDescription("You do not have enough money.")
					    .setColor("#ff0000")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    	}
			    } else {
			    	const tembed = new Discord.RichEmbed()
						.setTitle("Error")
					    .setDescription("You need to buy the Greedy Title to unlock Moneybags.")
					    .setColor("#ff0000")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    }
			    
			}
			if (choice === "milionare") {
				if(message.member.roles.find("name", "Milionare") || message.member.roles.find("name", "Elite") || message.member.roles.find("name", "Overlord")){
			        const tembed = new Discord.RichEmbed()
					.setTitle("Error")
				    .setDescription("You already have the Milionare Title or higher.")
				    .setColor("#ff0000")
				    .setAuthor(message.author.tag)
				    message.channel.send(tembed);
			    } else if (message.member.roles.find("name", "Moneybags")) {
			    	let userData = money[message.author.id];
			    	if (userData.money >= 1000000) {
				    	let role = message.guild.roles.find("name", "Milionare");
				    	let rolep = message.guild.roles.find("name", "Moneybags");
				    	message.member.addRole(role).catch(console.error);
				    	message.member.removeRole(rolep).catch(console.error);
				    	userData.money = userData.money - 1000000;
				    	const tembed = new Discord.RichEmbed()
						.setTitle("Title Bought :money_with_wings:")
					    .setDescription("You have successfuly purchased the **Milionare** Title.")
					    .setColor("#00ff00")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    	} else {
						const tembed = new Discord.RichEmbed()
						.setTitle("Error")
					    .setDescription("You do not have enough money.")
					    .setColor("#ff0000")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    	}
			    } else {
			    	const tembed = new Discord.RichEmbed()
						.setTitle("Error")
					    .setDescription("You need to buy the Moneybags Title to unlock Milionare.")
					    .setColor("#ff0000")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    }
			    
			}
			if (choice === "elite") {
				if(message.member.roles.find("name", "Elite") || message.member.roles.find("name", "Overlord")){
			        const tembed = new Discord.RichEmbed()
					.setTitle("Error")
				    .setDescription("You already have the Elite Title or higher.")
				    .setColor("#ff0000")
				    .setAuthor(message.author.tag)
				    message.channel.send(tembed);
			    } else if (message.member.roles.find("name", "Milionare")) {
			    	let userData = money[message.author.id];
			    	if (userData.money >= 1000000) {
				    	let role = message.guild.roles.find("name", "Elite");
				    	let rolep = message.guild.roles.find("name", "Milionare");
				    	message.member.addRole(role).catch(console.error);
				    	message.member.removeRole(rolep).catch(console.error);
				    	userData.money = userData.money - 1000000;
				    	const tembed = new Discord.RichEmbed()
						.setTitle("Title Bought :money_with_wings:")
					    .setDescription("You have successfuly purchased the **Elite** Title.")
					    .setColor("#00ff00")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    	} else {
						const tembed = new Discord.RichEmbed()
						.setTitle("Error")
					    .setDescription("You do not have enough money.")
					    .setColor("#ff0000")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    	}
			    } else {
			    	const tembed = new Discord.RichEmbed()
						.setTitle("Error")
					    .setDescription("You need to buy the Milionare Title to unlock Elite.")
					    .setColor("#ff0000")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    }
			    
			}
			if (choice === "overlord") {
				if(message.member.roles.find("name", "Overlord")){
			        const tembed = new Discord.RichEmbed()
					.setTitle("Error")
				    .setDescription("You already have the Overlord Title.")
				    .setColor("#ff0000")
				    .setAuthor(message.author.tag)
				    message.channel.send(tembed);
			    } else if (message.member.roles.find("name", "Elite")) {
			    	let userData = money[message.author.id];
			    	if (userData.money >= 1000000) {
				    	let role = message.guild.roles.find("name", "Overlord");
				    	let rolep = message.guild.roles.find("name", "Elite");
				    	message.member.addRole(role).catch(console.error);
				    	message.member.removeRole(rolep).catch(console.error);
				    	userData.money = userData.money - 1000000;
				    	const tembed = new Discord.RichEmbed()
						.setTitle("Title Bought :money_with_wings:")
					    .setDescription("You have successfuly purchased the **Overlord** Title.")
					    .setColor("#00ff00")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    	} else {
						const tembed = new Discord.RichEmbed()
						.setTitle("Error")
					    .setDescription("You do not have enough money.")
					    .setColor("#ff0000")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    	}
			    } else {
			    	const tembed = new Discord.RichEmbed()
						.setTitle("Error")
					    .setDescription("You need to buy the Elite Title to unlock Overlord.")
					    .setColor("#ff0000")
					    .setAuthor(message.author.tag)
					    message.channel.send(tembed);
			    }
			    
			}
		}
	}
	if (command === "titles") {
		message.delete(0);
			const titleembed = new Discord.RichEmbed()
			.setTitle("List of Titles")
		    .setDescription("Title progression applies. For example you need to buy Talker to unlock Worker.")
		    .setColor("#00ff00")
		    .addField("1. Talker", "$5,000", false)
		    .addField("2. Worker", "$50,000", false)
		    .addField("3. Greedy", "$250,000", false)
		    .addField("4. Moneybags", "$500,000", false)
		    .addField("5. Milionare", "$1,000,000", false)
		    .addField("6. Elite", "$5,000,000", false)
		    .addField("7. Overlord", "$10,000,000", false)

		    message.channel.send(titleembed);
	}

	fs.writeFile("./money.json", JSON.stringify(money), (err) => {
		if (err) console.error(err)
	});
});

client.on('message', message => {
	if(message.author.bot) return;
	if (!message.guild) return;

	if (!money[message.author.id]) money[message.author.id] = {
		money: 0
	};

	let userData = money[message.author.id];

	userData.money = userData.money + Math.floor(Math.random() * (2 - 0 + 1)) + 0;

	fs.writeFile("./money.json", JSON.stringify(money), (err) => {
		if (err) console.error(err)
	});
});

client.login(process.env.BOT_TOKEN);