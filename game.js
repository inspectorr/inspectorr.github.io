function game(time) {
    let now = new Date(time);
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


    // астероиды
    for (let i = 0; i < currentAsteroids.length; i++) {
        let asteroid = currentAsteroids[i];
        asteroid.y += asteroid.speedY;
        asteroid.x += asteroid.speedX;


        ctx.save(); // камень начало
        ctx.lineWidth = 2;

        //        if (asteroid.injured || asteroid.shooted) {
        //          ctx.strokeStyle = asterRadGrad;  
        //        }

        ctx.strokeStyle = '#555';
        ctx.translate(asteroid.x, asteroid.y); //

        let propY = canvas.height / Math.max(1, asteroid.y);
        let blikY = Math.floor(asteroid.r - 2 * asteroid.r / propY);
        if (blikY > asteroid.r) blikY = asteroid.r;

        let asterRadGrad;

        if (asteroid.injured || asteroid.shooted) { // взрыв
            ctx.scale(1.3, 1.3);
            ctx.rotate(Math.PI / 6);
            let inner = asteroid.r / 3;
            //            inner = Math.min(inner, asteroid.r-1);
            asterRadGrad = ctx.createRadialGradient(
                0, 0, inner,
                0, 0, asteroid.r--
            );
            asterRadGrad.addColorStop(0, 'rgba(255, 255, 255, 1');
            asterRadGrad.addColorStop(0.45, '#fff');
            asterRadGrad.addColorStop(0.55, 'rgba(200, 0, 0, 1)');
            asterRadGrad.addColorStop(1, 'rgba(200, 0, 0, 0)');
            ctx.strokeStyle = asterRadGrad;

        } else {
            asterRadGrad = ctx.createRadialGradient(
                asteroid.blikX, blikY, asteroid.r / 5,
                0, 0, asteroid.r + 20
            );
            asterRadGrad.addColorStop(0, '#eee');
            asterRadGrad.addColorStop(0.6, '#aaa');
            asterRadGrad.addColorStop(1, '#888');
        }

        ctx.fillStyle = asterRadGrad;
        ctx.beginPath();

        if (asteroid.injured || asteroid.shooted) {
            asteroid.size.forEach((s, i, size) => {
                size[i] -= 5;
                size[i] = Math.max(size[i], 0);
            });
        }
        ctx.moveTo(-asteroid.size[0], 0);
        for (let k = 1; k < asteroid.size.length; k++) {
            ctx.rotate(2 * Math.PI / asteroid.size.length);
            ctx.lineTo(-asteroid.size[k], 0);
        };
        ctx.closePath();
        ctx.fill();

        //        if (asteroid.injured || asteroid.shooted) {
        //            ctx.fillStyle = 'rgba(255, 0, 0, 1)';
        //            ctx.fillRect(1, 1,
        //                    randomInt(0, randomSign() * asteroid.r + 10),
        //                    randomInt(0, randomSign() * asteroid.r + 10)
        //            ); 
        ////            for (let i = 0; i < asteroid.r / 2; i++) {
        ////                ctx.fillRect(1, 1,
        ////                    randomInt(0, randomSign() * asteroid.r + 10),
        ////                    randomInt(0, randomSign() * asteroid.r + 10)
        ////                ); 
        ////            }
        //        };
        //        ctx.clip();

        ctx.stroke();



        ctx.save(); // > бугорки
        ctx.lineWidth = 2;
        ctx.shadowBlur = 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.33)';
        ctx.shadowOffsetX = asteroid.shadowOffsetX;
        ctx.shadowOffsetY = asteroid.shadowOffsetY;


        if (!asteroid.injured && !asteroid.shooted) {
            for (let i = 0; i < asteroid.tubers.length; i++) {
                ctx.rotate(2 * Math.PI / asteroid.tubers.length);
                let r = asteroid.tubers.innerRs[i];
                let axisAng = asteroid.tubers.axisAngs[i];
                ctx.save() // вокруг оси бугорка
                ctx.strokeStyle = '#666';
                ctx.rotate(axisAng);
                ctx.translate(-r, 0);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -6);
                ctx.lineTo(6, -7);
                ctx.stroke();
                ctx.restore(); // возврат к центру астероида
            };
        }

        ctx.restore();

        //        ctx.save(); // взрыв
        ////        let now = new Date();
        //        if (asteroid.injured || asteroid.shooted) {
        ////            let r = 30/asteroid.r + 10;
        ////            let r = ;
        //            let blast = ctx.createRadialGradient(
        //                0, 0, r/3,
        //                0, 0, r
        //            );
        //            blast.addColorStop(0, `rgba(255, 255, 255, 0.3)`);
        //            blast.addColorStop(1, `rgba(255, 0, 0, 0.3)`);
        //            ctx.fillStyle = blast;
        //            ctx.arc(0, 0, r, 0, 2*Math.PI);
        //            ctx.fill();
        //        }
        //        ctx.restore()


        ctx.restore(); // конец каменя

        // вылет за пределы
        if (asteroid.y - asteroid.r > canvas.height) {
            asteroid.out = true;
        };

        // уничтожение лазером   
        for (let j = 0; j < currentShots.length; j++) {
            let laserToAst = sqrt(pow(asteroid.x - currentShots[j].x, 2) + pow(asteroid.y - currentShots[j].y, 2));
            laserToAst -= asteroid.r;
            if (laserToAst <= 0 && !asteroid.injured && !asteroid.shooted &&
                asteroid.y + asteroid.r > 0) {
                currentShots[j].hit = true;
                asteroid.shooted = true;
                player.score++;
            };
        };

        // попадание по звездолету
        let playerToAst = sqrt(pow(asteroid.x - player.x, 2) + pow(asteroid.y - player.y, 2));
        playerToAst -= asteroid.r + player.r;
        if (playerToAst <= 0 && !asteroid.injured) {
            player.redShieldBlock(1200);
            player.injure();
            asteroid.injured = true;
        };

        // взрыв

        //        if (asteroid.injured || asteroid.shooted) {
        //            ctx.save();
        //            ctx.translate(asteroid.x, asteroid.y);
        //            ctx.fillStyle = 'rgba(255, 0, 0, 1)';
        //            for (let i = 0; i < asteroid.r / 2; i++) {
        //                ctx.fillRect(1, 1, 
        //                    randomInt(0, randomSign()*asteroid.r + 10), 
        //                    randomInt(0, randomSign()*asteroid.r + 10));
        //            };
        //            
        //            ctx.beginPath(); // (границы заново лол)
        //            ctx.moveTo(-asteroid.size[0], 0);
        //            for (let k = 1; k < asteroid.size.length; k++) {
        //                ctx.rotate(2 * Math.PI / asteroid.size.length);
        //                ctx.lineTo(-asteroid.size[k], 0);
        //            };
        //            ctx.closePath();
        //            ctx.clip();
        //
        //
        //            ctx.restore();
        //        };

    };

    currentAsteroids.forEach(function (ast, i, asts) {
        if (ast.shooted || ast.injured) setTimeout(() => ast.escape(), 250);
        if (ast.out) ast.escape();
        if (ast.escaped) {
            asts.splice(i--, 1);
        }
    });

    // лазер
    for (let i = 0; i < currentShots.length; i++) {
        let shot = currentShots[i];
        ctx.save();
        ctx.translate(shot.x, shot.y - Shot.height / 2);
        shot.y -= Shot.speed;

        let laser = ctx.createLinearGradient(-Shot.width / 2, 0, Shot.width / 2, 0);

        let sup = 0;
        if (now.getMilliseconds() % 5 == 0) sup = Math.random() * 0.25;
        let flash = 0.25;
        //        if (now.getMilliseconds() % 5 == 0) {
        //            flash = Math.max(sup+0.05, Math.random()*0.3);
        //        }

        laser.addColorStop(sup, 'rgba(255, 0, 0, 0)');
        laser.addColorStop(flash, 'rgba(255, 0, 0, 1)');
        laser.addColorStop(flash, 'rgba(255, 255, 255, 1)');
        laser.addColorStop(1 - flash, 'rgba(255, 255, 255, 1)');
        laser.addColorStop(1 - flash, 'rgba(255, 0, 0, 1)');
        laser.addColorStop(1 - sup, 'rgba(255, 0, 0, 0)');
        ctx.fillStyle = laser;
        ctx.fillRect(-Shot.width / 2, 0, Shot.width, Shot.height);
        ctx.restore();
        // вылет за пределы
        if (shot.y + Shot.height < 0) shot.out = true;
    };


    currentShots.forEach(function (shot, i, shots) {
        if (shot.hit || shot.out) shots.splice(i--, 1);
    });

    // звездолет
    ctx.save();
    let xOff = -1 + Math.random() * 2;
    let yOff = -2 + Math.random() * 4;

    ctx.setTransform(1, 0, 0, 1, player.x + xOff, player.y + yOff);

    ctx.save(); // корпус
    let corpRadGrad = ctx.createRadialGradient(0, -1.25 * emD, 0.875 * emD, 0, -1.25 * emD, 62.5 * emD);
    corpRadGrad.addColorStop(0, 'rgba(220, 80, 0, 1)');
    corpRadGrad.addColorStop(0.7, 'rgba(180, 50, 0, 1)');
    corpRadGrad.addColorStop(1, 'rgba(180, 50, 0, 0.8)');

    ctx.fillStyle = corpRadGrad;
    ctx.beginPath();
    ctx.moveTo(-player.r, 0);
    ctx.bezierCurveTo(-3.6 * emD, 3.6 * emD, 3.6 * emD, 3.6 * emD, player.r, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save(); // инопланетянен

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
    ctx.moveTo(-0.6 * emD, 0);
    ctx.lineTo(-0.6 * emD, -0.6 * emD);
    ctx.bezierCurveTo(-0.875 * emD, -1.875 * emD, -1.875 * emD, -3.125 * emD, 0, -3.375 * emD);
    ctx.bezierCurveTo(1.875 * emD, -3.125 * emD, 0.875 * emD, -1.875 * emD, 0.6 * emD, -0.6 * emD);
    ctx.lineTo(0.6 * emD, 0);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 200, 0, 1)';
    ctx.fill();



    ctx.save(); // левый глаз
    ctx.translate(-0.5 * emD, -2.375 * emD);
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(-0.5 * emD, 0);

    let regularLeft = 0.5 * emD;
    // моргание
    let nowL = new Date(5000 + time);
    if (nowL.getSeconds() % 10 == 0 && !player.redShieldBlocked) {
        regularLeft = 0;
    };

    ctx.quadraticCurveTo(0, regularLeft, regularLeft, 0);
    ctx.quadraticCurveTo(0, -regularLeft, -regularLeft, 0);
    ctx.closePath();
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.restore();

    ctx.save(); // правый глаз
    ctx.translate(0.5 * emD, -2.375 * emD);
    ctx.rotate(3 * Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0.5 * emD, 0);

    let regularRight = 0.5 * emD;
    // моргание
    let nowR = new Date(5000 + time + 100);
    if (nowR.getSeconds() % 10 == 0 && !player.redShieldBlocked) {
        regularRight = nowR.getMilliseconds() / 1000 * regularRight;
    };

    ctx.quadraticCurveTo(0, -regularRight, -regularRight, 0);
    ctx.quadraticCurveTo(0, regularRight, regularRight, 0);
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

    // блок 
    if (player.redShieldBlocked) {
        player.frame++;
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, player.r, 0, -Math.PI, true);
        ctx.lineWidth = emD * 3;

        let shield = ctx.createRadialGradient(
            0, 0, player.r - ctx.lineWidth / 2,
            0, 0, player.r + ctx.lineWidth / 2
        );
        shield.addColorStop(0, 'rgba(0, 0, 0, 0)');
        shield.addColorStop(0.5, 'rgba(200, 0, 50, 1)');
        shield.addColorStop(0.8, 'rgba(200, 0, 50, 1)');
