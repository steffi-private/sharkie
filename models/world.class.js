class World {
    character = new Character();
    enemies = [
        new PufferFish(),
        new PufferFish(),
        new PufferFish(),
        new JellyFish(),
        new JellyFish(),
        new FinalEnemy(),
    ];
    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");

        // Warten, bis das Bild vollständig geladen ist
        this.character.img.onload = () => {
            this.draw();
        };
    }

    draw() {
        this.ctx.drawImage(
            this.character.img,
            this.character.x,
            this.character.y,
            this.character.width,
            this.character.height
        );
    }

    
    update() {

    }
}