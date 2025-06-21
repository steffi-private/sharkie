class JellyFish extends MovableObject {
    width = 100;
    height = 100;
    constructor() {
        super().loadImage('../img/2.Enemy/2.JellyFish/Regular-damage/Lila1.png');
        this.x = Math.random() * 800; // Random x position within canvas width
        this.y = Math.random() * 600; // Random y position within canvas height

        this.animate(this.y);
    }   

    animate(y){
        setInterval(() => {
            this.y += 0.3;
            if (this.y < 0) {
                this.y += 0.3; // Move up at a constant speed
            } else if (this.y > 400) {
                this.y -= 0.3; // Move down at a constant speed
            }
        }, 1000 / 60); // 60 FPS
        
        
    }

}