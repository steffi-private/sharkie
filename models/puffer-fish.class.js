class PufferFish extends MovableObject {
    width = 100;
    height = 100;
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

        this.animate(this.x);
    }
    

    animate(x){
        setInterval(() => {
            let i = this.currentImage % this.IMAGES_SWIM.length;
            let path = this.IMAGES_SWIM[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 1000 / 5); // 5 frames per second

        setInterval(() => {
            this.x -= 0.5; // Move left at a constant speed
            if (this.x < 0) {
                this.x = 800; // Reset position to the right side of the canvas
            }
        }, 1000 / 60); // 60 FPS
        
        
    }

}