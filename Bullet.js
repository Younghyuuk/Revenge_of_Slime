class Bullet extends Projectile {
    constructor(game, x, y, mouseX, mouseY, speed) {
        const angle = Math.atan2(mouseY - y, mouseX - x);
        super(game, x, y, angle, speed, BULLET_DESPAWN_TIME);
        this.damage = 10;
    };

    update() {
        super.update();
        // Check for collisions with game entities
        this.game.entities.forEach(entity => {
            if (entity instanceof Slime && this.bc.collidesWith(entity.bc)) {
                entity.takeDamage(this.damage);
                this.removeFromWorld = true;
            }
        });
    };
}
