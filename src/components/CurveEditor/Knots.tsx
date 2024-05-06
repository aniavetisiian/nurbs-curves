import { Accordion, Checkbox, Flex, NumberInput, Text } from '@mantine/core';
import { FC, useEffect, useState } from 'react';

import { useCurveEditorContext } from './CurveEditorContext.tsx';
import {normalizeArray} from "../../utils.tsx";


function generateKnots(degree: number, numControlPoints: number, knotType: 'clamped' | 'unclamped' = 'clamped'): number[] {
  const numKnots = numControlPoints + degree + 1;
  const knots: number[] = [];

  for (let i = 0; i < numKnots; i++) {
    if (i < degree) {
      knots.push(0);
    } else if (i >= numControlPoints) {
      knots.push(1);
    } else {
      const t = (i - degree) / (numControlPoints - degree);
      knots.push(knotType === 'unclamped' ? t : Math.floor(t));
    }
  }

  return knots;
}

export const Knots: FC = () => {
  const [clampedStart, setClampedStart] = useState(true);
  const [clampedEnd, setClampedEnd] = useState(true);
  const { degree, controlPoints, knots, setKnots } = useCurveEditorContext();

  const knotsCount = controlPoints.length + degree + 1;

  useEffect(() => {
    let newKnots = normalizeArray(Array.from({ length: knotsCount }, (_, i) => i));

    if (clampedStart) {
      newKnots = [...new Array(degree + 1).fill(0), ...newKnots.slice(degree + 1)];
    }

    if (clampedEnd) {
      newKnots = [
        ...newKnots.slice(0, knotsCount - degree - 1),
        ...new Array(degree + 1).fill(1),
      ];
    }

    setKnots(newKnots);
  }, [knotsCount, degree, clampedStart, clampedEnd]);

  const handleKnotChange = (index: number, value: number) => {
    const newKnots = [...knots];
    newKnots[index] = value;
    setKnots(newKnots);
  };

  return (
    <Flex gap="xs" align="flex-start" direction="column">
      <Flex gap="xs">
        <b>Knots:</b> {knotsCount}
      </Flex>

      <Flex gap="xs">
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
          <Accordion.Control>Knots</Accordion.Control>
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
