const fs = require('fs');
const crypto = require('crypto');
const { databaseFileName } = require('./../config.json');

module.exports = class Game {
    constructor(serverId, creatorId){
        this.id = this.generateUniqueGameId(serverId, creatorId);
        this.guildId = serverId;
        this.captain1;
        this.captain2;
        this.lastPick;
        this.availablePlayers = [];
        this.team1 = [];
        this.team2 = [];
    }

    generateUniqueGameId(guildId, creatorId){
        const data = `${guildId}-${creatorId}`;
      
        // Create a hash using SHA256
        const hash = crypto.createHash('sha256').update(data).digest('hex');
        const identifier = hash.substring(0, 16);
      
        return identifier;
    }

    whoseTurnToPick(){
        return this.lastPick === this.captain1.userId ? this.captain2 : this.captain1;
    }

    isCaptain1TurnToPick(){
        if (this.lastPick = null) {
            return true;
        }
        
        return this.lastPick === this.captain1.userId;
    }

    setCaptains(team1Captain, team2Captain){
        this.captain1 = team1Captain;
        this.captain2 = team2Captain;
        this.team1.push(team1Captain);
        this.team2.push(team2Captain);
    }

    saveNewGame(){
        // create json string of game state
        const gameStateObj = {[this.guildId]: {}};
        gameStateObj[this.guildId][this.id] = this;
        let gameJson = JSON.stringify(gameStateObj, null, 2)
        console.log(`saving game state ${gameJson}`)

        // if file doesn't exist, create it
        if(!fs.existsSync(databaseFileName)) {
            fs.writeFileSync(databaseFileName, gameJson, 'utf8');
            return
        }

        // if file exists but is empty
        if(fs.readFileSync(databaseFileName, 'utf8').length === 0){
            console.log(`file exists but is empty`)
            fs.writeFileSync(databaseFileName, gameJson, 'utf8')
            return
        }

        // if file exists and is not empty
        let existingGameData = JSON.parse(fs.readFileSync(databaseFileName, 'utf8'))
        existingGameData[this.guildId][this.id] = this;
        let updatedGameData = JSON.stringify(existingGameData, null, 2)
        console.log(`update game data - ${updatedGameData}`)
        fs.writeFileSync(databaseFileName, updatedGameData, 'utf8')
    }
}