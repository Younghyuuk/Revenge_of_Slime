class Bullet extends Projectile {
    constructor(game, x, y, target, fireRate) {
        super(game, x, y, target, fireRate);
        // Set any Bullet-specific properties
        this.radius = 5; // Smaller radius for a bullet
        this.game.bullet = this;
        this.damage = 10; // Set the damage for a bullet
        // Override or extend other properties or methods specific to a Bullet
    }

    // You can override methods or add new ones specific to Bullet
    update() {
        super.update(); // Call the parent class update
        // Add any Bullet-specific update logic here
    }

    draw(ctx) {
        // Custom drawing code for a Bullet, or call the parent draw
        super.draw(ctx);
    }
}