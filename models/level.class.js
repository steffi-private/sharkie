class Level {
    pufferFishs;
    jellyFishs;
    finalEnemy; 
    backgroundObjects;
    coins;
    
    level_end_x = 2200; // The x position where the level ends

    constructor(pufferFishs, jellyFishs, finalEnemy, backgroundObjects, coins) {
        this.pufferFishs = pufferFishs || [];
        this.jellyFishs = jellyFishs || [];
        this.finalEnemy = finalEnemy || [];
        this.backgroundObjects = backgroundObjects || [];
        this.coins = coins || [];
    }
}