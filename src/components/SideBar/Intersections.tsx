import { Button, Checkbox, Flex } from '@mantine/core';
import { FC, useEffect, useRef, useState } from 'react';

import { drawXPoint } from '../../draw/draw-point.ts';
import { addDrawJob, removeDawJob } from '../../draw/draw-scheduler.ts';
import { IntersectionData, detectIntersections } from '../../nurbs/intersections.ts';

export const Intersections: FC = () => {
  const [data, setData] = useState<IntersectionData>();
  const [showIntersectionPoints, setShowIntersectionPoints] = useState(true);
  const [showSelfIntersectionPoints, setShowSelfIntersectionPoints] = useState(true);
  const drawFn = useRef<Function>();

  const reDraw = (data: IntersectionData) => {
    if (drawFn.current) {
      removeDawJob(drawFn.current);
    }
    if (!data) {
      return;
    }
    drawFn.current = () => {
      if (showIntersectionPoints) {
        data.intersectionPoints.forEach((point) => {
          drawXPoint(point.x, point.y, '#D90012');
        });
      }
      if (showSelfIntersectionPoints) {
        const colors = ['#0033A0', '#F2A800'];
        Object.values(data.selfIntersections).forEach((selfIntersection, i) => {
          selfIntersection.intersectionPoints.forEach((point) => {
            drawXPoint(point.x, point.y, colors[i]);
          });
        });
      }
    };
    addDrawJob(drawFn.current);
  };

  const handleDetectIntersections = () => {
    const intersectionData = detectIntersections();
    setData(intersectionData);
    reDraw(intersectionData);
  };

  const handleClearIntersectionPoints = () => {
    if (drawFn.current) {
      removeDawJob(drawFn.current);
    }
  };

  useEffect(() => {
    reDraw(data!);
  }, [showIntersectionPoints, showSelfIntersectionPoints]);

  return (
    <Flex gap="xs" mt="md" direction="column">
      <Flex gap="xs" align="center" direction="row">
        <Button size="xs" color="blue" variant="outline" onClick={handleDetectIntersections}>
          Detect intersections
        </Button>
        <Button size="xs" color="gray" variant="outline" onClick={handleClearIntersectionPoints}>
          Clear points
        </Button>
      </Flex>

      <Flex gap="xs" align="center" direction="row">
        <Checkbox
          size="xs"
          checked={showIntersectionPoints}
          onChange={(event) => setShowIntersectionPoints(event.currentTarget.checked)}
          label="Show intersection points"
        />
        <Checkbox
          size="xs"
          checked={showSelfIntersectionPoints}
          onChange={(event) => setShowSelfIntersectionPoints(event.currentTarget.checked)}
          label="Show self intersection points"
        />
      </Flex>
      {!!data && (
        <Flex gap="xs" direction="column">
          <Flex gap="xs" align="center" direction="row">
            <b>Time spent:</b>
            <span>
              {(
                data.times.intersectionsDetectionTime +
                data.times.drawAllCurveTime +
                Object.values(data.selfIntersections).reduce(
                  (acc, item) => acc + item.selfIntersectionsDetectionTime + item.selfIntersectionCurveDrawingTime,
                  0,
                )
              ).toFixed(2)}{' '}
              ms
            </span>
          </Flex>
          <Flex gap="xs" align="center" direction="row">
            <small>intersections detections:</small>
            <small>{data.times.intersectionsDetectionTime.toFixed(2)} ms</small>
          </Flex>
          <Flex gap="xs" align="center" direction="row">
            <small>self intersections detections:</small>
            <small>
              {Object.values(data.selfIntersections)
                .reduce((acc, item) => acc + item.selfIntersectionsDetectionTime, 0)
                .toFixed(2)}{' '}
              ms
            </small>
          </Flex>
          <Flex gap="xs" align="center" direction="row">
            <small>drawing:</small>
            <small>
              {(
                data.times.drawAllCurveTime +
                Object.values(data.selfIntersections).reduce(
                  (acc, item) => acc + item.selfIntersectionCurveDrawingTime,
                  0,
                )
              ).toFixed(2)}{' '}
              ms
            </small>
          </Flex>
        </Flex>
      )}
      {!!data && (
        <Flex gap="xs" align="center" direction="row">
          <b>Intersections points:</b>
          <small>
            {data.intersectionPoints.length} / {data.detectedPointsCount}
          </small>
        </Flex>
      )}
      {!!data &&
        Object.entries(data.selfIntersections).map(([name, selfIntersection]) => (
          <Flex key={name} gap="xs" align="center" direction="row">
            <small>
              <b>Self intersections points [{name}]:</b>
            </small>
            <small>
              {selfIntersection.intersectionPoints.length} / {selfIntersection.detectedPointsCount}
            </small>
          </Flex>
        ))}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Flex>
  );
};
