import { inv, multiply }  from 'mathjs';

const getEventInfo = (event) => ({
    pointerId: event.pointerId,
    pressure: event.pressure,
    pointerType: event.pointerType,
    buttons: event.buttons
});

const showInfo = (name, event) => {
    console.log(`${name}: ${JSON.stringify(getEventInfo(event))}`);
};

function over_handler(event) {
    showInfo("over", event);
}

function out_handler(event) { 
    showInfo("out" , event);
}
function leave_handler(event) { 
    showInfo("leave", event);
}
function gotcapture_handler(event) { 
    showInfo("gotcapture", event);
}
function lostcapture_handler(event) { 
    showInfo("lostcapture", event);
}

const isPen = (event) => event.pointerType === "pen";

class Strokes {
    constructor() {
        this.strokes = [];
        this.currentStroke = null;
    }

    startStroke(x, y, pressure) {
        this.currentStroke = {x:[x], y:[y], pressure:[pressure]};
        this.strokes.push(this.currentStroke);
    }

    addPointToStroke(x, y, pressure) {
        const s = this.currentStroke;
        s.x.push(x);
        s.y.push(y);
        s.pressure.push(pressure);
    }
}

const drawLine = (context, x0, y0, x1, y1, pressure) => {
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = 'black';
    context.lineWidth = 40 * pressure;
    context.stroke();
};

const drawTheThings = (context, strokes, w, h, x, y, scale) => {
    context.save()
    context.fillStyle = "#AAAAAA";
    context.fillRect(0, 0, w, h);
    
    context.transform(scale, 0, 0, scale, x, y);
    //context.scale(scale, scale);
    //context.translate(x, y);

    for (let i = 0; i < strokes.strokes.length; i++) {
        const stroke = strokes.strokes[i];
        let firstPoint = true;
        let lastX, lastY, lastP = null;
        context.beginPath();
        for (let s = 0; s < stroke.x.length; s++) {
            const x = stroke.x[s];
            const y = stroke.y[s];
            const p = stroke.pressure[s];

            if (firstPoint) {
                firstPoint = false;
            } else {
                drawLine(context, lastX, lastY, x, y, lastP);                
            }
            lastX = x;
            lastY = y;
            lastP = p;
        
        }
        context.closePath();
    }
    context.restore();
};

const screenToWorld = (x, y, tx, ty, s) => {
    const i = inv([
        [s, 0, tx],
        [0, s, ty], 
        [0, 0, 1]]);
    const r = multiply([x, y, 0], i);
    return { x: r[0], y: r[1] };
};



export const startUp = (document) => {
    const canvas = document.createElement("canvas");
    //const canvas = document.getElementById("canvas");    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.append(canvas);

    const strokes = new Strokes();

    const context = canvas.getContext("2d", { alpha: false });
    context.fillStyle = "#DDDDDD";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var drawing = false;

    const offset = { x: 0, y: 0 };
    let scale = 1.0;

    const move_handler = (event) => { 
        showInfo("move", event);

        if (!isPen(event)) return;

        if (drawing) {
            const worldPoint = screenToWorld(
                event.clientX,
                event.clientY,
                offset.x,
                offset.y,
                scale
            );
            strokes.addPointToStroke(
                worldPoint.x, 
                worldPoint.y, 
                event.pressure);
        } else if (event.ctrlKey) {
            offset.x += event.movementX;
            offset.y += event.movementY;
        } else if (event.shiftKey) {
            scale += event.movementY * 0.01;
        }

        window.requestAnimationFrame(() => drawTheThings(
            context,
            strokes,
            canvas.width,
            canvas.height,
            offset.x,
            offset.y,
            scale));

        event.cancelBubble = true;
    };

    const down_handler = (event) => { 
        showInfo("down", event);

        if (!isPen(event)) return;

        if (event.buttons === 1) {
            drawing = true;
            const worldPoint = screenToWorld(
                event.clientX,
                event.clientY,
                offset.x,
                offset.y,
                scale
            );
            strokes.startStroke(
                worldPoint.x, 
                worldPoint.y, 
                event.pressure);
        }

        event.cancelBubble = true;
    };

    const up_handler = (event) => { 
        if (!isPen(event)) return;

        drawing = false;
        event.cancelBubble = true;
    }

    function enter_handler(event) { 
        if (!isPen(event)) return;
        showInfo("enter", event);

        if (event.pointerType === "pen") {
            canvas.setPointerCapture(event.pointerId);
        }
    }

    canvas.onpointerover = over_handler;
    canvas.onpointerenter = enter_handler;
    canvas.onpointerdown = down_handler;
    canvas.onpointermove = move_handler;
    canvas.onpointerup = up_handler;
   // canvas.onpointercancel = cancel_handler;
    canvas.onpointerout = out_handler;
    canvas.onpointerleave = leave_handler;
    canvas.gotpointercapture = gotcapture_handler;
    canvas.lostpointercapture = lostcapture_handler;
    canvas.oncontextmenu = e => e.preventDefault();
};

startUp(document);