const fs = require('fs');
const Game = require('./../models/game')
const { databaseFileName } = require('./../config.json');

function getGameByCaptainIdAndServerId(captainId, guildId){
    let allGames = getGamesFromDBFile();
    if (Object.keys(allGames).length === 0) {
        // no games in db file
        return false;
    }

    let allGamesFromGuild = allGames[guildId];

    if(Object.keys(allGamesFromGuild).length === 0){
        // could not find any games from this guild in db file
        return false;
    }

    let gameId = null;
    for(const[key,value] of Object.entries(allGamesFromGuild)){
        if(value.captain1.userId === captainId || value.captain2.userId === captainId) {
            gameId = key
            break;
        }
    }

    if(gameId === null){
        // no games with matching captainId
        return false;
    }

    return createGameFromData(allGamesFromGuild[gameId]);
}

function getGamesFromDBFile(){
    if(fs.readFileSync(databaseFileName, 'utf8').length === 0){
        // no data in db file
        return {}
    }

    let existingGameData = JSON.parse(fs.readFileSync(databaseFileName, 'utf8'));
    return existingGameData
}

function createGameFromData(data){
    let game = new Game(data.id, data.captain1)
    game.id = data.id || 0;
    game.guildId = data.guildId || 0;
    game.captain1 = data.captain1 || {};
    game.captain2 = data.captain2 || {};
    game.lastPick = data.lastPick || null;
    game.availablePlayers = data.availablePlayers || [];
    game.team1 = data.team1 || [];
    game.team2 = data.team2 || [];

    return game;
}

module.exports = {
    getGameByCaptainIdAndServerId
}