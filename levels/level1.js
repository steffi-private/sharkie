const level1 = new Level(
    [
        new PufferFish(),
        new PufferFish(),
        new PufferFish(),
    ],
    [
        new JellyFish(),
        new JellyFish(),
        new JellyFish(),
        new JellyFish(),
        new JellyFish(),
    ],
    [
        new FinalEnemy(),
    ],
    [
        new BackgroundObject("../img/3.Background/Layers/5. Water/D1.png", 0, 0),
        new BackgroundObject("../img/3.Background/Layers/5. Water/D2.png", 720, 0),
        new BackgroundObject("../img/3.Background/Layers/4.Fondo 2/D1.png", 0, 0),
        new BackgroundObject("../img/3.Background/Layers/4.Fondo 2/D2.png", 720, 0),
        new BackgroundObject("../img/3.Background/Layers/3.Fondo 1/D1.png", 0, 0),
        new BackgroundObject("../img/3.Background/Layers/3.Fondo 1/D2.png", 720, 0),
        new BackgroundObject("../img/3.Background/Layers/1. Light/1.png", 0, 0),
        new BackgroundObject("../img/3.Background/Layers/1. Light/2.png", 720, 0),
        new BackgroundObject("../img/3.Background/Layers/2. Floor/D1.png", 0, 0),
        new BackgroundObject("../img/3.Background/Layers/2. Floor/D2.png", 720, 0),

        new BackgroundObject("../img/3.Background/Layers/5. Water/D1.png", 720*2, 0),
        new BackgroundObject("../img/3.Background/Layers/5. Water/D2.png", 720*3, 0),
        new BackgroundObject("../img/3.Background/Layers/4.Fondo 2/D1.png", 720*2, 0),
        new BackgroundObject("../img/3.Background/Layers/4.Fondo 2/D2.png", 720*3, 0),
        new BackgroundObject("../img/3.Background/Layers/3.Fondo 1/D1.png", 720*2, 0),
        new BackgroundObject("../img/3.Background/Layers/3.Fondo 1/D2.png", 720*3, 0),
        new BackgroundObject("../img/3.Background/Layers/1. Light/1.png", 720*2, 0),
        new BackgroundObject("../img/3.Background/Layers/1. Light/2.png", 720*3, 0),
        new BackgroundObject("../img/3.Background/Layers/2. Floor/D1.png", 720*2, 0),
        new BackgroundObject("../img/3.Background/Layers/2. Floor/D2.png", 720*3, 0),
    ],
    [
        new Coin(300, 250),
        new Coin(350, 200),
        new Coin(400, 250),
        new Coin(350, 300),
    ],
    [
        new ThrowableObject(550, 320, { collectible: true, thrown: false }),
        new ThrowableObject(900, 280, { collectible: true, thrown: false }),
        new ThrowableObject(1300, 300, { collectible: true, thrown: false }),
        new ThrowableObject(1400, 320, { collectible: true, thrown: false }),  
        new ThrowableObject(1600, 290, { collectible: true, thrown: false }),
        new ThrowableObject(1800, 310, { collectible: true, thrown: false }),
        new ThrowableObject(2000, 300, { collectible: true, thrown: false }),
        new ThrowableObject(1300, 300, { collectible: true, thrown: false })
    ]
);
