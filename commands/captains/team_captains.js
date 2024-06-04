const { SlashCommandBuilder } = require('discord.js');
const Game = require('./../../models/game');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('team_captains')
        .setDescription('Randomly picks team captains for team selection'),
    async execute(interaction) {
        const vc = (interaction.member.voice.channel ?? false)
        if(!interaction.member.voice.channel) {
            await interaction.reply({content:`Must be in a voice channel to start team captains draft`,ephemeral:true})
            return
        }

        const members = vc.members
        // if(members.size < 2){
        //     await interaction.reply(`Insufficient number of players to create teams`)
        //     return
        // }

        if(members.size > 10) {
            await interaction.reply(`Cannot begin a team captains draft with more than 10 total players`)
            return
        }

        await interaction.deferReply();

        const [captain1, captain2] = pickRandomCaptains(members)
        let game = new Game(interaction.guild.id, interaction.member.id)
        game.availablePlayers = Array.from(members.values())
        game.setCaptains(captain1, captain2);
        game.saveNewGame();

        await interaction.followUp(`Your captains are ${captain1.toString()} and ${captain2.toString()}
                                    \n${captain1.displayName} gets first pick
                                    \`\`\`Use /draft to begin the player draft\`\`\``);
        return
    }
};

function pickRandomCaptains(members){
    let players = Array.from(members.values())
    console.log(`potential captains - ${JSON.stringify(players)}`)
    let captain1Index = Math.floor(Math.random() * players.length)
    let captain1 = players[captain1Index]
    // players.splice(captain1Index, 1)
    // let captain2Index = Math.floor(Math.random() * players.length)
    // let captain2 = players[captain2Index]
    return [captain1, captain1]
}