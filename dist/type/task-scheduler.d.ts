import { TaskQueue } from './task-queue';
export declare class TaskScheduler {
    private queue;
    constructor(queue: TaskQueue);
    check(): void;
}
