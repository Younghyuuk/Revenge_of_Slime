class pistol {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.game.pistol = this;
        this.name = "pistol";

        this.weapon = true;
        this.removeFromWorld = false;

        this.collisionCircle = {radius: 25, x: this.game.slime.x + 10, y: this.game.slime.y + 10};// collision detection circle
        
        this.overlapCollisionCircle = {radius: 10, x: this.x + 10, y: this.y + 13};// overlap collision detection circle

      
                                            // spritesheet, xStart, yStart, width, height, frameCount, frameDuration, scale
        this.animator = new Animator(ASSET_MANAGER.getAsset("./images/pistol.png"), 5, 5, 25, 15, 1, 1, 2);
        this.HUDanimator = new Animator(ASSET_MANAGER.getAsset("./images/pistol.png"), 5, 5, 15, 15, 1, 1, 2);

    }

 
  
    
    update() {
        if(!this.removeFromWorld){
            this.collisionCircle.x = this.x + 10 - this.game.camera.x;
            this.collisionCircle.y = this.y + 13 - this.game.camera.y;
            this.overlapCollisionCircle.x = this.x + 10 - this.game.camera.x;
            this.overlapCollisionCircle.y = this.y + 13 - this.game.camera.y;
        }
    };

    drawMiniMap(ctx, mmX, mmY){
        //drawMiniMap is called on all entities, 
        //so without this empty method the game will crash in the beginning
    }

    draw(ctx) {
        if(!this.removeFromWorld){
            this.animator.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, []);
        }
        
    };

};