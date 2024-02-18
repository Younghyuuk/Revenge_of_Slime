class LevelBuilder {
    constructor(gameEngine, createEnemy, createSlime) {

        //reference to the gameEngine 
        this.gameEngine = gameEngine;

        // reference to the method in main that we will need to call to create the enemies
        this.createEnemy = createEnemy;

        this.createSlime = createSlime;

        //current level
        this.level = 1;

        // this makes it so there is a limit to the number of enemies that can be on the map at once 
        // as the levels go higher, this makes the spawning period of enemies take longer since there 
        // will be more than 30 enemies per level at a high level waiting in queue to spawn in 
        // change value for balancing 
        this.maxCapacity = 30;

        //number of knights created for the current level
        this.currentKnightCnt = 0;

        //number of archers created for this current level
        this.currentArcherCnt = 0;

        //the number of knights currently alive in the level
        this.livingKnights = 0;

        //the number of archers currently alive in the level 
        this.livingArchers = 0;

        // holds all the enemies that will need to spawn in, spawn number limited by maxCapacity
        this.spawnQueue = [];

        this.kills = 0;

        this.score = 0;

        this.totalDamage = 0;

    };

    initBuilder() {
        console.log("initSlime in levelBuilder is called");
        // creates the slime main character and adds to the gameEngine as an entity
        // this.slime = new Slime(engine, 77, 430, 150, 100, 10);
        // this.gameEngine.addEntity(this.slime);
        this.slime = createSlime(this.gameEngine);

        // start off the game with level 1
        this.calculateEnemyCount();
        this.buildNextLevel()
    };

    // called from gameEngine after each update() method call to update the number of knights and archers currently on the board
    updateEnemyCnt(knights, archers) {
        console.log("knights: " + knights + ", archers: " + archers);
        this.livingKnights = knights;
        this.livingArchers = archers;
        // TODO add more conditions to this if statement as we get more enemies built 
        if (this.livingArchers == 0 && this.livingKnights == 0 /* && !this.slime.dead*/) {
            console.log("new level being created")
            // TODO add in next level screen thing

            // updating fields to get ready for the next level
           this.level++;
           this.spawnQueue = [];
            // TODO add in the new level grpahic here  
           this.calculateEnemyCount();         
           this.buildNextLevel(); 
        }

        if (this.slime.dead) {
            this.gameOver();
        }
    };

    // builds new level
    buildNextLevel() {
        if (!this.slime.dead) {
            // No more enemies to spawn end loop
            if (this.spawnQueue.length === 0) {
                return; 
            }

            console.log("enemies: " + (this.livingArchers + this.livingKnights));
            // checks to see if we have reached the max capacity, if so, wait a bit then try again
            if ((this.livingArchers + this.livingKnights) < this.maxCapacity) {
                // Get the next enemy to spawn
                const enemyType = this.spawnQueue.shift(); 
                // method call to create enemies with right stats and spawn point
                this.gameEngine.addEntity(this.createEnemyStats(enemyType)); 

                // Randomize next spawn time 
                // change values for balancing 
                const minSpawnDelay = 1000; // Minimum spawn delay in milliseconds
                const maxSpawnDelay = 3000; // Maximum spawn delay in milliseconds
                const spawnDelay = Math.random() * (maxSpawnDelay - minSpawnDelay) + minSpawnDelay;

                // spawn the next enemy with a random interval
                setTimeout(() => this.buildNextLevel(), spawnDelay); // Schedule next spawn

            // if the max capacity is reached, wait 1 second and try again, will keep looping until everything is spawned 
            } else {
                // If max capacity reached, check again after a short delay
                setTimeout(() => this.buildNextLevel(), 100); // Check again in .1 seconds
            }
        }
    };

    // takes in a parameter of what kind of enemy we are 
    // trying to spawn and it determines its health, damage and spawn location
    createEnemyStats(type) {
        let health = 0;
        let damage = 0;

        // random spawn points for now 
        let randomX = Math.floor(Math.random() * (1250 - 30 + 1)) + 30;
        let randomY = Math.floor(Math.random() * (730 - 30 + 1)) + 30;

        // TODO add more if statements when we make more enemies 
        if (type == "archer") {
            // change if needed -- once the max number of archers is already 
            // queued, give them a bigger increase in health from there onwards
            if (this.currentArcherCnt == 30) {
                // change for balancing
                health = this.level * 2 + 40 + ((this.level - 6) * 2);
                damage = Math.min(this.level * 2 + 15 + ((this.level - 6) * 2), 65);
            } else {
                // change for balancing
                health = this.level * 2 + 40;
                damage = this.level * 2 + 15;
            }
            return this.createEnemy(this.gameEngine, "archer", randomX, randomY, 100, health, damage);
        } else if (type == "knight") {
            // change if needed -- once the max number of knights is already 
            // queued, give them a bigger increase in health from there onwards
            if (this.currentKnightCnt == 30) {
                // change for balancing
                health = this.level * 2 + 70 + ((this.level - 6) * 2);
                damage = Math.min(this.level * 2 + 10 + ((this.level - 6) * 2), 65);
            } else {
                // change for balancing
                health = this.level * 2 + 70;
                damage = this.level * 2 + 5;
            }
            return this.createEnemy(this.gameEngine, "knight", randomX, randomY, 120, health, damage);
        }
    };

    // this method will be finished when we have figured out the scrolling thing so we know the spawn points based on that 
    // current implementation is just random anywhere on the canvas but within the createEnemyStats() method 
    calculateSpawnPoint() {

    };

    // this method is a helper method for buildNextLevel() and it calculates the 
    // number of each enemy that will spawn in this next level and add them to the spawnQueue
    calculateEnemyCount() {

        // after a certain number, there will be a cap on how many enemies of each type can spawn per level
        // so use the algorithm to find out enemy count until max is reached 
        // TODO tweak algortihm for balancing 
        this.currentArcherCnt = Math.min(this.level * 2 + 3, 30);
        this.currentKnightCnt = Math.min(this.level * 3 + 4, 50);

        // Add enemies to the queue until both counts are exhausted
        while (this.currentArcherCnt > 0 || this.currentKnightCnt > 0) {
            
            //randomize order
            let randomNum = Math.floor(Math.random() * 2); // 0 or 1

            // TODO add more if statements when we get more enemies 
            if (randomNum === 0 && this.currentArcherCnt > 0) {
                this.spawnQueue.push("archer");
                this.currentArcherCnt--;
            } else if (this.currentKnightCnt > 0) {
                this.spawnQueue.push("knight");
                this.currentKnightCnt--;
            }
        }

        console.log("enemies for this level: " + this.spawnQueue.length);
    };

    gameOver() {
        this.gameEngine.running = false;
        // Create the overlay div
        const gameOverScreen = document.createElement('div');
        gameOverScreen.id = 'gameOverScreen';
        gameOverScreen.style.position = 'fixed';
        gameOverScreen.style.top = '0';
        gameOverScreen.style.left = '0';
        gameOverScreen.style.width = '100%';
        gameOverScreen.style.height = '100%';
        // change the last number value in the string to set opacity
        gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        gameOverScreen.style.color = 'white';
        gameOverScreen.style.display = 'flex';
        gameOverScreen.style.flexDirection = 'column';
        gameOverScreen.style.justifyContent = 'center';
        gameOverScreen.style.alignItems = 'center';
        gameOverScreen.style.zIndex = '1000';
        gameOverScreen.style.fontSize = '24px';
        gameOverScreen.style.fontFamily = "'Press Start 2P', serif";

        // Create the Game Over text
        const gameOverText = document.createElement('h1');
        gameOverText.textContent = 'Game Over';
        gameOverText.style.color = 'red';
        gameOverScreen.appendChild(gameOverText);

        // Create the level display
        const levelDisplay = document.createElement('p');
        levelDisplay.textContent = `Level: ${this.level}`;
        gameOverScreen.appendChild(levelDisplay);

        // Create the kills display
        const killsDisplay = document.createElement('p');
        killsDisplay.textContent = `Kills: ${this.kills}`;
        gameOverScreen.appendChild(killsDisplay);

        // Create the damage display
        const damageDisplay = document.createElement('p');
        damageDisplay.textContent = `Total Damage: ${this.totalDamage}`;
        gameOverScreen.appendChild(damageDisplay);

        // Create the Play Again button
        const playAgainButton = document.createElement('button');
        playAgainButton.textContent = 'Play Again';
        playAgainButton.style.cursor = 'pointer';
        playAgainButton.style.padding = '20px 40px'; // Makes the button bigger
        playAgainButton.style.fontSize = '20px'; // Increases the font size
        playAgainButton.style.fontFamily = "'Press Start 2P', cursive"; // Sets the font family
        playAgainButton.style.border = '2px solid #000000'; // Adds a black border
        playAgainButton.style.color = '#000000'; // Optional: sets the text color
        playAgainButton.style.backgroundColor = '#FFFFFF'; // Sets the background color to white
        playAgainButton.style.borderRadius = '5px'; // Optional: rounds the corners of the button
        playAgainButton.style.marginTop = '20px'; // Optional: adds space above the button
        playAgainButton.textContent = 'Play Again';
        playAgainButton.style.cursor = 'pointer';
        playAgainButton.onclick = function() {
            window.location.reload(); // Refresh the page
        };
        gameOverScreen.appendChild(playAgainButton);

        // Append the overlay to the body to show it
        document.body.appendChild(gameOverScreen);
    };
}