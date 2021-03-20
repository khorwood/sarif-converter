module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 440:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class CheckovConverter {
    convert(data) {
        const report = JSON.parse(data.toString('utf-8'));
        const sarif = {
            $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
            version: '2.1.0',
            runs: this._convertRuns(report)
        };
        return sarif;
    }
    _convertRuns(report) {
        const run = {
            tool: {
                driver: {
                    name: 'checkov',
                    version: report.summary.checkov_version
                }
            },
            results: this._convertResults(report.results)
        };
        return [run];
    }
    _convertResults(results) {
        return results.failed_checks.map(t => this._convertCheck(t));
    }
    _convertCheck(check) {
        return {
            level: 'error',
            locations: [
                {
                    physicalLocation: {
                        artifactLocation: {
                            uri: check.file_path.replace(/^\//, '')
                        },
                        region: {
                            startLine: check.file_line_range[0],
                            endLine: check.file_line_range.slice(-1)[0]
                        }
                    }
                }
            ],
            message: {
                text: check.check_name
            },
            properties: {
                resource: check.resource
            },
            ruleId: check.check_id
        };
    }
}
exports.default = CheckovConverter;


/***/ }),

/***/ 283:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __nccwpck_require__(186);
const fs_1 = __nccwpck_require__(747);
const ow_1 = __nccwpck_require__(398);
const checkov_converter_1 = __nccwpck_require__(440);
const SupportedTypes = ['checkov'];
function getConverter(type) {
    if (type === 'checkov') {
        return new checkov_converter_1.default();
    }
    throw new Error('Unknown type');
}
async function run() {
    const type = core.getInput('type');
    const input = core.getInput('input');
    const output = core.getInput('output');
    ow_1.default(type, ow_1.default.string.oneOf(SupportedTypes));
    ow_1.default(input, ow_1.default.string.maxLength(100));
    ow_1.default(output, ow_1.default.string.maxLength(100));
    const converter = getConverter(type);
    const data = await fs_1.promises.readFile(input);
    const sarif = converter.convert(data);
    await fs_1.promises.writeFile(output, JSON.stringify(sarif, null, 4));
}
(async function () {
    await run();
})();


/***/ }),

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(278);
const os = __importStar(__nccwpck_require__(87));
const path = __importStar(__nccwpck_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(747));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 18:
/***/ ((module) => {

"use strict";


const callsites = () => {
	const _prepareStackTrace = Error.prepareStackTrace;
	Error.prepareStackTrace = (_, stack) => stack;
	const stack = new Error().stack.slice(1);
	Error.prepareStackTrace = _prepareStackTrace;
	return stack;
};

module.exports = callsites;
// TODO: Remove this for the next major release
module.exports.default = callsites;


/***/ }),

/***/ 389:
/***/ ((module) => {

"use strict";


module.exports = value => {
	const type = typeof value;
	return value !== null && (type === 'object' || type === 'function');
};


/***/ }),

/***/ 309:
/***/ ((module, exports, __nccwpck_require__) => {

/* module decorator */ module = __nccwpck_require__.nmd(module);
/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEqual;


/***/ }),

/***/ 621:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ArgumentError = void 0;
const generate_stack_1 = __nccwpck_require__(960);
const wrapStackTrace = (error, stack) => `${error.name}: ${error.message}\n${stack}`;
/**
@hidden
*/
class ArgumentError extends Error {
    constructor(message, context, errors = new Map()) {
        super(message);
        Object.defineProperty(this, "validationErrors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = 'ArgumentError';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, context);
        }
        else {
            this.stack = wrapStackTrace(this, generate_stack_1.generateStackTrace());
        }
        this.validationErrors = errors;
    }
}
exports.ArgumentError = ArgumentError;


/***/ }),

/***/ 398:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ArgumentError = exports.AnyPredicate = exports.DataViewPredicate = exports.ArrayBufferPredicate = exports.TypedArrayPredicate = exports.WeakSetPredicate = exports.SetPredicate = exports.WeakMapPredicate = exports.MapPredicate = exports.ErrorPredicate = exports.DatePredicate = exports.ObjectPredicate = exports.ArrayPredicate = exports.BooleanPredicate = exports.NumberPredicate = exports.StringPredicate = exports.Predicate = void 0;
const callsites_1 = __nccwpck_require__(18);
const infer_label_1 = __nccwpck_require__(429);
const predicate_1 = __nccwpck_require__(745);
Object.defineProperty(exports, "Predicate", ({ enumerable: true, get: function () { return predicate_1.Predicate; } }));
const base_predicate_1 = __nccwpck_require__(625);
const modifiers_1 = __nccwpck_require__(7);
const predicates_1 = __nccwpck_require__(86);
const test_1 = __nccwpck_require__(463);
const ow = (value, labelOrPredicate, predicate) => {
    if (!base_predicate_1.isPredicate(labelOrPredicate) && typeof labelOrPredicate !== 'string') {
        throw new TypeError(`Expected second argument to be a predicate or a string, got \`${typeof labelOrPredicate}\``);
    }
    if (base_predicate_1.isPredicate(labelOrPredicate)) {
        // If the second argument is a predicate, infer the label
        const stackFrames = callsites_1.default();
        test_1.default(value, () => infer_label_1.inferLabel(stackFrames), labelOrPredicate);
        return;
    }
    test_1.default(value, labelOrPredicate, predicate);
};
Object.defineProperties(ow, {
    isValid: {
        value: (value, predicate) => {
            try {
                ow(value, predicate);
                return true;
            }
            catch (_a) {
                return false;
            }
        }
    },
    create: {
        value: (labelOrPredicate, predicate) => (value, label) => {
            if (base_predicate_1.isPredicate(labelOrPredicate)) {
                const stackFrames = callsites_1.default();
                test_1.default(value, label !== null && label !== void 0 ? label : (() => infer_label_1.inferLabel(stackFrames)), labelOrPredicate);
                return;
            }
            test_1.default(value, label !== null && label !== void 0 ? label : (labelOrPredicate), predicate);
        }
    }
});
// Can't use `export default predicates(modifiers(ow)) as Ow` because the variable needs a type annotation to avoid a compiler error when used:
// Assertions require every name in the call target to be declared with an explicit type annotation.ts(2775)
// See https://github.com/microsoft/TypeScript/issues/36931 for more details.
const _ow = predicates_1.default(modifiers_1.default(ow));
exports.default = _ow;
var predicates_2 = __nccwpck_require__(86);
Object.defineProperty(exports, "StringPredicate", ({ enumerable: true, get: function () { return predicates_2.StringPredicate; } }));
Object.defineProperty(exports, "NumberPredicate", ({ enumerable: true, get: function () { return predicates_2.NumberPredicate; } }));
Object.defineProperty(exports, "BooleanPredicate", ({ enumerable: true, get: function () { return predicates_2.BooleanPredicate; } }));
Object.defineProperty(exports, "ArrayPredicate", ({ enumerable: true, get: function () { return predicates_2.ArrayPredicate; } }));
Object.defineProperty(exports, "ObjectPredicate", ({ enumerable: true, get: function () { return predicates_2.ObjectPredicate; } }));
Object.defineProperty(exports, "DatePredicate", ({ enumerable: true, get: function () { return predicates_2.DatePredicate; } }));
Object.defineProperty(exports, "ErrorPredicate", ({ enumerable: true, get: function () { return predicates_2.ErrorPredicate; } }));
Object.defineProperty(exports, "MapPredicate", ({ enumerable: true, get: function () { return predicates_2.MapPredicate; } }));
Object.defineProperty(exports, "WeakMapPredicate", ({ enumerable: true, get: function () { return predicates_2.WeakMapPredicate; } }));
Object.defineProperty(exports, "SetPredicate", ({ enumerable: true, get: function () { return predicates_2.SetPredicate; } }));
Object.defineProperty(exports, "WeakSetPredicate", ({ enumerable: true, get: function () { return predicates_2.WeakSetPredicate; } }));
Object.defineProperty(exports, "TypedArrayPredicate", ({ enumerable: true, get: function () { return predicates_2.TypedArrayPredicate; } }));
Object.defineProperty(exports, "ArrayBufferPredicate", ({ enumerable: true, get: function () { return predicates_2.ArrayBufferPredicate; } }));
Object.defineProperty(exports, "DataViewPredicate", ({ enumerable: true, get: function () { return predicates_2.DataViewPredicate; } }));
Object.defineProperty(exports, "AnyPredicate", ({ enumerable: true, get: function () { return predicates_2.AnyPredicate; } }));
var argument_error_1 = __nccwpck_require__(621);
Object.defineProperty(exports, "ArgumentError", ({ enumerable: true, get: function () { return argument_error_1.ArgumentError; } }));


/***/ }),

/***/ 7:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const predicates_1 = __nccwpck_require__(86);
exports.default = (object) => {
    Object.defineProperties(object, {
        optional: {
            get: () => predicates_1.default({}, { optional: true })
        }
    });
    return object;
};


/***/ }),

/***/ 93:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.not = void 0;
const random_id_1 = __nccwpck_require__(98);
const predicate_1 = __nccwpck_require__(745);
/**
Operator which inverts the following validation.

@hidden

@param predictate - Predicate to wrap inside the operator.
*/
const not = (predicate) => {
    const originalAddValidator = predicate.addValidator;
    predicate.addValidator = (validator) => {
        const { validator: fn, message, negatedMessage } = validator;
        const placeholder = random_id_1.default();
        validator.message = (value, label) => (negatedMessage ?
            negatedMessage(value, label) :
            message(value, placeholder).replace(/ to /, '$&not ').replace(placeholder, label));
        validator.validator = (value) => !fn(value);
        predicate[predicate_1.validatorSymbol].push(validator);
        predicate.addValidator = originalAddValidator;
        return predicate;
    };
    return predicate;
};
exports.not = not;


/***/ }),

