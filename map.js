class map {
    constructor(tileImages) {
        // this.mapData = mapData;
        this.tileSize = { width: 32, height: 32 };
        this.tileImages = tileImages;
        this.theMap = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
    };
    // 1 wall

    drawMap(ctx) {
        for (let i = 0; i < this.theMap.length; i++) {
            for (let j = 0; j < this.theMap[i].length; j++) {
                const tileType = this.theMap[i][j];
                const imageKey = this.tileImages[tileType]; // Make sure this is defined correctly
                const image = ASSET_MANAGER.getAsset(imageKey);
                if (!imageKey) {
                    console.error("No image found for tile type:", tileType);
                    continue; // Skip drawing this tile
                }
                
                if (image) {
                    ctx.drawImage(image, j * this.tileSize.width, i * this.tileSize.height, this.tileSize.width, this.tileSize.height);
                }
            }
        }
    };

    // draw() {
    //     const tileImages = {
    //         0: ASSET_MANAGER.getAsset("./images/floor.png"),
    //         1: ASSET_MANAGER.getAsset("./images/slime.png")
    //     };
        
    //     this.map = new Map(tileImages);

    // }
};