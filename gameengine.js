// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options, createEnemy, createSlime) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;
      
        // Everything that will be updated and drawn each frame
        this.entities = [];

        this.running = false;

        this.createEnemy = createEnemy;

        this.createSlime = createSlime;
 
        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        this.mouseClick = false;
        this.mouseClickPos = { x: 0, y: 0 };
        // this.mousePos = { x: 0, y: 0 };

        //key input
        this.W = false;
        this.A = false;
        this.S = false;
        this.D = false;
        this.X = false;
        this.One = false;
        this.Two = false;

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
        console.log("gameengine created");
        this.levelBuilder = new LevelBuilder(this, this.createEnemy, this.createSlime);
     
        // Camera object
        // this.slime = new Slime(this.game, 77, 430, 150, 100, 10);
        this.map = new map(this);       
    };

    init(ctx) {
       console.log("gameengineInit is called");
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
      //  this.levelBuilder = new LevelBuilder(this);
        
        
        
    };

    start() {
        console.log("start in gameengine is called");
        this.levelBuilder.nextLevelScreen();
        this.levelBuilder.initBuilder();
        this.hud = new hud(this);
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    stop() {
        this.running = false;
    }

    startInput() {
        this.keyboardActive = false;
        var that = this; 
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
            this.mousePos = this.mouse;
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
            this.mouseClick = true;
            this.mouseClickPos = this.click; // stored the click position
            console.log("MOUSE CLICK");
            console.log(this.click)
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        //keep for now, might use implement key event listeners this way in future
        // this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        // this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);


        this.ctx.canvas.addEventListener('keydown', function (e) {
            that.keyboardActive = true;
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    that.A = true;
                    break;
                case "ArrowRight":
                case "KeyD":
                    that.D = true;
                    break;
                case "ArrowUp":
                case "KeyW":
                    that.W = true;
                    break;
                case "ArrowDown":
                case "KeyS":
                    that.S = true;
                    break;
                case "Digit1":
                    that.One = true;
                    break;
                case "Digit2":
                    that.Two = true;
                    break;
                case "KeyX":
                    that.X = true;
                    break;
            }
        });
        
        this.ctx.canvas.addEventListener('keyup', function (e) {
            that.keyboardActive = false;
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    that.A = false;
                    break;
                case "ArrowRight":
                case "KeyD":
                    that.D = false;
                    break;
                case "ArrowUp":
                case "KeyW":
                    that.W = false;
                    break;
                case "ArrowDown":
                case "KeyS":
                    that.S = false;
                    break;
                case "Digit1":
                    that.One = false;
                    break;
                case "Digit2":
                    that.Two = false;
                    break;
                case "KeyX":
                    that.X = false;
                    break;
            }
        })
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        if (this.running) {
            // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.map.drawMap(this.ctx);

            // Draw latest things first
            for (let i = this.entities.length - 1; i >= 0; i--) {
                this.entities[i].draw(this.ctx, this);
            }

            this.hud.draw(this.ctx);
        }
    };

    update() {
        if (this.running) {
            let entitiesCount = this.entities.length;
        
            // Update the camera to follow the slime character ADD IN THE SLIME CLASS
            // this.camera.follow(this.slime);
    
            //the counts for enemies, reset back to 0 after each update call, number sent ot level builder
            //add more counter variables as we get more enemies 
            let archerCnt = 0;
            let knightCnt = 0;
            let wizardCnt = 0;
    
            for (let i = 0; i < entitiesCount; i++) {
                let entity1 = this.entities[i];
                if (!entity1.removeFromWorld) {
    
                    // if statements for level builder - determines number of enemies and types 
                    //add more "else if" statements as we create more enemies 
                    if (entity1 instanceof enemyKnight) {
                        knightCnt++;
                    } else if (entity1 instanceof enemyArcher) {
                        archerCnt++;
                    } else if (entity1 instanceof WizardBoss) {
                        wizardCnt++;
                    }
                    
                    for (let j = i + 1; j < entitiesCount; j++) {
                        let entity2 = this.entities[j];
                        if (this.areColliding(entity1, entity2)) {
                            if (this.isNPC(entity1) && this.isNPC(entity2)) {
                                this.resolveCollision(entity1, entity2);
                            } else if(entity1 instanceof Slime && this.isNPC(entity2)) {
                                entity1.enemyInRange = entity2;
                                
                            }
                            this.isWeapon(entity1, entity2);
                        }
                    }
                    entity1.update();
                }
            }
            //for camera later
            this.camera.update();
            // this.game.knife.stabPos();
    
            //let the levelBuilder know how many of each type of enemy is still alive
            //add more params as we create more enemies 
            this.levelBuilder.updateEnemyCnt(knightCnt, archerCnt, wizardCnt);
    
            // remove all the entites that are no longer relevant - marked with removeFromWorld
            for (let i = this.entities.length - 1; i >= 0; --i) {
                if (this.entities[i].removeFromWorld) {
                    this.entities.splice(i, 1);
                }
            }
    
            this.hud.update();
        }
        
    };

    areColliding(entityA, entityB) {
        let dx = entityA.overlapCollisionCircle.x - entityB.overlapCollisionCircle.x;
        let dy = entityA.overlapCollisionCircle.y - entityB.overlapCollisionCircle.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (entityA.overlapCollisionCircle.radius + entityB.overlapCollisionCircle.radius);
    }

    resolveCollision(entityA, entityB) {
        let dx = entityA.overlapCollisionCircle.x - entityB.overlapCollisionCircle.x;
        let dy = entityA.overlapCollisionCircle.y - entityB.overlapCollisionCircle.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
    
        // The amount to move each entity to resolve the collision
        let overlap = (distance - entityA.overlapCollisionCircle.radius - entityB.overlapCollisionCircle.radius) / 2;
    
        // Normalize the difference in positions
        let dxNormalized = dx / distance;
        let dyNormalized = dy / distance;
    

        // Move each entity away from each other to resolve overlap
        entityA.x -= overlap * dxNormalized;
        entityA.y -= overlap * dyNormalized;
        entityB.x += overlap * dxNormalized;
        entityB.y += overlap * dyNormalized;
    
        // Don't forget to update the entities' actual positions if they're separate from their collision circles
    }
    
    isWeapon(entityA, entityB) {
        if(entityA instanceof Slime && entityB.hasOwnProperty('weapon')){  //all weapons should have this.weapon = true
            if(entityA.inventory.length < 2){
                entityA.inventory.push(entityB); // add it to the inventory
                entityA.state = 0;
                
                entityB.removeFromWorld = true; // remove weapon from canvas
                // entityB.assignToSlime = true;
                
                if(entityB instanceof knife){
                    this.slime.hasKnife = true;
                    this.slime.weaponState = 1; // 0 = no weapon, 1 = knife, 2 = pistol, 3 = sword 
                    console.log("true");
                }
                if (entityB instanceof pistol) {
                    this.slime.hasPistol = true;
                    this.slime.weaponState = 2;
                }
                if (entityB instanceof sword) {
                    this.slime.hasSword = true;
                    this.slime.weaponState = 3;
                }
                if(entityB instanceof sniper) {
                    this.slime.hasSniper = true;
                    this.slime.weaponState = 4;
                }
                if(entityB instanceof rocketLauncher) {
                    this.slime.hasRocket = true;
                    this.slime.weaponState = 5;
                }
    
                this.slime.currentWeapon = entityB;
            }
        }
    }

    isNPC(entity) {
        //all NPC's should have this.NPC = true
        if(entity.hasOwnProperty('NPC')) {
            return true;
        }
    }

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();

        // tester
        if (this.mouseClick) {
            // Handle mouse click
            this.handleMouseClick(this.mouseClickPos);
            this.mouseClick = false; // Reset mouse click flag
        }
    };

    handleMouseClick(clickPos) {
        // Handle mouse click here
        console.log("Mouse clicked at:", clickPos);
        // You can perform any action based on the mouse click position or interact with game entities
    }

};

// KV Le was here :)