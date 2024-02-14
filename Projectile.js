
class Projectile {
    constructor(game, x, y, angle, speed, despawnTime) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.angle = angle;
        this.radiusZ = 12;
        this.despawnTime = despawnTime;
        this.velocityX = Math.cos(this.angle) * this.speed;
        this.velocityY = Math.sin(this.angle) * this.speed;
        this.collisionCircle = {x: this.x, y: this.y, radius: this.radiusZ};
    };

    update() {
        this.x += this.velocityX * this.game.clockTick;
        this.y += this.velocityY * this.game.clockTick;
        this.despawnTime -= this.game.clockTick;
        if (this.despawnTime <= 0 || this.isOutOfBounds()) {
            this.removeFromWorld = true;
        }
    };

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radiusZ, 0, Math.PI * 2);
        ctx.fillStyle = 'black'; // Set bullet color
        ctx.fill();
        // Optional: Draw collision circle in debug mode
        if (this.game.debug) {
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }
    };

    isOutOfBounds() {
        return this.x < 0 || this.x > this.game.width || this.y < 0 || this.y > this.game.height;
    };
};


