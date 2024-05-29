import { Accordion, Checkbox, Flex, NumberInput, Text } from '@mantine/core';
import { FC } from 'react';

import { useCurveEditorContext } from './CurveEditorContext.tsx';


export const Knots: FC = () => {
  const { degree, controlPoints, knots, setKnots, clampedStart, clampedEnd, setClampedStart, setClampedEnd } =
    useCurveEditorContext();

  const knotsCount = controlPoints.length + degree + 1;

  const handleKnotChange = (index: number, value: number) => {
    const newKnots = [...knots];
    newKnots[index] = value;
    setKnots(newKnots);
  };

  return (
    <Flex gap="xs" align="flex-start" direction="column">
      <Flex gap="xs">
        <b>Knot-ներ:</b> {knotsCount}
      </Flex>

      <Flex gap="xs" style={{ display: 'none' }}>
        <Checkbox
          size="xs"
          checked={clampedStart}
          onChange={(event) => setClampedStart(event.currentTarget.checked)}
          label="Clamped at start"
        />
        <Checkbox
          size="xs"
          checked={clampedEnd}
          onChange={(event) => setClampedEnd(event.currentTarget.checked)}
          label="Clamped at end"
        />
      </Flex>

      <Accordion w={250} variant="filled" chevronPosition="left">
        <Accordion.Item key="Knots" value="Knots">
          <Accordion.Control>Knot-ներ</Accordion.Control>
          <Accordion.Panel>
            <Flex gap="xs" align="flex-start" direction="column">
              {knots.map((knot, index) => (
                <Flex gap="xs" align="center" key={index}>
                  <Text miw={50} size="xs">
                    Knot {index + 1}
                  </Text>
                  <NumberInput
                    size="xs"
                    maw={80}
                    value={knot}
                    onChange={(value) => handleKnotChange(index, +value)}
                    min={0}
                    step={1}
                  />
                </Flex>
              ))}
            </Flex>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Flex>
  );
};
