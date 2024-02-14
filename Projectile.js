
class Projectile {
    constructor(game,x, y, speed) {
        Object.assign(this, { game, x, y, speed });
        this.radius = 12;
        var dist = distance(this, this.game.mouseClickPos);
        this.maxSpeed = 200; // pixels per second
       
        this.velocity = { x: (this.game.mouseClickPos.x - this.x) / dist * this.maxSpeed, 
        y: (this.game.mouseClickPos.y - this.y) / dist * this.maxSpeed };
       
        this.facing = 5;
        
        this.elapsedTime = 0;
    };


    drawAngle(ctx, angle) {
        if (angle < 0 || angle > 359) return;


        if (!this.cache[angle]) {
           let radians = angle / 360 * 2 * Math.PI;
           let offscreenCanvas = document.createElement('canvas');

            offscreenCanvas.width = 32;
            offscreenCanvas.height = 32;

            let offscreenCtx = offscreenCanvas.getContext('2d');

            offscreenCtx.save();
            offscreenCtx.translate(16, 16);
            offscreenCtx.rotate(radians);
            offscreenCtx.translate(-16, -16);
            offscreenCtx.drawImage(this.spritesheet, 80, 0, 32, 32, 0, 0, 32, 32);
            offscreenCtx.restore();
            this.cache[angle] = offscreenCanvas;
        }
        var xOffset = 16;
        var yOffset = 16;

        ctx.drawImage(this.cache[angle], this.x - xOffset, this.y - yOffset);
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Green';
            ctx.strokeRect(this.x - xOffset, this.y - yOffset, 32, 32);
        }
    };

    // This is the anglePos logic that will take the mouse click position and the slime character's position and calculate the 
    // position where the projectile will shoot and will return the collision circle at the projectile position it will be used
    // in the update method to update the position of the projectile and wil have this projectile unlike knife to 
    // travel in a straight line and will only be removed if it hits an entity or goes off the bounds of the screen
    anglePos() {
        // let mouseX = this.game.mouseClickPos.x;
        // let mouseY = this.game.mouseClickPos.y;
        // // Calculate direction from slime to mouse click
        // let slimeX = this.game.slime.x + 31 - this.game.camera.x;
        // let slimeY = this.game.slime.y + 55 - this.game.camera.y;
        // const [unitX, unitY] = getUnitVector(mouseX, mouseY, slimeX, slimeY);
        // // Set velocity based on direction and speed
        // this.velocityX = unitX * this.speed;
        // this.velocityY = unitY * this.speed;
        // // Update position based on velocity
        // this.x += this.velocityX;
        // this.y += this.velocityY;
    
        // // Return updated collision circle
        // return {
        //     x: this.x,
        //     y: this.y,
        //     radius: 5 // Assuming a fixed radius for simplicity
        // };
    };
    
    update() {
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;

        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if ((ent instanceof enemyArcher || ent instanceof enemyKnight) && circlesIntersect(this, ent)) {
                var damage = 10 + randomInt(6);
                ent.health -= damage;
                this.removeFromWorld = true;
            }
        }

        this.facing = getFacing(this.velocity);
    };

    draw(ctx) {
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



