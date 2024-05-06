import { Flex, Paper } from '@mantine/core';
import { FC } from 'react';

import { ControlPoints } from './ControlPoints.tsx';
import { CurveEditorProvider } from './CurveEditorContext.tsx';
import { Degree } from './Degree.tsx';
import { DrawActions } from './DrawActions.tsx';
import { Knots } from './Knots.tsx';

export const CurveEditor: FC = () => {
  return (
    <CurveEditorProvider>
      <Paper shadow="xs" mih="80vh">
        <Flex gap="md" p="sm" align="flex-start" justify="flex-start" direction="column">
          <Degree />
          <ControlPoints />
          <Knots />
          <DrawActions />
        </Flex>
      </Paper>
    </CurveEditorProvider>
  );
};
