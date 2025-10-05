class Coin extends DrawableObject {
    width = 30;
    height = 30;
    y;
    x; 
    collected = false;
    
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage('../img/4. Marcadores/1. Coins/1.png'); 

        // Periodically try to collect this coin if the character overlaps it.
        // Uses the global `world` reference once it exists.
        setInterval(() => {
            if (typeof world !== 'undefined' && world && world.character && !this.collected) {
                this.collectIfColliding(world.character, world.statusbarCoin);
            }
        }, 200);
    }

    // Stricter pickup check: coin center must be inside a reduced inner rectangle of the character
    // This prevents early pickups when merely near the coin.
    isCollidingWithCharacter(character) {
        // Coin center
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        // Shrink character hitbox so the shark must be really "over" the coin
        const marginX = character.width * 0.25;  // 30% margin left/right
        const marginY = character.height * 0.4; // 45% margin top/bottom

        const left = character.x + marginX;
        const right = character.x + character.width - marginX;
        const top = character.y + marginY;
        const bottom = character.y + character.height - marginY;

        return cx >= left && cx <= right && cy >= top && cy <= bottom;
    }

    // Attempt to collect this coin: updates the StatusbarCoin and marks coin as collected
    collectIfColliding(character, statusbarCoin) {
        if (this.isCollidingWithCharacter(character)) {
            this.collected = true;
            if (statusbarCoin && typeof statusbarCoin.setNumberOfCoins === 'function') {
                const current = statusbarCoin.numberOfCoins || 0;
                // Increase by 10 to match the status bar image steps (0,10,20,30,40,50)
                statusbarCoin.setNumberOfCoins(current + 10);
            }
            return true;
        }
        return false;
    }

    // Do not render if already collected
    draw(ctx) {
        if (this.collected) return;
        super.draw(ctx);
    }
}
