const fs = require('fs');
const { databaseFileName } = require('./../config.json');

module.exports = class Game {
    constructor(uniqueId){
        this.id = uniqueId;
        this.captain1;
        this.captain2;
        this.lastPick;
        this.team1 = [];
        this.team2 = [];
    }

    // get getId(){
    //     return this.id;
    // }

    // get captain1(){
    //     return this.captain1;
    // }

    // set captain1(user){
    //     this.captain1 = user;
    //     return;
    // }

    // get captain2(){
    //     return this.captain2;
    // }

    // set captain2(user){
    //     this.captain2 = user;
    //     return;
    // }

    // get team1(){
    //     return this.team1;
    // }

    // get team2(){
    //     return this.team2;
    // }

    whoseTurnToPick(){
        return this.isCaptain1TurnToPick ? this.captain1 : this.captain2;
    }

    isCaptain1TurnToPick(){
        return this.lastPick === this.captain1;
    }

    setCaptains(team1Captain){
        this.team1.push(team1Captain);
        // this.team2.push(team2Captain);
    }

    save(){
        const jsonData = JSON.stringify(this, null, 2);

        // if file doesn't exist, create it
        if(!fs.existsSync(databaseFileName)) {
            fs.writeFileSync(databaseFileName, jsonData, 'utf8');
            return
        }

        // if file exists but is empty
        fs.stat(databaseFileName, (err, fileStats) => {
            if(err) {
                console.log("Error saving game to file - ", err)
                return
            }

            if (fileStats.size === 0) {
                fs.writeFileSync(databaseFileName, jsonData, 'utf8');
                return
            }
        })

        // if file exists and is not empty
        fs.appendFile(databaseFileName, `,\n${jsonData}`, 'utf8', (err) => {
            if (err){
                console.log("Error saving game to file - ", err);
                return
            }
            console.log(`Object appended to "${databaseFileName}`);
        });

    }
}