export interface ITaskEntry extends Promise<any> {
    callback: (args?: any) => any;
    args?: any[];
    result?: any;
    error?: Error;
}
export interface ITaskOptions {
    args?: any[];
}
export interface IInnerTaskOptions extends ITaskOptions {
    callback: () => any;
}
export declare enum QueueStatus {
    RUNNING = 0,
    PAUSED = 1,
    DONE = 2
}
