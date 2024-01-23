class map {
    constructor() {
        this.height = 24;
        this.width = 41;
        this.theMap = [];
        this.mapDimensions();
    };
    // 1 wall

    drawMap(ctx) {
        for (let i = 0; i < this.theMap.length; i++) {
            for (let j = 0; j < this.theMap[i].length; j++) {
                let image;
                if (this.theMap[i][j] === 1) {
                    image = ASSET_MANAGER.getAsset("./images/wall.png");
                } else if (this.theMap[i][j] === 0) {
                    image = ASSET_MANAGER.getAsset("./images/floor.png");
                }

                if (image) {
                    ctx.drawImage(image, j * 32, i * 32, 32, 32); // Assuming tileSize is 32x32
                }
            }
        }
    };

    mapDimensions() {
        for(let i = 0; i < this.height; i++) {
            this.theMap[i] =[]
            for(let j = 0; j < this.width; j++) {
                if (i === 0 || i === this.height - 1 || j === 0 || j === this.width - 1) {
                    this.theMap[i][j] = 1;
                } else {
                    this.theMap[i][j] = 0;
                }
            }
        }
    };

};