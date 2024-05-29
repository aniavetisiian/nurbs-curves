import { FC, PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from 'react';
import store from 'store2';

import { drawCurve } from '../../draw/draw-curve.ts';
import { drawControlPoints, drawOPoint } from '../../draw/draw-point.ts';
import { addDrawJob, removeDawJob } from '../../draw/draw-scheduler.ts';
import { NURBSCurve } from '../../nurbs/NURBSCurve.ts';
import curveExamples from '../../nurbs/curve-examples.ts';
import { setCurve } from '../../nurbs/intersections.ts';
import { normalizeArray } from '../../utils.ts';
import { clearIntersectionPoints } from '../SideBar/Intersections.tsx';


interface Point {
  x: number;
  y: number;
  w: number;
}

interface Example {
  name: string;
  degree: number;
  controlPoints: Point[];
  knots: number[];
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
  showEvaluationPoint: boolean;
  setShowEvaluationPoint: (showEvaluationPoint: boolean) => void;
  evaluation: number;
  setEvaluation: (evaluation: number) => void;
  examples: Example[];
  loadExample: (example: Example) => void;
  clampedStart: boolean;
  clampedEnd: boolean;
  setClampedStart: (clampedStart: boolean) => void;
  setClampedEnd: (clampedEnd: boolean) => void;
}

export const CurveEditorContext = createContext<CurveEditorContextProps | undefined>(undefined);

export type CurveEditorProviderProps = {
  storeKey: string;
};

export const CurveEditorProvider: FC<PropsWithChildren & CurveEditorProviderProps> = ({ children, storeKey }) => {
  const examples = (curveExamples as any)[storeKey];
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
  const [showEvaluationPoint, setShowEvaluationPoint] = useState(false);
  const [evaluation, setEvaluation] = useState(0.5);
  const [clampedStart, setClampedStart] = useState(true);
  const [clampedEnd, setClampedEnd] = useState(true);

  const curve = useRef<NURBSCurve>();
  const drawFn = useRef<() => void>();
  const drawEvFn = useRef<() => void>();
  const loadExample = (example: Example) => {
    setDegree(example.degree);
    setControlPoints(example.controlPoints);
    setKnots(example.knots);
  };
  const knotsCount = controlPoints.length + degree + 1;

  const generateKnots = () => {
    let newKnots = normalizeArray(Array.from({ length: knotsCount }, (_, i) => i));

    if (clampedStart) {
      newKnots = [...new Array(degree + 1).fill(0), ...newKnots.slice(degree + 1)];
    }

    if (clampedEnd) {
      newKnots = [...newKnots.slice(0, knotsCount - degree - 1), ...new Array(degree + 1).fill(1)];
    }
    return newKnots;
  };

  const reDrawCurve = () => {
    if (drawFn.current) {
      removeDawJob(drawFn.current);
      clearIntersectionPoints();
    }

    curve.current = new NURBSCurve(
      degree,
      controlPoints.map(({ x, y }) => [x, y, 0]),
      controlPoints.map(({ w }) => w),
      degree + controlPoints.length + 1 !== knots.length ? generateKnots() : knots,
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

  const reDrawEvPoint = () => {
    if (drawEvFn.current) {
      removeDawJob(drawEvFn.current);
    }
    if (!showEvaluationPoint) {
      return;
    }
    drawEvFn.current = () => {
      if (!curve.current) {
        return;
      }
      const [x, y] = curve.current.evaluate(evaluation);
      drawOPoint(x, y, color);
    };
    addDrawJob(drawEvFn.current);
  };

  useEffect(() => {
    const newKnots = generateKnots();

    setKnots((knots) => {
      if (knots.length === newKnots.length) {
        return knots;
      }
      return newKnots;
    });
  }, [knotsCount, degree, clampedStart, clampedEnd]);

  useEffect(() => {
    reDrawCurve();
    store.set(storeKey, { color, showControlPoints, degree, controlPoints, knots });
  }, [color, showControlPoints, degree, controlPoints, knots]);

  useEffect(() => {
    reDrawEvPoint();
  }, [color, evaluation, showEvaluationPoint]);

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
        showEvaluationPoint,
        setShowEvaluationPoint,
        evaluation,
        setEvaluation,
        examples,
        loadExample,
        clampedStart,
        clampedEnd,
        setClampedStart,
        setClampedEnd,
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
