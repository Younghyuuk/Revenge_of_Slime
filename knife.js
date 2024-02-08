class knife {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.game.knife = this;
        this.name = "knife";
        // this.range = {radius: 13, x: this.x + 9, y: this.y + 12};
        this.damage = 100; // can be changed, just randomly set to 15
        this.speed = 5; // can be changed, just randomly set to 5
        this.weapon = true;
        this.removeFromWorld = false;

        this.collisionCircle = {radius: 25, x: this.game.slime.x + 10, y: this.game.slime.y + 10};// collision detection circle
        
        this.overlapCollisionCircle = {radius: 10, x: this.x + 10, y: this.y + 13};// overlap collision detection circle

        this.stabX = 0;
        this.stabY = 0;
        this.stabRad = 50;

        this.animator = new Animator(ASSET_MANAGER.getAsset("./images/knife.png"), 0, 0, 350, 600, 1, 1, .05);
    }

    stabPos() {
        // Get the difference between the mouse click position and the slime character's position
        let d1 = this.game.mousePos.x + this.game.camera.x;
        let d2 = this.game.mousePos.y + this.game.camera.y;
    
        let dx = this.game.slime.x - d1;
        let dy = this.game.slime.y - d2;

        // Calculate the distance between the mouse click position and the slime character's position
        let distance = Math.sqrt((dx * dx) + (dy * dy));
    
        // Normalize the direction vector
        if (distance !== 0) {
            dx /= distance;
            dy /= distance;
        }
    
        // Calculate the position where the stab action will occur (25 units away from the slime character)
        this.stabX = this.game.slime.x + dx * 25;
        this.stabY = this.game.slime.y + dy * 25;
    
        // Define the radius of the stab action's collision circle
        // const STAB_RADIUS = 50; // Example radius size
    
    

        // Create a collision circle at the stab position
        let collisionCircle = {
            x: this.stabX, // Center x-coordinate of the collision circle
            y: this.stabY, // Center y-coordinate of the collision circle
            radius: this.stabRad, // Radius of the collision circle
        };
    
        // Now you can use the collision circle for collision detection or other purposes
        return collisionCircle;w
    };
    
    
    update() {
        if(!this.removeFromWorld){
            this.collisionCircle.x = this.x + 10 - this.game.camera.x;
            this.collisionCircle.y = this.y + 13 - this.game.camera.y;
            this.overlapCollisionCircle.x = this.x + 10 - this.game.camera.x;
            this.overlapCollisionCircle.y = this.y + 13 - this.game.camera.y;
        }
        // this.stabPos();
    };

    draw(ctx) {
        if(!this.removeFromWorld){
            this.animator.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.collisionCircle);
        }
        ctx.beginPath();
        ctx.arc(this.stabX, this.stabY, this.stabRad, 0, 2 * Math.PI);
        ctx.strokeStyle = 'red'; // Example color
        ctx.stroke();
    };

};