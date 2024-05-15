import { Paper, Tabs } from '@mantine/core';
import { FC } from 'react';

import { CurveEditor } from '../CurveEditor/CurveEditor.tsx';
import { Intersections } from './Intersections.tsx';

export const SideBar: FC = () => {
  return (
    <Paper p="xs" shadow="xs" mih="80vh">
      <Tabs variant="pills" defaultValue="curve1">
        <Tabs.List>
          <Tabs.Tab value="curve1">Կոր 1</Tabs.Tab>
          <Tabs.Tab value="curve2">Կոր 2</Tabs.Tab>
          <Tabs.Tab value="intersections">Հատումներ</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="curve1">
          <CurveEditor storeKey="curve1" />
        </Tabs.Panel>
        <Tabs.Panel value="curve2">
          <CurveEditor storeKey="curve2" />
        </Tabs.Panel>
        <Tabs.Panel value="intersections">
          <Intersections />
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};
