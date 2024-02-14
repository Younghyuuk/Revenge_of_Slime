class Bullet extends Projectile {
    constructor(game, x, y, target) {
        super(game, x, y, target);
        // Set any Bullet-specific properties
        this.radius = 5; // Smaller radius for a bullet
        this.game.bullet = this;
        // this.fireRate = 2;
        this.damage = 10; // Set the damage for a bullet
        // Override or extend other properties or methods specific to a Bullet
    }

    // You can override methods or add new ones specific to Bullet
    update() {
        // this.heatSeeking = document.getElementById("heatseeking").checked;
        this.smooth = document.getElementById("smooth").checked;

        // if (this.heatSeeking) {
        var dist = distance(this, this.target);
        this.velocity = { x: (this.target.x - this.x) / dist * this.maxSpeed, y: (this.target.y - this.y) / dist * this.maxSpeed };
        // }
        
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
        
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if ((ent instanceof enemyArcher || ent instanceof enemyKnight) && this.game.slime.circleIntersect(this, ent)) {
                ent.hitpoints -= this.damage;
                this.removeFromWorld = true;
            }
        }
        
        this.facing = getFacing(this.velocity);
    };

    draw(ctx) {
        // Custom drawing code for a Bullet, or call the parent draw
        super.draw(ctx);
    }
}