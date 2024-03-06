class WizardBoss {
    constructor(game, x, y, speed, health, damage, slime) {
        this.game = game;

        // STATS CHANGE AS LEVELS PROGRESS, STATS ARE BROUGHT IN THROUGH CONSTRUCTOR
            // x = x-coordinate of the knight's current location
            // y = y-coordinate of the knights current location
            // speed = this knights speed
            // health = this is the HP of the knight - arbitrary number to be changed
            // damage = this is the attack damage of the knight 
        Object.assign(this, {x, y, speed, health, damage, slime});
        console.log("Health: " + this.health);

        this.collsionXoffset = 35;

        this.collsionYoffset = 42;

        this.removeFromWorld = false; // if the sprite is a live or dead, alive at creation

        //takes damage
        this.meleeDamageCollisionCircle = {radius: 34, x: x + this.collsionXoffset, y: y + this.collsionYoffset};// collision detection circle

        this.rangedDamageCollisionCircle = {radius: 350, x: x + this.collsionXoffset, y: y + this.collsionYoffset};

        this.overlapCollisionCircle = {radius: 19, x: x + this.collsionXoffset, y: y + this.collsionYoffset};

        this.collisionCircle = {radius: 25, x: x + this.collsionXoffset, y: y + this.collsionYoffset};

        this.NPC = true;
        this.meleeCoolDown = 0;
        this.rangedCoolDown = 0;
        this.meleeRangedCoolDown = 0;
        // this.attackCount = 0;

        this.angleChangeTimer = 0; // Timer to track when to change angle variation

        this.currentAngleVariation = this.generateAngleVariation(); // Initialize with a random angle variation

        this.angleChangeInterval = 5; // Change angle every 2 seconds, adjust as needed

        this.stopInterval = 0;

        this.attacking = false;

        this.attackType = 1; // 1 for melee and 2 for ranged

        this.dead = false;

        this.elapsedDeadAnimTime = 0;

        this.energyBlastDamage = 40;
        this.energyBlastMaxSpeed = 700;
        this.energyBlastRadius = 15;


        this.velocity = {
            x: 0,
            y: 0
        };

        // fields related to archer's animations
        this.direction = 0;
        this.attackDirection = 0;
        this.animations = [];
        this.spritesheet = ASSET_MANAGER.getAsset("./images/WizardSprite.png");
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
        // target stores the location of the slime in its current state 
        let target = {x : this.slime.getCircle().x, y : this.slime.getCircle().y};
        // current holds the location of the knight in its current state
        let current = {x : this.meleeDamageCollisionCircle.x, y : this.meleeDamageCollisionCircle.y};

        // distance between the wizard and slime 
        var dist = distance(current, target);
        // atttack cooldown
        this.meleeCoolDown += this.game.clockTick;
        this.rangedCoolDown += this.game.clockTick;
        this.meleeRangedCoolDown += this.game.clockTick;

        // Update angle change timer
        this.angleChangeTimer += this.game.clockTick;
        if (this.angleChangeTimer >= this.angleChangeInterval) {
            this.currentAngleVariation = this.generateAngleVariation(); // Generate a new angle variation
            this.angleChangeTimer = 0; // Reset timer
        }

        // if the wizard is close enough to attack
        if (dist < this.meleeDamageCollisionCircle.radius + this.slime.collisionCircle.radius) {
            if (this.rangedCoolDown > 6 && this.meleeRangedCoolDown > 1.5) {
                console.log("w ranged");
                this.attack(this.slime, "ranged");
                this.rangedCoolDown = 0;
                this.meleeRangedCoolDown = 0;
            } else if (this.meleeCoolDown > 1 && this.meleeRangedCoolDown > 1.5) {
                this.attack(this.slime, "melee");
                this.meleeCoolDown = 0;
                this.meleeRangedCoolDown = 0;
            }
        // if the knight still needs to get to the slime 
        } else { 
            if (this.rangedCoolDown > 6 && (dist < this.rangedDamageCollisionCircle.radius + this.slime.collisionCircle.radius) && this.meleeRangedCoolDown > 1.5) {
                console.log("w ranged");
                this.attack(this.slime, "ranged");
                this.rangedCoolDown = 0;
                this.meleeRangedCoolDown = 0;
            }
            // this.attacking = false;
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
            } else if (directionAngle > 135 && directionAngle <= 225) {
                this.direction = 0; // left
            } else if (directionAngle > 225 && directionAngle <= 315) {
                this.direction = 2; // up
            } else { // This covers 315 to 360 (0) and 0 to 45 degrees
                this.direction = 1; // right
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


        this.meleeDamageCollisionCircle.x = this.x + this.collsionXoffset - this.game.camera.x;;
        this.meleeDamageCollisionCircle.y = this.y + this.collsionYoffset - this.game.camera.y;

        //update collision circle for dealing damage
        this.rangedDamageCollisionCircle.x = this.x + this.collsionXoffset - this.game.camera.x;;
        this.rangedDamageCollisionCircle.y = this.y + this.collsionYoffset - this.game.camera.y;;

        // update collison circle for NPC overlapping
        this.collisionCircle.x = this.x + this.collsionXoffset - this.game.camera.x;
        this.collisionCircle.y = this.y + this.collsionYoffset - this.game.camera.y;

        this.overlapCollisionCircle.x = this.x + this.collsionXoffset - this.game.camera.x;
        this.overlapCollisionCircle.y = this.y + this.collsionYoffset - this.game.camera.y;
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
    attack(entity, type) {
        this.attacking = true;
        let timeout = 0;
        if (type === "ranged") {
            timeout = 600;
            this.getAttackDirection(this.x, this.y, this.slime.x, this.slime.y, "ranged");
            setTimeout(() => {
                this.shootEnergyBlast();
            }, 250); // 500 milliseconds = 0.5 seconds
        } else {
            this.getAttackDirection(this.x, this.y, this.slime.x, this.slime.y, "melee");
            entity.getAttacked(this.damage);
            timeout = 1000;
        }
        // This will set `this.attacking` back to false after 1 second
        setTimeout(() => {
            this.attacking = false;
        }, timeout);
    };

    // this method calls upon a new arrow and attacks the slime 
    shootEnergyBlast() {
            // Calculate the arrow's direction based on slime location
            // Create a new arrow instance with arrow speed 5
            let wizardX = this.x + this.collsionXoffset - this.game.camera.x;
            let wizardY = this.y + this.collsionYoffset - this.game.camera.y;

            var dist = distance(this, this.game.levelBuilder.slime);
            let velocity = { x: ((this.slime.x + 31) - this.x) / dist * this.maxSpeed, 
            y: ((this.slime.y + 55) - this.y) / dist * this.maxSpeed };

            //this.getAttackDirection(this.x, this.y, this.slime.x, this.slime.y, "ranged");

            // this is done so the energy blast comes out of the wizrds hand instead of out of the body 
            let xOffset = 0;
            let yOffset = -15;
            if (this.attackDirection == 5) {
                xOffset = -10;
            } else if (this.attackDirection == 6) {
                xOffset = 10;
            }
            // game, archerX , archerY , maxSpeed, damage, radius, type
            let energyBlast = new Projectile(this.game, wizardX + xOffset, wizardY + yOffset, this.energyBlastMaxSpeed, this.energyBlastDamage, this.energyBlastRadius, "wizard"); 
            this.elapsedTime = 0;
            this.game.addEntity(energyBlast);
    };

    // // this method finds the direction the archer should be facing to be attacking the slime. used to determine the right animations
    getAttackDirection(archerX, archerY, slimeX, slimeY, type) {
        const deltaY = slimeY - archerY;
        const deltaX = slimeX - archerX;
        const angleDegrees = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // make the angle to in the range of 0-360
        const normalizedAngle = (angleDegrees + 360) % 360;
    
        // Determine the direction based on the angle
        if (normalizedAngle > 90 && normalizedAngle <= 270) {
            if (type === "ranged") {
                this.attackDirection = 5; // slime is below archer
                console.log(this.attackDirection);
            } else {
                this.attackDirection = 3;
            }
        } else {
            if (type === "ranged") {

                this.attackDirection = 6; // slime is below archer
                console.log(this.attackDirection);
            } else {
                this.attackDirection = 4;
            }
        }
    }
    

    // this method is called when this knight is taking damage
    // takes in a parameter of how much damage is being done  
    getAttacked(damage) {
        console.log("wizard get attacked");
        this.health -= damage;
        console.log("Health: " + this.health);
        this.game.levelBuilder.totalDamage += damage;
        if (this.health <= 0 && !this.dead) {
            this.dead = true;
            this.game.levelBuilder.kills++;
        }
    };

    drawMiniMap(ctx, mmX, mmY){
        ctx.fillStyle = "#800080";  // color of wizard
        ctx.fillRect(mmX + this.x / 32, mmY + this.y / 32, 4, 4);
    };

    loadAnimations() {
        // 0 = idle, 1 = left, 2 = right, 3 = up, 4 = down, 5 = dead, 6 = attacking
        // new Animator(spriteSheet, xSpriteSheet, ySpriteSheet, width, height, frameCount, frameDuration, scale);
        this.animations[0] = new Animator(this.spritesheet, 0, 0, 42, 55, 7, .1, 1.75); // left and down 
        this.animations[1] = new Animator(this.spritesheet, 0, 53, 42, 55, 7, .1, 1.75); // right
        this.animations[2] = new Animator(this.spritesheet, 0, 108, 42, 55, 7, .1, 1.75); // up
        this.animations[3] = new Animator(this.spritesheet, 0, 163, 42, 55, 10, .1, 1.75); // melee left
        this.animations[4] = new Animator(this.spritesheet, 0, 218, 42, 55, 10, .1, 1.75); // melee right
        this.animations[5] = new Animator(this.spritesheet, 0, 273, 42, 55, 6, .1, 1.75); // ranged left
        this.animations[6] = new Animator(this.spritesheet, 0, 328, 42, 55, 6, .1, 1.75); // ranged right
        this.animations[7] = new Animator(this.spritesheet, 0, 383, 42, 55, 11, .1, 1.75); // death
        this.animations[8] = new Animator(this.spritesheet, 0, 0, 42, 55, 1, .1, 1.75); // idle
    };

    draw(ctx) {
        if (!this.removeFromWorld) {
            if (this.slime.dead) {
                this.animations[8].drawFrame(this.game.clockTick, ctx, this.x- this.game.camera.x, this.y - this.game.camera.y, []);
            } else if (this.dead) {
                this.animations[7].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, []);
                // making sure the dead animation plays, and kngiht is removed from world afterwards
                this.elapsedDeadAnimTime += this.game.clockTick;
                if(this.elapsedDeadAnimTime > 1){
                    this.removeFromWorld = true;
                }
            } else if (this.attacking == true) {
                this.animations[this.attackDirection].drawFrame(this.game.clockTick, ctx, this.x- this.game.camera.x, this.y - this.game.camera.y, []);
            } else {
                this.animations[this.direction].drawFrame(this.game.clockTick, ctx, this.x- this.game.camera.x, this.y - this.game.camera.y, []);
            }
        }
    }
};