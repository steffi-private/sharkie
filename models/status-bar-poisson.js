class StatusbarPoisson extends DrawableObject {
    IMAGES = [
        '../img/4. Marcadores/Purple/0_.png',
        '../img/4. Marcadores/Purple/20_.png',
        '../img/4. Marcadores/Purple/40_.png',
        '../img/4. Marcadores/Purple/60_.png',
        '../img/4. Marcadores/Purple/80_.png',
        '../img/4. Marcadores/Purple/100_.png'
    ];        

    numberOfPoissons = 0;
    _flashUntil = 0; // timestamp until which the bar should flash
    MAX_POISSONS = 5;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 105;
        this.width = 200;
        this.height = 60;
        this.setnumberOfPoissons(0);
    }
    
    setnumberOfPoissons(numberOfPoissons) {
        // clamp to allowed range
        const clamped = Math.max(0, Math.min(this.MAX_POISSONS, numberOfPoissons || 0));
        this.numberOfPoissons = clamped;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
}

resolveImageIndex() {
    // map 0..MAX_POISSONS -> image indices (IMAGES length may be 6 for 0..100 tiers)
    // choose index proportional to numberOfPoissons
    const max = this.MAX_POISSONS;
    const idx = Math.round((this.numberOfPoissons / max) * (this.IMAGES.length - 1));
    return Math.min(idx, this.IMAGES.length - 1);
}

    // Trigger a short visual flash on the status bar (duration in ms)
    flash(duration = 1000) {
        try { this._flashUntil = Date.now() + duration; } catch (e) { this._flashUntil = 0; }
    }

    // Try to add one poison; returns true if added, false if at cap
    tryAddOne() {
        if (this.numberOfPoissons >= this.MAX_POISSONS) {
            this.flash(800);
            return false;
        }
        this.setnumberOfPoissons(this.numberOfPoissons + 1);
        return true;
    }

    // draw override: render the image and optionally a flashing overlay when triggered
      draw(ctx) {
        super.draw(ctx);
        try {
            if (this._flashUntil && Date.now() < this._flashUntil) {
                ctx.save();
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = 'red';

                const x = this.x + 7;
                const y = this.y + this.height / 2 - 5;
                const w = this.width - 5;
                const h = this.height / 2;
                const radius = Math.min(12, Math.min(w, h) * 0.12);

                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + w - radius, y);
                ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
                ctx.lineTo(x + w, y + h - radius);
                ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
                ctx.lineTo(x + radius, y + h);
                ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
                ctx.fill();

                ctx.restore();
            }
        } catch (e) { /* ignore drawing errors */ }
    }

}