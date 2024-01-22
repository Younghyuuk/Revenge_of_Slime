class Animator {
    constructor(spriteSheet, xSpriteSheet, ySpriteSheet, width, height, frameCount, frameDuration) {
        Object.assign(this, {spriteSheet, xSpriteSheet, ySpriteSheet, width, height, frameCount, frameDuration});
        
        this.elapsedTime = 0;
        this.totalTime = frameCount * frameDuration;
    
    };


    drawFrame(tick, ctx, x, y) {

        this.elapsedTime += tick;
        if (this.elapsedTime > this.totalTime) this.elapsedTime -= this.totalTime;
        var frame = this.currentFrame();


        ctx.drawImage(this.spriteSheet, 
            this.xSpriteSheet + this.width * frame, this.ySpriteSheet, // coords on sprite sheet
            this.width, this.height, // size on spritesheet 
            x, y,                             // coords on canvas  
            this.width * 3, this.height * 3); // size on canvas * scale
    

    };
    
    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
}