const len = (ax, ay, bx, by) => {
    const xLen = ax - bx;
    const yLen = ay - by;
    return Math.sqrt(xLen * xLen + yLen * yLen);
};


const minLineLength = 10;

export class Strokes {

    constructor(strokes = []) {
        this.strokes = strokes;
        this.currentStroke = null;
    }

    startStroke(x, y, pressure) {
        this.currentStroke = {x:[x], y:[y], pressure:[pressure]};
        this.strokes.push(this.currentStroke);
    }

    lengthToLastPoint(x, y) {
        const l = this.currentStroke.x.length;
        const ax = this.currentStroke.x[l - 1];
        const ay = this.currentStroke.y[l - 1];
        return len(ax, ay, x, y);
    }

    addPointToStroke(x, y, pressure) {
        const s = this.currentStroke;
        const lenToPoint = this.lengthToLastPoint(x, y);
        console.log(`len to last point: ${lenToPoint}`);
        if (lenToPoint > minLineLength) {
            s.x.push(Math.round(x));
            s.y.push(Math.round(y));
            s.pressure.push(pressure);
        } else {
            console.log(`skipped {x:${x}, y:${y}} len:${lenToPoint}`);
        }
    }

    getCurrentStroke() {
        return this.currentStroke;
    }
}