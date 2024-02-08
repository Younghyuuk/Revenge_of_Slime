class knife {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.game.knife = this;
        this.name = "knife";
        // this.range = {radius: 13, x: this.x + 9, y: this.y + 12};
        this.damage = 50; // can be changed, just randomly set to 15
        this.speed = 5; // can be changed, just randomly set to 5
        this.weapon = true;
        this.removeFromWorld = false;

        this.collisionCircle = {radius: 25, x: this.game.slime.x + 10, y: this.game.slime.y + 10};// collision detection circle
        
        this.overlapCollisionCircle = {radius: 10, x: this.x + 10, y: this.y + 13};// overlap collision detection circle




        this.animator = new Animator(ASSET_MANAGER.getAsset("./images/knife.png"), 0, 0, 350, 600, 1, 1, .05);
    }

    stabPos() {
        // Get the difference between the mouse click position and the slime character's position
        let dx = this.game.mouseClickPos.x - this.game.slime.x;
        let dy = this.game.mouseClickPos.y - this.game.slime.y;
    
        // Calculate the distance between the mouse click position and the slime character's position
        let distance = Math.sqrt(dx * dx + dy * dy);
    
        // Normalize the direction vector
        if (distance !== 0) {
            dx /= distance;
            dy /= distance;
        }
    
        // Calculate the position where the stab action will occur (25 units away from the slime character)
        let stabX = this.game.slime.x + dx * 25;
        let stabY = this.game.slime.y + dy * 25;
    
        // Define the radius of the stab action's collision circle
        const STAB_RADIUS = 10; // Example radius size
    
        // Create a collision circle at the stab position
        let collisionCircle = {
            x: stabX, // Center x-coordinate of the collision circle
            y: stabY, // Center y-coordinate of the collision circle
            radius: STAB_RADIUS, // Radius of the collision circle
        };
    
        // Now you can use the collision circle for collision detection or other purposes
        return collisionCircle;
    };
    
    
    update() {
        if(!this.removeFromWorld){
            this.collisionCircle.x = this.x + 10 - this.game.camera.x;
            this.collisionCircle.y = this.y + 13 - this.game.camera.y;
            this.overlapCollisionCircle.x = this.x + 10 - this.game.camera.x;
            this.overlapCollisionCircle.y = this.y + 13 - this.game.camera.y;
        }
        // this.stab();
    };

    draw(ctx) {
        if(!this.removeFromWorld){
            this.animator.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.collisionCircle);
        }
    
    };

};