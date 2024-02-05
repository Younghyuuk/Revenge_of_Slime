
class Projectile {
    constructor(game, x, y, target, spritePath) {
        Object.assign(this, { game, x, y, target, spritePath});
        this.radius = 12;

        this.smooth = false;


        var dist = distance(this, this.target);
        this.maxSpeed = 200; // pixels per second

        this.velocity = { x: (this.target.x - this.x) / dist * this.maxSpeed, y: (this.target.y - this.y) / dist * this.maxSpeed };

        this.cache = [];
        
        this.facing = 5;
        
        this.elapsedTime = 0;

        // this.animator = new AnimatorRotateOnce(ASSET_MANAGER.getAsset(spritesheetPath), xStart, yStart, width, height, angle, frameCount, scale, fudgeScaling)

        // this.bc = new BoundingCircle(this.posX, this.posY, PROJECTILE_BC_RADIUS)
        // this.bb = new BoundingBox(this.posX, this.posY, PROJECTILE_BB_DIMEN, PROJECTILE_BB_DIMEN)
        // this.bb.updateSides()
    }

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

    update(){
        this.heatSeeking = document.getElementById("heatseeking").checked;
        this.smooth = document.getElementById("smooth").checked;

        if (this.heatSeeking) {
            var dist = distance(this, this.target);
            this.velocity = { x: (this.target.x - this.x) / dist * this.maxSpeed, y: (this.target.y - this.y) / dist * this.maxSpeed };
        }

        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;

        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (this.towerTeam && (ent instanceof Archer || ent instanceof Footman) && collide(this, ent)) {
                var damage = 10 + randomInt(6);
                ent.hitpoints -= damage;
                this.game.addEntity(new Score(this.game, ent.x, ent.y, damage));
                this.removeFromWorld = true;
            }
            if (!this.towerTeam && ent instanceof Tower && collide(this, ent)) {
                var damage = 7 + randomInt(4);
                ent.hitpoints -= damage;
                this.game.addEntity(new Score(this.game, ent.x, ent.y, damage));
                this.removeFromWorld = true;
            }
        }

        this.facing = getFacing(this.velocity);
    }

    checkCollisions() {
        //ABSTRACT
    }

    automaticDespawnHandler() {
        this.despawnTime -= GAME_ENGINE.clockTick
        if (this.despawnTime <= 0) {
           this.removeFromWorld = true
        }
    }

    draw() {
        //super.draw()

        var xOffset = 16;
        var yOffset = 16;
        if (this.smooth) {
            let angle = Math.atan2(this.velocity.y , this.velocity.x);
            if (angle < 0) angle += Math.PI * 2;
            let degrees = Math.floor(angle / Math.PI / 2 * 360);

            this.drawAngle(ctx, degrees);
        } else {
            if (this.facing < 5) {
                this.animations[this.facing].drawFrame(this.game.clockTick, ctx, this.x - xOffset, this.y - yOffset, 1);
            } else {
                ctx.save();
                ctx.scale(-1, 1);
                this.animations[8 - this.facing].drawFrame(this.game.clockTick, ctx, -(this.x) - 32 + xOffset, this.y - yOffset, 1);
                ctx.restore();
            }
        }
    };

    // movementHandler() {
    //     this.posX += this.movementVectorX * GAME_ENGINE.clockTick
    //     this.posY += this.movementVectorY * GAME_ENGINE.clockTick
    // }


    // saveLastBB() {
    //     this.lastbb = this.bb
    //     this.bb = new BoundingBox(
    //         this.posX - (this.bb.width/ 2),
    //         this.posY - (this.bb.height/ 2),
    //         PROJECTILE_BB_DIMEN, PROJECTILE_BB_DIMEN)
    // }

    // updateCollision() {
    //     this.bb.x = this.posX - (this.bb.width/ 2)
    //     this.bb.y = this.posY - (this.bb.height/ 2)
    //     this.bb.updateSides()

    //     this.bc.x = this.posX
    //     this.bc.y = this.posY
    // }

   
};


