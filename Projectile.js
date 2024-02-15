
class Projectile {
    constructor(game,x, y, speed) {
        this.game = game;
        Object.assign(this, { x, y, speed });
        this.radius = 5;
        this.game.projectile = this;
        var dist = distance(this, this.game.mouseClickPos);
        this.maxSpeed = 700; // pixels per second
       
        this.velocity = { x: (this.game.mouseClickPos.x - this.x) / dist * this.maxSpeed, 
        y: (this.game.mouseClickPos.y - this.y) / dist * this.maxSpeed };
       
        this.overlapCollisionCircle = {radius: this.radius, x: this.x + 10, y: this.y + 13};

        this.facing = 5;
        this.bc = {x: this.x, y: this.y, radius: this.radius};
        this.elapsedTime = 0;
    };


    drawAngle(ctx, angle) {
        // if (angle < 0 || angle > 359) return;


        // if (!this.cache[angle]) {
        //    let radians = angle / 360 * 2 * Math.PI;
        //    let offscreenCanvas = document.createElement('canvas');

        //     offscreenCanvas.width = 32;
        //     offscreenCanvas.height = 32;

        //     let offscreenCtx = offscreenCanvas.getContext('2d');

        //     offscreenCtx.save();
        //     offscreenCtx.translate(16, 16);
        //     offscreenCtx.rotate(radians);
        //     offscreenCtx.translate(-16, -16);
        //     // offscreenCtx.drawImage(this.spritesheet, 80, 0, 32, 32, 0, 0, 32, 32);
        //     offscreenCtx.restore();
        //     this.cache[angle] = offscreenCanvas;
        // }
        // var xOffset = 16;
        // var yOffset = 16;

        // ctx.drawImage(this.cache[angle], this.x - xOffset, this.y - yOffset);
        // if (PARAMS.DEBUG) {
        //     ctx.strokeStyle = 'Green';
        //     ctx.strokeRect(this.x - xOffset, this.y - yOffset, 32, 32);
        // }
    };


    
    update() {
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
        this.bc = {x: this.x, y: this.y, radius: this.radius};
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if ((ent instanceof enemyArcher || ent instanceof enemyKnight) && collide(this.radius, ent.radiusZone)) {
                ent.health -= this.damage;
                
                this.removeFromWorld = true;
            }
        }

        // this.facing = getFacing(this.velocity);
    };

    draw(ctx) {
        ctx.beginPath(); // Start drawing a new path
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); // Draw a circle representing the projectile
        ctx.fillStyle = 'black'; // Set the fill color for the projectile
        ctx.fill();
        // var xOffset = 16;
        // var yOffset = 16;
        // if (this.smooth) {
        //     let angle = Math.atan2(this.velocity.y , this.velocity.x);
        //     if (angle < 0) angle += Math.PI * 2;
        //     let degrees = Math.floor(angle / Math.PI / 2 * 360);

        //     this.drawAngle(ctx, degrees);
        // } else {
        //     if (this.facing < 5) {
        //         // this.animations[this.facing].drawFrame(this.game.clockTick, ctx, this.x - xOffset, this.y - yOffset, 1);
        //     } else {
        //         ctx.save();
        //         ctx.scale(-1, 1);
        //         // this.animations[8 - this.facing].drawFrame(this.game.clockTick, ctx, -(this.x) - 32 + xOffset, this.y - yOffset, 1);
        //         ctx.restore();
        //     }
        // }
    };
};