/***/ 86:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnyPredicate = exports.DataViewPredicate = exports.ArrayBufferPredicate = exports.TypedArrayPredicate = exports.WeakSetPredicate = exports.SetPredicate = exports.WeakMapPredicate = exports.MapPredicate = exports.ErrorPredicate = exports.DatePredicate = exports.ObjectPredicate = exports.ArrayPredicate = exports.BooleanPredicate = exports.NumberPredicate = exports.StringPredicate = void 0;
const string_1 = __nccwpck_require__(10);
Object.defineProperty(exports, "StringPredicate", ({ enumerable: true, get: function () { return string_1.StringPredicate; } }));
const number_1 = __nccwpck_require__(363);
Object.defineProperty(exports, "NumberPredicate", ({ enumerable: true, get: function () { return number_1.NumberPredicate; } }));
const boolean_1 = __nccwpck_require__(674);
Object.defineProperty(exports, "BooleanPredicate", ({ enumerable: true, get: function () { return boolean_1.BooleanPredicate; } }));
const predicate_1 = __nccwpck_require__(745);
const array_1 = __nccwpck_require__(859);
Object.defineProperty(exports, "ArrayPredicate", ({ enumerable: true, get: function () { return array_1.ArrayPredicate; } }));
const object_1 = __nccwpck_require__(442);
Object.defineProperty(exports, "ObjectPredicate", ({ enumerable: true, get: function () { return object_1.ObjectPredicate; } }));
const date_1 = __nccwpck_require__(720);
Object.defineProperty(exports, "DatePredicate", ({ enumerable: true, get: function () { return date_1.DatePredicate; } }));
const error_1 = __nccwpck_require__(502);
Object.defineProperty(exports, "ErrorPredicate", ({ enumerable: true, get: function () { return error_1.ErrorPredicate; } }));
const map_1 = __nccwpck_require__(772);
Object.defineProperty(exports, "MapPredicate", ({ enumerable: true, get: function () { return map_1.MapPredicate; } }));
const weak_map_1 = __nccwpck_require__(606);
Object.defineProperty(exports, "WeakMapPredicate", ({ enumerable: true, get: function () { return weak_map_1.WeakMapPredicate; } }));
const set_1 = __nccwpck_require__(17);
Object.defineProperty(exports, "SetPredicate", ({ enumerable: true, get: function () { return set_1.SetPredicate; } }));
const weak_set_1 = __nccwpck_require__(276);
Object.defineProperty(exports, "WeakSetPredicate", ({ enumerable: true, get: function () { return weak_set_1.WeakSetPredicate; } }));
const typed_array_1 = __nccwpck_require__(132);
Object.defineProperty(exports, "TypedArrayPredicate", ({ enumerable: true, get: function () { return typed_array_1.TypedArrayPredicate; } }));
const array_buffer_1 = __nccwpck_require__(432);
Object.defineProperty(exports, "ArrayBufferPredicate", ({ enumerable: true, get: function () { return array_buffer_1.ArrayBufferPredicate; } }));
const data_view_1 = __nccwpck_require__(505);
Object.defineProperty(exports, "DataViewPredicate", ({ enumerable: true, get: function () { return data_view_1.DataViewPredicate; } }));
const any_1 = __nccwpck_require__(796);
Object.defineProperty(exports, "AnyPredicate", ({ enumerable: true, get: function () { return any_1.AnyPredicate; } }));
exports.default = (object, options) => {
    Object.defineProperties(object, {
        string: {
            get: () => new string_1.StringPredicate(options)
        },
        number: {
            get: () => new number_1.NumberPredicate(options)
        },
        boolean: {
            get: () => new boolean_1.BooleanPredicate(options)
        },
        undefined: {
            get: () => new predicate_1.Predicate('undefined', options)
        },
        null: {
            get: () => new predicate_1.Predicate('null', options)
        },
        nullOrUndefined: {
            get: () => new predicate_1.Predicate('nullOrUndefined', options)
        },
        nan: {
            get: () => new predicate_1.Predicate('nan', options)
        },
        symbol: {
            get: () => new predicate_1.Predicate('symbol', options)
        },
        array: {
            get: () => new array_1.ArrayPredicate(options)
        },
        object: {
            get: () => new object_1.ObjectPredicate(options)
        },
        date: {
            get: () => new date_1.DatePredicate(options)
        },
        error: {
            get: () => new error_1.ErrorPredicate(options)
        },
        map: {
            get: () => new map_1.MapPredicate(options)
        },
        weakMap: {
            get: () => new weak_map_1.WeakMapPredicate(options)
        },
        set: {
            get: () => new set_1.SetPredicate(options)
        },
        weakSet: {
            get: () => new weak_set_1.WeakSetPredicate(options)
        },
        function: {
            get: () => new predicate_1.Predicate('Function', options)
        },
        buffer: {
            get: () => new predicate_1.Predicate('Buffer', options)
        },
        regExp: {
            get: () => new predicate_1.Predicate('RegExp', options)
        },
        promise: {
            get: () => new predicate_1.Predicate('Promise', options)
        },
        typedArray: {
            get: () => new typed_array_1.TypedArrayPredicate('TypedArray', options)
        },
        int8Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Int8Array', options)
        },
        uint8Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Uint8Array', options)
        },
        uint8ClampedArray: {
            get: () => new typed_array_1.TypedArrayPredicate('Uint8ClampedArray', options)
        },
        int16Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Int16Array', options)
        },
        uint16Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Uint16Array', options)
        },
        int32Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Int32Array', options)
        },
        uint32Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Uint32Array', options)
        },
        float32Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Float32Array', options)
        },
        float64Array: {
            get: () => new typed_array_1.TypedArrayPredicate('Float64Array', options)
        },
        arrayBuffer: {
            get: () => new array_buffer_1.ArrayBufferPredicate('ArrayBuffer', options)
        },
        sharedArrayBuffer: {
            get: () => new array_buffer_1.ArrayBufferPredicate('SharedArrayBuffer', options)
        },
        dataView: {
            get: () => new data_view_1.DataViewPredicate(options)
        },
        iterable: {
            get: () => new predicate_1.Predicate('Iterable', options)
        },
        any: {
            value: (...predicates) => new any_1.AnyPredicate(predicates, options)
        }
    });
    return object;
};


/***/ }),

/***/ 796:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnyPredicate = void 0;
const argument_error_1 = __nccwpck_require__(621);
const base_predicate_1 = __nccwpck_require__(625);
const generate_argument_error_message_1 = __nccwpck_require__(420);
/**
@hidden
*/
class AnyPredicate {
    constructor(predicates, options = {}) {
        Object.defineProperty(this, "predicates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: predicates
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options
        });
    }
    [base_predicate_1.testSymbol](value, main, label) {
        const errors = new Map();
        for (const predicate of this.predicates) {
            try {
                main(value, label, predicate);
                return;
            }
            catch (error) {
                if (value === undefined && this.options.optional === true) {
                    return;
                }
                // If we received an ArgumentError, then..
                if (error instanceof argument_error_1.ArgumentError) {
                    // Iterate through every error reported.
                    for (const [key, value] of error.validationErrors.entries()) {
                        // Get the current errors set, if any.
                        const alreadyPresent = errors.get(key);
                        // Add all errors under the same key
                        errors.set(key, new Set([...alreadyPresent !== null && alreadyPresent !== void 0 ? alreadyPresent : [], ...value]));
                    }
                }
            }
        }
        if (errors.size > 0) {
            // Generate the `error.message` property.
            const message = generate_argument_error_message_1.generateArgumentErrorMessage(errors, true);
            throw new argument_error_1.ArgumentError(`Any predicate failed with the following errors:\n${message}`, main, errors);
        }
    }
}
exports.AnyPredicate = AnyPredicate;


/***/ }),

/***/ 432:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ArrayBufferPredicate = void 0;
const predicate_1 = __nccwpck_require__(745);
class ArrayBufferPredicate extends predicate_1.Predicate {
    /**
    Test an array buffer to have a specific byte length.

    @param byteLength - The byte length of the array buffer.
    */
    byteLength(byteLength) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
            validator: value => value.byteLength === byteLength
        });
    }
    /**
    Test an array buffer to have a minimum byte length.

    @param byteLength - The minimum byte length of the array buffer.
    */
    minByteLength(byteLength) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have a minimum byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
            validator: value => value.byteLength >= byteLength,
            negatedMessage: (value, label) => `Expected ${label} to have a maximum byte length of \`${byteLength - 1}\`, got \`${value.byteLength}\``
        });
    }
    /**
    Test an array buffer to have a minimum byte length.

    @param length - The minimum byte length of the array buffer.
    */
    maxByteLength(byteLength) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have a maximum byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
            validator: value => value.byteLength <= byteLength,
            negatedMessage: (value, label) => `Expected ${label} to have a minimum byte length of \`${byteLength + 1}\`, got \`${value.byteLength}\``
        });
    }
}
exports.ArrayBufferPredicate = ArrayBufferPredicate;


/***/ }),

/***/ 859:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ArrayPredicate = void 0;
const isEqual = __nccwpck_require__(309);
const predicate_1 = __nccwpck_require__(745);
const __1 = __nccwpck_require__(398);
const match_shape_1 = __nccwpck_require__(832);
class ArrayPredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('array', options);
    }
    /**
    Test an array to have a specific length.

    @param length - The length of the array.
    */
    length(length) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have length \`${length}\`, got \`${value.length}\``,
            validator: value => value.length === length
        });
    }
    /**
    Test an array to have a minimum length.

    @param length - The minimum length of the array.
    */
    minLength(length) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have a minimum length of \`${length}\`, got \`${value.length}\``,
            validator: value => value.length >= length,
            negatedMessage: (value, label) => `Expected ${label} to have a maximum length of \`${length - 1}\`, got \`${value.length}\``
        });
    }
    /**
    Test an array to have a maximum length.

    @param length - The maximum length of the array.
    */
    maxLength(length) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have a maximum length of \`${length}\`, got \`${value.length}\``,
            validator: value => value.length <= length,
            negatedMessage: (value, label) => `Expected ${label} to have a minimum length of \`${length + 1}\`, got \`${value.length}\``
        });
    }
    /**
    Test an array to start with a specific value. The value is tested by identity, not structure.

    @param searchElement - The value that should be the start of the array.
    */
    startsWith(searchElement) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to start with \`${searchElement}\`, got \`${value[0]}\``,
            validator: value => value[0] === searchElement
        });
    }
    /**
    Test an array to end with a specific value. The value is tested by identity, not structure.

    @param searchElement - The value that should be the end of the array.
    */
    endsWith(searchElement) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to end with \`${searchElement}\`, got \`${value[value.length - 1]}\``,
            validator: value => value[value.length - 1] === searchElement
        });
    }
    /**
    Test an array to include all the provided elements. The values are tested by identity, not structure.

    @param searchElements - The values that should be included in the array.
    */
    includes(...searchElements) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to include all elements of \`${JSON.stringify(searchElements)}\`, got \`${JSON.stringify(value)}\``,
            validator: value => searchElements.every(element => value.includes(element))
        });
    }
    /**
    Test an array to include any of the provided elements. The values are tested by identity, not structure.

    @param searchElements - The values that should be included in the array.
    */
    includesAny(...searchElements) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to include any element of \`${JSON.stringify(searchElements)}\`, got \`${JSON.stringify(value)}\``,
            validator: value => searchElements.some(element => value.includes(element))
        });
    }
    /**
    Test an array to be empty.
    */
    get empty() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be empty, got \`${JSON.stringify(value)}\``,
            validator: value => value.length === 0
        });
    }
    /**
    Test an array to be not empty.
    */
    get nonEmpty() {
        return this.addValidator({
            message: (_, label) => `Expected ${label} to not be empty`,
            validator: value => value.length > 0
        });
    }
    /**
    Test an array to be deeply equal to the provided array.

    @param expected - Expected value to match.
    */
    deepEqual(expected) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be deeply equal to \`${JSON.stringify(expected)}\`, got \`${JSON.stringify(value)}\``,
            validator: value => isEqual(value, expected)
        });
    }
    /**
    Test all elements in the array to match to provided predicate.

    @param predicate - The predicate that should be applied against every individual item.

    @example
    ```
    ow(['a', 1], ow.array.ofType(ow.any(ow.string, ow.number)));
    ```
    */
    ofType(predicate) {
        let error;
        // TODO [typescript@>=5] If higher-kinded types are supported natively by typescript, refactor `addValidator` to use them to avoid the usage of `any`. Otherwise, bump or remove this TODO.
        return this.addValidator({
            message: (_, label) => `(${label}) ${error}`,
            validator: value => {
                try {
                    for (const item of value) {
                        __1.default(item, predicate);
                    }
                    return true;
                }
                catch (error_) {
                    error = error_.message;
                    return false;
                }
            }
        });
    }
    /**
    Test if the elements in the array exactly matches the elements placed at the same indices in the predicates array.

    @param predicates - Predicates to test the array against. Describes what the tested array should look like.

    @example
    ```
    ow(['1', 2], ow.array.exactShape([ow.string, ow.number]));
    ```
    */
    exactShape(predicates) {
        const shape = predicates;
        return this.addValidator({
            message: (_, label, message) => `${message.replace('Expected', 'Expected element')} in ${label}`,
            validator: object => match_shape_1.exact(object, shape, undefined, true)
        });
    }
}
exports.ArrayPredicate = ArrayPredicate;


