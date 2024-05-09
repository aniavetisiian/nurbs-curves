import { Grid, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import { Canvas } from './components/Canvas.tsx';
import { SideBar } from './components/SideBar/SideBar.tsx';

export default function App() {
  return (
    <MantineProvider>
      <Grid p="md">
        <Grid.Col span={8}>
          <Canvas />
        </Grid.Col>
        <Grid.Col span={4}>
          <SideBar />
        </Grid.Col>
      </Grid>
    </MantineProvider>
  );
}
