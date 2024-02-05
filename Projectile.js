const PROJECTILE_BC_RADIUS = 10
const PROJECTILE_BB_DIMEN = 20
class Projectile {
    constructor(posX, posY, spritesheetPath, xStart=0, yStart=0, width, height, frameCount, scale, angle,
                speed, despawnTime, fudgeScaling=1) {
        this.speed = speed
        this.despawnTime = despawnTime

        //Rotated Canvas Cache
        this.angle = angle
        // this.tempCanvas = document.createElement("canvas")
        // this.tempCTX = this.tempCanvas.getContext("2d")
        // this.animator.spritesheet = this.tempCanvas;

        //Finds Movement Vectors
        var unitx = Math.cos(this.angle);
        var unity = Math.sin(this.angle);
        this.movementVectorX = (unitx * this.speed)
        this.movementVectorY = (unity * this.speed)

        this.animator = new AnimatorRotateOnce(ASSET_MANAGER.getAsset(spritesheetPath), xStart, yStart, width, height, angle, frameCount, scale, fudgeScaling)

        this.bc = new BoundingCircle(this.posX, this.posY, PROJECTILE_BC_RADIUS)
        this.bb = new BoundingBox(this.posX, this.posY, PROJECTILE_BB_DIMEN, PROJECTILE_BB_DIMEN)
        this.bb.updateSides()
    }

    update(){
        this.saveLastBB()
        this.automaticDespawnHandler()
        this.updateCollision()
        this.movementHandler()
    }

    checkCollisions() {
        //ABSTRACT
    }

    automaticDespawnHandler() {
        this.despawnTime -= GAME_ENGINE.clockTick
        if (this.despawnTime <= 0) {
           this.removeFromWorld = true
        }
    }

    draw() {
        //super.draw()

        this.animator.drawFrame(this.posX - (this.width/2), this.posY - (this.height/2));
        //TODO DEBUG REMOVE ME
        this.bc.drawBoundingCircle()
        this.bb.drawBoundingBox()
    }

    // movementHandler() {
    //     this.posX += this.movementVectorX * GAME_ENGINE.clockTick
    //     this.posY += this.movementVectorY * GAME_ENGINE.clockTick
    // }


    // saveLastBB() {
    //     this.lastbb = this.bb
    //     this.bb = new BoundingBox(
    //         this.posX - (this.bb.width/ 2),
    //         this.posY - (this.bb.height/ 2),
    //         PROJECTILE_BB_DIMEN, PROJECTILE_BB_DIMEN)
    // }

    updateCollision() {
        this.bb.x = this.posX - (this.bb.width/ 2)
        this.bb.y = this.posY - (this.bb.height/ 2)
        this.bb.updateSides()

        this.bc.x = this.posX
        this.bc.y = this.posY
    }

    // onCreate() {
    //     console.log(unitx + ", " + unity)
    //     console.log(this.movementVectorX + ", " + this.movementVectorY)
    //
    //     //CODE FROM PLAYER
    //     this.tempCanvas.width = Math.sqrt(Math.pow(Math.max(BULLET_IMAGE_WIDTH, BULLET_IMAGE_HEIGHT), 2) * 2) //Offscreen canvas square that fits old asset
    //     this.tempCanvas.height = this.tempCanvas.width
    //     // var myOffset = this.tempCanvas.width/2 - this.width/2
    //     this.xAllign = 1 * BULLET_IMAGE_SCALE
    //     this.yAllign = -200 * BULLET_IMAGE_SCALE
    //
    //     this.tempCTX.save();
    //     this.tempCTX.translate((BULLET_IMAGE_WIDTH / 2), (BULLET_IMAGE_HEIGHT / 2)) //Find mid (Squares ONLY)
    //     this.tempCTX.rotate(this.angle + (Math.PI) / 2)
    //     this.tempCTX.translate (-(BULLET_IMAGE_WIDTH / 2), -(BULLET_IMAGE_HEIGHT / 2)) ;
    //     this.tempCTX.drawImage(this.asset, 0, 0, BULLET_IMAGE_WIDTH, BULLET_IMAGE_HEIGHT);
    //     this.tempCTX.restore();
    // }
}

// const BULLET_IMAGE_SCALE = 0.5;
// const BULLET_IMAGE_WIDTH = 318 * BULLET_IMAGE_SCALE;
// const BULLET_IMAGE_HEIGHT = 283 * BULLET_IMAGE_SCALE;
// const BULLET_RADIUS = (Math.min(BULLET_IMAGE_WIDTH, BULLET_IMAGE_HEIGHT) / 2);

// const bulletImage = "Assets/Images/Items/Bullet.png"
const BULLET_ANGLE_OFFSET = 0
const BULLET_IMAGE_SCALE = 1
const BULLET_IMAGE_WIDTH = 44
const BULLET_IMAGE_HEIGHT = 44
const BULLET_DESPAWN_TIME = 10
class Bullet extends Projectile {
    constructor(posX, posY, angle, damage, bulletspeed) {
        // console.log("CONSTRUCTUR BULLET: " + posXOriginal + " " +  posYOriginal)
        super(posX,posY, bulletImage, 0,0, BULLET_IMAGE_WIDTH, BULLET_IMAGE_HEIGHT,1, 1, angle, bulletspeed, BULLET_DESPAWN_TIME);

        // console.log(posXOriginal, posYOriginal)
        // console.log(this.posXOriginal, this.posYOriginal)

        this.damage = damage

    }

    update() {
        this.checkCollisions()
    }

    checkCollisions() {
        //Zombies
        GAME_ENGINE.ent_Zombies.forEach((entity) => {
            if (entity instanceof Zombie) {
                let intersectionDepth = this.bc.collide(entity.bc_Movement)
                if (intersectionDepth < 0) {
                    entity.takeDamage(this.damage, ZOMBIE_DMG_SHOT)
                    // GAME_ENGINE.addEntity(new Sound("Assets/Audio/SFX/Guns/hitmarker.mp3",1))
                    this.removeFromWorld = true
                }
            }
        })
        GAME_ENGINE.ent_MapObjects.forEach((entity) => {
            if (entity instanceof MapBB || entity instanceof MapInteract) {
                if(this.bb.collide(entity.bb) && !entity.projectilePasses) {
                    this.removeFromWorld = true
                }
            }
        })
    }
}


