'use strict';

let mobile = !!~navigator.userAgent.indexOf('Mobile');
if (mobile) {
    document.getElementById('version').style.color = 'rgba(150, 150, 150, 0.3)';
}

setInterval(() => console.log(`Aseroids: ${currentAsteroids.length}`), 1000);

function sqrt(num) {
    return Math.sqrt.call(Math, num);
}

function pow(num, base) {
    return Math.pow.apply(Math, [num, base]);
}

function randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

function randomSign() {
    return [-1, 1][randomInt(0, 1)];
}



// позиционирование
let canvas = document.getElementById('game');
let clientHeight = document.documentElement.clientHeight;
let clientWidth = document.documentElement.clientWidth;
let emY = Math.floor(clientHeight / 100);
let emX = Math.floor(clientWidth / 50);

canvas.setAttribute('height', clientHeight + 'px');
canvas.setAttribute('width', (mobile ? clientWidth : 500) + 'px');
document.body.minWidth = canvas.width;
canvas.style.marginTop = -canvas.height / 2 + 'px';
canvas.style.marginLeft = -canvas.width / 2 + 'px';

let player = {
    lives: 3,
    score: 0,
    r: 40
};
player.x = canvas.width / 2;
player.y = 2 * canvas.height / 3;
let animation;
let currentAsteroids = [];
let currentExplodes = [];
let currentShots = [];
let xScale,
    yScale;


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
let dX;

function move(event) {
    event.preventDefault();
    event.stopPropagation();
    let eventX, eventY;
    if (event.clientX && event.clientY) {
        eventX = event.clientX;
        eventY = event.clientY;
        player.x = eventX;
    } else if (event.targetTouches) {
        if (event.targetTouches.length >= 2) return;
        dX = lastposX - event.targetTouches[0].clientX;
        player.x += dX;
        lastposX = event.targetTouches[0].clientX;
        eventY = event.targetTouches[0].clientY + -clientHeight / 6;
    };

    player.y = eventY - canvasCoords.top;
    player.x -= canvasCoords.left;

    if (event.target != canvas) {
        if (eventX > clientWidth / 2) {
            player.x = canvas.width;
        } else player.x = 0;
        return;
    };
}

document.addEventListener('touchstart', function (event) {
    lastposX = event.targetTouches[0].clientX;
    dX = 0;
    move(event);
}, false);

document.addEventListener('mousemove', move, {
    passive: false
});

document.addEventListener('touchmove', function (event) {
    move(event);
}, {
    passive: false
});

class Shot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hit = false;
        this.out = false;
    }

    static get speed() {
        return 20;
    }

    static get height() {
        return 40;
    }

    static get width() {
        return 10;
    }
}

function fire(event) {
    let shot = new Shot(player.x, player.y);
    currentShots.push(shot);
}

document.addEventListener('touchstart', function (event) {
    event.preventDefault();
    if (event.touches) {
        if (event.touches.length == 2) {
            return;
        };
    };
}, false);

document.addEventListener('touchend', function (event) {
    lastposX = player.x;
    dX = 0;
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
    if (event.touches) {
        if (event.touches.length == 2) fire();
    };
    if (event.clientX && event.clientY) fire();
}, false);

//if (!mobile) document.addEventListener('click', fire, false);


//setTimeout(() => fire(), 3000);

class Asteroid {
    constructor(x, y, size, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.r = size.reduce((sum, current) => sum + current) / size.length;

        let count = randomInt(3, 5);
        this.tubers = {
            length: count
        };
        this.tubers.innerRs = new Array(count);
        this.tubers.axisAngs = new Array(count);
        for (let i = 0; i < count; i++) {
            this.tubers.innerRs[i] = (randomInt(7, 22));
            this.tubers.axisAngs[i] = (Math.PI / 180 * randomInt(-3, 3));
        };

        let blikX;
        if (this.x > canvas.width / 2 + this.r) {
            blikX = -this.r + 25;
        } else if (this.x < canvas.width / 2 - this.r) {
            blikX = this.r - 25;
        } else blikX = 0;
        this.blikX = blikX;

        this.shooted = false;
        this.injured = false;
        this.out = false;
    }
}

