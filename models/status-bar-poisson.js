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
    this.numberOfPoissons = numberOfPoissons;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
}

resolveImageIndex() {
    return Math.min(this.numberOfPoissons, this.IMAGES.length - 1);
}

    // Trigger a short visual flash on the status bar (duration in ms)
    flash(duration = 1000) {
        try { this._flashUntil = Date.now() + duration; } catch (e) { this._flashUntil = 0; }
    }

    // draw override: render the image and optionally a flashing overlay when triggered
    draw(ctx) {
        super.draw(ctx);
        try {
            if (this._flashUntil && Date.now() < this._flashUntil) {
                ctx.save();
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = 'red';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.restore();
            }
        } catch (e) { /* ignore drawing errors */ }
    }


}