function game(time) {
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
    let corpRadGrad = ctx.createRadialGradient(0, -1.25*emD, 0.875*emD, 0, -1.25*emD, 62.5*emD);
    corpRadGrad.addColorStop(0, 'rgba(220, 80, 0, 1)');
    corpRadGrad.addColorStop(0.7, 'rgba(180, 50, 0, 1)');
    corpRadGrad.addColorStop(1, 'rgba(180, 50, 0, 0.8)');
    ctx.fillStyle = corpRadGrad;
    ctx.beginPath();
    ctx.moveTo(-player.r, 0);
    ctx.bezierCurveTo(-3.6*emD, 3.6*emD, 3.6*emD, 3.6*emD, player.r, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save(); // пришелец

//    ctx.beginPath();
//    ctx.moveTo(-emD, 0);
//    ctx.lineTo(-5, -5);
//    ctx.bezierCurveTo(-7, -15, -15, -25, 0, -27);
//    ctx.bezierCurveTo(15, -25, 7, -15, 5, -5);
//    ctx.lineTo(5, 0);
//    ctx.closePath();
//    ctx.fillStyle = 'rgba(0, 200, 0, 1)';
//    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(-0.6*emD, 0);
    ctx.lineTo(-0.6*emD, -0.6*emD);
    ctx.bezierCurveTo(-0.875*emD, -1.875*emD, -1.875*emD, -3.125*emD, 0, -3.375*emD);
    ctx.bezierCurveTo(1.875*emD, -3.125*emD, 0.875*emD, -1.875*emD, 0.6*emD, -0.6*emD);
    ctx.lineTo(0.6*emD, 0);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 200, 0, 1)';
    ctx.fill();

    ctx.save(); // левый глаз
    ctx.translate(-0.5*emD, -2.375*emD);
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(-0.5*emD, 0);
    ctx.quadraticCurveTo(0, 0.5*emD, 0.5*emD, 0);
    ctx.quadraticCurveTo(0, -0.5*emD, -0.5*emD, 0);
    ctx.closePath();
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.restore();

    ctx.save(); // правый глаз
    ctx.translate(0.5*emD, -2.375*emD);
    ctx.rotate(3 * Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0.5*emD, 0);
    ctx.quadraticCurveTo(0, -0.5*emD, -0.5*emD, 0);
    ctx.quadraticCurveTo(0, 0.5*emD, 0.5*emD, 0);
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
        return;
    }

    if (document.hidden) pause();

    animation = requestAnimationFrame(game);
}
