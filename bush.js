class bush {
    constructor(game, x, y){
        Object.assign(this, {game, x, y}); 
        this.spritesheet = ASSET_MANAGER.getAsset("./images/bush.png");
        this.spritesheet2 = ASSET_MANAGER.getAsset("./images/bush2.png");
        this.spritesheet3 = ASSET_MANAGER.getAsset("./images/bush3.png");


        if(this.x % 2 == 0){
            //bush with red flowers
            this.animation = new Animator(this.spritesheet2, 0, 0, 32, 32, 1, 1, 3);
        } else if(this.y % 2 == 0){
            //bush with yellow flowers
            this.animation = new Animator(this.spritesheet3, 0, 0, 32, 32, 1, 1, 3);
        } else {
            //regular bush
            this.animation = new Animator(this.spritesheet, 0, 0, 32, 32, 1, 1, 3);
        }

        this.obstacle = true

        this.collisionCircle = {radius: 35, x: this.x + 48 - this.game.camera.x, y: this.y + 50 - this.game.camera.y};
        this.overlapCollisionCircle = {radius: 43, x: this.x + 48 - this.game.camera.x, y: this.y + 50 - this.game.camera.y};


    }

    update() {
        this.collisionCircle.x = this.x + 48 - this.game.camera.x;
        this.collisionCircle.y = this.y + 50 - this.game.camera.y;
        this.overlapCollisionCircle.x = this.x + 48 - this.game.camera.x;
        this.overlapCollisionCircle.y = this.y + 50 - this.game.camera.y;


        this.game.entities.forEach(entity => {
            if (entity instanceof enemyArcher || entity instanceof enemyKnight || entity instanceof Slime || entity instanceof WizardBoss) {
                if (this != entity && circlesIntersect(this.collisionCircle, entity.collisionCircle)) {
                    this.handleCollision(entity);
                }
            }
        });
    }

    handleCollision(entity){
        if(entity.hasOwnProperty('weapon')){
            entity.x += 50;
            entity.y += 50;
            return;
        }
        let dist = distance(this.collisionCircle, entity.collisionCircle);
        let delta = (dist - this.collisionCircle.radius - entity.collisionCircle.radius) / 2;


        if(dist > 0) {
            let dxNormalized = (this.x - entity.x) / dist;
            let dyNormalized = (this.y - entity.y) / dist;

            entity.x += dxNormalized * delta;
            entity.y += dyNormalized * delta;
        } else {
            let dxNormalized = (this.x - entity.x);
            let dyNormalized = (this.y - entity.y);

            entity.x -= dxNormalized * delta;
            entity.y -= dyNormalized * delta;
        }
    }

    drawMiniMap(ctx, mmX, mmY){
        ctx.fillStyle = "#3c8022"; // color of bush
        ctx.beginPath();
        ctx.arc(mmX + this.x / 32, mmY + this.y / 32, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, [/*this.collisionCircle, this.overlapCollisionCircle*/]);
        // this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, [this.collisionCircle, this.overlapCollisionCircle]);
    }
}
