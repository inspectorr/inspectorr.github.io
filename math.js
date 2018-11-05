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
