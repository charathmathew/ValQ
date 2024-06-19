const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const Game = require('./../../models/game');
const GameRepo = require('./../../repos/gameRepo');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('draft')
        .setDescription('Begin the player draft'),
    async execute(interaction) {
        const vc = (interaction.member.voice.channel ?? false)
        if(!interaction.member.voice.channel) {
            await interaction.reply({content:`Must be in a voice channel to start team captains draft`,ephemeral:true})
            return
        }

        await interaction.deferReply();

        let game = GameRepo.getGameByCaptainIdAndServerId(interaction.member.id, interaction.guild.id)
        if(!(game instanceof Game)){
            await interaction.followUp(`You must be a captain of an ongoing game to use this command.`)
            return
        }

        if(interaction.member.id !== game.captain1.userId && interaction.member.id !== game.captain2.userId) {
            await interaction.followUp({content:`Only team captains can start the draft`, ephemeral: true})
            return
        }

        let userTurn = game.whoseTurnToPick()
        const userSelect = new StringSelectMenuBuilder().setCustomId(game.id);
        
        if(game.availablePlayers.length < 1) {
            return await interaction.followUp({content: `Not enough available players to start a draft`})
        }

        for (const player of game.availablePlayers) {
            userSelect
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(player.displayName)
                        .setValue(player.userId)
                )
        }
        const row = new ActionRowBuilder().addComponents(userSelect);

        return await interaction.followUp({content: `Next pick: ${userTurn.displayName}`, components: [row]})
    }
}