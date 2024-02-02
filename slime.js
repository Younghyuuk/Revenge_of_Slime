class Slime {
    constructor(game, x, y, speed, health, damage) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./slimeSprite.png");
        Object.assign(this, {x, y, speed, health, damage});

        //slime state variables
        this.direction = 0; // 0 = idle, 1 = left, 2 = right, 3 = up, 4 = down, 5 = dead, 6 = attacking 
        // this.attacking = false;
        this.dead = false;
        

        this.collisionCircle = {radius: 14, x: this.x + 31, y: this.y + 55};// collision detection circle
        this.overlapCollisionCircle = {radius: 14, x: this.x + 31, y: this.y + 55};// overlap collision detection circle
        this.attackCircle = {radius: 14, x: this.x + 31, y: this.y + 55};
        this.defendCircle = {radius: 12, x: this.x + 31, y: this.y + 55};

        this.inventory = [];
        
        // slime's animations
        this.animations = [];
        this.loadAnimations();

        this.enemyInRange = null;
        this.count = 0;

        this.elapsedTime = 0;
    };

    // this method is called when the slime attacks an npc
    attack(entity) {
        entity.getAttacked(this.damage);
        this.enemyInRange = null;
        this.count++;
        console.log("ATTACK " + this.count + "");
        // a method call to the player's character to damage them
        // sends in the damage as a parameter to determine how much health should be taken from the character
    };

    // this method is called when this slime is taking damage
    // takes in a parameter of how much damage is being done  
    getAttacked(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.dead = true;
            this.direction = 5;
        }
    };

    getCircle() {
        return this.collisionCircle;
    }

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
        this.animations[1] = new Animator(this.spritesheet, 0, 32 * 2, 32, 32, 10, .175, 2); //left
        this.animations[4] = new Animator(this.spritesheet, 0, 32, 32, 32, 10, .175, 2); // down
        this.animations[5] = new Animator(this.spritesheet, 0, 128, 32, 32, 10, .175, 2); // dead
        this.animations[6] = new Animator(this.spritesheet, 0, 96, 32, 32, 10, .107, 2); // spit attack


        // add right, and up animations


    };


    update() {
        let potentialX = this.x;
        let potentialY = this.y;
        
        // let deltaX = 0;
        // let deltaY = 0;
        
       
        if(!this.dead){
            if(this.game.A) { // left
                this.direction = 1;
                // deltaX -= 1;
                // this.x -= this.speed * this.game.clockTick;
                potentialX -= this.speed * this.game.clockTick;
                if (!this.game.map.collidesWithCircle({ ...this.collisionCircle, x: potentialX + 31 })) {
                    this.x = potentialX;
                }
            } 
            if (this.game.D) { // right
                this.direction = 1;
                // deltaX += 1;
                // this.x += this.speed * this.game.clockTick;
                potentialX += this.speed * this.game.clockTick;
                if (!this.game.map.collidesWithCircle({ ...this.collisionCircle, x: potentialX + 31 })) {
                    this.x = potentialX;
                }
            } 
            if (this.game.W) { // up
                this.direction = 4;
                // deltaY -= 1;
                // this.y -= this.speed * this.game.clockTick;

                potentialY -= this.speed * this.game.clockTick;
                if (!this.game.map.collidesWithCircle({ ...this.collisionCircle, y: potentialY + 55 })) {
                    this.y = potentialY;
                }
            } 
            if (this.game.S) { // down
                this.direction = 4;
                // deltaY += 1;
                // this.y += this.speed * this.game.clockTick;
                potentialY += this.speed * this.game.clockTick;
                if (!this.game.map.collidesWithCircle({ ...this.collisionCircle, y: potentialY + 55 })) {
                    this.y = potentialY;
                }

            }
            else if (this.game.mouseClick == true && this.enemyInRange != null){
                this.direction = 6;
                this.attack(this.enemyInRange);
                this.game.mouseClick = false;
            } 
            else {
                this.direction = 0;
            }
        }
        

        // if (deltaX !== 0 && deltaY !== 0) {
        //     const normalizer = Math.sqrt(2) / 2;
        //     deltaX *= normalizer;
        //     deltaY *= normalizer;
        // }
    
        // this.x += this.speed * this.game.clockTick * deltaX;
        // this.y += this.speed * this.game.clockTick * deltaY;
   
       
        


        this.collisionCircle.x = this.x + 31;
        this.collisionCircle.y = this.y + 55;


        this.overlapCollisionCircle.x = this.x + 31;
        this.overlapCollisionCircle.y = this.y + 55;

        this.attackCircle.x = this.x + 31;
        this.attackCircle.y = this.y + 55;

        this.defendCircle.x = this.x + 31;
        this.defendCircle.y = this.y + 55;
    

    };

    draw(ctx) {
        
        if(this.dead) {
            this.animations[5].drawFrame(this.game.clockTick, ctx, this.x, this.y, [this.collisionCircle, this.overlapCollisionCircle]);
            this.elapsedTime += this.game.clockTick;
            if(this.elapsedTime > 1.5){
                this.removeFromWorld = true;
            }
        } else {
            this.animations[this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y, [this.collisionCircle, this.overlapCollisionCircle]);
        }
    };
};