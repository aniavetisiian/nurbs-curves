import { Paper } from '@mantine/core';
import { useElementSize, useViewportSize } from '@mantine/hooks';
import { FC, useEffect } from 'react';

import { startDrawScheduler } from '../draw/draw-scheduler.ts';

export const Canvas: FC = () => {
  const { ref, width } = useElementSize();
  const { height } = useViewportSize();

  useEffect(() => {
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
