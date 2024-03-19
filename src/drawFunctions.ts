import { NURBSCurve } from "./NURBSCurve";

export const drawLine = (ctx: CanvasRenderingContext2D, point1: any, point2: any) => {
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
};
export const drawCurveByPoints = (ctx: CanvasRenderingContext2D, pixelsOfCurve: { x: number, y: number }[], scale: number = 1) => {
    if (!pixelsOfCurve.length) {
        return;
    }
    ctx.strokeStyle = 'black'
    ctx.beginPath();
    let p = {
        x: pixelsOfCurve[0].x * scale,
        y: pixelsOfCurve[0].y * scale
    };
    for (let i = 1; i < pixelsOfCurve.length; i++) {
        const p2 = {
            x: pixelsOfCurve[i].x * scale,
            y: pixelsOfCurve[i].y * scale
        };
        drawLine(ctx, p, p2);
        p = p2;
    }
    ctx.stroke();
}
export const drawGen = (ctx: CanvasRenderingContext2D, gen: any) => {
    drawCurveByPoints(ctx, gen, 1);
};

export const drawNURBSCurve = (ctx: CanvasRenderingContext2D, curve: NURBSCurve) => {
    const points: { x: number, y: number }[] = [];
    for (let u = 0; u <= 1; u += 0.01) {
        const [x, y] = curve.evaluate(u);
        points.push({x, y});
    }
    drawCurveByPoints(ctx, points as any, 200);
};