const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

<<<<<<< HEAD
// global variable storing the knightSprite image for animation
ASSET_MANAGER.queueDownload("./knightSprite.png");

ASSET_MANAGER.queueDownload("./archerSprite.png");
=======
ASSET_MANAGER.queueDownload("./images/wall.png");
ASSET_MANAGER.queueDownload("./images/floor.png");

ASSET_MANAGER.queueDownload("./slimeSprite.png");

>>>>>>> 6226385387cbc5b63c074973d09decd10c290843

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	
	ctx.imageSmoothingEnabled = false; 
	// for better image quality, espically when rotating

	gameEngine.addEntity(new Slime(gameEngine));

	gameEngine.addEntity(new enemyKnight(gameEngine, 10, 10, 5, 100, 25));

	gameEngine.addEntity(new enemyArcher(gameEngine, 450, 300, 3, 75, 30));

	gameEngine.init(ctx);

	gameEngine.start();
});
