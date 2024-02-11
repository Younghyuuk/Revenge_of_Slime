class knife {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.game.knife = this;
        this.name = "knife";
        // this.range = {radius: 13, x: this.x + 9, y: this.y + 12};
        this.damage = 15; // can be changed, just randomly set to 15
        this.speed = 5; // can be changed, just randomly set to 5
        this.weapon = true;
        this.removeFromWorld = false;

        this.collisionCircle = {radius: 25, x: this.game.slime.x + 10, y: this.game.slime.y + 10};// collision detection circle
        
        this.overlapCollisionCircle = {radius: 10, x: this.x + 10, y: this.y + 13};// overlap collision detection circle

        this.stabX = 0;
        this.stabY = 0;
        this.stabRad = 0;

        this.animator = new Animator(ASSET_MANAGER.getAsset("./images/knife.png"), 0, 0, 350, 600, 1, 1, .05);
    }

 
    stabPos() {
        // Ensure we have valid mouse click positions before proceeding
        if (!this.game.mouseClickPos || !this.game.slime) {
            console.error("Missing mouse click position or slime character.");
            return null; // Exit the function if necessary data is missing
        }
    
        // Get the mouse click position
        let mouseX = this.game.mouseClickPos.x;
        let mouseY = this.game.mouseClickPos.y;
    
        // Get the slime character's position with adjustments for specific anchor points
        let slimeX = this.game.slime.x + 31 - this.game.camera.x; 
        let slimeY = this.game.slime.y + 55 - this.game.camera.y; 
        
        // Calculate the angle between the mouse click position and the slime character's position
        // let angle = Math.atan2(mouseY - slimeY, mouseX - slimeX);
        let unitV = getUnitVector(mouseX, mouseY, slimeX, slimeY);

        // Calculate the position where the stab action will occur, 30 units away from the slime
        this.stabX = slimeX + (unitV[0] * 30);
        this.stabY = slimeY + (unitV[1] * 30);

        // Define the radius of the stab action's collision circle
        this.stabRad = 13; // Radius of the collision circle
        
        
        // Create and return the collision circle at the stab position
        return {
            x: this.stabX, // X-coordinate of the collision circle's center
            y: this.stabY, // Y-coordinate of the collision circle's center
            radius: this.stabRad, // Radius of the collision circle
        };
    }
    
        
    
    
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
    };

};