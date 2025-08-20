class Character extends MovableObject {
    x = 100;
    y = 250;
    width = 150;
    height = 200;
    speed =  10;// Default speed
    
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
    ]
    currentImage = 0;
    world;
    

    constructor() {
        super().loadImage('../img/1.Sharkie/1.IDLE/1.png');
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

            /* Momentan in world.class checkCollisions() gelöst: 
            
                    if (this.isDead()) {
                        this.playAnimation(this.IMAGES_DEAD_POISONED);
                    } else {
                        this.playAnimation(this.IMAGES_HURT_POISONED);
                    }
                    }         ebenso für puffer fish & ELEKTRO
                    
                    if (this.isHurt()) {
                        this.playAnimation(this.IMAGES_HURT_ELECTRO);
                    }
            */
            

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


            this.world.camera_x = -this.x + 100; // Adjust camera position based on character's x position
            }, 1000 / 20); // 20 frames per second
            
        setInterval(() => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_SWIM);
            } else {
                this.playAnimation(this.IMAGES_IDLE);
            }            
        }, 1000 / 5); // 5 frames per second
    }
    
    
    





    attack() {
        // Implement attack logic here
    }
}