/***/ }),

/***/ 625:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isPredicate = exports.testSymbol = void 0;
/**
@hidden
*/
exports.testSymbol = Symbol('test');
/**
@hidden
*/
const isPredicate = (value) => Boolean(value[exports.testSymbol]);
exports.isPredicate = isPredicate;


/***/ }),

/***/ 674:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BooleanPredicate = void 0;
const predicate_1 = __nccwpck_require__(745);
class BooleanPredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('boolean', options);
    }
    /**
    Test a boolean to be true.
    */
    get true() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be true, got ${value}`,
            validator: value => value
        });
    }
    /**
    Test a boolean to be false.
    */
    get false() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be false, got ${value}`,
            validator: value => !value
        });
    }
}
exports.BooleanPredicate = BooleanPredicate;


/***/ }),

/***/ 505:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DataViewPredicate = void 0;
const predicate_1 = __nccwpck_require__(745);
class DataViewPredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('DataView', options);
    }
    /**
    Test a DataView to have a specific byte length.

    @param byteLength - The byte length of the DataView.
    */
    byteLength(byteLength) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
            validator: value => value.byteLength === byteLength
        });
    }
    /**
    Test a DataView to have a minimum byte length.

    @param byteLength - The minimum byte length of the DataView.
    */
    minByteLength(byteLength) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have a minimum byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
            validator: value => value.byteLength >= byteLength,
            negatedMessage: (value, label) => `Expected ${label} to have a maximum byte length of \`${byteLength - 1}\`, got \`${value.byteLength}\``
        });
    }
    /**
    Test a DataView to have a minimum byte length.

    @param length - The minimum byte length of the DataView.
    */
    maxByteLength(byteLength) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have a maximum byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
            validator: value => value.byteLength <= byteLength,
            negatedMessage: (value, label) => `Expected ${label} to have a minimum byte length of \`${byteLength + 1}\`, got \`${value.byteLength}\``
        });
    }
}
exports.DataViewPredicate = DataViewPredicate;


/***/ }),

/***/ 720:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatePredicate = void 0;
const predicate_1 = __nccwpck_require__(745);
class DatePredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('date', options);
    }
    /**
    Test a date to be before another date.

    @param date - Maximum value.
    */
    before(date) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} ${value.toISOString()} to be before ${date.toISOString()}`,
            validator: value => value.getTime() < date.getTime()
        });
    }
    /**
    Test a date to be before another date.

    @param date - Minimum value.
    */
    after(date) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} ${value.toISOString()} to be after ${date.toISOString()}`,
            validator: value => value.getTime() > date.getTime()
        });
    }
}
exports.DatePredicate = DatePredicate;


/***/ }),

/***/ 502:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorPredicate = void 0;
const predicate_1 = __nccwpck_require__(745);
class ErrorPredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('error', options);
    }
    /**
    Test an error to have a specific name.

    @param expected - Expected name of the Error.
    */
    name(expected) {
        return this.addValidator({
            message: (error, label) => `Expected ${label} to have name \`${expected}\`, got \`${error.name}\``,
            validator: error => error.name === expected
        });
    }
    /**
    Test an error to have a specific message.

    @param expected - Expected message of the Error.
    */
    message(expected) {
        return this.addValidator({
            message: (error, label) => `Expected ${label} message to be \`${expected}\`, got \`${error.message}\``,
            validator: error => error.message === expected
        });
    }
    /**
    Test the error message to include a specific message.

    @param message - Message that should be included in the error.
    */
    messageIncludes(message) {
        return this.addValidator({
            message: (error, label) => `Expected ${label} message to include \`${message}\`, got \`${error.message}\``,
            validator: error => error.message.includes(message)
        });
    }
    /**
    Test the error object to have specific keys.

    @param keys - One or more keys which should be part of the error object.
    */
    hasKeys(...keys) {
        return this.addValidator({
            message: (_, label) => `Expected ${label} message to have keys \`${keys.join('`, `')}\``,
            validator: error => keys.every(key => Object.prototype.hasOwnProperty.call(error, key))
        });
    }
    /**
    Test an error to be of a specific instance type.

    @param instance - The expected instance type of the error.
    */
    instanceOf(instance) {
        return this.addValidator({
            message: (error, label) => `Expected ${label} \`${error.name}\` to be of type \`${instance.name}\``,
            validator: error => error instanceof instance
        });
    }
    /**
    Test an Error to be a TypeError.
    */
    get typeError() {
        return this.instanceOf(TypeError);
    }
    /**
    Test an Error to be an EvalError.
    */
    get evalError() {
        return this.instanceOf(EvalError);
    }
    /**
    Test an Error to be a RangeError.
    */
    get rangeError() {
        return this.instanceOf(RangeError);
    }
    /**
    Test an Error to be a ReferenceError.
    */
    get referenceError() {
        return this.instanceOf(ReferenceError);
    }
    /**
    Test an Error to be a SyntaxError.
    */
    get syntaxError() {
        return this.instanceOf(SyntaxError);
    }
    /**
    Test an Error to be a URIError.
    */
    get uriError() {
        return this.instanceOf(URIError);
    }
}
exports.ErrorPredicate = ErrorPredicate;


/***/ }),

/***/ 772:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MapPredicate = void 0;
const isEqual = __nccwpck_require__(309);
const has_items_1 = __nccwpck_require__(742);
const of_type_1 = __nccwpck_require__(155);
const predicate_1 = __nccwpck_require__(745);
class MapPredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('Map', options);
    }
    /**
    Test a Map to have a specific size.

    @param size - The size of the Map.
    */
    size(size) {
        return this.addValidator({
            message: (map, label) => `Expected ${label} to have size \`${size}\`, got \`${map.size}\``,
            validator: map => map.size === size
        });
    }
    /**
    Test an Map to have a minimum size.

    @param size - The minimum size of the Map.
    */
    minSize(size) {
        return this.addValidator({
            message: (map, label) => `Expected ${label} to have a minimum size of \`${size}\`, got \`${map.size}\``,
            validator: map => map.size >= size,
            negatedMessage: (map, label) => `Expected ${label} to have a maximum size of \`${size - 1}\`, got \`${map.size}\``
        });
    }
    /**
    Test an Map to have a maximum size.

    @param size - The maximum size of the Map.
    */
    maxSize(size) {
        return this.addValidator({
            message: (map, label) => `Expected ${label} to have a maximum size of \`${size}\`, got \`${map.size}\``,
            validator: map => map.size <= size,
            negatedMessage: (map, label) => `Expected ${label} to have a minimum size of \`${size + 1}\`, got \`${map.size}\``
        });
    }
    /**
    Test a Map to include all the provided keys. The keys are tested by identity, not structure.

    @param keys - The keys that should be a key in the Map.
    */
    hasKeys(...keys) {
        return this.addValidator({
            message: (_, label, missingKeys) => `Expected ${label} to have keys \`${JSON.stringify(missingKeys)}\``,
            validator: map => has_items_1.default(map, keys)
        });
    }
    /**
    Test a Map to include any of the provided keys. The keys are tested by identity, not structure.

    @param keys - The keys that could be a key in the Map.
    */
    hasAnyKeys(...keys) {
        return this.addValidator({
            message: (_, label) => `Expected ${label} to have any key of \`${JSON.stringify(keys)}\``,
            validator: map => keys.some(key => map.has(key))
        });
    }
    /**
    Test a Map to include all the provided values. The values are tested by identity, not structure.

    @param values - The values that should be a value in the Map.
    */
    hasValues(...values) {
        return this.addValidator({
            message: (_, label, missingValues) => `Expected ${label} to have values \`${JSON.stringify(missingValues)}\``,
            validator: map => has_items_1.default(new Set(map.values()), values)
        });
    }
    /**
    Test a Map to include any of the provided values. The values are tested by identity, not structure.

    @param values - The values that could be a value in the Map.
    */
    hasAnyValues(...values) {
        return this.addValidator({
            message: (_, label) => `Expected ${label} to have any value of \`${JSON.stringify(values)}\``,
            validator: map => {
                const valueSet = new Set(map.values());
                return values.some(key => valueSet.has(key));
            }
        });
    }
    /**
    Test all the keys in the Map to match the provided predicate.

    @param predicate - The predicate that should be applied against every key in the Map.
    */
    keysOfType(predicate) {
        return this.addValidator({
            message: (_, label, error) => `(${label}) ${error}`,
            validator: map => of_type_1.default(map.keys(), predicate)
        });
    }
    /**
    Test all the values in the Map to match the provided predicate.

    @param predicate - The predicate that should be applied against every value in the Map.
    */
    valuesOfType(predicate) {
        return this.addValidator({
            message: (_, label, error) => `(${label}) ${error}`,
            validator: map => of_type_1.default(map.values(), predicate)
        });
    }
    /**
    Test a Map to be empty.
    */
    get empty() {
        return this.addValidator({
            message: (map, label) => `Expected ${label} to be empty, got \`${JSON.stringify([...map])}\``,
            validator: map => map.size === 0
        });
    }
    /**
    Test a Map to be not empty.
    */
    get nonEmpty() {
        return this.addValidator({
            message: (_, label) => `Expected ${label} to not be empty`,
            validator: map => map.size > 0
        });
    }
    /**
    Test a Map to be deeply equal to the provided Map.

    @param expected - Expected Map to match.
    */
    deepEqual(expected) {
        return this.addValidator({
            message: (map, label) => `Expected ${label} to be deeply equal to \`${JSON.stringify([...expected])}\`, got \`${JSON.stringify([...map])}\``,
            validator: map => isEqual(map, expected)
        });
    }
}
exports.MapPredicate = MapPredicate;


/***/ }),

