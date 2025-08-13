class PufferFish extends MovableObject {
    width = 100;
    height = 100;
    speed = 0.15 + Math.random() * 0.45; // Random speed between 0.15 and 0.4
    IMAGES_SWIM = [
        '../img/2.Enemy/1.PufferFish_3ColorOptions/1.Swim/1.swim1.png',
        '../img/2.Enemy/1.PufferFish_3ColorOptions/1.Swim/1.swim2.png',
        '../img/2.Enemy/1.PufferFish_3ColorOptions/1.Swim/1.swim3.png',
        '../img/2.Enemy/1.PufferFish_3ColorOptions/1.Swim/1.swim4.png',
        '../img/2.Enemy/1.PufferFish_3ColorOptions/1.Swim/1.swim5.png',
    ];
    currentImage = 0;


     constructor() {
        super().loadImage('../img/2.Enemy/1.PufferFish_3ColorOptions/1.Swim/1.swim1.png');
        this.x = Math.random() * 800; // Random x position within canvas width
        this.y = Math.random() * 600; // Random y position within canvas height
        this.loadImages(this.IMAGES_SWIM);

        this.animate();
        
    }
    

    animate(){
        this.moveLeft(this.x, this.speed);

        setInterval(() => {
            this.playAnimation(this.IMAGES_SWIM);
        }, 1000 / 5); // 5 frames per second
    }

}