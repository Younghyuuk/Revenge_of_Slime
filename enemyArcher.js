class enemyArcher {
    // !!!!!!!!!!!! add in a refrence to the player object so we can get its current location !!!!!!!!!!!!
    constructor(game, x, y, speed, health, damage, slime) {
        this.game = game;

        // KNIGHT STATS CHANGE AS LEVELS PROGRESS, STATS ARE BROUGHT IN THROUGH CONSTRUCTOR
            // x = x-coordinate of the knight's current location
            // y = y-coordinate of the knights current location
            // speed = this knights speed
            // health = this is the HP of the knight - arbitrary number to be changed
            // damage = this is the attack damage of the knight 
        Object.assign(this, {x, y, speed, health, damage, slime});

        this.removeFromWorld = false; // if the sprite is a live or dead, alive at creation

        //takes damage
        this.collisionCircle = {radius: 22, x: x + 25, y: y + 23};// collision detection circle

        this.dealDamageCollisionCircle = {radius: 190, x: x + 25, y: y + 23};

        this.overlapCollisionCircle = {radius: 14, x: x + 25, y: y + 23};

        this.NPC = true;
        this.coolDown = 0;
        // this.attackCount = 0;

        this.angleChangeTimer = 0; // Timer to track when to change angle variation

        this.currentAngleVariation = this.generateAngleVariation(); // Initialize with a random angle variation

        this.angleChangeInterval = 5; // Change angle every 2 seconds, adjust as needed

        this.stopInterval = 0;

        this.attacking = false;

        this.dead = false;

        // fields related to archer's animations
        this.direction = 0;
        this.attackDirection = 0;
        this.animations = [];
        this.spritesheet = ASSET_MANAGER.getAsset("./images/ArcherSprite.png");
        this.loadAnimations();

    };

    // this method makes the angle variations to add to knight mevement to add some randomness
    generateAngleVariation() {
        return (Math.random() - 0.5) * 2 * Math.PI / 2; // Adjust the denominator for larger/smaller changes
    }

    // this method updates the logic, aka the state of the enemy
    update() {

        let target = {x : this.slime.getCircle().x, y : this.slime.getCircle().y};
        let current = {x : this.collisionCircle.x, y : this.collisionCircle.y};

        var dist = this.distance(current, target);
        this.coolDown += this.game.clockTick;

        // Update angle change timer
        this.angleChangeTimer += this.game.clockTick;
        if (this.angleChangeTimer >= this.angleChangeInterval) {
            this.currentAngleVariation = this.generateAngleVariation(); // Generate a new angle variation
            this.angleChangeTimer = 0; // Reset timer
        }

        if (dist < this.dealDamageCollisionCircle.radius + this.slime.collisionCircle.radius/* && this.coolDown > .5*/) {
            console.log("archer respects damage collision");
            this.attack(this.slime);
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

        // Determine direction based on the velocity angle in degrees
        const directionAngle = (Math.atan2(this.velocity.y, this.velocity.x) * 180 / Math.PI + 360) % 360;

        if (directionAngle > 45 && directionAngle <= 135) {
            this.direction = 3; // down
            this.attackDirection = 4;
        } else if (directionAngle > 135 && directionAngle <= 225) {
            this.direction = 1; // left
            this.attackDirection = 5;
        } else if (directionAngle > 225 && directionAngle <= 315) {
            this.direction = 2; // up
            this.attackDirection = 7;
        } else { // This covers 315 to 360 (0) and 0 to 45 degrees
            this.direction = 0; // right
            this.attackDirection = 6;
        }

        }
        this.stopInterval++;

 


        // update collision circle for taking damage
        // this.defendCircle.x = this.x + 17 - this.game.camera.x;
        // this.defendCircle.y = this.y + 20 - this.game.camera.y;

        // //update collision circle for dealing damage
        // this.attackCircle.x = this.x + 17 - this.game.camera.x;
        // this.attackCircle.y = this.y + 20 - this.game.camera.y;


        this.collisionCircle.x = this.x + 25 - this.game.camera.x;;
        this.collisionCircle.y = this.y + 23 - this.game.camera.y;

        //update collision circle for dealing damage
        this.dealDamageCollisionCircle.x = this.x + 25 - this.game.camera.x;;
        this.dealDamageCollisionCircle.y = this.y + 23 - this.game.camera.y;;

        // update collison circle for NPC overlapping
        this.overlapCollisionCircle.x = this.x + 25 - this.game.camera.x;
        this.overlapCollisionCircle.y = this.y + 23 - this.game.camera.y;
    };

    distance(a, b) {
        return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
    }

    // this method is called when the knight attacks the player
    attack(entity) {
       // entity.getAttacked(this.damage);
        this.attacking = true;

        // This will set `this.attacking` back to false after 1 second
        setTimeout(() => {
            this.attacking = false;
        }, 1000);
    };

    // this method is called when this knight is taking damage
    // takes in a parameter of how much damage is being done  
    getAttacked(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.dead = true;
        }
    };

    loadAnimations() {
        // 0 = idle, 1 = left, 2 = right, 3 = up, 4 = down, 5 = dead, 6 = attacking
        // new Animator(spriteSheet, xSpriteSheet, ySpriteSheet, width, height, frameCount, frameDuration, scale);
        this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 11, .1, 1.75); // right
        this.animations[1] = new Animator(this.spritesheet, 0, 32, 32, 32, 11, .1, 1.75); // left
        this.animations[2] = new Animator(this.spritesheet, 0, 64, 32, 32, 11, .1, 1.75); // up
        this.animations[3] = new Animator(this.spritesheet, 0, 96, 32, 32, 8, .1, 1.75); // down
        this.animations[4] = new Animator(this.spritesheet, 0, 128, 32, 32, 9, .1, 1.75); // shoot down
        this.animations[5] = new Animator(this.spritesheet, 0, 160, 32, 32, 5, .1, 1.75); // shoot left
        this.animations[6] = new Animator(this.spritesheet, 0, 192, 32, 32, 5, .1, 1.75); // shoot right
        this.animations[7] = new Animator(this.spritesheet, 0, 224, 32, 32, 9, .1, 1.75); // shoot up
        this.animations[8] = new Animator(this.spritesheet, 0, 256, 32, 32, 6, .1, 1.75); // die
    };

    draw(ctx) {
        if (!this.removeFromWorld) {
            if (this.dead) {
                this.animations[8].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, [/*this.collisionCircle, this.overlapCollisionCircle*/]);
                // making sure the dead animation plays, and kngiht is removed from world afterwards
                this.elapsedDeadAnimTime += this.game.clockTick;
                if(this.elapsedDeadAnimTime > .7){
                    this.removeFromWorld = true;
                }
            } else if (this.attacking == true) {
                this.animations[this.attackDirection].drawFrame(this.game.clockTick, ctx, this.x- this.game.camera.x, this.y - this.game.camera.y, [/*this.collisionCircle, this.dealDamageCollisionCircle, this.overlapCollisionCircle*/]);
            } else {
                this.animations[this.direction].drawFrame(this.game.clockTick, ctx, this.x- this.game.camera.x, this.y - this.game.camera.y, [/*this.collisionCircle, this.dealDamageCollisionCircle, this.overlapCollisionCircle*/]);
            }
        }
    }
};