let minSideSize = 5 * emY;
let maxSideSize = 7 * emY;
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

function maingame(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save(); // звезды
    for (let i = 0; i < 500; i++) {
        let size = randomInt(1, 3);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()})`;
        ctx.fillRect(Math.random() * canvas.width,
            Math.random() * canvas.height,
            size, size);
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
        ctx.fillRect(-Shot.width / 2, -Shot.height / 2, Shot.width, Shot.height);
        ctx.restore();
        // вылет за пределы
        if (shot.y + Shot.height < 0) shot.out = true;
    };

    // астероиды
    for (let i = 0; i < currentAsteroids.length; i++) {
        let asteroid = currentAsteroids[i];
        asteroid.y += asteroid.speedY;
        asteroid.x += asteroid.speedX;

        ctx.save(); // камень
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#777';
        ctx.translate(asteroid.x, asteroid.y);
        let propY = canvas.height / Math.max(1, asteroid.y);
        let blikY = Math.floor(asteroid.r - 2 * asteroid.r / propY);
        if (blikY > asteroid.r) blikY -= 5;

        let asterRadGrad = ctx.createRadialGradient(
            asteroid.blikX, blikY, asteroid.r / 5,
            0, 0, asteroid.r + 10);
        asterRadGrad.addColorStop(0, '#eee');
        asterRadGrad.addColorStop(0.5, '#bbb');
        asterRadGrad.addColorStop(1, '#888');
        ctx.fillStyle = asterRadGrad;
        ctx.beginPath();
        ctx.moveTo(-asteroid.size[0], 0);
        for (let k = 1; k < asteroid.size.length; k++) {
            ctx.rotate(2 * Math.PI / asteroid.size.length);
            ctx.lineTo(-asteroid.size[k], 0);
        };
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.save(); // > бугорки
        ctx.lineWidth = 2;

        for (let i = 0; i < asteroid.tubers.length; i++) {
            ctx.rotate(2 * Math.PI / asteroid.tubers.length);
            let r = asteroid.tubers.innerRs[i];
            let axisAng = asteroid.tubers.axisAngs[i];
            ctx.save() // вокруг оси бугорка
            ctx.rotate(axisAng);
            ctx.translate(-r, 0);
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -6);
            ctx.lineTo(6, -7);
            ctx.stroke();
            ctx.restore(); // возврат к центру астероида
        };

        ctx.restore();

        ctx.restore(); // конец каменя

        // вылет за пределы
        if (asteroid.y - asteroid.r > canvas.height) {
            asteroid.out = true;
        };
        // уничтожение лазером   
        for (let j = 0; j < currentShots.length; j++) {
            let laserToAst = sqrt(pow(asteroid.x - currentShots[j].x, 2) + pow(asteroid.y - currentShots[j].y - Shot.height / 2, 2));
            laserToAst -= asteroid.r;
            if (laserToAst <= 0) {
                currentShots[j].hit = true;
                asteroid.shooted = true;
                player.score++;
            };
            //            if (currentShots[j].x >= asteroid.x - asteroid.r &&
            //                currentShots[j].x <= asteroid.x + asteroid.r &&
            //                currentShots[j].y >= asteroid.y - asteroid.r &&
            //                currentShots[j].y <= asteroid.y + asteroid.r) {
            //                currentShots[j].hit = true;
            //                asteroid.shooted = true;
            //                player.score++;
            //            };
        };

        // попадание по звездолету
        let playerToAst = sqrt(pow(asteroid.x - player.x, 2) + pow(asteroid.y - player.y, 2));
        playerToAst -= asteroid.r + player.r;
        if (playerToAst <= 0) {
            player.lives--;
            asteroid.injured = true;
        };
    };

    currentAsteroids.forEach(function (ast, i, asts) {
        if (ast.shooted || ast.out || ast.injured) asts.splice(i--, 1);
    });

    currentShots.forEach(function (shot, i, shots) {
        if (shot.hit || shot.out) shots.splice(i--, 1);
    });

    // звездолет
    ctx.save();
    let xOff = -1 + Math.random() * 2;
    let yOff = -2 + Math.random() * 4;

    ctx.translate(player.x + xOff, player.y + yOff);

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
    ctx.moveTo(-player.r, 1);
    ctx.lineTo(player.r, 1);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, player.r, 0, -Math.PI, true);
    ctx.closePath();
    let cabRadGrad = ctx.createRadialGradient(0, -player.r / 2, 7, 0, 0, player.r);
    let blink = Math.min(0.45 + Math.random(), 0.75);
    cabRadGrad.addColorStop(0, `rgba(255, 255, 255, ${blink})`);
    cabRadGrad.addColorStop(0.8, 'rgba(0, 200, 250, 0.6)');
    cabRadGrad.addColorStop(1, 'rgba(0, 150, 200, 0.7)');
    ctx.fillStyle = cabRadGrad;
    ctx.fill();
    ctx.restore();

    ctx.save(); // отображение жизней
    ctx.fillStyle = '#f00';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (let i = 0; i < player.lives; i++) {
        ctx.save();
        ctx.translate(10 + i * (40 + 10), 10);
        ctx.fillRect(0, 0, 40, 40);
        ctx.restore();
    };
    ctx.restore();

    ctx.restore();

    ctx.save(); // очки
    ctx.font = '700 54px sans-serif';
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(`${player.score}`, canvas.width - 10, 10);
    ctx.restore();

    if (player.lives <= 0) {
        xScale = 3, yScale = 3;
        animation = requestAnimationFrame(gameover);
        setTimeout(() => location.reload(), 2000);
        //        setTimeout(NEWGAME, 2000);
        return;
    }

    if (document.hidden) pause();

    animation = requestAnimationFrame(maingame);
}

function NEWGAME() {
    animation = requestAnimationFrame(maingame);
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

function gameover() {
    ctx.save(); // звезды
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(xScale, 0, 0, yScale, 0, 0);
    xScale += 0.05;
    yScale += 0.05;
    for (let i = 0; i < 3000; i++) {
        ctx.fillStyle = `rgba(100, 0, 200, ${Math.random()})`;
        ctx.fillRect(Math.random() * canvas.width,
            Math.random() * canvas.height,
            1, 1);
    };
    ctx.restore();

    ctx.save();
    let blink = ctx.createLinearGradient(0, canvas.height / 3, 0, 2 * canvas.height / 3);
    let rand = Math.random() * 0.89;
    blink.addColorStop(0, `rgba(200, 0, 0, ${Math.random()})`);
    blink.addColorStop(rand, `rgba(200, 0, 0, ${Math.random()})`);
    blink.addColorStop(rand + 0.01, `rgba(255, 255, 255, 0.9)`);
    blink.addColorStop(rand + 0.10, `rgba(255, 255, 255, 0.9)`);
    blink.addColorStop(rand + 0.10 + 0.01, `rgba(200, 0, 0, ${Math.random()})`);
    blink.addColorStop(1, `rgba(200, 0, 0, ${Math.random()})`);
    ctx.strokeStyle = blink;

    ctx.lineWidth = 4;
    ctx.lineJoin = 'bevel';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let fontSize = Math.floor(0.144 * canvas.width);
    ctx.font = `700 ${fontSize}px sans-serif`;
    let x = canvas.width / 2 + randomInt(-3, 3);
    let y = canvas.height / 2 + randomInt(-7, 7);
    ctx.strokeText('GAME OVER', x, y);
    ctx.restore();

    animation = requestAnimationFrame(gameover);
}
