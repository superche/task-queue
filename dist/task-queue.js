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
var TaskQueue = /** @class */ (function () {
    function TaskQueue(options) {
        this.queue = [];
        var defaultOptions = {
            logger: console,
        };
        this.options = __assign({}, defaultOptions, options);
    }
    TaskQueue.prototype.push = function (task, options) {
        var defaultTaskOptions = {
            args: [],
            callback: task,
        };
        var taskEntry = new task_entry_1.TaskEntry(__assign({}, defaultTaskOptions, options));
        this.queue.push(taskEntry);
        return taskEntry;
    };
    TaskQueue.prototype.run = function () {
        var _this = this;
        return new Promise(function (resolve) {
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
    };
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
    return TaskQueue;
}());
exports.TaskQueue = TaskQueue;
//# sourceMappingURL=task-queue.js.map