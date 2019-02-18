export function multiTaskHelper() {
  const logger = {
    buffer: [],
    log(value) {
      logger.buffer.push(value);
    },
  };
  function syncTaskFactory(token): () => any {
    return function syncTask() {
      return logger.log(token);
    };
  }
  function asyncTaskFactory(token): () => any {
    return function asyncTask() {
      return new Promise((resolve) => {
        setTimeout(() => resolve(token), 10);
      }).then((t) => {
        logger.log(t);
      });
    };
  }

  return {
    asyncTaskFactory,
    logger,
    syncTaskFactory,
  };
}
