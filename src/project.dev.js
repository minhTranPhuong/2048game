window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  1: [ function(require, module, exports) {
    function EventEmitter() {
      this._events = this._events || {};
      this._maxListeners = this._maxListeners || void 0;
    }
    module.exports = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._maxListeners = void 0;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function(n) {
      if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
      this._maxListeners = n;
      return this;
    };
    EventEmitter.prototype.emit = function(type) {
      var er, handler, len, args, i, listeners;
      this._events || (this._events = {});
      if ("error" === type && (!this._events.error || isObject(this._events.error) && !this._events.error.length)) {
        er = arguments[1];
        if (er instanceof Error) throw er;
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
        err.context = er;
        throw err;
      }
      handler = this._events[type];
      if (isUndefined(handler)) return false;
      if (isFunction(handler)) switch (arguments.length) {
       case 1:
        handler.call(this);
        break;

       case 2:
        handler.call(this, arguments[1]);
        break;

       case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;

       default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
      } else if (isObject(handler)) {
        args = Array.prototype.slice.call(arguments, 1);
        listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++) listeners[i].apply(this, args);
      }
      return true;
    };
    EventEmitter.prototype.addListener = function(type, listener) {
      var m;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      this._events || (this._events = {});
      this._events.newListener && this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
      this._events[type] ? isObject(this._events[type]) ? this._events[type].push(listener) : this._events[type] = [ this._events[type], listener ] : this._events[type] = listener;
      if (isObject(this._events[type]) && !this._events[type].warned) {
        m = isUndefined(this._maxListeners) ? EventEmitter.defaultMaxListeners : this._maxListeners;
        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
          "function" === typeof console.trace && console.trace();
        }
      }
      return this;
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.once = function(type, listener) {
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      var fired = false;
      function g() {
        this.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(this, arguments);
        }
      }
      g.listener = listener;
      this.on(type, g);
      return this;
    };
    EventEmitter.prototype.removeListener = function(type, listener) {
      var list, position, length, i;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      if (!this._events || !this._events[type]) return this;
      list = this._events[type];
      length = list.length;
      position = -1;
      if (list === listener || isFunction(list.listener) && list.listener === listener) {
        delete this._events[type];
        this._events.removeListener && this.emit("removeListener", type, listener);
      } else if (isObject(list)) {
        for (i = length; i-- > 0; ) if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          position = i;
          break;
        }
        if (position < 0) return this;
        if (1 === list.length) {
          list.length = 0;
          delete this._events[type];
        } else list.splice(position, 1);
        this._events.removeListener && this.emit("removeListener", type, listener);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function(type) {
      var key, listeners;
      if (!this._events) return this;
      if (!this._events.removeListener) {
        0 === arguments.length ? this._events = {} : this._events[type] && delete this._events[type];
        return this;
      }
      if (0 === arguments.length) {
        for (key in this._events) {
          if ("removeListener" === key) continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = {};
        return this;
      }
      listeners = this._events[type];
      if (isFunction(listeners)) this.removeListener(type, listeners); else if (listeners) while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
      delete this._events[type];
      return this;
    };
    EventEmitter.prototype.listeners = function(type) {
      var ret;
      ret = this._events && this._events[type] ? isFunction(this._events[type]) ? [ this._events[type] ] : this._events[type].slice() : [];
      return ret;
    };
    EventEmitter.prototype.listenerCount = function(type) {
      if (this._events) {
        var evlistener = this._events[type];
        if (isFunction(evlistener)) return 1;
        if (evlistener) return evlistener.length;
      }
      return 0;
    };
    EventEmitter.listenerCount = function(emitter, type) {
      return emitter.listenerCount(type);
    };
    function isFunction(arg) {
      return "function" === typeof arg;
    }
    function isNumber(arg) {
      return "number" === typeof arg;
    }
    function isObject(arg) {
      return "object" === typeof arg && null !== arg;
    }
    function isUndefined(arg) {
      return void 0 === arg;
    }
  }, {} ],
  2: [ function(require, module, exports) {
    var process = module.exports = {};
    var cachedSetTimeout;
    var cachedClearTimeout;
    function defaultSetTimout() {
      throw new Error("setTimeout has not been defined");
    }
    function defaultClearTimeout() {
      throw new Error("clearTimeout has not been defined");
    }
    (function() {
      try {
        cachedSetTimeout = "function" === typeof setTimeout ? setTimeout : defaultSetTimout;
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }
      try {
        cachedClearTimeout = "function" === typeof clearTimeout ? clearTimeout : defaultClearTimeout;
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    })();
    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }
      try {
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
          return cachedSetTimeout.call(this, fun, 0);
        }
      }
    }
    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }
      try {
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          return cachedClearTimeout.call(null, marker);
        } catch (e) {
          return cachedClearTimeout.call(this, marker);
        }
      }
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;
    function cleanUpNextTick() {
      if (!draining || !currentQueue) return;
      draining = false;
      currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1;
      queue.length && drainQueue();
    }
    function drainQueue() {
      if (draining) return;
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;
      var len = queue.length;
      while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) currentQueue && currentQueue[queueIndex].run();
        queueIndex = -1;
        len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
    }
    process.nextTick = function(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
      queue.push(new Item(fun, args));
      1 !== queue.length || draining || runTimeout(drainQueue);
    };
    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    process.title = "browser";
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = "";
    process.versions = {};
    function noop() {}
    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;
    process.listeners = function(name) {
      return [];
    };
    process.binding = function(name) {
      throw new Error("process.binding is not supported");
    };
    process.cwd = function() {
      return "/";
    };
    process.chdir = function(dir) {
      throw new Error("process.chdir is not supported");
    };
    process.umask = function() {
      return 0;
    };
  }, {} ],
  3: [ function(require, module, exports) {
    (function(process) {
      (function(global, factory) {
        "object" === typeof exports && "undefined" !== typeof module ? factory(exports) : "function" === typeof define && define.amd ? define([ "exports" ], factory) : factory(global.async = {});
      })(this, function(exports) {
        "use strict";
        function apply(fn, ...args) {
          return (...callArgs) => fn(...args, ...callArgs);
        }
        function initialParams(fn) {
          return function(...args) {
            var callback = args.pop();
            return fn.call(this, args, callback);
          };
        }
        var hasQueueMicrotask = "function" === typeof queueMicrotask && queueMicrotask;
        var hasSetImmediate = "function" === typeof setImmediate && setImmediate;
        var hasNextTick = "object" === typeof process && "function" === typeof process.nextTick;
        function fallback(fn) {
          setTimeout(fn, 0);
        }
        function wrap(defer) {
          return (fn, ...args) => defer(() => fn(...args));
        }
        var _defer;
        _defer = hasQueueMicrotask ? queueMicrotask : hasSetImmediate ? setImmediate : hasNextTick ? process.nextTick : fallback;
        var setImmediate$1 = wrap(_defer);
        function asyncify(func) {
          if (isAsync(func)) return function(...args) {
            const callback = args.pop();
            const promise = func.apply(this, args);
            return handlePromise(promise, callback);
          };
          return initialParams(function(args, callback) {
            var result;
            try {
              result = func.apply(this, args);
            } catch (e) {
              return callback(e);
            }
            if (result && "function" === typeof result.then) return handlePromise(result, callback);
            callback(null, result);
          });
        }
        function handlePromise(promise, callback) {
          return promise.then(value => {
            invokeCallback(callback, null, value);
          }, err => {
            invokeCallback(callback, err && err.message ? err : new Error(err));
          });
        }
        function invokeCallback(callback, error, value) {
          try {
            callback(error, value);
          } catch (err) {
            setImmediate$1(e => {
              throw e;
            }, err);
          }
        }
        function isAsync(fn) {
          return "AsyncFunction" === fn[Symbol.toStringTag];
        }
        function isAsyncGenerator(fn) {
          return "AsyncGenerator" === fn[Symbol.toStringTag];
        }
        function isAsyncIterable(obj) {
          return "function" === typeof obj[Symbol.asyncIterator];
        }
        function wrapAsync(asyncFn) {
          if ("function" !== typeof asyncFn) throw new Error("expected a function");
          return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
        }
        function awaitify(asyncFn, arity = asyncFn.length) {
          if (!arity) throw new Error("arity is undefined");
          function awaitable(...args) {
            if ("function" === typeof args[arity - 1]) return asyncFn.apply(this, args);
            return new Promise((resolve, reject) => {
              args[arity - 1] = ((err, ...cbArgs) => {
                if (err) return reject(err);
                resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0]);
              });
              asyncFn.apply(this, args);
            });
          }
          return awaitable;
        }
        function applyEach(eachfn) {
          return function applyEach(fns, ...callArgs) {
            const go = awaitify(function(callback) {
              var that = this;
              return eachfn(fns, (fn, cb) => {
                wrapAsync(fn).apply(that, callArgs.concat(cb));
              }, callback);
            });
            return go;
          };
        }
        function _asyncMap(eachfn, arr, iteratee, callback) {
          arr = arr || [];
          var results = [];
          var counter = 0;
          var _iteratee = wrapAsync(iteratee);
          return eachfn(arr, (value, _, iterCb) => {
            var index = counter++;
            _iteratee(value, (err, v) => {
              results[index] = v;
              iterCb(err);
            });
          }, err => {
            callback(err, results);
          });
        }
        function isArrayLike(value) {
          return value && "number" === typeof value.length && value.length >= 0 && value.length % 1 === 0;
        }
        const breakLoop = {};
        function once(fn) {
          function wrapper(...args) {
            if (null === fn) return;
            var callFn = fn;
            fn = null;
            callFn.apply(this, args);
          }
          Object.assign(wrapper, fn);
          return wrapper;
        }
        function getIterator(coll) {
          return coll[Symbol.iterator] && coll[Symbol.iterator]();
        }
        function createArrayIterator(coll) {
          var i = -1;
          var len = coll.length;
          return function next() {
            return ++i < len ? {
              value: coll[i],
              key: i
            } : null;
          };
        }
        function createES2015Iterator(iterator) {
          var i = -1;
          return function next() {
            var item = iterator.next();
            if (item.done) return null;
            i++;
            return {
              value: item.value,
              key: i
            };
          };
        }
        function createObjectIterator(obj) {
          var okeys = obj ? Object.keys(obj) : [];
          var i = -1;
          var len = okeys.length;
          return function next() {
            var key = okeys[++i];
            if ("__proto__" === key) return next();
            return i < len ? {
              value: obj[key],
              key: key
            } : null;
          };
        }
        function createIterator(coll) {
          if (isArrayLike(coll)) return createArrayIterator(coll);
          var iterator = getIterator(coll);
          return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
        }
        function onlyOnce(fn) {
          return function(...args) {
            if (null === fn) throw new Error("Callback was already called.");
            var callFn = fn;
            fn = null;
            callFn.apply(this, args);
          };
        }
        function asyncEachOfLimit(generator, limit, iteratee, callback) {
          let done = false;
          let canceled = false;
          let awaiting = false;
          let running = 0;
          let idx = 0;
          function replenish() {
            if (running >= limit || awaiting || done) return;
            awaiting = true;
            generator.next().then(({value: value, done: iterDone}) => {
              if (canceled || done) return;
              awaiting = false;
              if (iterDone) {
                done = true;
                running <= 0 && callback(null);
                return;
              }
              running++;
              iteratee(value, idx, iterateeCallback);
              idx++;
              replenish();
            }).catch(handleError);
          }
          function iterateeCallback(err, result) {
            running -= 1;
            if (canceled) return;
            if (err) return handleError(err);
            if (false === err) {
              done = true;
              canceled = true;
              return;
            }
            if (result === breakLoop || done && running <= 0) {
              done = true;
              return callback(null);
            }
            replenish();
          }
          function handleError(err) {
            if (canceled) return;
            awaiting = false;
            done = true;
            callback(err);
          }
          replenish();
        }
        var eachOfLimit = limit => (obj, iteratee, callback) => {
          callback = once(callback);
          if (limit <= 0) throw new RangeError("concurrency limit cannot be less than 1");
          if (!obj) return callback(null);
          if (isAsyncGenerator(obj)) return asyncEachOfLimit(obj, limit, iteratee, callback);
          if (isAsyncIterable(obj)) return asyncEachOfLimit(obj[Symbol.asyncIterator](), limit, iteratee, callback);
          var nextElem = createIterator(obj);
          var done = false;
          var canceled = false;
          var running = 0;
          var looping = false;
          function iterateeCallback(err, value) {
            if (canceled) return;
            running -= 1;
            if (err) {
              done = true;
              callback(err);
            } else if (false === err) {
              done = true;
              canceled = true;
            } else {
              if (value === breakLoop || done && running <= 0) {
                done = true;
                return callback(null);
              }
              looping || replenish();
            }
          }
          function replenish() {
            looping = true;
            while (running < limit && !done) {
              var elem = nextElem();
              if (null === elem) {
                done = true;
                running <= 0 && callback(null);
                return;
              }
              running += 1;
              iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
            }
            looping = false;
          }
          replenish();
        };
        function eachOfLimit$1(coll, limit, iteratee, callback) {
          return eachOfLimit(limit)(coll, wrapAsync(iteratee), callback);
        }
        var eachOfLimit$2 = awaitify(eachOfLimit$1, 4);
        function eachOfArrayLike(coll, iteratee, callback) {
          callback = once(callback);
          var index = 0, completed = 0, {length: length} = coll, canceled = false;
          0 === length && callback(null);
          function iteratorCallback(err, value) {
            false === err && (canceled = true);
            if (true === canceled) return;
            err ? callback(err) : ++completed !== length && value !== breakLoop || callback(null);
          }
          for (;index < length; index++) iteratee(coll[index], index, onlyOnce(iteratorCallback));
        }
        function eachOfGeneric(coll, iteratee, callback) {
          return eachOfLimit$2(coll, Infinity, iteratee, callback);
        }
        function eachOf(coll, iteratee, callback) {
          var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
          return eachOfImplementation(coll, wrapAsync(iteratee), callback);
        }
        var eachOf$1 = awaitify(eachOf, 3);
        function map(coll, iteratee, callback) {
          return _asyncMap(eachOf$1, coll, iteratee, callback);
        }
        var map$1 = awaitify(map, 3);
        var applyEach$1 = applyEach(map$1);
        function eachOfSeries(coll, iteratee, callback) {
          return eachOfLimit$2(coll, 1, iteratee, callback);
        }
        var eachOfSeries$1 = awaitify(eachOfSeries, 3);
        function mapSeries(coll, iteratee, callback) {
          return _asyncMap(eachOfSeries$1, coll, iteratee, callback);
        }
        var mapSeries$1 = awaitify(mapSeries, 3);
        var applyEachSeries = applyEach(mapSeries$1);
        const PROMISE_SYMBOL = Symbol("promiseCallback");
        function promiseCallback() {
          let resolve, reject;
          function callback(err, ...args) {
            if (err) return reject(err);
            resolve(args.length > 1 ? args : args[0]);
          }
          callback[PROMISE_SYMBOL] = new Promise((res, rej) => {
            resolve = res, reject = rej;
          });
          return callback;
        }
        function auto(tasks, concurrency, callback) {
          if ("number" !== typeof concurrency) {
            callback = concurrency;
            concurrency = null;
          }
          callback = once(callback || promiseCallback());
          var numTasks = Object.keys(tasks).length;
          if (!numTasks) return callback(null);
          concurrency || (concurrency = numTasks);
          var results = {};
          var runningTasks = 0;
          var canceled = false;
          var hasError = false;
          var listeners = Object.create(null);
          var readyTasks = [];
          var readyToCheck = [];
          var uncheckedDependencies = {};
          Object.keys(tasks).forEach(key => {
            var task = tasks[key];
            if (!Array.isArray(task)) {
              enqueueTask(key, [ task ]);
              readyToCheck.push(key);
              return;
            }
            var dependencies = task.slice(0, task.length - 1);
            var remainingDependencies = dependencies.length;
            if (0 === remainingDependencies) {
              enqueueTask(key, task);
              readyToCheck.push(key);
              return;
            }
            uncheckedDependencies[key] = remainingDependencies;
            dependencies.forEach(dependencyName => {
              if (!tasks[dependencyName]) throw new Error("async.auto task `" + key + "` has a non-existent dependency `" + dependencyName + "` in " + dependencies.join(", "));
              addListener(dependencyName, () => {
                remainingDependencies--;
                0 === remainingDependencies && enqueueTask(key, task);
              });
            });
          });
          checkForDeadlocks();
          processQueue();
          function enqueueTask(key, task) {
            readyTasks.push(() => runTask(key, task));
          }
          function processQueue() {
            if (canceled) return;
            if (0 === readyTasks.length && 0 === runningTasks) return callback(null, results);
            while (readyTasks.length && runningTasks < concurrency) {
              var run = readyTasks.shift();
              run();
            }
          }
          function addListener(taskName, fn) {
            var taskListeners = listeners[taskName];
            taskListeners || (taskListeners = listeners[taskName] = []);
            taskListeners.push(fn);
          }
          function taskComplete(taskName) {
            var taskListeners = listeners[taskName] || [];
            taskListeners.forEach(fn => fn());
            processQueue();
          }
          function runTask(key, task) {
            if (hasError) return;
            var taskCallback = onlyOnce((err, ...result) => {
              runningTasks--;
              if (false === err) {
                canceled = true;
                return;
              }
              result.length < 2 && ([result] = result);
              if (err) {
                var safeResults = {};
                Object.keys(results).forEach(rkey => {
                  safeResults[rkey] = results[rkey];
                });
                safeResults[key] = result;
                hasError = true;
                listeners = Object.create(null);
                if (canceled) return;
                callback(err, safeResults);
              } else {
                results[key] = result;
                taskComplete(key);
              }
            });
            runningTasks++;
            var taskFn = wrapAsync(task[task.length - 1]);
            task.length > 1 ? taskFn(results, taskCallback) : taskFn(taskCallback);
          }
          function checkForDeadlocks() {
            var currentTask;
            var counter = 0;
            while (readyToCheck.length) {
              currentTask = readyToCheck.pop();
              counter++;
              getDependents(currentTask).forEach(dependent => {
                0 === --uncheckedDependencies[dependent] && readyToCheck.push(dependent);
              });
            }
            if (counter !== numTasks) throw new Error("async.auto cannot execute tasks due to a recursive dependency");
          }
          function getDependents(taskName) {
            var result = [];
            Object.keys(tasks).forEach(key => {
              const task = tasks[key];
              Array.isArray(task) && task.indexOf(taskName) >= 0 && result.push(key);
            });
            return result;
          }
          return callback[PROMISE_SYMBOL];
        }
        var FN_ARGS = /^(?:async\s+)?(?:function)?\s*\w*\s*\(\s*([^)]+)\s*\)(?:\s*{)/;
        var ARROW_FN_ARGS = /^(?:async\s+)?\(?\s*([^)=]+)\s*\)?(?:\s*=>)/;
        var FN_ARG_SPLIT = /,/;
        var FN_ARG = /(=.+)?(\s*)$/;
        function stripComments(string) {
          let stripped = "";
          let index = 0;
          let endBlockComment = string.indexOf("*/");
          while (index < string.length) if ("/" === string[index] && "/" === string[index + 1]) {
            let endIndex = string.indexOf("\n", index);
            index = -1 === endIndex ? string.length : endIndex;
          } else if (-1 !== endBlockComment && "/" === string[index] && "*" === string[index + 1]) {
            let endIndex = string.indexOf("*/", index);
            if (-1 !== endIndex) {
              index = endIndex + 2;
              endBlockComment = string.indexOf("*/", index);
            } else {
              stripped += string[index];
              index++;
            }
          } else {
            stripped += string[index];
            index++;
          }
          return stripped;
        }
        function parseParams(func) {
          const src = stripComments(func.toString());
          let match = src.match(FN_ARGS);
          match || (match = src.match(ARROW_FN_ARGS));
          if (!match) throw new Error("could not parse args in autoInject\nSource:\n" + src);
          let [, args] = match;
          return args.replace(/\s/g, "").split(FN_ARG_SPLIT).map(arg => arg.replace(FN_ARG, "").trim());
        }
        function autoInject(tasks, callback) {
          var newTasks = {};
          Object.keys(tasks).forEach(key => {
            var taskFn = tasks[key];
            var params;
            var fnIsAsync = isAsync(taskFn);
            var hasNoDeps = !fnIsAsync && 1 === taskFn.length || fnIsAsync && 0 === taskFn.length;
            if (Array.isArray(taskFn)) {
              params = [ ...taskFn ];
              taskFn = params.pop();
              newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
            } else if (hasNoDeps) newTasks[key] = taskFn; else {
              params = parseParams(taskFn);
              if (0 === taskFn.length && !fnIsAsync && 0 === params.length) throw new Error("autoInject task functions require explicit parameters.");
              fnIsAsync || params.pop();
              newTasks[key] = params.concat(newTask);
            }
            function newTask(results, taskCb) {
              var newArgs = params.map(name => results[name]);
              newArgs.push(taskCb);
              wrapAsync(taskFn)(...newArgs);
            }
          });
          return auto(newTasks, callback);
        }
        class DLL {
          constructor() {
            this.head = this.tail = null;
            this.length = 0;
          }
          removeLink(node) {
            node.prev ? node.prev.next = node.next : this.head = node.next;
            node.next ? node.next.prev = node.prev : this.tail = node.prev;
            node.prev = node.next = null;
            this.length -= 1;
            return node;
          }
          empty() {
            while (this.head) this.shift();
            return this;
          }
          insertAfter(node, newNode) {
            newNode.prev = node;
            newNode.next = node.next;
            node.next ? node.next.prev = newNode : this.tail = newNode;
            node.next = newNode;
            this.length += 1;
          }
          insertBefore(node, newNode) {
            newNode.prev = node.prev;
            newNode.next = node;
            node.prev ? node.prev.next = newNode : this.head = newNode;
            node.prev = newNode;
            this.length += 1;
          }
          unshift(node) {
            this.head ? this.insertBefore(this.head, node) : setInitial(this, node);
          }
          push(node) {
            this.tail ? this.insertAfter(this.tail, node) : setInitial(this, node);
          }
          shift() {
            return this.head && this.removeLink(this.head);
          }
          pop() {
            return this.tail && this.removeLink(this.tail);
          }
          toArray() {
            return [ ...this ];
          }
          * [Symbol.iterator]() {
            var cur = this.head;
            while (cur) {
              yield cur.data;
              cur = cur.next;
            }
          }
          remove(testFn) {
            var curr = this.head;
            while (curr) {
              var {next: next} = curr;
              testFn(curr) && this.removeLink(curr);
              curr = next;
            }
            return this;
          }
        }
        function setInitial(dll, node) {
          dll.length = 1;
          dll.head = dll.tail = node;
        }
        function queue(worker, concurrency, payload) {
          if (null == concurrency) concurrency = 1; else if (0 === concurrency) throw new RangeError("Concurrency must not be zero");
          var _worker = wrapAsync(worker);
          var numRunning = 0;
          var workersList = [];
          const events = {
            error: [],
            drain: [],
            saturated: [],
            unsaturated: [],
            empty: []
          };
          function on(event, handler) {
            events[event].push(handler);
          }
          function once(event, handler) {
            const handleAndRemove = (...args) => {
              off(event, handleAndRemove);
              handler(...args);
            };
            events[event].push(handleAndRemove);
          }
          function off(event, handler) {
            if (!event) return Object.keys(events).forEach(ev => events[ev] = []);
            if (!handler) return events[event] = [];
            events[event] = events[event].filter(ev => ev !== handler);
          }
          function trigger(event, ...args) {
            events[event].forEach(handler => handler(...args));
          }
          var processingScheduled = false;
          function _insert(data, insertAtFront, rejectOnError, callback) {
            if (null != callback && "function" !== typeof callback) throw new Error("task callback must be a function");
            q.started = true;
            var res, rej;
            function promiseCallback(err, ...args) {
              if (err) return rejectOnError ? rej(err) : res();
              if (args.length <= 1) return res(args[0]);
              res(args);
            }
            var item = {
              data: data,
              callback: rejectOnError ? promiseCallback : callback || promiseCallback
            };
            insertAtFront ? q._tasks.unshift(item) : q._tasks.push(item);
            if (!processingScheduled) {
              processingScheduled = true;
              setImmediate$1(() => {
                processingScheduled = false;
                q.process();
              });
            }
            if (rejectOnError || !callback) return new Promise((resolve, reject) => {
              res = resolve;
              rej = reject;
            });
          }
          function _createCB(tasks) {
            return function(err, ...args) {
              numRunning -= 1;
              for (var i = 0, l = tasks.length; i < l; i++) {
                var task = tasks[i];
                var index = workersList.indexOf(task);
                0 === index ? workersList.shift() : index > 0 && workersList.splice(index, 1);
                task.callback(err, ...args);
                null != err && trigger("error", err, task.data);
              }
              numRunning <= q.concurrency - q.buffer && trigger("unsaturated");
              q.idle() && trigger("drain");
              q.process();
            };
          }
          function _maybeDrain(data) {
            if (0 === data.length && q.idle()) {
              setImmediate$1(() => trigger("drain"));
              return true;
            }
            return false;
          }
          const eventMethod = name => handler => {
            if (!handler) return new Promise((resolve, reject) => {
              once(name, (err, data) => {
                if (err) return reject(err);
                resolve(data);
              });
            });
            off(name);
            on(name, handler);
          };
          var isProcessing = false;
          var q = {
            _tasks: new DLL(),
            * [Symbol.iterator]() {
              yield* q._tasks[Symbol.iterator]();
            },
            concurrency: concurrency,
            payload: payload,
            buffer: concurrency / 4,
            started: false,
            paused: false,
            push(data, callback) {
              if (Array.isArray(data)) {
                if (_maybeDrain(data)) return;
                return data.map(datum => _insert(datum, false, false, callback));
              }
              return _insert(data, false, false, callback);
            },
            pushAsync(data, callback) {
              if (Array.isArray(data)) {
                if (_maybeDrain(data)) return;
                return data.map(datum => _insert(datum, false, true, callback));
              }
              return _insert(data, false, true, callback);
            },
            kill() {
              off();
              q._tasks.empty();
            },
            unshift(data, callback) {
              if (Array.isArray(data)) {
                if (_maybeDrain(data)) return;
                return data.map(datum => _insert(datum, true, false, callback));
              }
              return _insert(data, true, false, callback);
            },
            unshiftAsync(data, callback) {
              if (Array.isArray(data)) {
                if (_maybeDrain(data)) return;
                return data.map(datum => _insert(datum, true, true, callback));
              }
              return _insert(data, true, true, callback);
            },
            remove(testFn) {
              q._tasks.remove(testFn);
            },
            process() {
              if (isProcessing) return;
              isProcessing = true;
              while (!q.paused && numRunning < q.concurrency && q._tasks.length) {
                var tasks = [], data = [];
                var l = q._tasks.length;
                q.payload && (l = Math.min(l, q.payload));
                for (var i = 0; i < l; i++) {
                  var node = q._tasks.shift();
                  tasks.push(node);
                  workersList.push(node);
                  data.push(node.data);
                }
                numRunning += 1;
                0 === q._tasks.length && trigger("empty");
                numRunning === q.concurrency && trigger("saturated");
                var cb = onlyOnce(_createCB(tasks));
                _worker(data, cb);
              }
              isProcessing = false;
            },
            length: () => q._tasks.length,
            running: () => numRunning,
            workersList: () => workersList,
            idle: () => q._tasks.length + numRunning === 0,
            pause() {
              q.paused = true;
            },
            resume() {
              if (false === q.paused) return;
              q.paused = false;
              setImmediate$1(q.process);
            }
          };
          Object.defineProperties(q, {
            saturated: {
              writable: false,
              value: eventMethod("saturated")
            },
            unsaturated: {
              writable: false,
              value: eventMethod("unsaturated")
            },
            empty: {
              writable: false,
              value: eventMethod("empty")
            },
            drain: {
              writable: false,
              value: eventMethod("drain")
            },
            error: {
              writable: false,
              value: eventMethod("error")
            }
          });
          return q;
        }
        function cargo(worker, payload) {
          return queue(worker, 1, payload);
        }
        function cargo$1(worker, concurrency, payload) {
          return queue(worker, concurrency, payload);
        }
        function reduce(coll, memo, iteratee, callback) {
          callback = once(callback);
          var _iteratee = wrapAsync(iteratee);
          return eachOfSeries$1(coll, (x, i, iterCb) => {
            _iteratee(memo, x, (err, v) => {
              memo = v;
              iterCb(err);
            });
          }, err => callback(err, memo));
        }
        var reduce$1 = awaitify(reduce, 4);
        function seq(...functions) {
          var _functions = functions.map(wrapAsync);
          return function(...args) {
            var that = this;
            var cb = args[args.length - 1];
            "function" == typeof cb ? args.pop() : cb = promiseCallback();
            reduce$1(_functions, args, (newargs, fn, iterCb) => {
              fn.apply(that, newargs.concat((err, ...nextargs) => {
                iterCb(err, nextargs);
              }));
            }, (err, results) => cb(err, ...results));
            return cb[PROMISE_SYMBOL];
          };
        }
        function compose(...args) {
          return seq(...args.reverse());
        }
        function mapLimit(coll, limit, iteratee, callback) {
          return _asyncMap(eachOfLimit(limit), coll, iteratee, callback);
        }
        var mapLimit$1 = awaitify(mapLimit, 4);
        function concatLimit(coll, limit, iteratee, callback) {
          var _iteratee = wrapAsync(iteratee);
          return mapLimit$1(coll, limit, (val, iterCb) => {
            _iteratee(val, (err, ...args) => {
              if (err) return iterCb(err);
              return iterCb(err, args);
            });
          }, (err, mapResults) => {
            var result = [];
            for (var i = 0; i < mapResults.length; i++) mapResults[i] && (result = result.concat(...mapResults[i]));
            return callback(err, result);
          });
        }
        var concatLimit$1 = awaitify(concatLimit, 4);
        function concat(coll, iteratee, callback) {
          return concatLimit$1(coll, Infinity, iteratee, callback);
        }
        var concat$1 = awaitify(concat, 3);
        function concatSeries(coll, iteratee, callback) {
          return concatLimit$1(coll, 1, iteratee, callback);
        }
        var concatSeries$1 = awaitify(concatSeries, 3);
        function constant(...args) {
          return function(...ignoredArgs) {
            var callback = ignoredArgs.pop();
            return callback(null, ...args);
          };
        }
        function _createTester(check, getResult) {
          return (eachfn, arr, _iteratee, cb) => {
            var testPassed = false;
            var testResult;
            const iteratee = wrapAsync(_iteratee);
            eachfn(arr, (value, _, callback) => {
              iteratee(value, (err, result) => {
                if (err || false === err) return callback(err);
                if (check(result) && !testResult) {
                  testPassed = true;
                  testResult = getResult(true, value);
                  return callback(null, breakLoop);
                }
                callback();
              });
            }, err => {
              if (err) return cb(err);
              cb(null, testPassed ? testResult : getResult(false));
            });
          };
        }
        function detect(coll, iteratee, callback) {
          return _createTester(bool => bool, (res, item) => item)(eachOf$1, coll, iteratee, callback);
        }
        var detect$1 = awaitify(detect, 3);
        function detectLimit(coll, limit, iteratee, callback) {
          return _createTester(bool => bool, (res, item) => item)(eachOfLimit(limit), coll, iteratee, callback);
        }
        var detectLimit$1 = awaitify(detectLimit, 4);
        function detectSeries(coll, iteratee, callback) {
          return _createTester(bool => bool, (res, item) => item)(eachOfLimit(1), coll, iteratee, callback);
        }
        var detectSeries$1 = awaitify(detectSeries, 3);
        function consoleFunc(name) {
          return (fn, ...args) => wrapAsync(fn)(...args, (err, ...resultArgs) => {
            "object" === typeof console && (err ? console.error && console.error(err) : console[name] && resultArgs.forEach(x => console[name](x)));
          });
        }
        var dir = consoleFunc("dir");
        function doWhilst(iteratee, test, callback) {
          callback = onlyOnce(callback);
          var _fn = wrapAsync(iteratee);
          var _test = wrapAsync(test);
          var results;
          function next(err, ...args) {
            if (err) return callback(err);
            if (false === err) return;
            results = args;
            _test(...args, check);
          }
          function check(err, truth) {
            if (err) return callback(err);
            if (false === err) return;
            if (!truth) return callback(null, ...results);
            _fn(next);
          }
          return check(null, true);
        }
        var doWhilst$1 = awaitify(doWhilst, 3);
        function doUntil(iteratee, test, callback) {
          const _test = wrapAsync(test);
          return doWhilst$1(iteratee, (...args) => {
            const cb = args.pop();
            _test(...args, (err, truth) => cb(err, !truth));
          }, callback);
        }
        function _withoutIndex(iteratee) {
          return (value, index, callback) => iteratee(value, callback);
        }
        function eachLimit(coll, iteratee, callback) {
          return eachOf$1(coll, _withoutIndex(wrapAsync(iteratee)), callback);
        }
        var each = awaitify(eachLimit, 3);
        function eachLimit$1(coll, limit, iteratee, callback) {
          return eachOfLimit(limit)(coll, _withoutIndex(wrapAsync(iteratee)), callback);
        }
        var eachLimit$2 = awaitify(eachLimit$1, 4);
        function eachSeries(coll, iteratee, callback) {
          return eachLimit$2(coll, 1, iteratee, callback);
        }
        var eachSeries$1 = awaitify(eachSeries, 3);
        function ensureAsync(fn) {
          if (isAsync(fn)) return fn;
          return function(...args) {
            var callback = args.pop();
            var sync = true;
            args.push((...innerArgs) => {
              sync ? setImmediate$1(() => callback(...innerArgs)) : callback(...innerArgs);
            });
            fn.apply(this, args);
            sync = false;
          };
        }
        function every(coll, iteratee, callback) {
          return _createTester(bool => !bool, res => !res)(eachOf$1, coll, iteratee, callback);
        }
        var every$1 = awaitify(every, 3);
        function everyLimit(coll, limit, iteratee, callback) {
          return _createTester(bool => !bool, res => !res)(eachOfLimit(limit), coll, iteratee, callback);
        }
        var everyLimit$1 = awaitify(everyLimit, 4);
        function everySeries(coll, iteratee, callback) {
          return _createTester(bool => !bool, res => !res)(eachOfSeries$1, coll, iteratee, callback);
        }
        var everySeries$1 = awaitify(everySeries, 3);
        function filterArray(eachfn, arr, iteratee, callback) {
          var truthValues = new Array(arr.length);
          eachfn(arr, (x, index, iterCb) => {
            iteratee(x, (err, v) => {
              truthValues[index] = !!v;
              iterCb(err);
            });
          }, err => {
            if (err) return callback(err);
            var results = [];
            for (var i = 0; i < arr.length; i++) truthValues[i] && results.push(arr[i]);
            callback(null, results);
          });
        }
        function filterGeneric(eachfn, coll, iteratee, callback) {
          var results = [];
          eachfn(coll, (x, index, iterCb) => {
            iteratee(x, (err, v) => {
              if (err) return iterCb(err);
              v && results.push({
                index: index,
                value: x
              });
              iterCb(err);
            });
          }, err => {
            if (err) return callback(err);
            callback(null, results.sort((a, b) => a.index - b.index).map(v => v.value));
          });
        }
        function _filter(eachfn, coll, iteratee, callback) {
          var filter = isArrayLike(coll) ? filterArray : filterGeneric;
          return filter(eachfn, coll, wrapAsync(iteratee), callback);
        }
        function filter(coll, iteratee, callback) {
          return _filter(eachOf$1, coll, iteratee, callback);
        }
        var filter$1 = awaitify(filter, 3);
        function filterLimit(coll, limit, iteratee, callback) {
          return _filter(eachOfLimit(limit), coll, iteratee, callback);
        }
        var filterLimit$1 = awaitify(filterLimit, 4);
        function filterSeries(coll, iteratee, callback) {
          return _filter(eachOfSeries$1, coll, iteratee, callback);
        }
        var filterSeries$1 = awaitify(filterSeries, 3);
        function forever(fn, errback) {
          var done = onlyOnce(errback);
          var task = wrapAsync(ensureAsync(fn));
          function next(err) {
            if (err) return done(err);
            if (false === err) return;
            task(next);
          }
          return next();
        }
        var forever$1 = awaitify(forever, 2);
        function groupByLimit(coll, limit, iteratee, callback) {
          var _iteratee = wrapAsync(iteratee);
          return mapLimit$1(coll, limit, (val, iterCb) => {
            _iteratee(val, (err, key) => {
              if (err) return iterCb(err);
              return iterCb(err, {
                key: key,
                val: val
              });
            });
          }, (err, mapResults) => {
            var result = {};
            var {hasOwnProperty: hasOwnProperty} = Object.prototype;
            for (var i = 0; i < mapResults.length; i++) if (mapResults[i]) {
              var {key: key} = mapResults[i];
              var {val: val} = mapResults[i];
              hasOwnProperty.call(result, key) ? result[key].push(val) : result[key] = [ val ];
            }
            return callback(err, result);
          });
        }
        var groupByLimit$1 = awaitify(groupByLimit, 4);
        function groupBy(coll, iteratee, callback) {
          return groupByLimit$1(coll, Infinity, iteratee, callback);
        }
        function groupBySeries(coll, iteratee, callback) {
          return groupByLimit$1(coll, 1, iteratee, callback);
        }
        var log = consoleFunc("log");
        function mapValuesLimit(obj, limit, iteratee, callback) {
          callback = once(callback);
          var newObj = {};
          var _iteratee = wrapAsync(iteratee);
          return eachOfLimit(limit)(obj, (val, key, next) => {
            _iteratee(val, key, (err, result) => {
              if (err) return next(err);
              newObj[key] = result;
              next(err);
            });
          }, err => callback(err, newObj));
        }
        var mapValuesLimit$1 = awaitify(mapValuesLimit, 4);
        function mapValues(obj, iteratee, callback) {
          return mapValuesLimit$1(obj, Infinity, iteratee, callback);
        }
        function mapValuesSeries(obj, iteratee, callback) {
          return mapValuesLimit$1(obj, 1, iteratee, callback);
        }
        function memoize(fn, hasher = (v => v)) {
          var memo = Object.create(null);
          var queues = Object.create(null);
          var _fn = wrapAsync(fn);
          var memoized = initialParams((args, callback) => {
            var key = hasher(...args);
            if (key in memo) setImmediate$1(() => callback(null, ...memo[key])); else if (key in queues) queues[key].push(callback); else {
              queues[key] = [ callback ];
              _fn(...args, (err, ...resultArgs) => {
                err || (memo[key] = resultArgs);
                var q = queues[key];
                delete queues[key];
                for (var i = 0, l = q.length; i < l; i++) q[i](err, ...resultArgs);
              });
            }
          });
          memoized.memo = memo;
          memoized.unmemoized = fn;
          return memoized;
        }
        var _defer$1;
        _defer$1 = hasNextTick ? process.nextTick : hasSetImmediate ? setImmediate : fallback;
        var nextTick = wrap(_defer$1);
        var _parallel = awaitify((eachfn, tasks, callback) => {
          var results = isArrayLike(tasks) ? [] : {};
          eachfn(tasks, (task, key, taskCb) => {
            wrapAsync(task)((err, ...result) => {
              result.length < 2 && ([result] = result);
              results[key] = result;
              taskCb(err);
            });
          }, err => callback(err, results));
        }, 3);
        function parallel(tasks, callback) {
          return _parallel(eachOf$1, tasks, callback);
        }
        function parallelLimit(tasks, limit, callback) {
          return _parallel(eachOfLimit(limit), tasks, callback);
        }
        function queue$1(worker, concurrency) {
          var _worker = wrapAsync(worker);
          return queue((items, cb) => {
            _worker(items[0], cb);
          }, concurrency, 1);
        }
        class Heap {
          constructor() {
            this.heap = [];
            this.pushCount = Number.MIN_SAFE_INTEGER;
          }
          get length() {
            return this.heap.length;
          }
          empty() {
            this.heap = [];
            return this;
          }
          percUp(index) {
            let p;
            while (index > 0 && smaller(this.heap[index], this.heap[p = parent(index)])) {
              let t = this.heap[index];
              this.heap[index] = this.heap[p];
              this.heap[p] = t;
              index = p;
            }
          }
          percDown(index) {
            let l;
            while ((l = leftChi(index)) < this.heap.length) {
              l + 1 < this.heap.length && smaller(this.heap[l + 1], this.heap[l]) && (l += 1);
              if (smaller(this.heap[index], this.heap[l])) break;
              let t = this.heap[index];
              this.heap[index] = this.heap[l];
              this.heap[l] = t;
              index = l;
            }
          }
          push(node) {
            node.pushCount = ++this.pushCount;
            this.heap.push(node);
            this.percUp(this.heap.length - 1);
          }
          unshift(node) {
            return this.heap.push(node);
          }
          shift() {
            let [top] = this.heap;
            this.heap[0] = this.heap[this.heap.length - 1];
            this.heap.pop();
            this.percDown(0);
            return top;
          }
          toArray() {
            return [ ...this ];
          }
          * [Symbol.iterator]() {
            for (let i = 0; i < this.heap.length; i++) yield this.heap[i].data;
          }
          remove(testFn) {
            let j = 0;
            for (let i = 0; i < this.heap.length; i++) if (!testFn(this.heap[i])) {
              this.heap[j] = this.heap[i];
              j++;
            }
            this.heap.splice(j);
            for (let i = parent(this.heap.length - 1); i >= 0; i--) this.percDown(i);
            return this;
          }
        }
        function leftChi(i) {
          return 1 + (i << 1);
        }
        function parent(i) {
          return (i + 1 >> 1) - 1;
        }
        function smaller(x, y) {
          return x.priority !== y.priority ? x.priority < y.priority : x.pushCount < y.pushCount;
        }
        function priorityQueue(worker, concurrency) {
          var q = queue$1(worker, concurrency);
          var processingScheduled = false;
          q._tasks = new Heap();
          q.push = function(data, priority = 0, callback = (() => {})) {
            if ("function" !== typeof callback) throw new Error("task callback must be a function");
            q.started = true;
            Array.isArray(data) || (data = [ data ]);
            if (0 === data.length && q.idle()) return setImmediate$1(() => q.drain());
            for (var i = 0, l = data.length; i < l; i++) {
              var item = {
                data: data[i],
                priority: priority,
                callback: callback
              };
              q._tasks.push(item);
            }
            if (!processingScheduled) {
              processingScheduled = true;
              setImmediate$1(() => {
                processingScheduled = false;
                q.process();
              });
            }
          };
          delete q.unshift;
          return q;
        }
        function race(tasks, callback) {
          callback = once(callback);
          if (!Array.isArray(tasks)) return callback(new TypeError("First argument to race must be an array of functions"));
          if (!tasks.length) return callback();
          for (var i = 0, l = tasks.length; i < l; i++) wrapAsync(tasks[i])(callback);
        }
        var race$1 = awaitify(race, 2);
        function reduceRight(array, memo, iteratee, callback) {
          var reversed = [ ...array ].reverse();
          return reduce$1(reversed, memo, iteratee, callback);
        }
        function reflect(fn) {
          var _fn = wrapAsync(fn);
          return initialParams(function reflectOn(args, reflectCallback) {
            args.push((error, ...cbArgs) => {
              let retVal = {};
              error && (retVal.error = error);
              if (cbArgs.length > 0) {
                var value = cbArgs;
                cbArgs.length <= 1 && ([value] = cbArgs);
                retVal.value = value;
              }
              reflectCallback(null, retVal);
            });
            return _fn.apply(this, args);
          });
        }
        function reflectAll(tasks) {
          var results;
          if (Array.isArray(tasks)) results = tasks.map(reflect); else {
            results = {};
            Object.keys(tasks).forEach(key => {
              results[key] = reflect.call(this, tasks[key]);
            });
          }
          return results;
        }
        function reject(eachfn, arr, _iteratee, callback) {
          const iteratee = wrapAsync(_iteratee);
          return _filter(eachfn, arr, (value, cb) => {
            iteratee(value, (err, v) => {
              cb(err, !v);
            });
          }, callback);
        }
        function reject$1(coll, iteratee, callback) {
          return reject(eachOf$1, coll, iteratee, callback);
        }
        var reject$2 = awaitify(reject$1, 3);
        function rejectLimit(coll, limit, iteratee, callback) {
          return reject(eachOfLimit(limit), coll, iteratee, callback);
        }
        var rejectLimit$1 = awaitify(rejectLimit, 4);
        function rejectSeries(coll, iteratee, callback) {
          return reject(eachOfSeries$1, coll, iteratee, callback);
        }
        var rejectSeries$1 = awaitify(rejectSeries, 3);
        function constant$1(value) {
          return function() {
            return value;
          };
        }
        const DEFAULT_TIMES = 5;
        const DEFAULT_INTERVAL = 0;
        function retry(opts, task, callback) {
          var options = {
            times: DEFAULT_TIMES,
            intervalFunc: constant$1(DEFAULT_INTERVAL)
          };
          if (arguments.length < 3 && "function" === typeof opts) {
            callback = task || promiseCallback();
            task = opts;
          } else {
            parseTimes(options, opts);
            callback = callback || promiseCallback();
          }
          if ("function" !== typeof task) throw new Error("Invalid arguments for async.retry");
          var _task = wrapAsync(task);
          var attempt = 1;
          function retryAttempt() {
            _task((err, ...args) => {
              if (false === err) return;
              err && attempt++ < options.times && ("function" != typeof options.errorFilter || options.errorFilter(err)) ? setTimeout(retryAttempt, options.intervalFunc(attempt - 1)) : callback(err, ...args);
            });
          }
          retryAttempt();
          return callback[PROMISE_SYMBOL];
        }
        function parseTimes(acc, t) {
          if ("object" === typeof t) {
            acc.times = +t.times || DEFAULT_TIMES;
            acc.intervalFunc = "function" === typeof t.interval ? t.interval : constant$1(+t.interval || DEFAULT_INTERVAL);
            acc.errorFilter = t.errorFilter;
          } else {
            if ("number" !== typeof t && "string" !== typeof t) throw new Error("Invalid arguments for async.retry");
            acc.times = +t || DEFAULT_TIMES;
          }
        }
        function retryable(opts, task) {
          if (!task) {
            task = opts;
            opts = null;
          }
          let arity = opts && opts.arity || task.length;
          isAsync(task) && (arity += 1);
          var _task = wrapAsync(task);
          return initialParams((args, callback) => {
            if (args.length < arity - 1 || null == callback) {
              args.push(callback);
              callback = promiseCallback();
            }
            function taskFn(cb) {
              _task(...args, cb);
            }
            opts ? retry(opts, taskFn, callback) : retry(taskFn, callback);
            return callback[PROMISE_SYMBOL];
          });
        }
        function series(tasks, callback) {
          return _parallel(eachOfSeries$1, tasks, callback);
        }
        function some(coll, iteratee, callback) {
          return _createTester(Boolean, res => res)(eachOf$1, coll, iteratee, callback);
        }
        var some$1 = awaitify(some, 3);
        function someLimit(coll, limit, iteratee, callback) {
          return _createTester(Boolean, res => res)(eachOfLimit(limit), coll, iteratee, callback);
        }
        var someLimit$1 = awaitify(someLimit, 4);
        function someSeries(coll, iteratee, callback) {
          return _createTester(Boolean, res => res)(eachOfSeries$1, coll, iteratee, callback);
        }
        var someSeries$1 = awaitify(someSeries, 3);
        function sortBy(coll, iteratee, callback) {
          var _iteratee = wrapAsync(iteratee);
          return map$1(coll, (x, iterCb) => {
            _iteratee(x, (err, criteria) => {
              if (err) return iterCb(err);
              iterCb(err, {
                value: x,
                criteria: criteria
              });
            });
          }, (err, results) => {
            if (err) return callback(err);
            callback(null, results.sort(comparator).map(v => v.value));
          });
          function comparator(left, right) {
            var a = left.criteria, b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
          }
        }
        var sortBy$1 = awaitify(sortBy, 3);
        function timeout(asyncFn, milliseconds, info) {
          var fn = wrapAsync(asyncFn);
          return initialParams((args, callback) => {
            var timedOut = false;
            var timer;
            function timeoutCallback() {
              var name = asyncFn.name || "anonymous";
              var error = new Error('Callback function "' + name + '" timed out.');
              error.code = "ETIMEDOUT";
              info && (error.info = info);
              timedOut = true;
              callback(error);
            }
            args.push((...cbArgs) => {
              if (!timedOut) {
                callback(...cbArgs);
                clearTimeout(timer);
              }
            });
            timer = setTimeout(timeoutCallback, milliseconds);
            fn(...args);
          });
        }
        function range(size) {
          var result = Array(size);
          while (size--) result[size] = size;
          return result;
        }
        function timesLimit(count, limit, iteratee, callback) {
          var _iteratee = wrapAsync(iteratee);
          return mapLimit$1(range(count), limit, _iteratee, callback);
        }
        function times(n, iteratee, callback) {
          return timesLimit(n, Infinity, iteratee, callback);
        }
        function timesSeries(n, iteratee, callback) {
          return timesLimit(n, 1, iteratee, callback);
        }
        function transform(coll, accumulator, iteratee, callback) {
          if (arguments.length <= 3 && "function" === typeof accumulator) {
            callback = iteratee;
            iteratee = accumulator;
            accumulator = Array.isArray(coll) ? [] : {};
          }
          callback = once(callback || promiseCallback());
          var _iteratee = wrapAsync(iteratee);
          eachOf$1(coll, (v, k, cb) => {
            _iteratee(accumulator, v, k, cb);
          }, err => callback(err, accumulator));
          return callback[PROMISE_SYMBOL];
        }
        function tryEach(tasks, callback) {
          var error = null;
          var result;
          return eachSeries$1(tasks, (task, taskCb) => {
            wrapAsync(task)((err, ...args) => {
              if (false === err) return taskCb(err);
              args.length < 2 ? [result] = args : result = args;
              error = err;
              taskCb(err ? null : {});
            });
          }, () => callback(error, result));
        }
        var tryEach$1 = awaitify(tryEach);
        function unmemoize(fn) {
          return (...args) => (fn.unmemoized || fn)(...args);
        }
        function whilst(test, iteratee, callback) {
          callback = onlyOnce(callback);
          var _fn = wrapAsync(iteratee);
          var _test = wrapAsync(test);
          var results = [];
          function next(err, ...rest) {
            if (err) return callback(err);
            results = rest;
            if (false === err) return;
            _test(check);
          }
          function check(err, truth) {
            if (err) return callback(err);
            if (false === err) return;
            if (!truth) return callback(null, ...results);
            _fn(next);
          }
          return _test(check);
        }
        var whilst$1 = awaitify(whilst, 3);
        function until(test, iteratee, callback) {
          const _test = wrapAsync(test);
          return whilst$1(cb => _test((err, truth) => cb(err, !truth)), iteratee, callback);
        }
        function waterfall(tasks, callback) {
          callback = once(callback);
          if (!Array.isArray(tasks)) return callback(new Error("First argument to waterfall must be an array of functions"));
          if (!tasks.length) return callback();
          var taskIndex = 0;
          function nextTask(args) {
            var task = wrapAsync(tasks[taskIndex++]);
            task(...args, onlyOnce(next));
          }
          function next(err, ...args) {
            if (false === err) return;
            if (err || taskIndex === tasks.length) return callback(err, ...args);
            nextTask(args);
          }
          nextTask([]);
        }
        var waterfall$1 = awaitify(waterfall);
        var index = {
          apply: apply,
          applyEach: applyEach$1,
          applyEachSeries: applyEachSeries,
          asyncify: asyncify,
          auto: auto,
          autoInject: autoInject,
          cargo: cargo,
          cargoQueue: cargo$1,
          compose: compose,
          concat: concat$1,
          concatLimit: concatLimit$1,
          concatSeries: concatSeries$1,
          constant: constant,
          detect: detect$1,
          detectLimit: detectLimit$1,
          detectSeries: detectSeries$1,
          dir: dir,
          doUntil: doUntil,
          doWhilst: doWhilst$1,
          each: each,
          eachLimit: eachLimit$2,
          eachOf: eachOf$1,
          eachOfLimit: eachOfLimit$2,
          eachOfSeries: eachOfSeries$1,
          eachSeries: eachSeries$1,
          ensureAsync: ensureAsync,
          every: every$1,
          everyLimit: everyLimit$1,
          everySeries: everySeries$1,
          filter: filter$1,
          filterLimit: filterLimit$1,
          filterSeries: filterSeries$1,
          forever: forever$1,
          groupBy: groupBy,
          groupByLimit: groupByLimit$1,
          groupBySeries: groupBySeries,
          log: log,
          map: map$1,
          mapLimit: mapLimit$1,
          mapSeries: mapSeries$1,
          mapValues: mapValues,
          mapValuesLimit: mapValuesLimit$1,
          mapValuesSeries: mapValuesSeries,
          memoize: memoize,
          nextTick: nextTick,
          parallel: parallel,
          parallelLimit: parallelLimit,
          priorityQueue: priorityQueue,
          queue: queue$1,
          race: race$1,
          reduce: reduce$1,
          reduceRight: reduceRight,
          reflect: reflect,
          reflectAll: reflectAll,
          reject: reject$2,
          rejectLimit: rejectLimit$1,
          rejectSeries: rejectSeries$1,
          retry: retry,
          retryable: retryable,
          seq: seq,
          series: series,
          setImmediate: setImmediate$1,
          some: some$1,
          someLimit: someLimit$1,
          someSeries: someSeries$1,
          sortBy: sortBy$1,
          timeout: timeout,
          times: times,
          timesLimit: timesLimit,
          timesSeries: timesSeries,
          transform: transform,
          tryEach: tryEach$1,
          unmemoize: unmemoize,
          until: until,
          waterfall: waterfall$1,
          whilst: whilst$1,
          all: every$1,
          allLimit: everyLimit$1,
          allSeries: everySeries$1,
          any: some$1,
          anyLimit: someLimit$1,
          anySeries: someSeries$1,
          find: detect$1,
          findLimit: detectLimit$1,
          findSeries: detectSeries$1,
          flatMap: concat$1,
          flatMapLimit: concatLimit$1,
          flatMapSeries: concatSeries$1,
          forEach: each,
          forEachSeries: eachSeries$1,
          forEachLimit: eachLimit$2,
          forEachOf: eachOf$1,
          forEachOfSeries: eachOfSeries$1,
          forEachOfLimit: eachOfLimit$2,
          inject: reduce$1,
          foldl: reduce$1,
          foldr: reduceRight,
          select: filter$1,
          selectLimit: filterLimit$1,
          selectSeries: filterSeries$1,
          wrapSync: asyncify,
          during: whilst$1,
          doDuring: doWhilst$1
        };
        exports.default = index;
        exports.apply = apply;
        exports.applyEach = applyEach$1;
        exports.applyEachSeries = applyEachSeries;
        exports.asyncify = asyncify;
        exports.auto = auto;
        exports.autoInject = autoInject;
        exports.cargo = cargo;
        exports.cargoQueue = cargo$1;
        exports.compose = compose;
        exports.concat = concat$1;
        exports.concatLimit = concatLimit$1;
        exports.concatSeries = concatSeries$1;
        exports.constant = constant;
        exports.detect = detect$1;
        exports.detectLimit = detectLimit$1;
        exports.detectSeries = detectSeries$1;
        exports.dir = dir;
        exports.doUntil = doUntil;
        exports.doWhilst = doWhilst$1;
        exports.each = each;
        exports.eachLimit = eachLimit$2;
        exports.eachOf = eachOf$1;
        exports.eachOfLimit = eachOfLimit$2;
        exports.eachOfSeries = eachOfSeries$1;
        exports.eachSeries = eachSeries$1;
        exports.ensureAsync = ensureAsync;
        exports.every = every$1;
        exports.everyLimit = everyLimit$1;
        exports.everySeries = everySeries$1;
        exports.filter = filter$1;
        exports.filterLimit = filterLimit$1;
        exports.filterSeries = filterSeries$1;
        exports.forever = forever$1;
        exports.groupBy = groupBy;
        exports.groupByLimit = groupByLimit$1;
        exports.groupBySeries = groupBySeries;
        exports.log = log;
        exports.map = map$1;
        exports.mapLimit = mapLimit$1;
        exports.mapSeries = mapSeries$1;
        exports.mapValues = mapValues;
        exports.mapValuesLimit = mapValuesLimit$1;
        exports.mapValuesSeries = mapValuesSeries;
        exports.memoize = memoize;
        exports.nextTick = nextTick;
        exports.parallel = parallel;
        exports.parallelLimit = parallelLimit;
        exports.priorityQueue = priorityQueue;
        exports.queue = queue$1;
        exports.race = race$1;
        exports.reduce = reduce$1;
        exports.reduceRight = reduceRight;
        exports.reflect = reflect;
        exports.reflectAll = reflectAll;
        exports.reject = reject$2;
        exports.rejectLimit = rejectLimit$1;
        exports.rejectSeries = rejectSeries$1;
        exports.retry = retry;
        exports.retryable = retryable;
        exports.seq = seq;
        exports.series = series;
        exports.setImmediate = setImmediate$1;
        exports.some = some$1;
        exports.someLimit = someLimit$1;
        exports.someSeries = someSeries$1;
        exports.sortBy = sortBy$1;
        exports.timeout = timeout;
        exports.times = times;
        exports.timesLimit = timesLimit;
        exports.timesSeries = timesSeries;
        exports.transform = transform;
        exports.tryEach = tryEach$1;
        exports.unmemoize = unmemoize;
        exports.until = until;
        exports.waterfall = waterfall$1;
        exports.whilst = whilst$1;
        exports.all = every$1;
        exports.allLimit = everyLimit$1;
        exports.allSeries = everySeries$1;
        exports.any = some$1;
        exports.anyLimit = someLimit$1;
        exports.anySeries = someSeries$1;
        exports.find = detect$1;
        exports.findLimit = detectLimit$1;
        exports.findSeries = detectSeries$1;
        exports.flatMap = concat$1;
        exports.flatMapLimit = concatLimit$1;
        exports.flatMapSeries = concatSeries$1;
        exports.forEach = each;
        exports.forEachSeries = eachSeries$1;
        exports.forEachLimit = eachLimit$2;
        exports.forEachOf = eachOf$1;
        exports.forEachOfSeries = eachOfSeries$1;
        exports.forEachOfLimit = eachOfLimit$2;
        exports.inject = reduce$1;
        exports.foldl = reduce$1;
        exports.foldr = reduceRight;
        exports.select = filter$1;
        exports.selectLimit = filterLimit$1;
        exports.selectSeries = filterSeries$1;
        exports.wrapSync = asyncify;
        exports.during = whilst$1;
        exports.doDuring = doWhilst$1;
        Object.defineProperty(exports, "__esModule", {
          value: true
        });
      });
    }).call(this, require("_process"));
  }, {
    _process: 2
  } ],
  User: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "32649Kmyi1BY7pgNcJaEbe9", "User");
    "use strict";
    var User = cc.Class({
      name: null,
      score: null
    });
    module.exports = User;
    cc._RF.pop();
  }, {} ],
  card: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cb4bcixDeRGp7yvJ31dhztz", "card");
    "use strict";
    var Emitter = require("mEmitter");
    var COLOR = require("color");
    cc.Class({
      extends: cc.Component,
      properties: {
        lblCard: {
          default: null,
          type: cc.Label
        }
      },
      onLoad: function onLoad() {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    color: "color",
    mEmitter: "mEmitter"
  } ],
  color: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ae1182/+G9GD52Yva923Y7S", "color");
    "use strict";
    var COLOR = [];
    COLOR[0] = cc.color(245, 245, 220, 255);
    COLOR[2] = cc.color(235, 224, 213, 255);
    COLOR[4] = cc.color(234, 219, 193, 255);
    COLOR[8] = cc.color(240, 167, 110, 255);
    COLOR[16] = cc.color(244, 138, 89, 255);
    COLOR[32] = cc.color(245, 112, 85, 255);
    COLOR[64] = cc.color(245, 83, 52, 255);
    COLOR[128] = cc.color(234, 200, 103, 255);
    COLOR[256] = cc.color(234, 197, 87, 255);
    COLOR[512] = cc.color(234, 192, 71, 255);
    COLOR[1024] = cc.color(146, 208, 80, 255);
    COLOR[2048] = cc.color(0, 176, 240, 255);
    module.exports = COLOR;
    cc._RF.pop();
  }, {} ],
  controller: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dc122IXeP9Nl7HSkZ6UWyCu", "controller");
    "use strict";
    var emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        menuStart: cc.Node,
        gameOver: cc.Node,
        menuPlaying: cc.Node,
        menuRank: cc.Node,
        listBlock: cc.Node,
        title: cc.Node,
        _playingState: null,
        _gameOverState: null,
        _defaultState: null,
        _titleState: null,
        _rankState: null
      },
      onLoad: function onLoad() {
        emitter.instance = new emitter();
        this._playingState = this.onPlaying.bind(this);
        this._gameOverState = this.onGameOver.bind(this);
        this._defaultState = this.onDefaultne.bind(this);
        this._rankState = this.onRank.bind(this);
        emitter.instance.registerEvent("PLAYING", this._playingState);
        emitter.instance.registerEvent("GAMEOVER", this._gameOverState);
        emitter.instance.registerEvent("DEFAULT", this._defaultState);
        emitter.instance.registerEvent("RANK", this._rankState);
      },
      start: function start() {
        this.offAll();
        this.onDefaultne();
      },
      offAll: function offAll() {
        this.menuStart.active = false;
        this.title.active = false;
        this.gameOver.active = false;
        this.menuPlaying.active = false;
        this.menuRank.active = false;
        this.listBlock.active = false;
      },
      onRank: function onRank(node) {
        node && (node == this.menuStart ? this.doCloseStart(node).start() : this.doCloseRankAndGameOver(node).start());
        this.doShowRankAndGameOver(this.menuRank).start();
      },
      onDefaultne: function onDefaultne(node) {
        this.doCloseRankAndGameOver(node).start();
        this.doCloseRankAndGameOver(this.gameOver).start();
        this.doCloseRankAndGameOver(this.menuRank).start();
        this.doCloseMenuPlaying(this.menuPlaying).start();
        this.doCloseListBlock(this.listBlock).start();
        this.doCloseTitle(this.title).start();
        this.doShowStart(this.menuStart).start();
        cc.log("default");
      },
      onGameOver: function onGameOver(node) {
        node && (node == this.menuStart ? this.doCloseStart(node).start() : this.doCloseRankAndGameOver(node).start());
        this.doShowRankAndGameOver(this.gameOver).start();
        cc.log("game over");
      },
      onPlaying: function onPlaying(node) {
        node && (node == this.menuStart ? this.doCloseStart(node).start() : this.doCloseRankAndGameOver(node).start());
        emitter.instance.emit("CLICK_PLAY");
        this.doShowMenuPlaying(this.menuPlaying).start();
        this.doShowTitle(this.title).start();
        this.doShowListBlock(this.listBlock).start();
        cc.log("playing");
      },
      doShowRankAndGameOver: function doShowRankAndGameOver(node) {
        var t = cc.tween(node).to(0, {
          scale: 0
        }, {
          easing: "sineIn"
        }).to(1e-4, {
          position: cc.v2(0, 0)
        }, {
          easing: "sineOut"
        }).delay(.5).call(function(node) {
          node.active = true;
        }).to(1, {
          scale: 1
        }, {
          easing: "sineIn"
        });
        return t;
      },
      doCloseRankAndGameOver: function doCloseRankAndGameOver(node) {
        var t = cc.tween(node).by(.07, {
          position: cc.v2(64, 0)
        }, {
          easing: "sineIn"
        }).repeat(10).to(.7, {
          scale: 1
        }, {
          easing: "sineIn"
        }).delay(.5);
        return t;
      },
      doShowListBlock: function doShowListBlock(node) {
        var t = cc.tween(node).call(function(node) {
          node.active = true;
        }).to(1, {
          scale: 1
        }, {
          easing: "sineIn"
        });
        return t;
      },
      doCloseListBlock: function doCloseListBlock(node) {
        var t = cc.tween(node).to(1, {
          scale: 0
        }, {
          easing: "sineIn"
        }).delay(.5);
        return t;
      },
      doShowMenuPlaying: function doShowMenuPlaying(node) {
        var t = cc.tween(node).call(function(node) {
          node.active = true;
        }).delay(.5).to(.1, {
          scale: 1
        }, {
          easing: "sineIn"
        }).to(1, {
          position: cc.v2(0, -390)
        }, {
          easing: "backOut"
        });
        return t;
      },
      doCloseMenuPlaying: function doCloseMenuPlaying(node) {
        var t = cc.tween(node).to(.7, {
          position: cc.v2(0, -580)
        }, {
          easing: "backInOut"
        }).delay(.5);
        return t;
      },
      doShowTitle: function doShowTitle(node) {
        var t = cc.tween(node).call(function(node) {
          node.active = true;
        }).delay(.9).to(1, {
          position: cc.v2(0, 0)
        }, {
          easing: "backOut"
        });
        return t;
      },
      doCloseTitle: function doCloseTitle(node) {
        var t = cc.tween(node).to(.7, {
          position: cc.v2(0, 300)
        }, {
          easing: "backInOut"
        }).delay(1);
        return t;
      },
      doShowStart: function doShowStart(node) {
        var t = cc.tween(node).to(1e-4, {
          position: cc.v2(0, 590)
        }, {
          easing: "sineOut"
        }).call(function(node) {
          node.active = true;
        }).delay(.8).to(.8, {
          position: cc.v2(0, 0)
        }, {
          easing: "backOut"
        });
        return t;
      },
      doCloseStart: function doCloseStart(node) {
        var t = cc.tween(node).to(1, {
          position: cc.v2(0, 590)
        }, {
          easing: "backInOut"
        }).delay(.8).call(function(node) {
          node.active = false;
        });
        return t;
      }
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ],
  gameOverHandle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "89d30fH4l9F/p5p/dc+JWMx", "gameOverHandle");
    "use strict";
    var User = require("User");
    var emitter = require("mEmitter");
    var db = JSON.parse(cc.sys.localStorage.getItem("users"));
    cc.Class({
      extends: cc.Component,
      properties: {
        edbUsername: cc.EditBox,
        btnSubmit: cc.Button,
        lblScore: cc.Label,
        gameOverAudio: {
          default: null,
          type: cc.AudioClip
        },
        openGameOver: null,
        clickSubmit: null,
        users: []
      },
      gameOverSound: function gameOverSound() {
        cc.audioEngine.playEffect(this.gameOverAudio, false);
      },
      onLoad: function onLoad() {
        this.openGameOver = this.doOpenGameOver.bind(this);
        emitter.instance.registerEvent("OPEN_GAMEOVER", this.openGameOver);
      },
      start: function start() {
        this.checkData();
        this.btnSubmit.node.on("click", this.doSubmit, this);
        var sound = cc.callFunc(this.gameOverSound, this);
        this.node.runAction(sound);
      },
      doOpenGameOver: function doOpenGameOver(totalScore) {
        var _this = this;
        cc.log(totalScore);
        cc.log("gameover");
        var countScore = 0;
        var actions = [ cc.callFunc(function() {
          countScore += 1;
        }), cc.delayTime(.01), cc.callFunc(function() {
          _this.lblScore.string = countScore;
        }) ];
        this.lblScore.node.runAction(cc.repeat(cc.sequence(actions), totalScore));
      },
      getInfoUserAndPushToArray: function getInfoUserAndPushToArray() {
        var user = new User();
        user.name = this.edbUsername.string;
        user.score = this.lblScore.string;
        this.users.push(user);
      },
      doSubmit: function doSubmit() {
        if ("" == this.edbUsername.string) return;
        this.getInfoUserAndPushToArray();
        null != this.users && cc.sys.localStorage.setItem("users", JSON.stringify(this.users));
        this.edbUsername.string = "";
        emitter.instance.emit("DEFAULT", this.node);
      },
      checkData: function checkData() {
        null != db && (this.users = db);
      }
    });
    cc._RF.pop();
  }, {
    User: "User",
    mEmitter: "mEmitter"
  } ],
  mEmitter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d803cCt5mRA3J7kpXzbrNXx", "mEmitter");
    "use strict";
    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          "value" in descriptor && (descriptor.writable = true);
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        protoProps && defineProperties(Constructor.prototype, protoProps);
        staticProps && defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var EventEmitter = require("events");
    var mEmitter = function() {
      function mEmitter() {
        _classCallCheck(this, mEmitter);
        this._emiter = new EventEmitter();
        this._emiter.setMaxListeners(100);
      }
      _createClass(mEmitter, [ {
        key: "emit",
        value: function emit() {
          var _emiter;
          (_emiter = this._emiter).emit.apply(_emiter, arguments);
        }
      }, {
        key: "registerEvent",
        value: function registerEvent(event, listener, target) {
          this._emiter.on(event, listener, target);
        }
      }, {
        key: "registerOnce",
        value: function registerOnce(event, listener) {
          this._emiter.once(event, listener);
        }
      }, {
        key: "removeEvent",
        value: function removeEvent(event, listener) {
          this._emiter.removeListener(event, listener);
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this._emiter.removeAllListeners();
          this._emiter = null;
          mEmitter.instance = null;
        }
      } ]);
      return mEmitter;
    }();
    mEmitter.instance = null;
    module.exports = mEmitter;
    cc._RF.pop();
  }, {
    events: 1
  } ],
  main: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7f252HpQsBHib03NO/PkRbb", "main");
    "use strict";
    var COLOR = require("color");
    var emitter = require("mEmitter");
    var async = require("async");
    cc.Class({
      extends: cc.Component,
      properties: {
        card: {
          default: null,
          type: cc.Prefab
        },
        updateScore: {
          default: null,
          type: cc.Label
        },
        compareAudio: {
          default: null,
          type: cc.AudioClip
        },
        newCardAudio: {
          default: null,
          type: cc.AudioClip
        },
        _mouseDown: null,
        _arrBlocks: [],
        _canRandom: true,
        _updateScore: 0,
        _totalScore: 0,
        _canPress: false,
        playGame: null
      },
      compareSound: function compareSound() {
        cc.audioEngine.playEffect(this.compareAudio, false);
      },
      newCardSound: function newCardSound() {
        cc.audioEngine.playEffect(this.newCardAudio, false);
      },
      onPlayCompareSound: function onPlayCompareSound() {
        var action = cc.callFunc(this.compareSound, this);
        this.node.runAction(action);
      },
      onLoad: function onLoad() {
        this._mouseDown = {};
        this.canPress = false;
        this.playGame = this.onPlayGame.bind(this);
        emitter.instance.registerEvent("CLICK_PLAY", this.playGame);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.mouseDown, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.mouseUp, this);
      },
      mouseUp: function mouseUp(evt) {
        var mouseUpX = evt.getLocationX();
        var mouseUpY = evt.getLocationY();
        if (Math.abs(this._mouseDown.x - mouseUpX) > Math.abs(this._mouseDown.y - mouseUpY)) {
          if (Math.abs(this._mouseDown.x - mouseUpX) < 50) return;
          this._mouseDown.x - mouseUpX < 0 ? this.moveRight() : this.moveLeft();
        } else {
          if (Math.abs(this._mouseDown.y - mouseUpY) < 50) return;
          this._mouseDown.y - mouseUpY < 0 ? this.moveUp() : this.moveDown();
        }
        this.randomNumber();
      },
      mouseDown: function mouseDown(evt) {
        this._mouseDown.x = evt.getLocationX();
        this._mouseDown.y = evt.getLocationY();
        cc.log(this._mouseDown.x, this._mouseDown.y);
      },
      eventTouchHanlder: function eventTouchHanlder() {
        var _this = this;
        this.node.on("touchstart", function(event) {
          _this._startTouch = event.getLocation();
        });
        this.node.on("touchend", function(event) {
          _this._endTouch = event.getLocation();
          _this.checkTouch();
        });
      },
      checkTouch: function checkTouch() {
        var startTouch = this._startTouch;
        var endTouch = this._endTouch;
        var dinstance = endTouch.sub(startTouch);
        var VecLength = dinstance.mag();
        if (VecLength > 50) {
          Math.abs(dinstance.x) > Math.abs(dinstance.y) ? dinstance.x > 0 ? this.moveRight() : this.moveLeft() : dinstance.y > 0 ? this.moveUp() : this.moveDown();
          this.randomNumber();
        }
      },
      handleKeyUp: function handleKeyUp(evt) {
        switch (evt.keyCode) {
         case cc.macro.KEY.up:
         case cc.macro.KEY.down:
         case cc.macro.KEY.left:
         case cc.macro.KEY.right:
          this.randomNumber();
          this._canPress = false;
        }
      },
      handleKeyDown: function handleKeyDown(evt) {
        if (this._canPress) return;
        this._canPress = true;
        switch (evt.keyCode) {
         case cc.macro.KEY.up:
          this.moveUp();
          break;

         case cc.macro.KEY.down:
          this.moveDown();
          break;

         case cc.macro.KEY.left:
          this.moveLeft();
          break;

         case cc.macro.KEY.right:
          this.moveRight();
        }
      },
      moveUp: function moveUp() {
        for (var col = 0; col < 4; col++) {
          var flatArrCard = [ 0, 0, 0, 0 ];
          for (var row = 0; row < 4; row++) flatArrCard[row] = this._arrBlocks[row][col];
          this.handle(flatArrCard);
        }
      },
      moveDown: function moveDown() {
        for (var col = 0; col < 4; col++) {
          var flatArrCard = [ 0, 0, 0, 0 ];
          for (var row = 0; row < 4; row++) flatArrCard[row] = this._arrBlocks[row][col];
          this.handle(flatArrCard.reverse());
        }
      },
      moveLeft: function moveLeft() {
        for (var row = 0; row < 4; row++) {
          var flatArrCard = [ 0, 0, 0, 0 ];
          for (var col = 0; col < 4; col++) flatArrCard[col] = this._arrBlocks[row][col];
          this.handle(flatArrCard);
        }
      },
      moveRight: function moveRight() {
        for (var row = 0; row < 4; row++) {
          var flatArrCard = [ 0, 0, 0, 0 ];
          for (var col = 0; col < 4; col++) flatArrCard[col] = this._arrBlocks[row][col];
          this.handle(flatArrCard.reverse());
        }
      },
      handle: function handle(arrCard) {
        var arrAction = [];
        for (var i = 1; i < arrCard.length; i++) {
          if ("" == arrCard[i].children[1].getComponent("cc.Label").string) continue;
          var checkCompare = false;
          var objAnim = {
            selfCard: null,
            otherCard: null,
            callBack: null
          };
          for (var j = i - 1; j >= 0; j--) {
            if (true == checkCompare) {
              j = -1;
              break;
            }
            checkCompare = this.changeValueCards(arrCard, i, j, objAnim);
          }
          var cloneObjAnim = Object.assign(objAnim);
          arrAction.push(this.handleMove(cloneObjAnim.selfCard, cloneObjAnim.otherCard, cloneObjAnim.callBack));
        }
        var count = 0;
        async.eachLimit(arrAction, arrAction.length, function() {
          cc.log(arrAction);
          void 0 != arrAction[count] && arrAction[count].delay(count + 1).start();
          count++;
        });
      },
      changeValueCards: function changeValueCards(arrCard, i, j, objAnim) {
        if ("" == arrCard[j].children[1].getComponent("cc.Label").string) {
          if (0 == j) {
            var callBack = function callBack(selfCard, otherCard) {
              otherCard.children[1].getComponent("cc.Label").string = selfCard.children[1].getComponent("cc.Label").string;
              selfCard.children[1].getComponent("cc.Label").string = "";
              selfCard.active = true;
              otherCard.active = true;
            };
            objAnim.selfCard = arrCard[i];
            objAnim.otherCard = arrCard[j];
            objAnim.callBack = callBack;
            return true;
          }
        } else {
          if (arrCard[j].children[1].getComponent("cc.Label").string == arrCard[i].children[1].getComponent("cc.Label").string) {
            var value = 2 * Number(arrCard[i].children[1].getComponent("cc.Label").string);
            this.onPlayCompareSound();
            this.changeScore(value);
            var _callBack = function _callBack(selfCard, otherCard) {
              otherCard.children[1].getComponent("cc.Label").string = 2 * Number(otherCard.children[1].getComponent("cc.Label").string) + "";
              selfCard.children[1].getComponent("cc.Label").string = "";
              var action = cc.sequence(cc.scaleTo(.1, 1.2), cc.delayTime(.3), cc.scaleTo(.1, 1));
              otherCard.runAction(action);
              otherCard.active = true;
              selfCard.active = true;
            };
            objAnim.selfCard = arrCard[i];
            objAnim.otherCard = arrCard[j];
            objAnim.callBack = _callBack;
            return true;
          }
          if (arrCard[j].children[1].getComponent("cc.Label").string != arrCard[i].children[1].getComponent("cc.Label").string) {
            var reValue = j + 1;
            if (reValue != i) {
              var _callBack2 = function _callBack2(selfCard, otherCard) {
                otherCard.children[1].getComponent("cc.Label").string = selfCard.children[1].getComponent("cc.Label").string;
                selfCard.children[1].getComponent("cc.Label").string = "";
                otherCard.active = true;
                selfCard.active = true;
              };
              objAnim.selfCard = arrCard[i];
              objAnim.otherCard = arrCard[reValue];
              objAnim.callBack = _callBack2;
            }
            return true;
          }
        }
      },
      handleMove: function handleMove(selfCard, otherCard, callBack) {
        if (null != selfCard && null != otherCard) {
          var x = otherCard.x;
          var y = otherCard.y;
          var xOld = selfCard.x;
          var yOld = selfCard.y;
          return cc.tween(selfCard).to(.2, {
            position: cc.v2(x, y)
          }).call(callBack(selfCard, otherCard)).to(0, {
            position: cc.v2(xOld, yOld)
          });
        }
      },
      reloadColor: function reloadColor(arrCard) {
        for (var col = 0; col < arrCard.length; col++) for (var row = 0; row < arrCard.length; row++) {
          var number = 0;
          number = "" == arrCard[col][row].children[1].getComponent("cc.Label").string ? 0 : parseInt(arrCard[col][row].children[1].getComponent("cc.Label").string);
          arrCard[col][row].children[0].color = COLOR[number];
        }
      },
      render: function render() {
        for (var col = 0; col < 4; col++) {
          var arrRow = [];
          for (var row = 0; row < 4; row++) {
            var x = 150 * row - 225;
            var y = 225 - 150 * col;
            var newCard = cc.instantiate(this.card);
            newCard.parent = this.node;
            newCard.x = x;
            newCard.y = y;
            newCard.width = 140;
            newCard.height = 140;
            newCard.color = COLOR[0];
            arrRow.push(newCard);
          }
          this._arrBlocks.push(arrRow);
        }
      },
      randomNumber: function randomNumber() {
        var flatArray = this._arrBlocks.flat(Infinity);
        var arrNone = flatArray.filter(function(value) {
          return "" == value.children[1].getComponent("cc.Label").string;
        });
        cc.log(arrNone.length);
        if (0 != arrNone.length) {
          var index = Math.floor(Math.random() * arrNone.length);
          var arrRandomNum = [ 2, 4 ];
          var num = arrRandomNum[Math.floor(Math.random() * arrRandomNum.length)];
          arrNone[index].children[1].getComponent("cc.Label").string = num;
          arrNone[index].color = COLOR[2];
          arrNone[index].active = true;
          arrNone[index].scale = 0;
          var action = cc.scaleTo(.1, 1);
          arrNone[index].runAction(action);
          this.reloadColor(this._arrBlocks);
        } else {
          cc.log("full card");
          cc.log(this._totalScore);
          var checkGameOver = this.checkGameOver();
          if (checkGameOver) cc.log("have compare card"); else {
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.handleKeyDown, this);
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.handleKeyUp, this);
            emitter.instance.emit("GAMEOVER");
            emitter.instance.emit("OPEN_GAMEOVER", this._totalScore);
          }
        }
      },
      checkGameOver: function checkGameOver() {
        for (var x = 0; x < 4; x++) for (var y = 0; y < 4; y++) {
          if (3 == x) continue;
          var self = this._arrBlocks[x][y].getComponent("card").lblCard.string;
          var other = this._arrBlocks[x + 1][y].getComponent("card").lblCard.string;
          if (self == other) return true;
        }
        for (var _x = 0; _x < 4; _x++) for (var _y = 0; _y < 4; _y++) {
          if (3 == _y) continue;
          var _self = this._arrBlocks[_x][_y].getComponent("card").lblCard.string;
          var _other = this._arrBlocks[_x][_y + 1].getComponent("card").lblCard.string;
          if (_self == _other) return true;
        }
        return false;
      },
      changeScore: function changeScore(number) {
        var score = this.updateScore;
        var currentScore = Number(score.string);
        this._totalScore = currentScore + number;
        var actions = [ cc.callFunc(function() {
          currentScore += 1;
        }), cc.delayTime(.01), cc.callFunc(function() {
          score.string = currentScore;
        }) ];
        var scale = cc.sequence(cc.scaleTo(.15, 1.2), cc.scaleTo(.15, 1));
        score.node.runAction(cc.spawn(cc.repeat(cc.sequence(actions), number), scale));
      },
      getBestScore: function getBestScore() {
        var data = JSON.parse(cc.sys.localStorage.getItem("users"));
        if (null != data) {
          data = data.sort(function(a, b) {
            return parseInt(b.score) - parseInt(a.score);
          });
          emitter.instance.emit("BEST_SCORE", data[0].score);
        }
      },
      onPlayGame: function onPlayGame() {
        this.node.removeAllChildren();
        this._arrBlocks = [];
        this.updateScore.string = "0";
        this.render();
        this.randomNumber();
        this.getBestScore();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.handleKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.handleKeyUp, this);
        this.eventTouchHanlder();
      }
    });
    cc._RF.pop();
  }, {
    async: 3,
    color: "color",
    mEmitter: "mEmitter"
  } ],
  playingHandle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2681eMNollL85TUYZQnvkZL", "playingHandle");
    "use strict";
    var emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        lblScore: cc.Label,
        btnReplay: cc.Button,
        btnQuit: cc.Button,
        lblBestScore: cc.Label,
        restartAudio: {
          default: null,
          type: cc.AudioClip
        },
        replay: null,
        quit: null
      },
      restartSound: function restartSound() {
        cc.audioEngine.playEffect(this.restartAudio, false);
      },
      onLoad: function onLoad() {
        this.bestScore = this.onBestScore.bind(this);
        emitter.instance.registerEvent("BEST_SCORE", this.bestScore);
      },
      start: function start() {
        this.btnReplay.node.on("click", this.onReplay, this);
        this.btnQuit.node.on("click", this.onQuit, this);
      },
      onReplay: function onReplay() {
        var action = cc.callFunc(this.restartSound, this);
        this.node.runAction(action);
        emitter.instance.emit("PLAYING");
        cc.log("replay");
      },
      onQuit: function onQuit() {
        emitter.instance.emit("DEFAULT");
        cc.log("quit");
      },
      onBestScore: function onBestScore(bestScore) {
        this.lblBestScore.string = bestScore;
      }
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ],
  rankHandle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "771c5yYjkNE/5RCQRT6yqX8", "rankHandle");
    "use strict";
    var emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        rank: cc.Layout,
        prefab_item: cc.Prefab,
        btnClose: cc.Button,
        openRank: null,
        render: null,
        clickClose: null
      },
      onLoad: function onLoad() {
        this.openRank = this.doOpenRank.bind(this);
        this.clickClose = this.doClickClose.bind(this);
        this.render = this.doRender.bind(this);
        emitter.instance.registerEvent("OPEN_RANK", this.openRank);
        emitter.instance.registerEvent("RENDER", this.render);
      },
      start: function start() {
        this.btnClose.node.on("click", this.clickClose, this);
      },
      doClickClose: function doClickClose() {
        emitter.instance.emit("DEFAULT", this.node);
        this.removeItem();
      },
      doOpenRank: function doOpenRank() {},
      doRender: function doRender() {
        var data = JSON.parse(cc.sys.localStorage.getItem("users"));
        if (null != data) {
          data = data.sort(function(a, b) {
            return parseInt(b.score) - parseInt(a.score);
          });
          this.renderAllUser(data);
          emitter.instance.emit("BEST_SCORE", data[0].score);
        }
      },
      renderAllUser: function renderAllUser(data) {
        var _this = this;
        data.forEach(function(user, index) {
          _this.renderUser(user, index);
        });
      },
      renderUser: function renderUser(user, index) {
        var item = cc.instantiate(this.prefab_item);
        item.parent = this.rank.node;
        item.active = true;
        item.children[0].getComponent("cc.Label").string = index + 1;
        item.children[1].getComponent("cc.Label").string = user.name;
        item.children[2].getComponent("cc.Label").string = user.score;
        return item;
      },
      removeItem: function removeItem() {
        this.rank.node.removeAllChildren();
      }
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ],
  startHandle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "67fa7fmcH9PQap9vA5udek6", "startHandle");
    "use strict";
    var User = require("User");
    var emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        btnPlay: cc.Button,
        btnRank: cc.Button,
        startAudio: {
          default: null,
          type: cc.AudioClip
        },
        openStart: null,
        clickPlay: null,
        users: []
      },
      startSound: function startSound() {
        cc.audioEngine.playEffect(this.startAudio, false);
      },
      onLoad: function onLoad() {
        this.openStart = this.doOpenStart.bind(this);
        emitter.instance.registerEvent("OPEN_START", this.openStart);
      },
      start: function start() {
        this.btnRank.node.on("click", this.onClickRank, this);
        this.btnPlay.node.on("click", this.onClickPlay, this);
      },
      onClickPlay: function onClickPlay() {
        var action = cc.callFunc(this.startSound, this);
        this.node.runAction(action);
        emitter.instance.emit("PLAYING", this.node);
      },
      onClickRank: function onClickRank() {
        emitter.instance.emit("RANK", this.node);
        emitter.instance.emit("RENDER");
      },
      doOpenStart: function doOpenStart() {}
    });
    cc._RF.pop();
  }, {
    User: "User",
    mEmitter: "mEmitter"
  } ]
}, {}, [ "gameOverHandle", "playingHandle", "rankHandle", "startHandle", "card", "color", "controller", "User", "main", "mEmitter" ]);