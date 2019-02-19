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

export enum QueueStatus {
  RUNNING,
  PAUSED,
  DONE,
}
