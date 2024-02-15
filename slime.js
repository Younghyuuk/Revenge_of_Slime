class Slime {
    constructor(game, x, y, speed, health, damage) {
        console.log("slime is created");
        this.game = game;
        // this.spritesheet = ASSET_MANAGER.getAsset("./images/UpdatedSlimeSprite.png");
        // this.spritesheet = ASSET_MANAGER.getAsset("./images/myBlueSlime.png");
        this.spritesheet = ASSET_MANAGER.getAsset("./images/blueKnifeSlime.png");

        Object.assign(this, {x, y, speed, health, damage});

        this.game.slime = this;
        //slime state variables
        this.state = 0; // 0 = idle, 1 = left, 2 = right, 3 = up, 4 = down, 5 = dead, 6 = attacking

        this.weaponState = 0; // 0 = no weapon, 1 = knife, 2 = pistol
        this.dead = false;
        

        this.collisionCircle = {radius: 14, x: this.x + 31, y: this.y + 55};// collision detection circle
        this.overlapCollisionCircle = {radius: 14, x: this.x + 31, y: this.y + 55};// overlap collision detection circle
        // this.attackCircle = {radius: 14, x: this.x + 31, y: this.y + 55};
        // this.defendCircle = {radius: 12, x: this.x + 31, y: this.y + 55};

        // holds slimes weapons
        this.inventory = [];
        
        // slime's animations
        this.animations = [];
        this.loadAnimations();

        
        this.enemyInRange = null; // the enemy that attack is called on
        this.AttackCount = 0;

        // to make sure the dead and attacking animations play
        this.elapsedDeadAnimTime = 0;
        this.elapsedAttackAnimTime = 0;

        this.hasPistol = true;
        // all the knife stuff.
        this.hasKnife = false; // Indicates if the slime has a knife to attack with
        // console.log(this.inventory.some(item => item.name === "knife");
        this.knifeCooldown = 0;

        this.pistolCD = 2;

    };

    confirm() {
        console.log("reference passed");
    };
    // calls attack if mouse clicked and enemy in range
    canAttack() {
        if (this.game.mouseClick == true && this.enemyInRange != null && this.hasKnife == false){
            //set state to attacking
            this.state = 6;
            this.attack(this.enemyInRange);
            //reset mouseClick
            this.game.mouseClick = false;
            
        } else {
            // making sure the attack animation plays
            this.elapsedAttackAnimTime += this.game.clockTick;
            if(this.elapsedAttackAnimTime > 1.5) {
                this.elapsedAttackAnimTime = 0;
                this.state = 0;
            }
        }
    };

    // this method is called when the slime attacks an npc
    attack(entity) {
        entity.getAttacked(this.damage);
        this.enemyInRange = null;
        this.AttackCount++;
        console.log(`Slime Attack ${this.AttackCount}`);
        // a method call to the player's character to damage them
        // sends in the damage as a parameter to determine how much health should be taken from the character
    };

    // this method is called when this slime is taking damage
    // takes in a parameter of how much damage is being done  
    getAttacked(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.dead = true;
            this.state = 5;
        }
    };

    performKnifeAttack() {
        let stabCircle = this.game.knife.stabPos();
    
        if (this.hasKnife && this.game.mouseClick) {
            this.showStabCircle = true; // Set to true to show the stab circle
    
            // Check for collisions with entities using stabCircle
            this.game.entities.forEach(entity => {
                if (entity instanceof enemyArcher || entity instanceof enemyKnight) {
                    if(circlesIntersect(entity.collisionCircle, stabCircle)) {
                        entity.getAttacked(this.game.knife.damage);
                        console.log("Enemy health: " + entity.health);
                    }
                }
            });
            // Reset mouseClick to prevent continuous attacks
            this.game.mouseClick = false;
        }
    }; 

    // this method calls upon a new bullet when the slime has a pistol and attacks an npc with mouse clicks add in the update
    // in the bullet method or projectile later
    pistolShot() {
        if (this.hasPistol && this.game.mouseClick && !this.hasKnife) {
            
            // Calculate the bullet's direction based on the mouse click
            // Create a new Bullet instance with bullet speed 5
            let slimeX = this.x + 31 - this.game.camera.x;
            let slimeY = this.y + 55 - this.game.camera.y;
            let pistolBullet = new Projectile(this.game, slimeX, slimeY, 5);
            this.game.addEntity(pistolBullet);
           
            this.game.entities.forEach(entity => {
                if (entity instanceof enemyArcher || entity instanceof enemyKnight) {
                    if(collide(entity.radiusZone, pistolBullet.radius)) {
                        entity.getAttacked(pistolBullet.damage);
                        console.log("Enemy health: " + entity.health);
                    }
                }
            });

            
            // Reset mouseClick to prevent continuous shooting
            this.game.mouseClick = false;

            // Implement cooldown logic for pistol shooting
            // this.resetPistolCD(); // This method needs to be defined to handle cooldown
        }
    };


    getCircle() {
        return this.collisionCircle;
    };

  

    loadAnimations() {

        // // copied from Marriott's Mario, may have to do similar thing in our code
        // for (var i = 0; i < 6; i++) { // six directions
        //     this.animations.push([]);
        //     for (var j = 0; j < 1; j++) { // one attack (others not implemented yet)
        //         this.animations[i].push([]);
        //         for (var k = 0; k < 2; k++) { // two directions
        //             this.animations[i][j].push([]);
        //         }
        //     }
        // }


        // 0 = idle, 1 = left, 2 = right, 3 = up, 4 = down, 5 = dead, 6 = attacking
        // new Animator(spriteSheet, xSpriteSheet, ySpriteSheet, width, height, frameCount, frameDuration, scale);
        this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 10, .175, 2); // idle
        this.animations[4] = new Animator(this.spritesheet, 0, 32, 32, 32, 10, .175, 2); // down
        this.animations[3] = new Animator(this.spritesheet, 0, 64, 32, 32, 10, .175, 2); // up
        this.animations[2] = new Animator(this.spritesheet, 0, 96, 32, 32, 10, .175, 2); // right
        this.animations[1] = new Animator(this.spritesheet, 0, 128, 32, 32, 10, .175, 2); //left // ORIGINAL
        this.animations[6] = new Animator(this.spritesheet, 0, 160, 32, 32, 10, .175, 2); // spit attack
        this.animations[5] = new Animator(this.spritesheet, 0, 192, 32, 32, 10, .175, 2); // dead




    };


    update() {
        // this.camera.follow(this);
        
        let potentialX = this.x;
        let potentialY = this.y;
        
        // let deltaX = 0;
        // let deltaY = 0;
        
       //don't move if dead
        if(!this.dead) {

          
            //calls attack if mouse clicked and enemy in range
            this.canAttack();
            this.performKnifeAttack();
            this.pistolShot();
            if (this.showStabCircle) {
                if (!this.stabCircleTimer) { // Initialize the timer the first time
                    this.stabCircleTimer = 60; // e.g., 60 frames = 1 second at 60 FPS
                }
                this.stabCircleTimer--;
                if (this.stabCircleTimer <= 0) {
                    this.showStabCircle = false;
                    this.stabCircleTimer = null; // Reset the timer
                }
            }

            if(this.game.A) { // left
            // if the slime IS attacking, keep playing attack animation and move left
            // if the slime is NOT attacking, change state for animation and move left
                if(this.state != 6) {
                    this.state = 1;
                }
                // this.state = 1;
                // deltaX -= 1;
                // this.x -= this.speed * this.game.clockTick;
                potentialX -= this.speed * this.game.clockTick;
                if (!this.game.map.collidesWithCircle({ ...this.collisionCircle, x: potentialX + 31 })) {
                    this.x = potentialX;
                }
            } 
            if (this.game.D) { // right
            // if the slime IS attacking, keep playing attack animation and move right
            // if the slime is NOT attacking, change state for animation and move right
                if(this.state != 6) {
                    this.state = 2;
                }
                // this.state = 1;
                // deltaX += 1;
                // this.x += this.speed * this.game.clockTick;
                potentialX += this.speed * this.game.clockTick;
                if (!this.game.map.collidesWithCircle({ ...this.collisionCircle, x: potentialX + 31 })) {
                    this.x = potentialX;
                }
            } 
            if (this.game.W) { // up
            // if the slime IS attacking, keep playing attack animation and move up
            // if the slime is NOT attacking, change state for animation and move up
                if(this.state != 6) {
                    this.state = 3;
                }
                // this.state = 4;
                // deltaY -= 1;
                // this.y -= this.speed * this.game.clockTick;

                potentialY -= this.speed * this.game.clockTick;
                if (!this.game.map.collidesWithCircle({ ...this.collisionCircle, y: potentialY + 55 })) {
                    this.y = potentialY;
                }
            } 
            if (this.game.S) { // down
            // if the slime IS attacking, keep playing attack animation and move down
            // if the slime is NOT attacking, change state for animation and move down
                if(this.state != 6) {
                    this.state = 4;
                }
                // this.state = 4;
                // deltaY += 1;
                // this.y += this.speed * this.game.clockTick;
                potentialY += this.speed * this.game.clockTick;
                if (!this.game.map.collidesWithCircle({ ...this.collisionCircle, y: potentialY + 55 })) {
                    this.y = potentialY;
                }
            } 
            else if(!this.game.A && !this.game.D && !this.game.W && !this.game.S && this.state != 6) {
                this.state = 0;
            }
        }
        
       
        // This is to normalize the speed if needed
        // if (deltaX !== 0 && deltaY !== 0) {
        //     const normalizer = Math.sqrt(2) / 2;
        //     deltaX *= normalizer;
        //     deltaY *= normalizer;
        // }
    
        // this.x += this.speed * this.game.clockTick * deltaX;
        // this.y += this.speed * this.game.clockTick * deltaY;
   
       
        // Knife Logic updated
       


        this.collisionCircle.x = this.x + 31 - this.game.camera.x;
        this.collisionCircle.y = this.y + 55 - this.game.camera.y;


        this.overlapCollisionCircle.x = this.x + 31 - this.game.camera.x;
        this.overlapCollisionCircle.y = this.y + 55 - this.game.camera.y;
        
    };

    draw(ctx) {
        if(this.dead) {
        this.animations[5].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, [this.collisionCircle, this.overlapCollisionCircle]);
            // making sure the dead animation plays, and slime is removed from world afterwards
            this.elapsedDeadAnimTime += this.game.clockTick;
            if(this.elapsedDeadAnimTime > 1.5){
                this.removeFromWorld = true;
            }
        } else {
            this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, [this.collisionCircle, this.overlapCollisionCircle]);
        }


        if (this.showStabCircle && this.game.knife) {
            // Draw the stab circle
            ctx.beginPath();
            ctx.arc(this.game.knife.stabX, this.game.knife.stabY, this.game.knife.stabRad, 0, Math.PI * 2);
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }
        
    };
};