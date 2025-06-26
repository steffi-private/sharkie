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
    backgroundObjects = [
        new BackgroundObject("../img/3.Background/Layers/5. Water/D1.png", 0, 0),
        new BackgroundObject("../img/3.Background/Layers/5. Water/D2.png", 720, 0),
        new BackgroundObject("../img/3.Background/Layers/4.Fondo 2/D1.png", 0, 0),
        new BackgroundObject("../img/3.Background/Layers/4.Fondo 2/D2.png", 720, 0),
        new BackgroundObject("../img/3.Background/Layers/3.Fondo 1/D1.png", 0, 0),
        new BackgroundObject("../img/3.Background/Layers/3.Fondo 1/D2.png", 720, 0),
        new BackgroundObject("../img/3.Background/Layers/1. Light/1.png", 0, 0),
        new BackgroundObject("../img/3.Background/Layers/1. Light/2.png", 720, 0),
        new BackgroundObject("../img/3.Background/Layers/2. Floor/D1.png", 0, 0),
        new BackgroundObject("../img/3.Background/Layers/2. Floor/D2.png", 720, 0),
    ];
    ctx;
    canvas;
    keyboard;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.jellyFishs);
        this.addObjectsToMap(this.pufferFishs);
        this.addToMap(this.character);       
        
        //draw() is called repeatedly
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    setWorld() {
        this.character.world = this;
    }

    
    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    addToMap(movableObject) {
        this.ctx.drawImage(
            movableObject.img,
            movableObject.x,
            movableObject.y,
            movableObject.width,
            movableObject.height
        );}

    update() {

    }
}