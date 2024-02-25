class sword {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.game.sword = this;
        this.name = "sword";
        this.damage = 20; // can be changed, just randomly set to 20
        this.weapon = true;
        this.removeFromWorld = false;

        this.collisionCircle = {radius: 14, x: this.x + 17, y: this.y + 20};// collision detection circle
        
        this.overlapCollisionCircle = {radius: 10, x: this.x + 10, y: this.y + 13};// overlap collision detection circle


        this.animator = new Animator(ASSET_MANAGER.getAsset("./images/sword.png"), 0, 0, 1200, 1200, 1, 1, .02);
        this.HUDanimator = new Animator(ASSET_MANAGER.getAsset("./images/sword.png"), 0, 0, 1200, 1200, 1, 1, .02);

    }

    update() {
        if(!this.removeFromWorld){
            this.collisionCircle.x = this.x + 10 - this.game.camera.x;
            this.collisionCircle.y = this.y + 13 - this.game.camera.y;
            this.overlapCollisionCircle.x = this.x + 10 - this.game.camera.x;
            this.overlapCollisionCircle.y = this.y + 13 - this.game.camera.y;
        }
    }

    drawMiniMap(ctx, mmX, mmY){
        //drawMiniMap is called on all entities, 
        //so without this empty method the game will crash in the beginning
    }

    draw(ctx) {
        if(!this.removeFromWorld){
        this.animator.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.collisionCircle);
        }
    }
}