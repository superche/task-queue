import {TaskQueue} from './task-queue';

export class TaskScheduler {
  private queue: TaskQueue;

  constructor(queue: TaskQueue) {
    this.queue = queue;
  }

  public check() {
    const {isRunnable, options} = this.queue;

    if (isRunnable && options.autoRun) {
      this.queue.run();
    }
  }
}
