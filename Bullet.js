class Bullet extends Projectile {
    constructor(game, x, y, mouseX, mouseY, speed) {
        const [velocityX, velocityY] = getUnitVector(x, y, mouseX, mouseY).map(v => v * speed);
        super(game, x, y, velocityX, velocityY, speed);
        // Additional properties for Bullet, e.g., damage
        this.damage = 10;
        this.bc = {radius: 25, x: this.game.slime.x + 10, y: this.game.slime.y + 10};
    };

    // Override update if needed for collision detection
    update() {
        super.update();
    };

    onHit(entity) {
        // Logic for what happens when bullet hits an entity
        entity.takeDamage(this.damage);
        // Possibly mark bullet for removal
        this.markForRemoval = true;
    };

    draw(ctx) {
        super.draw(ctx); // Draw the bullet
        // Additional drawing options for the bullet
    };
};
