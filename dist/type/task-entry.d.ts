import { IInnerTaskOptions, ITaskEntry } from './types';
export declare class TaskEntry implements ITaskEntry {
    args?: any[];
    then: (onfulfilled?: (value?: any) => any, onrejected?: (reason: any) => PromiseLike<never>) => Promise<any>;
    catch: (onrejected?: (reason?: any) => PromiseLike<any>) => Promise<any>;
    private instance;
    private resolve;
    private reject;
    constructor(options: IInnerTaskOptions);
    readonly [Symbol.toStringTag]: string;
    callback: (args?: any) => any;
    execute(): TaskEntry;
}
