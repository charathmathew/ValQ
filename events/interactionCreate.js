const { Events } = require('discord.js')
const draftHandler = require('../handlers/draftHandler')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if(interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName)

			if (!command) {
				console.error(`Unrecognized command: ${interaction.commandName}`)
				return
			}
	
			try {
				await command.execute(interaction)
			} catch (error) {
				console.error(`An error occurred`)
				console.error(error)
			}

		} else if (interaction.isStringSelectMenu()) {
			draftHandler.execute(interaction)
		}
    }
}