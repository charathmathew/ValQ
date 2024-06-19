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
        this.draftLog = "";
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

    setCaptains(team1Captain, team2Captain){
        this.captain1 = team1Captain;
        this.captain2 = team2Captain;
        this.team1.push(this.captain1);
        this.team2.push(this.captain2);
    }

    draftPlayer(playerId, captainId){
        let chosenPlayer = null;
        for(const[index,player] of this.availablePlayers.entries()){
            if(player.userId === playerId) {
                chosenPlayer = player
                this.availablePlayers.splice(index, 1)
                break
            }
        }

        // if player not found, simply return
        if(!chosenPlayer) {
            console.log(`player not found - playerId - ${playerId}`)
            return
        }

        if(captainId === this.captain1.userId){
            this.team1.push(chosenPlayer)
            this.lastPick = this.captain1.userId
            return [chosenPlayer, 'team 1']
        } else if (captainId === this.captain2.userId) {
            this.team2.push(chosenPlayer)
            this.lastPick = this.captain2.userId
            return [chosenPlayer, 'team 2']
        }
    }

    appendToDraftLog(msg) {
        if(!this.draftLog) {
            this.draftLog = msg
            this.update()
            return
        }

        this.draftLog = this.draftLog + "\n\n" + msg    
        this.update()
        return
    }

    saveNewGame(){
        // create json string of game state
        const gameStateObj = {[this.guildId]: {}};
        gameStateObj[this.guildId][this.id] = this;
        let gameJson = JSON.stringify(gameStateObj, null, 2)

        // if file doesn't exist, create it
        if(!fs.existsSync(databaseFileName)) {
            fs.writeFileSync(databaseFileName, gameJson, 'utf8');
            return
        }

        // if file exists but is empty
        if(fs.readFileSync(databaseFileName, 'utf8').length === 0){
            fs.writeFileSync(databaseFileName, gameJson, 'utf8')
            return
        }

        // if file exists and is not empty
        this.update()
    }

    update(){
        let existingGameData = JSON.parse(fs.readFileSync(databaseFileName, 'utf8'))
        existingGameData[this.guildId] = existingGameData[this.guildId] || {}
        existingGameData[this.guildId][this.id] = this;
        let updatedGameData = JSON.stringify(existingGameData, null, 2)
        fs.writeFileSync(databaseFileName, updatedGameData, 'utf8')
    }
}