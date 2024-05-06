import { Box, Flex, NumberInput, Slider } from '@mantine/core';
import { FC, useState } from 'react';

export const DrawActions: FC = () => {
  const [value, setValue] = useState(0.5);

  return (
    <Flex gap="xs" align="center" direction="row">
      <Box>
        <small>Evaluate</small>
        <Flex gap="xs" align="center" direction="row">
          <Slider w={350} value={value} onChange={setValue} min={0} max={1} step={0.001} />
          <NumberInput maw={80} size="xs" value={value} onChange={(v) => setValue(+v)} min={0} max={1} step={0.001} />
        </Flex>
      </Box>
    </Flex>
  );
};
