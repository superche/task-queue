import { TaskEntry } from './task-entry';
import { TaskQueue } from './task-queue';
export declare class TaskScheduler {
    whenComplete: TaskEntry;
    private queue;
    private isPaused;
    constructor(queue: TaskQueue);
    tryToRun(): void;
    pause(): void;
    start(): void;
    resume(): void;
    private readonly isRunnable;
    private refreshWhenComplete;
}