/***/ 363:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NumberPredicate = void 0;
const is_1 = __nccwpck_require__(403);
const predicate_1 = __nccwpck_require__(745);
class NumberPredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('number', options);
    }
    /**
    Test a number to be in a specified range.

    @param start - Start of the range.
    @param end - End of the range.
    */
    inRange(start, end) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be in range [${start}..${end}], got ${value}`,
            validator: value => is_1.default.inRange(value, [start, end])
        });
    }
    /**
    Test a number to be greater than the provided value.

    @param number - Minimum value.
    */
    greaterThan(number) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be greater than ${number}, got ${value}`,
            validator: value => value > number
        });
    }
    /**
    Test a number to be greater than or equal to the provided value.

    @param number - Minimum value.
    */
    greaterThanOrEqual(number) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be greater than or equal to ${number}, got ${value}`,
            validator: value => value >= number
        });
    }
    /**
    Test a number to be less than the provided value.

    @param number - Maximum value.
    */
    lessThan(number) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be less than ${number}, got ${value}`,
            validator: value => value < number
        });
    }
    /**
    Test a number to be less than or equal to the provided value.

    @param number - Minimum value.
    */
    lessThanOrEqual(number) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be less than or equal to ${number}, got ${value}`,
            validator: value => value <= number
        });
    }
    /**
    Test a number to be equal to a specified number.

    @param expected - Expected value to match.
    */
    equal(expected) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be equal to ${expected}, got ${value}`,
            validator: value => value === expected
        });
    }
    /**
    Test if a number is an element of the provided list.

    @param list - List of possible values.
    */
    oneOf(list) {
        return this.addValidator({
            message: (value, label) => {
                let printedList = JSON.stringify(list);
                if (list.length > 10) {
                    const overflow = list.length - 10;
                    printedList = JSON.stringify(list.slice(0, 10)).replace(/]$/, `,…+${overflow} more]`);
                }
                return `Expected ${label} to be one of \`${printedList}\`, got ${value}`;
            },
            validator: value => list.includes(value)
        });
    }
    /**
    Test a number to be an integer.
    */
    get integer() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be an integer, got ${value}`,
            validator: value => is_1.default.integer(value)
        });
    }
    /**
    Test a number to be finite.
    */
    get finite() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be finite, got ${value}`,
            validator: value => !is_1.default.infinite(value)
        });
    }
    /**
    Test a number to be infinite.
    */
    get infinite() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be infinite, got ${value}`,
            validator: value => is_1.default.infinite(value)
        });
    }
    /**
    Test a number to be positive.
    */
    get positive() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be positive, got ${value}`,
            validator: value => value > 0
        });
    }
    /**
    Test a number to be negative.
    */
    get negative() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be negative, got ${value}`,
            validator: value => value < 0
        });
    }
    /**
    Test a number to be an integer or infinite.
    */
    get integerOrInfinite() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be an integer or infinite, got ${value}`,
            validator: value => is_1.default.integer(value) || is_1.default.infinite(value)
        });
    }
    /**
    Test a number to be in a valid range for a 8-bit unsigned integer.
    */
    get uint8() {
        return this.integer.inRange(0, 255);
    }
    /**
    Test a number to be in a valid range for a 16-bit unsigned integer.
    */
    get uint16() {
        return this.integer.inRange(0, 65535);
    }
    /**
    Test a number to be in a valid range for a 32-bit unsigned integer.
    */
    get uint32() {
        return this.integer.inRange(0, 4294967295);
    }
    /**
    Test a number to be in a valid range for a 8-bit signed integer.
    */
    get int8() {
        return this.integer.inRange(-128, 127);
    }
    /**
    Test a number to be in a valid range for a 16-bit signed integer.
    */
    get int16() {
        return this.integer.inRange(-32768, 32767);
    }
    /**
    Test a number to be in a valid range for a 32-bit signed integer.
    */
    get int32() {
        return this.integer.inRange(-2147483648, 2147483647);
    }
}
exports.NumberPredicate = NumberPredicate;


/***/ }),

/***/ 442:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ObjectPredicate = void 0;
const is_1 = __nccwpck_require__(403);
const dotProp = __nccwpck_require__(509);
const isEqual = __nccwpck_require__(309);
const has_items_1 = __nccwpck_require__(742);
const of_type_1 = __nccwpck_require__(155);
const of_type_deep_1 = __nccwpck_require__(986);
const match_shape_1 = __nccwpck_require__(832);
const predicate_1 = __nccwpck_require__(745);
class ObjectPredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('object', options);
    }
    /**
    Test if an Object is a plain object.
    */
    get plain() {
        return this.addValidator({
            message: (_, label) => `Expected ${label} to be a plain object`,
            validator: object => is_1.default.plainObject(object)
        });
    }
    /**
    Test an object to be empty.
    */
    get empty() {
        return this.addValidator({
            message: (object, label) => `Expected ${label} to be empty, got \`${JSON.stringify(object)}\``,
            validator: object => Object.keys(object).length === 0
        });
    }
    /**
    Test an object to be not empty.
    */
    get nonEmpty() {
        return this.addValidator({
            message: (_, label) => `Expected ${label} to not be empty`,
            validator: object => Object.keys(object).length > 0
        });
    }
    /**
    Test all the values in the object to match the provided predicate.

    @param predicate - The predicate that should be applied against every value in the object.
    */
    valuesOfType(predicate) {
        return this.addValidator({
            message: (_, label, error) => `(${label}) ${error}`,
            validator: object => of_type_1.default(Object.values(object), predicate)
        });
    }
    /**
    Test all the values in the object deeply to match the provided predicate.

    @param predicate - The predicate that should be applied against every value in the object.
    */
    deepValuesOfType(predicate) {
        return this.addValidator({
            message: (_, label, error) => `(${label}) ${error}`,
            validator: object => of_type_deep_1.default(object, predicate)
        });
    }
    /**
    Test an object to be deeply equal to the provided object.

    @param expected - Expected object to match.
    */
    deepEqual(expected) {
        return this.addValidator({
            message: (object, label) => `Expected ${label} to be deeply equal to \`${JSON.stringify(expected)}\`, got \`${JSON.stringify(object)}\``,
            validator: object => isEqual(object, expected)
        });
    }
    /**
    Test an object to be of a specific instance type.

    @param instance - The expected instance type of the object.
    */
    instanceOf(instance) {
        return this.addValidator({
            message: (object, label) => {
                let { name } = object.constructor;
                if (!name || name === 'Object') {
                    name = JSON.stringify(object);
                }
                return `Expected ${label} \`${name}\` to be of type \`${instance.name}\``;
            },
            validator: object => object instanceof instance
        });
    }
    /**
    Test an object to include all the provided keys. You can use [dot-notation](https://github.com/sindresorhus/dot-prop) in a key to access nested properties.

    @param keys - The keys that should be present in the object.
    */
    hasKeys(...keys) {
        return this.addValidator({
            message: (_, label, missingKeys) => `Expected ${label} to have keys \`${JSON.stringify(missingKeys)}\``,
            validator: object => has_items_1.default({
                has: item => dotProp.has(object, item)
            }, keys)
        });
    }
    /**
    Test an object to include any of the provided keys. You can use [dot-notation](https://github.com/sindresorhus/dot-prop) in a key to access nested properties.

    @param keys - The keys that could be a key in the object.
    */
    hasAnyKeys(...keys) {
        return this.addValidator({
            message: (_, label) => `Expected ${label} to have any key of \`${JSON.stringify(keys)}\``,
            validator: object => keys.some(key => dotProp.has(object, key))
        });
    }
    /**
    Test an object to match the `shape` partially. This means that it ignores unexpected properties. The shape comparison is deep.

    The shape is an object which describes how the tested object should look like. The keys are the same as the source object and the values are predicates.

    @param shape - Shape to test the object against.

    @example
    ```
    import ow from 'ow';

    const object = {
        unicorn: '🦄',
        rainbow: '🌈'
    };

    ow(object, ow.object.partialShape({
        unicorn: ow.string
    }));
    ```
    */
    partialShape(shape) {
        return this.addValidator({
            // TODO: Improve this when message handling becomes smarter
            message: (_, label, message) => `${message.replace('Expected', 'Expected property')} in ${label}`,
            validator: object => match_shape_1.partial(object, shape)
        });
    }
    /**
    Test an object to match the `shape` exactly. This means that will fail if it comes across unexpected properties. The shape comparison is deep.

    The shape is an object which describes how the tested object should look like. The keys are the same as the source object and the values are predicates.

    @param shape - Shape to test the object against.

    @example
    ```
    import ow from 'ow';

    ow({unicorn: '🦄'}, ow.object.exactShape({
        unicorn: ow.string
    }));
    ```
    */
    exactShape(shape) {
        // TODO [typescript@>=5] If higher-kinded types are supported natively by typescript, refactor `addValidator` to use them to avoid the usage of `any`. Otherwise, bump or remove this TODO.
        return this.addValidator({
            // TODO: Improve this when message handling becomes smarter
            message: (_, label, message) => `${message.replace('Expected', 'Expected property')} in ${label}`,
            validator: object => match_shape_1.exact(object, shape)
        });
    }
}
exports.ObjectPredicate = ObjectPredicate;


/***/ }),

/***/ 745:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Predicate = exports.validatorSymbol = void 0;
const is_1 = __nccwpck_require__(403);
const argument_error_1 = __nccwpck_require__(621);
const not_1 = __nccwpck_require__(93);
const base_predicate_1 = __nccwpck_require__(625);
const generate_argument_error_message_1 = __nccwpck_require__(420);
/**
@hidden
*/
exports.validatorSymbol = Symbol('validators');
/**
@hidden
*/
class Predicate {
    constructor(type, options = {}) {
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: type
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options
        });
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                validators: []
            }
        });
        this.context = {
            ...this.context,
            ...this.options
        };
        const typeString = this.type.charAt(0).toLowerCase() + this.type.slice(1);
        this.addValidator({
            message: (value, label) => {
                // We do not include type in this label as we do for other messages, because it would be redundant.
                const label_ = label === null || label === void 0 ? void 0 : label.slice(this.type.length + 1);
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                return `Expected ${label_ || 'argument'} to be of type \`${this.type}\` but received type \`${is_1.default(value)}\``;
            },
            validator: value => is_1.default[typeString](value)
        });
    }
    /**
    @hidden
    */
    [base_predicate_1.testSymbol](value, main, label) {
        // Create a map of labels -> received errors.
        const errors = new Map();
        for (const { validator, message } of this.context.validators) {
            if (this.options.optional === true && value === undefined) {
                continue;
            }
            let result;
            try {
                result = validator(value);
            }
            catch (error) {
                // Any errors caught means validators couldn't process the input.
                result = error;
            }
            if (result === true) {
                continue;
            }
            const label2 = is_1.default.function_(label) ? label() : label;
            const label_ = label2 ?
                `${this.type} \`${label2}\`` :
                this.type;
            const mapKey = label2 || this.type;
            // Get the current errors encountered for this label.
            const currentErrors = errors.get(mapKey);
            // Pre-generate the error message that will be reported to the user.
            const errorMessage = message(value, label_, result);
            // If we already have any errors for this label.
            if (currentErrors) {
                // If we don't already have this error logged, add it.
                currentErrors.add(errorMessage);
            }
            else {
                // Set this label and error in the full map.
                errors.set(mapKey, new Set([errorMessage]));
            }
        }
        // If we have any errors to report, throw.
        if (errors.size > 0) {
            // Generate the `error.message` property.
            const message = generate_argument_error_message_1.generateArgumentErrorMessage(errors);
            throw new argument_error_1.ArgumentError(message, main, errors);
        }
    }
    /**
    @hidden
    */
    get [exports.validatorSymbol]() {
        return this.context.validators;
    }
    /**
    Invert the following validators.
    */
    get not() {
        return not_1.not(this);
    }
    /**
    Test if the value matches a custom validation function. The validation function should return an object containing a `validator` and `message`. If the `validator` is `false`, the validation fails and the `message` will be used as error message. If the `message` is a function, the function is invoked with the `label` as argument to let you further customize the error message.

    @param customValidator - Custom validation function.
    */
    validate(customValidator) {
        return this.addValidator({
            message: (_, label, error) => typeof error === 'string' ?
                `(${label}) ${error}` :
                error(label),
            validator: value => {
                const { message, validator } = customValidator(value);
                if (validator) {
                    return true;
                }
                return message;
            }
        });
    }
    /**
    Test if the value matches a custom validation function. The validation function should return `true` if the value passes the function. If the function either returns `false` or a string, the function fails and the string will be used as error message.

    @param validator - Validation function.
    */
    is(validator) {
        return this.addValidator({
            message: (value, label, error) => (error ?
                `(${label}) ${error}` :
                `Expected ${label} \`${value}\` to pass custom validation function`),
            validator
        });
    }
    /**
    Provide a new error message to be thrown when the validation fails.

    @param newMessage - Either a string containing the new message or a function returning the new message.

    @example
    ```
    ow('🌈', 'unicorn', ow.string.equals('🦄').message('Expected unicorn, got rainbow'));
    //=> ArgumentError: Expected unicorn, got rainbow
    ```

    @example
    ```
    ow('🌈', ow.string.minLength(5).message((value, label) => `Expected ${label}, to have a minimum length of 5, got \`${value}\``));
    //=> ArgumentError: Expected string, to be have a minimum length of 5, got `🌈`
    ```
    */
    message(newMessage) {
        const { validators } = this.context;
        validators[validators.length - 1].message = (value, label) => {
            if (typeof newMessage === 'function') {
                return newMessage(value, label);
            }
            return newMessage;
        };
        return this;
    }
    /**
    Register a new validator.

    @param validator - Validator to register.
    */
    addValidator(validator) {
        this.context.validators.push(validator);
        return this;
    }
}
exports.Predicate = Predicate;


