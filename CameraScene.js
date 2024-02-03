class CameraScene {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;
    
       
    };

    update() {
        let midpoint = PARAMS.CANVAS_WIDTH/2 - PARAMS.BLOCKWIDTH / 2;

        this.x = this.game.slime.x - midpoint;
        this.y = this.game.slime.y - midpoint;

    };
    
}
