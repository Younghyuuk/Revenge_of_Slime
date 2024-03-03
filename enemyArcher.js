class enemyArcher {
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

        this.elapsedDeadAnimTime = 0;

        this.arrowDamage = 20;
        this.arrowMaxSpeed = 1000;
        this.arrowRadius = 5;


        this.velocity = {
            x: 0,
            y: 0
        };

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
        if (this.slime.dead || this.dead) {
            if (this.velocity.x != null && this.velocity.y != null){
                this.velocity.x = 0;
                this.velocity.y = 0;
            }
            return;
        }
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

        if (dist < this.dealDamageCollisionCircle.radius + this.slime.collisionCircle.radius) {
            if (this.coolDown > 3) {
                this.attack(this.slime);
                this.coolDown = 0;
            }
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
        } else if (directionAngle > 135 && directionAngle <= 225) {
            this.direction = 1; // left
        } else if (directionAngle > 225 && directionAngle <= 315) {
            this.direction = 2; // up
        } else { // This covers 315 to 360 (0) and 0 to 45 degrees
            this.direction = 0; // right
        }

        }
        this.stopInterval++;

        this.ensureWithinBounds();


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
        // entity.getAttacked(this.damage);
        this.attacking = true;
        this.shootArrow();
        // This will set `this.attacking` back to false after 1 second
        setTimeout(() => {
            this.attacking = false;
        }, 500);
    };

    // this method calls upon a new arrow and attacks the slime 
    shootArrow() {
            // Calculate the arrow's direction based on slime location
            // Create a new arrow instance with arrow speed 5
            let archerX = this.x + 25 - this.game.camera.x;
            let archerY = this.y + 23 - this.game.camera.y;

            var dist = distance(this, this.game.levelBuilder.slime);
            let velocity = { x: ((this.slime.x + 31) - this.x) / dist * this.maxSpeed, 
            y: ((this.slime.y + 55) - this.y) / dist * this.maxSpeed };

            this.getAttackDirection(this.x, this.y, this.slime.x, this.slime.y);

            // game, archerX , archerY , maxSpeed, damage, radius, type
            let arrow = new Projectile(this.game, archerX, archerY, this.arrowMaxSpeed, this.arrowDamage, this.arrowRadius, "archer"); 
            this.elapsedTime = 0;
            this.game.addEntity(arrow);
    };

    // // this method finds the direction the archer should be facing to be atttacking the slime. used to determine the right animations
    getAttackDirection(archerX, archerY, slimeX, slimeY) {
        const deltaY = slimeY - archerY;
        const deltaX = slimeX - archerX;
        const angleDegrees = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // make the angle to in the range of 0-360
        const normalizedAngle = (angleDegrees + 360) % 360;
    
        // Determine the direction based on the angle
        if (normalizedAngle > 45 && normalizedAngle <= 135) {
            this.attackDirection = 4; // slime is below archer
        } else if (normalizedAngle > 135 && normalizedAngle <= 225) {
            this.attackDirection = 5; // slime is to the left of archer
        } else if (normalizedAngle > 225 && normalizedAngle <= 315) {
            this.attackDirection = 7; // slime is above archer
        } else {
            this.attackDirection = 6; // slime is to the right of archer
        }
    }
    

    // this method is called when this knight is taking damage
    // takes in a parameter of how much damage is being done  
    getAttacked(damage) {
        this.health -= damage;
        this.game.levelBuilder.totalDamage += damage;
        if (this.health <= 0 && !this.dead) {
            this.dead = true;
            this.game.levelBuilder.kills++;
        }
    };

    drawMiniMap(ctx, mmX, mmY){
        ctx.fillStyle = "#084c18"; // color of archer
        ctx.fillRect(mmX + this.x / 32, mmY + this.y / 32, 4, 4);
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
        this.animations[8] = new Animator(this.spritesheet, 0, 256, 32, 32, 9, .1, 1.75); // die
        this.animations[9] = new Animator(this.spritesheet, 0, 96, 32, 32, 1, 100000, 1.75); // stopped
    };

    draw(ctx) {
        if (!this.removeFromWorld) {
            if (this.slime.dead) {
                this.animations[9].drawFrame(this.game.clockTick, ctx, this.x- this.game.camera.x, this.y - this.game.camera.y, [/*this.collisionCircle, this.dealDamageCollisionCircle, this.overlapCollisionCircle*/]);
            } else if (this.dead) {
                this.animations[8].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, [/*this.collisionCircle, this.overlapCollisionCircle*/]);
                // making sure the dead animation plays, and kngiht is removed from world afterwards
                this.elapsedDeadAnimTime += this.game.clockTick;
                if(this.elapsedDeadAnimTime > 1){
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