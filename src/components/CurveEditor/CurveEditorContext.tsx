import { FC, PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from 'react';
import store from 'store2';

import { drawCurve } from '../../draw/draw-curve.ts';
import { drawControlPoints } from '../../draw/draw-point.ts';
import { addDrawJob, removeDawJob } from '../../draw/draw-scheduler.ts';
import { NURBSCurve } from '../../nurbs/NURBSCurve.ts';
import { setCurve } from '../../nurbs/intersections.ts';

interface Point {
  x: number;
  y: number;
  w: number;
}

interface CurveEditorContextProps {
  color: string;
  setColor: (color: string) => void;
  showControlPoints: boolean;
  setShowControlPoints: (setShowControlPoints: boolean) => void;
  degree: number;
  setDegree: (degree: number) => void;
  controlPoints: Point[];
  setControlPoints: (points: Point[]) => void;
  knots: number[];
  setKnots: (knots: number[]) => void;
}

export const CurveEditorContext = createContext<CurveEditorContextProps | undefined>(undefined);

export type CurveEditorProviderProps = {
  storeKey: string;
};

export const CurveEditorProvider: FC<PropsWithChildren & CurveEditorProviderProps> = ({ children, storeKey }) => {
  const data = store.get(storeKey, {
    color: '#FFD000',
    showControlPoints: false,
    degree: 1,
    controlPoints: [],
    knots: [],
  });
  const [color, setColor] = useState(data?.color || '#FFD000');
  const [showControlPoints, setShowControlPoints] = useState(data?.showControlPoints);
  const [degree, setDegree] = useState(data?.degree || 1);
  const [controlPoints, setControlPoints] = useState<Point[]>(data?.controlPoints || []);
  const [knots, setKnots] = useState<number[]>(data?.knots || []);
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
    setCurve(storeKey, curve.current);

    drawFn.current = () => {
      if (showControlPoints) {
        const points = controlPoints.map(({ x, y }) => ({ x, y }));
        drawControlPoints(points);
      }
      curve.current && drawCurve(curve.current, color);
    };
    addDrawJob(drawFn.current);
  };

  useEffect(() => {
    reDrawCurve();
    store.set(storeKey, { color, showControlPoints, degree, controlPoints, knots });
  }, [color, showControlPoints, degree, controlPoints, knots]);

  return (
    <CurveEditorContext.Provider
      value={{
        color,
        setColor,
        showControlPoints,
        setShowControlPoints,
        degree,
        setDegree,
        controlPoints,
        setControlPoints,
        knots,
        setKnots,
      }}
    >
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
