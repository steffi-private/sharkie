class Character extends MovableObject {
   
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
    currentImage = 0;
    world;

    constructor() {
        super().loadImage('../img/1.Sharkie/1.IDLE/1.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SWIM);
       
        this.animate();
    }

    animate() {

        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) { 
                this.x += this.speed;
                this.otherDirection = false; // Facing right
            } else if (this.world.keyboard.LEFT && this.x > 100) {
                this.x -= this.speed;
                this.otherDirection = true; // Facing left
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
    
    jump() {
        if (this.world.keyboard.UP) {
            this.y -= 50; // Jump up by 50 pixels
            setTimeout(() => {
                this.y += 50; // Fall back down after 500 milliseconds
            }, 500);}
    }

    attack() {
        // Implement attack logic here
    }
}