/***/ }),

/***/ 17:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetPredicate = void 0;
const isEqual = __nccwpck_require__(309);
const has_items_1 = __nccwpck_require__(742);
const of_type_1 = __nccwpck_require__(155);
const predicate_1 = __nccwpck_require__(745);
class SetPredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('Set', options);
    }
    /**
    Test a Set to have a specific size.

    @param size - The size of the Set.
    */
    size(size) {
        return this.addValidator({
            message: (set, label) => `Expected ${label} to have size \`${size}\`, got \`${set.size}\``,
            validator: set => set.size === size
        });
    }
    /**
    Test a Set to have a minimum size.

    @param size - The minimum size of the Set.
    */
    minSize(size) {
        return this.addValidator({
            message: (set, label) => `Expected ${label} to have a minimum size of \`${size}\`, got \`${set.size}\``,
            validator: set => set.size >= size,
            negatedMessage: (set, label) => `Expected ${label} to have a maximum size of \`${size - 1}\`, got \`${set.size}\``
        });
    }
    /**
    Test a Set to have a maximum size.

    @param size - The maximum size of the Set.
    */
    maxSize(size) {
        return this.addValidator({
            message: (set, label) => `Expected ${label} to have a maximum size of \`${size}\`, got \`${set.size}\``,
            validator: set => set.size <= size,
            negatedMessage: (set, label) => `Expected ${label} to have a minimum size of \`${size + 1}\`, got \`${set.size}\``
        });
    }
    /**
    Test a Set to include all the provided items. The items are tested by identity, not structure.

    @param items - The items that should be a item in the Set.
    */
    has(...items) {
        return this.addValidator({
            message: (_, label, missingItems) => `Expected ${label} to have items \`${JSON.stringify(missingItems)}\``,
            validator: set => has_items_1.default(set, items)
        });
    }
    /**
    Test a Set to include any of the provided items. The items are tested by identity, not structure.

    @param items - The items that could be a item in the Set.
    */
    hasAny(...items) {
        return this.addValidator({
            message: (_, label) => `Expected ${label} to have any item of \`${JSON.stringify(items)}\``,
            validator: set => items.some(item => set.has(item))
        });
    }
    /**
    Test all the items in the Set to match the provided predicate.

    @param predicate - The predicate that should be applied against every item in the Set.
    */
    ofType(predicate) {
        return this.addValidator({
            message: (_, label, error) => `(${label}) ${error}`,
            validator: set => of_type_1.default(set, predicate)
        });
    }
    /**
    Test a Set to be empty.
    */
    get empty() {
        return this.addValidator({
            message: (set, label) => `Expected ${label} to be empty, got \`${JSON.stringify([...set])}\``,
            validator: set => set.size === 0
        });
    }
    /**
    Test a Set to be not empty.
    */
    get nonEmpty() {
        return this.addValidator({
            message: (_, label) => `Expected ${label} to not be empty`,
            validator: set => set.size > 0
        });
    }
    /**
    Test a Set to be deeply equal to the provided Set.

    @param expected - Expected Set to match.
    */
    deepEqual(expected) {
        return this.addValidator({
            message: (set, label) => `Expected ${label} to be deeply equal to \`${JSON.stringify([...expected])}\`, got \`${JSON.stringify([...set])}\``,
            validator: set => isEqual(set, expected)
        });
    }
}
exports.SetPredicate = SetPredicate;


/***/ }),

/***/ 10:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StringPredicate = void 0;
const is_1 = __nccwpck_require__(403);
const valiDate = __nccwpck_require__(125);
const predicate_1 = __nccwpck_require__(745);
class StringPredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('string', options);
    }
    /**
    Test a string to have a specific length.

    @param length - The length of the string.
    */
    length(length) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have length \`${length}\`, got \`${value}\``,
            validator: value => value.length === length
        });
    }
    /**
    Test a string to have a minimum length.

    @param length - The minimum length of the string.
    */
    minLength(length) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have a minimum length of \`${length}\`, got \`${value}\``,
            validator: value => value.length >= length,
            negatedMessage: (value, label) => `Expected ${label} to have a maximum length of \`${length - 1}\`, got \`${value}\``
        });
    }
    /**
    Test a string to have a maximum length.

    @param length - The maximum length of the string.
    */
    maxLength(length) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have a maximum length of \`${length}\`, got \`${value}\``,
            validator: value => value.length <= length,
            negatedMessage: (value, label) => `Expected ${label} to have a minimum length of \`${length + 1}\`, got \`${value}\``
        });
    }
    /**
    Test a string against a regular expression.

    @param regex - The regular expression to match the value with.
    */
    matches(regex) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to match \`${regex}\`, got \`${value}\``,
            validator: value => regex.test(value)
        });
    }
    /**
    Test a string to start with a specific value.

    @param searchString - The value that should be the start of the string.
    */
    startsWith(searchString) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to start with \`${searchString}\`, got \`${value}\``,
            validator: value => value.startsWith(searchString)
        });
    }
    /**
    Test a string to end with a specific value.

    @param searchString - The value that should be the end of the string.
    */
    endsWith(searchString) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to end with \`${searchString}\`, got \`${value}\``,
            validator: value => value.endsWith(searchString)
        });
    }
    /**
    Test a string to include a specific value.

    @param searchString - The value that should be included in the string.
    */
    includes(searchString) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to include \`${searchString}\`, got \`${value}\``,
            validator: value => value.includes(searchString)
        });
    }
    /**
    Test if the string is an element of the provided list.

    @param list - List of possible values.
    */
    oneOf(list) {
        return this.addValidator({
            message: (value, label) => {
                let printedList = JSON.stringify(list);
                if (list.length > 10) {
                    const overflow = list.length - 10;
                    printedList = JSON.stringify(list.slice(0, 10)).replace(/]$/, `,…+${overflow} more]`);
                }
                return `Expected ${label} to be one of \`${printedList}\`, got \`${value}\``;
            },
            validator: value => list.includes(value)
        });
    }
    /**
    Test a string to be empty.
    */
    get empty() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be empty, got \`${value}\``,
            validator: value => value === ''
        });
    }
    /**
    Test a string to be not empty.
    */
    get nonEmpty() {
        return this.addValidator({
            message: (_, label) => `Expected ${label} to not be empty`,
            validator: value => value !== ''
        });
    }
    /**
    Test a string to be equal to a specified string.

    @param expected - Expected value to match.
    */
    equals(expected) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be equal to \`${expected}\`, got \`${value}\``,
            validator: value => value === expected
        });
    }
    /**
    Test a string to be alphanumeric.
    */
    get alphanumeric() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be alphanumeric, got \`${value}\``,
            validator: value => /^[a-z\d]+$/i.test(value)
        });
    }
    /**
    Test a string to be alphabetical.
    */
    get alphabetical() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be alphabetical, got \`${value}\``,
            validator: value => /^[a-z]+$/gi.test(value)
        });
    }
    /**
    Test a string to be numeric.
    */
    get numeric() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be numeric, got \`${value}\``,
            validator: value => /^[+-]?\d+$/i.test(value)
        });
    }
    /**
    Test a string to be a valid date.
    */
    get date() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be a date, got \`${value}\``,
            validator: valiDate
        });
    }
    /**
    Test a non-empty string to be lowercase. Matching both alphabetical & numbers.
    */
    get lowercase() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be lowercase, got \`${value}\``,
            validator: value => value.trim() !== '' && value === value.toLowerCase()
        });
    }
    /**
    Test a non-empty string to be uppercase. Matching both alphabetical & numbers.
    */
    get uppercase() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be uppercase, got \`${value}\``,
            validator: value => value.trim() !== '' && value === value.toUpperCase()
        });
    }
    /**
    Test a string to be a valid URL.
    */
    get url() {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to be a URL, got \`${value}\``,
            validator: is_1.default.urlString
        });
    }
}
exports.StringPredicate = StringPredicate;


/***/ }),

/***/ 132:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypedArrayPredicate = void 0;
const predicate_1 = __nccwpck_require__(745);
class TypedArrayPredicate extends predicate_1.Predicate {
    /**
    Test a typed array to have a specific byte length.

    @param byteLength - The byte length of the typed array.
    */
    byteLength(byteLength) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
            validator: value => value.byteLength === byteLength
        });
    }
    /**
    Test a typed array to have a minimum byte length.

    @param byteLength - The minimum byte length of the typed array.
    */
    minByteLength(byteLength) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have a minimum byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
            validator: value => value.byteLength >= byteLength,
            negatedMessage: (value, label) => `Expected ${label} to have a maximum byte length of \`${byteLength - 1}\`, got \`${value.byteLength}\``
        });
    }
    /**
    Test a typed array to have a minimum byte length.

    @param length - The minimum byte length of the typed array.
    */
    maxByteLength(byteLength) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have a maximum byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
            validator: value => value.byteLength <= byteLength,
            negatedMessage: (value, label) => `Expected ${label} to have a minimum byte length of \`${byteLength + 1}\`, got \`${value.byteLength}\``
        });
    }
    /**
    Test a typed array to have a specific length.

    @param length - The length of the typed array.
    */
    length(length) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have length \`${length}\`, got \`${value.length}\``,
            validator: value => value.length === length
        });
    }
    /**
    Test a typed array to have a minimum length.

    @param length - The minimum length of the typed array.
    */
    minLength(length) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have a minimum length of \`${length}\`, got \`${value.length}\``,
            validator: value => value.length >= length,
            negatedMessage: (value, label) => `Expected ${label} to have a maximum length of \`${length - 1}\`, got \`${value.length}\``
        });
    }
    /**
    Test a typed array to have a maximum length.

    @param length - The maximum length of the typed array.
    */
    maxLength(length) {
        return this.addValidator({
            message: (value, label) => `Expected ${label} to have a maximum length of \`${length}\`, got \`${value.length}\``,
            validator: value => value.length <= length,
            negatedMessage: (value, label) => `Expected ${label} to have a minimum length of \`${length + 1}\`, got \`${value.length}\``
        });
    }
}
exports.TypedArrayPredicate = TypedArrayPredicate;


