class knife {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.range = {radius: 15, x: this.x + 9, y: this.y + 12};
        this.damage = 5; // can be changed, just randomly set to 5
        this.speed = 5; // can be changed, just randomly set to 5

        //game would not work without this, copy pasted from enemyKnight
        this.overlapCollisionCircle = {radius: 14, x: x + 17, y: y + 20};


        this.animator = new Animator(ASSET_MANAGER.getAsset("./images/knife.png"), 0, 0, 350, 600, 1, 1, .05);
    }

    update() {
        this.range.x = this.x + 9;
        this.range.y = this.y + 12;
    }

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.range);
    }
}