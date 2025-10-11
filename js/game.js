let canvas; 
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    // expose the world object on window so other modules (world reset handlers)
    // can reliably access and reset the game state (setupTryAgainButton uses window.world)
    try { window.world = world; } catch (e) { /* ignore when not in browser-like env */ }
}

function showStartScreen() {
    const start = document.getElementById('start-screen');
    const startBox = document.querySelector('.start-screen-box');
    if (start) { start.classList.remove('hidden'); start.classList.add('visible'); start.style.display = 'flex'; }
    if (startBox) { startBox.classList.remove('hidden'); startBox.classList.add('visible'); startBox.style.display = 'flex'; }
}

function hideStartScreen() {
    const start = document.getElementById('start-screen');
    const startBox = document.querySelector('.start-screen-box');
    if (start) {
        start.classList.remove('visible'); start.classList.add('hidden');
        start.style.display = 'none';
        start.classList.remove('background-blue'); start.classList.add('background-unset');
    }
    if (startBox) { startBox.classList.remove('visible'); startBox.classList.add('hidden'); startBox.style.display = 'none'; }
}

window.addEventListener('load', () => {
    // show start screen; attach start button
    showStartScreen();
    const btn = document.getElementById('start-button');
    if (btn) {
        btn.addEventListener('click', () => {
            hideStartScreen();
            init();
        });
    }
});

// fallback helper in case you want to trigger the overlay from outside
function showGameOverOverlay() {
    try {
        const overlay = document.getElementById('game-over-overlay');
        const box = document.querySelector('.game-over-box');
        const btn = document.getElementById('try-again-button');
        if (overlay) { overlay.classList.remove('hidden'); overlay.classList.add('visible'); overlay.style.display = 'flex'; }
        if (box) { box.classList.remove('hidden'); box.classList.add('visible'); box.style.display = 'flex'; }
        if (btn) { btn.classList.remove('hidden'); btn.classList.add('visible'); btn.style.display = 'inline-block'; }
    } catch (e) { /* ignore */ }
}

window.addEventListener("keydown", (event) => {  
        
    if (event.key == "ArrowLeft") { // left arrow
        keyboard.LEFT = true;
    } else if (event.key == "ArrowRight") { // right arrow
        keyboard.RIGHT = true; 
    } else if (event.key == "ArrowUp") { // up arrow
        keyboard.UP = true;
    } else if (event.key == "ArrowDown") { // down arrow
        keyboard.DOWN = true;
    } else if (event.key == " ") { // space bar
        keyboard.SPACE = true;
    } else if (event.key == "d" || event.key =="D") { // d key
        keyboard.D = true;
    }
});

window.addEventListener("keyup", (event) => {    
    if (event.key == "ArrowLeft") { // left arrow
        keyboard.LEFT = false;
    } else if (event.key == "ArrowRight") { // right arrow
        keyboard.RIGHT = false; 
    } else if (event.key == "ArrowUp") { // up arrow
        keyboard.UP = false;
    } else if (event.key == "ArrowDown") { // down arrow
        keyboard.DOWN = false;
    } else if (event.key == " ") { // space bar
        keyboard.SPACE = false;
    } else if (event.key == "d" || event.key =="D") { // d key
        keyboard.D = false;
    }
});