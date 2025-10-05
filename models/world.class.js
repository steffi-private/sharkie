class World {
    character = new Character();
    level = level1; // Assuming level1 is defined in levels/level1.js
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    statusbarEnergy = new StatusbarEnergy();
    statusbarCoin = new StatusbarCoin();
    statusbarPoisson = new StatusbarPoisson();
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.jellyFishs);
        this.addObjectsToMap(this.level.pufferFishs);
        this.addObjectsToMap(this.level.finalEnemy);
        this.addObjectsToMap(this.level.coins);
        if (this.level.bottles) {
            this.addObjectsToMap(this.level.bottles);
        }
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0);

        //fixed objects
        this.addToMap(this.statusbarEnergy);
        this.addToMap(this.statusbarCoin);
        this.addToMap(this.statusbarPoisson);

        //draw() is called repeatedly
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    setWorld() {
        this.character.world = this;
    }

    run() {

        setInterval(() => {
            this.checkCollisionsWithJellyFishs();
            this.checkCollisionsWithPufferFishs();
            this.checkThrowObjects();
        }, 200);
    }

    checkCollisionsWithJellyFishs() {
        this.level.jellyFishs.forEach(jellyFish => {
            if (this.isEnemyWithinCharacterInnerHitbox(jellyFish)) {
                this.character.isHit(1);
                this.statusbarEnergy.setPercentage(this.character.energy);
                if (this.character.isDead()) {
                    this.character.playAnimation(this.character.IMAGES_DEAD_POISONED);
                } else {
                    this.character.playAnimation(this.character.IMAGES_HURT_POISONED);
                }
            }
        });
    }

    checkCollisionsWithPufferFishs() {
        this.level.pufferFishs.forEach(pufferFish => {
            if (this.isEnemyWithinCharacterInnerHitbox(pufferFish)) {
                this.character.isHit(2);
                this.statusbarEnergy.setPercentage(this.character.energy);
                if (this.character.isDead()) {
                    this.character.playAnimation(this.character.IMAGES_DEAD_ELECTRO);
                } else {
                    this.character.playAnimation(this.character.IMAGES_HURT_ELECTRO);
                }
            }
        });
    }

    checkThrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 90, this.character.y + 70);
            this.throwableObjects.push(bottle);
        }
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
        movableObject.draw(this.ctx);
        if (typeof movableObject.drawFrame === 'function') {//check if drawFrame exists before calling it
            movableObject.drawFrame(this.ctx);
        }
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

    // Use a strict collision check similar to collectable objects:
    // enemy center must lie inside a reduced inner rectangle of the character.
    isEnemyWithinCharacterInnerHitbox(enemy) {
        const ex = enemy.x + enemy.width / 2;
        const ey = enemy.y + enemy.height / 2;
        const marginX = this.character.width * 0.20; 
        const marginY = this.character.height * 0.35; // (must be < 50%)
        const left = this.character.x + marginX;
        const right = this.character.x + this.character.width - marginX;
        const top = this.character.y + marginY;
        const bottom = this.character.y + this.character.height - marginY;
        return ex >= left && ex <= right && ey >= top && ey <= bottom;
    }
}
