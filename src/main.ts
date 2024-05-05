import { setup } from './setup.ts';
import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="canvas" ></canvas>
`;

setup(document.querySelector<HTMLButtonElement>('#counter')!);
