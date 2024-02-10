class knife {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.game.knife = this;
        this.name = "knife";
        // this.range = {radius: 13, x: this.x + 9, y: this.y + 12};
        this.damage = 100; // can be changed, just randomly set to 15
        this.speed = 5; // can be changed, just randomly set to 5
        this.weapon = true;
        this.removeFromWorld = false;
        this.assignToSlime = false;

        this.collisionCircle = {radius: 25, x: this.game.slime.x + 10, y: this.game.slime.y + 10};// collision detection circle
        
        this.overlapCollisionCircle = {radius: 10, x: this.x + 10, y: this.y + 13};// overlap collision detection circle

        this.stabX = 0;
        this.stabY = 0;
        this.stabRad = 0;
                                            // spritesheet, xStart, yStart, width, height, frameCount, frameDuration, scale
        this.animator = new Animator(ASSET_MANAGER.getAsset("./images/knife.png"), 0, 0, 15, 15, 1, 1, 2);
    }

 
    stabPos() {
        // Ensure we have valid mouse click positions before proceeding
        if (!this.game.mouseClickPos || !this.game.slime) {
            console.error("Missing mouse click position or slime character.");
            return null; // Exit the function if necessary data is missing
        }
    
        // Get the mouse click position
        let mouseX = this.game.mouseClickPos.x;
        let mouseY = this.game.mouseClickPos.y;
    
        // Get the slime character's position with adjustments for specific anchor points
        let slimeX = this.game.slime.x + 31 - this.game.camera.x; // Adjusted X-coordinate of the slime
        let slimeY = this.game.slime.y + 55 - this.game.camera.y; // Adjusted Y-coordinate of the slime
    
        // Calculate the angle between the mouse click position and the slime character's position
        this.angle = Math.atan2(mouseY - slimeY, mouseX - slimeX);
    
        // Calculate the position where the stab action will occur, 30 units away from the slime
        this.stabX = slimeX + Math.cos(this.angle) * 30;
        this.stabY = slimeY + Math.sin(this.angle) * 30;
    
        // Define the radius of the stab action's collision circle
        this.stabRad = 13; // Radius of the collision circle

        this.stabCircle = {
            x: this.stabX, // X-coordinate of the collision circle's center
            y: this.stabY, // Y-coordinate of the collision circle's center
            radius: this.stabRad, // Radius of the collision circle
        };
        
        
        // Create and return the collision circle at the stab position
        return this.stabCircle;
        // {
        //     x: this.stabX, // X-coordinate of the collision circle's center
        //     y: this.stabY, // Y-coordinate of the collision circle's center
        //     radius: this.stabRad, // Radius of the collision circle
        // };
    }

    // rotateKnife(spriteSheet, xStart, yStart, width, height, theta, scale) {
    //     let offscreenCanvas = document.createElement('canvas');
    //     let dimension = Math.max(width, height) * scale;
    //     offscreenCanvas.width = dimension;
    //     offscreenCanvas.height = dimension;
    //     let offscreenCtx = offscreenCanvas.getContext('2d');
    //     offscreenCtx.imageSmoothingEnabled = false;
    //     offscreenCtx.save();
    //     offscreenCtx.translate(offscreenCanvas.width / 2, offscreenCanvas.height / 2);
    //     offscreenCtx.rotate(theta);
    //     offscreenCtx.translate(-offscreenCanvas.width / 2, -offscreenCanvas.height / 2);
    //     offscreenCtx.drawImage(spriteSheet, xStart, yStart, width, height,
    //                            width * scale < dimension ? (dimension - width * scale) / 2 : 0,
    //                            height * scale < dimension ? (dimension - height * scale) / 2: 0, width * scale, height * scale);
    //     offscreenCtx.restore();
    //     return offscreenCanvas;
    // };
    
        
    
    
    update() {
        if(!this.removeFromWorld){
            this.collisionCircle.x = this.x + 10 - this.game.camera.x;
            this.collisionCircle.y = this.y + 13 - this.game.camera.y;
            this.overlapCollisionCircle.x = this.x + 10 - this.game.camera.x;
            this.overlapCollisionCircle.y = this.y + 13 - this.game.camera.y;
        }
        if(this.assignToSlime){
                this.x = this.game.slime.x + 10;
                this.y = this.game.slime.y + 13;
                if(this.game.slime.state == 6){
                    this.x = this.stabCircle.x + this.game.camera.x;
                    this.y = this.stabCircle.y + this.game.camera.y;
                    // console.log(`slimes coords: {${this.game.slime.x}, ${this.game.slime.y}\n
                    //         knife coords: {${this.x}, ${this.y}}\n
                    //         stabCircle coords:{${this.stabCircle.x}, ${this.stabCircle.y}}`);
                }
                
                
        }
        // this.stabPos();
    };

    draw(ctx) {
        // if(this.assignToSlime){
        //     this.x = this.game.slime.x + 10;
        //     this.y = this.game.slime.y + 10;
        //     this.animator.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.collisionCircle);
        // } else if(!this.removeFromWorld){
        //     this.animator.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.collisionCircle);
        // }

        this.animator.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.collisionCircle);

        
    };

};