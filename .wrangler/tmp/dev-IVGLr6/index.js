var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// .wrangler/tmp/bundle-sBcvvS/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
var init_strip_cf_connecting_ip_header = __esm({
  ".wrangler/tmp/bundle-sBcvvS/strip-cf-connecting-ip-header.js"() {
    "use strict";
    __name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        return Reflect.apply(target, thisArg, [
          stripCfConnectingIPHeader.apply(null, argArray)
        ]);
      }
    });
  }
});

// node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    __name(PerformanceEntry, "PerformanceEntry");
    PerformanceMark = /* @__PURE__ */ __name(class PerformanceMark2 extends PerformanceEntry {
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    }, "PerformanceMark");
    PerformanceMeasure = class extends PerformanceEntry {
      entryType = "measure";
    };
    __name(PerformanceMeasure, "PerformanceMeasure");
    PerformanceResourceTiming = class extends PerformanceEntry {
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    __name(PerformanceResourceTiming, "PerformanceResourceTiming");
    PerformanceObserverEntryList = class {
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    __name(PerformanceObserverEntryList, "PerformanceObserverEntryList");
    Performance = class {
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    __name(Performance, "Performance");
    PerformanceObserver = class {
      __unenv__ = true;
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    __name(PerformanceObserver, "PerformanceObserver");
    __publicField(PerformanceObserver, "supportedEntryTypes", []);
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from "node:net";
var ReadStream;
var init_read_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class extends Socket {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      isRaw = false;
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
      isTTY = false;
    };
    __name(ReadStream, "ReadStream");
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var WriteStream;
var init_write_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class extends Socket2 {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      columns = 80;
      rows = 24;
      isTTY = false;
    };
    __name(WriteStream, "WriteStream");
  }
});

// node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    Process = class extends EventEmitter {
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return "";
      }
      get versions() {
        return {};
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      ref() {
      }
      unref() {
      }
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: () => 0 });
      mainModule = void 0;
      domain = void 0;
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
    __name(Process, "Process");
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, exit, platform, nextTick, unenvProcess, abort, addListener, allowedNodeEnvironmentFlags, hasUncaughtExceptionCaptureCallback, setUncaughtExceptionCaptureCallback, loadEnvFile, sourceMapsEnabled, arch, argv, argv0, chdir, config, connected, constrainedMemory, availableMemory, cpuUsage, cwd, debugPort, dlopen, disconnect, emit, emitWarning, env, eventNames, execArgv, execPath, finalization, features, getActiveResourcesInfo, getMaxListeners, hrtime3, kill, listeners, listenerCount, memoryUsage, on, off, once, pid, ppid, prependListener, prependOnceListener, rawListeners, release, removeAllListeners, removeListener, report, resourceUsage, setMaxListeners, setSourceMapsEnabled, stderr, stdin, stdout, title, throwDeprecation, traceDeprecation, umask, uptime, version, versions, domain, initgroups, moduleLoadList, reallyExit, openStdin, assert2, binding, send, exitCode, channel, getegid, geteuid, getgid, getgroups, getuid, setegid, seteuid, setgid, setgroups, setuid, permission, mainModule, _events, _eventsCount, _exiting, _maxListeners, _debugEnd, _debugProcess, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, _disconnect, _handleQueue, _pendingMessage, _channel, _send, _linkedBinding, _process, process_default;
var init_process2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    ({ exit, platform, nextTick } = getBuiltinModule(
      "node:process"
    ));
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      nextTick
    });
    ({
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      finalization,
      features,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      on,
      off,
      once,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// src/repositories/database.ts
var Database;
var init_database = __esm({
  "src/repositories/database.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Database = class {
      constructor(db) {
        this.db = db;
      }
      async query(sql, params = []) {
        const stmt = this.db.prepare(sql);
        const bound = params.length > 0 ? stmt.bind(...params) : stmt;
        const result = await bound.all();
        return result.results;
      }
      async queryOne(sql, params = []) {
        const stmt = this.db.prepare(sql);
        const bound = params.length > 0 ? stmt.bind(...params) : stmt;
        return await bound.first();
      }
      async execute(sql, params = []) {
        const stmt = this.db.prepare(sql);
        const bound = params.length > 0 ? stmt.bind(...params) : stmt;
        return await bound.run();
      }
      async batch(statements) {
        return await this.db.batch(statements);
      }
      async transaction(fn) {
        await this.execute("BEGIN TRANSACTION");
        try {
          const result = await fn(this);
          await this.execute("COMMIT");
          return result;
        } catch (error3) {
          await this.execute("ROLLBACK");
          throw error3;
        }
      }
      getD1() {
        return this.db;
      }
    };
    __name(Database, "Database");
  }
});

// src/repositories/auth.repository.ts
var AuthRepository;
var init_auth_repository = __esm({
  "src/repositories/auth.repository.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    AuthRepository = class {
      constructor(db) {
        this.db = db;
      }
      async getUserSettings() {
        const result = await this.db.queryOne(
          "SELECT value FROM settings WHERE key = ?",
          ["array_user"]
        );
        if (!result) {
          return { reg: "1", email: "1", point: "100" };
        }
        return JSON.parse(result.value);
      }
      async createUser(user, passwordHash, sid) {
        const result = await this.db.execute(
          `INSERT INTO users (group_id, status, username, password_hash, sid, email, points)
       VALUES (?, ?, ?, ?, ?, NULLIF(?, ''), ?)`,
          [user.group_id, user.status, user.username, passwordHash, sid, user.email, user.points]
        );
        return result.meta.last_row_id;
      }
      async findLoginUser(login) {
        const result = await this.db.queryOne(
          `SELECT id, group_id, status, username, COALESCE(email, '') as email, points, password_hash, sid, remember_token_hash, created_at, updated_at
       FROM users WHERE username = ? OR email = ?`,
          [login, login.toLowerCase()]
        );
        if (!result)
          return null;
        return { user: result };
      }
      async updatePassword(uid, passwordHash, sid) {
        await this.db.execute(
          `UPDATE users SET password_hash = ?, sid = ?, updated_at = strftime('%s','now') WHERE id = ?`,
          [passwordHash, sid, uid]
        );
      }
    };
    __name(AuthRepository, "AuthRepository");
  }
});

// src/repositories/api.repository.ts
var APIRepository;
var init_api_repository = __esm({
  "src/repositories/api.repository.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    APIRepository = class {
      constructor(db) {
        this.db = db;
      }
      async authenticateSession(tokenHash) {
        const result = await this.db.queryOne(
          `SELECT s.id, s.uid, 'session' as name, s.token_hint, s.expires_at,
              u.id as user_id, u.group_id, u.status, u.username, COALESCE(u.email, '') as email, u.points
       FROM sessions s
       JOIN users u ON u.id = s.uid
       WHERE s.token_hash = ? AND u.status != 0`,
          [tokenHash]
        );
        if (!result)
          return null;
        if (result.expires_at > 0 && result.expires_at < Math.floor(Date.now() / 1e3))
          return null;
        await this.touchLastUsedAt("sessions", result.id);
        return {
          id: result.id,
          uid: result.uid,
          name: result.name,
          token_hint: result.token_hint,
          expires_at: result.expires_at,
          user: {
            id: result.user_id,
            group_id: result.group_id,
            status: result.status,
            username: result.username,
            email: result.email,
            points: result.points
          }
        };
      }
      async authenticateToken(tokenHash) {
        const result = await this.db.queryOne(
          `SELECT t.id, t.uid, t.name, t.token_hint, t.expires_at,
              u.id as user_id, u.group_id, u.status, u.username, COALESCE(u.email, '') as email, u.points
       FROM api_tokens t
       JOIN users u ON u.id = t.uid
       WHERE t.token_hash = ? AND u.status != 0`,
          [tokenHash]
        );
        if (!result)
          return null;
        if (result.expires_at > 0 && result.expires_at < Math.floor(Date.now() / 1e3))
          return null;
        await this.touchLastUsedAt("api_tokens", result.id);
        return {
          id: result.id,
          uid: result.uid,
          name: result.name,
          token_hint: result.token_hint,
          expires_at: result.expires_at,
          user: {
            id: result.user_id,
            group_id: result.group_id,
            status: result.status,
            username: result.username,
            email: result.email,
            points: result.points
          }
        };
      }
      async touchLastUsedAt(table3, id) {
        await this.db.execute(
          `UPDATE ${table3} SET last_used_at = strftime('%s','now')
       WHERE id = ? AND last_used_at < strftime('%s','now') - 300`,
          [id]
        );
      }
      async createSession(uid, tokenHash, tokenHint4, expiresAt) {
        const result = await this.db.execute(
          `INSERT INTO sessions (uid, token_hash, token_hint, expires_at) VALUES (?, ?, ?, ?)`,
          [uid, tokenHash, tokenHint4, expiresAt]
        );
        return result.meta.last_row_id;
      }
      async listAvailableDomains(gid, keyword) {
        let query = `SELECT id, domain, points_cost, COALESCE(description, '') as description, record_types, beian, require_review,
                        provider_key, COALESCE(provider_config_ciphertext, '') as provider_config_ciphertext, remote_zone_id
                 FROM domains
                 WHERE (group_policy = '0' OR instr(',' || group_policy || ',', ',' || ? || ',') > 0)`;
        const params = [gid];
        if (keyword) {
          query += ` AND lower(domain) LIKE ?`;
          params.push(`%${keyword.toLowerCase()}%`);
        }
        query += ` ORDER BY id DESC`;
        return await this.db.query(query, params);
      }
      async listPublicDomains() {
        const results = await this.db.query(
          `SELECT id, domain, points_cost, COALESCE(description, '') as description, record_types, beian, require_review, group_policy
       FROM domains
       ORDER BY id DESC`
        );
        return results.filter((r) => {
          const groups = r.group_policy.split(",").map((g) => g.trim());
          return !(groups.length > 0 && groups.every((g) => g === "99"));
        });
      }
      async listSubdomains(uid, status, keyword) {
        let query = `SELECT s.id, s.uid, s.did, s.name, s.full_domain, s.status, COALESCE(s.purpose, '') as purpose,
                        COALESCE(s.reject_reason, '') as reject_reason, COALESCE(s.reviewed_by, 0) as reviewed_by,
                        COALESCE(s.reviewed_at, 0) as reviewed_at, s.created_at,
                        d.domain, d.points_cost, d.record_types, COUNT(r.id) as record_count
                 FROM subdomains s
                 JOIN domains d ON d.id = s.did
                 LEFT JOIN records r ON r.subdomain_id = s.id
                 WHERE s.uid = ?`;
        const params = [uid];
        if (status !== void 0) {
          query += ` AND s.status = ?`;
          params.push(status);
        }
        if (keyword) {
          query += ` AND (lower(s.name) LIKE ? OR lower(s.full_domain) LIKE ? OR lower(d.domain) LIKE ? OR
                     lower(COALESCE(s.purpose, '')) LIKE ? OR lower(COALESCE(s.reject_reason, '')) LIKE ?)`;
          const kw = `%${keyword.toLowerCase()}%`;
          params.push(kw, kw, kw, kw, kw);
        }
        query += ` GROUP BY s.id, d.id ORDER BY s.id DESC`;
        return await this.db.query(query, params);
      }
      async listRecords(uid, did, subdomainId, type, keyword) {
        let query = `SELECT r.id, r.did, COALESCE(r.subdomain_id, 0) as subdomain_id, r.name, r.type, r.value, r.line_id, COALESCE(r.line, '') as line,
                        COALESCE(d.domain, '') as domain, COALESCE(s.name, '') as subdomain_name, COALESCE(s.full_domain, '') as subdomain
                 FROM records r
                 LEFT JOIN domains d ON d.id = r.did
                 LEFT JOIN subdomains s ON s.id = r.subdomain_id
                 WHERE r.uid = ?`;
        const params = [uid];
        if (did) {
          query += ` AND r.did = ?`;
          params.push(did);
        }
        if (subdomainId) {
          query += ` AND r.subdomain_id = ?`;
          params.push(subdomainId);
        }
        if (type) {
          query += ` AND r.type = ?`;
          params.push(type.toUpperCase());
        }
        if (keyword) {
          query += ` AND (lower(COALESCE(s.full_domain, '')) LIKE ? OR lower(r.name) LIKE ? OR lower(r.type) LIKE ? OR
                     lower(r.value) LIKE ? OR lower(COALESCE(r.line, '')) LIKE ?)`;
          const kw = `%${keyword.toLowerCase()}%`;
          params.push(kw, kw, kw, kw, kw);
        }
        query += ` ORDER BY r.id DESC`;
        return await this.db.query(query, params);
      }
      async listTokens(uid) {
        return await this.db.query(
          `SELECT id, name, token_hint, last_used_at, expires_at, created_at
       FROM api_tokens WHERE uid = ? AND name != 'login' ORDER BY id DESC`,
          [uid]
        );
      }
      async pointsOverview(uid, action, keyword, since) {
        const user = await this.db.queryOne("SELECT points FROM users WHERE id = ?", [uid]);
        if (!user)
          throw new Error("User not found");
        const monthStart = /* @__PURE__ */ new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        const monthStartUnix = Math.floor(monthStart.getTime() / 1e3);
        const spent = await this.db.queryOne(
          `SELECT COALESCE(SUM(CASE WHEN points < 0 THEN -points ELSE 0 END), 0) as total_spent,
              COALESCE(SUM(CASE WHEN points < 0 AND created_at >= ? THEN -points ELSE 0 END), 0) as month_spent
       FROM point_records WHERE uid = ?`,
          [monthStartUnix, uid]
        );
        const actions = await this.db.query(
          `SELECT action FROM point_records WHERE uid = ? AND COALESCE(action, '') != '' GROUP BY action ORDER BY action ASC`,
          [uid]
        );
        let query = `SELECT id, action, points, rest, COALESCE(remark, '') as remark, created_at FROM point_records WHERE uid = ?`;
        const params = [uid];
        if (action) {
          query += ` AND action = ?`;
          params.push(action);
        }
        if (since) {
          query += ` AND created_at >= ?`;
          params.push(since);
        }
        if (keyword) {
          query += ` AND (lower(action) LIKE ? OR lower(COALESCE(remark, '')) LIKE ?)`;
          const kw = `%${keyword.toLowerCase()}%`;
          params.push(kw, kw);
        }
        query += ` ORDER BY id DESC LIMIT 100`;
        const recentRecords = await this.db.query(query, params);
        return {
          balance: user.points,
          total_spent: spent?.total_spent || 0,
          month_spent: spent?.month_spent || 0,
          actions: actions.map((a) => a.action),
          recent_records: recentRecords
        };
      }
      async createToken(uid, name, tokenHash, tokenHint4, expiresAt) {
        const result = await this.db.execute(
          `INSERT INTO api_tokens (uid, name, token_hash, token_hint, expires_at) VALUES (?, ?, ?, ?, ?)`,
          [uid, name, tokenHash, tokenHint4, expiresAt]
        );
        return result.meta.last_row_id;
      }
      async deleteToken(uid, id) {
        const result = await this.db.execute(
          `DELETE FROM api_tokens WHERE uid = ? AND id = ?`,
          [uid, id]
        );
        return result.meta.changes > 0;
      }
    };
    __name(APIRepository, "APIRepository");
  }
});

