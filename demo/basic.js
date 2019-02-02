const { TaskQueue } = require('../index');

const queue = new TaskQueue();
const syncTask = function syncTaskDemo() {
  return 'A sync task';
};
const asyncTask = function asyncTaskDemo() {
  return Promise.resolve('An async task');
};

const syncTaskEntry = queue.push(syncTask);
const asyncTaskEntry = queue.push(asyncTask);

// subscribe output
syncTaskEntry.then(output => console.log('[sync task]', output));
asyncTaskEntry.then(output => console.log('[async task]', output));

queue.run() // trigger task queue
.then(() => console.log('[all tasks have been done]')); // subscribe entire queue
