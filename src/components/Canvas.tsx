import { Paper } from '@mantine/core';
import { useElementSize, useViewportSize } from '@mantine/hooks';
import { FC, useEffect, useRef } from 'react';

import { drawGraphPaper } from '../draw/draw-graph-paper.ts';
import { addDrawJob, removeDawJob, startDrawScheduler } from '../draw/draw-scheduler.ts';

export const Canvas: FC = () => {
  const { ref, width } = useElementSize();
  const { height } = useViewportSize();
  const drawFn = useRef<() => void>();

  useEffect(() => {
    if (drawFn.current) {
      removeDawJob(drawFn.current);
    }
    drawFn.current = () => {
      drawGraphPaper();
    };
    addDrawJob(drawFn.current);
    startDrawScheduler();
  }, []);

  return (
    <div ref={ref}>
      <Paper shadow="xs">
        <canvas id="canvas" width={width} height={height - 40} style={{ minHeight: '90vh' }}></canvas>
      </Paper>
    </div>
  );
};
