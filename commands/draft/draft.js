const { SlashCommandBuilder } = require('discord.js');
const Game = require('./../../models/game');
const GameRepo = require('./../../repos/gameRepo');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('draft')
        .setDescription('Draft an available player to your team'),
    async execute(interaction) {
        const vc = (interaction.member.voice.channel ?? false)
        if(!interaction.member.voice.channel) {
            await interaction.reply({content:`Must be in a voice channel to start team captains draft`,ephemeral:true})
            return
        }

        let game = GameRepo.getGameByCaptainId(interaction.member.id)
        if(!game){
            await interaction.reply(`You must be a captain of an ongoing game to use this command.`)
            return
        }

        let userTurn = game.whoseTurnToPick()
        if(interaction.member.id !== userTurn.id){
            await interaction.reply(`It is not your turn to draft a player. Try again after the other captain has drafted`);
            return
        }


        console.log('you may draft a player')
    }
}