import {
  IInnerTaskOptions,
  ITaskEntry,
} from './types';

export class TaskEntry implements ITaskEntry {
  public args?: any[] = [];
  public then: (onfulfilled?: (value?: any) => any, onrejected?: (reason: any) => PromiseLike<never>) => Promise<any>;
  public catch: (onrejected?: (reason?: any) => PromiseLike<any>) => Promise<any>;

  private instance: Promise<any>;
  private resolve: (value?: any) => any;
  private reject: (reason?: any) => any;

  constructor(options: IInnerTaskOptions) {
    this.callback = options.callback;
    this.args = options.args || [];

    this.instance = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });

    this.then = (onFulfilled: (value?: any) => any, onRejected: (reason: any) => PromiseLike<never>) => {
      return this.instance.then(onFulfilled, onRejected);
    };
    this.catch = (onRejected: (reason?: any) => PromiseLike<never>) => {
      return this.instance.catch(onRejected);
    };
  }

  public get [Symbol.toStringTag]() {
    return '[object TaskEntry]';
  }
  public callback: (args?: any) => any = () => null;

  public execute(): TaskEntry {
    try {
      const output = this.callback(...this.args);
      switch (true) {
        case (output instanceof Promise || (output && typeof output.then === 'function')):
          // If `output` is an Promise (asynchronized)
          output
            .then((...values) => {
              this.resolve(...values);
            })
            .catch((...errors) => {
              this.reject(...errors);
            });
          break;
        // TODO: If `output` is an Observable (asynchronized)
        default:
          // If `output` is a synchronized result, resolve it;
          this.resolve(output);
      }
    } catch (error) {
      // Handle synchronized error
      this.reject(error);
    }
    return this;
  }
}
