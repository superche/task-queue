# Task Queue

> Another FIFO task queue

[![building](https://travis-ci.com/superche/task-queue.svg?branch=master)](https://travis-ci.com/superche/task-queue) [![codecov](https://codecov.io/gh/superche/task-queue/branch/master/graph/badge.svg)](https://codecov.io/gh/superche/task-queue)

## Install

NPM

```sh
npm install --save p-task-queue
```

Yarn

```sh
yarn add p-task-queue
```

## Usage

`demo/basic.js`

```js
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
```

## License

MIT
