import { TaskEntry } from './task-entry';
import {
  IInnerTaskOptions,
  ITaskOptions,
} from './types';

export class TaskQueue {
  public currentTask: TaskEntry;
  private queue: TaskEntry[] = [];
  private options: any; // TODO: define TaskQueue options

  constructor(options?) {
    const defaultOptions = {
      logger: console,
    };
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  public push(task: () => any, options?: ITaskOptions): TaskEntry {
    const defaultTaskOptions: IInnerTaskOptions = {
      args: [],
      callback: task,
    };
    const taskEntry: TaskEntry = new TaskEntry({
      ...defaultTaskOptions,
      ...options,
    });
    this.queue.push(taskEntry);

    return taskEntry;
  }

  public run(): PromiseLike<any> {
    return new Promise((resolve) => {
      const callNext = (function _callNext() {
        const currentTask = this.next();
        if (currentTask === null) {
          resolve();
          return;
        }

        currentTask
          .catch(() => []) // ignore error
          .then(callNext); // recursively call next
      }).bind(this);

      callNext();
    });
  }

  protected next(): TaskEntry {
    if (!this.queue.length) {
      // All tasks have been executed.
      return null;
    }

    if (this.currentTask) {
      return this.currentTask;
    }

    this.currentTask = this.queue.shift();

    this.currentTask.execute()
      .then((...values) => {
        this.options.logger.debug('Task execute success');
      })
      .catch((...errors) => {
        this.options.logger.error(...errors);
      })
      .then(() => {
        this.currentTask = null;
      });

    return this.currentTask;
  }
}
