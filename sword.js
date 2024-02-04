class sword {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.range = {radius: 20, x: this.x + 10, y: this.y + 12};
        this.damage = 20; // can be changed, just randomly set to 20
        this.speed = 3; // can be changed, just randomly set to 3
        this.weapon = true;
        this.removeFromWorld = false;

        this.collisionCircle = {radius: 14, x: this.x + 17, y: this.y + 20};// collision detection circle
        
        this.overlapCollisionCircle = {radius: 10, x: this.x + 10, y: this.y + 13};// overlap collision detection circle


        this.animator = new Animator(ASSET_MANAGER.getAsset("./images/sword.png"), 0, 0, 1200, 1200, 1, 1, .02);
    }

    update() {
        this.collisionCircle.x = this.x + 10;
        this.collisionCircle.y = this.y + 13;
        this.overlapCollisionCircle.x = this.x + 10;
        this.overlapCollisionCircle.y = this.y + 13;
    }

    draw(ctx) {
        if(!this.removeFromWorld){
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.collisionCircle);
        }
    }
}