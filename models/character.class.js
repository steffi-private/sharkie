class Character extends MovableObject {
    x = 100;
    y = 250;
    width = 150;
    height = 200;
    speed =  10;// Default speed
    // when true, the regular animation loop will be paused (used for permanent death frame)
    animationFrozen = false;
    slapSound = new Audio('audio/rechambering-slap-102112.mp3');

    
    IMAGES_IDLE = [
        '../img/1.Sharkie/1.IDLE/1.png',
        '../img/1.Sharkie/1.IDLE/2.png',
        '../img/1.Sharkie/1.IDLE/3.png',
        '../img/1.Sharkie/1.IDLE/4.png',
        '../img/1.Sharkie/1.IDLE/5.png',
        '../img/1.Sharkie/1.IDLE/6.png',
        '../img/1.Sharkie/1.IDLE/7.png',
        '../img/1.Sharkie/1.IDLE/8.png',
        '../img/1.Sharkie/1.IDLE/9.png',
        '../img/1.Sharkie/1.IDLE/10.png',
        '../img/1.Sharkie/1.IDLE/11.png',  
        '../img/1.Sharkie/1.IDLE/12.png',
        '../img/1.Sharkie/1.IDLE/13.png',
        '../img/1.Sharkie/1.IDLE/14.png',
        '../img/1.Sharkie/1.IDLE/15.png',
        '../img/1.Sharkie/1.IDLE/16.png',
        '../img/1.Sharkie/1.IDLE/17.png',
        '../img/1.Sharkie/1.IDLE/18.png',
    ];
    IMAGES_SWIM = [
        '../img/1.Sharkie/3.Swim/1.png',
        '../img/1.Sharkie/3.Swim/2.png',
        '../img/1.Sharkie/3.Swim/3.png',
        '../img/1.Sharkie/3.Swim/4.png',
        '../img/1.Sharkie/3.SWIM/5.png',
        '../img/1.Sharkie/3.SWIM/6.png',
    ];
    IMAGES_HURT_POISONED = [
        'img/1.Sharkie/5.Hurt/1.Poisoned/1.png',
        'img/1.Sharkie/5.Hurt/1.Poisoned/2.png',
        'img/1.Sharkie/5.Hurt/1.Poisoned/3.png',
        'img/1.Sharkie/5.Hurt/1.Poisoned/4.png'
    ]
    IMAGES_HURT_ELECTRO = [
        'img/1.Sharkie/5.Hurt/2.Electric shock/1.png',
        'img/1.Sharkie/5.Hurt/2.Electric shock/2.png',
        'img/1.Sharkie/5.Hurt/2.Electric shock/3.png'
    ];
    IMAGES_DEAD_POISONED = [
        '../img/1.Sharkie/6.dead/1.Poisoned/1.png',
        '../img/1.Sharkie/6.dead/1.Poisoned/2.png',
        '../img/1.Sharkie/6.dead/1.Poisoned/3.png',
        '../img/1.Sharkie/6.dead/1.Poisoned/4.png',
        '../img/1.Sharkie/6.dead/1.Poisoned/5.png',
        '../img/1.Sharkie/6.dead/1.Poisoned/6.png',
        '../img/1.Sharkie/6.dead/1.Poisoned/7.png',
        '../img/1.Sharkie/6.dead/1.Poisoned/8.png',
        '../img/1.Sharkie/6.dead/1.Poisoned/9.png',
        '../img/1.Sharkie/6.dead/1.Poisoned/10.png',
        '../img/1.Sharkie/6.dead/1.Poisoned/11.png',
        '../img/1.Sharkie/6.dead/1.Poisoned/12.png'
    ];
    IMAGES_DEAD_ELECTRO = [
        '../img/1.Sharkie/6.dead/2.Electro_shock/1.png',
        '../img/1.Sharkie/6.dead/2.Electro_shock/2.png',
        '../img/1.Sharkie/6.dead/2.Electro_shock/3.png',
        '../img/1.Sharkie/6.dead/2.Electro_shock/4.png',
        '../img/1.Sharkie/6.dead/2.Electro_shock/5.png',
        '../img/1.Sharkie/6.dead/2.Electro_shock/6.png',
        '../img/1.Sharkie/6.dead/2.Electro_shock/7.png',
        '../img/1.Sharkie/6.dead/2.Electro_shock/8.png',
        '../img/1.Sharkie/6.dead/2.Electro_shock/9.png',
        '../img/1.Sharkie/6.dead/2.Electro_shock/10.png'
    ];
    IMAGES_SLAP = [
        '../img/1.Sharkie/4.Attack/Fin slap/1.png',
        '../img/1.Sharkie/4.Attack/Fin slap/2.png',
        '../img/1.Sharkie/4.Attack/Fin slap/3.png',
        '../img/1.Sharkie/4.Attack/Fin slap/4.png',
        '../img/1.Sharkie/4.Attack/Fin slap/5.png',
        '../img/1.Sharkie/4.Attack/Fin slap/6.png',
        '../img/1.Sharkie/4.Attack/Fin slap/7.png',
        '../img/1.Sharkie/4.Attack/Fin slap/8.png'
    ];
    IMAGES_EATEN = [
        ''
    ];
    
    
    world;

    constructor() {
        super();
        this.loadImage('../img/1.Sharkie/1.IDLE/1.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SWIM);
        this.loadImages(this.IMAGES_HURT_POISONED);
        this.loadImages(this.IMAGES_HURT_ELECTRO);
        this.loadImages(this.IMAGES_DEAD_POISONED);
        this.loadImages(this.IMAGES_DEAD_ELECTRO);
        this.applyGravity();
        this.animate();
    }

    animate() {

        setInterval(() => {
            // stop responding to input when dead
            if (!this.isDead()) {
                if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) { 
                    this.moveRight();
                    this.otherDirection = false; // Facing right
                } else if (this.world.keyboard.LEFT && this.x > 100) {
                    this.moveLeft();
                    this.otherDirection = true; // Facing left
                }
                if (this.world.keyboard.UP && this.speedY < 1 && this.y > 50) { // Allow jumping only if speedY is less than 1 & y is above a certain threshold
                    this.jump();
                }
                // start slap attack when SPACE pressed
                if (this.world.keyboard.SPACE && !this.slapping) {
                    this.slapping = true;
                    this.playSlapOnce();
                }
            }

            // always update camera even if character is dead
            this.world.camera_x = -this.x + 100; // Adjust camera position based on character's x position
            }, 1000 / 20); // 20 frames per second
            
        setInterval(() => {
            // don't play regular animations when frozen (e.g. after death final frame set)
            if (this.animationFrozen) return;

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_SWIM);
            } else {
                this.playAnimation(this.IMAGES_IDLE);
            }            
        }, 1000 / 5); // 5 frames per second
    }

    playSlapOnce() {
        const imgs = this.IMAGES_SLAP || [];
        if (!imgs.length) { this.slapping = false; return; }
        
        let k = 0; const fps = 8;
        const prevFrozen = this.animationFrozen;
        this.animationFrozen = true; // prevent regular loops from overwriting
        const interval = setInterval(() => {
            const path = imgs[k];
            if (this.imageCache && this.imageCache[path]) this.img = this.imageCache[path];
            else { const i = new Image(); i.src = path; this.img = i; }
            k++;
            if (k >= imgs.length) { 
                clearInterval(interval); 
                this.slapping = false; 
                this.animationFrozen = prevFrozen;
                
                // Play slap sound at the end of the animation
                try {
                    this.slapSound.currentTime = 0;
                    this.slapSound.volume = 0.5;
                    this.slapSound.play().catch(err => console.log('Audio play failed:', err));
                } catch (e) { /* ignore audio errors */ }
            }
        }, 1000 / fps);
    }
    
    
}