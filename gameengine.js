// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;
      
        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        this.mouseClick = false;

        //key input
        this.W = false;
        this.A = false;
        this.S = false;
        this.D = false;

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
     
        // Camera object
        // this.slime = new Slime(this.game, 77, 430, 150, 100, 10);
        this.cam = new CameraScene(this);
        this.map = new map(this.cam);
       
    };

    init(ctx) {
       
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
      
        
        
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

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
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
            this.mouseClick = true;
            console.log("MOUSE CLICK");
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
            }
        })
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
       
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.map.drawMap(this.ctx);

        // Draw latest things first
        for (let i = this.entities.length - 1; i >= 0; i--) {
            this.entities[i].draw(this.ctx, this);
        }
        // this.camera.draw(this.ctx);
    };

    update() {
        let entitiesCount = this.entities.length;
        
        // Update the camera to follow the slime character ADD IN THE SLIME CLASS
        // this.camera.follow(this.slime);

        for (let i = 0; i < entitiesCount; i++) {
            let entity1 = this.entities[i];

            if (!entity1.removeFromWorld) {
                
                for (let j = i + 1; j < entitiesCount; j++) {
                    let entity2 = this.entities[j];
                    if (this.areColliding(entity1, entity2)) {
                        if (this.isNPC(entity1) && this.isNPC(entity2)) {
                            this.resolveCollision(entity1, entity2);
                        } else if(entity1 instanceof Slime && this.isNPC(entity2)) {
                        // } else if(entity1 instanceof Slime && this.isNPC(entity2) && this.click != null) {
                            // entity1.attacking = true;
                            // entity1.attack(entity2);
                            entity1.enemyInRange = entity2;
                            
                        }
                        this.isWeapon(entity1, entity2);
                    }
                }
                entity1.update();
            }
        }
        //for camera later
        // this.camera.update();

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
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
        if(entityA instanceof Slime){
            if(entityB.hasOwnProperty('weapon')) { //all weapons should have this.weapon = true
                entityA.inventory.push(entityB); // add it to the inventory
                entityA.damage = entityB.damage; // make slimes damage weapons damage

                //adding collision circles together and assigning it to slime
                var collisionCircle = {radius: entityA.collisionCircle.radius + entityB.collisionCircle.radius,
                                    x: entityA.collisionCircle.x + entityB.collisionCircle.x,
                                    y: entityA.collisionCircle.y + entityB.collisionCircle.y};
                entityA.collisionCircle = collisionCircle; 
                entityA.overlapCollisionCircle = collisionCircle;

                entityB.removeFromWorld = true; // remove weapon from canvas
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
    };

};

// KV Le was here :)