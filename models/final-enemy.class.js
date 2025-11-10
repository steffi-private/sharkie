class FinalEnemy extends MovableObject {

    width = 300;
    height = 400;

    x = 2400; // Initial x position
    y = 100; // Initial y position

    speed = 10;// Default speed
    attackSound = new Audio('audio/eating-sound-effect-36186.mp3');

    hadFirstContact = false;
    moveInterval = null; // store interval id for movement so we can clear it
    // animation control
    animationInterval = null; // store interval id for the main animation loop
    introFramesCount = 10; // how many animation ticks show the intro before floating
    animationFPS = 5; // frames per second for the main animate loop
    visible = false; // when false, DrawableObject.draw will skip rendering
    // attack related
    attacking = false;
    lastAttackTime = 0;
    attackCooldown = 2000; // ms between attacks
    attackRange = 200; // distance in px to start attack
    // vertical tolerance in px: character must be within this many pixels vertically
    // of the boss center to allow the attack to start
    attackVerticalTolerance = 120;
    swallowRange = 0; // when character is directly in front (used with condition character.x + character.width > this.x)
    triggerCharacterEatenAfterAttack = false;


    IMAGES_INTRO = [
        'img/2.Enemy/3.FinalEnemy/1.Introduce/1.png',
        'img/2.Enemy/3.FinalEnemy/1.Introduce/2.png',
        'img/2.Enemy/3.FinalEnemy/1.Introduce/3.png',
        'img/2.Enemy/3.FinalEnemy/1.Introduce/4.png',
        'img/2.Enemy/3.FinalEnemy/1.Introduce/5.png',
        'img/2.Enemy/3.FinalEnemy/1.Introduce/6.png',
        'img/2.Enemy/3.FinalEnemy/1.Introduce/7.png',
        'img/2.Enemy/3.FinalEnemy/1.Introduce/8.png',
        'img/2.Enemy/3.FinalEnemy/1.Introduce/9.png',
        'img/2.Enemy/3.FinalEnemy/1.Introduce/10.png'
    ];

    IMAGES_FLOATING = [
        'img/2.Enemy/3.FinalEnemy/2.floating/1.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/2.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/3.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/4.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/5.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/6.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/7.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/8.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/9.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/10.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/11.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/12.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/13.png'
    ];

    IMAGES_HURT = [
        'img/2.Enemy/3.FinalEnemy/Hurt/1.png',
        'img/2.Enemy/3.FinalEnemy/Hurt/2.png',
        'img/2.Enemy/3.FinalEnemy/Hurt/3.png',
        'img/2.Enemy/3.FinalEnemy/Hurt/4.png'
    ];

    IMAGES_DEAD = [
        'img/2.Enemy/3.FinalEnemy/Dead/Mesa de trabajo 2 copia 6.png',
        'img/2.Enemy/3.FinalEnemy/Dead/Mesa de trabajo 2 copia 7.png',
        'img/2.Enemy/3.FinalEnemy/Dead/Mesa de trabajo 2 copia 8.png',
        'img/2.Enemy/3.FinalEnemy/Dead/Mesa de trabajo 2 copia 9.png',
        'img/2.Enemy/3.FinalEnemy/Dead/Mesa de trabajo 2 copia 10.png'
    ];

    IMAGES_ATTACK = [
        'img/2.Enemy/3.FinalEnemy/Attack/1.png',
        'img/2.Enemy/3.FinalEnemy/Attack/2.png',
        'img/2.Enemy/3.FinalEnemy/Attack/3.png',
        'img/2.Enemy/3.FinalEnemy/Attack/4.png',
        'img/2.Enemy/3.FinalEnemy/Attack/5.png',
        'img/2.Enemy/3.FinalEnemy/Attack/6.png'
    ];

    life = 100; // Life percentage (0 to 100)
 
    constructor() {
        super();
        this.loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_INTRO);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTACK);
        this.life = 100; // final enemy life percentage
        this.hurtPlaying = false;
        this.dead = false;
        // By default the final enemy is hidden until the player reaches the discovery X.
        this.visible = false;
        this.animate();
        this.startAttackLoop();
    }

    animate() {
        let i = 0;
        // clear any previous animation interval just in case
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }

        this.animationInterval = setInterval(() => {
            try {
                // if dead, stop main animation loop to free resources
                if (this.dead) {
                    this.stopAnimation();
                    return;
                }

                // If the boss hasn't been discovered yet, check discovery condition
                // but do NOT render or progress intro frames until discovered.
                if (!this.hadFirstContact) {
                    if (typeof world !== 'undefined' && world && world.character && typeof world.character.x !== 'undefined' && world.character.x > 1600) {
                        // discovery: make visible and start intro sequence
                        this.hadFirstContact = true;
                        this.visible = true;
                        i = 0;
                        // show final enemy life bar if available
                        if (typeof world !== 'undefined' && world.statusbarFinal) {
                            world.statusbarFinal.show();
                        }
                        // start slow leftward movement after first contact
                        this.startSlowLeftMovement();
                    }
                    // not yet discovered: skip animation rendering
                    return;
                }

                // normal animation after discovery
                if (i < this.introFramesCount) {
                    this.playAnimation(this.IMAGES_INTRO);
                } else {
                    this.playAnimation(this.IMAGES_FLOATING);
                }
                i++;
            } catch (e) { /* defensive: ignore animation errors */ }
        }, 1000 / this.animationFPS);
    }

    stopAnimation() {
        try {
            if (this.animationInterval) {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
            }
        } catch (e) { /* ignore */ }
    }

    startSlowLeftMovement() {
        // guard: don't start multiple intervals
        if (this.moveInterval || this.dead) return;

        // target x where the boss should stop moving left (you can adjust)
        const targetX = 1200;
        const speedPerFrame = 0.5; // pixels per frame (slow)
        const fps = 60;

        this.moveInterval = setInterval(() => {
            if (this.dead) {
                clearInterval(this.moveInterval);
                this.moveInterval = null;
                return;
            }

            // move left slowly until targetX reached
            if (this.x > targetX) {
                this.x -= speedPerFrame;
            } else {
                // reached desired position; stop movement but keep floating behavior
                clearInterval(this.moveInterval);
                this.moveInterval = null;
            }
        }, 1000 / fps);
    }

    takeDamage(amount) {
        if (this.dead) return;
        this.life = Math.max(0, this.life - amount);
        // play hurt animation once
        this.playHurtOnce();
        if (this.life <= 0) {
            this.life = 0;
            this.dead = true;
            // play death animation once and then remove or stop
            this.playDeathOnce();
        }
    }

    playHurtOnce() {
        if (this.hurtPlaying || this.dead) return;
        this.hurtPlaying = true;
        let k = 0;
        const fps = 8;
        const interval = setInterval(() => {
            const path = this.IMAGES_HURT[k % this.IMAGES_HURT.length];
            if (this.imageCache && this.imageCache[path]) this.img = this.imageCache[path];
            k++;
            if (k >= this.IMAGES_HURT.length) {
                clearInterval(interval);
                this.hurtPlaying = false;
            }
        }, 1000 / fps);
    }

    playDeathOnce() {
        let k = 0;
        const fps = 5; 
        const interval = setInterval(() => {
            const path = this.IMAGES_DEAD[k];
            if (this.imageCache && this.imageCache[path]) {
                this.img = this.imageCache[path];
            } else {
                const img = new Image();
                img.src = path;
                this.img = img;
            }
            k++;
            if (k >= this.IMAGES_DEAD.length) {
                clearInterval(interval);
                // explicitly show the last dead frame
                const lastPath = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];
                if (this.imageCache && this.imageCache[lastPath]) {
                    this.img = this.imageCache[lastPath];
                } else {
                    const img = new Image();
                    img.src = lastPath;
                    this.img = img;
                }

                // After death animation, make the final enemy fall down to y ~ 450
                const targetY = 400;
                const fallSpeed = 6; // pixels per frame
                const fallInterval = setInterval(() => {
                    if (this.y < targetY) {
                        this.y += fallSpeed;
                    } else {
                        this.y = targetY;
                        clearInterval(fallInterval);
                    }
                }, 1000 / 60); // 60 FPS fall
            }
        }, 1000 / fps);
    }

    startAttackLoop() {
        // check periodically if we should attack
        setInterval(() => {
            try {
                if (this.dead || world.character.animationFrozen) return;
                if (typeof world === 'undefined' || !world || !world.character) return;
                const c = world.character;
                // don't attack until the boss has been discovered
                if (!this.hadFirstContact) return;
                const now = Date.now();
                if (now - this.lastAttackTime < this.attackCooldown) return;
                // compute horizontal distance from boss to character center
                const charCenterX = (c.x + (c.width || 0) / 2) || 0;
                const bossX = this.x;
                const distance = Math.abs(bossX - charCenterX);
                if (distance <= this.attackRange) {
                    // check vertical alignment: character should be roughly at the same height
                    const charCenterY = (c.y + (c.height || 0) / 2) || 0;
                    const bossCenterY = (this.y + (this.height || 0) / 2) || 0;
                    const deltaY = Math.abs(bossCenterY - charCenterY);
                    if (deltaY <= this.attackVerticalTolerance) {
                        this.performAttack(c);
                        this.lastAttackTime = now;
                    }
                }
            } catch (e) { /* defensive: ignore */ }
        }, 200);
    }

    performAttack(character) {
        if (this.attacking || this.dead) return;
        this.attacking = true;
        
        // Play attack sound
        try {
            this.attackSound.currentTime = 0;
            this.attackSound.volume = 0.6;
            this.attackSound.play().catch(err => console.log('Audio play failed:', err));
        } catch (e) { /* ignore audio errors */ }
        
        // play attack frames and move slightly toward the character while attacking
        const imgs = this.IMAGES_ATTACK || [];
        if (!imgs.length) { this.attacking = false; return; }
        let k = 0; const fps = 8;
        
        const interval = setInterval(() => {
            const path = imgs[k % imgs.length];
            if (this.imageCache && this.imageCache[path]) this.img = this.imageCache[path];
            else { const i = new Image(); i.src = path; this.img = i; }

            // move a bit toward the character during attack for a biting/swallowing feel
            try {
                if (character && typeof character.x !== 'undefined') {
                    // move horizontally toward the character
                    if (character.x + (character.width || 0) / 2 < this.x + (this.width || 0) / 2) {
                        this.x -= 6; // move left
                    } else {
                        this.x += 6; // move right
                    }
                    // swallow condition: character is directly in front (user requirement)
                    if ((character.x + (character.width || 0)) > this.x) {
                        // apply heavy damage
                        if (typeof character.isHit === 'function') {
                            character.isHit(100);
                        }
                        // update global statusbar if available
                        if (typeof world !== 'undefined' && world && world.statusbarEnergy) {
                            world.statusbarEnergy.setPercentage(character.energy);
                            if (world.character.isDead()) this.triggerCharacterEatenAfterAttack = true;
                        }
                    }
                }
            } catch (e) { /* ignore movement errors */ }

            k++;
            if (k >= imgs.length) {
                clearInterval(interval);
                this.attacking = false;
                // restore image to floating first frame if available
                if (this.imageCache && this.imageCache[this.IMAGES_FLOATING[0]]) this.img = this.imageCache[this.IMAGES_FLOATING[0]];
                else this.loadImage(this.IMAGES_FLOATING[0]);
            
            // If the character died during the attack, trigger the eaten sequence now
                if (this.triggerCharacterEatenAfterAttack) {
                    try {
                        // ensure we only call once
                        this.triggerCharacterEatenAfterAttack = false;
                        this.startCharacterEatenSequence();
                        // after eating, move slowly left until leaving canvas or gameover
                        this.startSlowLeftMovement();
                    } catch (e) { /* ignore */ }
                }
            }
        }, 1000 / fps);
    }

    startCharacterEatenSequence() {
        world.character.playAnimation(world.character.IMAGES_EATEN);
        const imgs = world.character.IMAGES_EATEN || [];
        if (imgs.length) world.setCharacterImgByPath(imgs[imgs.length - 1]);
        world.character.animationFrozen = true;
        // show the final frame for a short moment before showing Game Over
        try {
            setTimeout(() => {
                try { world.character.deadAnimationFinished = true; } catch (e) {}
                try { this.showGameOver(); } catch (e) {}
                try {this.hadFirstContact = false;
                    this.attacking = false;
                    this.lastAttackTime = 0;
                } catch (e) {}
            }, 800); // 800ms delay so player sees final death frame
        } catch (e) { }
    }

}

