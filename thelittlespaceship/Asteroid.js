class Asteroid {
    constructor(x, y, size, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.r = Math.floor(size.reduce((sum, current) => sum + current) / size.length);

        let count = randomInt(3, 5);
        this.tubers = {
            length: count
        };
        this.tubers.innerRs = new Array(count);
        this.tubers.axisAngs = new Array(count);
        for (let i = 0; i < count; i++) {
            this.tubers.innerRs[i] = randomInt(0.875*emD, 2.75*emD);
            this.tubers.axisAngs[i] = (Math.PI / 180 * randomInt(-0.375*emD, 0.375*emD));
        };
        this.shadowOffsetX = randomInt(-2, 2);
        this.shadowOffsetY = randomInt(-2, 2);

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
        
        this.escaped = false;
    }
    
    escape() {
        this.escaped = true;
        return true;
    }
}