class Animator {
    constructor (spritesheet, xStart, yStart, width, height, frameCount, frameDuration, scale) {
        Object.assign(this, {spritesheet, xStart, yStart, width, height, frameCount, frameDuration, scale});

        // time that has passed in the animation
        this.elapsedTime = 0;
        //Total time that the animation takes to go through all the frames
        this.totalTime = frameCount * frameDuration;
    };

    // if the character has more than one collision circle, pass in an array of circles through the "collisionCircles" param
    drawFrame(tick, ctx, x, y, collisionCircles) {
        //takes the amount of time that has passed since the last time we called this method
        //and adds it to the total elapsed time
        this.elapsedTime += tick;

        if (this.elapsedTime > this.totalTime) this.elapsedTime -= this.totalTime;
        // used the calculated elapsed time to find out what frame we are on
        const frame = this.currentFrame();

        const scaledWidth = this.width * this.scale;
        const scaledHeight = this.height * this.scale;

        ctx.drawImage(this.spritesheet, 
                  this.xStart + this.width * frame, this.yStart, //starting x andf y coordinates
                  this.width, this.height, // starting width and height
                  x, y, //destination x and y coordinates
                  scaledWidth, scaledHeight); //destination height and width
        
        // Draw all the collision circles

        // Ensure collisionCircles is an array
        if (!Array.isArray(collisionCircles)) {
            // If it's not an array, make it an array with one element
            collisionCircles = [collisionCircles];
        }
        
        collisionCircles.forEach(collisionCircle => {
            ctx.beginPath(); // Start a new path
            ctx.arc(collisionCircle.x, collisionCircle.y, collisionCircle.radius, 0, Math.PI * 2, true);
            ctx.strokeStyle = 'red'; // Red border
            ctx.stroke(); // Outline the circle
        });
    };

    
    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};