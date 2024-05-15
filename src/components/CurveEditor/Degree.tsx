import { Flex, NumberInput } from '@mantine/core';
import { FC } from 'react';

import { useCurveEditorContext } from './CurveEditorContext.tsx';

export const Degree: FC = () => {
  const { degree, setDegree } = useCurveEditorContext();

  const onDegreeChange = (value: number | string) => {
    setDegree(Math.min(Number(value), 100));
  };

  return (
    <Flex gap="xs" align="center" direction="row">
      <b>Աստիճան:</b>
      <NumberInput maw={80} size="xs" leftSection="d" value={degree} onChange={onDegreeChange} min={1} max={10} />
    </Flex>
  );
};
