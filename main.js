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
	//game , x, y, speed, health,  base damage
	window.slime = new Slime(gameEngine, 700, 430, 150, 100, 10);
	gameEngine.addEntity(slime);
	gameEngine.addEntity(new knife(gameEngine, 670, 470));
	gameEngine.addEntity(new pistol(gameEngine, 780, 470));

	// tester rocket launcher 
	// gameEngine.addEntity(new rocketLauncher(gameEngine, 670, 570));
	
	// gameEngine.addEntity(new sniper(gameEngine, 710, 410));
	// //added to test weapon switching 
	// gameEngine.addEntity(new sword(gameEngine, 710, 610)); 
	// gameEngine.addEntity(new knife(gameEngine, 700, 300));
	// gameEngine.addEntity(new pistol(gameEngine, 800, 550));
	return slime;
};

const gameEngine = new GameEngine({}, createEnemy, createSlime);




ASSET_MANAGER.queueDownload("./images/wall.png");
ASSET_MANAGER.queueDownload("./images/floor.png");
ASSET_MANAGER.queueDownload("./images/tree.png");
ASSET_MANAGER.queueDownload("./images/lavaPit.png");
ASSET_MANAGER.queueDownload("./images/rock.png");

ASSET_MANAGER.queueDownload("./images/blueSlime.png");
ASSET_MANAGER.queueDownload("./images/knifeBlueSlime.png");
ASSET_MANAGER.queueDownload("./images/practiceKnifeAttack.png");




// global variable storing the knightSprite image for animation
ASSET_MANAGER.queueDownload("./images/KnightSprite.png");

ASSET_MANAGER.queueDownload("./images/ArcherSprite.png");

ASSET_MANAGER.queueDownload("./images/knife.png");
ASSET_MANAGER.queueDownload("./images/sword.png");
ASSET_MANAGER.queueDownload("./images/pistol.png");
ASSET_MANAGER.queueDownload("./images/sniper.png");


// sound and music
ASSET_MANAGER.queueDownload("./sound/2.12.2024_Demo_1.mp3");
ASSET_MANAGER.queueDownload("./sound/2.12.2024_Demo_2.mp3");
ASSET_MANAGER.queueDownload("./sound/2.12.2024_Knife_Slash.mp3");
ASSET_MANAGER.queueDownload("./sound/3.4.2024_Official_1.mp3");
ASSET_MANAGER.queueDownload("./sound/3.4.2024_Official_2.mp3");
ASSET_MANAGER.queueDownload("./sound/3.4.2024_Gunshot.mp3");
ASSET_MANAGER.queueDownload("./sound/3.4.2024_Sniper.mp3");
ASSET_MANAGER.queueDownload("./sound/3.4.2024_Sword.mp3");
ASSET_MANAGER.queueDownload("./sound/3.4.2024_Rocket.mp3");

ASSET_MANAGER.downloadAll(() => {
	// added in the canvas width and height
	PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	PARAMS.CANVAS_WIDTH = canvas.width;
	PARAMS.CANVAS_HEIGHT = canvas.height;

		
	ASSET_MANAGER.autoRepeat("./sound/3.4.2024_Official_1.mp3");
	ASSET_MANAGER.autoRepeat("./sound/3.4.2024_Official_2.mp3");
	
	ctx.imageSmoothingEnabled = false; 
	// for better image quality, espically when rotating

						//game, x, y, speed, health, damage
	// let slime = new Slime(gameEngine, 700, 430, 150, 100, 10);

	// gameEngine.addEntity(slime);

										//game,      x,   y,  s,  h,  d,  slime
	// gameEngine.addEntity(new enemyKnight(gameEngine, 10, 10, 100, 20, 5, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 100, 10, 100, 20, 5, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 1000, 10, 100, 20, 5, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 456, 10, 100, 20, 5, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 532, 10, 100, 20, 5, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 788, 10, 100, 20, 5, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 234, 10, 100, 20, 5, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 653, 10, 100, 20, 5, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 234, 10, 100, 20, 5, slime));
	// gameEngine.addEntity(new enemyKnight(gameEngine, 876, 10, 100, 20, 5, slime));

										//game,       x,   y,  s,  h,  d,  slime
	// gameEngine.addEntity(new enemyArcher(gameEngine, 450, 100, 60, 20, 10, slime));
	// gameEngine.addEntity(new enemyArcher(gameEngine, 40, 200, 60, 75, 30, slime));
	// gameEngine.addEntity(new enemyArcher(gameEngine, 1050, 300, 60, 20, 10, slime));
	// gameEngine.addEntity(new enemyArcher(gameEngine, 490, 400, 60, 75, 30, slime));
	// gameEngine.addEntity(new enemyArcher(gameEngine, 980, 500, 60, 75, 30, slime));
	// gameEngine.addEntity(new enemyArcher(gameEngine, 600, 600, 60, 75, 30, slime));

	// gameEngine.addEntity(new knife(gameEngine, 105, 610));
	// gameEngine.addEntity(new sword(gameEngine, 160, 610));


	gameEngine.init(ctx);
	new CameraScene(gameEngine);


	gameEngine.start();

});
