class CameraScene {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
       
        this.x = 0;
        this.y = 0;
    
    };

    update() {
        // let midpoint = PARAMS.CANVAS_WIDTH/2 - PARAMS.BLOCKWIDTH / 2;

        let midPointX = PARAMS.CANVAS_WIDTH / 2;
        let midPointY = PARAMS.CANVAS_HEIGHT / 2;

        this.x = Math.max(0, Math.min(this.game.slime.x - midPointX));
        this.y = Math.max(0, Math.min(this.game.slime.y - midPointY));

    };
    
}
