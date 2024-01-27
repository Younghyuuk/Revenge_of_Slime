class knife {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.range = {radius: 15, x: this.x + 9, y: this.y + 12};
        this.damage = 15; // can be changed, just randomly set to 15
        this.speed = 5; // can be changed, just randomly set to 5
        this.weapon = true;
        this.removeFromWorld = false;

        this.collisionCircle = {radius: 14, x: this.x + 10, y: this.y + 13};// collision detection circle
        
        this.overlapCollisionCircle = {radius: 10, x: this.x + 10, y: this.y + 13};// overlap collision detection circle




        this.animator = new Animator(ASSET_MANAGER.getAsset("./images/knife.png"), 0, 0, 350, 600, 1, 1, .05);
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