/***/ }),

/***/ 606:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WeakMapPredicate = void 0;
const has_items_1 = __nccwpck_require__(742);
const predicate_1 = __nccwpck_require__(745);
class WeakMapPredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('WeakMap', options);
    }
    /**
    Test a WeakMap to include all the provided keys. The keys are tested by identity, not structure.

    @param keys - The keys that should be a key in the WeakMap.
    */
    hasKeys(...keys) {
        return this.addValidator({
            message: (_, label, missingKeys) => `Expected ${label} to have keys \`${JSON.stringify(missingKeys)}\``,
            validator: map => has_items_1.default(map, keys)
        });
    }
    /**
    Test a WeakMap to include any of the provided keys. The keys are tested by identity, not structure.

    @param keys - The keys that could be a key in the WeakMap.
    */
    hasAnyKeys(...keys) {
        return this.addValidator({
            message: (_, label) => `Expected ${label} to have any key of \`${JSON.stringify(keys)}\``,
            validator: map => keys.some(key => map.has(key))
        });
    }
}
exports.WeakMapPredicate = WeakMapPredicate;


/***/ }),

/***/ 276:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WeakSetPredicate = void 0;
const has_items_1 = __nccwpck_require__(742);
const predicate_1 = __nccwpck_require__(745);
class WeakSetPredicate extends predicate_1.Predicate {
    /**
    @hidden
    */
    constructor(options) {
        super('WeakSet', options);
    }
    /**
    Test a WeakSet to include all the provided items. The items are tested by identity, not structure.

    @param items - The items that should be a item in the WeakSet.
    */
    has(...items) {
        return this.addValidator({
            message: (_, label, missingItems) => `Expected ${label} to have items \`${JSON.stringify(missingItems)}\``,
            validator: set => has_items_1.default(set, items)
        });
    }
    /**
    Test a WeakSet to include any of the provided items. The items are tested by identity, not structure.

    @param items - The items that could be a item in the WeakSet.
    */
    hasAny(...items) {
        return this.addValidator({
            message: (_, label) => `Expected ${label} to have any item of \`${JSON.stringify(items)}\``,
            validator: set => items.some(item => set.has(item))
        });
    }
}
exports.WeakSetPredicate = WeakSetPredicate;


/***/ }),

/***/ 463:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const base_predicate_1 = __nccwpck_require__(625);
/**
Validate the value against the provided predicate.

@hidden

@param value - Value to test.
@param label - Label which should be used in error messages.
@param predicate - Predicate to test to value against.
*/
function test(value, label, predicate) {
    predicate[base_predicate_1.testSymbol](value, test, label);
}
exports.default = test;


/***/ }),

/***/ 420:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateArgumentErrorMessage = void 0;
/**
Generates a complete message from all errors generated by predicates.

@param errors - The errors generated by the predicates.
@param isAny - If this function is called from the any argument.
@hidden
*/
const generateArgumentErrorMessage = (errors, isAny = false) => {
    const message = [];
    const errorArray = [...errors.entries()];
    const anyErrorWithoutOneItemOnly = errorArray.some(([, array]) => array.size !== 1);
    // If only one error "key" is present, enumerate all of those errors only.
    if (errorArray.length === 1) {
        const [, returnedErrors] = errorArray[0];
        if (!isAny && returnedErrors.size === 1) {
            const [errorMessage] = returnedErrors;
            return errorMessage;
        }
        for (const entry of returnedErrors) {
            message.push(`${isAny ? '  - ' : ''}${entry}`);
        }
        return message.join('\n');
    }
    // If every predicate returns just one error, enumerate them as is.
    if (!anyErrorWithoutOneItemOnly) {
        return errorArray.map(([, [item]]) => `  - ${item}`).join('\n');
    }
    // Else, iterate through all the errors and enumerate them.
    for (const [key, value] of errorArray) {
        message.push(`Errors from the "${key}" predicate:`);
        for (const entry of value) {
            message.push(`  - ${entry}`);
        }
    }
    return message.join('\n');
};
exports.generateArgumentErrorMessage = generateArgumentErrorMessage;


/***/ }),

/***/ 960:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateStackTrace = void 0;
/**
Generates a useful stacktrace that points to the user's code where the error happened on platforms without the `Error.captureStackTrace()` method.

@hidden
*/
const generateStackTrace = () => {
    const stack = new RangeError('INTERNAL_OW_ERROR').stack;
    return stack;
};
exports.generateStackTrace = generateStackTrace;


/***/ }),

/***/ 742:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
Retrieve the missing values in a collection based on an array of items.

@hidden

@param source - Source collection to search through.
@param items - Items to search for.
@param maxValues - Maximum number of values after the search process is stopped. Default: 5.
*/
exports.default = (source, items, maxValues = 5) => {
    const missingValues = [];
    for (const value of items) {
        if (source.has(value)) {
            continue;
        }
        missingValues.push(value);
        if (missingValues.length === maxValues) {
            return missingValues;
        }
    }
    return missingValues.length === 0 ? true : missingValues;
};


/***/ }),

/***/ 429:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.inferLabel = void 0;
const fs = __nccwpck_require__(747);
const is_valid_identifier_1 = __nccwpck_require__(164);
const is_node_1 = __nccwpck_require__(692);
// Regex to extract the label out of the `ow` function call
const labelRegex = /^.*?\((?<label>.*?)[,)]/;
/**
Infer the label of the caller.

@hidden

@param callsites - List of stack frames.
*/
const inferLabel = (callsites) => {
    var _a;
    if (!is_node_1.default) {
        // Exit if we are not running in a Node.js environment
        return;
    }
    // Grab the stackframe with the `ow` function call
    const functionCallStackFrame = callsites[1];
    if (!functionCallStackFrame) {
        return;
    }
    const fileName = functionCallStackFrame.getFileName();
    const lineNumber = functionCallStackFrame.getLineNumber();
    const columnNumber = functionCallStackFrame.getColumnNumber();
    if (fileName === null || lineNumber === null || columnNumber === null) {
        return;
    }
    let content = [];
    try {
        content = fs.readFileSync(fileName, 'utf8').split('\n');
    }
    catch (_b) {
        return;
    }
    let line = content[lineNumber - 1];
    if (!line) {
        // Exit if the line number couldn't be found
        return;
    }
    line = line.slice(columnNumber - 1);
    const match = labelRegex.exec(line);
    if (!((_a = match === null || match === void 0 ? void 0 : match.groups) === null || _a === void 0 ? void 0 : _a.label)) {
        // Exit if we didn't find a label
        return;
    }
    const token = match.groups.label;
    if (is_valid_identifier_1.default(token) || is_valid_identifier_1.default(token.split('.').pop())) {
        return token;
    }
    return;
};
exports.inferLabel = inferLabel;


/***/ }),

/***/ 164:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const identifierRegex = /^[a-z$_][$\w]*$/i;
const reservedSet = new Set([
    'undefined',
    'null',
    'true',
    'false',
    'super',
    'this',
    'Infinity',
    'NaN'
]);
/**
Test if the string is a valid JavaScript identifier.

@param string - String to test.
*/
exports.default = (string) => string && !reservedSet.has(string) && identifierRegex.test(string);


/***/ }),

/***/ 832:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.exact = exports.partial = void 0;
const is_1 = __nccwpck_require__(403);
const test_1 = __nccwpck_require__(463);
const base_predicate_1 = __nccwpck_require__(625);
/**
Test if the `object` matches the `shape` partially.

@hidden

@param object - Object to test against the provided shape.
@param shape - Shape to test the object against.
@param parent - Name of the parent property.
*/
function partial(object, shape, parent) {
    try {
        for (const key of Object.keys(shape)) {
            const label = parent ? `${parent}.${key}` : key;
            if (base_predicate_1.isPredicate(shape[key])) {
                test_1.default(object[key], label, shape[key]);
            }
            else if (is_1.default.plainObject(shape[key])) {
                const result = partial(object[key], shape[key], label);
                if (result !== true) {
                    return result;
                }
            }
        }
        return true;
    }
    catch (error) {
        return error.message;
    }
}
exports.partial = partial;
/**
Test if the `object` matches the `shape` exactly.

@hidden

@param object - Object to test against the provided shape.
@param shape - Shape to test the object against.
@param parent - Name of the parent property.
*/
function exact(object, shape, parent, isArray) {
    try {
        const objectKeys = new Set(Object.keys(object));
        for (const key of Object.keys(shape)) {
            objectKeys.delete(key);
            const label = parent ? `${parent}.${key}` : key;
            if (base_predicate_1.isPredicate(shape[key])) {
                test_1.default(object[key], label, shape[key]);
            }
            else if (is_1.default.plainObject(shape[key])) {
                if (!Object.prototype.hasOwnProperty.call(object, key)) {
                    return `Expected \`${label}\` to exist`;
                }
                const result = exact(object[key], shape[key], label);
                if (result !== true) {
                    return result;
                }
            }
        }
        if (objectKeys.size > 0) {
            const firstKey = [...objectKeys.keys()][0];
            const label = parent ? `${parent}.${firstKey}` : firstKey;
            return `Did not expect ${isArray ? 'element' : 'property'} \`${label}\` to exist, got \`${object[firstKey]}\``;
        }
        return true;
    }
    catch (error) {
        return error.message;
    }
}
exports.exact = exact;


/***/ }),

/***/ 692:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = Boolean((_a = process === null || process === void 0 ? void 0 : process.versions) === null || _a === void 0 ? void 0 : _a.node);


/***/ }),

/***/ 986:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const is_1 = __nccwpck_require__(403);
const __1 = __nccwpck_require__(398);
const ofTypeDeep = (object, predicate) => {
    if (!is_1.default.plainObject(object)) {
        __1.default(object, predicate);
        return true;
    }
    return Object.values(object).every(value => ofTypeDeep(value, predicate));
};
/**
Test all the values in the object against a provided predicate.

@hidden

@param predicate - Predicate to test every value in the given object against.
*/
exports.default = (object, predicate) => {
    try {
        return ofTypeDeep(object, predicate);
    }
    catch (error) {
        return error.message;
    }
};


/***/ }),

/***/ 155:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const __1 = __nccwpck_require__(398);
/**
Test all the values in the collection against a provided predicate.

@hidden
@param source Source collection to test.
@param predicate Predicate to test every item in the source collection against.
*/
exports.default = (source, predicate) => {
    try {
        for (const item of source) {
            __1.default(item, predicate);
        }
        return true;
    }
    catch (error) {
        return error.message;
    }
};


/***/ }),

/***/ 98:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = () => Math.random().toString(16).slice(2);


/***/ }),

