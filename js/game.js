let canvas; 
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

function showStartScreen() {
    const start = document.getElementById('start-screen');
    if (start) { start.classList.remove('hidden'); start.classList.add('visible'); }
}

function hideStartScreen() {
    const start = document.getElementById('start-screen');
    if (start) { start.classList.remove('visible'); start.classList.add('hidden'); }
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