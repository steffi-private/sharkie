class StatusbarFinal {
    constructor() {
        this.visible = false;
        this.percentage = 100;
        // visual layout for heart + text
        this.heartWidth = 36;
        this.heartHeight = 36;
        this.padding = 8;
        this.x = 0; // computed at draw time (right-aligned)
        this.y = 8;

        // heart image
        this.heartImage = new Image();
        this.heartImage.src = 'img/4. Marcadores/green/100_  copia 3.png';

        // font loading state
        this.fontLoaded = false;
        // try to load Luckiest Guy font from provided file
        try {
            if (window.FontFace) {
                const font = new FontFace('Luckiest Guy', 'url("img/5.Font/Luckiest_Guy/LuckiestGuy-Regular.ttf")');
                font.load().then((loaded) => {
                    document.fonts.add(loaded);
                    this.fontLoaded = true;
                }).catch((e) => {
                    // fallback will apply
                    console.warn('Could not load Luckiest Guy font:', e);
                });
            }
        } catch (e) {
            console.warn('Font loading not supported', e);
        }
    }

    setPercentage(p) {
        this.percentage = Math.max(0, Math.min(100, p));
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    draw(ctx) {
        if (!this.visible || !ctx) return;
        // Right-align the heart + text
        const canvasW = ctx.canvas ? ctx.canvas.width : 720;
        // compute approximate text width area (we'll right-align the whole block 10px from edge)
        const textFontSize = Math.round(this.heartHeight * 0.6);
        const textFont = `${textFontSize}px "Luckiest Guy", Arial`;
        ctx.save();

        // Anchor the heart to the right edge so it doesn't move when the number width changes
        // heartX is fixed relative to the right edge; text is drawn to the left of the heart.
        ctx.font = textFont;
        const text = `${this.percentage}%`;
        const textMetrics = ctx.measureText(text);
        const textW = Math.ceil(textMetrics.width);

        // fixed heart position: 10px from right edge
        const heartX = canvasW - this.heartWidth - 25;
        this.x = heartX; // keep for possible external reads

        // draw heart image
        const imgY = this.y;
        if (this.heartImage && this.heartImage.complete) {
            ctx.drawImage(this.heartImage, heartX, imgY, this.heartWidth, this.heartHeight);
        } 

        // draw percentage text to the left of the heart with a small padding
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const textX = heartX - this.padding + 5; // right-align text at padding distance to the left of the heart
        const textY = imgY + this.heartHeight / 1.5;
        ctx.fillText(text, textX, textY);

        ctx.restore();
    }
}

// Note: no module.exports so class is available in browser global scope