//        shield.addColorStop(0.9, 'rgba(255, 255, 255, 1)');
        shield.addColorStop(1, 'rgba(200, 0, 50, 0)');

        for (let i = 0; i < 150; i++) {
            ctx.save();
            ctx.translate(-3, -3);
            ctx.fillStyle = `rgba(${randomInt(0, 255)},
            ${randomInt(0, 255)}, ${randomInt(0, 255)}, 0.5)`;
            let x = randomInt(-player.r, player.r);
            let y = randomInt(-player.r, 0);
            let r = sqrt(pow(x, 2) + pow(y, 2));
            if (player.r <= r) {
                x = 0;
                y = -player.r / 2;
            };
            ctx.fillRect(x, y, 6, 6);
            ctx.restore();
        };

        ctx.strokeStyle = shield;
        if (player.frame % 4 == 0) ctx.stroke();

        ctx.restore();
    }
    ctx.fill();
    ctx.restore();

    // трещины
    if (player.lives < 3) {

    }

    //    // здоровье < 3 (трещины)
    //    if (player.lives < 3) {
    //        ctx.save();
    //        ctx.beginPath();
    //        ctx.strokeStyle = '#ddd';
    //        let count = this.cracks;
    //        for (let i = 0; i < count; i++) {
    //            ctx.moveTo(player.outerCrackPts[i][0], player.outerCrackPts[i][1]);
    //            ctx.lineTo(player.midCrackPts[i][0], player.midCrackPts[i][1]);
    ////            ctx.lineTo(player.bottomCrackPts[i][0], player.bottomCrackPts[i][1]);
    //        };
    ////        for (let i = 0; i < count / 2; i++) {
    ////             ctx.moveTo(player.midCrackPts[i][0], player.midCrackPts[i][1]);
    ////             ctx.lineTo(player.bottomCrackPts[i][0], player.bottomCrackPts[i][1]);
    ////        };
    //        ctx.stroke();
    //        player.midCrackPts.forEach((item, i, arr) => {
    //            let x = arr[i][0];
    //            let y = arr[i][1];
    //            ctx.fillStyle = 'red';
    //            ctx.fillRect(x, y, 1, 1);
    //        });
    //        player.outerCrackPts.forEach((item, i, arr) => {
    //            let x = arr[i][0];
    //            let y = arr[i][1];
    //            ctx.fillStyle = 'white';
    //            ctx.fillRect(x, y, 1, 1);
    //        });
    //        ctx.restore();
    //    }


    ctx.save(); // отображение жизней
    ctx.fillStyle = 'rgba(200, 0, 50, 1)';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (let i = 0; i < player.lives; i++) {
        ctx.save();
        ctx.translate(1.5 * emD + i * 7 * emD, 1.5 * emD);

        let heart = ctx.createRadialGradient(
            4.5 * emD, 1 * emD, 0.1 * emD,
            3 * emD, 3 * emD, 6 * emD);
        heart.addColorStop(0, 'rgba(255, 255, 255, 1)');
        heart.addColorStop(0.1, 'rgba(200, 0, 50, 1)');
        heart.addColorStop(0.7, 'rgba(200, 0, 150, 0.8)');
        heart.addColorStop(1, 'rgba(200, 0, 50, 0.8)');
        ctx.fillStyle = heart;
    
        if (player.redShieldBlocked && i == player.lives - 1) {
            ctx.translate(randomInt(-2, 2), randomInt(-2, 2));
        };
        ctx.beginPath();
        ctx.arc(3 * emD, 3 * emD, 3 * emD, -Math.PI / 6, -5 * Math.PI / 6, true);
        ctx.lineTo(3 * emD, 4 * emD)
        ctx.closePath()
        ctx.clip();

        ctx.fillRect(0, 0, 6 * emD, 6 * emD);
        
        
        if (player.redShieldBlocked && i == player.lives - 1) {
            for (let i = 0; i < 300; i++) {
                ctx.save();
                ctx.fillStyle = `rgba(${randomInt(0, 255)},
                ${0}, ${randomInt(0, 50)}, 0.2)`;
        
                let x = randomInt(0, 6*emD);
                let y = randomInt(0, 6*emD);
                ctx.fillRect(x, y, 6, 6);
                ctx.restore();
            };
        };

        ctx.restore();
    };
    ctx.restore();

    ctx.restore();

    ctx.save(); // очки
    ctx.font = `1000 ${5*emD}px sans-serif`;
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(`${player.score}`, canvas.width - 1.5 * emD, 1.5 * emD);
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
