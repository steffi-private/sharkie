class StatusbarCoin extends DrawableObject {
    IMAGES = [
        '../img/4. Marcadores/Purple/0_ _1.png',
        '../img/4. Marcadores/Purple/20_ .png',
        '../img/4. Marcadores/Purple/40_ _1.png',
        '../img/4. Marcadores/Purple/60_ _1.png',
        '../img/4. Marcadores/Purple/80_ _1.png',
        '../img/4. Marcadores/Purple/100__1.png'
    ];        

    numberOfCoins = 0;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 55;
        this.width = 200;
        this.height = 60;
        this.setNumberOfCoins(0);
    }
    
    setNumberOfCoins(numberOfCoins) {
        this.numberOfCoins = numberOfCoins; // e.g. 0, 10, 20, 30, 40, 50
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        return  Math.floor(this.numberOfCoins / 10); // 0 to 5
    }

}