const { Events } = require('discord.js')
const { team1VCName, team2VCName, categoryChannelName } = require('../config.json');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const guild = oldState.guild
        
        if(oldState.channel === null){
            return
        }

        if(oldState.channel.name == team1VCName){
            let team1VC = getChannelByName(team1VCName, guild)
            await deleteChannelIfEmpty(team1VC)
        } else if (oldState.channel.name == team2VCName){
            let team2VC = getChannelByName(team2VCName, guild)
            await deleteChannelIfEmpty(team2VC)
        }

        if(teamChannelsHaveBeenDeleted(guild)) {
            let categoryChannel = getChannelByName(categoryChannelName, oldState.guild)
            if(categoryChannel) {
                categoryChannel.delete()
            }
        }
    }
}

function getChannelByName(channelName, guild){
    return guild.channels.cache.find(channel => channel.name === channelName);
}

async function deleteChannelIfEmpty(channel){
    if(channel.members.size < 1) {
        await channel.delete('deleting empty channel')
    }
}

function teamChannelsHaveBeenDeleted(guild){
    if(guild.channels.cache.find(channel => channel.name === team1VCName)) {
        return false
    }
    if(guild.channels.cache.find(channel => channel.name === team2VCName)) {
        return false
    }
    return true
}