class ThrowableObject extends MovableObject {
    
    acceleration = 2; // Gravity acceleration
    width = 65;
    height = 65; 

    constructor(x, y) {
        super().loadImage('../img/4. Marcadores/Posión/Dark - Right.png');
        this.x = x; // Start position X
        this.y = y; // Start position Y
        this.throw();
    }

    throw() {
        
        this.speedY = 30; // Initial vertical speed
        this.applyGravity();

        setInterval(() => {
            this.x += 10; // Move right at a constant speed
        }, 1000 / 25); // 25 FPS
    }
d


}