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
	} else if (type === "wizard") {
		return new WizardBoss(gameEngine, x, y, speed, health, damage, window.slime);
	}
	// ... other enemy types
}



function createSlime(gameEngine) {
	 console.log("createSlime() is called");
	//game , x, y, speed, health,  base damage
	window.slime = new Slime(gameEngine, 700, 430, 150, 100, 10);

	gameEngine.addEntity(slime);
	gameEngine.addEntity(new knife(gameEngine, 670, 470));
	// gameEngine.addEntity(new pistol(gameEngine, 780, 470)); 

	// gameEngine.addEntity(new bush(gameEngine, 1000, 1000));
	// gameEngine.addEntity(new bush(gameEngine, 600, 600));



	// tester rocket launcher 
	// gameEngine.addEntity(new rocketLauncher(gameEngine, 670, 570));
	
	// gameEngine.addEntity(new sniper(gameEngine, 710, 410));
	// added to test weapon switching 
	//gameEngine.addEntity(new sword(gameEngine, 710, 610)); 
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
ASSET_MANAGER.queueDownload("./images/arrow.png");
ASSET_MANAGER.queueDownload("./images/bullet.png");
ASSET_MANAGER.queueDownload("./images/WizardSprite.png");
ASSET_MANAGER.queueDownload("./images/energyBlast.png");
ASSET_MANAGER.queueDownload("./images/bush.png");
ASSET_MANAGER.queueDownload("./images/bush2.png");
ASSET_MANAGER.queueDownload("./images/bush3.png");




ASSET_MANAGER.queueDownload("./images/blueSlime.png");
ASSET_MANAGER.queueDownload("./images/knifeBlueSlime.png");
ASSET_MANAGER.queueDownload("./images/practiceKnifeAttack.png");
ASSET_MANAGER.queueDownload("./images/swordBlueSlime.png");
ASSET_MANAGER.queueDownload("./images/swordAttack.png");
ASSET_MANAGER.queueDownload("./images/pistolBlueSlime.png");



// global variable storing the knightSprite image for animation
ASSET_MANAGER.queueDownload("./images/KnightSprite.png");

ASSET_MANAGER.queueDownload("./images/ArcherSprite.png");

ASSET_MANAGER.queueDownload("./images/knife.png");
ASSET_MANAGER.queueDownload("./images/sword.png");
ASSET_MANAGER.queueDownload("./images/pistol.png");
ASSET_MANAGER.queueDownload("./images/sniper.png");
ASSET_MANAGER.queueDownload("./images/startMenu.png");
ASSET_MANAGER.queueDownload("./images/controlsMenu.png");


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





let isMenuActive = true;

// Load all assets and then draw the main menu
ASSET_MANAGER.downloadAll(() => {
    drawMainMenu();
    const canvas = document.getElementById("gameWorld");
    canvas.addEventListener('click', handleMenuClick);
});

// Function to check if a click is within the boundaries of a button
function isClickInside(x, y, buttonRect) {
    return x >= buttonRect.left && x <= buttonRect.right && y >= buttonRect.top && y <= buttonRect.bottom;
}

// Menu state enumeration
const MenuState = {
    MAIN_MENU: 'main_menu',
    CONTROLS_MENU: 'controls_menu'
};

let currentMenuState = MenuState.MAIN_MENU;


// Define button boundaries
const startButtonRect = { left: 495, right: 850, top: 408, bottom: 490 };
const controlsButtonRect = { left: 495, right: 850, top: 540, bottom: 622 };
const backButtonRect = { left: 535, right: 785, top: 673, bottom: 730 };

function drawMainMenu() {
	const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");
    const menuImage = ASSET_MANAGER.getAsset("./images/startMenu.png");
    ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
}

function drawControlsMenu() {
	const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");
    const controlsImage = ASSET_MANAGER.getAsset("./images/controlsMenu.png");
    ctx.drawImage(controlsImage, 0, 0, canvas.width, canvas.height);
}

// Handle clicks for different menu states
function handleMenuClick(event) {
	if (!isMenuActive) return;
	const canvas = document.getElementById("gameWorld");
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (currentMenuState === MenuState.MAIN_MENU) {
        if (isClickInside(clickX, clickY, startButtonRect)) {
            startGame();
        } else if (isClickInside(clickX, clickY, controlsButtonRect)) {
            currentMenuState = MenuState.CONTROLS_MENU;
            drawControlsMenu();
        }
    } else if (currentMenuState === MenuState.CONTROLS_MENU) {
        if (isClickInside(clickX, clickY, backButtonRect)) {
            currentMenuState = MenuState.MAIN_MENU;
            drawMainMenu();
        }
    }
}

// Function to start the game
function startGame() {
	const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");
	// Game initialization code goes here, for example:
	PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;
	PARAMS.CANVAS_WIDTH = canvas.width;
	PARAMS.CANVAS_HEIGHT = canvas.height;
	ctx.imageSmoothingEnabled = false; 
	// const canvas = document.getElementById("gameWorld");
	// const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);
	new CameraScene(gameEngine);
	gameEngine.start();
	isMenuActive = false;
	// Play the background music
	ASSET_MANAGER.autoRepeat("./sound/3.4.2024_Official_1.mp3");
	ASSET_MANAGER.autoRepeat("./sound/3.4.2024_Official_2.mp3");
}

