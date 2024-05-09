import { Box, Checkbox, Flex, NumberInput, Slider } from '@mantine/core';
import { FC } from 'react';

import { useCurveEditorContext } from './CurveEditorContext.tsx';

export const DrawActions: FC = () => {
  const { evaluation, showEvaluationPoint, setEvaluation, setShowEvaluationPoint } = useCurveEditorContext();

  return (
    <Flex gap="xs" align="center" direction="row">
      <Box>
        <Flex gap="xs" align="center" direction="row">
          <small>Evaluate</small>
          <Checkbox
            size="xs"
            checked={showEvaluationPoint}
            onChange={(event) => setShowEvaluationPoint(event.currentTarget.checked)}
            label="Show"
          />
        </Flex>
        <Flex gap="xs" align="center" direction="row">
          <Slider w={350} value={evaluation} onChange={setEvaluation} min={0} max={1} step={0.001} />
          <NumberInput
            maw={80}
            size="xs"
            value={evaluation}
            onChange={(v) => setEvaluation(+v)}
            min={0}
            max={1}
            step={0.001}
          />
        </Flex>
      </Box>
    </Flex>
  );
};
