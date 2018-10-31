'use strict';

let canvas = document.getElementById('game');
canvas.style.marginTop = -canvas.height / 2 + 'px';
canvas.style.marginLeft = -canvas.width / 2 + 'px';

let ctx = canvas.getContext('2d');

function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save(); // звезды
    for (let i = 0; i < 300; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()})`;
        ctx.fillRect(Math.random() * canvas.width,
            Math.random() * canvas.height,
            1, 1);
    };
    ctx.restore();

    // выстрелы
    for (let shot of currentShots) {
        let now = performance.now();
        ctx.save();
        ctx.translate(shot.x, shot.y);
        shot.y -= (now - time) * 5;
        let laser = ctx.createLinearGradient(-5, 0, 5, 0);
        laser.addColorStop(0, '#F00');
        laser.addColorStop(0.2, '#FFF');
        laser.addColorStop(0.8, '#FFF');
        laser.addColorStop(1, '#F00');
        ctx.fillStyle = laser;
        ctx.fillRect(-5, -20, 10, 40);
        ctx.restore();
    }

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

let canvasCoords = canvas.getBoundingClientRect();

let canvasClientX = canvas.width / 2;
let canvasClientY = canvas.height / 2;

canvas.addEventListener('mousemove', function (event) {
    canvasClientX = event.clientX - canvasCoords.left;
    canvasClientY = event.clientY - canvasCoords.top;
});

let currentShots = [];

class Shot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

canvas.addEventListener('click', function (event) {
    let x = event.clientX - canvasCoords.left;
    let y = event.clientY - canvasCoords.top;
    let shot = new Shot(x, y);
    currentShots.push(shot);
    setTimeout(() => currentShots.shift(), 1500);
})

requestAnimationFrame(draw);
