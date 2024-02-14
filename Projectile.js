
class Projectile {
    constructor(game, x, y, speed, direction) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.speed = speed;
        // Convert direction to radians for movement calculation
        this.direction = direction * Math.PI / 180;
        this.velocityX = Math.cos(this.direction) * this.speed;
        this.velocityY = Math.sin(this.direction) * this.speed;
    }

    update() {
        // Update position based on velocity
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    draw(ctx) {
        // Basic drawing implementation
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}



