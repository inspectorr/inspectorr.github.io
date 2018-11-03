'use strict';

let canvas = document.getElementById('game');
canvas.style.marginTop = -canvas.height / 2 + 'px';
canvas.style.marginLeft = -canvas.width / 2 + 'px';

let ctx = canvas.getContext('2d');

document.addEventListener('mousedown', function (event) {
    event.preventDefault();
});

canvas.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

let canvasCoords = canvas.getBoundingClientRect();

let canvasClientX = canvas.width / 2;
let canvasClientY = canvas.height / 2;

canvas.addEventListener('mousemove', function (event) {
    canvasClientX = event.clientX - canvasCoords.left;
    canvasClientY = event.clientY - canvasCoords.top;
});

class Shot {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hit = false;
        this.out = false;
    }

    static get speed() {
        return 20;
    }
}

class Asteroid {
    constructor(x, y, size, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.approxRadius = size.reduce((sum, current) => sum + current) / size.length;
        this.shooted = false;
        this.out = false;
    }
}

function sqrt(num) {
    return Math.sqrt.call(Math, num);
}

function pow(num, base) {
    return Math.pow.apply(Math, num, base);
}

function randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

function randomSign() {
    return [-1, 1][randomInt(0, 1)];
}

let currentShots = [];
canvas.addEventListener('click', function (event) {
    let x = event.clientX - canvasCoords.left;
    let y = event.clientY - canvasCoords.top;
    let shot = new Shot(x, y, 10, 40);
    currentShots.push(shot);
});

let currentAsteroids = [];
let minSideSize = 20;
let maxSideSize = 30;
let maxSpeedY = 5;
let minSpeedY = 1;
let maxSpeedX = 0.01;
let minSpeedX = 0.003;
let angs = 20;
let asterFreq = randomInt(1000, 3000);
let asteroidGenerationTimer;

function lauchAsteroids() {
    asteroidGenerationTimer = setTimeout(function launch() {
        let x = randomInt(0, canvas.width);
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

lauchAsteroids();

let asteroidScore = 0;
let currentExplodes = [];

function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save(); // звезды
    for (let i = 0; i < 300; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()})`;
        ctx.fillRect(Math.random() * canvas.width,
            Math.random() * canvas.height,
            2, 2);
    };
    ctx.restore();

    // выстрелы
    for (let i = 0; i < currentShots.length; i++) {
        let shot = currentShots[i];
        ctx.save();
        ctx.translate(shot.x, shot.y);
        shot.y -= Shot.speed;
        let laser = ctx.createLinearGradient(-5, 0, 5, 0);
        laser.addColorStop(0, '#F00');
        laser.addColorStop(0.2, '#FFF');
        laser.addColorStop(0.8, '#FFF');
        laser.addColorStop(1, '#F00');
        ctx.fillStyle = laser;
        ctx.fillRect(-shot.width / 2, -shot.height / 2, shot.width, shot.height);
        ctx.restore();
        // проверка на вылет
        if (shot.y + shot.height < 0) shot.out = true;
    };

    // астероиды
    for (let i = 0; i < currentAsteroids.length; i++) {
        let asteroid = currentAsteroids[i];
        ctx.save();
        asteroid.y += asteroid.speedY;
        asteroid.x += asteroid.speedX;
        ctx.translate(asteroid.x, asteroid.y);
        ctx.fillStyle = '#aa0';
        ctx.beginPath();
        ctx.moveTo(-asteroid.size[0], 0);
        for (let k = 1; k < asteroid.size.length; k++) {
            ctx.rotate(Math.PI / (angs / 2));
            ctx.lineTo(-asteroid.size[k], 0);
        };
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        let r = asteroid.approxRadius;
        // проверка на вылет
        if (asteroid.y - r > canvas.height) {
            asteroid.out = true;
        };
        // проверка на попадание    
        for (let j = 0; j < currentShots.length; j++) {
            if (currentShots[j].x >= asteroid.x - r &&
                currentShots[j].x <= asteroid.x + r &&
                currentShots[j].y >= asteroid.y - r &&
                currentShots[j].y <= asteroid.y + r) {
                currentShots[j].hit = true;
                asteroid.shooted = true;
                asteroidScore++;
            };
        };
    };

    currentAsteroids.forEach(function (ast, i, asts) {
        if (ast.shooted || ast.out) asts.splice(i--, 1);
    });

    currentShots.forEach(function (shot, i, shots) {
        if (shot.hit || shot.out) shots.splice(i--, 1);
    });

    ctx.save(); // звездолет
    let xOff = -1 + Math.random() * 2;
    let yOff = -2 + Math.random() * 4;
    ctx.translate(canvasClientX + xOff, canvasClientY + yOff)

    ctx.save(); // корпус
    let corpRadGrad = ctx.createRadialGradient(0, -10, 15, 0, -10, 50);
    corpRadGrad.addColorStop(0, 'rgba(220, 80, 0, 1)');
    corpRadGrad.addColorStop(0.7, 'rgba(180, 50, 0, 1)');
    corpRadGrad.addColorStop(1, 'rgba(180, 50, 0, 0.8)');
    ctx.fillStyle = corpRadGrad;
    ctx.beginPath();
    ctx.moveTo(-40, 0);
    ctx.bezierCurveTo(-30, 30, 30, 30, 40, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save(); // пришелец

    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(-5, -5);
    ctx.bezierCurveTo(-7, -15, -15, -25, 0, -27);
    ctx.bezierCurveTo(15, -25, 7, -15, 5, -5);
    ctx.lineTo(5, 0);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 200, 0, 1)';
    ctx.fill();

    ctx.save(); // левый глаз
    ctx.translate(-4, -19);
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.quadraticCurveTo(0, 4, 4, 0);
    ctx.quadraticCurveTo(0, -4, -4, 0);
    ctx.closePath();
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.restore();

    ctx.save(); // правый глаз
    ctx.translate(4, -19);
    ctx.rotate(3 * Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.quadraticCurveTo(0, -4, -4, 0);
    ctx.quadraticCurveTo(0, 4, 4, 0);
    ctx.closePath();
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.restore();

    ctx.restore();

    ctx.save(); // кабина
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#aaa';
    ctx.beginPath();
    ctx.moveTo(-40, 1);
    ctx.lineTo(40, 1);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, -Math.PI, true);
    ctx.closePath();

    let cabRadGrad = ctx.createRadialGradient(0, -20, 7, 0, 0, 40);
    let blink = Math.min(0.45 + Math.random(), 0.75);
    cabRadGrad.addColorStop(0, `rgba(255, 255, 255, ${blink})`);
    cabRadGrad.addColorStop(0.8, 'rgba(0, 200, 250, 0.6)');
    cabRadGrad.addColorStop(1, 'rgba(0, 150, 200, 0.7)');

    ctx.fillStyle = cabRadGrad;
    ctx.fill();
    ctx.restore();

    ctx.restore();

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
