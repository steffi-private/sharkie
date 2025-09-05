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


}