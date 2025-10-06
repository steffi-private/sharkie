class PufferFish extends MovableObject {
    width = 100;
    height = 100;
    otherDirection = false;
    speed = 0.15 + Math.random() * 0.45; // Random speed between 0.15 and 0.4
    IMAGES_SWIM = [
        '../img/2.Enemy/1.PufferFish_3ColorOptions/1.Swim/1.swim1.png',
        '../img/2.Enemy/1.PufferFish_3ColorOptions/1.Swim/1.swim2.png',
        '../img/2.Enemy/1.PufferFish_3ColorOptions/1.Swim/1.swim3.png',
        '../img/2.Enemy/1.PufferFish_3ColorOptions/1.Swim/1.swim4.png',
        '../img/2.Enemy/1.PufferFish_3ColorOptions/1.Swim/1.swim5.png',
    ];

    
     constructor() {
        super().loadImage('../img/2.Enemy/1.PufferFish_3ColorOptions/1.Swim/1.swim1.png');
    this.x = Math.random() * 800; // Random x position within canvas width
    // Keep puffer fish within visible canvas height (avoid spawning below canvas)
    const minY = 50;
    const maxY = 420; // allow puffer fish to spawn lower (up to y=420)
    this.y = minY + Math.random() * (maxY - minY);
        this.loadImages(this.IMAGES_SWIM);
        this.animate();
    }


    animate(){
        let speed = this.speed;
        let direction = -1; // 1 for left, -1 for right

        setInterval(() => {
            this.x += speed * direction;
            // Change direction if the fish reaches the canvas edges
            if (this.x <=20) {
                direction = 1; // change direction when left side is reached
                this.otherDirection = true; // Facing right
            } else if (this.x >=2500) {
                direction = -1; // change direction when right side is reached
                this.otherDirection = false; // Facing left
            }
        }, 1000 / 60); // 60 FPS
        
        setInterval(() => {
            this.playAnimation(this.IMAGES_SWIM);
        }, 1000 / 5); // 5 frames per second
    }

}