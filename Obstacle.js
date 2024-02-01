class Obstacle {
    constructor(game, x, y) {
        // this.game = game;
        this.x = x;
        this.y = y;
        this.type = Math.floor(Math.random() * 3); // Example: 0 for tree, 1 for rock, etc.
        
        this.sprites = [
            ASSET_MANAGER.getAsset("./images/tree.png"),
            ASSET_MANAGER.getAsset("./images/rock.png"),
            ASSET_MANAGER.getAsset("./images/lavaPit.png")
        ];
        
        this.sprite = this.sprites[this.type];
        
        // Assuming all obstacles share the same size for simplicity
        this.width = 32; 
        this.height = 32; 
    };


    update() {
    
    };

    draw(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y);
    };

    getCollisionBox() {
        // Return a bounding box for collision detection
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    };
}