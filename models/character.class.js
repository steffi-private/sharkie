class Character extends MovableObject {
   
    width = 150;
    height = 200;
    speed = 0.25; // Default speed
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
       
        this.animate();
    }

    animate() {
       setInterval(() => {
            let i = this.currentImage % this.IMAGES_IDLE.length;
            let path = this.IMAGES_IDLE[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        },1000 /5); // 5 frames per second
    }

    swim() {
        if(this.world.keyboard.RIGHT && this.x < this.world.canvas.width - this.width) {    
            this.moveRight(this.x, this.speed);
            this.loadImages(this.IMAGES_SWIM);
            this.img = this.imageCache[this.IMAGES_SWIM[0]]; // Set initial image for swimming
            this.currentImage = 0; // Reset currentImage to start from the first frame
            setInterval(() => {
                let i = this.currentImage % this.IMAGES_SWIM.length;
                let path = this.IMAGES_SWIM[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            },1000 /5); // 5 frames per second*/
        }
    }
     
    jump() {
        if (this.world.keyboard.UP && this.y > 0) { // Only allow jumping if at the bottom
            this.y -= 50; // Jump up by 50 pixels
            setTimeout(() => {
                this.y += 50; // Fall back down after 500 milliseconds
            }, 500);}
    }

    attack() {
        // Implement attack logic here
    }
}