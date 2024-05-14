import { getCanvas } from './canvas-context.ts';

const jobs: (() => void)[] = [];

export function addDrawJob(job: () => void) {
  jobs.push(job);
}

export function removeDawJob(job: () => void) {
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
