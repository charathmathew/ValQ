const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('responds with pong')
        .addUserOption(option => 
            option
                .setName('target')
                .setDescription('the user to be tagged in the response')
                .setRequired(false)
        ),
    async execute(interaction) {
        const userToTag = interaction.options.getUser('target') ?? interaction.user
        await interaction.reply(`pong ${userToTag.toString()}`)
    }
}