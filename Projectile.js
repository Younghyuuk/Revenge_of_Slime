class Projectile {
    constructor(game,x, y, maxSpeed, damage, radius, type) {
        this.game = game;
        Object.assign(this, { x, y, maxSpeed, damage, radius, type });
        // this.radius = 5;
        this.game.projectile = this;
        // this.maxSpeed = maxSpeed; // pixels per second
    
        this.velocity = 0
        this.calculateVelocity();
        
        this.overlapCollisionCircle = {radius: this.radius, x: this.x + 10, y: this.y + 13};

        this.facing = 5;
        this.elapsedTime = 0;

        this.animations = [];

        this.bulletSpritesheet = ASSET_MANAGER.getAsset("./images/bullet.png");
        this.arrowSpritesheet = ASSET_MANAGER.getAsset("./images/arrow.png");
        this.energyBlastSpritesheet = ASSET_MANAGER.getAsset("./images/energyBlast.png");
        this.animations[0] = new Animator(this.energyBlastSpritesheet, 0, 0, 27, 24, 3, .1, 1.75);
        this.animations[1] = new Animator(this.bulletSpritesheet, 0, 0, 14, 14, 1, .1, 1.75);

        this.cache = [];
       
    };

    // this method find out if this is an enemy projectile or slime projectile (velocity calculation is different for both)
    // then calculates the velocity.
    calculateVelocity() {
        // add more if statements for slime with different weapons 
        if (this.type == "slimePistol") {
            var dist = distance(this, this.game.mouseClickPos);
            this.velocity = { x: (this.game.mouseClickPos.x - this.x) / dist * this.maxSpeed, 
            y: (this.game.mouseClickPos.y - this.y) / dist * this.maxSpeed };
        } else {
            var dist = distance(this, this.game.levelBuilder.slime);
            this.velocity = { x: ((this.game.levelBuilder.slime.x + 31) - this.x) / dist * this.maxSpeed, 
            y: ((this.game.levelBuilder.slime.y + 62) - this.y) / dist * this.maxSpeed };
        }
    };

    isOutsideGameBounds() {
        if (this.x > 3200 || this.x < 0 || this.y > 3200 || this.y < 0) {
            return true;
        } else {
            return false;
        }
    };


    drawAngle(ctx, angle) {

        let width;
        let height;
        if (angle < 0 || angle > 359) return;

        // add more if statements for different enemies with ranged attacks or different slime weapons
        let spritesheet;
        if (this.type === "archer") {
            spritesheet = this.arrowSpritesheet;
            width = 28;
            height = 10;
        } else if (this.type === "slimePistol") {
            spritesheet = this.bulletSpritesheet;
            width = 16;
            height = 10;
        }

        if (!this.cache[angle]) {
           let radians = angle / 360 * 2 * Math.PI;
           let offscreenCanvas = document.createElement('canvas');

            offscreenCanvas.width = width;
            offscreenCanvas.height = width;

            let offscreenCtx = offscreenCanvas.getContext('2d');

            offscreenCtx.save();
            offscreenCtx.translate(height, height);
            offscreenCtx.rotate(radians);
            offscreenCtx.translate(height * -1, height * -1);
            offscreenCtx.drawImage(spritesheet, 0, 0, width, height, height, 0, width, height);
            offscreenCtx.restore();
            this.cache[angle] = offscreenCanvas;
        }
        var xOffset = width / 2;
        var yOffset = height / 2;

        ctx.drawImage(this.cache[angle], this.x - xOffset, this.y - yOffset);
        // if (PARAMS.DEBUG) {
        //     ctx.strokeStyle = 'Green';
        //     ctx.strokeRect(this.x - xOffset, this.y - yOffset, 12, 6);
        // }
    };


    
    update() {
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;

        if (this.type == "archer" || this.type == "wizard") {
            if (circlesIntersect(this, this.game.levelBuilder.slime.collisionCircle)) {
                this.game.levelBuilder.slime.getAttacked(this.damage);
                this.removeFromWorld = true;
            }

        } else {
            for (var i = 0; i < this.game.entities.length; i++) {
                var ent = this.game.entities[i];
                if ((ent instanceof enemyArcher || ent instanceof enemyKnight || ent instanceof WizardBoss) && circlesIntersect(this, ent.collisionCircle)) {
                    ent.getAttacked(this.damage);
                    
                    
                    if (this.game.slime.weaponState !== 4) {
                        this.removeFromWorld = true;
                    }
    
                    if (this.game.slime.weaponState === 5) {
                        this.game.slime.rocketRadius = 50;
                    }
                }   
            }
        }
        setTimeout(() => {
            this.removeFromWorld = true;
        }, 1000);
        // this.facing = getFacing(this.velocity);
    };

    draw(ctx) {
        // ctx.beginPath(); // Start drawing a new path
        // ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); // Draw a circle representing the projectile
        // ctx.fillStyle = 'black'; // Set the fill color for the projectile
        // ctx.fill();
        // var xOffset = 16;
        // var yOffset = 16;
        // if (this.smooth) {

        if (this.type == "archer") {
            let angle = Math.atan2(this.velocity.y , this.velocity.x);
            if (angle < 0) angle += Math.PI * 2;
            let degrees = Math.floor(angle / Math.PI / 2 * 360);

            this.drawAngle(ctx, degrees);
        } else {
            if (this.type == "slimePistol") {
                this.animations[1].drawFrame(this.game.clockTick, ctx, this.x, this.y, []);
            } else if (this.type == "wizard") {
                this.animations[0].drawFrame(this.game.clockTick, ctx, this.x, this.y, []);
            }
        }



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

    drawMiniMap(ctx, mmX, mmY){
        //drawMiniMap is called on all entities, 
        //so without this empty method the game will crash in the beginning
    }
};

