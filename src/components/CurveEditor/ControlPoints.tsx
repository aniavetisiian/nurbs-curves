import { ActionIcon, Flex } from '@mantine/core';
import { IconSquarePlus } from '@tabler/icons-react';
import { FC, useEffect } from 'react';

import { getCanvasDimensions } from '../../draw/canvas-context.ts';
import { randomInt } from '../../utils.tsx';
import { ControlPoint } from './ControlPoint.tsx';
import { useCurveEditorContext } from './CurveEditorContext.tsx';

const createControlPoint = () => {
  const { width, height } = getCanvasDimensions();
  const padding = 50;

  return {
    x: randomInt(padding, Math.max(width, 600) - padding),
    y: randomInt(padding, Math.max(height, 400) - padding),
    w: 1,
  };
};

export const ControlPoints: FC = () => {
  const { degree, controlPoints, setControlPoints } = useCurveEditorContext();

  const addPoint = () => {
    setControlPoints([...controlPoints, createControlPoint()]);
  };

  const removePoint = (index: number) => {
    setControlPoints(controlPoints.filter((_, i) => i !== index));
  };

  const handleXChange = (index: number, value: number) => {
    const newPoints = [...controlPoints];
    newPoints[index].x = value;
    setControlPoints(newPoints);
  };

  const handleYChange = (index: number, value: number) => {
    const newPoints = [...controlPoints];
    newPoints[index].y = value;
    setControlPoints(newPoints);
  };

  const handleWChange = (index: number, value: number) => {
    const newPoints = [...controlPoints];
    newPoints[index].w = value;
    setControlPoints(newPoints);
  };

  useEffect(() => {
    if (controlPoints.length < degree + 1) {
      setControlPoints([
        ...controlPoints,
        ...new Array(degree + 1 - controlPoints.length).fill(null).map(() => createControlPoint()),
      ]);
    }
  }, [degree]);

  return (
    <Flex gap="xs" align="flex-start" direction="column">
      <Flex gap="xs">
        <b>Control Points:</b> x, y, w
        <ActionIcon variant="subtle" aria-label="Add control point" onClick={addPoint}>
          <IconSquarePlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      </Flex>
      {controlPoints.map((point, index) => (
        <div key={index}>
          <ControlPoint
            index={index}
            x={point.x}
            y={point.y}
            w={point.w}
            onXChange={(value) => handleXChange(index, +value)}
            onYChange={(value) => handleYChange(index, +value)}
            onWChange={(value) => handleWChange(index, +value)}
            onRemove={() => removePoint(index)}
            disableRemove={controlPoints.length <= degree + 1}
          />
        </div>
      ))}
    </Flex>
  );
};
