import { FC, PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from 'react';

import { drawCurve } from '../../draw/draw-curve.ts';
import { drawControlPoints } from '../../draw/draw-point.ts';
import { addDrawJob, removeDawJob } from '../../draw/draw-scheduler.ts';
import { NURBSCurve } from '../../nurbs/NURBSCurve.ts';

interface Point {
  x: number;
  y: number;
  w: number;
}

interface CurveEditorContextProps {
  degree: number;
  setDegree: (degree: number) => void;
  controlPoints: Point[];
  setControlPoints: (points: Point[]) => void;
  knots: number[];
  setKnots: (knots: number[]) => void;
}

export const CurveEditorContext = createContext<CurveEditorContextProps | undefined>(undefined);

export const CurveEditorProvider: FC<PropsWithChildren> = ({ children }) => {
  const [degree, setDegree] = useState(1);
  const [controlPoints, setControlPoints] = useState<Point[]>([]);
  const [knots, setKnots] = useState<number[]>([]);
  const curve = useRef<NURBSCurve>();
  const drawFn = useRef<Function>();

  const reDrawCurve = () => {
    if (drawFn.current) {
      removeDawJob(drawFn.current);
    }
    curve.current = new NURBSCurve(
      degree,
      controlPoints.map(({ x, y }) => [x, y, 0]),
      controlPoints.map(({ w }) => w),
      knots,
    );
    curve.current.prepareToDraw();

    drawFn.current = () => {
      const points = controlPoints.map(({ x, y }) => ({ x, y }));
      drawControlPoints(points);
      curve.current && drawCurve(curve.current);
    };
    addDrawJob(drawFn.current);
  };

  useEffect(() => {
    reDrawCurve();
  }, [degree, controlPoints, knots]);

  return (
    <CurveEditorContext.Provider value={{ degree, setDegree, controlPoints, setControlPoints, knots, setKnots }}>
      {children}
    </CurveEditorContext.Provider>
  );
};

export const useCurveEditorContext = (): CurveEditorContextProps => {
  const context = useContext(CurveEditorContext);
  if (!context) {
    throw new Error('useCurveEditorContext must be used within a CurveEditorProvider');
  }
  return context;
};
