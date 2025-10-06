class ThrowableObject extends CollectableObject {
    
    acceleration = 2; // Gravity acceleration
    width = 65;
    height = 65; 

    // options: { collectible?: boolean, thrown?: boolean, otherDirection?: boolean }
    constructor(x, y, options = {}) {
        super().loadImage('../img/4. Marcadores/Posión/Dark - Right.png');
        this.x = x || 0; // Start position X
        this.y = y || 0; // Start position Y

        const { collectible = false, thrown = true, otherDirection = false } = options;
        this.otherDirection = otherDirection;
        if (collectible) {
            this.enableAutoCollect();
        }
        if (thrown) {
            this.throw();
        }
    }

    throw() {
        this.speedY = 30; // Initial vertical speed
        this.applyGravity();
        const speedX = 10;
        const dir = this.otherDirection ? -1 : 1;
        setInterval(() => {
            this.x += dir * speedX;
        }, 1000 / 25); // 25 FPS
    }

    // When thrown, decrement poison status bar
    onThrow() {
        if (this.world && this.world.statusbarPoisson && typeof this.world.statusbarPoisson.setnumberOfPoissons === 'function') {
            const current = this.world.statusbarPoisson.numberOfPoissons || 0;
            if (current > 0) {
                this.world.statusbarPoisson.setnumberOfPoissons(current - 1);
            }
        }
    }

    // When collected, increment poison status bar
    onCollect(world) {
        if (world && world.statusbarPoisson && typeof world.statusbarPoisson.setnumberOfPoissons === 'function') {
            const current = world.statusbarPoisson.numberOfPoissons || 0;
            world.statusbarPoisson.setnumberOfPoissons(current + 1);
        }
    }
}
