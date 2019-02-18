import { TaskEntry } from './task-entry';
import { ITaskOptions } from './types';
export declare class TaskQueue {
    currentTask: TaskEntry;
    options: any;
    private queue;
    private scheduler;
    private entireQueuePromise;
    constructor(options?: any);
    push(task: () => any, options?: ITaskOptions): TaskEntry;
    cutIn(position: number, task: () => any, options?: ITaskOptions): TaskEntry;
    asap(task: () => any, options?: ITaskOptions): TaskEntry;
    run(): PromiseLike<any>;
    readonly whenComplete: PromiseLike<any>;
    readonly size: number;
    readonly isRunnable: boolean;
    protected next(): TaskEntry;
    private buildTaskEntry;
}
