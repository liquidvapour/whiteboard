
const getEventInfo = (event) => ({
    pointerId: event.pointerId,
    pressure: event.pressure,
    pointerType: event.pointerType,
    buttons: event.buttons,
    pointerTye: event.pointerType
});

function over_handler(event) {
    console.log("over_handler: " + JSON.stringify(event));
}
function enter_handler(event) { 
    console.log("enter_handler: " + JSON.stringify(event));
}
function out_handler(event) { 
    console.log("out_handler: " + JSON.stringify(event));
}
function leave_handler(event) { 
    console.log("leave_handler: " + JSON.stringify(event));
}
function gotcapture_handler(event) { 
    console.log("gotcapture_handler: " + JSON.stringify(event));
}
function lostcapture_handler(event) { 
    console.log("lostcapture_handler: " + JSON.stringify(event));
}

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

export const startUp = (document) => {
    const canvas = document.createElement("canvas");
    //const canvas = document.getElementById("canvas");    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.append(canvas);

    const strokes = new Strokes();

    const context = canvas.getContext("2d", { alpha: false });
    context.fillStyle = "#AAAAAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var drawing = false;
    var current = { x: 0, y: 0 };

    const move_handler = (event) => { 
        console.log(`down_handler: ${JSON.stringify(getEventInfo(event))}`);
        if (drawing) {
            drawLine(current.x, current.y, event.clientX, event.clientY, event.pressure, true);

            current.x = event.clientX;
            current.y = event.clientY;

            strokes.addPointToStroke(event.clientX, event.clientY, event.pressure);
        }
    };

    const down_handler = (event) => { 
        if (event.pointerType === "pen") {
            if (event.buttons === 1) {
                drawing = true;

                strokes.startStroke(event.clientX, event.clientY, event.pressure);

                current.x = event.clientX;
                current.y = event.clientY;
            }
        }
        console.log(`down_handler: ${JSON.stringify(getEventInfo(event))}`);
    };

    const up_handler = () => { 
        drawing = false;
    }

    const drawLine = (x0, y0, x1, y1, pressure) => {
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = 'black';
        context.lineWidth = 40 * pressure;
        context.stroke();
        context.closePath();
    };

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
};

startUp(document);