class World {
    character = new Character();

    pufferFishs = [
        new PufferFish(),
        new PufferFish(),
        new PufferFish(),
    ];

    jellyFishs = [
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


        let self = this;
        this.jellyFishs.forEach(fish => {
            self.ctx.drawImage(
                fish.img,
                fish.x,
                fish.y,
                fish.width,
                fish.height
                );
            }
        );

        
        this.pufferFishs.forEach(fish => {
            self.ctx.drawImage(
                fish.img,
                fish.x,
                fish.y,
                fish.width,
                fish.height
                );
            }
        );

        
      
        
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    
    update() {

    }
}