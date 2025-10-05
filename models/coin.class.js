class Coin extends CollectableObject {
    width = 30;
    height = 30;
    y;
    x;

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage('../img/4. Marcadores/1. Coins/1.png');
        this.enableAutoCollect();
    }

    onCollect(world) {
        if (world && world.statusbarCoin && typeof world.statusbarCoin.setNumberOfCoins === 'function') {
            const current = world.statusbarCoin.numberOfCoins || 0;
            world.statusbarCoin.setNumberOfCoins(current + 10);
        }
    }
}
