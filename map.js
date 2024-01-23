class map {
    constructor() {
        this.height = 24;
        this.width = 41;
        this.theMap = [];
        this.mapDimensions();
        this.wallBB = null;
    };
    // 1 wall

    drawMap(ctx) {
        for (let i = 0; i < this.theMap.length; i++) {
            for (let j = 0; j < this.theMap[i].length; j++) {
                let image;
                if (this.theMap[i][j] === 1) {
                    image = ASSET_MANAGER.getAsset("./images/wall.png");
                    this.wallBB = new BoundingBox(j * 32, i * 32, 32, 32);
                    ctx.strokeStyle = 'red';    
                    ctx.strokeRect(j * 32, i * 32, 32, 32);
                    // this.BB = new BoundingBox(this.x, this.y, this.w, PARAMS.BLOCKWIDTH * 2);
                    // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
                    // this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2)
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

    collidesWithCircle(circle) {
        for (let i = 0; i < this.theMap.length; i++) {
            for (let j = 0; j < this.theMap[i].length; j++) {
                if (this.theMap[i][j] === 1) {
                    let wallRect = {x: j * 32, y: i * 32, width: 32, height: 32};
                    if (this.circleRectCollision(circle, wallRect)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

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
    }


    
};