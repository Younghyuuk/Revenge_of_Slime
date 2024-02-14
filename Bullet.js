class Bullet extends Projectile {
    constructor(game, x, y, speed) {
        super(game,x, y, speed);
        this.game.bullet = this;
        // Additional properties for Bullet, e.g., damage
        this.damage = 10;
        // this.bc = {radius: 5, x: this.game.slime.x + 10, y: this.game.slime.y + 10};
    };
    // anglePos() {
    //     let mouseX = this.game.mouseClickPos.x;
    //     let mouseY = this.game.mouseClickPos.y;
    //     // Calculate direction from slime to mouse click
    //     let slimeX = this.game.slime.x + 31 - this.game.camera.x;
    //     let slimeY = this.game.slime.y + 55 - this.game.camera.y;
    //     const [unitX, unitY] = getUnitVector(mouseX, mouseY, slimeX, slimeY);
    //     // Set velocity based on direction and speed
    //     this.velocityX = unitX * this.speed;
    //     this.velocityY = unitY * this.speed;
    //     // Update position based on velocity
    //     this.x += this.velocityX;
    //     this.y += this.velocityY;
    
    //     // Return updated collision circle
    //     return {
    //         x: this.x,
    //         y: this.y,
    //         radius: 5 // Assuming a fixed radius for simplicity
    //     };
    // };
    // Override update if needed for collision detection should get the anglePos from the projectile class
    update() {
        // super.update();
        let bulletCircle = this.anglePos();
        this.game.entities.forEach(entity => {
            if (entity instanceof enemyArcher || entity instanceof enemyKnight) {
                if(this.circlesIntersect(entity.collisionCircle, bulletCircle)) {
                    entity.getAttacked(this.game.bullet.damage);
                    console.log("Enemy health: " + entity.health);
                }
            }
        });
    };

    draw(ctx) {
        // super.draw(ctx); // Draw the bullet
        // Additional drawing options for the bullet
    };
};
