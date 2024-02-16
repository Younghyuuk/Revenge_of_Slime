class Slime {
    constructor(game, x, y, speed, health, damage) {
        console.log("slime is created");
        this.game = game;

        this.NoWeaponSpritesheet = ASSET_MANAGER.getAsset("./images/blueSlime.png");
        this.KnifeSpritesheet = ASSET_MANAGER.getAsset("./images/knifeBlueSlime.png");
        this.knifeAttackSpriteSheet = ASSET_MANAGER.getAsset("./images/practiceKnifeAttack.png");


        Object.assign(this, {x, y, speed, health, damage});

        this.game.slime = this;
        //slime state variables
        this.state = 0; // 0 = idle, 1 = left, 2 = right, 3 = up, 4 = down, 5 = dead, 6 = attacking
        this.weaponState = 0; // 0 = no weapon, 1 = knife, 2 = pistol
        this.attackAngle = 0; // 1 = left, 2 = right, 3 = up, 4 = down
        this.dead = false;
        

        this.collisionCircle = {radius: 14, x: this.x + 31, y: this.y + 55};// collision detection circle
        this.overlapCollisionCircle = {radius: 14, x: this.x + 31, y: this.y + 55};// overlap collision detection circle

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


        // all the knife stuff.
        this.hasKnife = false; // Indicates if the slime has a knife to attack with
        // console.log(this.inventory.some(item => item.name === "knife");
        this.knifeCooldown = 0;

          //pistol and gun parameters
        this.pistolCD = 0.8;
        this.pistolDamage = 30;
        this.gunMaxSpeed = 1000;
        this.elapsedTime = 0;
        this.gunRadius = 5;
  
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

    performKnifeAttack(ctx) {
        let stabCircle = this.game.knife.stabPos();
    
        if (this.hasKnife && this.game.mouseClick) {

            this.attackDirection();
            this.showStabCircle = true; // Set to true to show the stab circle
            this.state = 6;
    
            // Check for collisions with entities using stabCircle
            this.game.entities.forEach(entity => {
                if (entity instanceof enemyArcher || entity instanceof enemyKnight) {
                    if(this.circlesIntersect(entity.collisionCircle, stabCircle)) {
                        entity.getAttacked(this.game.knife.damage);
                        console.log("Enemy health: " + entity.health);
                    }
                }
            });

            // console.log(`Mouse Click x: ${this.game.mouseClickPos.x} y:${this.game.mouseClickPos.y}\nSlime x: ${this.x} y:${this.y}`);

            // Draw the stab circle if showStabCircle is true
    
            // Reset mouseClick to prevent continuous attacks
            this.game.mouseClick = false;
        }
    };

    attackDirection() {
        let mouseX = this.game.mouseClickPos.x;
        let mouseY = this.game.mouseClickPos.y;

        let slimeX = this.x + 31 - this.game.camera.x;
        let slimeY = this.y + 55 - this.game.camera.y;
    
        // Calculate the angle between the mouse click and the slime's position
        let angle = Math.atan2(mouseY - slimeY, mouseX - slimeX);
    
        // Convert the angle to a int (1 = left, 2 = right, 3 = up, 4 = down)
        let angleInDegrees = (180 / Math.PI) * angle;
        if (angleInDegrees < 45 && angleInDegrees >= -45) {
            this.attackAngle = 2; // right
        } else if (angleInDegrees < 135 && angleInDegrees >= 45) {
            this.attackAngle = 4; // down
        } else if (angleInDegrees >= 135 || angleInDegrees < -135) {
            this.attackAngle = 1; // left
        } else {
            this.attackAngle = 3; // up
        }

    }
    
    

    getCircle() {
        return this.collisionCircle;
    };

    circlesIntersect(circle1, circle2) {
        let dx = circle1.x - circle2.x;
        let dy = circle1.y - circle2.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (circle1.radius + circle2.radius);
    };

    loadAnimations() {

        // // copied from Marriott's Mario, may have to do similar thing in our code
        for (var i = 0; i < 2; i++) { // one weapon (others not implemented yet)
            this.animations.push([]);
            for (var j = 0; j < 7; j++) { // six states
                this.animations[i].push([]);
                for (var k = 0; k < 5; k++) { // 4 attack directions (currently)
                    this.animations[i][j].push([]);
                }
            }
        }


        // 1st 0 = no weapon, 1 = knife, 2 = pistol
        // 2nd 0 = idle, 1 = left, 2 = right, 3 = up, 4 = down, 5 = dead, 6 = attacking
        // 3rd 1 = left, 2 = right, 3 = up, 4 = down
        // new Animator(spriteSheet, xSpriteSheet, ySpriteSheet, width, height, frameCount, frameDuration, scale);
        this.animations[0][0][0] = new Animator(this.NoWeaponSpritesheet, 0, 0, 32, 32, 10, .175, 2); // idle
        this.animations[0][1][0] = new Animator(this.NoWeaponSpritesheet, 0, 128, 32, 32, 10, .175, 2); //left
        this.animations[0][2][0] = new Animator(this.NoWeaponSpritesheet, 0, 96, 32, 32, 10, .175, 2); // right
        this.animations[0][3][0] = new Animator(this.NoWeaponSpritesheet, 0, 64, 32, 32, 10, .175, 2); // up
        this.animations[0][4][0] = new Animator(this.NoWeaponSpritesheet, 0, 32, 32, 32, 10, .175, 2); // down
        this.animations[0][5][0] = new Animator(this.NoWeaponSpritesheet, 0, 192, 32, 32, 10, .175, 2); // dead
        this.animations[0][6][0] = new Animator(this.NoWeaponSpritesheet, 0, 160, 32, 32, 10, .175, 2); // spit attack

        this.animations[1][0][0] = new Animator(this.KnifeSpritesheet, 0, 0, 32, 32, 10, .175, 2); // idle
        this.animations[1][1][0] = new Animator(this.KnifeSpritesheet, 0, 128, 32, 32, 10, .175, 2); //left
        this.animations[1][2][0] = new Animator(this.KnifeSpritesheet, 0, 96, 32, 32, 10, .175, 2); // right
        this.animations[1][3][0] = new Animator(this.KnifeSpritesheet, 0, 64, 32, 32, 10, .175, 2); // up
        this.animations[1][4][0] = new Animator(this.KnifeSpritesheet, 0, 32, 32, 32, 10, .175, 2); // down
        this.animations[1][5][0] = new Animator(this.KnifeSpritesheet, 0, 192, 32, 32, 10, .175, 2); // dead
        // this.animations[1][6] = new Animator(this.KnifeSpritesheet, 0, 160, 32, 32, 10, .175, 2); // old knife stab attack
        this.animations[1][6][0] = new Animator(this.knifeAttackSpriteSheet, 0, 0, 64, 32, 10, .095, 2); // new knife stab attack place holder
        this.animations[1][6][1] = new Animator(this.knifeAttackSpriteSheet, 0, 0, 64, 32, 10, .095, 2); // left
        this.animations[1][6][2] = new Animator(this.knifeAttackSpriteSheet, 0, 32, 64, 32, 10, .095, 2); // right
        this.animations[1][6][3] = new Animator(this.knifeAttackSpriteSheet, 0, 64, 64, 32, 10, .095, 2); // up
        this.animations[1][6][4] = new Animator(this.knifeAttackSpriteSheet, 0, 96, 64, 32, 10, .095, 2); // down

                                                         




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
            this.performKnifeAttack(this.game.ctx);
            if (this.showStabCircle) {
                if (!this.stabCircleTimer) { // Initialize the timer the first time
                    this.stabCircleTimer = 120; // e.g., 60 frames = 1 second at 60 FPS
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
            this.animations[this.weaponState][this.state][0].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, [this.collisionCircle, this.overlapCollisionCircle]);
            
            this.elapsedDeadAnimTime += this.game.clockTick;
                if(this.elapsedDeadAnimTime > 1.5){
                    this.removeFromWorld = true;
                }
        } else if(this.state == 6){ // attacking                                                       // magic numbers to keep the slime centered - 18    + 18
            this.animations[this.weaponState][this.state][this.attackAngle].drawFrame(this.game.clockTick, ctx, this.x - 18 - this.game.camera.x, this.y + 18 - this.game.camera.y, [this.collisionCircle, this.overlapCollisionCircle]);
        } else {
            this.animations[this.weaponState][this.state][0].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, [this.collisionCircle, this.overlapCollisionCircle]);
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