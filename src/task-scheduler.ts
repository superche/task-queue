import {TaskEntry} from './task-entry';
import {TaskQueue} from './task-queue';
import {QueueStatus} from './types';

export class TaskScheduler {
  public whenComplete: TaskEntry;
  private queue: TaskQueue;
  private isPaused: boolean;

  constructor(queue: TaskQueue) {
    this.queue = queue;
    this.isPaused = queue.options.autoRun === false;
    this.refreshWhenComplete();
  }

  public tryToRun() {
    if (!this.isRunnable) {
      return;
    }
    const runningInstance = new Promise((resolve) => {
      const callNext = (function _callNext() {
        const currentTask = this.queue.next();
        if (currentTask === null) {
          resolve({ message: QueueStatus.DONE });
          return;
        }
        if (this.isPaused) {
          resolve({ message: QueueStatus.PAUSED });
          return;
        }
        currentTask
          .catch(() => []) // ignore error
          .then(callNext); // recursively call next
      }).bind(this);

      callNext();
    });

    runningInstance.then(({ message }) => {
      switch (message) {
        case QueueStatus.DONE:
          this.whenComplete.execute();
          this.refreshWhenComplete();
          break;
        case QueueStatus.PAUSED:
          // Do nothing
          break;
        default:
      }
    });
  }

  public pause() {
    this.isPaused = true;
  }

  public start() {
    this.isPaused = false;
    this.tryToRun();
  }

  public resume() {
    this.start();
  }

  private get isRunnable(): boolean {
    return !this.isPaused && this.queue.size > 0 && !this.queue.currentTask;
  }

  private refreshWhenComplete() {
    this.whenComplete = new TaskEntry({
      callback() {
        return true;
      },
    });
  }
}