// src/repositories/record.repository.ts
var RecordRepository;
var init_record_repository = __esm({
  "src/repositories/record.repository.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    RecordRepository = class {
      constructor(db) {
        this.db = db;
      }
      async getUser(id) {
        return await this.db.queryOne(
          `SELECT id, group_id, status, username, COALESCE(email, '') as email, points FROM users WHERE id = ?`,
          [id]
        );
      }
      async getDomainForGroup(did, gid) {
        const result = await this.db.queryOne(
          `SELECT id, provider_key, COALESCE(provider_config_ciphertext, '') as provider_config_ciphertext, remote_zone_id, domain,
              group_policy, record_types, beian, points_cost, require_review, COALESCE(description, '') as description
       FROM domains
       WHERE id = ? AND (group_policy = '0' OR instr(',' || group_policy || ',', ',' || ? || ',') > 0)`,
          [did, gid]
        );
        if (!result)
          return null;
        return {
          ...result,
          record_types: result.record_types.split(",").map((t) => t.trim().toUpperCase()).filter((t) => t)
        };
      }
      async getSubdomainForUser(id, uid) {
        const result = await this.db.queryOne(
          `SELECT s.id, s.uid, s.did, s.name, s.full_domain, s.status, COALESCE(s.purpose, '') as purpose,
              COALESCE(s.reject_reason, '') as reject_reason, COALESCE(s.reviewed_by, 0) as reviewed_by,
              COALESCE(s.reviewed_at, 0) as reviewed_at, s.created_at, s.updated_at,
              d.id as domain_id, d.provider_key, d.provider_config_ciphertext, d.remote_zone_id, d.domain,
              d.group_policy, d.record_types, d.beian, d.points_cost, d.require_review, d.description
       FROM subdomains s
       JOIN domains d ON d.id = s.did
       WHERE s.id = ? AND s.uid = ?`,
          [id, uid]
        );
        if (!result)
          return null;
        return {
          subdomain: {
            id: result.id,
            uid: result.uid,
            did: result.did,
            name: result.name,
            full_domain: result.full_domain,
            status: result.status,
            purpose: result.purpose,
            reject_reason: result.reject_reason,
            reviewed_by: result.reviewed_by,
            reviewed_at: result.reviewed_at,
            created_at: result.created_at,
            updated_at: result.updated_at
          },
          domain: {
            id: result.domain_id,
            provider_key: result.provider_key,
            provider_config_ciphertext: result.provider_config_ciphertext,
            remote_zone_id: result.remote_zone_id,
            domain: result.domain,
            group_policy: result.group_policy,
            record_types: result.record_types.split(",").map((t) => t.trim().toUpperCase()).filter((t) => t),
            beian: result.beian,
            points_cost: result.points_cost,
            require_review: result.require_review,
            description: result.description
          }
        };
      }
      async getRecordForUser(id, uid) {
        return await this.db.queryOne(
          `SELECT id, uid, did, COALESCE(subdomain_id, 0) as subdomain_id, record_id, name, type, value, line_id, COALESCE(line, '') as line
       FROM records WHERE id = ? AND uid = ?`,
          [id, uid]
        );
      }
      async recordNameExists(did, name, recordType, ignoreId) {
        let query = `SELECT COUNT(1) as count FROM records WHERE did = ? AND name = ? AND (type = ? OR type = 'CNAME' OR ? = 'CNAME')`;
        const params = [did, name, recordType, recordType];
        if (ignoreId > 0) {
          query += ` AND id != ?`;
          params.push(ignoreId);
        }
        const result = await this.db.queryOne(query, params);
        return (result?.count || 0) > 0;
      }
      async allowUnlimitedSubdomainRecords() {
        const result = await this.db.queryOne(
          `SELECT value FROM settings WHERE key = ?`,
          ["array_dns"]
        );
        if (!result)
          return true;
        const settings = JSON.parse(result.value);
        return settings.unlimited_subdomain_records === "1";
      }
      async applyCreatedRecord(user, domain2, record, log3) {
        await this.db.transaction(async (db) => {
          await db.execute(
            `INSERT INTO records (uid, did, subdomain_id, record_id, name, type, value, line_id, line)
         VALUES (?, ?, NULLIF(?, 0), ?, ?, ?, ?, ?, ?)`,
            [user.id, domain2.id, record.subdomain_id, record.record_id, record.name, record.type, record.value, record.line_id, record.line]
          );
          await this.insertOperationLog(db, log3);
        });
      }
      async applyUpdatedRecord(recordId, record, log3) {
        await this.db.transaction(async (db) => {
          const result = await db.execute(
            `UPDATE records
         SET subdomain_id = NULLIF(?, 0), record_id = ?, name = ?, type = ?, value = ?, line_id = ?, line = ?, updated_at = strftime('%s','now')
         WHERE id = ? AND uid = ?`,
            [record.subdomain_id, record.record_id, record.name, record.type, record.value, record.line_id, record.line, record.id, record.uid]
          );
          if (result.meta.changes !== 1)
            throw new Error("Record not found or no changes");
          await this.insertOperationLog(db, log3);
        });
      }
      async applyDeletedRecord(recordId, log3) {
        await this.db.transaction(async (db) => {
          const result = await db.execute(`DELETE FROM records WHERE id = ?`, [recordId]);
          if (result.meta.changes !== 1)
            throw new Error("Record not found");
          await this.insertOperationLog(db, log3);
        });
      }
      async enqueueDNSWriteJob(job) {
        if (!job.status)
          job.status = "pending";
        await this.db.execute(
          `INSERT INTO dns_write_jobs (uid, source, provider_key, domain, record_name, record_type, value_digest, remote_record_id, operation, status, last_error, payload)
       VALUES (NULLIF(?, 0), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [job.uid, job.source, job.provider_key, job.domain, job.record_name, job.record_type, job.value_digest, job.remote_record_id, job.operation, job.status, job.last_error, job.payload]
        );
      }
      async insertOperationLog(db, log3) {
        await db.execute(
          `INSERT INTO operation_logs (uid, admin_uid, source, target_type, target_id, ip, action, message, extra)
       VALUES (NULLIF(?, 0), NULLIF(?, 0), ?, ?, ?, ?, ?, ?, ?)`,
          [log3.uid, log3.admin_uid, log3.source, log3.target_type, log3.target_id, log3.ip, log3.action, log3.message, log3.extra]
        );
      }
    };
    __name(RecordRepository, "RecordRepository");
  }
});

// src/models/subdomain.ts
var SubdomainStatus;
var init_subdomain = __esm({
  "src/models/subdomain.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    SubdomainStatus = {
      Active: 1,
      Disabled: 0,
      Pending: 2,
      Rejected: 3
    };
  }
});

// src/repositories/subdomain.repository.ts
var SubdomainRepository;
var init_subdomain_repository = __esm({
  "src/repositories/subdomain.repository.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_subdomain();
    SubdomainRepository = class {
      constructor(db) {
        this.db = db;
      }
      async registerSubdomain(user, domain2, name, purpose, requireReview, log3) {
        return await this.db.transaction(async (db) => {
          const status = requireReview ? SubdomainStatus.Pending : SubdomainStatus.Active;
          const fullDomain = `${name}.${domain2.domain}`;
          const result = await db.execute(
            `INSERT INTO subdomains (uid, did, name, full_domain, status, purpose) VALUES (?, ?, ?, ?, ?, ?)`,
            [user.id, domain2.id, name, fullDomain, status, purpose]
          );
          const subdomain = await db.queryOne(
            `SELECT id, uid, did, name, full_domain, status, COALESCE(purpose, '') as purpose,
                COALESCE(reject_reason, '') as reject_reason, COALESCE(reviewed_by, 0) as reviewed_by,
                COALESCE(reviewed_at, 0) as reviewed_at, created_at, updated_at
         FROM subdomains WHERE id = ?`,
            [result.meta.last_row_id]
          );
          if (!subdomain)
            throw new Error("Failed to create subdomain");
          if (domain2.points_cost > 0 && status === SubdomainStatus.Active) {
            await this.deductPoints(db, user.id, domain2.points_cost, `\u6CE8\u518C\u4E8C\u7EA7\u57DF\u540D [${fullDomain}]`);
          }
          await this.insertOperationLog(db, log3);
          return subdomain;
        });
      }
      async deleteSubdomain(subdomain, log3) {
        await this.db.transaction(async (db) => {
          const result = await db.execute(`DELETE FROM subdomains WHERE id = ?`, [subdomain.id]);
          if (result.meta.changes !== 1)
            throw new Error("Subdomain not found");
          await this.insertOperationLog(db, log3);
        });
      }
      async cancelPendingSubdomain(subdomain, domain2, pointRemark, log3) {
        await this.db.transaction(async (db) => {
          const result = await db.execute(`DELETE FROM subdomains WHERE id = ? AND status = ?`, [subdomain.id, SubdomainStatus.Pending]);
          if (result.meta.changes !== 1)
            throw new Error("Pending subdomain not found");
          if (domain2.points_cost > 0) {
            await this.refundPoints(db, subdomain.uid, domain2.points_cost, pointRemark);
          }
          await this.insertOperationLog(db, log3);
        });
      }
      async approveSubdomain(subdomain, log3) {
        await this.db.transaction(async (db) => {
          const result = await db.execute(
            `UPDATE subdomains SET status = ?, reviewed_at = strftime('%s','now'), updated_at = strftime('%s','now') WHERE id = ? AND status = ?`,
            [SubdomainStatus.Active, subdomain.id, SubdomainStatus.Pending]
          );
          if (result.meta.changes !== 1)
            throw new Error("Pending subdomain not found");
          await this.insertOperationLog(db, log3);
        });
      }
      async rejectPendingSubdomain(subdomain, domain2, reason, pointRemark, log3) {
        await this.db.transaction(async (db) => {
          const result = await db.execute(
            `UPDATE subdomains SET status = ?, reject_reason = ?, reviewed_at = strftime('%s','now'), updated_at = strftime('%s','now') WHERE id = ? AND status = ?`,
            [SubdomainStatus.Rejected, reason, subdomain.id, SubdomainStatus.Pending]
          );
          if (result.meta.changes !== 1)
            throw new Error("Pending subdomain not found");
          if (domain2.points_cost > 0) {
            await this.refundPoints(db, subdomain.uid, domain2.points_cost, pointRemark);
          }
          await this.insertOperationLog(db, log3);
        });
      }
      async countRecordsForSubdomain(subdomainId, uid) {
        const result = await this.db.queryOne(
          `SELECT COUNT(1) as count FROM records WHERE subdomain_id = ? AND uid = ?`,
          [subdomainId, uid]
        );
        return result?.count || 0;
      }
      async deductPoints(db, uid, points, remark) {
        const user = await db.queryOne(`SELECT points FROM users WHERE id = ?`, [uid]);
        if (!user || user.points < points)
          throw new Error("Insufficient points");
        const newBalance = user.points - points;
        await db.execute(`UPDATE users SET points = ?, updated_at = strftime('%s','now') WHERE id = ?`, [newBalance, uid]);
        await db.execute(
          `INSERT INTO point_records (uid, action, points, rest, remark) VALUES (?, ?, ?, ?, ?)`,
          [uid, "\u6CE8\u518C\u57DF\u540D\u6263\u8D39", -points, newBalance, remark]
        );
      }
      async refundPoints(db, uid, points, remark) {
        const user = await db.queryOne(`SELECT points FROM users WHERE id = ?`, [uid]);
        if (!user)
          throw new Error("User not found");
        const newBalance = user.points + points;
        await db.execute(`UPDATE users SET points = ?, updated_at = strftime('%s','now') WHERE id = ?`, [newBalance, uid]);
        await db.execute(
          `INSERT INTO point_records (uid, action, points, rest, remark) VALUES (?, ?, ?, ?, ?)`,
          [uid, "\u57DF\u540D\u9000\u6B3E", points, newBalance, remark]
        );
      }
      async insertOperationLog(db, log3) {
        await db.execute(
          `INSERT INTO operation_logs (uid, admin_uid, source, target_type, target_id, ip, action, message, extra)
       VALUES (NULLIF(?, 0), NULLIF(?, 0), ?, ?, ?, ?, ?, ?, ?)`,
          [log3.uid, log3.admin_uid, log3.source, log3.target_type, log3.target_id, log3.ip, log3.action, log3.message, log3.extra]
        );
      }
    };
    __name(SubdomainRepository, "SubdomainRepository");
  }
});

// src/repositories/points.repository.ts
var PointsRepository;
var init_points_repository = __esm({
  "src/repositories/points.repository.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    PointsRepository = class {
      constructor(db) {
        this.db = db;
      }
      async adjustUserPoints(adjustment) {
        return await this.db.transaction(async (db) => {
          const user = await db.queryOne(
            "SELECT points FROM users WHERE id = ?",
            [adjustment.userId]
          );
          if (!user) {
            throw new Error("USER_NOT_FOUND");
          }
          const newBalance = user.points + adjustment.delta;
          if (newBalance < 0) {
            throw new Error("INSUFFICIENT_POINTS");
          }
          await db.execute(
            "UPDATE users SET points = ?, updated_at = strftime('%s','now') WHERE id = ?",
            [newBalance, adjustment.userId]
          );
          await db.execute(
            `INSERT INTO point_records (uid, admin_uid, action, points, rest, remark) 
         VALUES (?, ?, ?, ?, ?, ?)`,
            [adjustment.userId, adjustment.adminId, adjustment.action, adjustment.delta, newBalance, adjustment.remark]
          );
          await db.execute(
            `INSERT INTO operation_logs (uid, admin_uid, source, target_type, target_id, action, message, extra)
         VALUES (?, ?, 'admin', 'user_points', ?, ?, ?, ?)`,
            [adjustment.userId, adjustment.adminId, adjustment.userId, adjustment.log.action, adjustment.log.message, adjustment.log.extra]
          );
          return { newBalance };
        });
      }
      async getPointRecords(userId, limit = 100, offset = 0) {
        return await this.db.query(
          `SELECT id, uid, admin_uid, action, points, rest, remark, created_at 
       FROM point_records 
       WHERE uid = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
          [userId, limit, offset]
        );
      }
      async getPointRecordsCount(userId) {
        const result = await this.db.queryOne(
          "SELECT COUNT(*) as count FROM point_records WHERE uid = ?",
          [userId]
        );
        return result?.count || 0;
      }
    };
    __name(PointsRepository, "PointsRepository");
  }
});

