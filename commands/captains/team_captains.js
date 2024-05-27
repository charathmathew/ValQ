const {SlashCommandBuilder, ChannelType } = require('discord.js');
const crypto = require('crypto');
const Game = require('./../../models/game');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('team_captains')
        .setDescription('Start a team captain style draft for team selection'),
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

        await interaction.deferReply();

        let guild = interaction.guild;
        const captain1 = pickRandomCaptains(members)
        // const [captain1, captain2] = pickRandomCaptains(members)
        let gameId = generateUniqueGameId(guild.id, interaction.member.id)
        let game = new Game(gameId)
        game.setCaptains(captain1)
        // game.setCaptains(captain1, captain2);
        game.save();

        await interaction.followUp(`Your team captains are ${captain1.displayName} and ...`);
        return
    }
};

function pickRandomCaptains(members){
    let players = Array.from(members.values())
    console.log(`potential captains - ${JSON.stringify(players)}`)
    let captain1Index = Math.floor(Math.random() * players.length)
    let captain1 = players[captain1Index]
    players.splice(captain1Index, 1)
    return captain1
    // let captain2Index = Math.floor(Math.random() * players.length)
    // let captain2 = players[captain2Index]
    // return [captain1, captain2]
}

function generateUniqueGameId(guildId, creatorId){
  const data = `${guildId}-${creatorId}`;

  // Create a hash using SHA256
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  const identifier = hash.substring(0, 16);

  return identifier;
}