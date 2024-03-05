class map {
    constructor(game) {
        this.height = 100;
        this.width = 100;
        this.theMap = [];
        this.obstacles = [];
        
        this.game = game;

        this.mapDimensions();
        this.wallBB = null;
        this.obstacle = null;
    };
    // 1 wall

    drawMap(ctx) {
        // Loop through each tile in the map
        for (let i = 0; i < this.theMap.length; i++) {
            for (let j = 0; j < this.theMap[i].length; j++) {
                let image;
                let drawX = j * 32 - this.game.camera.x; // Adjust X position based on camera
                let drawY = i * 32 - this.game.camera.y; // Adjust Y position based on camera
                // let drawX = j * 32;
                // let drawY = i * 32;

                // Draw walls
                if (this.theMap[i][j] === 1) {
                    image = ASSET_MANAGER.getAsset("./images/wall.png");
                    this.wallBB = new BoundingBox(drawX, drawY, 32, 32);
                    // Optionally draw bounding box for debugging
                    // ctx.strokeStyle = 'red';    
                    // ctx.strokeRect(drawX, drawY, 32, 32);
                // Draw floors
                } else if (this.theMap[i][j] === 0) {
                    image = ASSET_MANAGER.getAsset("./images/floor.png");
                // Draw obstacles
                } else if (this.theMap[i][j] == 2) {
                    image = ASSET_MANAGER.getAsset("./images/tree.png");
                    // this.obstacle = new BoundingBox(drawX, drawY, 32, 32);
                    // Optionally draw bounding box for debugging
                    // ctx.strokeStyle = 'red';    
                    // ctx.strokeRect(drawX, drawY, 32, 32);
                }
    
                // Draw the selected image
                if (image) {
                    ctx.drawImage(image, drawX, drawY, 33, 33);
                }
            }
        }
    };
    

    mapDimensions() {
        const obstacleChance = 0.006; // Chance for an obstacle to appear on a tile
        for(let i = 0; i < this.height; i++) {
            this.theMap[i] = [];
            for(let j = 0; j < this.width; j++) {
                if (i === 0 || i === this.height - 1 || j === 0 || j === this.width - 1) {
                    this.theMap[i][j] = 1; // Wall
                } else {
                    // Determine if the tile should have an obstacle
                    // if (Math.random() < obstacleChance) {
                    //     this.theMap[i][j] = 2; // Mark as obstacle
                    // } else {
                        this.theMap[i][j] = 0; // Empty
                    // }
                }
            }
        }
    };
    

    collidesWithCircle(circle) {
        for (let i = 0; i < this.theMap.length; i++) {
            for (let j = 0; j < this.theMap[i].length; j++) {
                if (this.theMap[i][j] === 1) {
                    // check for collision here later
                    let wallRect = {x: j * 32, y: i * 32, width: 32, height: 32};
                    if (this.circleRectCollision(circle, wallRect)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    circleRectCollision(circle, rect) {
        let distX = Math.abs(circle.x - rect.x - rect.width / 2);
        let distY = Math.abs(circle.y - rect.y - rect.height / 2);

        if (distX > (rect.width / 2 + circle.radius) || distY > (rect.height / 2 + circle.radius)) {
            return false;
        }

        if (distX <= (rect.width / 2) || distY <= (rect.height / 2)) {
            return true;
        }

        let dx = distX - rect.width / 2;
        let dy = distY - rect.height / 2;
        return (dx * dx + dy * dy <= (circle.radius * circle.radius));
    };


    
};