// src/repositories/admin.repository.ts
var AdminRepository;
var init_admin_repository = __esm({
  "src/repositories/admin.repository.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    AdminRepository = class {
      constructor(db) {
        this.db = db;
      }
      async getUsers(limit = 100, offset = 0) {
        return await this.db.query(
          `SELECT u.id, u.username, u.email, u.points, u.status, u.group_id, u.created_at,
              g.name as group_name
       FROM users u
       LEFT JOIN groups g ON g.id = u.group_id
       WHERE u.id != 0
       ORDER BY u.id DESC
       LIMIT ? OFFSET ?`,
          [limit, offset]
        );
      }
      async getUsersCount() {
        const result = await this.db.queryOne(
          "SELECT COUNT(*) as count FROM users WHERE id != 0"
        );
        return result?.count || 0;
      }
      async getUserById(id) {
        return await this.db.queryOne(
          `SELECT u.id, u.username, u.email, u.points, u.status, u.group_id, u.created_at,
              g.name as group_name
       FROM users u
       LEFT JOIN groups g ON g.id = u.group_id
       WHERE u.id = ?`,
          [id]
        );
      }
      async createUser(username, email, passwordHash, groupId = 100, status = 2, points = 0) {
        const result = await this.db.execute(
          `INSERT INTO users (username, email, password_hash, group_id, status, points, sid) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [username, email, passwordHash, groupId, status, points, ""]
        );
        return result.meta.last_row_id;
      }
      async updateUser(id, updates) {
        const sets = [];
        const values = [];
        if (updates.email !== void 0) {
          sets.push("email = ?");
          values.push(updates.email);
        }
        if (updates.group_id !== void 0) {
          sets.push("group_id = ?");
          values.push(updates.group_id);
        }
        if (updates.status !== void 0) {
          sets.push("status = ?");
          values.push(updates.status);
        }
        if (updates.points !== void 0) {
          sets.push("points = ?");
          values.push(updates.points);
        }
        if (sets.length > 0) {
          sets.push("updated_at = strftime('%s','now')");
          values.push(id);
          await this.db.execute(
            `UPDATE users SET ${sets.join(", ")} WHERE id = ?`,
            values
          );
        }
      }
      async deleteUser(id) {
        await this.db.execute("DELETE FROM users WHERE id = ? AND id != 0", [id]);
      }
      async getGroups() {
        return await this.db.query(
          `SELECT id, name, created_at
       FROM groups
       ORDER BY id ASC`
        );
      }
      async createGroup(name) {
        const result = await this.db.execute(
          `INSERT INTO groups (name) VALUES (?)`,
          [name]
        );
        return result.meta.last_row_id;
      }
      async deleteGroup(id) {
        await this.db.execute("DELETE FROM groups WHERE id = ?", [id]);
      }
      async getDomains(limit = 100, offset = 0) {
        return await this.db.query(
          `SELECT d.id, d.domain, d.points_cost, d.record_types, d.beian, d.require_review,
              d.description, d.provider_key, d.remote_zone_id, d.created_at
       FROM domains d
       ORDER BY d.id DESC
       LIMIT ? OFFSET ?`,
          [limit, offset]
        );
      }
      async getDomainsCount() {
        const result = await this.db.queryOne(
          "SELECT COUNT(*) as count FROM domains"
        );
        return result?.count || 0;
      }
      async createDomain(domain2, providerKey, remoteZoneId, pointsCost = 0, recordTypes = "A,CNAME", beian = 0, requireReview = 0, description = "") {
        const result = await this.db.execute(
          `INSERT INTO domains (domain, provider_key, remote_zone_id, points_cost, record_types, beian, require_review, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [domain2, providerKey, remoteZoneId, pointsCost, recordTypes, beian, requireReview, description]
        );
        return result.meta.last_row_id;
      }
      async updateDomain(id, updates) {
        const sets = [];
        const values = [];
        for (const [key, value] of Object.entries(updates)) {
          if (value !== void 0) {
            sets.push(`${key} = ?`);
            values.push(value);
          }
        }
        if (sets.length > 0) {
          sets.push("updated_at = strftime('%s','now')");
          values.push(id);
          await this.db.execute(
            `UPDATE domains SET ${sets.join(", ")} WHERE id = ?`,
            values
          );
        }
      }
      async deleteDomain(id) {
        await this.db.execute("DELETE FROM domains WHERE id = ?", [id]);
      }
      async getProviders() {
        return await this.db.query(
          `SELECT key, label, config_ciphertext, created_at, updated_at
       FROM dns_providers
       ORDER BY key ASC`
        );
      }
      async createProvider(key, label, configCiphertext) {
        await this.db.execute(
          `INSERT INTO dns_providers (key, label, config_ciphertext) VALUES (?, ?, ?)`,
          [key, label, configCiphertext]
        );
      }
      async updateProvider(key, updates) {
        const sets = [];
        const values = [];
        if (updates.label !== void 0) {
          sets.push("label = ?");
          values.push(updates.label);
        }
        if (updates.config_ciphertext !== void 0) {
          sets.push("config_ciphertext = ?");
          values.push(updates.config_ciphertext);
        }
        if (sets.length > 0) {
          sets.push("updated_at = strftime('%s','now')");
          values.push(key);
          await this.db.execute(
            `UPDATE dns_providers SET ${sets.join(", ")} WHERE key = ?`,
            values
          );
        }
      }
      async deleteProvider(key) {
        await this.db.execute("DELETE FROM dns_providers WHERE key = ?", [key]);
      }
      async getSubdomains(limit = 100, offset = 0, status) {
        let query = `SELECT s.id, s.uid, s.did, s.name, s.full_domain, s.status, s.purpose,
                        s.reject_reason, s.reviewed_by, s.reviewed_at, s.created_at,
                        u.username, d.domain, d.points_cost as registration_cost,
                        COUNT(r.id) as record_count
                 FROM subdomains s
                 LEFT JOIN users u ON u.id = s.uid
                 LEFT JOIN domains d ON d.id = s.did
                 LEFT JOIN records r ON r.subdomain_id = s.id`;
        const values = [];
        if (status !== void 0) {
          query += " WHERE s.status = ?";
          values.push(status);
        }
        query += " GROUP BY s.id, u.id, d.id ORDER BY s.id DESC LIMIT ? OFFSET ?";
        values.push(limit, offset);
        return await this.db.query(query, values);
      }
      async getSubdomainsCount(status) {
        let query = "SELECT COUNT(*) as count FROM subdomains";
        const values = [];
        if (status !== void 0) {
          query += " WHERE status = ?";
          values.push(status);
        }
        const result = await this.db.queryOne(query, values);
        return result?.count || 0;
      }
      async getRecords(limit = 100, offset = 0) {
        return await this.db.query(
          `SELECT r.id, r.uid, r.did, r.subdomain_id, r.name, r.type, r.value, r.line, r.created_at,
              u.username, d.domain, s.name as subdomain_name
       FROM records r
       LEFT JOIN users u ON u.id = r.uid
       LEFT JOIN domains d ON d.id = r.did
       LEFT JOIN subdomains s ON s.id = r.subdomain_id
       ORDER BY r.id DESC
       LIMIT ? OFFSET ?`,
          [limit, offset]
        );
      }
      async getRecordsCount() {
        const result = await this.db.queryOne(
          "SELECT COUNT(*) as count FROM records"
        );
        return result?.count || 0;
      }
      async getOperationLogs(limit = 100, offset = 0) {
        return await this.db.query(
          `SELECT l.id, l.uid, l.admin_uid, l.action, l.target_type, l.target_id, l.message, l.created_at,
              u.username as user_name, a.username as admin_name
       FROM operation_logs l
       LEFT JOIN users u ON u.id = l.uid
       LEFT JOIN users a ON a.id = l.admin_uid
       ORDER BY l.id DESC
       LIMIT ? OFFSET ?`,
          [limit, offset]
        );
      }
      async getOperationLogsCount() {
        const result = await this.db.queryOne(
          "SELECT COUNT(*) as count FROM operation_logs"
        );
        return result?.count || 0;
      }
    };
    __name(AdminRepository, "AdminRepository");
  }
});

