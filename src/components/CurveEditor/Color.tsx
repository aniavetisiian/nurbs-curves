import { Checkbox, ColorInput, DEFAULT_THEME, Flex } from '@mantine/core';
import { FC } from 'react';

import { useCurveEditorContext } from './CurveEditorContext.tsx';

export const Color: FC = () => {
  const { color, setColor, showControlPoints, setShowControlPoints } = useCurveEditorContext();

  return (
    <Flex gap="xs" align="center" direction="row">
      <b>Գույն:</b>
      <ColorInput
        size="xs"
        w={120}
        value={color}
        onChange={setColor}
        disallowInput
        withPicker={false}
        swatchesPerRow={10}
        swatches={[
          ...DEFAULT_THEME.colors.yellow,
          ...DEFAULT_THEME.colors.grape,
          ...DEFAULT_THEME.colors.lime,
          ...DEFAULT_THEME.colors.indigo,
          ...DEFAULT_THEME.colors.teal,
          ...DEFAULT_THEME.colors.pink,
        ]}
      />
      <Checkbox
        size="xs"
        checked={showControlPoints}
        onChange={(event) => setShowControlPoints(event.currentTarget.checked)}
        label="Ցույց տալ կառավարող կետերը"
      />
    </Flex>
  );
};
