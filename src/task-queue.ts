import { TaskEntry } from './task-entry';
import { TaskScheduler } from './task-scheduler';
import {
  IInnerTaskOptions,
  ITaskOptions,
} from './types';

export class TaskQueue {
  public currentTask: TaskEntry;
  public options: any; // TODO: define TaskQueue options
  private queue: TaskEntry[] = [];
  private scheduler: TaskScheduler;

  constructor(options?) {
    const defaultOptions = {
      autoRun: true,
      logger: console,
    };
    this.options = {
      ...defaultOptions,
      ...options,
    };
    this.scheduler = new TaskScheduler(this);
  }

  public push(task: () => any, options?: ITaskOptions): TaskEntry {
    const taskEntry: TaskEntry = this.buildTaskEntry(task, options);
    this.queue.push(taskEntry);
    if (this.options.autoRun) {
      this.scheduler.tryToRun();
    }

    return taskEntry;
  }

  public cutIn(position: number, task: () => any, options?: ITaskOptions) {
    const taskEntry: TaskEntry = this.buildTaskEntry(task, options);
    this.queue.splice(position, 0, taskEntry);
    if (this.options.autoRun) {
      this.scheduler.tryToRun();
    }

    return taskEntry;
  }

  public asap(task: () => any, options?: ITaskOptions) {
    return this.cutIn(0, task, options);
  }

  public run(): PromiseLike<any> {
    this.scheduler.start();

    return this.scheduler.whenComplete;
  }

  public pause() {
    this.scheduler.pause();
  }

  public resume() {
    this.scheduler.resume();
  }

  public get whenComplete() {
    return this.scheduler.whenComplete;
  }

  public get size() {
    return this.queue.length;
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

  private buildTaskEntry(task: () => any, options?: ITaskOptions): TaskEntry {
    const defaultTaskOptions: IInnerTaskOptions = {
      args: [],
      callback: task,
    };
    return new TaskEntry({
      ...defaultTaskOptions,
      ...options,
    });
  }
}
