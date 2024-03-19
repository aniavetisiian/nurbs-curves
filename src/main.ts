import './style.css'
import { setup } from './setup.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="canvas" width="600" height="400" ></canvas>
`

setup(document.querySelector<HTMLButtonElement>('#counter')!)
