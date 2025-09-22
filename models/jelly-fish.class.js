class JellyFish extends MovableObject {
    width = 100;
    height = 100;
    speed = 0.15 + Math.random() * 0.45; // Random speed between 0.15 and 0.6
    IMAGES_REGULAR_DAMAGE = [
        '../img/2.Enemy/2.JellyFish/Regular-damage/Lila1.png',
        '../img/2.Enemy/2.JellyFish/Regular-damage/Lila 2.png',
        '../img/2.Enemy/2.JellyFish/Regular-damage/Lila 3.png',
        '../img/2.Enemy/2.JellyFish/Regular-damage/Lila 4.png',   
    ];
    


    constructor() {
        super().loadImage('../img/2.Enemy/2.JellyFish/Regular-damage/Lila1.png');
        this.x = Math.random() * 800; // Random x position within canvas width
        this.y = Math.random() * 600; // Random y position within canvas height
        this.loadImages(this.IMAGES_REGULAR_DAMAGE);
        this.animate();
    }
 
    animate(){
        let speed = this.speed;
        let direction = 1; // 1 for down, -1 for up

        setInterval(() => {
            this.y += speed * direction;
            if (this.y >= 390) {
                direction = -1; // change direction when bottom limit is reached
            } else if (this.y <= 10) {
                direction = 1; // change direction when top limit is reached
            }
        }, 1000 / 60); // 60 FPS
        
        setInterval(() => {
           this.playAnimation(this.IMAGES_REGULAR_DAMAGE);
        },1000 /5); // 5 FPS
    }
}