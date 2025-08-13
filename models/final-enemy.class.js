class FinalEnemy extends MovableObject {
    
    width = 300;
    height = 400;

    x = 2400; // Initial x position
    y = 100; // Initial y position

    speed =  10;// Default speed
    currentImage = 0;
    
    IMAGES_FLOATING = [
        'img/2.Enemy/3.FinalEnemy/2.floating/1.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/2.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/3.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/4.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/5.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/6.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/7.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/8.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/9.png',   
        'img/2.Enemy/3.FinalEnemy/2.floating/10.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/11.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/12.png',
        'img/2.Enemy/3.FinalEnemy/2.floating/13.png'    
    ];

    constructor() {
        super().loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        
        

        console.log('FinalEnemy created at position:', this.x, this.y);

        this.animate();
    }

    animate() {
        
        setInterval(() => {
            this.playAnimation(this.IMAGES_FLOATING);
        }, 1000 / 5); // 5 frames per second
    }
    
}