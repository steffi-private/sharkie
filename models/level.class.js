class Level {
    pufferFishs;
    jellyFishs;
    finalEnemy;
    backgroundObjects;

    constructor(pufferFishs, jellyFishs, finalEnemy, backgroundObjects) {
        this.pufferFishs = pufferFishs || [];
        this.jellyFishs = jellyFishs || [];
        this.finalEnemy = finalEnemy || null;
        this.backgroundObjects = backgroundObjects || [];
    
    }
}