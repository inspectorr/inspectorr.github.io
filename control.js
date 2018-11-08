
document.addEventListener('mousedown', function (event) {
    event.preventDefault();
});

document.addEventListener('dblclick', function (event) {
    event.preventDefault();
});

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

// передвижение
let canvasCoords = canvas.getBoundingClientRect();

let lastposX;
let lastposY;
let dX;
let dY;

function move(event) {
    event.preventDefault();
    event.stopPropagation();
    let eventX, eventY;
    if (event.clientX && event.clientY) {
        eventX = event.clientX;
        eventY = event.clientY;
        player.x = eventX;
        player.y = eventY;
    } else if (event.targetTouches) {
        dX = lastposX - event.targetTouches[0].clientX;
        player.x -= dX;
        lastposX = event.targetTouches[0].clientX;
        
        dY = event.targetTouches[0].clientY - lastposY;
        player.y += dY;
        lastposY = event.targetTouches[0].clientY;
    };

    player.y -= canvasCoords.top;
    player.x -= canvasCoords.left;
    
    if (player.x > canvas.width) player.x = canvas.width;
    if (player.x < 0) player.x = 0;
    if (player.y > canvas.height) player.y = canvas.height;
    if (player.y < 0) player.y = 0;
}

let finger;
document.addEventListener('touchstart', function (event) {
    if (event.targetTouches.length == 2) {
        finger = 1;
        fire();
    };
    if (event.targetTouches.length == 1) {
        finger = 0;
        lastposX = event.targetTouches[0].clientX;
        dX = 0;
        lastposY = event.targetTouches[0].clientY;
        dY = 0;
        move(event);
    };
    
}, false);

document.addEventListener('touchmove', function (event) {
    move(event);
}, {
    passive: false
});

document.addEventListener('touchend', function (event) {
    if (dX == 0 && dY == 0 && finger == 0) {
        fire();
    };
    event.preventDefault();
    event.target.click();
}, false);

document.addEventListener('pointermove', function (event) {
    event.preventDefault();
});

document.addEventListener('pointerup', function (event) {
    event.preventDefault();
});

document.addEventListener('click', function (event) {
    event.preventDefault();
    if (event.clientX && event.clientY) fire();
}, false);

document.addEventListener('mousemove', function (event) {
    move(event);
}, {
    passive: false
});


function fire(event) {
    let shot = new Shot(player.x, player.y - 10);
    currentShots.push(shot);
}