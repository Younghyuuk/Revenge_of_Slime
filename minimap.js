class miniMap{
    constructor(game){
        this.game = game;
        this.x = 1175;
        this.y = 20
    }

    update() {

    }

    draw(ctx) {
        
        ctx.fillStyle = "#a1662e"; //ground color
        ctx.fillRect(this.x, this.y, 100, 100);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#959191"; // wall color
        ctx.strokeRect(this.x, this.y, 100, 100);

        for(var i = 0; i < this.game.entities.length; i++){
            this.game.entities[i].drawMiniMap(ctx, this.x, this.y);
        }

        ctx.lineWidth = 1; // reset line width for collision circles etc.
    }
}