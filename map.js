class map {
    constructor(mapData, tileImages) {
        this.mapData = mapData;
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

    drawMap() {
        for(let i = 0; i < this.theMap.length; i++) {
            for(let j = 0; j < this.theMap[0].length; j++) {
                const tileType = this.theMap[row][col];
                const imageKey = this.tileImage[tileType];
                const image = assetManager.getAsset(imageKey);
                
                if (image) {
                    ctx.drawImage(image, col * this.tileSize.width, row * this.tileSize.height, this.tileSize.width, this.tileSize.height);
                }
            }
        }
    }

    // draw(canvas, ctx) {
    //     this.#setCanvasSize(canvas);
    // };

    // #setCanvasSize(canvas) {
    //     canvas.height = this.map[0].length * this.tileSize;
    //     canvas.width = this.map[0].length * this.tileSize;

    // }
};