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

        this.takeDamageCollisionCircle = {radius: 22, x: x + 17, y: y + 20};// collision detection circle

        this.dealDamageCollisionCircle = {radius: 190, x: x + 17, y: y + 20};

        this.overlapCollisionCircle = {radius: 14, x: x + 17, y: y + 20};
    };

    // this method updates the logic, aka the state of the enemy
    update() {

        let target = {x : this.slime.getCircle().x, y : this.slime.getCircle().y};
        let current = {x : this.takeDamageCollisionCircle.x, y : this.takeDamageCollisionCircle.y};

        var dist = this.distance(current, target);

        if (dist < this.dealDamageCollisionCircle.radius + this.slime.collisionCircle.radius) {
            this.attack();
        } else { 
            this.velocity = {x : (target.x - current.x) / dist * this.speed, y : (target.y - current.y) / dist * this.speed};

            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
        }

        // update collision circle for taking damage
        this.takeDamageCollisionCircle.x = this.x + 17;
        this.takeDamageCollisionCircle.y = this.y + 20;

        //update collision circle for dealing damage
        this.dealDamageCollisionCircle.x = this.x + 17;
        this.dealDamageCollisionCircle.y = this.y + 20;

        // update collison circle for NPC overlapping
        this.overlapCollisionCircle.x = this.x + 17;
        this.overlapCollisionCircle.y = this.y + 20;
    };

    distance(a, b) {
        return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
    }

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
            this.removeFromWorld = true;
        }
    };

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, [this.takeDamageCollisionCircle, this.dealDamageCollisionCircle, this.overlapCollisionCircle]);
    }
};