const ASSET_MANAGER = new AssetManager();

window.slime;

// needed to make this function in main so there is a reference to ASSET_MANAGER for the enemies  
function createEnemy(gameEngine, type, x, y, speed, health, damage) {

	if (!window.slime) {
        console.error("Slime has not been initialized.");
        return null; // Or handle this scenario appropriately
    }
	if (type === "archer") {
		return new enemyArcher(gameEngine, x, y, speed, health, damage, window.slime);
	} else if (type === "knight") {
		return new enemyKnight(gameEngine, x, y, speed, health, damage, window.slime);
	}
	// ... other enemy types
}



function createSlime(gameEngine) {
	console.log("createSlime() is called");
	window.slime = new Slime(gameEngine, 77, 430, 150, 100, 10);
	gameEngine.addEntity(slime);
	return slime;
};

const gameEngine = new GameEngine({}, createEnemy, createSlime);




ASSET_MANAGER.queueDownload("./images/wall.png");
ASSET_MANAGER.queueDownload("./images/floor.png");

ASSET_MANAGER.queueDownload("./slimeSprite.png");

// global variable storing the knightSprite image for animation
ASSET_MANAGER.queueDownload("./knightSprite.png");

ASSET_MANAGER.queueDownload("./archerSprite.png");

ASSET_MANAGER.queueDownload("./images/knife.png");
ASSET_MANAGER.queueDownload("./images/sword.png");



ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	
	ctx.imageSmoothingEnabled = false; 
	// for better image quality, espically when rotating
	
	// let slime = new Slime(gameEngine, 77, 430, 150, 100, 10);

	// gameEngine.addEntity(slime);

	// gameEngine.addEntity(new enemyKnight(gameEngine, 10, 10, 100, 100, 25, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 100, 10, 100, 100, 25, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 1000, 10, 100, 100, 25, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 456, 10, 100, 100, 25, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 532, 10, 100, 100, 25, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 788, 10, 100, 100, 25, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 234, 10, 100, 100, 25, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 653, 10, 100, 100, 25, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 234, 10, 100, 100, 25, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 876, 10, 100, 100, 25, slime));

	// gameEngine.addEntity(new enemyArcher(gameEngine, 450, 100, 60, 75, 30, slime));
	// gameEngine.addEntity(new enemyArcher(gameEngine, 40, 200, 60, 75, 30, slime));
	// gameEngine.addEntity(new enemyArcher(gameEngine, 1050, 300, 60, 75, 30, slime));
	// gameEngine.addEntity(new enemyArcher(gameEngine, 490, 400, 60, 75, 30, slime));
	// gameEngine.addEntity(new enemyArcher(gameEngine, 980, 500, 60, 75, 30, slime));
	// gameEngine.addEntity(new enemyArcher(gameEngine, 600, 600, 60, 75, 30, slime));

	// gameEngine.addEntity(new knife(gameEngine, 105, 610));
	gameEngine.addEntity(new sword(gameEngine, 160, 610));


	gameEngine.init(ctx);

	gameEngine.start();
});
