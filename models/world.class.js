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
    statusbarFinal = new StatusbarFinal();
    throwableObjects = [];
    lastThrowTime = 0; // Cooldown for throwing bottles
    gameOverVisible = false;
    youWinVisible = false;
    youWinTimeoutId = null;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        // capture initial collectable positions so we can restore them on restart
        try {
            this.initialCoinsData = (this.level.coins || []).map(c => ({ x: c.x, y: c.y }));
            this.initialBottlesData = (this.level.bottles || []).map(b => ({ x: b.x, y: b.y, options: { collectible: !!b.collectible || true, thrown: !!b.thrown, otherDirection: !!b.otherDirection } }));
            // capture how many final enemies were defined so we can recreate them on restart
            this.initialFinalEnemyCount = (this.level.finalEnemy || []).length || 0;
        } catch (e) { this.initialCoinsData = []; this.initialBottlesData = []; this.initialFinalEnemyCount = 0; }
        this.setupTryAgainButton();
        this.setupPlayAgainButton();

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
        // draw final enemy life bar (if visible)
        this.statusbarFinal.draw(this.ctx);
        // overlay is handled via static HTML element; JS only toggles its visibility

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
            this.checkPufferFishHitBySlap();
            this.checkThrowObjects();
            this.checkCollisionJellyFishBottle();
            this.checkCollisionFinalEnemyBottle();
            this.checkGameOver();
        }, 200);
    }

    checkGameOver() {
        if (this.gameOverVisible) return;
        if (this.character && typeof this.character.isDead === 'function' && this.character.isDead()) {
            // only show the overlay once the character's death animation sequence finished
            // death sequences should set `this.character.deadAnimationFinished = true` when done
            if (this.character.deadAnimationFinished) {
                this.showGameOver();
            }
            // otherwise, the death-sequence handlers (poison/electro) will call showGameOver when appropriate
        }
    }

    showGameOver() {
        this.gameOverVisible = true;
        try {
            const el = document.getElementById('game-over-overlay');
            if (el) { el.classList.remove('hidden'); el.classList.add('visible'); }
            const btn = document.getElementById('try-again-button');
            if (btn) { btn.classList.remove('hidden'); btn.classList.add('visible'); }
        } catch (e) { /* ignore when not in browser */ }
    }

    setupTryAgainButton() {
        try {
            const btn = document.getElementById('try-again-button');
            if (!btn) return;
            btn.addEventListener('click', () => {
                try {
                    // hide game-over overlay
                    const overlay = document.getElementById('game-over-overlay');
                    if (overlay) { overlay.classList.remove('visible'); overlay.classList.add('hidden'); }
                    btn.classList.remove('visible'); btn.classList.add('hidden');
                    // directly show the static start screen element
                    const start = document.getElementById('start-screen');
                    if (start) { start.classList.remove('hidden'); start.classList.add('visible'); }

                    // Try to reset in-memory game state to avoid the overlay reappearing
                    try {
                        const w = window.world;
                        if (w && w.character) {
                            const c = w.character;
                            // restore character to alive state and default position
                            c.energy = 100;
                            c.x = 100; c.y = 250;
                            c.animationFrozen = false;
                            c.deathSequenceStarted = false;
                            c.electroDeathStarted = false;
                            c.slapping = false;
                            // clear throwable objects and other transient arrays
                            if (Array.isArray(w.throwableObjects)) w.throwableObjects.length = 0;
                            if (typeof w.resetCollectables === 'function') w.resetCollectables();
                            // reset UI bars
                            if (w.statusbarEnergy && typeof w.statusbarEnergy.setPercentage === 'function') w.statusbarEnergy.setPercentage(c.energy);
                            if (w.statusbarFinal && typeof w.statusbarFinal.hide === 'function') w.statusbarFinal.hide();
                            // clear gameOver flag so checkGameOver doesn't re-show overlay
                            w.gameOverVisible = false;
                        }
                    } catch (e) { /* ignore state-reset errors */ }

                    // Force-hide overlay element (style backup) in case CSS class toggles race
                    try {
                        const overlayEl = document.getElementById('game-over-overlay');
                        if (overlayEl) overlayEl.style.display = 'none';
                    } catch (e) { /* ignore */ }

                    // Fallback: if overlay still shows after a short delay, reload to guarantee fresh state
                    setTimeout(() => {
                        const stillVisible = document.getElementById('game-over-overlay')?.classList.contains('visible') || document.getElementById('game-over-overlay')?.style.display !== 'none';
                        if (stillVisible) {
                            try { window.location.reload(); } catch (e) { /* ignore when not in browser */ }
                        }
                    }, 250);
                } catch (e) { /* ignore when not in browser */ }
            });
        } catch (e) { /* ignore when not in browser */ }
    }

    setupPlayAgainButton() {
        try {
            const btn = document.getElementById('play-again-button');
            if (!btn) return;
            btn.addEventListener('click', () => {
                try {
                    const overlay = document.getElementById('you-win-overlay');
                    if (overlay) { overlay.classList.remove('visible'); overlay.classList.add('hidden'); overlay.style.display = 'none'; }
                    btn.classList.remove('visible'); btn.classList.add('hidden');
                    const start = document.getElementById('start-screen');
                    if (start) { start.classList.remove('hidden'); start.classList.add('visible'); }
                    // try to reset in-memory world state similar to Try Again
                    try {
                        const w = window.world;
                        if (w && w.character) {
                            const c = w.character;
                            c.energy = 100; c.x = 100; c.y = 250; c.animationFrozen = false; c.deathSequenceStarted = false; c.electroDeathStarted = false; c.slapping = false;
                            if (Array.isArray(w.throwableObjects)) w.throwableObjects.length = 0;
                                if (typeof w.resetCollectables === 'function') w.resetCollectables();
                            if (w.statusbarEnergy && typeof w.statusbarEnergy.setPercentage === 'function') w.statusbarEnergy.setPercentage(c.energy);
                            if (w.statusbarFinal && typeof w.statusbarFinal.hide === 'function') w.statusbarFinal.hide();
                            w.gameOverVisible = false;
                            // also reset you-win visibility state and clear pending timeout
                            w.youWinVisible = false;
                            if (w.youWinTimeoutId) { clearTimeout(w.youWinTimeoutId); w.youWinTimeoutId = null; }
                        }
                    } catch (e) { }
                    setTimeout(() => {
                        const stillVisible = document.getElementById('you-win-overlay')?.classList.contains('visible') || document.getElementById('you-win-overlay')?.style.display !== 'none';
                        if (stillVisible) {
                            try { window.location.reload(); } catch (e) { }
                        }
                    }, 250);
                } catch (e) { }
            });
        } catch (e) { }
    }

    // recreate coins and bottles from initial captured positions
    resetCollectables() {
        try {
            // restore coins
            if (Array.isArray(this.initialCoinsData)) {
                this.level.coins = this.initialCoinsData.map(d => new Coin(d.x, d.y));
            }
            // restore bottles (throwable objects placed in the level)
            if (Array.isArray(this.initialBottlesData)) {
                this.level.bottles = this.initialBottlesData.map(d => new ThrowableObject(d.x, d.y, d.options));
            }
            // restore final enemy(s) if the level originally had them
            if (typeof this.initialFinalEnemyCount === 'number' && this.initialFinalEnemyCount > 0) {
                this.level.finalEnemy = [];
                for (let i = 0; i < this.initialFinalEnemyCount; i++) {
                    const fe = new FinalEnemy();
                    this.level.finalEnemy.push(fe);
                }
            }
            // clear any spawned throwable objects from runtime
            if (Array.isArray(this.throwableObjects)) this.throwableObjects.length = 0;
        } catch (e) { /* ignore in non-browser env */ }
    }

    // check if any puffer fish was hit by the character's slap (one-shot)
    checkPufferFishHitBySlap() {
        if (!this.character || !this.character.slapping) return false;
        for (let i = this.level.pufferFishs.length - 1; i >= 0; i--) {
            const fish = this.level.pufferFishs[i];
            if (this.processPufferFishSlapCollision(fish)) return true;
        }
        return false;
    }

    processPufferFishSlapCollision(fish) {
        if (!fish || fish.deadStarted) return false;
        const slapRect = this.getSlapRect();
        const fishRect = { left: fish.x, right: fish.x + fish.width, top: fish.y, bottom: fish.y + fish.height };
        if (!this.rectsOverlap(slapRect, fishRect)) return false;
        this.startPufferFishDeathAnimation(fish);
        return true;
    }

    getSlapRect() {
        const c = this.character;
        const w = 120, h = 90;
        const x = c.otherDirection ? c.x - w : c.x + c.width;
        const y = c.y + 50;
        return { left: x, right: x + w, top: y, bottom: y + h };
    }

    rectsOverlap(a, b) {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    }

    startPufferFishDeathAnimation(fish) {
        if (!fish) return;
        fish.deadStarted = true;
        // set dead image
        const path = (fish.IMAGES_DEAD && fish.IMAGES_DEAD[0]) || fish.img;
        if (fish.imageCache && fish.imageCache[path]) fish.img = fish.imageCache[path];
        else { const i = new Image(); i.src = path; fish.img = i; }
        // animate diagonal up away from character
        const away = fish.x < this.character.x ? -4 : 4;
        const up = -5;
        const interval = setInterval(() => {
            fish.x += away; fish.y += up;
            if (fish.y < -200) { clearInterval(interval); this.removePufferFish(fish); }
        }, 1000 / 60);
    }

    removePufferFish(fish) {
        const idx = this.level.pufferFishs.indexOf(fish);
        if (idx !== -1) this.level.pufferFishs.splice(idx, 1);
    }

    checkCollisionsWithJellyFishs() {
        this.level.jellyFishs.forEach(jellyFish => this.processJellyFishCollision(jellyFish));
    }

    processJellyFishCollision(jellyFish) {
        if (!this.isEnemyWithinCharacterInnerHitbox(jellyFish)) return;
        this.character.isHit(1);
        this.statusbarEnergy.setPercentage(this.character.energy);
        if (this.character.isDead()) this.startPoisonDeathSequence();
        else this.character.playAnimation(this.character.IMAGES_HURT_POISONED);
    }

    startPoisonDeathSequence() {
        if (this.character.deathSequenceStarted) return;
        this.character.deathSequenceStarted = true;
        this.character.animationFrozen = true; // stop normal loops
        this.playPoisonDeathFrames();
    }

    playPoisonDeathFrames() {
        const imgs = this.character.IMAGES_DEAD_POISONED;
        let k = 0; const fps = 5; let interval;
        const tick = () => {
            this.setCharacterImgByPath(imgs[k]);
            k++;
            if (k >= imgs.length) {
                clearInterval(interval);
                this.finalizePoisonDeathFrame(imgs[imgs.length - 1]);
            }
        };
        interval = setInterval(tick, 1000 / fps);
    }

    setCharacterImgByPath(path) {
        if (!path) return;
        if (this.character.imageCache && this.character.imageCache[path]) {
            this.character.img = this.character.imageCache[path];
            return;
        }
        const i = new Image(); i.src = path; this.character.img = i;
    }

    finalizePoisonDeathFrame(lastPath) {
        this.setCharacterImgByPath(lastPath);
        this.character.animationFrozen = true;
        // start fall and when finished show Game Over overlay
        this.startCharacterFall(() => {
            try { this.character.deadAnimationFinished = true; } catch (e) {}
            try { this.showGameOver(); } catch (e) {}
        });
    }

    startCharacterFall() {
        const targetY = this.ctx.canvas.height + 200;
        const fallSpeed = 6;
        // allow optional callback when fall completes
        const args = Array.prototype.slice.call(arguments);
        const onComplete = typeof args[0] === 'function' ? args[0] : null;
        const fallInterval = setInterval(() => {
            if (this.character.y < targetY) this.character.y += fallSpeed;
            else { this.character.y = targetY; clearInterval(fallInterval); if (onComplete) onComplete(); }
        }, 1000 / 60);
    }

    checkCollisionsWithPufferFishs() {
        this.level.pufferFishs.forEach(p => this.processPufferFishCollision(p));
    }

    processPufferFishCollision(pufferFish) {
        if (!this.isEnemyWithinCharacterInnerHitbox(pufferFish)) return;
        this.character.isHit(2);
        this.statusbarEnergy.setPercentage(this.character.energy);
        if (this.character.isDead()) this.startElectroDeathSequence();
        else this.character.playAnimation(this.character.IMAGES_HURT_ELECTRO);
    }

    startElectroDeathSequence() {
        if (this.character.electroDeathStarted) return;
        this.character.electroDeathStarted = true;
        this.character.playAnimation(this.character.IMAGES_DEAD_ELECTRO);
        const imgs = this.character.IMAGES_DEAD_ELECTRO || [];
        if (imgs.length) this.setCharacterImgByPath(imgs[imgs.length - 1]);
        this.character.animationFrozen = true;
        // show the final frame for a short moment before showing Game Over
        try {
            setTimeout(() => {
                try { this.character.deadAnimationFinished = true; } catch (e) {}
                try { this.showGameOver(); } catch (e) {}
            }, 1200); // 1.2s delay so player sees final death frame
        } catch (e) { }
    }

    checkThrowObjects() {
        const now = Date.now();
        if (!this.canStartThrow(now)) return;
        this.spawnAndConsumeBottle(now);
    }

    canStartThrow(now) {
        const throwCooldown = 500;
        if (!this.keyboard.D) return false;
        if (now - this.lastThrowTime <= throwCooldown) return false;
        return this.statusbarPoisson && this.statusbarPoisson.numberOfPoissons > 0;
    }

    spawnAndConsumeBottle(now) {
        // defensive check: ensure the player actually has a poison/bottle to throw
        if (!(this.statusbarPoisson && this.statusbarPoisson.numberOfPoissons > 0)) {
            try { if (this.statusbarPoisson && typeof this.statusbarPoisson.flash === 'function') this.statusbarPoisson.flash(1000); } catch (e) {}
            return false;
        }
        const facingLeft = !!this.character.otherDirection;
        const spawnX = this.character.x + (facingLeft ? -20 : 90);
        const spawnY = this.character.y + 70;
        const bottle = this.createThrowable(spawnX, spawnY, facingLeft);
        // reduce poison count in statusbar and mark thrown
        try { bottle.onThrow(); } catch (e) {}
        this.throwableObjects.push(bottle);
        this.lastThrowTime = now;
        return true;
    }

    createThrowable(spawnX, spawnY, facingLeft) {
        const bottle = new ThrowableObject(spawnX, spawnY, { otherDirection: facingLeft });
        bottle.world = this;
        return bottle;
    }

    checkCollisionJellyFishBottle() {
        if (!this.throwableObjects || !this.level || !this.level.jellyFishs) return;
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            const bottle = this.throwableObjects[i];
            for (let j = this.level.jellyFishs.length - 1; j >= 0; j--) {
                const jellyFish = this.level.jellyFishs[j];
                if (this.isBottleOnJellyFish(bottle, jellyFish)) {
                    this.throwableObjects.splice(i, 1);
                    this.playDeathAnimationThenRemove(jellyFish, this.level.jellyFishs, j, jellyFish.IMAGES_DEAD);
                    break;
                }
            }
        }
    }

    checkCollisionFinalEnemyBottle() {
        if (!this.throwableObjects || !this.level || !this.level.finalEnemy) return;
        const enemy = this.level.finalEnemy[0];
        if (!enemy) return;
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            const bottle = this.throwableObjects[i];
            if (!bottle.thrown) continue;
                if (this.isBottleOnFinalEnemyStrict(bottle, enemy)) {
                    this.applyBottleHitToEnemy(i, enemy);
                    break;
                }
        }
    }

    handleBottleFinalEnemyCollision(bottle, enemy, bottleIndex) {
        if (!this.isBottleOnFinalEnemyStrict(bottle, enemy)) return false;
        this.applyBottleHitToEnemy(bottleIndex, enemy);
        return true;
    }

    applyBottleHitToEnemy(bottleIndex, enemy) {
        this.throwableObjects.splice(bottleIndex, 1);
        if (typeof enemy.takeDamage === 'function') enemy.takeDamage(20);
        else if (enemy.life !== undefined) enemy.life = Math.max(0, enemy.life - 20);
        if (!this.statusbarFinal.visible) this.statusbarFinal.show();
        this.statusbarFinal.setPercentage(enemy.life);
        // if the enemy is dead (life <= 0 or flagged dead), show the You Win screen
        const enemyDead = (typeof enemy.dead !== 'undefined' && enemy.dead) || (typeof enemy.life !== 'undefined' && enemy.life <= 0);
        if (enemyDead) {
            this.showYouWin();
        }
    }

    showYouWin() {
        // show you-win overlay after a short delay so final enemy death animation can be seen
        if (this.youWinVisible) return; // already scheduled or visible
        this.youWinVisible = true;
        try {
            // clear any previous timeout
            if (this.youWinTimeoutId) { clearTimeout(this.youWinTimeoutId); this.youWinTimeoutId = null; }
            this.youWinTimeoutId = setTimeout(() => {
                try {
                    const el = document.getElementById('you-win-overlay');
                    if (el) { el.classList.remove('hidden'); el.classList.add('visible'); el.style.display = 'flex'; }
                    const box = document.querySelector('.you-win-box');
                    if (box) { box.classList.remove('hidden'); box.classList.add('visible'); box.style.display = 'flex'; }
                    const btn = document.getElementById('play-again-button');
                    if (btn) { btn.classList.remove('hidden'); btn.classList.add('visible'); btn.style.display = 'inline-block'; }
                } catch (e) { /* ignore DOM errors */ }
            }, 1200); // default 1200ms delay
        } catch (e) { /* ignore when not in browser */ }
    }

    playDeathAnimationThenRemove(enemy, arrayRef, idx, imagesArray) {
        if (!this.validateDeathAnimationInputs(enemy, arrayRef, imagesArray)) {
            if (arrayRef && typeof idx === 'number') arrayRef.splice(idx, 1);
            return;
        }
        this.playFramesThenRemove(enemy, arrayRef, idx, imagesArray);
    }

    validateDeathAnimationInputs(enemy, arrayRef, imagesArray) {
        return !!enemy && Array.isArray(arrayRef) && Array.isArray(imagesArray) && imagesArray.length > 0;
    }

    playFramesThenRemove(enemy, arrayRef, idx, imagesArray) {
        let k = 0; const fps = 5;
        const interval = setInterval(() => {
            const path = imagesArray[k];
            this.setEnemyImgByPath(enemy, path);
            k++;
            if (k >= imagesArray.length) { clearInterval(interval); this.removeEnemyFromArray(enemy, arrayRef, idx); }
        }, 1000 / fps);
    }

    setEnemyImgByPath(enemy, path) {
        if (enemy.imageCache && enemy.imageCache[path]) { enemy.img = enemy.imageCache[path]; return; }
        const img = new Image(); img.src = path; enemy.img = img;
    }

    removeEnemyFromArray(enemy, arrayRef, idx) {
        const removeIndex = arrayRef.indexOf(enemy);
        if (removeIndex !== -1) arrayRef.splice(removeIndex, 1);
        else if (typeof idx === 'number') arrayRef.splice(idx, 1);
    }

    isBottleOnJellyFish(bottle, jellyFish) {
        if (!bottle || !jellyFish || !bottle.thrown) return false;
        const bx = Number(bottle.x || 0);
        const by = Number(bottle.y || 0);
        const bw = Number(bottle.width || 0);
        const bh = Number(bottle.height || 0);
        const jx = Number(jellyFish.x || 0);
        const jy = Number(jellyFish.y || 0);
        const jw = Number(jellyFish.width || 0);
        const jh = Number(jellyFish.height || 0);
        return bx < jx + jw && bx + bw > jx && by < jy + jh && by + bh > jy;
    }


    isBottleOnFinalEnemyStrict(bottle, enemy) {
        if (!bottle || !enemy || !bottle.thrown) return false;
        const bx = Number(bottle.x || 0);
        const by = Number(bottle.y || 0);
        const bw = Number(bottle.width || 0);
        const bh = Number(bottle.height || 0); 
        const cx = bx + bw / 2;
        const cy = by + bh / 2;
        const ex = Number(enemy.x || 0);
        const ey = Number(enemy.y || 0);
        const ew = Number(enemy.width || 0);
        const eh = Number(enemy.height || 0); 
        const marginX = ew * 0.2; // 25% width
        const marginY = eh * 0.30; // 30% height
        const left = ex + marginX;
        const right = ex + ew - marginX;
        const top = ey + marginY;
        const bottom = ey + eh - marginY;
        return cx >= left && cx <= right && cy >= top && cy <= bottom;
    }

    getBottleCenter(bottle) {
        const bx = Number(bottle.x || 0);
        const by = Number(bottle.y || 0);
        const bw = Number(bottle.width || 0);
        const bh = Number(bottle.height || 0);
        return { x: bx + bw / 2, y: by + bh / 2 };
    }

    getEnemyInnerRect(enemy) {
        const ex = Number(enemy.x || 0);
        const ey = Number(enemy.y || 0);
        const ew = Number(enemy.width || 0);
        const eh = Number(enemy.height || 0);
        const marginX = ew * 0.2;
        const marginY = eh * 0.30;
        return { left: ex + marginX, right: ex + ew - marginX, top: ey + marginY, bottom: ey + eh - marginY };
    }
    
    isPointInRect(x, y, rect) {
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
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

   isEnemyWithinCharacterInnerHitbox(enemy) {
        const ex = enemy.x + enemy.width / 2;
        const ey = enemy.y + enemy.height / 2;
        const marginX = this.character.width * 0.1;
        const marginY = this.character.height * 0.2; // (must be < 50%)
        const left = this.character.x + marginX;
        const right = this.character.x + this.character.width - marginX;
        const top = this.character.y + marginY;
        const bottom = this.character.y + this.character.height - marginY;
        return ex >= left && ex <= right && ey >= top && ey <= bottom;
    }
}
