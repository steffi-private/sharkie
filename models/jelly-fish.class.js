class JellyFish extends MovableObject {
    width = 100;
    height = 100;
    spped = 0.15 + Math.random() * 0.45; // Random speed between 0.15 and 0.6
    IMAGES_REGULAR_DAMAGE = [
        '../img/2.Enemy/2.JellyFish/Regular-damage/Lila1.png',
        '../img/2.Enemy/2.JellyFish/Regular-damage/Lila 2.png',
        '../img/2.Enemy/2.JellyFish/Regular-damage/Lila 3.png',
        '../img/2.Enemy/2.JellyFish/Regular-damage/Lila 4.png',
        
    ];
    currentImage = 0;


    constructor() {
        super().loadImage('../img/2.Enemy/2.JellyFish/Regular-damage/Lila1.png');
        this.x = Math.random() * 800; // Random x position within canvas width
        this.y = Math.random() * 600; // Random y position within canvas height
        this.loadImages(this.IMAGES_REGULAR_DAMAGE);
       
        this.animate();
        
    }
 

    animate(y){
        this.moveDown(this.x, this.speed);
        
        setInterval(() => {
            let i = this.currentImage % this.IMAGES_REGULAR_DAMAGE.length;
            let path = this.IMAGES_REGULAR_DAMAGE[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        },1000 /5); // 5 frames per second 
    }
}