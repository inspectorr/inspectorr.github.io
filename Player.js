class Player {
    constructor(x, y) {
        this.lives = 3;
        this.score = 0;
        this.r = 5 * emD;
        this.x = x;
        this.y = y;
        this.cracks = [];
        this.redShieldBlocked = false;
        
        
//        this.cracks = 2;
//        let r;
//        
//        let bottomCrackPts = new Array(this.cracks);
//        r = emD * 2;
//        for (let i = 0; i < bottomCrackPts.length; i++) {
//            bottomCrackPts[i] = [randomInt(-r, r), 0];
//        };
//        this.bottomCrackPts = bottomCrackPts;
//
//        let midCrackPts = new Array(this.cracks);
//        r = emD * 4;
//        for (let i = 0; i < midCrackPts.length; i++) {
//            midCrackPts[i] = [randomInt(-r, r), randomInt(-emD, -r)];
////            while (pow(midCrackPts[i][0], 2) + pow(midCrackPts[i][1], 2) < r * r) {
////                if (midCrackPts[i][0] >= 0) midCrackPts[i][0]++
////                else midCrackPts[i][0]--;
////                if (midCrackPts[i][1] <= 0) midCrackPts[i][1]--
////            }
//            //            while (pow(midCrackPts[i][0], 2) + pow(midCrackPts[i][1], 2) >= r*r) {
//            //                if (midCrackPts[i][0] >= 0) midCrackPts[i][0]--
//            //                else midCrackPts[i][0]++;
//            //                if (midCrackPts[i][1] >= 0) midCrackPts[i][1]--
//            //                else midCrackPts[i][1]++
//            //            }
//            console.log(midCrackPts[i]);
//        }
//        this.midCrackPts = midCrackPts;
//
//        let outerCrackPts = new Array(this.cracks);
//        r = this.r;
//        for (let i = 0; i < outerCrackPts.length; i++) {
//            outerCrackPts[i] = [randomInt(-r, r), randomInt(0, -r)];
//
//            while (pow(outerCrackPts[i][0], 2) + pow(outerCrackPts[i][1], 2) < r * r) {
//                if (outerCrackPts[i][0] >= 0) outerCrackPts[i][0]++
//                else outerCrackPts[i][0]--;
//                if (outerCrackPts[i][1] <= 0) outerCrackPts[i][1]--
//            }
//            console.log(outerCrackPts[i]);
//        }
//        this.outerCrackPts = outerCrackPts;

    }
//    
//    makeCrack(ang) {
//        let crack = {};
//        crack.ang = ang;
//        
//        this.cracks.push(crack);
//    }

    redShieldBlock(ms) {
        this.frame = 0;
        this.redShieldBlocked = true;
        this.block = setTimeout(() => {
            this.redShieldBlocked = false;
            this.frame = 0;
        }, ms);
    }
}


