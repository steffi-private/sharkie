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
    lastThrowTime = 0; // Cooldown for throwing bottles

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
            this.checkCollisionJellyFishBottle();
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
        const currentTime = Date.now();
        const throwCooldown = 500; // 500ms cooldown between throws
        
        if (this.keyboard.D && currentTime - this.lastThrowTime > throwCooldown) {
            // Check if we have poison bottles to throw
            if (this.statusbarPoisson.numberOfPoissons > 0) {
                let bottle = new ThrowableObject(this.character.x + 90, this.character.y + 70);
                bottle.world = this; // Set world reference for onThrow function
                bottle.onThrow(); // Reduce poison status bar when throwing
                this.throwableObjects.push(bottle);
                this.lastThrowTime = currentTime; // Update last throw time
            }
        }
    }


    checkCollisionJellyFishBottle() {
        if (!this.throwableObjects || !this.level || !this.level.jellyFishs) return;

        // Rückwärts iterieren, damit Entfernen sicher ist
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            const bottle = this.throwableObjects[i];

            for (let j = this.level.jellyFishs.length - 1; j >= 0; j--) {
                const jelly = this.level.jellyFishs[j];

                if (this.isBottleWithinEnemyInnerBox(bottle, jelly)) {
                    // Entferne die Flasche sofort aus dem Spiel
                    this.throwableObjects.splice(i, 1);

                    // spiele Todes-Animation einmal und entferne das JellyFish danach
                    this.playDeathAnimationThenRemove(jelly, this.level.jellyFishs, j, jelly.IMAGES_DEAD);

                    // Ein Treffer pro Flasche -> weiter zur nächsten Flasche
                    break;
                }
            }
        }
    }


    playDeathAnimationThenRemove(enemy, arrayRef, idx, imagesArray) {
        if (!enemy || !arrayRef || !imagesArray || imagesArray.length === 0) {
            // Fallback: sofort entfernen
            arrayRef.splice(idx, 1);
            return;
        }

        let k = 0;
        const fps = 5;
        const interval = setInterval(() => {
            const path = imagesArray[k];
            if (enemy.imageCache && enemy.imageCache[path]) {
                enemy.img = enemy.imageCache[path];
            } else {
                // falls imageCache noch nicht vorhanden ist, lade Bild provisorisch
                const img = new Image();
                img.src = path;
                enemy.img = img;
            }
            k++;
            if (k >= imagesArray.length) {
                clearInterval(interval);
                // Entfernen aus Level-Array
                const removeIndex = arrayRef.indexOf(enemy);
                if (removeIndex !== -1) {
                    arrayRef.splice(removeIndex, 1);
                } else if (typeof idx === 'number') {
                    // Fallback anhand des übergebenen idx
                    arrayRef.splice(idx, 1);
                }
            }
        }, 1000 / fps);
    }


    isBottleWithinEnemyInnerBox(bottle, enemy) {
        if (!bottle || !enemy) return false;

        const bx = bottle.x + (bottle.width || 0) / 2;
        const by = bottle.y + (bottle.height || 0) / 2;

        const marginX = enemy.width * 0.15;
        const marginY = enemy.height * 0.25; // (must be < 50%) 

        const left = enemy.x + marginX;
        const right = enemy.x + enemy.width - marginX;
        const top = enemy.y + marginY;
        const bottom = enemy.y + enemy.height - marginY;

        return bx >= left && bx <= right && by >= top && by <= bottom;
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
