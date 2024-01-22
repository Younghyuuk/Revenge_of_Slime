const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./images/wall.png");
ASSET_MANAGER.queueDownload("./images/floor.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	// const gameMap = new map(mapData, tileImages);
	
	gameEngine.init(ctx);

	gameEngine.start();
});
