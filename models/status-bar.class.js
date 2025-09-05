class Statusbar extends DrawableObject {
    IMAGES = [
        '../img/4. Marcadores/orange/0_  copia 2.png',
        '../img/4. Marcadores/orange/20_ copia 2.png',
        '../img/4. Marcadores/orange/40_ copia 2.png',
        '../img/4. Marcadores/orange/60_ copia 2.png',
        '../img/4. Marcadores/orange/80_ copia 2.png',
        '../img/4. Marcadores/orange/100_ copia 2.png'
    ];        

    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 20;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }
    
    setPercentage(percentage) {
        this.percentage = percentage; // e.g. 0, 20, 40, 60, 80, 100
        


    }

}