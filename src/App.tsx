import { Grid, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import { Canvas } from './components/Canvas.tsx';
import { CurveEditor } from './components/CurveEditor/CurveEditor.tsx';

export default function App() {
  return (
    <MantineProvider>
      <Grid p="md">
        <Grid.Col span={8}>
          <Canvas />
        </Grid.Col>
        <Grid.Col span={4}>
          <CurveEditor />
        </Grid.Col>
      </Grid>
    </MantineProvider>
  );
}
