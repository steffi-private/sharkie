class FinalEnemy extends MovableObject {

    width = 300;
    height = 400;

    x = 2400; // Initial x position
    y = 100; // Initial y position

    speed = 10;// Default speed

    hadFirstContact = false;
    moveInterval = null; // store interval id for movement so we can clear it

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

    life = 100; // Life percentage (0 to 100)
 
    constructor() {
        super();
        this.loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_INTRO);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.life = 100; // final enemy life percentage
        this.hurtPlaying = false;
        this.dead = false;
        this.animate();
    }

    animate() {
        let i = 0;
        setInterval(() => {
            if (this.dead) return; // stop updating animation when dead
            if (i < 10) {
                this.playAnimation(this.IMAGES_INTRO);
            } else {
                this.playAnimation(this.IMAGES_FLOATING);
            }
            i++;
            if (typeof world !== 'undefined' && world && world.character && typeof world.character.x !== 'undefined' && world.character.x > 1600 && !this.hadFirstContact) {
                i = 0;
                this.hadFirstContact = true;
                // when the final enemy appears first time, make sure world shows the life bar
                if (typeof world !== 'undefined' && world.statusbarFinal) {
                    world.statusbarFinal.show();
                }
                // start slow leftward movement after first contact
                this.startSlowLeftMovement();
            }
        }, 1000 / 5); // 5 frames per second
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

}
