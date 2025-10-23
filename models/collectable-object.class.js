class CollectableObject extends MovableObject {
    collected = false;
    collectIntervalMs = 200;
    autoCollectEnabled = false;
    _flashUntil = 0; // timestamp until which this collectable should glow

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
        // Ask the subclass whether the collection should be accepted.
        // onCollect may return false to indicate the object should NOT be removed (e.g., cap reached).
        try {
            const accepted = this.onCollect(worldRef);
            if (accepted === false) {
                return false;
            }
        } catch (e) {
            // swallow errors from onCollect and proceed with collection
        }

        this.collected = true;
        return true;
    }

    // Hook for subclasses (e.g., Coin, ThrowableObject)
    // By default, allow collection. Subclasses can return false to refuse collection.
    onCollect(worldRef) { return true; }

    // Hide if collected
    draw(ctx) {
        if (this.collected) return;

        // draw a short glow/halo if recently flashed
        try {
            if (this._flashUntil && Date.now() < this._flashUntil) {
                ctx.save();
                // soft colored glow behind the object
                ctx.shadowColor = 'rgba(255,230,150,0.95)';
                ctx.shadowBlur = 30;
                ctx.fillStyle = 'rgba(255,240,200,0.18)';
                const pad = Math.max(8, Math.min(20, Math.round(Math.min(this.width, this.height) * 0.12)));
                ctx.fillRect(this.x - pad, this.y - pad, this.width + pad * 2, this.height + pad * 2);
                ctx.restore();
            }
        } catch (e) { /* ignore drawing errors */ }

        super.draw(ctx);
    }

    // Trigger a short visual flash on this collectable (duration ms)
    flash(duration = 600) {
        try { this._flashUntil = Date.now() + duration; } catch (e) { this._flashUntil = 0; }
    }
}
