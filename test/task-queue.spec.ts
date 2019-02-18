/* tslint:disable:no-console */
import { assert, expect } from 'chai';
import * as sinon from 'sinon';

import { TaskQueue } from '../index';

import { multiTaskHelper } from './utils/multiple-task-helper';

describe('TaskQueue', () => {
  it('should execute a task', async () => {
    const queue = new TaskQueue();
    const task = sinon.spy();
    const taskEntry = queue.push(task);
    queue.run();
    await taskEntry;
    console.log('...');
    assert(task.called);
  });

  it('should execute a task with args', async () => {
    const queue = new TaskQueue();
    const task = sinon.fake();
    const options = {
      args: [1, 2, 3],
    };
    const taskEntry = queue.push(task, options);
    queue.run();
    await taskEntry;
    console.log('...');
    assert(task.called);
    assert(task.calledWith(...options.args));
  });

  it('should execute a task without args', async () => {
    const queue = new TaskQueue();
    const task = sinon.fake();
    const taskEntry = queue.push(task);
    queue.run();
    await taskEntry;
    console.log('...');
    assert(task.called);
    assert(task.calledWith());
  });

  it('should execute multiple tasks', async () => {
    const { asyncTaskFactory, logger, syncTaskFactory } = multiTaskHelper();

    const queue = new TaskQueue();
    const length = 5;
    for (let token = 0; token < length; token++) {
      const factory = token % 2 === 0 ? syncTaskFactory : asyncTaskFactory;
      const task: () => any = factory(token);
      queue.push(task);
    }
    await queue.run();
    console.log('...');
    console.log(logger.buffer);
    expect(logger.buffer).to.have.ordered.members([0, 1, 2, 3, 4]);
  });

  it('should execute tasks ASAP', async () => {
    const { asyncTaskFactory, logger, syncTaskFactory } = multiTaskHelper();

    const queue = new TaskQueue();
    const length = 5;
    for (let token = 0; token < length; token++) {
      const factory = token % 3 === 0 ? syncTaskFactory : asyncTaskFactory;
      const task: () => any = factory(token);
      if (token % 2 === 0) {
        queue.push(task);
      } else {
        queue.asap(task);
      }
    }

    await queue.run();
    console.log('...');
    console.log(logger.buffer);
    expect(logger.buffer).to.have.ordered.members([3, 1, 0, 2, 4]);
  });
});
