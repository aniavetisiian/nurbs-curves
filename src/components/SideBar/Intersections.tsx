import { Button, Flex } from '@mantine/core';
import { FC, useRef, useState } from 'react';

import { drawXPoint } from '../../draw/draw-point.ts';
import { addDrawJob, removeDawJob } from '../../draw/draw-scheduler.ts';
import { IntersectionData, detectIntersections } from '../../nurbs/intersections.ts';

export const Intersections: FC = () => {
  const [data, setData] = useState<IntersectionData>();
  const drawFn = useRef<Function>();

  const handleDetectIntersections = () => {
    const intersectionData = detectIntersections();
    setData(intersectionData);
    if (drawFn.current) {
      removeDawJob(drawFn.current);
    }
    drawFn.current = () => {
      intersectionData.intersectionPoints.forEach((point) => {
        drawXPoint(point.x, point.y, '#D90012');
      });

      const colors = ['#0033A0', '#F2A800'];
      Object.values(intersectionData.selfIntersections).forEach((selfIntersection, i) => {
        selfIntersection.intersectionPoints.forEach((point) => {
          drawXPoint(point.x, point.y, colors[i]);
        });
      });
    };
    addDrawJob(drawFn.current);
  };

  return (
    <Flex gap="xs" mt="md" direction="column">
      <Flex gap="xs" align="center" direction="row">
        <Button size="xs" color="blue" variant="outline" onClick={handleDetectIntersections}>
          Detect intersections
        </Button>
      </Flex>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Flex>
  );
};
