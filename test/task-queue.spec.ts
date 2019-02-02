import { assert, expect } from 'chai';
import * as sinon from 'sinon';

import { TaskQueue } from '../index';

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
    const logger = {
      buffer: [],
      log(value) {
        logger.buffer.push(value);
      },
    };
    function syncTaskFactory(token): () => any {
      return function() {
        return logger.log(token);
      };
    }
    function asyncTaskFactory(token): () => any {
      return function() {
        return new Promise(resolve => {
          setTimeout(() => resolve(token), 10);
        }).then(t => {
          logger.log(t);
        });
      };
    }

    const queue = new TaskQueue();
    const length = 5;
    for (let token = 0; token < length; token++) {
      const factory = token % 2 === 0 ? syncTaskFactory : asyncTaskFactory;
      const task: () => any = factory(token);
      queue.push(task);
    }
    await queue.run();
    console.log('...');
    expect(logger.buffer).to.have.ordered.members([0, 1, 2, 3, 4]);
  });
});
