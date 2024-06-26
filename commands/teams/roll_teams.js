const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { team1VCName, team2VCName, categoryChannelName } = require('./../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll_teams')
		.setDescription('Randomizes and splits users into teams'),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		const vc = (interaction.member.voice.channel ?? false)
		if(!interaction.member.voice.channel) {
			await interaction.reply({content:`Must be in a voice channel to create teams`,ephemeral:true})
			return
		}

		const members = vc.members
		if(members.size < 2) {
			await interaction.reply('Insufficient number of players to create teams')
			return
		}

		// channels very often have more than 10 members - disabling this check restriction for now
		// if(members.size > 10) {
		// 	await interaction.reply('Cannot roll teams with more than 10 total players')
		// 	return
		// }

		let players = ''
		members.each(member => {
			players = players.concat(' ', member.user.username)
		})

		await interaction.reply(`Available players: ${players}`)

		Array.from(members.values())
		shuffledMembers = shuffle([...members.values()])
		shuffledPlayersString = getSpaceSeparatedUserString(shuffledMembers)
		const [team1, team2] = splitTeams(shuffledMembers)
		
		await interaction.followUp(`Attackers : ${getSpaceSeparatedUserString(team1)}`)
		await interaction.followUp(`Defenders : ${getSpaceSeparatedUserString(team2)}`)

		let categoryChannel = await interaction.guild.channels.create({name: categoryChannelName, type: ChannelType.GuildCategory})

		let vc1Options = {
			name: team1VCName,
  			type: ChannelType.GuildVoice,
			userLimit: team1.length + 1,
			reason: "VC1 for Valorant custom match"
		}

		let vc2Options = {
			name: team2VCName,
  			type: ChannelType.GuildVoice,
			userLimit: (team2.length || 1) + 1,
			reason: "VC2 for Valorant custom match"
		}

		const team1VC = await categoryChannel.children.create(vc1Options)
		const team2VC = await categoryChannel.children.create(vc2Options)

		movePlayersToTeamVoiceChannels(team1, team1VC)
		movePlayersToTeamVoiceChannels(team2, team2VC)

		return
	}
};


function shuffle(members){
	let currentIndex = members.length, randomIndex

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--

		[members[currentIndex], members[randomIndex]] = [members[randomIndex], members[currentIndex]]
	}

	return members
}

function splitTeams(shuffledPlayers){
	let half = Math.ceil(shuffledPlayers.length / 2)

	const team1 = shuffledPlayers.slice(0, half)
	const team2 = shuffledPlayers.slice(half)

	return [team1, team2]
}


function getSpaceSeparatedUserString(memberList) {
	let spaceSeparatedString = ''
	memberList.forEach(member => {
		spaceSeparatedString = spaceSeparatedString.concat(' ', member.username)
	})

	return memberList
}

function movePlayersToTeamVoiceChannels(players, teamChannel){
	players.forEach(member => {
		member.voice.setChannel(teamChannel)
	})
}