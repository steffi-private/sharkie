class World {
    character = new Character();
    
    pufferFishs = level1.pufferFishs;
    jellyFishs = level1.jellyFishs;
    finalEnemy = level1.finalEnemy;
    backgroundObjects = level1.backgroundObjects;

    ctx;
    canvas;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        
        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.jellyFishs);
        this.addObjectsToMap(this.pufferFishs);
        this.addToMap(this.character);     
        
        this.ctx.translate(-this.camera_x, 0);
        
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
        if (movableObject.otherDirection) {
           this.flipImage(movableObject); 
        }
        this.ctx.drawImage(
            movableObject.img,
            movableObject.x,
            movableObject.y,
            movableObject.width,
            movableObject.height
        )
        if (movableObject.otherDirection) {
            this.flipImageBack(movableObject);
        }
    }


    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }


    flipImageBack(movableObject) {
        movableObject.x = movableObject.x * -1;
        this.ctx.restore();
    }
        
    update() {

    }
}