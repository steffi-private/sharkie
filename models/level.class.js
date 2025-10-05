class Level {
    pufferFishs;
    jellyFishs;
    finalEnemy; 
    backgroundObjects;
    coins;
    bottles;
    
    level_end_x = 2200; // The x position where the level ends

    constructor(pufferFishs, jellyFishs, finalEnemy, backgroundObjects, coins, bottles) {
        this.pufferFishs = pufferFishs || [];
        this.jellyFishs = jellyFishs || [];
        this.finalEnemy = finalEnemy || [];
        this.backgroundObjects = backgroundObjects || [];
        this.coins = coins || [];
        this.bottles = bottles || [];
    }
}
