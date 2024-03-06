class bush {
    constructor(game, x, y){
        Object.assign(this, {game, x, y}); 
        this.spritesheet = ASSET_MANAGER.getAsset("./images/bush.png");
        this.animation = new Animator(this.spritesheet, 0, 0, 32, 32, 1, 1, 3);

        this.obstacle = true

        this.collisionCircle = {radius: 43, x: this.x + 48 - this.game.camera.x, y: this.y + 50 - this.game.camera.y};
        this.overlapCollisionCircle = {radius: 43, x: this.x + 48 - this.game.camera.x, y: this.y + 50 - this.game.camera.y};


    }

    update() {
        this.collisionCircle.x = this.x + 48 - this.game.camera.x;
        this.collisionCircle.y = this.y + 50 - this.game.camera.y;

        // this.overlapCollisionCircle = this.collisionCircle;
        this.overlapCollisionCircle.x = this.x + 48 - this.game.camera.x;
        this.overlapCollisionCircle.y = this.y + 50 - this.game.camera.y;

    }

    drawMiniMap(ctx, mmX, mmY){
        ctx.fillStyle = "#3c8022"; // color of bush
        ctx.beginPath();
        ctx.arc(mmX + this.x / 32, mmY + this.y / 32, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, [this.collisionCircle, this.overlapCollisionCircle]);
    }
}
