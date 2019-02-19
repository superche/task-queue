"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var task_entry_1 = require("./task-entry");
var types_1 = require("./types");
var TaskScheduler = /** @class */ (function () {
    function TaskScheduler(queue) {
        this.queue = queue;
        this.isPaused = queue.options.autoRun === false;
        this.refreshWhenComplete();
    }
    TaskScheduler.prototype.tryToRun = function () {
        var _this = this;
        if (!this.isRunnable) {
            return;
        }
        var runningInstance = new Promise(function (resolve) {
            var callNext = (function _callNext() {
                var currentTask = this.queue.next();
                if (currentTask === null) {
                    resolve({ message: types_1.QueueStatus.DONE });
                    return;
                }
                if (this.isPaused) {
                    resolve({ message: types_1.QueueStatus.PAUSED });
                    return;
                }
                currentTask
                    .catch(function () { return []; }) // ignore error
                    .then(callNext); // recursively call next
            }).bind(_this);
            callNext();
        });
        runningInstance.then(function (_a) {
            var message = _a.message;
            switch (message) {
                case types_1.QueueStatus.DONE:
                    _this.whenComplete.execute();
                    _this.refreshWhenComplete();
                    break;
                case types_1.QueueStatus.PAUSED:
                    // Do nothing
                    break;
                default:
            }
        });
    };
    TaskScheduler.prototype.pause = function () {
        this.isPaused = true;
    };
    TaskScheduler.prototype.start = function () {
        this.isPaused = false;
        this.tryToRun();
    };
    TaskScheduler.prototype.resume = function () {
        this.start();
    };
    Object.defineProperty(TaskScheduler.prototype, "isRunnable", {
        get: function () {
            return !this.isPaused && this.queue.size > 0 && !this.queue.currentTask;
        },
        enumerable: true,
        configurable: true
    });
    TaskScheduler.prototype.refreshWhenComplete = function () {
        this.whenComplete = new task_entry_1.TaskEntry({
            callback: function () {
                return true;
            },
        });
    };
    return TaskScheduler;
}());
exports.TaskScheduler = TaskScheduler;
//# sourceMappingURL=task-scheduler.js.map