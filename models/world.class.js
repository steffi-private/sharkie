class World {
    character = new Character();
    pufferFish = [
        new PufferFish(),
        new PufferFish(),
        new PufferFish(),
    ];
    jellyFish = [
        new JellyFish(),
        new JellyFish(),
    ];
    finalEnemy = new FinalEnemy();

    ctx;
    canvas;

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.draw();

    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.drawImage(
            this.character.img,
            this.character.x,
            this.character.y,
            this.character.width,
            this.character.height
        );

        this.pufferFish.forEach(fish => {
            this.ctx.drawImage(
                this.fish.img,
                this.fish.x,
                this.fish.y,
                this.fish.width,
                this.fish.height
                );
            }
        );


        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    
    update() {

    }
}