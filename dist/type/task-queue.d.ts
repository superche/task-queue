import { TaskEntry } from './task-entry';
import { ITaskOptions } from './types';
export declare class TaskQueue {
    currentTask: TaskEntry;
    options: any;
    private queue;
    private scheduler;
    constructor(options?: any);
    push(task: () => any, options?: ITaskOptions): TaskEntry;
    cutIn(position: number, task: () => any, options?: ITaskOptions): TaskEntry;
    asap(task: () => any, options?: ITaskOptions): TaskEntry;
    run(): PromiseLike<any>;
    pause(): void;
    resume(): void;
    readonly whenComplete: TaskEntry;
    readonly size: number;
    protected next(): TaskEntry;
    private buildTaskEntry;
}
