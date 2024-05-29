import { Button, Flex } from '@mantine/core';
import { FC } from 'react';

import { useCurveEditorContext } from './CurveEditorContext.tsx';


export const Examples: FC = () => {
  const { examples, loadExample } = useCurveEditorContext();

    console.log(examples);
    return (
    <Flex gap="xs" align="center" direction="row">
      <b>Օրինակներ:</b>
      <Button.Group>
        {examples.map((example, i) => (
          <Button
            key={i}
            size="xs"
            variant="default"
            onClick={() => {
              loadExample(example);
            }}
          >
            {example.name}
          </Button>
        ))}
      </Button.Group>
    </Flex>
  );
};
