class CollectableObject extends MovableObject {
    collected = false;
    collectIntervalMs = 200;
    autoCollectEnabled = false;

    // Start periodic collection checks against the global world state
    enableAutoCollect() {
        if (this.autoCollectEnabled) return;
        this.autoCollectEnabled = true;
        setInterval(() => {
            if (typeof world !== 'undefined' && world && world.character && !this.collected) {
                this.collectIfColliding(world.character, world);
            }
        }, this.collectIntervalMs);
    }

    // Stricter pickup check: coin/object center must be inside a reduced inner rectangle of the character
    isCollidingWithCharacter(character) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const marginX = character.width * 0.3; 
        const marginY = character.height * 0.4; // (must be < 0.5)
        const left = character.x + marginX;
        const right = character.x + character.width - marginX;
        const top = character.y + marginY;
        const bottom = character.y + character.height - marginY;
        return cx >= left && cx <= right && cy >= top && cy <= bottom;
    }

    collectIfColliding(character, worldRef) {
        if (this.isCollidingWithCharacter(character)) {
            return this.collect(worldRef);
        }
        return false;
    }

    collect(worldRef) {
        this.collected = true;
        this.onCollect(worldRef);
        return true;
    }

    // Hook for subclasses (e.g., Coin, ThrowableObject)
    onCollect(worldRef) {}

    // Hide if collected
    draw(ctx) {
        if (this.collected) return;
        super.draw(ctx);
    }
}
