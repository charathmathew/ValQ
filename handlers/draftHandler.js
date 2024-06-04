const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRow, ActionRowBuilder } = require('discord.js');
const Game = require('../models/game');
const GameRepo = require('./../repos/gameRepo');

module.exports = {
    data: { name: 'Draft Handler'},
    async execute(interaction){
        await interaction.deferUpdate();
        
        console.log(interaction)
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

        game.lastPick = draftPickTurnUser.userId
        let nextPickUser = game.whoseTurnToPick()

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
        await interaction.editReply({content: `Draft pick for ${nextPickUser.displayName}`, components: [row]})

        // return interaction.followUp({content: `Eligible pick. Excecuting draft logic and updating game`})
    }
}