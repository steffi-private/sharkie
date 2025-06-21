class PufferFish extends MovableObject {
    width = 100;
    height = 100;
     constructor() {
        super().loadImage('../img/2.Enemy/1.PufferFish_3ColorOptions/1.Swim/1.swim1.png');
        this.x = Math.random() * 800; // Random x position within canvas width
        this.y = Math.random() * 600; // Random y position within canvas height
    }
    
}