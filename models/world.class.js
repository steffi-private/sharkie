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
        new BackgroundObject("../img/3.Background/Dark/1.png", 0, 0),
    ];
    ctx;
    canvas;

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.draw();

    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.addToMap(this.character);        
        this.addObjectsToMap(this.jellyFishs);
        this.addObjectsToMap(this.pufferFishs);
        this.addObjectsToMap(this.backgroundObjects);
        
        //draw() is called repeatedly
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
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