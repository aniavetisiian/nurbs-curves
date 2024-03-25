import { setup } from './setup.ts';
import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="canvas" width="600" height="400" ></canvas>
`;

setup(document.querySelector<HTMLButtonElement>('#counter')!);
