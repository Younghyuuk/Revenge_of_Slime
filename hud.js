class hud{
    constructor(game) {
        this.game = game;
        this.game.hud = this;
        this.camera = game.camera;
        this.slime = game.slime;
        this.levelBuilder = this.game.levelBuilder;

        this.score = 0;
        this.health = this.slime.health;
        this.weaponOne = null;
        this.weaponTwo = null;

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
        

        // Inventory
        ctx.fillStyle = "rgb(255 255 255 / 50%"; // transparent white
        ctx.fillRect(500, 700, 50, 40);
        ctx.fillRect(430, 700, 50, 40);
        ctx.strokeStyle = "Black";
        ctx.strokeRect(500, 700, 50, 40);
        ctx.strokeRect(430, 700, 50, 40);

        this.fillVisualInventory(ctx);
        

        // Health Bar
        ctx.fillStyle = "rgb(255 0 0 / 75%)" // transparent red
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

    fillVisualInventory(ctx) {

        if(this.slime.inventory.length != 0){
            this.weaponOne = this.slime.inventory[0];

            switch(this.weaponOne.name) {
                case 'knife':
                    this.game.knife.HUDanimator.drawFrame(this.game.clockTick, ctx, invParams.KNIFE_W1_X, invParams.KNIFE_Y, []);
                    break;
                case 'pistol':
                    this.game.pistol.HUDanimator.drawFrame(this.game.clockTick, ctx, invParams.PISTOL_W1_X, invParams.PISTOL_Y, []);
                    break;
                case 'sword':
                    this.game.sword.HUDanimator.drawFrame(this.game.clockTick, ctx, invParams.SWORD_W1_X, invParams.SWORD_Y, []);
                    break;
                case 'sniper':
                    this.game.sniper.HUDanimator.drawFrame(this.game.clockTick, ctx, invParams.SNIPER_W1_X, invParams.SNIPER_Y, []);
                    break;
            }

            if(this.slime.inventory.length >= 2) {
                this.weaponTwo = this.slime.inventory[1];

                switch(this.weaponTwo.name) {
                    case 'knife':
                        this.game.knife.HUDanimator.drawFrame(this.game.clockTick, ctx, invParams.KNIFE_W2_X, invParams.KNIFE_Y, []);
                        break;
                    case 'pistol':
                        this.game.pistol.HUDanimator.drawFrame(this.game.clockTick, ctx, invParams.PISTOL_W2_X, invParams.PISTOL_Y, []);
                        break;
                    case 'sword':
                        this.game.sword.HUDanimator.drawFrame(this.game.clockTick, ctx, invParams.SWORD_W2_X, invParams.SWORD_Y, []);
                        break;
                    case 'sniper':
                        this.game.sniper.HUDanimator.drawFrame(this.game.clockTick, ctx, invParams.SNIPER_W2_X, invParams.SNIPER_Y, []);
                        break;
                }
            }    
        }

        if(this.slime.currentWeapon != null) {
            ctx.strokeStyle = "Red";
            if(this.slime.currentWeapon == this.weaponOne){
                ctx.strokeRect(430, 700, 50, 40);

            } else if (this.slime.currentWeapon == this.weaponTwo){
                ctx.strokeRect(500, 700, 50, 40);

            }
        }

        }
            
    update() {
        // this.score = ? 
        if(this.health >= 0){
            this.health = this.slime.health;
        }

        this.level = this.levelBuilder.level;
    }
}

const invParams = { 
    KNIFE_W1_X: 432,
    KNIFE_Y: 698,
    KNIFE_W2_X: 502,

    PISTOL_W1_X: 440,
    PISTOL_Y: 705,
    PISTOL_W2_X: 510,

    SWORD_W1_X: 440,
    SWORD_Y: 707,
    SWORD_W2_X: 510,

    SNIPER_W1_X: 425,
    SNIPER_Y: 695,
    SNIPER_W2_X: 495
};