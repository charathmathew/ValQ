const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ChannelType, ButtonBuilder, ButtonStyle } = require('discord.js');
const Game = require('../models/game');
const GameRepo = require('./../repos/gameRepo');
const { team1VCName, team2VCName, categoryChannelName } = require('./../config.json');

module.exports = {
    data: { name: 'Draft Handler'},
    async execute(interaction){
        await interaction.deferUpdate();
        
        let game = GameRepo.getGameByGuildIdAndGameId(interaction.guildId, interaction.customId)
        if(!(game instanceof Game)){
            await interaction.followUp({content: 'Unable to find game', ephemeral: true})
            return
        }

        if(interaction.user.id !== game.captain1.userId && interaction.user.id !== game.captain2.userId) {
            await interaction.followUp({content: `Only team captains can draft players`, ephemeral: true})
            return
        }

        if(interaction.values[0] === 'start' && game.availablePlayers.length !== 0) {
            await interaction.followUp({content: `The game is not ready to start. There are still undrafted players`})
            return
        }

        if(interaction.values[0] === 'start' && game.availablePlayers.length === 0) {
            await interaction.followUp({content: `Game is starting...`})
            await startGame(interaction, game)
            return
        }

        let draftPickTurnUser = game.whoseTurnToPick()
        if(interaction.user.id !== draftPickTurnUser.userId){
            await interaction.followUp({content: `Current pick: ${draftPickTurnUser.user}\nPlease wait till they have made a pick`, ephemeral: true})
            return
        }
        
        let chosenPlayerId = interaction.values[0]
        const [draftPick, team]  = game.draftPlayer(chosenPlayerId, draftPickTurnUser.userId)
        game.appendToDraftLog(`${draftPick.displayName} has been drafted to ${team} by ${interaction.user.username}`);
        game.update()


        // await interaction.followUp({content: `${game.draftLog}`})
        let nextPickUser = game.whoseTurnToPick()

        const userSelect = new StringSelectMenuBuilder().setCustomId(interaction.customId);
        if(game.availablePlayers.length === 0) {
            let msg = `\n\`\`\`All players have been drafted. Select 'Start Game' to start the game\`\`\``
            game.appendToDraftLog(msg)
            userSelect
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Start Game')
                        .setValue('start')
                )
        } else {
            let msg = `Next pick: ${nextPickUser.displayName}`
            game.appendToDraftLog(msg)
            for (const player of game.availablePlayers) {
                userSelect
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(player.displayName)
                            .setValue(player.userId)
                    )
            }
        }

        const row = new ActionRowBuilder().addComponents(userSelect);
        await interaction.editReply({content: game.draftLog, components: [row]})
    }
}

async function startGame(interaction, game){
    // create channels
    let categoryChannel = await interaction.member.guild.channels.create({name: categoryChannelName, type: ChannelType.GuildCategory})

    let vc1Options = {
        name: team1VCName,
        type: ChannelType.GuildVoice,
        userLimit: game.team1.length + 1,
        reason: "VC1 for Valorant custom match"
    }

    let vc2Options = {
        name: team2VCName,
        type: ChannelType.GuildVoice,
        userLimit: (game.team2.length || 1) + 1,
        reason: "VC2 for Valorant custom match"
    }

    const team1VC = await categoryChannel.children.create(vc1Options)
    const team2VC = await categoryChannel.children.create(vc2Options)

    // move players to team VCs
    movePlayersToTeamVoiceChannels(game.team1, team1VC, interaction.guild.members)
    movePlayersToTeamVoiceChannels(game.team2, team2VC, interaction.guild.members)

    return
}

function movePlayersToTeamVoiceChannels(players, teamChannel, guildMemberManager){
    players.forEach(async member => {
        member = await guildMemberManager.fetch(member.userId)
		member.voice.setChannel(teamChannel)
	})
}