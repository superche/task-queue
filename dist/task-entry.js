"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TaskEntry = /** @class */ (function () {
    function TaskEntry(options) {
        var _this = this;
        this.args = [];
        this.callback = function () { return null; };
        this.callback = options.callback;
        this.args = options.args || [];
        this.instance = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
        this.then = function (onFulfilled, onRejected) {
            return _this.instance.then(onFulfilled, onRejected);
        };
        this.catch = function (onRejected) {
            return _this.instance.catch(onRejected);
        };
    }
    Object.defineProperty(TaskEntry.prototype, Symbol.toStringTag, {
        get: function () {
            return '[object TaskEntry]';
        },
        enumerable: true,
        configurable: true
    });
    TaskEntry.prototype.execute = function () {
        var _this = this;
        try {
            var output = this.callback.apply(this, this.args);
            switch (true) {
                case (output instanceof Promise || (output && typeof output.then === 'function')):
                    // If `output` is an Promise (asynchronized)
                    output
                        .then(function () {
                        var values = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            values[_i] = arguments[_i];
                        }
                        _this.resolve.apply(_this, values);
                    })
                        .catch(function () {
                        var errors = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            errors[_i] = arguments[_i];
                        }
                        _this.reject.apply(_this, errors);
                    });
                    break;
                // TODO: If `output` is an Observable (asynchronized)
                default:
                    // If `output` is a synchronized result, resolve it;
                    this.resolve(output);
            }
        }
        catch (error) {
            // Handle synchronized error
            this.reject(error);
        }
        return this;
    };
    return TaskEntry;
}());
exports.TaskEntry = TaskEntry;
//# sourceMappingURL=task-entry.js.map