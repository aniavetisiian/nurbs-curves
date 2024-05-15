import { ActionIcon, Flex, NumberInput, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { FC } from 'react';

interface PointRowProps {
  index: number;
  x: number;
  y: number;
  w: number;
  onXChange: (value: number | string) => void;
  onYChange: (value: number | string) => void;
  onWChange: (value: number | string) => void;
  onRemove: () => void;
  disableRemove?: boolean;
}

export const ControlPoint: FC<PointRowProps> = ({
  index,
  x,
  y,
  w,
  onXChange,
  onYChange,
  onWChange,
  onRemove,
  disableRemove,
}) => {
  return (
    <Flex gap="xs" align="center">
      <Text miw={50} size="xs">
        Կետ {index + 1}
      </Text>
      <NumberInput maw={80} size="xs" leftSection="x" value={x} onChange={onXChange} />
      <NumberInput maw={80} size="xs" leftSection="y" value={y} onChange={onYChange} />
      <NumberInput maw={80} size="xs" leftSection="w" value={w} onChange={onWChange} min={0} />
      <ActionIcon variant="subtle" aria-label="Remove" onClick={onRemove} color="gray" disabled={disableRemove}>
        <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>
    </Flex>
  );
};
