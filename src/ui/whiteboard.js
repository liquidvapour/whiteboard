import { multiply, identity }  from 'mathjs';
import { populateStrokes, postStroke } from './server';
import { Strokes } from './strokes';

const getEventInfo = (event) => ({
    pointerId: event.pointerId,
    pressure: event.pressure,
    pointerType: event.pointerType,
    buttons: event.buttons
});

const showInfo = (name, event) => {
    console.log(`${name}: ${JSON.stringify(getEventInfo(event))}`);
};

function over_handler() {
    //showInfo("over", event);
}

function out_handler() { 
    //showInfo("out" , event);
}
function leave_handler() { 
    //showInfo("leave", event);
}
function gotcapture_handler() { 
    //showInfo("gotcapture", event);
}
function lostcapture_handler() { 
    //showInfo("lostcapture", event);
}

const isPen = (event) => event.pointerType === "pen";

const drawLine = (context, x0, y0, x1, y1, pressure) => {
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = 'black';
    context.lineWidth = 5 * pressure;
    context.stroke();
};

const drawTheThings = (context, strokes, w, h, x, y, scale) => {
    context.save()
    context.fillStyle = "#AAAAAA";
    context.fillRect(0, 0, w, h);
    
    // context.translate(scalingCenter.x, scalingCenter.y);
    context.scale(scale, scale);
    // context.translate(-scalingCenter.x, -scalingCenter.y);
    context.translate(x, y);

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

const matrixCreateDefault = () => identity(3);

const newV2 = (x = 0, y = 0) => ({ x, y });

const myInv = (m) => ([
    [1/m[0][0], 0, 0],
    [0, 1/m[1][1], 0],
    [-m[2][0], -m[2][1], 1]
]);

export const start = async (document, boardName) => {
    const canvas = document.createElement("canvas");
    //const canvas = document.getElementById("canvas");    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.append(canvas);

    const strokes = new Strokes(await populateStrokes(boardName));

    const context = canvas.getContext("2d", { alpha: false });
    context.fillStyle = "#DDDDDD";
    context.fillRect(0, 0, canvas.width, canvas.height);

    let drawing = false;
    let scaling = false;
    const scalingCenter = newV2();
    const screenTopLeftAtScaleStartInWorldSpace = newV2();

    const offset = newV2();
    let scale = 1.0;
    const worldMatrix = matrixCreateDefault().toArray();
    let worldMatrixInv = myInv(worldMatrix);

    const matrixSetScale = (s) => {
        worldMatrix[0][0] = s;
        worldMatrix[1][1] = s;
        worldMatrixInv = myInv(worldMatrix);
    };
    
    const matrixSetTranslation = (x, y) => {
        worldMatrix[2][0] = x;
        worldMatrix[2][1] = y;
        worldMatrixInv = myInv(worldMatrix);
    };

    const screenToWorld = (x, y) => {
        const r = multiply([x, y, 1], worldMatrixInv);
        // console.log(`world: ${worldMatrix}`);
        // console.log(`worldInv: ${worldMatrixInv}`);
        // console.log(`screen {x: ${x}, y: ${y}}`);
        // console.log(`world {x: ${r[0]}, y: ${r[1]}}`);
        return { x: r[0], y: r[1] };
    };

    const move_handler = (event) => { 
        if (!isPen(event)) return;

        if (drawing) {
            const worldPoint = screenToWorld(
                event.clientX,
                event.clientY
            );
            strokes.addPointToStroke(
                worldPoint.x, 
                worldPoint.y, 
                event.pressure);
        } else if (event.ctrlKey) {
            offset.x += event.movementX * (1 / scale);
            offset.y += event.movementY * (1 / scale);
            matrixSetTranslation(offset.x, offset.y);
        }
        
        if (event.shiftKey) {
            if (!scaling) {
                const worldPoint = screenToWorld(
                    event.clientX,
                    event.clientY
                )
                scalingCenter.x = worldPoint.x;
                scalingCenter.y = worldPoint.y;

                console.log(`start scaling at: ${JSON.stringify(worldPoint)}`)

                const screenOriginInWorldSpace = screenToWorld(0, 0);
                screenTopLeftAtScaleStartInWorldSpace.x = screenOriginInWorldSpace.x;
                screenTopLeftAtScaleStartInWorldSpace.y = screenOriginInWorldSpace.y;

                console.log(`screen origin in world space: ${JSON.stringify(screenTopLeftAtScaleStartInWorldSpace)}`)

                scaling = true;
            }
            scale = Math.max(0.05, scale + event.movementY * 0.01);
            matrixSetScale(scale);
        } else {
            scaling = false;
        }

        window.requestAnimationFrame(() => drawTheThings(
            context,
            strokes,
            canvas.width,
            canvas.height,
            offset.x,
            offset.y,
            scale,
            scalingCenter));

        event.cancelBubble = true;
    };

    const down_handler = (event) => { 
        showInfo("down", event);

        if (!isPen(event)) return;

        if (event.buttons === 1) {
            drawing = true;
            const worldPoint = screenToWorld(
                event.clientX,
                event.clientY
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

        const lastStroke = strokes.getCurrentStroke();

        postStroke(boardName, lastStroke)
            .then(success => console.log(`stoke sent success: ${success}`)
            .catch(e => console.log(`sending stroke failed ${e}`)));

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

    window.requestAnimationFrame(() => drawTheThings(
        context,
        strokes,
        canvas.width,
        canvas.height,
        offset.x,
        offset.y,
        scale,
        scalingCenter));
};