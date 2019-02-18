"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TaskScheduler = /** @class */ (function () {
    function TaskScheduler(queue) {
        this.queue = queue;
    }
    TaskScheduler.prototype.check = function () {
        var _a = this.queue, isRunnable = _a.isRunnable, options = _a.options;
        if (isRunnable && options.autoRun) {
            this.queue.run();
        }
    };
    return TaskScheduler;
}());
exports.TaskScheduler = TaskScheduler;
//# sourceMappingURL=task-scheduler.js.map