class sword {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.game.sword = this;
        this.name = "sword";
        this.damage = 30; // can be changed, just randomly set to 30
        this.weapon = true;
        this.melee = true;
        this.removeFromWorld = false;

        this.collisionCircle = {radius: 14, x: this.x + 17, y: this.y + 20};// collision detection circle
        
        this.overlapCollisionCircle = {radius: 10, x: this.x + 10, y: this.y + 13};// overlap collision detection circle


        this.animator = new Animator(ASSET_MANAGER.getAsset("./images/sword.png"), 0, 0, 1200, 1200, 1, 1, .02);
        this.HUDanimator = new Animator(ASSET_MANAGER.getAsset("./images/sword.png"), 0, 0, 1200, 1200, 1, 1, .02);

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

        this.angle = Math.atan2(mouseY - slimeY, mouseX - slimeX);
    
        // Calculate the position where the stab action will occur, 30 units away from the slime
        this.stabX = slimeX + Math.cos(this.angle) * 30;
        this.stabY = slimeY + Math.sin(this.angle) * 30;
    
        // Define the radius of the stab action's collision circle
        this.stabRad = 18; // Radius of the collision circle

        // Create and return the collision circle at the stab position
        this.stabCircle = {
            x: this.stabX, // X-coordinate of the collision circle's center
            y: this.stabY, // Y-coordinate of the collision circle's center
            radius: this.stabRad, // Radius of the collision circle
        };

        return this.stabCircle;
    }   

    update() {
        if(!this.removeFromWorld){
            this.collisionCircle.x = this.x + 10 - this.game.camera.x;
            this.collisionCircle.y = this.y + 13 - this.game.camera.y;
            this.overlapCollisionCircle.x = this.x + 10 - this.game.camera.x;
            this.overlapCollisionCircle.y = this.y + 13 - this.game.camera.y;
        }
    }

    drawMiniMap(ctx, mmX, mmY){
        //drawMiniMap is called on all entities, 
        //so without this empty method the game will crash in the beginning
    }

    draw(ctx) {
        if(!this.removeFromWorld){
        this.animator.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, []);
        }
    }
}