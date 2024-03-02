class enemyKnight {
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
        this.game.knight = this;
        this.removeFromWorld = false; // if the sprite is a live or dead, alive at creation

        this.collisionCircle = {radius: 22, x: x + 25, y: y + 25};// collision detection circle

        this.overlapCollisionCircle = {radius: 14, x: x + 25, y: y + 25}; // collision circle to prevent NPC overlap
        
        this.NPC = true;
        this.coolDown = 0;
        // this.attackCount = 0;

        this.angleChangeTimer = 0; // Timer to track when to change angle variation

        this.currentAngleVariation = this.generateAngleVariation(); // Initialize with a random angle variation

        this.angleChangeInterval = 5; // Change angle every 2 seconds, adjust as needed

        this.attacking = false; // true when currently attacking
        
        this.dead = false; // made for getting the death animation correct

        this.velocity = {
            x: 0,
            y: 0
        };


       // fields related to knight's animations
       this.elapsedDeadAnimTime = 0; // to make sure death animation plays correctly
       this.direction = 0;
       this.attackDirection = 0;
       this.animations = [];
       this.spritesheet = ASSET_MANAGER.getAsset("./images/KnightSprite.png");
       this.loadAnimations();
        

    };

    // this method makes the angle variations to add to knight mevement to add some randomness
    generateAngleVariation() {
        return (Math.random() - 0.5) * 2 * Math.PI / 4; // Adjust the denominator for larger/smaller changes
    }

    // this method updates the logic, aka the state of the enemy
    update() {
        if (this.slime.dead || this.dead) {
            if (this.velocity.x != null && this.velocity.y != null){
                this.velocity.x = 0;
                this.velocity.y = 0;
            }
            return;
        }
        // target stores the location of the slime in its current state 
        let target = {x : this.slime.getCircle().x, y : this.slime.getCircle().y};
        // current holds the location of the knight in its current state
        let current = {x : this.collisionCircle.x, y : this.collisionCircle.y};

        // distance between the knight and slime 
        var dist = distance(current, target);
        // atttack cooldown
        this.coolDown += this.game.clockTick;

        // Update angle change timer
        this.angleChangeTimer += this.game.clockTick;
        if (this.angleChangeTimer >= this.angleChangeInterval) {
            this.currentAngleVariation = this.generateAngleVariation(); // Generate a new angle variation
            this.angleChangeTimer = 0; // Reset timer
        }

        // if the knight is close enough to attack
        if (dist < this.collisionCircle.radius + this.slime.collisionCircle.radius) {
            if (this.coolDown > 1) {
                this.attack(this.slime);
                this.coolDown = 0;
            }
        // if the knight still needs to get to the slime 
        } else { 
            this.attacking = false;
            // Introduce randomness in the direction
            const adjustedAngle = Math.atan2(target.y - current.y, target.x - current.x) + this.currentAngleVariation;
            // Maintain the original speed
            this.velocity = {
                x: Math.cos(adjustedAngle) * this.speed,
                y: Math.sin(adjustedAngle) * this.speed
            };

            this.y += this.velocity.y * this.game.clockTick;
            this.x += this.velocity.x * this.game.clockTick;

            // Determine direction based on the velocity angle in degrees
            const directionAngle = (Math.atan2(this.velocity.y, this.velocity.x) * 180 / Math.PI + 360) % 360;

            if (directionAngle > 45 && directionAngle <= 135) {
                this.direction = 0; // down
                this.attackDirection = 5;
            } else if (directionAngle > 135 && directionAngle <= 225) {
                this.direction = 1; // left
                this.attackDirection = 4;
            } else if (directionAngle > 225 && directionAngle <= 315) {
                this.direction = 7; // up
                this.attackDirection = 6;
            } else { // This covers 315 to 360 (0) and 0 to 45 degrees
                this.direction = 2; // right
                this.attackDirection = 3;
            }
        
        }

        this.ensureWithinBounds();

        //update attack/take damage collision circle
        this.collisionCircle.x = this.x + 25 - this.game.camera.x;
        this.collisionCircle.y = this.y + 25 - this.game.camera.y;

        //update overlap collision circle
        this.overlapCollisionCircle.x = this.x + 25 - this.game.camera.x;
        this.overlapCollisionCircle.y = this.y + 25 - this.game.camera.y;

       
        
    };

    ensureWithinBounds() {
        const minX = 0;
        const minY = 0;
        const maxX = 3132;
        const maxY = 3132;

        // Check and adjust the x-coordinate
        if (this.x < minX) {
            this.x = minX;
        } else if (this.x > maxX) {
            this.x = maxX;
        }

        // Check and adjust the y-coordinate
        if (this.y < minY) {
            this.y = minY;
        } else if (this.y > maxY) {
            this.y = maxY;
        }
    }

    // distance(a, b) {
    //     return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
    // }

    // this method is called when the knight attacks the player
    attack(entity) {
       entity.getAttacked(this.damage);
        this.attacking = true;

        // This will set `this.attacking` back to false after 1 second
        // setTimeout(() => {
        //     this.attacking = false;
        // }, 1000);
    
        // a method call to the player's character to damage them
        // sends in the damage as a parameter to determine how much health should be taken from the character

        // for debugging, uncomment attackCount in constructor
        // this.attackCount++;
        // console.log(`Knight Attack ${this.attackCount}`);
    };

    // this method is called when this knight is taking damage
    // takes in a parameter of how much damage is being done  
    getAttacked(damage) {
        this.health -= damage;
        this.game.levelBuilder.totalDamage += damage;
        console.log("damage increment: " + this.game.levelBuilder.totalDamage);
        if (this.health <= 0 && !this.dead) {
            this.dead = true;
            this.game.levelBuilder.kills++;
        }
    };

    drawMiniMap(ctx, mmX, mmY){
        ctx.fillStyle = "#c0c4e8"; // color of knight
        ctx.fillRect(mmX + this.x / 32, mmY + this.y / 32, 4, 4);
    }
    loadAnimations() {
        // 0 = idle, 1 = left, 2 = right, 3 = up, 4 = down, 5 = dead, 6 = attacking
        // new Animator(spriteSheet, xSpriteSheet, ySpriteSheet, width, height, frameCount, frameDuration, scale);
        this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 8, .1, 1.75); // down
        this.animations[1] = new Animator(this.spritesheet, 0, 32, 32, 32, 10, .1, 1.75); // left
        this.animations[2] = new Animator(this.spritesheet, 0, 64, 32, 32, 14, .1, 1.75); // right
        this.animations[3] = new Animator(this.spritesheet, 32, 96, 32, 32, 5, .1, 1.75); // attack right
        this.animations[4] = new Animator(this.spritesheet, 0, 128, 32, 32, 5, .1, 1.75); // attack left
        this.animations[5] = new Animator(this.spritesheet, 0, 160, 32, 32, 9, .08, 1.75); // attack down
        this.animations[6] = new Animator(this.spritesheet, 0, 192, 32, 32, 5, .1, 1.75); // attack up
        this.animations[7] = new Animator(this.spritesheet, 0, 224, 32, 32, 11, .1, 1.75); // up
        this.animations[8] = new Animator(this.spritesheet, 0, 256, 32, 32, 10, .1, 1.75); // die
        this.animations[9] = new Animator(this.spritesheet, 0, 0, 32, 32, 0, 1000000, 1.75); // stopped
    };

    draw(ctx) {
        if (!this.removeFromWorld) {
            if (this.slime.dead) {
                this.animations[9].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, [/*this.collisionCircle, this.overlapCollisionCircle*/]);
            } else if (this.dead) {
                this.animations[8].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, [/*this.collisionCircle, this.overlapCollisionCircle*/]);
                // making sure the dead animation plays, and kngiht is removed from world afterwards
                this.elapsedDeadAnimTime += this.game.clockTick;
                if(this.elapsedDeadAnimTime > 1){
                    this.removeFromWorld = true;
                }
            } else if (this.attacking == true) {
                this.animations[this.attackDirection].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, [/*this.collisionCircle, this.overlapCollisionCircle*/]);
            } else {
                this.animations[this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, [/*this.collisionCircle, this.overlapCollisionCircle*/]);
            }
        }
    }
};

