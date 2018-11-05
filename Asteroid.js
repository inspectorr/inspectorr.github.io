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