// src/repositories/settings.repository.ts
var SettingsRepository;
var init_settings_repository = __esm({
  "src/repositories/settings.repository.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    SettingsRepository = class {
      constructor(db) {
        this.db = db;
      }
      async get(key) {
        const result = await this.db.queryOne(
          "SELECT value FROM settings WHERE key = ?",
          [key]
        );
        return result?.value ?? null;
      }
      async set(key, value) {
        await this.db.execute(
          `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, strftime('%s','now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
          [key, value]
        );
      }
      async getAll() {
        const rows = await this.db.query("SELECT key, value FROM settings");
        const result = {};
        for (const row of rows) {
          result[row.key] = row.value;
        }
        return result;
      }
      async getJSON(key) {
        const raw2 = await this.get(key);
        if (raw2 === null)
          return null;
        try {
          return JSON.parse(raw2);
        } catch {
          return null;
        }
      }
      async setJSON(key, value) {
        await this.set(key, JSON.stringify(value));
      }
      async allowUnlimitedSubdomainRecords() {
        const dns = await this.getJSON("array_dns");
        return dns?.unlimited_subdomain_records === "1";
      }
      async getReserveDomainNames() {
        const raw2 = await this.get("reserve_domain_name");
        if (!raw2)
          return [];
        return raw2.split(",").map((s) => s.trim()).filter(Boolean);
      }
      async delete(key) {
        await this.db.execute("DELETE FROM settings WHERE key = ?", [key]);
      }
    };
    __name(SettingsRepository, "SettingsRepository");
  }
});

// src/repositories/migrations.ts
async function runMigrations(db) {
  const alreadyApplied = await isMigrationApplied(db, INITIAL_SCHEMA_VERSION);
  if (alreadyApplied) {
    return;
  }
  const sql = getInitialSchemaSQL();
  const statements = sql.split(";").map((s) => s.trim()).filter((s) => s.length > 0 && !s.startsWith("--"));
  for (const stmt of statements) {
    await db.execute(stmt);
  }
}
async function isMigrationApplied(db, version2) {
  try {
    const result = await db.queryOne(
      "SELECT version FROM schema_migrations WHERE version = ?",
      [version2]
    );
    return result !== null;
  } catch {
    return false;
  }
}
function getInitialSchemaSQL() {
  return `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS "groups" (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  group_id INTEGER NOT NULL DEFAULT 100 REFERENCES "groups"(id) ON UPDATE CASCADE,
  status INTEGER NOT NULL DEFAULT 0 CHECK (status IN (0, 1, 2)),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  remember_token_hash TEXT,
  sid TEXT NOT NULL,
  email TEXT UNIQUE,
  points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS dns_providers (
  key TEXT PRIMARY KEY,
  config_ciphertext TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS domains (
  id INTEGER PRIMARY KEY,
  provider_key TEXT NOT NULL REFERENCES dns_providers(key) ON UPDATE CASCADE ON DELETE RESTRICT,
  provider_config_ciphertext TEXT,
  remote_zone_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  group_policy TEXT NOT NULL DEFAULT '0',
  record_types TEXT NOT NULL DEFAULT 'A,CNAME',
  beian INTEGER NOT NULL DEFAULT 0 CHECK (beian IN (0, 1)),
  points_cost INTEGER NOT NULL DEFAULT 0 CHECK (points_cost >= 0),
  require_review INTEGER NOT NULL DEFAULT 0 CHECK (require_review IN (0, 1)),
  description TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE(provider_key, remote_zone_id),
  UNIQUE(domain)
);

CREATE TABLE IF NOT EXISTS subdomains (
  id INTEGER PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  did INTEGER NOT NULL REFERENCES domains(id) ON UPDATE CASCADE ON DELETE CASCADE,
  name TEXT NOT NULL,
  full_domain TEXT NOT NULL,
  status INTEGER NOT NULL DEFAULT 1 CHECK (status IN (0, 1, 2, 3)),
  purpose TEXT NOT NULL DEFAULT '',
  reject_reason TEXT NOT NULL DEFAULT '',
  reviewed_by INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  reviewed_at INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS records (
  id INTEGER PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  did INTEGER NOT NULL REFERENCES domains(id) ON UPDATE CASCADE ON DELETE CASCADE,
  subdomain_id INTEGER REFERENCES subdomains(id) ON UPDATE CASCADE ON DELETE SET NULL,
  record_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  line_id TEXT NOT NULL DEFAULT '0',
  line TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE(did, name, type)
);

CREATE TABLE IF NOT EXISTS api_tokens (
  id INTEGER PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  token_hint TEXT NOT NULL,
  last_used_at INTEGER NOT NULL DEFAULT 0,
  expires_at INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  token_hint TEXT NOT NULL,
  last_used_at INTEGER NOT NULL DEFAULT 0,
  expires_at INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS point_records (
  id INTEGER PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  admin_uid INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  action TEXT NOT NULL,
  points INTEGER NOT NULL,
  rest INTEGER NOT NULL,
  remark TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS operation_logs (
  id INTEGER PRIMARY KEY,
  uid INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  admin_uid INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'system',
  target_type TEXT,
  target_id TEXT,
  ip TEXT,
  action TEXT NOT NULL,
  message TEXT NOT NULL,
  extra TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS dns_write_jobs (
  id INTEGER PRIMARY KEY,
  uid INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  source TEXT NOT NULL,
  provider_key TEXT NOT NULL,
  domain TEXT NOT NULL,
  record_name TEXT NOT NULL,
  record_type TEXT NOT NULL,
  value_digest TEXT NOT NULL,
  remote_record_id TEXT,
  operation TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  payload TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

INSERT OR IGNORE INTO "groups"(id, name) VALUES (99, '\u7BA1\u7406\u7EC4'), (100, '\u9ED8\u8BA4\u7EC4');

INSERT OR IGNORE INTO users(id, group_id, status, username, password_hash, sid, email, points)
VALUES (0, 100, 0, 'system-sync', 'system-disabled', 'system-sync', NULL, 0);

INSERT OR IGNORE INTO settings(key, value) VALUES
  ('array_user', '{"reg":"1","email":"1","point":"100"}'),
  ('array_web', '{"name":"KLDNS","title":"KLDNS - \u4E8C\u7EA7\u57DF\u540D\u5206\u53D1\u4E0E\u89E3\u6790\u7BA1\u7406\u5E73\u53F0","keywords":"KLDNS,\u4E8C\u7EA7\u57DF\u540D\u5206\u53D1,DNS\u89E3\u6790,\u57DF\u540D\u7BA1\u7406\u5E73\u53F0","description":"KLDNS \u7528\u4E8E\u4E8C\u7EA7\u57DF\u540D\u5206\u53D1\u3001DNS \u89E3\u6790\u7BA1\u7406\u3001\u7528\u6237\u81EA\u52A9\u7533\u8BF7\u4E0E\u540E\u53F0\u7EDF\u4E00\u8FD0\u7EF4\u3002"}'),
  ('array_dns', '{"unlimited_subdomain_records":"1"}'),
  ('array_turnstile', '{"site_key":"","register_enabled":"0","login_enabled":"0"}'),
  ('html_header', '<div class="alert alert-primary">\u672C\u7AD9\u63D0\u4F9B\u4E8C\u7EA7\u57DF\u540D\u5206\u53D1\u4E0E\u89E3\u6790\u670D\u52A1\uFF0C\u8BF7\u9075\u5B88\u76F8\u5173\u6CD5\u5F8B\u6CD5\u89C4\u4E0E\u5E73\u53F0\u4F7F\u7528\u89C4\u8303\u3002</div>'),
  ('html_home', '\u6B22\u8FCE\u4F7F\u7528 KLDNS \u7528\u6237\u63A7\u5236\u53F0\u3002\u6DFB\u52A0\u89E3\u6790\u524D\u8BF7\u786E\u8BA4\u4E3B\u673A\u8BB0\u5F55\u3001\u8BB0\u5F55\u7C7B\u578B\u4E0E\u8BB0\u5F55\u503C\u586B\u5199\u6B63\u786E\uFF0C\u5E76\u9075\u5B88\u5E73\u53F0\u89E3\u6790\u89C4\u8303\u3002'),
  ('index_urls', '\u6E90\u7801\u4E0B\u8F7D|https://github.com/klsf/kldns'),
  ('reserve_domain_name', 'www,w,m,3g,4g,qq');

INSERT OR IGNORE INTO schema_migrations(version) VALUES ('0001_initial_schema');
`;
}
var INITIAL_SCHEMA_VERSION;
var init_migrations = __esm({
  "src/repositories/migrations.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    INITIAL_SCHEMA_VERSION = "0001_initial_schema";
    __name(runMigrations, "runMigrations");
    __name(isMigrationApplied, "isMigrationApplied");
    __name(getInitialSchemaSQL, "getInitialSchemaSQL");
  }
});

// src/repositories/index.ts
var repositories_exports = {};
__export(repositories_exports, {
  APIRepository: () => APIRepository,
  AdminRepository: () => AdminRepository,
  AuthRepository: () => AuthRepository,
  Database: () => Database,
  PointsRepository: () => PointsRepository,
  RecordRepository: () => RecordRepository,
  SettingsRepository: () => SettingsRepository,
  SubdomainRepository: () => SubdomainRepository,
  runMigrations: () => runMigrations
});
var init_repositories = __esm({
  "src/repositories/index.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_database();
    init_auth_repository();
    init_api_repository();
    init_record_repository();
    init_subdomain_repository();
    init_points_repository();
    init_admin_repository();
    init_settings_repository();
    init_migrations();
  }
});

// .wrangler/tmp/bundle-sBcvvS/middleware-loader.entry.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .wrangler/tmp/bundle-sBcvvS/middleware-insertion-facade.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/index.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/routes/router.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/index.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/hono.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/hono-base.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/compose.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context2, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context2.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context2, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context2.error = err;
            res = await onError(err, context2);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context2.finalized === false && onNotFound) {
          res = await onNotFound(context2);
        }
      }
      if (res && (context2.finalized === false || isError)) {
        context2.res = res;
      }
      return context2;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// node_modules/hono/dist/context.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/request.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/http-exception.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/request/constants.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/body.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/utils/buffer.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/utils/crypto.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/utils/buffer.js
var bufferToFormData = /* @__PURE__ */ __name((arrayBuffer, contentType) => {
  const response = new Response(arrayBuffer, {
    headers: {
      // Normalize the media type (case-insensitive) while keeping parameters like the boundary
      "Content-Type": contentType.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase())
    }
  });
  return response.formData();
}, "bufferToFormData");

// node_modules/hono/dist/utils/body.js
var isRawRequest = /* @__PURE__ */ __name((request) => "headers" in request, "isRawRequest");
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const contentType = headers.get("Content-Type");
  const mediaType = contentType?.split(";")[0].trim().toLowerCase();
  if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const arrayBuffer = await request.arrayBuffer();
  const formDataPromise = bufferToFormData(arrayBuffer, headers.get("Content-Type") || "");
  if (!isRawRequest(request)) {
    request.bodyCache.formData = formDataPromise;
  }
  const formData = await formDataPromise;
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// node_modules/hono/dist/utils/url.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = /* @__PURE__ */ __name(class {
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
}, "HonoRequest");

// node_modules/hono/dist/utils/html.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context2, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context: context2 }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context2, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var createResponseInstance = /* @__PURE__ */ __name((body, init) => new Response(body, init), "createResponseInstance");
var Context = /* @__PURE__ */ __name(class {
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (layout) => this.#layout = layout;
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = () => this.#layout;
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = (...args) => this.#newResponse(...args);
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  };
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  };
  html = (html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
}, "Context");

// node_modules/hono/dist/router.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = /* @__PURE__ */ __name(class extends Error {
}, "UnsupportedPathError");

// node_modules/hono/dist/utils/constants.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = /* @__PURE__ */ __name(class _Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env2, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env2, "GET")))();
    }
    const path = this.getPath(request, { env: env2 });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env: env2,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context2 = await composed(c);
        if (!context2.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context2.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
}, "_Hono");

// node_modules/hono/dist/router/reg-exp-router/index.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/reg-exp-router/router.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/reg-exp-router/matcher.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }, "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// node_modules/hono/dist/router/reg-exp-router/node.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = /* @__PURE__ */ __name(class _Node {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context2, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name !== "") {
          node.#varIndex = context2.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context2, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
}, "_Node");

// node_modules/hono/dist/router/reg-exp-router/trie.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Trie = /* @__PURE__ */ __name(class {
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
}, "Trie");

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = /* @__PURE__ */ __name(class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
}, "RegExpRouter");

// node_modules/hono/dist/router/reg-exp-router/prepared-router.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/smart-router/index.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/smart-router/router.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SmartRouter = /* @__PURE__ */ __name(class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
}, "SmartRouter");

// node_modules/hono/dist/router/trie-router/index.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/trie-router/router.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/trie-router/node.js
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = /* @__PURE__ */ __name((children) => {
  for (const _ in children) {
    return true;
  }
  return false;
}, "hasChildren");
var Node2 = /* @__PURE__ */ __name(class _Node2 {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (m[0].length === restPathString.length && child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  node.#params,
                  params
                );
              }
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
}, "_Node");

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = /* @__PURE__ */ __name(class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
}, "TrieRouter");

// node_modules/hono/dist/hono.js
var Hono2 = /* @__PURE__ */ __name(class extends Hono {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
}, "Hono");

// src/middleware/cors.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function corsMiddleware() {
  return async (c, next) => {
    await next();
    c.res.headers.set("Access-Control-Allow-Origin", "*");
    c.res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    c.res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    c.res.headers.set("Access-Control-Max-Age", "86400");
  };
}
__name(corsMiddleware, "corsMiddleware");

// src/middleware/auth.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/utils/tokens.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(bufferToHex, "bufferToHex");
async function newAPIToken() {
  const raw2 = crypto.getRandomValues(new Uint8Array(32));
  const plain = "kldns_" + bufferToHex(raw2);
  const hash = await hashBearerToken(plain);
  const hint = tokenHint(plain);
  return { plain, hash, hint };
}
__name(newAPIToken, "newAPIToken");
async function hashBearerToken(plain) {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(plain.trim()));
  return bufferToHex(hashBuffer);
}
__name(hashBearerToken, "hashBearerToken");
function tokenHint(plain) {
  plain = plain.trim();
  if (plain.length <= 36) {
    return plain;
  }
  return plain.substring(0, 18) + "..." + plain.substring(plain.length - 12);
}
__name(tokenHint, "tokenHint");

// src/middleware/auth.ts
init_repositories();
function authMiddleware(db) {
  return async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({
        code: "UNAUTHORIZED",
        message: "Missing or invalid authorization header"
      }, 401);
    }
    const token = authHeader.substring(7);
    const tokenHash = await hashBearerToken(token);
    const apiRepo = new APIRepository(db);
    let authResult = await apiRepo.authenticateSession(tokenHash);
    let source = "session";
    if (!authResult) {
      authResult = await apiRepo.authenticateToken(tokenHash);
      source = "token";
    }
    if (!authResult) {
      return c.json({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token"
      }, 401);
    }
    c.set("auth", {
      user: authResult.user,
      source
    });
    await next();
  };
}
__name(authMiddleware, "authMiddleware");
function getAuth(c) {
  const auth = c.get("auth");
  if (!auth) {
    throw new Error("Auth context not found");
  }
  return auth;
}
__name(getAuth, "getAuth");

// src/middleware/admin.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function adminMiddleware() {
  return async (c, next) => {
    const auth = getAuth(c);
    if (auth.user.group_id !== 99) {
      return c.json({
        code: "FORBIDDEN",
        message: "Admin access required"
      }, 403);
    }
    await next();
  };
}
__name(adminMiddleware, "adminMiddleware");

// src/routes/router.ts
init_repositories();

// src/controllers/index.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/controllers/auth.controller.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_repositories();

// src/utils/passwords.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var PBKDF2_ITERATIONS = 1e5;
var SALT_LENGTH = 16;
function bufferToHex2(buffer) {
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(bufferToHex2, "bufferToHex");
function hexToBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}
__name(hexToBuffer, "hexToBuffer");
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256"
    },
    keyMaterial,
    256
  );
  return `$pbkdf2$${PBKDF2_ITERATIONS}$${bufferToHex2(salt)}$${bufferToHex2(derivedBits)}`;
}
__name(hashPassword, "hashPassword");
async function checkPassword(password, hash) {
  const parts = hash.split("$");
  if (parts.length !== 5 || parts[1] !== "pbkdf2") {
    return false;
  }
  const iterations = parseInt(parts[2]);
  const salt = hexToBuffer(parts[3]);
  const expectedHash = parts[4];
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256"
    },
    keyMaterial,
    256
  );
  return bufferToHex2(derivedBits) === expectedHash;
}
__name(checkPassword, "checkPassword");

// src/config/settings.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function getUserSettings(db) {
  const result = await db.prepare("SELECT value FROM settings WHERE key = ?").bind("array_user").first();
  if (!result) {
    return { reg: "1", email: "1", point: "100" };
  }
  return JSON.parse(result.value);
}
__name(getUserSettings, "getUserSettings");

// src/controllers/auth.controller.ts
var AuthController = class {
  constructor(db) {
    this.db = db;
  }
  async register(c) {
    try {
      const body = await c.req.json();
      const { username, email, password } = body;
      if (!username || !email || !password) {
        return c.json({ code: "INVALID_INPUT", message: "Missing required fields" }, 400);
      }
      if (password.length < 8) {
        return c.json({ code: "INVALID_INPUT", message: "Password must be at least 8 characters" }, 400);
      }
      const settings = await getUserSettings(this.db.getD1());
      if (settings.reg !== "1") {
        return c.json({ code: "REGISTRATION_CLOSED", message: "Registration is closed" }, 403);
      }
      const authRepo = new AuthRepository(this.db);
      const existingUser = await authRepo.findLoginUser(username);
      if (existingUser) {
        return c.json({ code: "USER_EXISTS", message: "Username already exists" }, 409);
      }
      const passwordHash = await hashPassword(password);
      const initialPoints = parseInt(settings.point || "100", 10);
      const userId = await authRepo.createUser({
        username,
        email,
        group_id: 100,
        status: 1,
        points: initialPoints
      }, passwordHash, "");
      return c.json({
        code: "OK",
        message: "Registration successful",
        data: { id: userId, username, email, points: initialPoints }
      }, 201);
    } catch (error3) {
      console.error("Register error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Registration failed" }, 500);
    }
  }
  async login(c) {
    try {
      const body = await c.req.json();
      const username = body.username || body.login;
      const password = body.password;
      if (!username || !password) {
        return c.json({ code: "INVALID_INPUT", message: "Missing username or password" }, 400);
      }
      const authRepo = new AuthRepository(this.db);
      const user = await authRepo.findLoginUser(username);
      if (!user) {
        return c.json({ code: "INVALID_CREDENTIALS", message: "Invalid username or password" }, 401);
      }
      const valid = await checkPassword(password, user.user.password_hash);
      if (!valid) {
        return c.json({ code: "INVALID_CREDENTIALS", message: "Invalid username or password" }, 401);
      }
      if (user.user.status === 0) {
        return c.json({ code: "ACCOUNT_DISABLED", message: "Account is disabled" }, 403);
      }
      const tokenResult = await newAPIToken();
      const expiresAt = Math.floor(Date.now() / 1e3) + 30 * 24 * 60 * 60;
      const apiRepo = new (await Promise.resolve().then(() => (init_repositories(), repositories_exports))).APIRepository(this.db);
      const sessionId = await apiRepo.createSession(
        user.user.id,
        tokenResult.hash,
        tokenResult.hint,
        expiresAt
      );
      return c.json({
        code: "OK",
        message: "Login successful",
        data: {
          session_id: sessionId,
          token: tokenResult.plain,
          user: {
            id: user.user.id,
            username: user.user.username,
            email: user.user.email,
            group_id: user.user.group_id,
            status: user.user.status,
            points: user.user.points
          }
        }
      });
    } catch (error3) {
      console.error("Login error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Login failed" }, 500);
    }
  }
  async me(c) {
    try {
      const auth = c.get("auth");
      if (!auth || !auth.user) {
        return c.json({ code: "UNAUTHORIZED", message: "Not authenticated" }, 401);
      }
      return c.json({
        code: "OK",
        message: "Success",
        data: auth.user
      });
    } catch (error3) {
      console.error("Me error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get user info" }, 500);
    }
  }
  async changePassword(c) {
    try {
      const auth = c.get("auth");
      if (!auth || !auth.user) {
        return c.json({ code: "UNAUTHORIZED", message: "Not authenticated" }, 401);
      }
      const body = await c.req.json();
      const { old_password, new_password } = body;
      if (!old_password || !new_password) {
        return c.json({ code: "INVALID_INPUT", message: "Missing old or new password" }, 400);
      }
      if (new_password.length < 8) {
        return c.json({ code: "INVALID_INPUT", message: "New password must be at least 8 characters" }, 400);
      }
      const authRepo = new AuthRepository(this.db);
      const user = await authRepo.findLoginUser(auth.user.username);
      if (!user) {
        return c.json({ code: "USER_NOT_FOUND", message: "User not found" }, 404);
      }
      const valid = await checkPassword(old_password, user.user.password_hash);
      if (!valid) {
        return c.json({ code: "INVALID_PASSWORD", message: "Old password is incorrect" }, 400);
      }
      const newPasswordHash = await hashPassword(new_password);
      await authRepo.updatePassword(user.user.id, newPasswordHash, "");
      return c.json({
        code: "OK",
        message: "Password changed successfully"
      });
    } catch (error3) {
      console.error("Change password error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to change password" }, 500);
    }
  }
};
__name(AuthController, "AuthController");

// src/controllers/api.controller.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_repositories();

// src/services/index.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/services/record.service.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_repositories();

// src/dns/index.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/dns/provider.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/dns/registry.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var registry = /* @__PURE__ */ new Map();
function registerProvider(key, factory) {
  registry.set(key, factory);
}
__name(registerProvider, "registerProvider");
function getProvider(key) {
  const factory = registry.get(key);
  return factory ? factory() : null;
}
__name(getProvider, "getProvider");
function getRegisteredKeys() {
  return Array.from(registry.keys()).sort();
}
__name(getRegisteredKeys, "getRegisteredKeys");

// src/dns/providers/cloudflare.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var CloudflareProvider = class {
  apiToken = "";
  baseUrl = "https://api.cloudflare.com/client/v4";
  key() {
    return "cloudflare";
  }
  label() {
    return "Cloudflare";
  }
  configFields() {
    return [
      {
        name: "api_token",
        label: "API Token",
        required: true,
        secret: true,
        description: "Cloudflare API Token (\u9700\u8981 DNS \u7F16\u8F91\u6743\u9650)"
      }
    ];
  }
  configure(config2) {
    this.apiToken = config2.api_token || "";
  }
  async request(method, path, body) {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      "Authorization": `Bearer ${this.apiToken}`,
      "Content-Type": "application/json"
    };
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : void 0
    });
    if (!response.ok) {
      const error3 = await response.text();
      throw new Error(`Cloudflare API error: ${response.status} - ${error3}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(`Cloudflare API error: ${JSON.stringify(data.errors)}`);
    }
    return data.result;
  }
  async check() {
    await this.request("GET", "/user/tokens/verify");
  }
  async listZones() {
    const result = await this.request("GET", "/zones?per_page=50");
    return result.map((zone) => ({
      id: zone.id,
      domain: zone.name
    }));
  }
  async listRecordLines(_zone) {
    return [{ id: "default", name: "\u9ED8\u8BA4" }];
  }
  async createRecord(zone, input) {
    const body = {
      type: input.type,
      name: input.name,
      content: input.value,
      ttl: 1
    };
    const result = await this.request(
      "POST",
      `/zones/${zone.id}/dns_records`,
      body
    );
    return {
      remote_id: result.id,
      name: result.name,
      type: result.type,
      value: result.content,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async updateRecord(zone, remoteId, input) {
    const body = {
      type: input.type,
      name: input.name,
      content: input.value,
      ttl: 1
    };
    const result = await this.request(
      "PUT",
      `/zones/${zone.id}/dns_records/${remoteId}`,
      body
    );
    return {
      remote_id: result.id,
      name: result.name,
      type: result.type,
      value: result.content,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async deleteRecord(zone, remoteId) {
    await this.request(
      "DELETE",
      `/zones/${zone.id}/dns_records/${remoteId}`
    );
  }
  async getRecord(zone, remoteId) {
    const result = await this.request(
      "GET",
      `/zones/${zone.id}/dns_records/${remoteId}`
    );
    return {
      remote_id: result.id,
      name: result.name,
      type: result.type,
      value: result.content,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async listRecords(zone) {
    const result = await this.request(
      "GET",
      `/zones/${zone.id}/dns_records?per_page=100`
    );
    return result.map((record) => ({
      remote_id: record.id,
      name: record.name,
      type: record.type,
      value: record.content,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    }));
  }
};
__name(CloudflareProvider, "CloudflareProvider");
registerProvider("cloudflare", () => new CloudflareProvider());

// src/dns/providers/dnspod.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DNSPodProvider = class {
  secretId = "";
  secretKey = "";
  key() {
    return "dnspod";
  }
  label() {
    return "DNSPod (\u817E\u8BAF\u4E91)";
  }
  configFields() {
    return [
      {
        name: "secret_id",
        label: "SecretId",
        required: true,
        secret: false
      },
      {
        name: "secret_key",
        label: "SecretKey",
        required: true,
        secret: true
      }
    ];
  }
  configure(config2) {
    this.secretId = config2.secret_id || "";
    this.secretKey = config2.secret_key || "";
  }
  async request(action, params = {}) {
    const timestamp = Math.floor(Date.now() / 1e3);
    const body = {
      ...params,
      LoginToken: `${this.secretId},${this.secretKey}`,
      Format: "json"
    };
    const response = await fetch(`https://dnspod.tencentcloudapi.com/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error(`DNSPod API error: ${response.status}`);
    }
    const data = await response.json();
    if (data.Response && data.Response.Error) {
      throw new Error(`DNSPod API error: ${data.Response.Error.Message}`);
    }
    return data.Response || data;
  }
  async check() {
    await this.request("DescribeUserDetail", {});
  }
  async listZones() {
    const result = await this.request("DescribeDomainList", {
      Offset: 0,
      Limit: 100
    });
    const domainList = result.DomainList || [];
    return domainList.map((domain2) => ({
      id: domain2.DomainId.toString(),
      domain: domain2.Name
    }));
  }
  async listRecordLines(_zone) {
    return [{ id: "default", name: "\u9ED8\u8BA4" }];
  }
  async createRecord(zone, input) {
    const result = await this.request("CreateRecord", {
      Domain: zone.domain,
      SubDomain: input.name,
      RecordType: input.type,
      RecordLine: "\u9ED8\u8BA4",
      Value: input.value
    });
    return {
      remote_id: result.RecordId.toString(),
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async updateRecord(zone, remoteId, input) {
    await this.request("ModifyRecord", {
      Domain: zone.domain,
      RecordId: remoteId,
      SubDomain: input.name,
      RecordType: input.type,
      RecordLine: "\u9ED8\u8BA4",
      Value: input.value
    });
    return {
      remote_id: remoteId,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async deleteRecord(zone, remoteId) {
    await this.request("DeleteRecord", {
      Domain: zone.domain,
      RecordId: remoteId
    });
  }
  async getRecord(zone, remoteId) {
    const result = await this.request("DescribeRecord", {
      Domain: zone.domain,
      RecordId: remoteId
    });
    const info3 = result.RecordInfo || result;
    return {
      remote_id: remoteId,
      name: info3.SubDomain || info3.name,
      type: info3.RecordType || info3.type,
      value: info3.Value || info3.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async listRecords(zone) {
    const result = await this.request("DescribeRecordList", {
      Domain: zone.domain,
      Offset: 0,
      Limit: 100
    });
    const recordList = result.RecordList || [];
    return recordList.map((record) => ({
      remote_id: record.RecordId.toString(),
      name: record.Name,
      type: record.Type,
      value: record.Value,
      line_id: "default",
      line: record.Line || "\u9ED8\u8BA4"
    }));
  }
};
__name(DNSPodProvider, "DNSPodProvider");
registerProvider("dnspod", () => new DNSPodProvider());

// src/dns/providers/aliyun.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var AliyunProvider = class {
  accessKeyId = "";
  accessKeySecret = "";
  key() {
    return "aliyun";
  }
  label() {
    return "\u963F\u91CC\u4E91 DNS";
  }
  configFields() {
    return [
      {
        name: "access_key_id",
        label: "AccessKey ID",
        required: true,
        secret: false
      },
      {
        name: "access_key_secret",
        label: "AccessKey Secret",
        required: true,
        secret: true
      }
    ];
  }
  configure(config2) {
    this.accessKeyId = config2.access_key_id || "";
    this.accessKeySecret = config2.access_key_secret || "";
  }
  async request(action, params = {}) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/\.\d{3}Z$/, "Z");
    const signatureNonce = Math.random().toString(36).substring(2);
    const commonParams = {
      Format: "JSON",
      Version: "2015-01-09",
      AccessKeyId: this.accessKeyId,
      SignatureMethod: "HMAC-SHA1",
      Timestamp: timestamp,
      SignatureVersion: "1.0",
      SignatureNonce: signatureNonce,
      Action: action,
      ...params
    };
    const response = await fetch("https://alidns.aliyuncs.com/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`Aliyun DNS API error: ${response.status}`);
    }
    const data = await response.json();
    if (data.Code && data.Code !== "200") {
      throw new Error(`Aliyun DNS API error: ${data.Message}`);
    }
    return data;
  }
  async check() {
    await this.request("DescribeDomains", { PageSize: "1" });
  }
  async listZones() {
    const result = await this.request("DescribeDomains", {
      PageSize: "100",
      PageNumber: "1"
    });
    const domains = result.Domains?.Domain || [];
    return domains.map((domain2) => ({
      id: domain2.DomainId,
      domain: domain2.DomainName
    }));
  }
  async listRecordLines(_zone) {
    return [{ id: "default", name: "\u9ED8\u8BA4" }];
  }
  async createRecord(zone, input) {
    const result = await this.request("AddDomainRecord", {
      DomainName: zone.domain,
      RR: input.name,
      Type: input.type,
      Value: input.value,
      Line: "default"
    });
    return {
      remote_id: result.RecordId,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async updateRecord(zone, remoteId, input) {
    await this.request("UpdateDomainRecord", {
      RecordId: remoteId,
      RR: input.name,
      Type: input.type,
      Value: input.value,
      Line: "default"
    });
    return {
      remote_id: remoteId,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async deleteRecord(_zone, remoteId) {
    await this.request("DeleteDomainRecord", {
      RecordId: remoteId
    });
  }
  async getRecord(_zone, remoteId) {
    const result = await this.request("DescribeDomainRecordInfo", {
      RecordId: remoteId
    });
    return {
      remote_id: remoteId,
      name: result.RR,
      type: result.Type,
      value: result.Value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async listRecords(zone) {
    const result = await this.request("DescribeDomainRecords", {
      DomainName: zone.domain,
      PageSize: "100",
      PageNumber: "1"
    });
    const records = result.DomainRecords?.DomainRecord || [];
    return records.map((record) => ({
      remote_id: record.RecordId,
      name: record.RR,
      type: record.Type,
      value: record.Value,
      line_id: "default",
      line: record.Line || "\u9ED8\u8BA4"
    }));
  }
};
__name(AliyunProvider, "AliyunProvider");
registerProvider("aliyun", () => new AliyunProvider());

// src/dns/providers/dnscom.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DNSComProvider = class {
  userId = "";
  apiKey = "";
  key() {
    return "dnscom";
  }
  label() {
    return "DNS.com";
  }
  configFields() {
    return [
      { name: "user_id", label: "\u7528\u6237ID", required: true, secret: false },
      { name: "api_key", label: "API Key", required: true, secret: true }
    ];
  }
  configure(config2) {
    this.userId = config2.user_id || "";
    this.apiKey = config2.api_key || "";
  }
  async request(path, params = {}) {
    const body = new URLSearchParams({
      user_id: this.userId,
      api_key: this.apiKey,
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    });
    const response = await fetch(`https://www.dns.com/api/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });
    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(`DNS.com API error: ${data.message}`);
    }
    return data.data;
  }
  async check() {
    await this.request("domain/getDomainList", { page: 1, pageSize: 1 });
  }
  async listZones() {
    const result = await this.request("domain/getDomainList", { page: 1, pageSize: 100 });
    return (result.data || []).map((d) => ({ id: d.domainID.toString(), domain: d.domain }));
  }
  async listRecordLines(_zone) {
    return [{ id: "default", name: "\u9ED8\u8BA4" }];
  }
  async createRecord(zone, input) {
    const result = await this.request("record/createRecord", {
      domainID: zone.id,
      host: input.name,
      type: input.type,
      value: input.value
    });
    return {
      remote_id: result.recordID.toString(),
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async updateRecord(zone, remoteId, input) {
    await this.request("record/updateRecord", {
      recordID: remoteId,
      host: input.name,
      type: input.type,
      value: input.value
    });
    return {
      remote_id: remoteId,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async deleteRecord(_zone, remoteId) {
    await this.request("record/deleteRecord", { recordID: remoteId });
  }
  async getRecord(_zone, remoteId) {
    const result = await this.request("record/getRecordInfo", { recordID: remoteId });
    return {
      remote_id: remoteId,
      name: result.host,
      type: result.type,
      value: result.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async listRecords(zone) {
    const result = await this.request("record/getRecordList", { domainID: zone.id, page: 1, pageSize: 100 });
    return (result.data || []).map((r) => ({
      remote_id: r.recordID.toString(),
      name: r.host,
      type: r.type,
      value: r.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    }));
  }
};
__name(DNSComProvider, "DNSComProvider");
registerProvider("dnscom", () => new DNSComProvider());

// src/dns/providers/dnsla.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DNSLAProvider = class {
  appId = "";
  appKey = "";
  key() {
    return "dnsla";
  }
  label() {
    return "DNSLA";
  }
  configFields() {
    return [
      { name: "app_id", label: "App ID", required: true, secret: false },
      { name: "app_key", label: "App Key", required: true, secret: true }
    ];
  }
  configure(config2) {
    this.appId = config2.app_id || "";
    this.appKey = config2.app_key || "";
  }
  async request(method, path, body) {
    const response = await fetch(`https://api.dns.la/api${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "API-KEY": this.appId,
        "API-SECRET": this.appKey
      },
      body: body ? JSON.stringify(body) : void 0
    });
    const data = await response.json();
    if (data.code !== 200) {
      throw new Error(`DNSLA API error: ${data.message}`);
    }
    return data.data;
  }
  async check() {
    await this.request("GET", "/user/info");
  }
  async listZones() {
    const result = await this.request("GET", "/domain/list?pageSize=100");
    return (result.list || []).map((d) => ({ id: d.id.toString(), domain: d.domain }));
  }
  async listRecordLines(_zone) {
    return [{ id: "default", name: "\u9ED8\u8BA4" }];
  }
  async createRecord(zone, input) {
    const result = await this.request("POST", "/record/create", {
      domainID: zone.id,
      host: input.name,
      type: input.type,
      value: input.value
    });
    return {
      remote_id: result.id.toString(),
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async updateRecord(zone, remoteId, input) {
    await this.request("PUT", `/record/update`, {
      id: remoteId,
      host: input.name,
      type: input.type,
      value: input.value
    });
    return {
      remote_id: remoteId,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async deleteRecord(_zone, remoteId) {
    await this.request("DELETE", `/record/delete?id=${remoteId}`);
  }
  async getRecord(_zone, remoteId) {
    const result = await this.request("GET", `/record/get?id=${remoteId}`);
    return {
      remote_id: remoteId,
      name: result.host,
      type: result.type,
      value: result.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async listRecords(zone) {
    const result = await this.request("GET", `/record/list?domainID=${zone.id}&pageSize=100`);
    return (result.list || []).map((r) => ({
      remote_id: r.id.toString(),
      name: r.host,
      type: r.type,
      value: r.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    }));
  }
};
__name(DNSLAProvider, "DNSLAProvider");
registerProvider("dnsla", () => new DNSLAProvider());

// src/dns/providers/dnsdun.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var DNSDunProvider = class {
  userId = "";
  apiKey = "";
  key() {
    return "dnsdun";
  }
  label() {
    return "DnsDun";
  }
  configFields() {
    return [
      { name: "user_id", label: "\u7528\u6237ID", required: true, secret: false },
      { name: "api_key", label: "API Key", required: true, secret: true }
    ];
  }
  configure(config2) {
    this.userId = config2.user_id || "";
    this.apiKey = config2.api_key || "";
  }
  async request(path, params = {}) {
    const body = new URLSearchParams({
      user_id: this.userId,
      api_key: this.apiKey,
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    });
    const response = await fetch(`https://www.dnsdun.com/api/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });
    const data = await response.json();
    if (data.status !== "ok" && data.code !== 0) {
      throw new Error(`DnsDun API error: ${data.message || JSON.stringify(data)}`);
    }
    return data;
  }
  async check() {
    await this.request("domain/list", { page: 1, page_size: 1 });
  }
  async listZones() {
    const result = await this.request("domain/list", { page: 1, page_size: 100 });
    return (result.data || []).map((d) => ({ id: d.id.toString(), domain: d.domain }));
  }
  async listRecordLines(_zone) {
    return [{ id: "default", name: "\u9ED8\u8BA4" }];
  }
  async createRecord(zone, input) {
    const result = await this.request("record/create", {
      domain_id: zone.id,
      sub_domain: input.name,
      record_type: input.type,
      record_value: input.value
    });
    return {
      remote_id: result.data.record_id.toString(),
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async updateRecord(zone, remoteId, input) {
    await this.request("record/modify", {
      record_id: remoteId,
      sub_domain: input.name,
      record_type: input.type,
      record_value: input.value
    });
    return {
      remote_id: remoteId,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async deleteRecord(_zone, remoteId) {
    await this.request("record/delete", { record_id: remoteId });
  }
  async getRecord(_zone, remoteId) {
    const result = await this.request("record/info", { record_id: remoteId });
    const r = result.data;
    return {
      remote_id: remoteId,
      name: r.sub_domain,
      type: r.record_type,
      value: r.record_value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async listRecords(zone) {
    const result = await this.request("record/list", { domain_id: zone.id, page: 1, page_size: 100 });
    return (result.data || []).map((r) => ({
      remote_id: r.record_id.toString(),
      name: r.sub_domain,
      type: r.record_type,
      value: r.record_value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    }));
  }
};
__name(DNSDunProvider, "DNSDunProvider");
registerProvider("dnsdun", () => new DNSDunProvider());

// src/dns/providers/west.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var WestProvider = class {
  username = "";
  apiKey = "";
  key() {
    return "west";
  }
  label() {
    return "\u897F\u90E8\u6570\u7801";
  }
  configFields() {
    return [
      { name: "username", label: "\u7528\u6237\u540D", required: true, secret: false },
      { name: "api_key", label: "API Key", required: true, secret: true }
    ];
  }
  configure(config2) {
    this.username = config2.username || "";
    this.apiKey = config2.api_key || "";
  }
  async request(action, params = {}) {
    const body = new URLSearchParams({
      username: this.username,
      apikey: this.apiKey,
      act: action,
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    });
    const response = await fetch("https://apipanel.west.cn/api/domain", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });
    const data = await response.json();
    if (data.result !== 200) {
      throw new Error(`West API error: ${data.msg || data.message}`);
    }
    return data;
  }
  async check() {
    await this.request("domain:getdomainlist", { page: 1, limit: 1 });
  }
  async listZones() {
    const result = await this.request("domain:getdomainlist", { page: 1, limit: 100 });
    return (result.data?.list || []).map((d) => ({ id: d.domain, domain: d.domain }));
  }
  async listRecordLines(_zone) {
    return [{ id: "default", name: "\u9ED8\u8BA4" }];
  }
  async createRecord(zone, input) {
    const result = await this.request("domain:adddnsrecord", {
      domain: zone.domain,
      host: input.name,
      type: input.type,
      value: input.value
    });
    return {
      remote_id: result.data?.record_id?.toString() || "",
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async updateRecord(zone, remoteId, input) {
    await this.request("domain:updatednsrecord", {
      domain: zone.domain,
      record_id: remoteId,
      host: input.name,
      type: input.type,
      value: input.value
    });
    return {
      remote_id: remoteId,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async deleteRecord(zone, remoteId) {
    await this.request("domain:deldnsrecord", {
      domain: zone.domain,
      record_id: remoteId
    });
  }
  async getRecord(zone, remoteId) {
    const result = await this.request("domain:getdnsrecord", {
      domain: zone.domain,
      record_id: remoteId
    });
    const r = result.data;
    return {
      remote_id: remoteId,
      name: r.host,
      type: r.type,
      value: r.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async listRecords(zone) {
    const result = await this.request("domain:getdnsrecordlist", {
      domain: zone.domain,
      page: 1,
      limit: 100
    });
    return (result.data?.list || []).map((r) => ({
      remote_id: r.record_id.toString(),
      name: r.host,
      type: r.type,
      value: r.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    }));
  }
};
__name(WestProvider, "WestProvider");
registerProvider("west", () => new WestProvider());

// src/dns/providers/huawei.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var HuaweiProvider = class {
  accessKeyId = "";
  secretAccessKey = "";
  key() {
    return "huawei";
  }
  label() {
    return "\u534E\u4E3A\u4E91 DNS";
  }
  configFields() {
    return [
      { name: "access_key_id", label: "Access Key ID", required: true, secret: false },
      { name: "secret_access_key", label: "Secret Access Key", required: true, secret: true }
    ];
  }
  configure(config2) {
    this.accessKeyId = config2.access_key_id || "";
    this.secretAccessKey = config2.secret_access_key || "";
  }
  async request(method, path, body) {
    const response = await fetch(`https://dns.myhuaweicloud.com${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": this.secretAccessKey
      },
      body: body ? JSON.stringify(body) : void 0
    });
    const data = await response.json();
    if (data.error_code) {
      throw new Error(`Huawei DNS API error: ${data.error_msg}`);
    }
    return data;
  }
  async check() {
    await this.request("GET", "/v2/zones?limit=1");
  }
  async listZones() {
    const result = await this.request("GET", "/v2/zones?limit=100");
    return (result.zones || []).map((z) => ({ id: z.id, domain: z.name.replace(/\.$/, "") }));
  }
  async listRecordLines(_zone) {
    return [{ id: "default", name: "\u9ED8\u8BA4" }];
  }
  async createRecord(zone, input) {
    const result = await this.request("POST", `/v2/zones/${zone.id}/recordsets`, {
      name: `${input.name}.${zone.domain}.`,
      type: input.type,
      records: [input.value]
    });
    return {
      remote_id: result.id,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async updateRecord(zone, remoteId, input) {
    await this.request("PUT", `/v2/zones/${zone.id}/recordsets/${remoteId}`, {
      name: `${input.name}.${zone.domain}.`,
      type: input.type,
      records: [input.value]
    });
    return {
      remote_id: remoteId,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async deleteRecord(zone, remoteId) {
    await this.request("DELETE", `/v2/zones/${zone.id}/recordsets/${remoteId}`);
  }
  async getRecord(zone, remoteId) {
    const result = await this.request("GET", `/v2/zones/${zone.id}/recordsets/${remoteId}`);
    return {
      remote_id: remoteId,
      name: result.name.replace(`.${zone.domain}.`, ""),
      type: result.type,
      value: result.records[0],
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async listRecords(zone) {
    const result = await this.request("GET", `/v2/zones/${zone.id}/recordsets?limit=100`);
    return (result.recordsets || []).map((r) => ({
      remote_id: r.id,
      name: r.name.replace(`.${zone.domain}.`, ""),
      type: r.type,
      value: r.records[0],
      line_id: "default",
      line: "\u9ED8\u8BA4"
    }));
  }
};
__name(HuaweiProvider, "HuaweiProvider");
registerProvider("huawei", () => new HuaweiProvider());

// src/dns/providers/baidu.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var BaiduProvider = class {
  accessKeyId = "";
  secretAccessKey = "";
  key() {
    return "baidu";
  }
  label() {
    return "\u767E\u5EA6\u4E91 DNS";
  }
  configFields() {
    return [
      { name: "access_key_id", label: "Access Key ID", required: true, secret: false },
      { name: "secret_access_key", label: "Secret Access Key", required: true, secret: true }
    ];
  }
  configure(config2) {
    this.accessKeyId = config2.access_key_id || "";
    this.secretAccessKey = config2.secret_access_key || "";
  }
  async request(method, path, body) {
    const response = await fetch(`https://dns.baidubce.com${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `bce-auth-v1 ${this.accessKeyId}`
      },
      body: body ? JSON.stringify(body) : void 0
    });
    const data = await response.json();
    if (data.code) {
      throw new Error(`Baidu DNS API error: ${data.message}`);
    }
    return data;
  }
  async check() {
    await this.request("GET", "/v1/dns/zone?pageSize=1");
  }
  async listZones() {
    const result = await this.request("GET", "/v1/dns/zone?pageSize=100");
    return (result.zones || []).map((z) => ({ id: z.id, domain: z.name }));
  }
  async listRecordLines(_zone) {
    return [{ id: "default", name: "\u9ED8\u8BA4" }];
  }
  async createRecord(zone, input) {
    const result = await this.request("POST", `/v1/dns/zone/${zone.domain}/record`, {
      rr: input.name,
      type: input.type,
      value: input.value
    });
    return {
      remote_id: result.recordId,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async updateRecord(zone, remoteId, input) {
    await this.request("PUT", `/v1/dns/zone/${zone.domain}/record/${remoteId}`, {
      rr: input.name,
      type: input.type,
      value: input.value
    });
    return {
      remote_id: remoteId,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async deleteRecord(zone, remoteId) {
    await this.request("DELETE", `/v1/dns/zone/${zone.domain}/record/${remoteId}`);
  }
  async getRecord(zone, remoteId) {
    const result = await this.request("GET", `/v1/dns/zone/${zone.domain}/record/${remoteId}`);
    return {
      remote_id: remoteId,
      name: result.rr,
      type: result.type,
      value: result.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async listRecords(zone) {
    const result = await this.request("GET", `/v1/dns/zone/${zone.domain}/record?pageSize=100`);
    return (result.records || []).map((r) => ({
      remote_id: r.recordId,
      name: r.rr,
      type: r.type,
      value: r.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    }));
  }
};
__name(BaiduProvider, "BaiduProvider");
registerProvider("baidu", () => new BaiduProvider());

// src/dns/providers/route53.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Route53Provider = class {
  accessKeyId = "";
  secretAccessKey = "";
  region = "us-east-1";
  key() {
    return "route53";
  }
  label() {
    return "AWS Route53";
  }
  configFields() {
    return [
      { name: "access_key_id", label: "Access Key ID", required: true, secret: false },
      { name: "secret_access_key", label: "Secret Access Key", required: true, secret: true },
      { name: "region", label: "Region", required: false, secret: false, description: "\u9ED8\u8BA4 us-east-1" }
    ];
  }
  configure(config2) {
    this.accessKeyId = config2.access_key_id || "";
    this.secretAccessKey = config2.secret_access_key || "";
    this.region = config2.region || "us-east-1";
  }
  async request(method, path, body) {
    const response = await fetch(`https://route53.amazonaws.com${path}`, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: body ? JSON.stringify(body) : void 0
    });
    if (!response.ok) {
      const error3 = await response.text();
      throw new Error(`Route53 API error: ${response.status} - ${error3}`);
    }
    if (method === "DELETE")
      return {};
    return await response.json();
  }
  async check() {
    await this.request("GET", "/2013-04-01/hostedzone?maxitems=1");
  }
  async listZones() {
    const result = await this.request("GET", "/2013-04-01/hostedzone?maxitems=100");
    const zones = result.HostedZones?.HostedZone || [];
    return zones.map((z) => ({
      id: z.Id.replace("/hostedzone/", ""),
      domain: z.Name.replace(/\.$/, "")
    }));
  }
  async listRecordLines(_zone) {
    return [{ id: "default", name: "\u9ED8\u8BA4" }];
  }
  async createRecord(zone, input) {
    const recordName = input.name === "@" ? zone.domain : `${input.name}.${zone.domain}`;
    await this.request("POST", `/2013-04-01/hostedzone/${zone.id}/rrset`, {
      Changes: [{
        Action: "CREATE",
        ResourceRecordSet: {
          Name: recordName,
          Type: input.type,
          TTL: 300,
          ResourceRecords: [{ Value: input.value }]
        }
      }]
    });
    return {
      remote_id: `${recordName}:${input.type}`,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async updateRecord(zone, _remoteId, input) {
    const recordName = input.name === "@" ? zone.domain : `${input.name}.${zone.domain}`;
    await this.request("POST", `/2013-04-01/hostedzone/${zone.id}/rrset`, {
      Changes: [{
        Action: "UPSERT",
        ResourceRecordSet: {
          Name: recordName,
          Type: input.type,
          TTL: 300,
          ResourceRecords: [{ Value: input.value }]
        }
      }]
    });
    return {
      remote_id: `${recordName}:${input.type}`,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async deleteRecord(zone, remoteId) {
    const [name, type] = remoteId.split(":");
    const recordName = name === "@" ? zone.domain : `${name}.${zone.domain}`;
    await this.request("POST", `/2013-04-01/hostedzone/${zone.id}/rrset`, {
      Changes: [{
        Action: "DELETE",
        ResourceRecordSet: {
          Name: recordName,
          Type: type,
          TTL: 300,
          ResourceRecords: [{ Value: "" }]
        }
      }]
    });
  }
  async getRecord(zone, remoteId) {
    const [name, type] = remoteId.split(":");
    const recordName = name === "@" ? zone.domain : `${name}.${zone.domain}`;
    const result = await this.request("GET", `/2013-04-01/hostedzone/${zone.id}/rrset?name=${recordName}&type=${type}`);
    const record = result.ResourceRecordSets?.ResourceRecordSet?.[0];
    return {
      remote_id: remoteId,
      name,
      type,
      value: record?.ResourceRecords?.ResourceRecord?.[0]?.Value || "",
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async listRecords(zone) {
    const result = await this.request("GET", `/2013-04-01/hostedzone/${zone.id}/rrset?maxitems=100`);
    const records = result.ResourceRecordSets?.ResourceRecordSet || [];
    return records.filter((r) => r.Type !== "NS" && r.Type !== "SOA").map((r) => ({
      remote_id: `${r.Name.replace(`.${zone.domain}`, "").replace(zone.domain, "@")}:${r.Type}`,
      name: r.Name.replace(`.${zone.domain}`, "").replace(zone.domain, "@"),
      type: r.Type,
      value: r.ResourceRecords?.ResourceRecord?.[0]?.Value || "",
      line_id: "default",
      line: "\u9ED8\u8BA4"
    }));
  }
};
__name(Route53Provider, "Route53Provider");
registerProvider("route53", () => new Route53Provider());

// src/dns/providers/google.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var GoogleProvider = class {
  projectId = "";
  serviceAccountKey = "";
  key() {
    return "google";
  }
  label() {
    return "Google Cloud DNS";
  }
  configFields() {
    return [
      { name: "project_id", label: "Project ID", required: true, secret: false },
      { name: "service_account_key", label: "Service Account Key (JSON)", required: true, secret: true }
    ];
  }
  configure(config2) {
    this.projectId = config2.project_id || "";
    this.serviceAccountKey = config2.service_account_key || "";
  }
  async request(method, path, body) {
    const response = await fetch(`https://dns.googleapis.com/dns/v1${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.serviceAccountKey}`
      },
      body: body ? JSON.stringify(body) : void 0
    });
    if (!response.ok) {
      const error3 = await response.text();
      throw new Error(`Google DNS API error: ${response.status} - ${error3}`);
    }
    if (method === "DELETE")
      return {};
    return await response.json();
  }
  async check() {
    await this.request("GET", `/projects/${this.projectId}/managedZones?maxResults=1`);
  }
  async listZones() {
    const result = await this.request("GET", `/projects/${this.projectId}/managedZones?maxResults=100`);
    return (result.managedZones || []).map((z) => ({
      id: z.id.toString(),
      domain: z.dnsName.replace(/\.$/, "")
    }));
  }
  async listRecordLines(_zone) {
    return [{ id: "default", name: "\u9ED8\u8BA4" }];
  }
  async createRecord(zone, input) {
    const recordName = input.name === "@" ? zone.domain : `${input.name}.${zone.domain}`;
    await this.request("POST", `/projects/${this.projectId}/managedZones/${zone.id}/rrsets`, {
      name: `${recordName}.`,
      type: input.type,
      ttl: 300,
      rrdatas: [input.value]
    });
    return {
      remote_id: `${recordName}:${input.type}`,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async updateRecord(zone, _remoteId, input) {
    const recordName = input.name === "@" ? zone.domain : `${input.name}.${zone.domain}`;
    await this.request("PATCH", `/projects/${this.projectId}/managedZones/${zone.id}/rrsets/${recordName}/${input.type}`, {
      ttl: 300,
      rrdatas: [input.value]
    });
    return {
      remote_id: `${recordName}:${input.type}`,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async deleteRecord(zone, remoteId) {
    const [name, type] = remoteId.split(":");
    const recordName = name === "@" ? zone.domain : `${name}.${zone.domain}`;
    await this.request("DELETE", `/projects/${this.projectId}/managedZones/${zone.id}/rrsets/${recordName}/${type}`);
  }
  async getRecord(zone, remoteId) {
    const [name, type] = remoteId.split(":");
    const recordName = name === "@" ? zone.domain : `${name}.${zone.domain}`;
    const result = await this.request("GET", `/projects/${this.projectId}/managedZones/${zone.id}/rrsets/${recordName}/${type}`);
    return {
      remote_id: remoteId,
      name,
      type: result.type,
      value: result.rrdatas?.[0] || "",
      line_id: "default",
      line: "\u9ED8\u8BA4"
    };
  }
  async listRecords(zone) {
    const result = await this.request("GET", `/projects/${this.projectId}/managedZones/${zone.id}/rrsets?maxResults=100`);
    return (result.rrsets || []).filter((r) => r.type !== "NS" && r.type !== "SOA").map((r) => ({
      remote_id: `${r.name.replace(`.${zone.domain}.`, "").replace(`${zone.domain}.`, "@")}:${r.type}`,
      name: r.name.replace(`.${zone.domain}.`, "").replace(`${zone.domain}.`, "@"),
      type: r.type,
      value: r.rrdatas?.[0] || "",
      line_id: "default",
      line: "\u9ED8\u8BA4"
    }));
  }
};
__name(GoogleProvider, "GoogleProvider");
registerProvider("google", () => new GoogleProvider());

// src/services/record.service.ts
var RecordService = class {
  constructor(db) {
    this.db = db;
    this.recordRepo = new RecordRepository(db);
    this.subdomainRepo = new SubdomainRepository(db);
  }
  recordRepo;
  subdomainRepo;
  async submitRecord(user, did, subdomainId, name, type, value, lineId = "default") {
    const domain2 = await this.recordRepo.getDomainForGroup(did, user.group_id);
    if (!domain2) {
      throw new Error("Domain not found or no permission");
    }
    const subdomain = await this.subdomainRepo.getSubdomainForUser(subdomainId, user.id);
    if (!subdomain) {
      throw new Error("Subdomain not found or no permission");
    }
    const fullName = name === "@" ? subdomain.name : `${name}.${subdomain.name}`;
    const exists = await this.recordRepo.recordNameExists(did, fullName, type, 0);
    if (exists) {
      throw new Error("Record already exists");
    }
    const provider = getProvider(domain2.provider_key);
    if (!provider) {
      throw new Error("DNS provider not found");
    }
    provider.configure(JSON.parse(domain2.provider_config_ciphertext || "{}"));
    const zone = { id: domain2.remote_zone_id, domain: domain2.domain };
    const input = { name: fullName, type, value, line_id: lineId };
    const remoteRecord = await provider.createRecord(zone, input);
    const record = {
      id: 0,
      uid: user.id,
      did,
      subdomain_id: subdomainId,
      record_id: remoteRecord.remote_id,
      name: fullName,
      type,
      value,
      line_id: lineId,
      line: remoteRecord.line
    };
    const log3 = {
      uid: user.id,
      source: "web",
      target_type: "record",
      target_id: remoteRecord.remote_id,
      action: "create",
      message: `Create record ${fullName} ${type} ${value}`,
      extra: JSON.stringify({ domain: domain2.domain, provider: domain2.provider_key })
    };
    await this.recordRepo.applyCreatedRecord(user, domain2, record, log3);
    return record;
  }
  async updateRecord(user, recordId, name, type, value, lineId = "default") {
    const record = await this.recordRepo.getRecordForUser(recordId, user.id);
    if (!record) {
      throw new Error("Record not found");
    }
    const domain2 = await this.recordRepo.getDomainForGroup(record.did, user.group_id);
    if (!domain2) {
      throw new Error("Domain not found");
    }
    const provider = getProvider(domain2.provider_key);
    if (!provider) {
      throw new Error("DNS provider not found");
    }
    provider.configure(JSON.parse(domain2.provider_config_ciphertext || "{}"));
    const zone = { id: domain2.remote_zone_id, domain: domain2.domain };
    const input = { name, type, value, line_id: lineId };
    await provider.updateRecord(zone, record.record_id, input);
    const updatedRecord = {
      ...record,
      name,
      type,
      value,
      line_id: lineId
    };
    const log3 = {
      uid: user.id,
      source: "web",
      target_type: "record",
      target_id: record.record_id,
      action: "update",
      message: `Update record ${name} ${type} ${value}`,
      extra: JSON.stringify({ domain: domain2.domain, provider: domain2.provider_key })
    };
    await this.recordRepo.applyUpdatedRecord(recordId, updatedRecord, log3);
    return updatedRecord;
  }
  async deleteRecord(user, recordId) {
    const record = await this.recordRepo.getRecordForUser(recordId, user.id);
    if (!record) {
      throw new Error("Record not found");
    }
    const domain2 = await this.recordRepo.getDomainForGroup(record.did, user.group_id);
    if (!domain2) {
      throw new Error("Domain not found");
    }
    const provider = getProvider(domain2.provider_key);
    if (!provider) {
      throw new Error("DNS provider not found");
    }
    provider.configure(JSON.parse(domain2.provider_config_ciphertext || "{}"));
    const zone = { id: domain2.remote_zone_id, domain: domain2.domain };
    await provider.deleteRecord(zone, record.record_id);
    const log3 = {
      uid: user.id,
      source: "web",
      target_type: "record",
      target_id: record.record_id,
      action: "delete",
      message: `Delete record ${record.name}`,
      extra: JSON.stringify({ domain: domain2.domain, provider: domain2.provider_key })
    };
    await this.recordRepo.applyDeletedRecord(recordId, log3);
  }
  async listRecords(user, did, subdomainId, type, keyword) {
    return await this.recordRepo.listRecords(user.id, did, subdomainId, type, keyword);
  }
  async getRecord(user, recordId) {
    return await this.recordRepo.getRecordForUser(recordId, user.id);
  }
};
__name(RecordService, "RecordService");

// src/services/subdomain.service.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_repositories();
init_settings_repository();
var SubdomainService = class {
  constructor(db) {
    this.db = db;
    this.subdomainRepo = new SubdomainRepository(db);
    this.recordRepo = new RecordRepository(db);
    this.settingsRepo = new SettingsRepository(db);
  }
  subdomainRepo;
  recordRepo;
  settingsRepo;
  async registerSubdomain(user, did, name, purpose = "") {
    const domain2 = await this.recordRepo.getDomainForGroup(did, user.group_id);
    if (!domain2) {
      throw new Error("Domain not found or no permission");
    }
    if (domain2.points_cost > 0 && user.points < domain2.points_cost) {
      throw new Error("Insufficient points");
    }
    const reserved = await this.settingsRepo.getReserveDomainNames();
    if (reserved.includes(name.toLowerCase())) {
      throw new Error("This subdomain name is reserved");
    }
    const requireReview = domain2.require_review === 1;
    const log3 = {
      uid: user.id,
      source: "web",
      target_type: "subdomain",
      target_id: `${name}.${domain2.domain}`,
      action: "register",
      message: `Register subdomain ${name}.${domain2.domain}`,
      extra: JSON.stringify({ domain: domain2.domain, name, purpose, requireReview })
    };
    const subdomain = await this.subdomainRepo.registerSubdomain(
      user,
      domain2,
      name,
      purpose,
      requireReview,
      log3
    );
    return subdomain;
  }
  async deleteSubdomain(user, subdomainId) {
    const result = await this.db.queryOne(
      `SELECT s.*, d.points_cost, d.domain 
       FROM subdomains s 
       JOIN domains d ON d.id = s.did 
       WHERE s.id = ? AND s.uid = ?`,
      [subdomainId, user.id]
    );
    if (!result) {
      throw new Error("Subdomain not found");
    }
    const subdomain = {
      id: result.id,
      uid: result.uid,
      did: result.did,
      name: result.name,
      full_domain: result.full_domain,
      status: result.status,
      purpose: result.purpose,
      reject_reason: result.reject_reason,
      reviewed_by: result.reviewed_by,
      reviewed_at: result.reviewed_at,
      created_at: result.created_at,
      updated_at: result.updated_at
    };
    const recordCount = await this.subdomainRepo.countRecordsForSubdomain(subdomainId, user.id);
    if (recordCount > 0) {
      throw new Error("Please delete all records under this subdomain first");
    }
    const log3 = {
      uid: user.id,
      source: "web",
      target_type: "subdomain",
      target_id: subdomain.full_domain,
      action: "delete",
      message: `Delete subdomain ${subdomain.full_domain}`,
      extra: JSON.stringify({ subdomain_id: subdomain.id, full_domain: subdomain.full_domain })
    };
    await this.subdomainRepo.deleteSubdomain(subdomain, log3);
  }
  async listSubdomains(user, status, keyword) {
    return await this.subdomainRepo.listSubdomains(user.id, status, keyword);
  }
  async getSubdomain(user, subdomainId) {
    const result = await this.db.queryOne(
      `SELECT s.* FROM subdomains s WHERE s.id = ? AND s.uid = ?`,
      [subdomainId, user.id]
    );
    if (!result)
      return null;
    return {
      id: result.id,
      uid: result.uid,
      did: result.did,
      name: result.name,
      full_domain: result.full_domain,
      status: result.status,
      purpose: result.purpose,
      reject_reason: result.reject_reason,
      reviewed_by: result.reviewed_by,
      reviewed_at: result.reviewed_at,
      created_at: result.created_at,
      updated_at: result.updated_at
    };
  }
};
__name(SubdomainService, "SubdomainService");

// src/services/points.service.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_repositories();
var PointsService = class {
  constructor(db) {
    this.db = db;
    this.pointsRepo = new PointsRepository(db);
  }
  pointsRepo;
  async adjustPoints(userId, adminId, delta, action, remark) {
    const log3 = {
      uid: userId,
      admin_uid: adminId,
      source: "admin",
      target_type: "user_points",
      target_id: userId.toString(),
      action: delta > 0 ? "increase" : "decrease",
      message: `${delta > 0 ? "Increase" : "Decrease"} points by ${Math.abs(delta)}`,
      extra: JSON.stringify({ delta, action, remark })
    };
    return await this.pointsRepo.adjustUserPoints({
      userId,
      adminId,
      delta,
      action,
      remark,
      log: log3
    });
  }
  async getPointRecords(userId, limit = 100, offset = 0) {
    return await this.pointsRepo.getPointRecords(userId, limit, offset);
  }
  async getPointRecordsCount(userId) {
    return await this.pointsRepo.getPointRecordsCount(userId);
  }
};
__name(PointsService, "PointsService");

// src/services/provider.resolver.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_repositories();

// src/utils/secrets.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/controllers/api.controller.ts
var APIController = class {
  constructor(db) {
    this.db = db;
  }
  async getDomains(c) {
    try {
      const auth = getAuth(c);
      const apiRepo = new APIRepository(this.db);
      const domains = await apiRepo.listAvailableDomains(auth.user.group_id);
      return c.json({
        code: "OK",
        message: "Success",
        data: domains
      });
    } catch (error3) {
      console.error("Get domains error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get domains" }, 500);
    }
  }
  async getPublicDomains(c) {
    try {
      const apiRepo = new APIRepository(this.db);
      const domains = await apiRepo.listPublicDomains();
      return c.json({
        code: "OK",
        message: "Success",
        data: domains
      });
    } catch (error3) {
      console.error("Get public domains error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get public domains" }, 500);
    }
  }
  async getSubdomains(c) {
    try {
      const auth = getAuth(c);
      const apiRepo = new APIRepository(this.db);
      const status = c.req.query("status");
      const keyword = c.req.query("keyword");
      const subdomains = await apiRepo.listSubdomains(
        auth.user.id,
        status ? parseInt(status) : void 0,
        keyword
      );
      return c.json({
        code: "OK",
        message: "Success",
        data: subdomains
      });
    } catch (error3) {
      console.error("Get subdomains error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get subdomains" }, 500);
    }
  }
  async createSubdomain(c) {
    try {
      const auth = getAuth(c);
      const body = await c.req.json();
      const { did, name, purpose } = body;
      if (!did || !name) {
        return c.json({ code: "INVALID_INPUT", message: "Missing required fields" }, 400);
      }
      const subdomainService = new SubdomainService(this.db);
      const subdomain = await subdomainService.registerSubdomain(
        auth.user,
        did,
        name,
        purpose || ""
      );
      return c.json({
        code: "OK",
        message: "Subdomain created successfully",
        data: subdomain
      }, 201);
    } catch (error3) {
      console.error("Create subdomain error:", error3);
      if (error3.message.includes("Insufficient points")) {
        return c.json({ code: "INSUFFICIENT_POINTS", message: error3.message }, 400);
      }
      if (error3.message.includes("reserved")) {
        return c.json({ code: "RESERVED_NAME", message: error3.message }, 400);
      }
      return c.json({ code: "INTERNAL_ERROR", message: error3.message || "Failed to create subdomain" }, 500);
    }
  }
  async deleteSubdomain(c) {
    try {
      const auth = getAuth(c);
      const id = c.req.param("id");
      if (!id) {
        return c.json({ code: "INVALID_INPUT", message: "Missing subdomain ID" }, 400);
      }
      const subdomainService = new SubdomainService(this.db);
      await subdomainService.deleteSubdomain(auth.user, parseInt(id));
      return c.json({
        code: "OK",
        message: "Subdomain deleted successfully"
      });
    } catch (error3) {
      console.error("Delete subdomain error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: error3.message || "Failed to delete subdomain" }, 500);
    }
  }
  async getRecords(c) {
    try {
      const auth = getAuth(c);
      const apiRepo = new APIRepository(this.db);
      const did = c.req.query("did");
      const subdomainId = c.req.query("subdomain_id");
      const type = c.req.query("type");
      const keyword = c.req.query("keyword");
      const records = await apiRepo.listRecords(
        auth.user.id,
        did ? parseInt(did) : void 0,
        subdomainId ? parseInt(subdomainId) : void 0,
        type,
        keyword
      );
      return c.json({
        code: "OK",
        message: "Success",
        data: records
      });
    } catch (error3) {
      console.error("Get records error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get records" }, 500);
    }
  }
  async createRecord(c) {
    try {
      const auth = getAuth(c);
      const body = await c.req.json();
      const { did, subdomain_id, name, type, value, line_id } = body;
      if (!did || !subdomain_id || !name || !type || !value) {
        return c.json({ code: "INVALID_INPUT", message: "Missing required fields" }, 400);
      }
      const recordService = new RecordService(this.db);
      const record = await recordService.submitRecord(
        auth.user,
        did,
        subdomain_id,
        name,
        type,
        value,
        line_id || "default"
      );
      return c.json({
        code: "OK",
        message: "Record created successfully",
        data: record
      }, 201);
    } catch (error3) {
      console.error("Create record error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: error3.message || "Failed to create record" }, 500);
    }
  }
  async updateRecord(c) {
    try {
      const auth = getAuth(c);
      const id = c.req.param("id");
      const body = await c.req.json();
      const { name, type, value, line_id } = body;
      if (!id || !name || !type || !value) {
        return c.json({ code: "INVALID_INPUT", message: "Missing required fields" }, 400);
      }
      const recordService = new RecordService(this.db);
      const record = await recordService.updateRecord(
        auth.user,
        parseInt(id),
        name,
        type,
        value,
        line_id || "default"
      );
      return c.json({
        code: "OK",
        message: "Record updated successfully",
        data: record
      });
    } catch (error3) {
      console.error("Update record error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: error3.message || "Failed to update record" }, 500);
    }
  }
  async deleteRecord(c) {
    try {
      const auth = getAuth(c);
      const id = c.req.param("id");
      if (!id) {
        return c.json({ code: "INVALID_INPUT", message: "Missing record ID" }, 400);
      }
      const recordService = new RecordService(this.db);
      await recordService.deleteRecord(auth.user, parseInt(id));
      return c.json({
        code: "OK",
        message: "Record deleted successfully"
      });
    } catch (error3) {
      console.error("Delete record error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: error3.message || "Failed to delete record" }, 500);
    }
  }
  async getPoints(c) {
    try {
      const auth = getAuth(c);
      const apiRepo = new APIRepository(this.db);
      const overview = await apiRepo.pointsOverview(auth.user.id);
      return c.json({
        code: "OK",
        message: "Success",
        data: overview
      });
    } catch (error3) {
      console.error("Get points error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get points" }, 500);
    }
  }
  async getTokens(c) {
    try {
      const auth = getAuth(c);
      const apiRepo = new APIRepository(this.db);
      const tokens = await apiRepo.listTokens(auth.user.id);
      return c.json({
        code: "OK",
        message: "Success",
        data: tokens
      });
    } catch (error3) {
      console.error("Get tokens error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get tokens" }, 500);
    }
  }
  async createToken(c) {
    try {
      const auth = getAuth(c);
      const body = await c.req.json();
      const { name } = body;
      if (!name) {
        return c.json({ code: "INVALID_INPUT", message: "Missing token name" }, 400);
      }
      const tokenResult = await newAPIToken2();
      const expiresAt = Math.floor(Date.now() / 1e3) + 365 * 24 * 60 * 60;
      const apiRepo = new APIRepository(this.db);
      const tokenId = await apiRepo.createToken(
        auth.user.id,
        name,
        tokenResult.hash,
        tokenResult.hint,
        expiresAt
      );
      return c.json({
        code: "OK",
        message: "Token created successfully",
        data: {
          id: tokenId,
          name,
          token: tokenResult.plain,
          hint: tokenResult.hint,
          expires_at: expiresAt
        }
      }, 201);
    } catch (error3) {
      console.error("Create token error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to create token" }, 500);
    }
  }
  async deleteToken(c) {
    try {
      const auth = getAuth(c);
      const id = c.req.param("id");
      if (!id) {
        return c.json({ code: "INVALID_INPUT", message: "Missing token ID" }, 400);
      }
      const apiRepo = new APIRepository(this.db);
      await apiRepo.deleteToken(auth.user.id, parseInt(id));
      return c.json({
        code: "OK",
        message: "Token deleted successfully"
      });
    } catch (error3) {
      console.error("Delete token error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to delete token" }, 500);
    }
  }
};
__name(APIController, "APIController");
function newAPIToken2() {
  const randomBytes = Array.from(crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, "0")).join("");
  const plain = `kldns_${randomBytes}`;
  const hash = hashBearerToken3(plain);
  const hint = tokenHint3(plain);
  return { plain, hash, hint };
}
__name(newAPIToken2, "newAPIToken");
async function hashBearerToken3(token) {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(token.trim()));
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hashBearerToken3, "hashBearerToken");
function tokenHint3(token) {
  return token.substring(0, 8) + "..." + token.substring(token.length - 8);
}
__name(tokenHint3, "tokenHint");

// src/controllers/admin.controller.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_repositories();
var AdminController = class {
  constructor(db) {
    this.db = db;
  }
  async getUsers(c) {
    try {
      const adminRepo = new AdminRepository(this.db);
      const page = parseInt(c.req.query("page") || "1");
      const page_size = parseInt(c.req.query("page_size") || c.req.query("limit") || "100");
      const limit = page_size;
      const offset = (page - 1) * page_size;
      const users = await adminRepo.getUsers(limit, offset);
      const count3 = await adminRepo.getUsersCount();
      return c.json({
        code: "OK",
        message: "Success",
        data: {
          items: users,
          total: count3,
          page,
          page_size
        }
      });
    } catch (error3) {
      console.error("Get users error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get users" }, 500);
    }
  }
  async createUser(c) {
    try {
      const body = await c.req.json();
      const { username, email, password, group_id, status, points } = body;
      if (!username || !password) {
        return c.json({ code: "INVALID_INPUT", message: "Missing required fields" }, 400);
      }
      const adminRepo = new AdminRepository(this.db);
      const userId = await adminRepo.createUser(
        username,
        email || "",
        password,
        group_id || 100,
        status || 1,
        points || 0
      );
      return c.json({
        code: "OK",
        message: "User created successfully",
        data: { id: userId }
      }, 201);
    } catch (error3) {
      console.error("Create user error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to create user" }, 500);
    }
  }
  async updateUser(c) {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      if (!id) {
        return c.json({ code: "INVALID_INPUT", message: "Missing user ID" }, 400);
      }
      const adminRepo = new AdminRepository(this.db);
      await adminRepo.updateUser(parseInt(id), body);
      return c.json({
        code: "OK",
        message: "User updated successfully"
      });
    } catch (error3) {
      console.error("Update user error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to update user" }, 500);
    }
  }
  async deleteUser(c) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return c.json({ code: "INVALID_INPUT", message: "Missing user ID" }, 400);
      }
      const adminRepo = new AdminRepository(this.db);
      await adminRepo.deleteUser(parseInt(id));
      return c.json({
        code: "OK",
        message: "User deleted successfully"
      });
    } catch (error3) {
      console.error("Delete user error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to delete user" }, 500);
    }
  }
  async adjustPoints(c) {
    try {
      const auth = getAuth(c);
      const id = c.req.param("id");
      const body = await c.req.json();
      const { delta, action, remark } = body;
      if (!id || delta === void 0 || !action || !remark) {
        return c.json({ code: "INVALID_INPUT", message: "Missing required fields" }, 400);
      }
      const pointsService = new PointsService(this.db);
      const result = await pointsService.adjustPoints(
        parseInt(id),
        auth.user.id,
        delta,
        action,
        remark
      );
      return c.json({
        code: "OK",
        message: "Points adjusted successfully",
        data: result
      });
    } catch (error3) {
      console.error("Adjust points error:", error3);
      if (error3.message === "USER_NOT_FOUND") {
        return c.json({ code: "USER_NOT_FOUND", message: "User not found" }, 404);
      }
      if (error3.message === "INSUFFICIENT_POINTS") {
        return c.json({ code: "INSUFFICIENT_POINTS", message: "Insufficient points" }, 400);
      }
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to adjust points" }, 500);
    }
  }
  async getGroups(c) {
    try {
      const adminRepo = new AdminRepository(this.db);
      const groups = await adminRepo.getGroups();
      return c.json({
        code: "OK",
        message: "Success",
        data: groups
      });
    } catch (error3) {
      console.error("Get groups error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get groups" }, 500);
    }
  }
  async createGroup(c) {
    try {
      const body = await c.req.json();
      const { name } = body;
      if (!name) {
        return c.json({ code: "INVALID_INPUT", message: "Missing required fields" }, 400);
      }
      const adminRepo = new AdminRepository(this.db);
      const groupId = await adminRepo.createGroup(name);
      return c.json({
        code: "OK",
        message: "Group created successfully",
        data: { id: groupId }
      }, 201);
    } catch (error3) {
      console.error("Create group error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to create group" }, 500);
    }
  }
  async deleteGroup(c) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return c.json({ code: "INVALID_INPUT", message: "Missing group ID" }, 400);
      }
      const adminRepo = new AdminRepository(this.db);
      await adminRepo.deleteGroup(parseInt(id));
      return c.json({
        code: "OK",
        message: "Group deleted successfully"
      });
    } catch (error3) {
      console.error("Delete group error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to delete group" }, 500);
    }
  }
  async getDomains(c) {
    try {
      const adminRepo = new AdminRepository(this.db);
      const page = parseInt(c.req.query("page") || "1");
      const page_size = parseInt(c.req.query("page_size") || c.req.query("limit") || "100");
      const limit = page_size;
      const offset = (page - 1) * page_size;
      const domains = await adminRepo.getDomains(limit, offset);
      const count3 = await adminRepo.getDomainsCount();
      const domainsWithLabel = domains.map((domain2) => {
        const provider = getProvider(domain2.provider_key);
        return {
          ...domain2,
          provider_label: provider ? provider.label() : domain2.provider_key
        };
      });
      return c.json({
        code: "OK",
        message: "Success",
        data: {
          items: domainsWithLabel,
          total: count3,
          page,
          page_size
        }
      });
    } catch (error3) {
      console.error("Get domains error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get domains" }, 500);
    }
  }
  async createDomain(c) {
    try {
      const body = await c.req.json();
      const { domain: domain2, provider_key, remote_zone_id, points_cost, record_types, beian, require_review, description } = body;
      if (!domain2 || !provider_key || !remote_zone_id) {
        return c.json({ code: "INVALID_INPUT", message: "Missing required fields" }, 400);
      }
      const adminRepo = new AdminRepository(this.db);
      const domainId = await adminRepo.createDomain(
        domain2,
        provider_key,
        remote_zone_id,
        points_cost || 0,
        record_types || "A,CNAME",
        beian || 0,
        require_review || 0,
        description || ""
      );
      return c.json({
        code: "OK",
        message: "Domain created successfully",
        data: { id: domainId }
      }, 201);
    } catch (error3) {
      console.error("Create domain error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to create domain" }, 500);
    }
  }
  async updateDomain(c) {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      if (!id) {
        return c.json({ code: "INVALID_INPUT", message: "Missing domain ID" }, 400);
      }
      const adminRepo = new AdminRepository(this.db);
      await adminRepo.updateDomain(parseInt(id), body);
      return c.json({
        code: "OK",
        message: "Domain updated successfully"
      });
    } catch (error3) {
      console.error("Update domain error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to update domain" }, 500);
    }
  }
  async deleteDomain(c) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return c.json({ code: "INVALID_INPUT", message: "Missing domain ID" }, 400);
      }
      const adminRepo = new AdminRepository(this.db);
      await adminRepo.deleteDomain(parseInt(id));
      return c.json({
        code: "OK",
        message: "Domain deleted successfully"
      });
    } catch (error3) {
      console.error("Delete domain error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to delete domain" }, 500);
    }
  }
  async getSubdomains(c) {
    try {
      const adminRepo = new AdminRepository(this.db);
      const page = parseInt(c.req.query("page") || "1");
      const page_size = parseInt(c.req.query("page_size") || c.req.query("limit") || "100");
      const limit = page_size;
      const offset = (page - 1) * page_size;
      const status = c.req.query("status") ? parseInt(c.req.query("status")) : void 0;
      const subdomains = await adminRepo.getSubdomains(limit, offset, status);
      const count3 = await adminRepo.getSubdomainsCount(status);
      return c.json({
        code: "OK",
        message: "Success",
        data: {
          items: subdomains,
          total: count3,
          page,
          page_size
        }
      });
    } catch (error3) {
      console.error("Get subdomains error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get subdomains" }, 500);
    }
  }
  async getRecords(c) {
    try {
      const adminRepo = new AdminRepository(this.db);
      const page = parseInt(c.req.query("page") || "1");
      const page_size = parseInt(c.req.query("page_size") || c.req.query("limit") || "100");
      const limit = page_size;
      const offset = (page - 1) * page_size;
      const records = await adminRepo.getRecords(limit, offset);
      const count3 = await adminRepo.getRecordsCount();
      return c.json({
        code: "OK",
        message: "Success",
        data: {
          items: records,
          total: count3,
          page,
          page_size
        }
      });
    } catch (error3) {
      console.error("Get records error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get records" }, 500);
    }
  }
  async getOperationLogs(c) {
    try {
      const adminRepo = new AdminRepository(this.db);
      const page = parseInt(c.req.query("page") || "1");
      const page_size = parseInt(c.req.query("page_size") || c.req.query("limit") || "100");
      const limit = page_size;
      const offset = (page - 1) * page_size;
      const logs = await adminRepo.getOperationLogs(limit, offset);
      const count3 = await adminRepo.getOperationLogsCount();
      return c.json({
        code: "OK",
        message: "Success",
        data: {
          items: logs,
          total: count3,
          page,
          page_size
        }
      });
    } catch (error3) {
      console.error("Get operation logs error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get operation logs" }, 500);
    }
  }
  async getProviders(c) {
    try {
      const keys = getRegisteredKeys();
      const providers = keys.map((key) => {
        const provider = getProvider(key);
        if (!provider)
          return null;
        return {
          key: provider.key(),
          label: provider.label(),
          fields: provider.configFields()
        };
      }).filter(Boolean);
      return c.json({
        code: "OK",
        message: "Success",
        data: providers
      });
    } catch (error3) {
      console.error("Get providers error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get providers" }, 500);
    }
  }
  async getProviderZones(c) {
    try {
      const body = await c.req.json();
      const { key, config: config2 } = body;
      if (!key || !config2) {
        return c.json({ code: "INVALID_INPUT", message: "Missing key or config" }, 400);
      }
      const provider = getProvider(key);
      if (!provider) {
        return c.json({ code: "PROVIDER_NOT_FOUND", message: "Provider not found" }, 404);
      }
      provider.configure(config2);
      const zones = await provider.listZones();
      return c.json({
        code: "OK",
        message: "Success",
        data: zones
      });
    } catch (error3) {
      console.error("Get provider zones error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: error3.message || "Failed to get zones" }, 500);
    }
  }
};
__name(AdminController, "AdminController");

// src/controllers/health.controller.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var HealthController = class {
  constructor(db) {
    this.db = db;
  }
  async check(c) {
    try {
      const result = await this.db.queryOne("SELECT COUNT(*) as count FROM users");
      return c.json({
        code: "OK",
        message: "Service is healthy",
        data: {
          status: "healthy",
          database: "connected",
          users_count: result?.count || 0,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
    } catch (error3) {
      console.error("Health check error:", error3);
      return c.json({
        code: "UNHEALTHY",
        message: "Service is unhealthy",
        data: {
          status: "unhealthy",
          database: "disconnected",
          error: error3 instanceof Error ? error3.message : "Unknown error"
        }
      }, 503);
    }
  }
};
__name(HealthController, "HealthController");

// src/controllers/install.controller.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_repositories();
var InstallController = class {
  constructor(db) {
    this.db = db;
  }
  async createAdmin(c) {
    try {
      const body = await c.req.json();
      const { username, email, password } = body;
      if (!username || !password) {
        return c.json({ code: "INVALID_INPUT", message: "Missing required fields" }, 400);
      }
      if (password.length < 8) {
        return c.json({ code: "INVALID_INPUT", message: "Password must be at least 8 characters" }, 400);
      }
      const authRepo = new AuthRepository(this.db);
      const existingAdmin = await authRepo.findLoginUser(username);
      if (existingAdmin) {
        return c.json({ code: "USER_EXISTS", message: "Username already exists" }, 409);
      }
      const passwordHash = await hashPassword(password);
      const adminId = await authRepo.createUser({
        username,
        email: email || "",
        group_id: 99,
        status: 2,
        points: 0
      }, passwordHash, "");
      return c.json({
        code: "OK",
        message: "Admin user created successfully",
        data: { id: adminId, username, email, group_id: 99 }
      }, 201);
    } catch (error3) {
      console.error("Create admin error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to create admin" }, 500);
    }
  }
};
__name(InstallController, "InstallController");

// src/controllers/settings.controller.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_repositories();
var SettingsController = class {
  constructor(db) {
    this.db = db;
  }
  async getSettings(c) {
    try {
      const settingsRepo = new SettingsRepository(this.db);
      const settings = await settingsRepo.getAll();
      return c.json({
        code: "OK",
        message: "Success",
        data: settings
      });
    } catch (error3) {
      console.error("Get settings error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get settings" }, 500);
    }
  }
  async updateSettings(c) {
    try {
      const auth = getAuth(c);
      if (auth.user.group_id !== 99) {
        return c.json({ code: "FORBIDDEN", message: "Admin access required" }, 403);
      }
      const body = await c.req.json();
      const settingsRepo = new SettingsRepository(this.db);
      for (const [key, value] of Object.entries(body)) {
        await settingsRepo.set(key, value);
      }
      return c.json({
        code: "OK",
        message: "Settings updated successfully"
      });
    } catch (error3) {
      console.error("Update settings error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to update settings" }, 500);
    }
  }
  async getWebSettings(c) {
    try {
      const settingsRepo = new SettingsRepository(this.db);
      const webSettings = await settingsRepo.getJSON("array_web");
      return c.json({
        code: "OK",
        message: "Success",
        data: webSettings
      });
    } catch (error3) {
      console.error("Get web settings error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get web settings" }, 500);
    }
  }
  async getTurnstileSettings(c) {
    try {
      const settingsRepo = new SettingsRepository(this.db);
      const turnstileSettings = await settingsRepo.getJSON("array_turnstile");
      const data = {
        site_key: turnstileSettings?.site_key || "",
        register_enabled: turnstileSettings?.register_enabled === "1",
        login_enabled: turnstileSettings?.login_enabled === "1"
      };
      return c.json({
        code: "OK",
        message: "Success",
        data
      });
    } catch (error3) {
      console.error("Get turnstile settings error:", error3);
      return c.json({ code: "INTERNAL_ERROR", message: "Failed to get turnstile settings" }, 500);
    }
  }
};
__name(SettingsController, "SettingsController");

// src/routes/router.ts
function createControllers(db) {
  return {
    auth: new AuthController(db),
    api: new APIController(db),
    admin: new AdminController(db),
    health: new HealthController(db),
    install: new InstallController(db),
    settings: new SettingsController(db)
  };
}
__name(createControllers, "createControllers");
function createRouter() {
  const app2 = new Hono2();
  app2.use("*", corsMiddleware());
  app2.get("/api/health", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.health.check(c);
  });
  app2.post("/api/install/admin", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.install.createAdmin(c);
  });
  app2.post("/api/auth/register", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.auth.register(c);
  });
  app2.post("/api/auth/login", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.auth.login(c);
  });
  app2.post("/api/admin/auth/login", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.auth.login(c);
  });
  app2.get("/api/public/domains", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.getPublicDomains(c);
  });
  app2.get("/api/settings/turnstile", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.settings.getTurnstileSettings(c);
  });
  const api = new Hono2();
  api.use("*", async (c, next) => {
    const db = new Database(c.env.DB);
    return authMiddleware(db)(c, next);
  });
  api.get("/auth/me", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.auth.me(c);
  });
  api.put("/auth/password", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.auth.changePassword(c);
  });
  api.get("/domains", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.getDomains(c);
  });
  api.get("/settings/dns-policy", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.settings.getSettings(c);
  });
  api.get("/subdomains", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.getSubdomains(c);
  });
  api.post("/subdomains", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.createSubdomain(c);
  });
  api.delete("/subdomains/:id", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.deleteSubdomain(c);
  });
  api.get("/records", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.getRecords(c);
  });
  api.post("/records", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.createRecord(c);
  });
  api.put("/records/:id", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.updateRecord(c);
  });
  api.delete("/records/:id", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.deleteRecord(c);
  });
  api.get("/points", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.getPoints(c);
  });
  api.get("/tokens", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.getTokens(c);
  });
  api.post("/tokens", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.createToken(c);
  });
  api.delete("/tokens/:id", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.deleteToken(c);
  });
  app2.route("/api", api);
  const admin = new Hono2();
  admin.use("*", async (c, next) => {
    const db = new Database(c.env.DB);
    return authMiddleware(db)(c, next);
  });
  admin.use("*", async (c, next) => {
    return adminMiddleware()(c, next);
  });
  admin.get("/users", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getUsers(c);
  });
  admin.put("/users/:id", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.updateUser(c);
  });
  admin.delete("/users/:id", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.deleteUser(c);
  });
  admin.post("/users/:id/points", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.adjustPoints(c);
  });
  admin.get("/points", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getUsers(c);
  });
  admin.get("/groups", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getGroups(c);
  });
  admin.post("/groups", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.createGroup(c);
  });
  admin.delete("/groups/:id", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.deleteGroup(c);
  });
  admin.get("/domains", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getDomains(c);
  });
  admin.post("/domains", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.createDomain(c);
  });
  admin.post("/domains/:id/sync-records", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.updateDomain(c);
  });
  admin.put("/domains/:id", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.updateDomain(c);
  });
  admin.delete("/domains/:id", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.deleteDomain(c);
  });
  admin.get("/dns-providers", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getProviders(c);
  });
  admin.post("/dns-providers/zones", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getProviderZones(c);
  });
  admin.get("/records", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getRecords(c);
  });
  admin.post("/records", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getRecords(c);
  });
  admin.put("/records/:id", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getRecords(c);
  });
  admin.delete("/records/:id", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getRecords(c);
  });
  admin.get("/subdomains", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getSubdomains(c);
  });
  admin.post("/subdomains/:id/approve", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getSubdomains(c);
  });
  admin.post("/subdomains/:id/reject", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getSubdomains(c);
  });
  admin.delete("/subdomains/:id", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getSubdomains(c);
  });
  admin.get("/logs", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getOperationLogs(c);
  });
  admin.get("/settings", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.settings.getSettings(c);
  });
  admin.put("/settings", async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.settings.updateSettings(c);
  });
  app2.route("/api/admin", admin);
  app2.get("*", async (c) => {
    const accept = c.req.header("Accept") || "";
    const userAgent = c.req.header("User-Agent") || "";
    const isHtmlRequest = accept.includes("text/html") || accept.includes("*/*") || userAgent.includes("Mozilla");
    if (!isHtmlRequest) {
      return c.json({ code: "NOT_FOUND", message: "Not Found" }, 404);
    }
    if (c.env.ASSETS) {
      const indexUrl = new URL("/index.html", c.req.url);
      const response = await c.env.ASSETS.fetch(new Request(indexUrl, c.req.raw));
      if (response.status === 200) {
        return new Response(response.body, {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=utf-8"
          }
        });
      }
    }
    if (c.env.__STATIC_CONTENT) {
      const indexHtml = await c.env.__STATIC_CONTENT.get("index.html");
      if (indexHtml) {
        return new Response(indexHtml, {
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      }
    }
    return c.html(
      '<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><link rel="icon" href="/favicon.svg" type="image/svg+xml" /><title>KLDNS</title><script type="module" crossorigin src="/assets/index-CLvzR696.js"><\/script><link rel="stylesheet" crossorigin href="/assets/index-B0sePWi5.css"></head><body><div id="app"></div></body></html>',
      200
    );
  });
  return app2;
}
__name(createRouter, "createRouter");

// src/index.ts
init_repositories();
var app = createRouter();
var migrationsRun = false;
async function ensureMigrations(env2) {
  if (migrationsRun)
    return;
  if (!env2.DB)
    return;
  try {
    const db = new Database(env2.DB);
    await runMigrations(db);
    migrationsRun = true;
  } catch (error3) {
    console.error("Migration error:", error3);
  }
}
__name(ensureMigrations, "ensureMigrations");
var src_default = {
  async fetch(request, env2, ctx) {
    try {
      await ensureMigrations(env2);
      return await app.fetch(request, env2, ctx);
    } catch (error3) {
      console.error("Unhandled error:", error3);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-sBcvvS/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
init_strip_cf_connecting_ip_header();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-sBcvvS/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
