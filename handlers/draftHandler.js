const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRow, ActionRowBuilder } = require('discord.js');
const Game = require('../models/game');
const GameRepo = require('./../repos/gameRepo');

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

        let draftPickTurnUser = game.whoseTurnToPick()
        if(interaction.user.id !== draftPickTurnUser.userId){
            await interaction.followUp({content: `Current pick: ${draftPickTurnUser.user}\nPlease wait till they have made a pick`, ephemeral: true})
            return
        }
        
        let chosenPlayerId = interaction.values[0]
        const [draftPick, team]  = game.draftPlayer(chosenPlayerId, draftPickTurnUser.userId)
        game.update()

        await interaction.followUp({content: `${draftPick.displayName} has been drafted to ${team} by ${interaction.user.username}`})
        let nextPickUser = game.whoseTurnToPick()


        // remove the select menu if there are no more available players to draft
        if(game.availablePlayers.length === 0) {
            await interaction.editReply({content: `All players have been drafted`, components: []})
            return
        }

        const userSelect = new StringSelectMenuBuilder().setCustomId(interaction.customId);
        for (const player of game.availablePlayers) {
            userSelect
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(player.displayName)
                        .setValue(player.userId)
                )
        }

        const row = new ActionRowBuilder().addComponents(userSelect);
        await interaction.editReply({content: `Next pick: ${nextPickUser.displayName}`, components: [row]})
    }
}