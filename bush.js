class bush {
    constructor(game, x, y){
        Object.assign(this, {game, x, y}); 
        this.spritesheet = ASSET_MANAGER.getAsset("./images/bush.png");
        this.animation = new Animator(this.spritesheet, 0, 0, 32, 32, 1, 1, 3);
        this.game.bush = this;
        this.obstacle = true

        this.collisionCircle = {radius: 35, x: this.x + 48 - this.game.camera.x, y: this.y + 50 - this.game.camera.y};
        this.overlapCollisionCircle = {radius: 43, x: this.x + 48 - this.game.camera.x, y: this.y + 50 - this.game.camera.y};


    }

    update() {
        this.collisionCircle.x = this.x + 48 - this.game.camera.x;
        this.collisionCircle.y = this.y + 50 - this.game.camera.y;

        this.overlapCollisionCircle = this.collisionCircle;
        // this.overlapCollisionCircle.x = this.x + 48 - this.game.camera.x;
        // this.overlapCollisionCircle.y = this.y + 50 - this.game.camera.y;
        this.entities = this.game.entities; 

        // for(let i = 0; i < this.entities.length; i++){
        //     if (this.entities[i] != this && circlesIntersect(this.collisionCircle, this.entities[i].collisionCircle)) {
        //         this.handleCollision(this.entities[i]);
        //     }
        // }

        this.game.entities.forEach(entity => {
            if (this != entity && circlesIntersect(this.collisionCircle, entity.collisionCircle)) {
                this.handleCollision(entity);
            }
        });
    }

    handleCollision(entity){

        let dist = distance(this.collisionCircle, entity.collisionCircle);
        // let delta = (dist - obstacle.overlapCollisionCircle.radius - entity.overlapCollisionCircle.radius) /2 ;
        // let delta = this.overlapCollisionCircle.radius + entity.overlapCollisionCircle.radius - dist;
        // let delta = this.collisionCircle.radius + entity.collisionCircle.radius - dist;
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
        ctx.arc(mmX + this.x / 32, mmY + this.y / 32, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, [/*this.collisionCircle, this.overlapCollisionCircle*/]);
        // this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, [this.collisionCircle, this.overlapCollisionCircle]);
    }
}
