class StatusbarEnergy extends DrawableObject {
    IMAGES = [
        '../img/4. Marcadores/Purple/0_ .png',
        '../img/4. Marcadores/Purple/20__1.png',
        '../img/4. Marcadores/Purple/40_ .png',
        '../img/4. Marcadores/Purple/60_ .png',
        '../img/4. Marcadores/Purple/80_ .png',
        '../img/4. Marcadores/Purple/100_ .png'
    ];        

    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 5;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }
    
    setPercentage(percentage) {
        this.percentage = percentage; // e.g. 0, 20, 40, 60, 80, 100
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        return  Math.floor(this.percentage / 20); // 0 to 5
    }

}