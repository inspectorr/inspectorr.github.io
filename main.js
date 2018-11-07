'use strict';

let mobile = !!~navigator.userAgent.indexOf('Mobile');
if (mobile) {
    document.getElementById('version')
    .style.color = 'rgba(150, 150, 150, 0.3)';
}

// позиционирование
let canvas = document.getElementById('game');
let canvasHeight = document.documentElement.clientHeight;
let canvasWidth = mobile ? document.documentElement.clientWidth : 500;

let ratio = canvasWidth / canvasHeight;
let diagonal = sqrt(pow(canvasWidth, 2) + pow(canvasHeight, 2));
console.log(diagonal);

let emD = Math.round(diagonal / 100);
console.log(emD);
canvas.setAttribute('height', canvasHeight + 'px');
canvas.setAttribute('width', canvasWidth + 'px');
document.body.minWidth = canvas.width;
canvas.style.marginTop = -canvas.height / 2 + 'px';
canvas.style.marginLeft = -canvas.width / 2 + 'px';

setInterval(() => console.log(`Aseroids: ${currentAsteroids.length}`), 1000);





// Игрок
//let player = {
//    lives: 3,
//    score: 0,
//    r: 5 * emD
//};

let player = new Player(canvas.width / 2, 2 * canvas.height / 3);

let animation;
let currentAsteroids = [];
let currentExplodes = [];
let currentShots = [];
let xScale,
    yScale;

// астероиды которые надо отсюда убрать...
let minSideSize = 3 * emD;
let maxSideSize = 4 * emD;
let maxSpeedY = 5;
let minSpeedY = 1;
let maxSpeedX = 0.01;
let minSpeedX = 0.003;
let angs = 20;
let asterFreq = randomInt(1000, 3000);

let asteroidGenerationTimer;

function lauchAsteroids() {
    if (asteroidGenerationTimer) clearTimeout(asteroidGenerationTimer);
    asteroidGenerationTimer = setTimeout(function launch() {
        let x = randomInt(15, canvas.width - 15);
        let y = -(maxSideSize + minSideSize);
        let size = [];
        for (let i = 0; i < angs - 1; i++) {
            size.push(randomInt(minSideSize, maxSideSize));
        };
        let speedX = randomSign() * randomInt(minSpeedX, maxSpeedX);
        let speedY = randomInt(minSpeedY, maxSpeedY);
        currentAsteroids.push(new Asteroid(x, y, size, speedX, speedY));
        let asterFreq = randomInt(1500, 2500);
        asteroidGenerationTimer = setTimeout(launch, asterFreq);
    }, asterFreq);
}

//function stopAsteroids() {
//    while
//    if (asteroidGenerationTimer) {
//        clearTimeout(asteroidGenerationTimer);
//    };
//}

let ctx = canvas.getContext('2d');

function NEWGAME() {
    animation = requestAnimationFrame(game);
    lauchAsteroids();
}

NEWGAME();

setInterval(() => {
    if (document.hidden) currentAsteroids.pop();
}, asterFreq); // ;))) хак (((;

//xScale = 3, yScale = 3;
//animation = requestAnimationFrame(gameover);
//
//setTimeout(NEWGAME, 2500);

function pause() {}


