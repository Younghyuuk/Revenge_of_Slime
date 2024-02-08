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

        this.collisionCircle = {radius: 25, x: this.x + 10, y: this.y + 13};// collision detection circle
        
        this.overlapCollisionCircle = {radius: 10, x: this.x + 10, y: this.y + 13};// overlap collision detection circle




        this.animator = new Animator(ASSET_MANAGER.getAsset("./images/knife.png"), 0, 0, 350, 600, 1, 1, .05);
    }

    stab() {
        const stabX = this.x + Math.cos(this.angle) * stabRadius;
        const stabY = this.y + Math.sin(this.angle) * stabRadius;
        // Handle collision with objects in front of the slime
        console.log("Knife stabs at:", stabX, stabY);
    }
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