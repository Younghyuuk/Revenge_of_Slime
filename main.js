const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./images/wall.png");
ASSET_MANAGER.queueDownload("./images/floor.png");

ASSET_MANAGER.queueDownload("./slimeSprite.png");

// global variable storing the knightSprite image for animation
ASSET_MANAGER.queueDownload("./knightSprite.png");

ASSET_MANAGER.queueDownload("./archerSprite.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	
	ctx.imageSmoothingEnabled = false; 
	// for better image quality, espically when rotating

	let slime = new Slime(gameEngine);

	gameEngine.addEntity(slime);

	gameEngine.addEntity(new enemyKnight(gameEngine, 10, 10, 100, 100, 25, slime));
	gameEngine.addEntity(new enemyKnight(gameEngine, 100, 10, 100, 100, 25, slime));
	gameEngine.addEntity(new enemyKnight(gameEngine, 1000, 10, 100, 100, 25, slime));
	gameEngine.addEntity(new enemyKnight(gameEngine, 456, 10, 100, 100, 25, slime));
	gameEngine.addEntity(new enemyKnight(gameEngine, 532, 10, 100, 100, 25, slime));
	gameEngine.addEntity(new enemyKnight(gameEngine, 788, 10, 100, 100, 25, slime));
	gameEngine.addEntity(new enemyKnight(gameEngine, 234, 10, 100, 100, 25, slime));
	gameEngine.addEntity(new enemyKnight(gameEngine, 653, 10, 100, 100, 25, slime));
	gameEngine.addEntity(new enemyKnight(gameEngine, 234, 10, 100, 100, 25, slime));
	gameEngine.addEntity(new enemyKnight(gameEngine, 876, 10, 100, 100, 25, slime));

	gameEngine.addEntity(new enemyArcher(gameEngine, 450, 100, 60, 75, 30, slime));
	gameEngine.addEntity(new enemyArcher(gameEngine, 40, 200, 60, 75, 30, slime));
	gameEngine.addEntity(new enemyArcher(gameEngine, 1050, 300, 60, 75, 30, slime));
	gameEngine.addEntity(new enemyArcher(gameEngine, 490, 400, 60, 75, 30, slime));
	gameEngine.addEntity(new enemyArcher(gameEngine, 980, 500, 60, 75, 30, slime));
	gameEngine.addEntity(new enemyArcher(gameEngine, 600, 600, 60, 75, 30, slime));

	gameEngine.init(ctx);

	gameEngine.start();
});