/***/ 403:
/***/ ((module, exports) => {

"use strict";

/// <reference lib="es2018"/>
/// <reference lib="dom"/>
/// <reference types="node"/>
Object.defineProperty(exports, "__esModule", ({ value: true }));
const typedArrayTypeNames = [
    'Int8Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'Int16Array',
    'Uint16Array',
    'Int32Array',
    'Uint32Array',
    'Float32Array',
    'Float64Array',
    'BigInt64Array',
    'BigUint64Array'
];
function isTypedArrayName(name) {
    return typedArrayTypeNames.includes(name);
}
const objectTypeNames = [
    'Function',
    'Generator',
    'AsyncGenerator',
    'GeneratorFunction',
    'AsyncGeneratorFunction',
    'AsyncFunction',
    'Observable',
    'Array',
    'Buffer',
    'Object',
    'RegExp',
    'Date',
    'Error',
    'Map',
    'Set',
    'WeakMap',
    'WeakSet',
    'ArrayBuffer',
    'SharedArrayBuffer',
    'DataView',
    'Promise',
    'URL',
    'HTMLElement',
    ...typedArrayTypeNames
];
function isObjectTypeName(name) {
    return objectTypeNames.includes(name);
}
const primitiveTypeNames = [
    'null',
    'undefined',
    'string',
    'number',
    'bigint',
    'boolean',
    'symbol'
];
function isPrimitiveTypeName(name) {
    return primitiveTypeNames.includes(name);
}
// eslint-disable-next-line @typescript-eslint/ban-types
function isOfType(type) {
    return (value) => typeof value === type;
}
const { toString } = Object.prototype;
const getObjectType = (value) => {
    const objectTypeName = toString.call(value).slice(8, -1);
    if (/HTML\w+Element/.test(objectTypeName) && is.domElement(value)) {
        return 'HTMLElement';
    }
    if (isObjectTypeName(objectTypeName)) {
        return objectTypeName;
    }
    return undefined;
};
const isObjectOfType = (type) => (value) => getObjectType(value) === type;
function is(value) {
    if (value === null) {
        return 'null';
    }
    switch (typeof value) {
        case 'undefined':
            return 'undefined';
        case 'string':
            return 'string';
        case 'number':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'function':
            return 'Function';
        case 'bigint':
            return 'bigint';
        case 'symbol':
            return 'symbol';
        default:
    }
    if (is.observable(value)) {
        return 'Observable';
    }
    if (is.array(value)) {
        return 'Array';
    }
    if (is.buffer(value)) {
        return 'Buffer';
    }
    const tagType = getObjectType(value);
    if (tagType) {
        return tagType;
    }
    if (value instanceof String || value instanceof Boolean || value instanceof Number) {
        throw new TypeError('Please don\'t use object wrappers for primitive types');
    }
    return 'Object';
}
is.undefined = isOfType('undefined');
is.string = isOfType('string');
const isNumberType = isOfType('number');
is.number = (value) => isNumberType(value) && !is.nan(value);
is.bigint = isOfType('bigint');
// eslint-disable-next-line @typescript-eslint/ban-types
is.function_ = isOfType('function');
is.null_ = (value) => value === null;
is.class_ = (value) => is.function_(value) && value.toString().startsWith('class ');
is.boolean = (value) => value === true || value === false;
is.symbol = isOfType('symbol');
is.numericString = (value) => is.string(value) && !is.emptyStringOrWhitespace(value) && !Number.isNaN(Number(value));
is.array = (value, assertion) => {
    if (!Array.isArray(value)) {
        return false;
    }
    if (!is.function_(assertion)) {
        return true;
    }
    return value.every(assertion);
};
is.buffer = (value) => { var _a, _b, _c, _d; return (_d = (_c = (_b = (_a = value) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.isBuffer) === null || _c === void 0 ? void 0 : _c.call(_b, value)) !== null && _d !== void 0 ? _d : false; };
is.nullOrUndefined = (value) => is.null_(value) || is.undefined(value);
is.object = (value) => !is.null_(value) && (typeof value === 'object' || is.function_(value));
is.iterable = (value) => { var _a; return is.function_((_a = value) === null || _a === void 0 ? void 0 : _a[Symbol.iterator]); };
is.asyncIterable = (value) => { var _a; return is.function_((_a = value) === null || _a === void 0 ? void 0 : _a[Symbol.asyncIterator]); };
is.generator = (value) => is.iterable(value) && is.function_(value.next) && is.function_(value.throw);
is.asyncGenerator = (value) => is.asyncIterable(value) && is.function_(value.next) && is.function_(value.throw);
is.nativePromise = (value) => isObjectOfType('Promise')(value);
const hasPromiseAPI = (value) => {
    var _a, _b;
    return is.function_((_a = value) === null || _a === void 0 ? void 0 : _a.then) &&
        is.function_((_b = value) === null || _b === void 0 ? void 0 : _b.catch);
};
is.promise = (value) => is.nativePromise(value) || hasPromiseAPI(value);
is.generatorFunction = isObjectOfType('GeneratorFunction');
is.asyncGeneratorFunction = (value) => getObjectType(value) === 'AsyncGeneratorFunction';
is.asyncFunction = (value) => getObjectType(value) === 'AsyncFunction';
// eslint-disable-next-line no-prototype-builtins, @typescript-eslint/ban-types
is.boundFunction = (value) => is.function_(value) && !value.hasOwnProperty('prototype');
is.regExp = isObjectOfType('RegExp');
is.date = isObjectOfType('Date');
is.error = isObjectOfType('Error');
is.map = (value) => isObjectOfType('Map')(value);
is.set = (value) => isObjectOfType('Set')(value);
is.weakMap = (value) => isObjectOfType('WeakMap')(value);
is.weakSet = (value) => isObjectOfType('WeakSet')(value);
is.int8Array = isObjectOfType('Int8Array');
is.uint8Array = isObjectOfType('Uint8Array');
is.uint8ClampedArray = isObjectOfType('Uint8ClampedArray');
is.int16Array = isObjectOfType('Int16Array');
is.uint16Array = isObjectOfType('Uint16Array');
is.int32Array = isObjectOfType('Int32Array');
is.uint32Array = isObjectOfType('Uint32Array');
is.float32Array = isObjectOfType('Float32Array');
is.float64Array = isObjectOfType('Float64Array');
is.bigInt64Array = isObjectOfType('BigInt64Array');
is.bigUint64Array = isObjectOfType('BigUint64Array');
is.arrayBuffer = isObjectOfType('ArrayBuffer');
is.sharedArrayBuffer = isObjectOfType('SharedArrayBuffer');
is.dataView = isObjectOfType('DataView');
is.directInstanceOf = (instance, class_) => Object.getPrototypeOf(instance) === class_.prototype;
is.urlInstance = (value) => isObjectOfType('URL')(value);
is.urlString = (value) => {
    if (!is.string(value)) {
        return false;
    }
    try {
        new URL(value); // eslint-disable-line no-new
        return true;
    }
    catch (_a) {
        return false;
    }
};
// TODO: Use the `not` operator with a type guard here when it's available.
// Example: `is.truthy = (value: unknown): value is (not false | not 0 | not '' | not undefined | not null) => Boolean(value);`
is.truthy = (value) => Boolean(value);
// Example: `is.falsy = (value: unknown): value is (not true | 0 | '' | undefined | null) => Boolean(value);`
is.falsy = (value) => !value;
is.nan = (value) => Number.isNaN(value);
is.primitive = (value) => is.null_(value) || isPrimitiveTypeName(typeof value);
is.integer = (value) => Number.isInteger(value);
is.safeInteger = (value) => Number.isSafeInteger(value);
is.plainObject = (value) => {
    // From: https://github.com/sindresorhus/is-plain-obj/blob/master/index.js
    if (toString.call(value) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.getPrototypeOf({});
};
is.typedArray = (value) => isTypedArrayName(getObjectType(value));
const isValidLength = (value) => is.safeInteger(value) && value >= 0;
is.arrayLike = (value) => !is.nullOrUndefined(value) && !is.function_(value) && isValidLength(value.length);
is.inRange = (value, range) => {
    if (is.number(range)) {
        return value >= Math.min(0, range) && value <= Math.max(range, 0);
    }
    if (is.array(range) && range.length === 2) {
        return value >= Math.min(...range) && value <= Math.max(...range);
    }
    throw new TypeError(`Invalid range: ${JSON.stringify(range)}`);
};
const NODE_TYPE_ELEMENT = 1;
const DOM_PROPERTIES_TO_CHECK = [
    'innerHTML',
    'ownerDocument',
    'style',
    'attributes',
    'nodeValue'
];
is.domElement = (value) => {
    return is.object(value) &&
        value.nodeType === NODE_TYPE_ELEMENT &&
        is.string(value.nodeName) &&
        !is.plainObject(value) &&
        DOM_PROPERTIES_TO_CHECK.every(property => property in value);
};
is.observable = (value) => {
    var _a, _b, _c, _d;
    if (!value) {
        return false;
    }
    // eslint-disable-next-line no-use-extend-native/no-use-extend-native
    if (value === ((_b = (_a = value)[Symbol.observable]) === null || _b === void 0 ? void 0 : _b.call(_a))) {
        return true;
    }
    if (value === ((_d = (_c = value)['@@observable']) === null || _d === void 0 ? void 0 : _d.call(_c))) {
        return true;
    }
    return false;
};
is.nodeStream = (value) => is.object(value) && is.function_(value.pipe) && !is.observable(value);
is.infinite = (value) => value === Infinity || value === -Infinity;
const isAbsoluteMod2 = (remainder) => (value) => is.integer(value) && Math.abs(value % 2) === remainder;
is.evenInteger = isAbsoluteMod2(0);
is.oddInteger = isAbsoluteMod2(1);
is.emptyArray = (value) => is.array(value) && value.length === 0;
is.nonEmptyArray = (value) => is.array(value) && value.length > 0;
is.emptyString = (value) => is.string(value) && value.length === 0;
// TODO: Use `not ''` when the `not` operator is available.
is.nonEmptyString = (value) => is.string(value) && value.length > 0;
const isWhiteSpaceString = (value) => is.string(value) && !/\S/.test(value);
is.emptyStringOrWhitespace = (value) => is.emptyString(value) || isWhiteSpaceString(value);
is.emptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length === 0;
// TODO: Use `not` operator here to remove `Map` and `Set` from type guard:
// - https://github.com/Microsoft/TypeScript/pull/29317
is.nonEmptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length > 0;
is.emptySet = (value) => is.set(value) && value.size === 0;
is.nonEmptySet = (value) => is.set(value) && value.size > 0;
is.emptyMap = (value) => is.map(value) && value.size === 0;
is.nonEmptyMap = (value) => is.map(value) && value.size > 0;
const predicateOnArray = (method, predicate, values) => {
    if (!is.function_(predicate)) {
        throw new TypeError(`Invalid predicate: ${JSON.stringify(predicate)}`);
    }
    if (values.length === 0) {
        throw new TypeError('Invalid number of values');
    }
    return method.call(values, predicate);
};
is.any = (predicate, ...values) => {
    const predicates = is.array(predicate) ? predicate : [predicate];
    return predicates.some(singlePredicate => predicateOnArray(Array.prototype.some, singlePredicate, values));
};
is.all = (predicate, ...values) => predicateOnArray(Array.prototype.every, predicate, values);
const assertType = (condition, description, value) => {
    if (!condition) {
        throw new TypeError(`Expected value which is \`${description}\`, received value of type \`${is(value)}\`.`);
    }
};
exports.assert = {
    // Unknowns.
    undefined: (value) => assertType(is.undefined(value), 'undefined', value),
    string: (value) => assertType(is.string(value), 'string', value),
    number: (value) => assertType(is.number(value), 'number', value),
    bigint: (value) => assertType(is.bigint(value), 'bigint', value),
    // eslint-disable-next-line @typescript-eslint/ban-types
    function_: (value) => assertType(is.function_(value), 'Function', value),
    null_: (value) => assertType(is.null_(value), 'null', value),
    class_: (value) => assertType(is.class_(value), "Class" /* class_ */, value),
    boolean: (value) => assertType(is.boolean(value), 'boolean', value),
    symbol: (value) => assertType(is.symbol(value), 'symbol', value),
    numericString: (value) => assertType(is.numericString(value), "string with a number" /* numericString */, value),
    array: (value, assertion) => {
        const assert = assertType;
        assert(is.array(value), 'Array', value);
        if (assertion) {
            value.forEach(assertion);
        }
    },
    buffer: (value) => assertType(is.buffer(value), 'Buffer', value),
    nullOrUndefined: (value) => assertType(is.nullOrUndefined(value), "null or undefined" /* nullOrUndefined */, value),
    object: (value) => assertType(is.object(value), 'Object', value),
    iterable: (value) => assertType(is.iterable(value), "Iterable" /* iterable */, value),
    asyncIterable: (value) => assertType(is.asyncIterable(value), "AsyncIterable" /* asyncIterable */, value),
    generator: (value) => assertType(is.generator(value), 'Generator', value),
    asyncGenerator: (value) => assertType(is.asyncGenerator(value), 'AsyncGenerator', value),
    nativePromise: (value) => assertType(is.nativePromise(value), "native Promise" /* nativePromise */, value),
    promise: (value) => assertType(is.promise(value), 'Promise', value),
    generatorFunction: (value) => assertType(is.generatorFunction(value), 'GeneratorFunction', value),
    asyncGeneratorFunction: (value) => assertType(is.asyncGeneratorFunction(value), 'AsyncGeneratorFunction', value),
    // eslint-disable-next-line @typescript-eslint/ban-types
    asyncFunction: (value) => assertType(is.asyncFunction(value), 'AsyncFunction', value),
    // eslint-disable-next-line @typescript-eslint/ban-types
    boundFunction: (value) => assertType(is.boundFunction(value), 'Function', value),
    regExp: (value) => assertType(is.regExp(value), 'RegExp', value),
    date: (value) => assertType(is.date(value), 'Date', value),
    error: (value) => assertType(is.error(value), 'Error', value),
    map: (value) => assertType(is.map(value), 'Map', value),
    set: (value) => assertType(is.set(value), 'Set', value),
    weakMap: (value) => assertType(is.weakMap(value), 'WeakMap', value),
    weakSet: (value) => assertType(is.weakSet(value), 'WeakSet', value),
    int8Array: (value) => assertType(is.int8Array(value), 'Int8Array', value),
    uint8Array: (value) => assertType(is.uint8Array(value), 'Uint8Array', value),
    uint8ClampedArray: (value) => assertType(is.uint8ClampedArray(value), 'Uint8ClampedArray', value),
    int16Array: (value) => assertType(is.int16Array(value), 'Int16Array', value),
    uint16Array: (value) => assertType(is.uint16Array(value), 'Uint16Array', value),
    int32Array: (value) => assertType(is.int32Array(value), 'Int32Array', value),
    uint32Array: (value) => assertType(is.uint32Array(value), 'Uint32Array', value),
    float32Array: (value) => assertType(is.float32Array(value), 'Float32Array', value),
    float64Array: (value) => assertType(is.float64Array(value), 'Float64Array', value),
    bigInt64Array: (value) => assertType(is.bigInt64Array(value), 'BigInt64Array', value),
    bigUint64Array: (value) => assertType(is.bigUint64Array(value), 'BigUint64Array', value),
    arrayBuffer: (value) => assertType(is.arrayBuffer(value), 'ArrayBuffer', value),
    sharedArrayBuffer: (value) => assertType(is.sharedArrayBuffer(value), 'SharedArrayBuffer', value),
    dataView: (value) => assertType(is.dataView(value), 'DataView', value),
    urlInstance: (value) => assertType(is.urlInstance(value), 'URL', value),
    urlString: (value) => assertType(is.urlString(value), "string with a URL" /* urlString */, value),
    truthy: (value) => assertType(is.truthy(value), "truthy" /* truthy */, value),
    falsy: (value) => assertType(is.falsy(value), "falsy" /* falsy */, value),
    nan: (value) => assertType(is.nan(value), "NaN" /* nan */, value),
    primitive: (value) => assertType(is.primitive(value), "primitive" /* primitive */, value),
    integer: (value) => assertType(is.integer(value), "integer" /* integer */, value),
    safeInteger: (value) => assertType(is.safeInteger(value), "integer" /* safeInteger */, value),
    plainObject: (value) => assertType(is.plainObject(value), "plain object" /* plainObject */, value),
    typedArray: (value) => assertType(is.typedArray(value), "TypedArray" /* typedArray */, value),
    arrayLike: (value) => assertType(is.arrayLike(value), "array-like" /* arrayLike */, value),
    domElement: (value) => assertType(is.domElement(value), "HTMLElement" /* domElement */, value),
    observable: (value) => assertType(is.observable(value), 'Observable', value),
    nodeStream: (value) => assertType(is.nodeStream(value), "Node.js Stream" /* nodeStream */, value),
    infinite: (value) => assertType(is.infinite(value), "infinite number" /* infinite */, value),
    emptyArray: (value) => assertType(is.emptyArray(value), "empty array" /* emptyArray */, value),
    nonEmptyArray: (value) => assertType(is.nonEmptyArray(value), "non-empty array" /* nonEmptyArray */, value),
    emptyString: (value) => assertType(is.emptyString(value), "empty string" /* emptyString */, value),
    nonEmptyString: (value) => assertType(is.nonEmptyString(value), "non-empty string" /* nonEmptyString */, value),
    emptyStringOrWhitespace: (value) => assertType(is.emptyStringOrWhitespace(value), "empty string or whitespace" /* emptyStringOrWhitespace */, value),
    emptyObject: (value) => assertType(is.emptyObject(value), "empty object" /* emptyObject */, value),
    nonEmptyObject: (value) => assertType(is.nonEmptyObject(value), "non-empty object" /* nonEmptyObject */, value),
    emptySet: (value) => assertType(is.emptySet(value), "empty set" /* emptySet */, value),
    nonEmptySet: (value) => assertType(is.nonEmptySet(value), "non-empty set" /* nonEmptySet */, value),
    emptyMap: (value) => assertType(is.emptyMap(value), "empty map" /* emptyMap */, value),
    nonEmptyMap: (value) => assertType(is.nonEmptyMap(value), "non-empty map" /* nonEmptyMap */, value),
    // Numbers.
    evenInteger: (value) => assertType(is.evenInteger(value), "even integer" /* evenInteger */, value),
    oddInteger: (value) => assertType(is.oddInteger(value), "odd integer" /* oddInteger */, value),
    // Two arguments.
    directInstanceOf: (instance, class_) => assertType(is.directInstanceOf(instance, class_), "T" /* directInstanceOf */, instance),
    inRange: (value, range) => assertType(is.inRange(value, range), "in range" /* inRange */, value),
    // Variadic functions.
    any: (predicate, ...values) => assertType(is.any(predicate, ...values), "predicate returns truthy for any value" /* any */, values),
    all: (predicate, ...values) => assertType(is.all(predicate, ...values), "predicate returns truthy for all values" /* all */, values)
};
// Some few keywords are reserved, but we'll populate them for Node.js users
// See https://github.com/Microsoft/TypeScript/issues/2536
Object.defineProperties(is, {
    class: {
        value: is.class_
    },
    function: {
        value: is.function_
    },
    null: {
        value: is.null_
    }
});
Object.defineProperties(exports.assert, {
    class: {
        value: exports.assert.class_
    },
    function: {
        value: exports.assert.function_
    },
    null: {
        value: exports.assert.null_
    }
});
exports.default = is;
// For CommonJS default export support
module.exports = is;
module.exports.default = is;
module.exports.assert = exports.assert;


/***/ }),

/***/ 509:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const isObj = __nccwpck_require__(389);

const disallowedKeys = new Set([
	'__proto__',
	'prototype',
	'constructor'
]);

const isValidPath = pathSegments => !pathSegments.some(segment => disallowedKeys.has(segment));

function getPathSegments(path) {
	const pathArray = path.split('.');
	const parts = [];

	for (let i = 0; i < pathArray.length; i++) {
		let p = pathArray[i];

		while (p[p.length - 1] === '\\' && pathArray[i + 1] !== undefined) {
			p = p.slice(0, -1) + '.';
			p += pathArray[++i];
		}

		parts.push(p);
	}

	if (!isValidPath(parts)) {
		return [];
	}

	return parts;
}

module.exports = {
	get(object, path, value) {
		if (!isObj(object) || typeof path !== 'string') {
			return value === undefined ? object : value;
		}

		const pathArray = getPathSegments(path);
		if (pathArray.length === 0) {
			return;
		}

		for (let i = 0; i < pathArray.length; i++) {
			object = object[pathArray[i]];

			if (object === undefined || object === null) {
				// `object` is either `undefined` or `null` so we want to stop the loop, and
				// if this is not the last bit of the path, and
				// if it did't return `undefined`
				// it would return `null` if `object` is `null`
				// but we want `get({foo: null}, 'foo.bar')` to equal `undefined`, or the supplied value, not `null`
				if (i !== pathArray.length - 1) {
					return value;
				}

				break;
			}
		}

		return object === undefined ? value : object;
	},

	set(object, path, value) {
		if (!isObj(object) || typeof path !== 'string') {
			return object;
		}

		const root = object;
		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			const p = pathArray[i];

			if (!isObj(object[p])) {
				object[p] = {};
			}

			if (i === pathArray.length - 1) {
				object[p] = value;
			}

			object = object[p];
		}

		return root;
	},

	delete(object, path) {
		if (!isObj(object) || typeof path !== 'string') {
			return false;
		}

		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			const p = pathArray[i];

			if (i === pathArray.length - 1) {
				delete object[p];
				return true;
			}

			object = object[p];

			if (!isObj(object)) {
				return false;
			}
		}
	},

	has(object, path) {
		if (!isObj(object) || typeof path !== 'string') {
			return false;
		}

		const pathArray = getPathSegments(path);
		if (pathArray.length === 0) {
			return false;
		}

		// eslint-disable-next-line unicorn/no-for-loop
		for (let i = 0; i < pathArray.length; i++) {
			if (isObj(object)) {
				if (!(pathArray[i] in object)) {
					return false;
				}

				object = object[pathArray[i]];
			} else {
				return false;
			}
		}

		return true;
	}
};


/***/ }),

/***/ 125:
/***/ ((module) => {

"use strict";

module.exports = function (str) {
	return !isNaN(Date.parse(str));
};


/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__nccwpck_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(283);
/******/ })()
;