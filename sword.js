class sword {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.range = {radius: 20, x: this.x + 10, y: this.y + 12};
        this.damage = 10; // can be changed, just randomly set to 10
        this.speed = 3; // can be changed, just randomly set to 3

        //game would not work without this, copy pasted from enemyKnight
        this.overlapCollisionCircle = {radius: 14, x: x + 17, y: y + 20};


        this.animator = new Animator(ASSET_MANAGER.getAsset("./images/sword.png"), 0, 0, 1200, 1200, 1, 1, .02);
    }

    update() {
        this.range.x = this.x + 10;
        this.range.y = this.y + 12;
    }

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.range);
    }
}