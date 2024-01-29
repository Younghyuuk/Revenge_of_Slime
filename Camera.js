class Camera {
    constructor(viewportWidth, viewportHeight) {
        this.x = 0;
        this.y = 0;
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
    }

    follow(target) {
        this.x = target.x - this.viewportWidth / 2;
        this.y = target.y - this.viewportHeight / 2;

        // Add boundary checks here if necessary
    }
}
