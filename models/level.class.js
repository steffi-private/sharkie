class Level {
    pufferFishs;
    jellyFishs;
    finalEnemy;
    backgroundObjects;
    level_end_x = 2200; // The x position where the level ends

    constructor(pufferFishs, jellyFishs, finalEnemy, backgroundObjects) {
        this.pufferFishs = pufferFishs || [];
        this.jellyFishs = jellyFishs || [];
        this.finalEnemy = finalEnemy || null;
        this.backgroundObjects = backgroundObjects || [];
    
    }
}