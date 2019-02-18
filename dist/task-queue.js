"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var task_entry_1 = require("./task-entry");
var task_scheduler_1 = require("./task-scheduler");
var TaskQueue = /** @class */ (function () {
    function TaskQueue(options) {
        this.queue = [];
        var defaultOptions = {
            autoRun: true,
            logger: console,
        };
        this.options = __assign({}, defaultOptions, options);
        this.scheduler = new task_scheduler_1.TaskScheduler(this);
    }
    TaskQueue.prototype.push = function (task, options) {
        var taskEntry = this.buildTaskEntry(task, options);
        this.queue.push(taskEntry);
        this.scheduler.check();
        return taskEntry;
    };
    TaskQueue.prototype.cutIn = function (position, task, options) {
        var taskEntry = this.buildTaskEntry(task, options);
        this.queue.splice(position, 0, taskEntry);
        this.scheduler.check();
        return taskEntry;
    };
    TaskQueue.prototype.asap = function (task, options) {
        return this.cutIn(0, task, options);
    };
    TaskQueue.prototype.run = function () {
        var _this = this;
        this.entireQueuePromise = new Promise(function (resolve) {
            var callNext = (function _callNext() {
                var currentTask = this.next();
                if (currentTask === null) {
                    resolve();
                    return;
                }
                currentTask
                    .catch(function () { return []; }) // ignore error
                    .then(callNext); // recursively call next
            }).bind(_this);
            callNext();
        });
        return this.entireQueuePromise;
    };
    Object.defineProperty(TaskQueue.prototype, "whenComplete", {
        get: function () {
            return this.entireQueuePromise || Promise.resolve();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TaskQueue.prototype, "size", {
        get: function () {
            return this.queue.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TaskQueue.prototype, "isRunnable", {
        get: function () {
            return this.queue.length > 0 && !this.currentTask;
        },
        enumerable: true,
        configurable: true
    });
    TaskQueue.prototype.next = function () {
        var _this = this;
        if (!this.queue.length) {
            // All tasks have been executed.
            return null;
        }
        if (this.currentTask) {
            return this.currentTask;
        }
        this.currentTask = this.queue.shift();
        this.currentTask.execute()
            .then(function () {
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i] = arguments[_i];
            }
            _this.options.logger.debug('Task execute success');
        })
            .catch(function () {
            var errors = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                errors[_i] = arguments[_i];
            }
            var _a;
            (_a = _this.options.logger).error.apply(_a, errors);
        })
            .then(function () {
            _this.currentTask = null;
        });
        return this.currentTask;
    };
    TaskQueue.prototype.buildTaskEntry = function (task, options) {
        var defaultTaskOptions = {
            args: [],
            callback: task,
        };
        return new task_entry_1.TaskEntry(__assign({}, defaultTaskOptions, options));
    };
    return TaskQueue;
}());
exports.TaskQueue = TaskQueue;
//# sourceMappingURL=task-queue.js.map