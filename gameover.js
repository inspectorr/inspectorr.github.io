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