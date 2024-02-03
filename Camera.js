class Camera {
    constructor(game, slime) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;
        // this.slime = slime;
    };

    update() {
        let midpoint = PARAMS.CANVAS_WIDTH/2 - PARAMS.BLOCKWIDTH / 2;

        this.x = this.slime.x - midpoint;
        this.y = this.slime.y - midpoint;

    };
    
}
