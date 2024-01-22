class enemyArcher {
    // !!!!!!!!!!!! add in a refrence to the player object so we can get its current location !!!!!!!!!!!!
    constructor(game, xPos, yPos, speed, health, damage) {
        this.game = game;

        // VARIABLES TO CHANGE FOR EACH DIFFERENT CHARACTER
            // spritesheet - change file path for each different character
            // xStart - change starting x-pixel for sprite animation based on spritesheet
            // yStart - change starting y-pixel for sprite animation based on spritesheet
            // width - change width of the sprite
            // height - change height of the sprite
            // frameCount - change number of frames in the sprite animation
            // frameDuration - maybe change how long we want each frame to be displayed
            // scale - changes the size of the sprite beign drawn
        this.animator = new Animator(ASSET_MANAGER.getAsset("./archerSprite.png"), 530, 7, 60, 48, 4, 0.3, .8);

        // KNIGHT STATS CHANGE AS LEVELS PROGRESS, STATS ARE BROUGHT IN THROUGH CONSTRUCTOR
            // xPos = x-coordinate of the knight's current location
            // yPos = y-coordinate of the knights current location
            // speed = this knights speed
            // health = this is the HP of the knight - arbitrary number to be changed
            // damage = this is the attack damage of the knight 
        Object.assign(this, {xPos, yPos, speed, health, damage});

        this.isAlive = true; // if the sprite is a live or dead, alive at creation

        this.takeDamageCollisionCircle = {radius: 22, x: xPos + 17, y: yPos + 20};// collision detection circle

        this.dealDamageCollisionCircle = {radius: 190, x: xPos + 17, y: yPos + 20};
    };

    // this method updates the logic, aka the state of the enemy
    update() {
        // !!!!!!!!!!! player.Location -- look at reference to player class to get its current coordinates !!!!!!!!!!!!
        var playerCircle = {radius: 38, x: 1000, y: 700};//getPlayerLocation();
        
        // collision logic 
        let dx = this.dealDamageCollisionCircle.x - playerCircle.x;
        let dy = this.dealDamageCollisionCircle.y - playerCircle.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.dealDamageCollisionCircle.radius + playerCircle.radius) {
            this.attack();
        } else { 
            
            // for x-coordinate movement 
            if (this.dealDamageCollisionCircle.x < playerCircle.x) { // if the knight is to the left of the player
                let updatedX1 = Math.min((1 * this.speed), (playerCircle.x - this.dealDamageCollisionCircle.x));
                this.dealDamageCollisionCircle.x += updatedX1; // moves closer to the player on x axis by 1 pixel times movement speed
                this.takeDamageCollisionCircle.x += updatedX1;
                this.xPos += updatedX1;
            } else if (this.dealDamageCollisionCircle.x > playerCircle.x) { // if the knight is to the left of the player
                let updatedX2 = Math.min((1 * this.speed),(this.dealDamageCollisionCircle.x - playerCircle.x));
                this.dealDamageCollisionCircle.x -= updatedX2; // moves closer to the player on x axis by 1 pixel times movement speed
                this.takeDamageCollisionCircle.x -= updatedX2;
                this.xPos -= updatedX2;
            }

            // for y-coordinate movement 
            if (this.dealDamageCollisionCircle.y < playerCircle.y) { // if the knight is above the player
                let updatedY1 = Math.min((1 * this.speed),(playerCircle.y - this.dealDamageCollisionCircle.y));
                this.dealDamageCollisionCircle.y += updatedY1; // moves closer to the player on y axis by 1 pixel times movement speed
                this.takeDamageCollisionCircle.y += updatedY1;
                this.yPos += updatedY1;
            } else if (this.dealDamageCollisionCircle.y > playerCircle.y) { // if the knight is below the player
                let updatedY2 = Math.min((1 * this.speed),(this.dealDamageCollisionCircle.y - playerCircle.y));
                this.dealDamageCollisionCircle.y -= updatedY2; // moves closer to the player on y axis by 1 pixel times movement speed
                this.takeDamageCollisionCircle.y -= updatedY2;
                this.yPos -= updatedY2;
            }
        }

        this.takeDamageCollisionCircle.x = this.xPos + 17;
        this.takeDamageCollisionCircle.y = this.yPos + 20;

        this.dealDamageCollisionCircle.x = this.xPos + 17;
        this.dealDamageCollisionCircle.y = this.yPos + 20;
    };

    // this method is called when the knight attacks the player
    attack() {
        // a method call to the player's character to damage them
        // sends in the damage as a parameter to determine how much health should be taken from the character
    };

    // this method is called when this knight is taking damage
    // takes in a parameter of how much damage is being done  
    getAttacked(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.isAlive = false;
        }
    };

    draw(ctx) {
        if (this.isAlive) {
            this.animator.drawFrame(this.game.clockTick, ctx, this.xPos, this.yPos, [this.takeDamageCollisionCircle, this.dealDamageCollisionCircle]);
        }
    }
}