import {nurbsCurve, NURBSCurve} from "./NURBSCurve.ts";

export const evaluateNURBSCurve = (curve: NURBSCurve) => {
    const points: { x: number; y: number }[] = [];
    const scale = 1;
    const offsetX = 0;
    const offsetY = 0;

    for (let t = 0; t <= 1; t += 0.01) {
        const [x, y] = curve.evaluate(t);
        points.push({
            x: (x - offsetX) * scale,
            y: (y - offsetY) * scale,
        });

    }
    return points;
}


export const findParameterForPoint = (curve: NURBSCurve, targetPoint: { x: number; y: number }, step: number = 0.001): number | null => {
    let bestT: number | null = null;
    let minDistance = Infinity;
    console.log(targetPoint, 'targetPoint');

    for (let t = 0; t <= 1; t += step) {
        const [x, y] = curve.evaluate(t);
        const distance = Math.sqrt(Math.pow(x - targetPoint.x, 2) + Math.pow(y - targetPoint.y, 2));

        if (distance < minDistance) {
            minDistance = distance;
            bestT = t;
        }
    }

    return bestT;
};

export const findPrevAndNext = (t: number) => {
    const points = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    let prevPoint = null;
    let nextPoint = null;
    let minDistancePrev = Infinity;
    let minDistanceNext = Infinity;

    points.forEach(point => {
        const distance = Math.abs(point - t);
        if (point < t && distance < minDistancePrev) {
            minDistancePrev = distance;
            prevPoint = point;
        } else if (point > t && distance < minDistanceNext) {
            minDistanceNext = distance;
            nextPoint = point;
        }
    });

    return { prev: prevPoint, next: nextPoint };
}

