REQUIRED:
- Create a config.json file in the root of the project to hold your tokens, clientId, guildId, etc. The names of the voice channels that the bot creates, is pulled from this config.
- In roll_teams.js and voiceStateUpdate.js the bot looks for channel names that are specified in config.json as well.


To get the bot online:
- run `deploy-commands.js` in order to register/update your slash commands
- run `index.js` so that your bot client user is logged in and online
- add the bot to a discord server and you can now issue slash commands
