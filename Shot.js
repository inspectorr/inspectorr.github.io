class Shot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hit = false;
        this.out = false;
    }

    static get speed() {
        return 2.5*emD;
    }

    static get height() {
        return 7*emD;
    }

    static get width() {
        return 1.3*emD;
    }
}
