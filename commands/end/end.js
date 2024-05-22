const { SlashCommandBuilder, ChannelType } = require('discord.js');
const {team1VCName, team2VCName, lobbyVCName, categoryChannelName } = require('./../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('end_game')
        .setDescription('Moves all players into a single voice channel'),
    async execute(interaction) {
        const vc = (interaction.member.voice.channel ?? false)
		if(!interaction.member.voice.channel) {
			await interaction.reply({content:`Must be in a voice channel to create teams`,ephemeral:true})
			return
        }

        let guild = interaction.guild;

        // Find the existing voice channels
        const team1VC = guild.channels.cache.find(channel => channel.name === team1VCName && channel.type === ChannelType.GuildVoice);
        const team2VC = guild.channels.cache.find(channel => channel.name === team2VCName && channel.type === ChannelType.GuildVoice);

        let allMembers = []
        if(team1VC){
            allMembers = allMembers.concat(Array.from(team1VC.members.values()))
        }
        if(team2VC){
            allMembers = allMembers.concat(Array.from(team2VC.members.values()))
        }

        if(allMembers.length === 0) {
            await interaction.reply("Could not find any players to move")
            return
        }

        let categoryChannel = getChannelByName(categoryChannelName, guild)
        if(!categoryChannel){
            let categoryChannel = await interaction.guild.channels.create({name: categoryChannelName, type: ChannelType.GuildCategory})
        }

        let lobbyVCOptions = {
            name: lobbyVCName,
            type: ChannelType.GuildVoice,
            reason: "Lobby for all players"
        }
        const lobbyVC = await categoryChannel.children.create(lobbyVCOptions)

        // move all members to lobby voice channel
        allMembers.forEach(member => {
            member.voice.setChannel(lobbyVC);
        })

        await interaction.reply("Moved players to lobby")
        return 
    }
};

function getChannelByName(channelName, guild){
    return guild.channels.cache.find(channel => channel.name === channelName);
}