import { getCanvas } from './canvas-context.ts';

const jobs: Function[] = [];

export function addDrawJob(job: Function) {
  jobs.push(job);
}

export function removeDawJob(job: Function) {
  const index = jobs.indexOf(job);
  if (index !== -1) {
    jobs.splice(index, 1);
  }
}

export function runJobs() {
  jobs.forEach((job) => job());
}

const draw = () => {
  const { ctx, width, height } = getCanvas();
  requestAnimationFrame(draw);

  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, width, height);
  runJobs();
};

export const startDrawScheduler = () => {
  draw();
};
