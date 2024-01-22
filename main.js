const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./images/wall.png");
ASSET_MANAGER.queueDownload("./images/floor.png");

ASSET_MANAGER.queueDownload("./slimeSprite.png");


ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	
	ctx.imageSmoothingEnabled = false; 
	// for better image quality, espically when rotating

	gameEngine.addEntity(new Slime(gameEngine));

	gameEngine.init(ctx);

	gameEngine.start();
});
