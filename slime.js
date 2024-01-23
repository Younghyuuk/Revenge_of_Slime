class Slime {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./slimeSprite.png");

        //slime state variables
        this.direction = 0 // 0 = idle, 1 = left, 2 = right, 3 = up, 4 = down

        this.x = 10;
        this.y = 10;
        this.speed = 150;

        this.collisionCircle = {radius: 14, x: this.x + 31, y: this.y + 55};// collision detection circle
        
        this.overlapCollisionCircle = {radius: 10, x: this.x + 31, y: this.y + 55};// overlap collision detection circle

        // slime's animations
        this.animations = [];
        this.loadAnimations();
    };

    getCircle() {
        return this.collisionCircle;
    }

    loadAnimations() {

        //copied from Marriott's Mario, may have to do similar thing in our code
        // for (var i = 0; i < 7; i++) { // six states
        //     this.animations.push([]);
        //     for (var j = 0; j < 3; j++) { // three sizes (star-power not implemented yet)
        //         this.animations[i].push([]);
        //         for (var k = 0; k < 2; k++) { // two directions
        //             this.animations[i][j].push([]);
        //         }
        //     }
        // }


        
        // new Animator(spriteSheet, xSpriteSheet, ySpriteSheet, width, height, frameCount, frameDuration);
        this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 10, .175, 2);
        this.animations[1]= new Animator(this.spritesheet, 0, 32 * 2, 32, 32, 10, .175, 2);
        this.animations[4] = new Animator(this.spritesheet, 0, 32, 32, 32, 10, .175, 2);
        // add right, and up animations


    };

    // updateBB() {
    //     if (this.size === 0 || this.size === 3) {
    //         this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
    //     }
    //     else {
    //         if (this.game.down) // big mario is crouching
    //             this.BB = new BoundingBox(this.x, this.y + PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
    //         else 
    //             this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2);
    //     }
    // };


    update() {
        let deltaX = 0;
        let deltaY = 0;

        if(this.game.A) { // left
            this.direction = 1;
            // deltaX -= 1;
            this.x -= this.speed * this.game.clockTick;
        } 
        if (this.game.D) { // right
            this.direction = 1;
            // deltaX += 1;
            this.x += this.speed * this.game.clockTick;
        } 
        if (this.game.W) { // up
            this.direction = 4;
            // deltaY -= 1;
            this.y -= this.speed * this.game.clockTick;
        } 
        if (this.game.S) { // down
            this.direction = 4;
            // deltaY += 1;
            this.y += this.speed * this.game.clockTick;
        } else {
            this.direction = 0;
        }

        if (deltaX !== 0 && deltaY !== 0) {
            const normalizer = Math.sqrt(2) / 2;
            deltaX *= normalizer;
            deltaY *= normalizer;
        }
    
        // this.x += this.speed * this.game.clockTick * deltaX;
        // this.y += this.speed * this.game.clockTick * deltaY;
   

        // if (!this.game.map.collidesWithCircle(this.collisionCircle)) {
        //     this.x = potentialX;
        //     this.y = potentialY;
        //     this.collisionCircle.x = potentialX + 31;
        //     this.collisionCircle.y = potentialY + 55;
        // }


        this.collisionCircle.x = this.x + 31;
        this.collisionCircle.y = this.y + 55;

        this.overlapCollisionCircle.x = this.x + 31;
        this.overlapCollisionCircle.y = this.y + 55;

    };

    draw(ctx) {

        this.animations[this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y, [this.collisionCircle, this.overlapCollisionCircle]);

        // this.animations[0].drawFrame(this.game.clockTick, ctx, this.x, this.y);
        // this.animations[1].drawFrame(this.game.clockTick, ctx, this.x, this.y + 50);
        // this.animations[4].drawFrame(this.game.clockTick, ctx, this.x, this.y + 50 * 2);


    };
};