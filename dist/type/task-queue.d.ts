import { TaskEntry } from './task-entry';
import { ITaskOptions } from './types';
export declare class TaskQueue {
    currentTask: TaskEntry;
    private queue;
    private options;
    constructor(options?: any);
    push(task: () => any, options?: ITaskOptions): TaskEntry;
    cutIn(position: number, task: () => any, options?: ITaskOptions): TaskEntry;
    asap(task: () => any, options?: ITaskOptions): TaskEntry;
    run(): PromiseLike<any>;
    protected next(): TaskEntry;
    private buildTaskEntry;
}
