import { Flex } from '@mantine/core';
import { FC } from 'react';

import { Color } from './Color.tsx';
import { ControlPoints } from './ControlPoints.tsx';
import { CurveEditorProvider, CurveEditorProviderProps } from './CurveEditorContext.tsx';
import { Degree } from './Degree.tsx';
import { DrawActions } from './DrawActions.tsx';
import { Examples } from './Examples.tsx';
import { Knots } from './Knots.tsx';


export const CurveEditor: FC<CurveEditorProviderProps> = ({ storeKey }) => {
  return (
    <CurveEditorProvider storeKey={storeKey}>
      <Flex gap="md" p="sm" align="flex-start" justify="flex-start" direction="column">
        <Examples />
        <Color />
        <Degree />
        <ControlPoints />
        <Knots />
        <DrawActions />
      </Flex>
    </CurveEditorProvider>
  );
};
