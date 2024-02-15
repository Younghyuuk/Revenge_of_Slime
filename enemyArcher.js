class enemyArcher {
    // !!!!!!!!!!!! add in a refrence to the player object so we can get its current location !!!!!!!!!!!!
    constructor(game, x, y, speed, health, damage, slime) {
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
            // x = x-coordinate of the knight's current location
            // y = y-coordinate of the knights current location
            // speed = this knights speed
            // health = this is the HP of the knight - arbitrary number to be changed
            // damage = this is the attack damage of the knight 
        Object.assign(this, {x, y, speed, health, damage, slime});

        this.removeFromWorld = false; // if the sprite is a live or dead, alive at creation

        //takes damage
        this.radiusZone = 22;

        this.collisionCircle = {radius: this.radiusZone, x: x + 17, y: y + 20};// collision detection circle

        this.dealDamageCollisionCircle = {radius: 190, x: x + 17, y: y + 20};

        this.overlapCollisionCircle = {radius: 14, x: x + 17, y: y + 20};

        this.NPC = true;
        this.coolDown = 0;
        // this.attackCount = 0;

        this.angleChangeTimer = 0; // Timer to track when to change angle variation

        this.currentAngleVariation = this.generateAngleVariation(); // Initialize with a random angle variation

        this.angleChangeInterval = 5; // Change angle every 2 seconds, adjust as needed

        this.stopInterval = 0;

    };

    // this method makes the angle variations to add to knight mevement to add some randomness
    generateAngleVariation() {
        return (Math.random() - 0.5) * 2 * Math.PI / 2; // Adjust the denominator for larger/smaller changes
    }

    // this method updates the logic, aka the state of the enemy
    update() {

        let target = {x : this.slime.getCircle().x, y : this.slime.getCircle().y};
        let current = {x : this.collisionCircle.x, y : this.collisionCircle.y};

        var dist = distance(current, target);
        this.coolDown += this.game.clockTick;

        // Update angle change timer
        this.angleChangeTimer += this.game.clockTick;
        if (this.angleChangeTimer >= this.angleChangeInterval) {
            this.currentAngleVariation = this.generateAngleVariation(); // Generate a new angle variation
            this.angleChangeTimer = 0; // Reset timer
        }

        if (dist < this.dealDamageCollisionCircle.radius + this.slime.collisionCircle.radius/* && this.coolDown > .5*/) {
            console.log("archer respects damage collision");
           // this.attack(this.slime);
            this.coolDown = 0;
        } else { 
            if (this.stopInterval < 200) {
                // Introduce randomness in the direction
                const adjustedAngle = Math.atan2(target.y - current.y, target.x - current.x) + this.currentAngleVariation;
                // Maintain the original speed
                this.velocity = {
                    x: Math.cos(adjustedAngle) * this.speed,
                    y: Math.sin(adjustedAngle) * this.speed
                };

                this.x += this.velocity.x * this.game.clockTick;
                this.y += this.velocity.y * this.game.clockTick;
            } else if (this.stopInterval > 220) {
                this.stopInterval = 0;
            }

        }
        this.stopInterval++;


        // update collision circle for taking damage
        // this.defendCircle.x = this.x + 17 - this.game.camera.x;
        // this.defendCircle.y = this.y + 20 - this.game.camera.y;

        // //update collision circle for dealing damage
        // this.attackCircle.x = this.x + 17 - this.game.camera.x;
        // this.attackCircle.y = this.y + 20 - this.game.camera.y;


        this.collisionCircle.x = this.x + 17 - this.game.camera.x;;
        this.collisionCircle.y = this.y + 20 - this.game.camera.y;

        //update collision circle for dealing damage
        this.dealDamageCollisionCircle.x = this.x + 17 - this.game.camera.x;;
        this.dealDamageCollisionCircle.y = this.y + 20 - this.game.camera.y;;

        // update collison circle for NPC overlapping
        this.overlapCollisionCircle.x = this.x + 17 - this.game.camera.x;
        this.overlapCollisionCircle.y = this.y + 20 - this.game.camera.y;
    };

    // distance(a, b) {
    //     return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
    // }

    // this method is called when the knight attacks the player
    attack(entity) {
        entity.getAttacked(this.damage);
        // a method call to the player's character to damage them
        // sends in the damage as a parameter to determine how much health should be taken from the character

        // for debugging, uncomment attackCount in constructor
        // this.attackCount++;
        // console.log(`Archer Attack ${this.attackCount}`);
    };

    // this method is called when this knight is taking damage
    // takes in a parameter of how much damage is being done  
    getAttacked(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.removeFromWorld = true;
        }
    };

    draw(ctx) {
        if (!this.removeFromWorld) {
            this.animator.drawFrame(this.game.clockTick, ctx, this.x- this.game.camera.x, this.y - this.game.camera.y, [this.collisionCircle, this.dealDamageCollisionCircle, this.overlapCollisionCircle]);
        }
        
    }
};