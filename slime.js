class Slime {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./slimeSprite.png");

        //slime state variables
        this.direction = 0 // 0 = idle, 1 = left, 2 = right, 3 = up, 4 = down

        this.x = 10;
        this.y = 10;
        this.speed = 50;

        // slime's animations
        this.animations = [];
        this.loadAnimations();
    };

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
        this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 10, .175);
        this.animations[1]= new Animator(this.spritesheet, 0, 32 * 2, 32, 32, 10, .175);
        this.animations[4] = new Animator(this.spritesheet, 0, 32, 32, 32, 10, .175);
        // add right, and up animations


    };

    update() {

        if(this.game.A) { // left
            this.direction = 1;
            this.x -= this.speed * this.game.clockTick;
        } else if (this.game.D) { // right
            this.direction = 1;
            this.x += this.speed * this.game.clockTick;
        } else if (this.game.W) { // up
            this.direction = 4;
            this.y -= this.speed * this.game.clockTick;
        } else if (this.game.S) { // down
            this.direction = 4;
            this.y += this.speed * this.game.clockTick;
        } else {
            this.direction = 0;
        }

    };

    draw(ctx) {

        this.animations[this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y);

        // this.animations[0].drawFrame(this.game.clockTick, ctx, this.x, this.y);
        // this.animations[1].drawFrame(this.game.clockTick, ctx, this.x, this.y + 50);
        // this.animations[4].drawFrame(this.game.clockTick, ctx, this.x, this.y + 50 * 2);


    };
};