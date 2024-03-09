class CameraScene {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
       
        this.x = 0;
        this.y = 0;
       
    };

    updateAudio() {
        let mute = document.getElementById("mute").checked;
        let volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);
    }

    update() {
        this.updateAudio();
        // ASSET_MANAGER.playAsset("./sound/2.12.2024_Demo_1.mp3");
        // let midpoint = PARAMS.CANVAS_WIDTH/2 - PARAMS.BLOCKWIDTH / 2;

        let midPointX = PARAMS.CANVAS_WIDTH / 2;
        let midPointY = PARAMS.CANVAS_HEIGHT / 2;

        // this.x = Math.max(0, Math.min(this.game.slime.x - midPointX));
        // this.y = Math.max(0, Math.min(this.game.slime.y - midPointY));

        this.x = Math.max(0, Math.min(this.game.slime.x - midPointX, this.game.map.width * 18.9));
        this.y = Math.max(0, Math.min(this.game.slime.y - midPointY, this.game.map.height * 24.3));

    };
    
}
