class hud{
    constructor(game) {
        this.game = game;
        this.camera = game.camera;
        this.slime = game.slime;
        this.levelBuilder = this.game.levelBuilder;

        this.score = 0;
        this.health = this.slime.health;

        this.minimap = new miniMap(game);
    }

    draw(ctx) {
        // Level Bar
        ctx.fillStyle = "rgb(255 255 255 / 50%"; // transparent white
        ctx.beginPath();
        //adjust the width based on the level
        ctx.roundRect(580, 15, (this.level < 10 ? 160 : 175), 40, [20]);
        ctx.fill();

        
        ctx.strokeStyle = "Black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        //adjust the width based on the level
        ctx.roundRect(580, 15, (this.level < 10 ? 160 : 175), 40, [20]);
        ctx.stroke();

        ctx.font = 20 + "px 'Press Start 2P'";
        ctx.fillStyle = "Black";
        ctx.fillText("Level " + this.level, 590 , 45);
        

        // Weapons
        ctx.fillStyle = "rgb(255 255 255 / 50%"; // transparent white
        ctx.fillRect(500, 700, 50, 40);
        ctx.fillRect(430, 700, 50, 40);
        ctx.strokeStyle = "Black";
        ctx.strokeRect(500, 700, 50, 40);
        ctx.strokeRect(430, 700, 50, 40);



        //TODO: Update for more weapons, and for weapon switching
        // 0 = no weapon, 1 = knife, 2 = pistol
        if(this.slime.weaponState == 1) {
            this.game.knife.HUDanimator.drawFrame(this.game.clockTick, ctx, 432, 698, []);
        }

        // Health Bar
        ctx.fillStyle = "Red"
        if(this.health > 0) {
            ctx.fillRect(580, 700, (this.health/100) * 200, 40);
        }
        ctx.strokeStyle = "Black";
        ctx.strokeRect(580, 700, 200, 40);
        //for debugging
        ctx.fillStyle = "Black";
        ctx.font = 18 + "px 'Press Start 2P'";
        ctx.fillText("Health " + this.health, 588, 730);
        

        ctx.lineWidth = 1; // reset line width for collision circles etc.
        this.minimap.draw(ctx);
    }

    update(){
        // this.score = ? 
        if(this.health >= 0){
            this.health = this.slime.health;
        }

        // 0 = no weapon, 1 = knife, 2 = pistol
        if(this.slime.weaponState == 1) {
            this.W1 = 1;
        }

        this.level = this.levelBuilder.level;
    }
}