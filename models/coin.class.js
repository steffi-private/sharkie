class Coin extends DrawableObject {
    width = 30;
    height = 30;
    y;
    x; 
    
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage('../img/4. Marcadores/1. Coins/1.png'); 
    }
}