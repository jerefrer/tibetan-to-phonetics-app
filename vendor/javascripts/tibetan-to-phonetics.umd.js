(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TibetanToPhonetics = {}));
})(this, (function (exports) { 'use strict';

  // Current version.
  var VERSION = '1.13.6';

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = (typeof self == 'object' && self.self === self && self) ||
            (typeof global == 'object' && global.global === global && global) ||
            Function('return this')() ||
            {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // Modern feature detection.
  var supportsArrayBuffer = typeof ArrayBuffer !== 'undefined',
      supportsDataView = typeof DataView !== 'undefined';

  // All **ECMAScript 5+** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create,
      nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;

  // Create references to these builtin functions because we override them.
  var _isNaN = isNaN,
      _isFinite = isFinite;

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  // The largest integer that can be represented exactly.
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  function restArguments(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  }

  // Is a given variable an object?
  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || (type === 'object' && !!obj);
  }

  // Is a given value equal to null?
  function isNull(obj) {
    return obj === null;
  }

  // Is a given variable undefined?
  function isUndefined(obj) {
    return obj === void 0;
  }

  // Is a given value a boolean?
  function isBoolean(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  }

  // Is a given value a DOM element?
  function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
  }

  // Internal function for creating a `toString`-based type tester.
  function tagTester(name) {
    var tag = '[object ' + name + ']';
    return function(obj) {
      return toString.call(obj) === tag;
    };
  }

  var isString = tagTester('String');

  var isNumber = tagTester('Number');

  var isDate = tagTester('Date');

  var isRegExp = tagTester('RegExp');

  var isError = tagTester('Error');

  var isSymbol = tagTester('Symbol');

  var isArrayBuffer = tagTester('ArrayBuffer');

  var isFunction = tagTester('Function');

  // Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
  // v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  var isFunction$1 = isFunction;

  var hasObjectTag = tagTester('Object');

  // In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
  // In IE 11, the most common among them, this problem also applies to
  // `Map`, `WeakMap` and `Set`.
  var hasStringTagBug = (
        supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8)))
      ),
      isIE11 = (typeof Map !== 'undefined' && hasObjectTag(new Map));

  var isDataView = tagTester('DataView');

  // In IE 10 - Edge 13, we need a different heuristic
  // to determine whether an object is a `DataView`.
  function ie10IsDataView(obj) {
    return obj != null && isFunction$1(obj.getInt8) && isArrayBuffer(obj.buffer);
  }

  var isDataView$1 = (hasStringTagBug ? ie10IsDataView : isDataView);

  // Is a given value an array?
  // Delegates to ECMA5's native `Array.isArray`.
  var isArray = nativeIsArray || tagTester('Array');

  // Internal function to check whether `key` is an own property name of `obj`.
  function has$1(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  }

  var isArguments = tagTester('Arguments');

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  (function() {
    if (!isArguments(arguments)) {
      isArguments = function(obj) {
        return has$1(obj, 'callee');
      };
    }
  }());

  var isArguments$1 = isArguments;

  // Is a given object a finite number?
  function isFinite$1(obj) {
    return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
  }

  // Is the given value `NaN`?
  function isNaN$1(obj) {
    return isNumber(obj) && _isNaN(obj);
  }

  // Predicate-generating function. Often useful outside of Underscore.
  function constant(value) {
    return function() {
      return value;
    };
  }

  // Common internal logic for `isArrayLike` and `isBufferLike`.
  function createSizePropertyCheck(getSizeProperty) {
    return function(collection) {
      var sizeProperty = getSizeProperty(collection);
      return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
    }
  }

  // Internal helper to generate a function to obtain property `key` from `obj`.
  function shallowProperty(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  }

  // Internal helper to obtain the `byteLength` property of an object.
  var getByteLength = shallowProperty('byteLength');

  // Internal helper to determine whether we should spend extensive checks against
  // `ArrayBuffer` et al.
  var isBufferLike = createSizePropertyCheck(getByteLength);

  // Is a given value a typed array?
  var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
  function isTypedArray(obj) {
    // `ArrayBuffer.isView` is the most future-proof, so use it when available.
    // Otherwise, fall back on the above regular expression.
    return nativeIsView ? (nativeIsView(obj) && !isDataView$1(obj)) :
                  isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
  }

  var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(false);

  // Internal helper to obtain the `length` property of an object.
  var getLength = shallowProperty('length');

  // Internal helper to create a simple lookup structure.
  // `collectNonEnumProps` used to depend on `_.contains`, but this led to
  // circular imports. `emulatedSet` is a one-off solution that only works for
  // arrays of strings.
  function emulatedSet(keys) {
    var hash = {};
    for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
    return {
      contains: function(key) { return hash[key] === true; },
      push: function(key) {
        hash[key] = true;
        return keys.push(key);
      }
    };
  }

  // Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
  // be iterated by `for key in ...` and thus missed. Extends `keys` in place if
  // needed.
  function collectNonEnumProps(obj, keys) {
    keys = emulatedSet(keys);
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (isFunction$1(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has$1(obj, prop) && !keys.contains(prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  function keys(obj) {
    if (!isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has$1(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  }

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  function isEmpty(obj) {
    if (obj == null) return true;
    // Skip the more expensive `toString`-based type checks if `obj` has no
    // `.length`.
    var length = getLength(obj);
    if (typeof length == 'number' && (
      isArray(obj) || isString(obj) || isArguments$1(obj)
    )) return length === 0;
    return getLength(keys(obj)) === 0;
  }

  // Returns whether an object has a given set of `key:value` pairs.
  function isMatch(object, attrs) {
    var _keys = keys(attrs), length = _keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = _keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  }

  // If Underscore is called as a function, it returns a wrapped object that can
  // be used OO-style. This wrapper holds altered versions of all functions added
  // through `_.mixin`. Wrapped objects may be chained.
  function _$1(obj) {
    if (obj instanceof _$1) return obj;
    if (!(this instanceof _$1)) return new _$1(obj);
    this._wrapped = obj;
  }

  _$1.VERSION = VERSION;

  // Extracts the result from a wrapped and chained object.
  _$1.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxies for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _$1.prototype.valueOf = _$1.prototype.toJSON = _$1.prototype.value;

  _$1.prototype.toString = function() {
    return String(this._wrapped);
  };

  // Internal function to wrap or shallow-copy an ArrayBuffer,
  // typed array or DataView to a new view, reusing the buffer.
  function toBufferView(bufferSource) {
    return new Uint8Array(
      bufferSource.buffer || bufferSource,
      bufferSource.byteOffset || 0,
      getByteLength(bufferSource)
    );
  }

  // We use this string twice, so give it a name for minification.
  var tagDataView = '[object DataView]';

  // Internal recursive comparison function for `_.isEqual`.
  function eq(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  }

  // Internal recursive comparison function for `_.isEqual`.
  function deepEq(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _$1) a = a._wrapped;
    if (b instanceof _$1) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    // Work around a bug in IE 10 - Edge 13.
    if (hasStringTagBug && className == '[object Object]' && isDataView$1(a)) {
      if (!isDataView$1(b)) return false;
      className = tagDataView;
    }
    switch (className) {
      // These types are compared by value.
      case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
      case '[object ArrayBuffer]':
      case tagDataView:
        // Coerce to typed array so we can fall through.
        return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays && isTypedArray$1(a)) {
        var byteLength = getByteLength(a);
        if (byteLength !== getByteLength(b)) return false;
        if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
        areArrays = true;
    }
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(isFunction$1(aCtor) && aCtor instanceof aCtor &&
                               isFunction$1(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var _keys = keys(a), key;
      length = _keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = _keys[length];
        if (!(has$1(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  }

  // Perform a deep comparison to check if two objects are equal.
  function isEqual(a, b) {
    return eq(a, b);
  }

  // Retrieve all the enumerable property names of an object.
  function allKeys(obj) {
    if (!isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  }

  // Since the regular `Object.prototype.toString` type tests don't work for
  // some types in IE 11, we use a fingerprinting heuristic instead, based
  // on the methods. It's not great, but it's the best we got.
  // The fingerprint method lists are defined below.
  function ie11fingerprint(methods) {
    var length = getLength(methods);
    return function(obj) {
      if (obj == null) return false;
      // `Map`, `WeakMap` and `Set` have no enumerable keys.
      var keys = allKeys(obj);
      if (getLength(keys)) return false;
      for (var i = 0; i < length; i++) {
        if (!isFunction$1(obj[methods[i]])) return false;
      }
      // If we are testing against `WeakMap`, we need to ensure that
      // `obj` doesn't have a `forEach` method in order to distinguish
      // it from a regular `Map`.
      return methods !== weakMapMethods || !isFunction$1(obj[forEachName]);
    };
  }

  // In the interest of compact minification, we write
  // each string in the fingerprints only once.
  var forEachName = 'forEach',
      hasName = 'has',
      commonInit = ['clear', 'delete'],
      mapTail = ['get', hasName, 'set'];

  // `Map`, `WeakMap` and `Set` each have slightly different
  // combinations of the above sublists.
  var mapMethods = commonInit.concat(forEachName, mapTail),
      weakMapMethods = commonInit.concat(mapTail),
      setMethods = ['add'].concat(commonInit, forEachName, hasName);

  var isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester('Map');

  var isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester('WeakMap');

  var isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester('Set');

  var isWeakSet = tagTester('WeakSet');

  // Retrieve the values of an object's properties.
  function values(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[_keys[i]];
    }
    return values;
  }

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of `_.object` with one argument.
  function pairs(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [_keys[i], obj[_keys[i]]];
    }
    return pairs;
  }

  // Invert the keys and values of an object. The values must be serializable.
  function invert(obj) {
    var result = {};
    var _keys = keys(obj);
    for (var i = 0, length = _keys.length; i < length; i++) {
      result[obj[_keys[i]]] = _keys[i];
    }
    return result;
  }

  // Return a sorted list of the function names available on the object.
  function functions(obj) {
    var names = [];
    for (var key in obj) {
      if (isFunction$1(obj[key])) names.push(key);
    }
    return names.sort();
  }

  // An internal function for creating assigner functions.
  function createAssigner(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  }

  // Extend a given object with all the properties in passed-in object(s).
  var extend = createAssigner(allKeys);

  // Assigns a given object with all the own properties in the passed-in
  // object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  var extendOwn = createAssigner(keys);

  // Fill in a given object with default properties.
  var defaults = createAssigner(allKeys, true);

  // Create a naked function reference for surrogate-prototype-swapping.
  function ctor() {
    return function(){};
  }

  // An internal function for creating a new object that inherits from another.
  function baseCreate(prototype) {
    if (!isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    var Ctor = ctor();
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  }

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  function create(prototype, props) {
    var result = baseCreate(prototype);
    if (props) extendOwn(result, props);
    return result;
  }

  // Create a (shallow-cloned) duplicate of an object.
  function clone(obj) {
    if (!isObject(obj)) return obj;
    return isArray(obj) ? obj.slice() : extend({}, obj);
  }

  // Invokes `interceptor` with the `obj` and then returns `obj`.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  function tap(obj, interceptor) {
    interceptor(obj);
    return obj;
  }

  // Normalize a (deep) property `path` to array.
  // Like `_.iteratee`, this function can be customized.
  function toPath$1(path) {
    return isArray(path) ? path : [path];
  }
  _$1.toPath = toPath$1;

  // Internal wrapper for `_.toPath` to enable minification.
  // Similar to `cb` for `_.iteratee`.
  function toPath(path) {
    return _$1.toPath(path);
  }

  // Internal function to obtain a nested property in `obj` along `path`.
  function deepGet(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  }

  // Get the value of the (deep) property on `path` from `object`.
  // If any property in `path` does not exist or if the value is
  // `undefined`, return `defaultValue` instead.
  // The `path` is normalized through `_.toPath`.
  function get(object, path, defaultValue) {
    var value = deepGet(object, toPath(path));
    return isUndefined(value) ? defaultValue : value;
  }

  // Shortcut function for checking if an object has a given property directly on
  // itself (in other words, not on a prototype). Unlike the internal `has`
  // function, this public version can also traverse nested properties.
  function has(obj, path) {
    path = toPath(path);
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (!has$1(obj, key)) return false;
      obj = obj[key];
    }
    return !!length;
  }

  // Keep the identity function around for default iteratees.
  function identity(value) {
    return value;
  }

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  function matcher(attrs) {
    attrs = extendOwn({}, attrs);
    return function(obj) {
      return isMatch(obj, attrs);
    };
  }

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indices.
  function property(path) {
    path = toPath(path);
    return function(obj) {
      return deepGet(obj, path);
    };
  }

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  function optimizeCb(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  }

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `_.identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  function baseIteratee(value, context, argCount) {
    if (value == null) return identity;
    if (isFunction$1(value)) return optimizeCb(value, context, argCount);
    if (isObject(value) && !isArray(value)) return matcher(value);
    return property(value);
  }

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only `argCount` argument.
  function iteratee(value, context) {
    return baseIteratee(value, context, Infinity);
  }
  _$1.iteratee = iteratee;

  // The function we call internally to generate a callback. It invokes
  // `_.iteratee` if overridden, otherwise `baseIteratee`.
  function cb(value, context, argCount) {
    if (_$1.iteratee !== iteratee) return _$1.iteratee(value, context);
    return baseIteratee(value, context, argCount);
  }

  // Returns the results of applying the `iteratee` to each element of `obj`.
  // In contrast to `_.map` it returns an object.
  function mapObject(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = keys(obj),
        length = _keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = _keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Predicate-generating function. Often useful outside of Underscore.
  function noop(){}

  // Generates a function for a given object that returns a given property.
  function propertyOf(obj) {
    if (obj == null) return noop;
    return function(path) {
      return get(obj, path);
    };
  }

  // Run a function **n** times.
  function times(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  }

  // Return a random integer between `min` and `max` (inclusive).
  function random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  // A (possibly faster) way to get the current timestamp as an integer.
  var now = Date.now || function() {
    return new Date().getTime();
  };

  // Internal helper to generate functions for escaping and unescaping strings
  // to/from HTML interpolation.
  function createEscaper(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  }

  // Internal list of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  // Function for escaping strings to HTML interpolation.
  var escape = createEscaper(escapeMap);

  // Internal list of HTML entities for unescaping.
  var unescapeMap = invert(escapeMap);

  // Function for unescaping strings from HTML interpolation.
  var unescape = createEscaper(unescapeMap);

  // By default, Underscore uses ERB-style template delimiters. Change the
  // following template settings to use alternative delimiters.
  var templateSettings = _$1.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `_.templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  function escapeChar(match) {
    return '\\' + escapes[match];
  }

  // In order to prevent third-party code injection through
  // `_.templateSettings.variable`, we test it against the following regular
  // expression. It is intentionally a bit more liberal than just matching valid
  // identifiers, but still prevents possible loopholes through defaults or
  // destructuring assignment.
  var bareIdentifier = /^\s*(\w|\$)+\s*$/;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  function template(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = defaults({}, settings, _$1.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    var argument = settings.variable;
    if (argument) {
      // Insure against third-party code injection. (CVE-2021-23358)
      if (!bareIdentifier.test(argument)) throw new Error(
        'variable is not a bare identifier: ' + argument
      );
    } else {
      // If a variable is not specified, place data values in local scope.
      source = 'with(obj||{}){\n' + source + '}\n';
      argument = 'obj';
    }

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(argument, '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _$1);
    };

    // Provide the compiled source as a convenience for precompilation.
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  }

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  function result(obj, path, fallback) {
    path = toPath(path);
    var length = path.length;
    if (!length) {
      return isFunction$1(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = isFunction$1(prop) ? prop.call(obj) : prop;
    }
    return obj;
  }

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  function uniqueId(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  }

  // Start chaining a wrapped Underscore object.
  function chain(obj) {
    var instance = _$1(obj);
    instance._chain = true;
    return instance;
  }

  // Internal function to execute `sourceFunc` bound to `context` with optional
  // `args`. Determines whether to execute a function as a constructor or as a
  // normal function.
  function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (isObject(result)) return result;
    return self;
  }

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. `_` acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  var partial = restArguments(function(func, boundArgs) {
    var placeholder = partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  partial.placeholder = _$1;

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally).
  var bind = restArguments(function(func, context, args) {
    if (!isFunction$1(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Internal helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var isArrayLike = createSizePropertyCheck(getLength);

  // Internal implementation of a recursive `flatten` function.
  function flatten$1(input, depth, strict, output) {
    output = output || [];
    if (!depth && depth !== 0) {
      depth = Infinity;
    } else if (depth <= 0) {
      return output.concat(input);
    }
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (isArray(value) || isArguments$1(value))) {
        // Flatten current level of array or arguments object.
        if (depth > 1) {
          flatten$1(value, depth - 1, strict, output);
          idx = output.length;
        } else {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  }

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  var bindAll = restArguments(function(obj, keys) {
    keys = flatten$1(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = bind(obj[key], obj);
    }
    return obj;
  });

  // Memoize an expensive function by storing its results.
  function memoize(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  }

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  var delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  var defer = partial(delay, _$1, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var _now = now();
      if (!previous && options.leading === false) previous = _now;
      var remaining = wait - (_now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = _now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  }

  // When a sequence of calls of the returned function ends, the argument
  // function is triggered. The end of a sequence is defined by the `wait`
  // parameter. If `immediate` is passed, the argument function will be
  // triggered at the beginning of the sequence instead of at the end.
  function debounce(func, wait, immediate) {
    var timeout, previous, args, result, context;

    var later = function() {
      var passed = now() - previous;
      if (wait > passed) {
        timeout = setTimeout(later, wait - passed);
      } else {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
        // This check is needed because `func` can recursively invoke `debounced`.
        if (!timeout) args = context = null;
      }
    };

    var debounced = restArguments(function(_args) {
      context = this;
      args = _args;
      previous = now();
      if (!timeout) {
        timeout = setTimeout(later, wait);
        if (immediate) result = func.apply(context, args);
      }
      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = args = context = null;
    };

    return debounced;
  }

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  function wrap(func, wrapper) {
    return partial(wrapper, func);
  }

  // Returns a negated version of the passed-in predicate.
  function negate(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  }

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  function compose() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  }

  // Returns a function that will only be executed on and after the Nth call.
  function after(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  // Returns a function that will only be executed up to (but not including) the
  // Nth call.
  function before(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  }

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  var once = partial(before, 2);

  // Returns the first key on an object that passes a truth test.
  function findKey(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = keys(obj), key;
    for (var i = 0, length = _keys.length; i < length; i++) {
      key = _keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  }

  // Internal function to generate `_.findIndex` and `_.findLastIndex`.
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a truth test.
  var findIndex = createPredicateIndexFinder(1);

  // Returns the last index on an array-like that passes a truth test.
  var findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  function sortedIndex(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  }

  // Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), isNaN$1);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  var indexOf = createIndexFinder(1, findIndex, sortedIndex);

  // Return the position of the last occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  var lastIndexOf = createIndexFinder(-1, findLastIndex);

  // Return the first value which passes a truth test.
  function find(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? findIndex : findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  }

  // Convenience version of a common use case of `_.find`: getting the first
  // object containing specific `key:value` pairs.
  function findWhere(obj, attrs) {
    return find(obj, matcher(attrs));
  }

  // The cornerstone for collection functions, an `each`
  // implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  function each(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var _keys = keys(obj);
      for (i = 0, length = _keys.length; i < length; i++) {
        iteratee(obj[_keys[i]], _keys[i], obj);
      }
    }
    return obj;
  }

  // Return the results of applying the iteratee to each element.
  function map(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Internal helper to create a reducing function, iterating left or right.
  function createReduce(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var _keys = !isArrayLike(obj) && keys(obj),
          length = (_keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[_keys ? _keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = _keys ? _keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  var reduce = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  var reduceRight = createReduce(-1);

  // Return all the elements that pass a truth test.
  function filter(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  }

  // Return all the elements for which a truth test fails.
  function reject(obj, predicate, context) {
    return filter(obj, negate(cb(predicate)), context);
  }

  // Determine whether all of the elements pass a truth test.
  function every(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  }

  // Determine if at least one element in the object passes a truth test.
  function some(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  }

  // Determine if the array or object contains a given item (using `===`).
  function contains(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return indexOf(obj, item, fromIndex) >= 0;
  }

  // Invoke a method (with arguments) on every item in a collection.
  var invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (isFunction$1(path)) {
      func = path;
    } else {
      path = toPath(path);
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `_.map`: fetching a property.
  function pluck(obj, key) {
    return map(obj, property(key));
  }

  // Convenience version of a common use case of `_.filter`: selecting only
  // objects containing specific `key:value` pairs.
  function where(obj, attrs) {
    return filter(obj, matcher(attrs));
  }

  // Return the maximum element (or element-based computation).
  function max(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || (computed === -Infinity && result === -Infinity)) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Return the minimum element (or element-based computation).
  function min(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || (computed === Infinity && result === Infinity)) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Safely create a real, live array from anything iterable.
  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  function toArray(obj) {
    if (!obj) return [];
    if (isArray(obj)) return slice.call(obj);
    if (isString(obj)) {
      // Keep surrogate pair characters together.
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return map(obj, identity);
    return values(obj);
  }

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `_.map`.
  function sample(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = values(obj);
      return obj[random(obj.length - 1)];
    }
    var sample = toArray(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  }

  // Shuffle a collection.
  function shuffle(obj) {
    return sample(obj, Infinity);
  }

  // Sort the object's values by a criterion produced by an iteratee.
  function sortBy(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return pluck(map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  }

  // An internal function used for aggregate "group by" operations.
  function group(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  }

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  var groupBy = group(function(result, value, key) {
    if (has$1(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `_.groupBy`, but for
  // when you know that your index values will be unique.
  var indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  var countBy = group(function(result, value, key) {
    if (has$1(result, key)) result[key]++; else result[key] = 1;
  });

  // Split a collection into two arrays: one whose elements all pass the given
  // truth test, and one whose elements all do not pass the truth test.
  var partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Return the number of elements in a collection.
  function size(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : keys(obj).length;
  }

  // Internal `_.pick` helper function to determine whether `key` is an enumerable
  // property name of `obj`.
  function keyInObj(value, key, obj) {
    return key in obj;
  }

  // Return a copy of the object only containing the allowed properties.
  var pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (isFunction$1(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten$1(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the disallowed properties.
  var omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (isFunction$1(iteratee)) {
      iteratee = negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = map(flatten$1(keys, false, false), String);
      iteratee = function(value, key) {
        return !contains(keys, key);
      };
    }
    return pick(obj, iteratee, context);
  });

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  function initial(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  }

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. The **guard** check allows it to work with `_.map`.
  function first(array, n, guard) {
    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array[0];
    return initial(array, array.length - n);
  }

  // Returns everything but the first entry of the `array`. Especially useful on
  // the `arguments` object. Passing an **n** will return the rest N values in the
  // `array`.
  function rest(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  }

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  function last(array, n, guard) {
    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return rest(array, Math.max(0, array.length - n));
  }

  // Trim out all falsy values from an array.
  function compact(array) {
    return filter(array, Boolean);
  }

  // Flatten out an array, either recursively (by default), or up to `depth`.
  // Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.
  function flatten(array, depth) {
    return flatten$1(array, depth, false);
  }

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  var difference = restArguments(function(array, rest) {
    rest = flatten$1(rest, true, true);
    return filter(array, function(value){
      return !contains(rest, value);
    });
  });

  // Return a version of the array that does not contain the specified value(s).
  var without = restArguments(function(array, otherArrays) {
    return difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  function uniq(array, isSorted, iteratee, context) {
    if (!isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  }

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  var union = restArguments(function(arrays) {
    return uniq(flatten$1(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  function intersection(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  }

  // Complement of zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  function unzip(array) {
    var length = (array && max(array, getLength).length) || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = pluck(array, index);
    }
    return result;
  }

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  var zip = restArguments(unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of `_.pairs`.
  function object(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  }

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](https://docs.python.org/library/functions.html#range).
  function range(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  }

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  function chunk(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  }

  // Helper function to continue chaining intermediate results.
  function chainResult(instance, obj) {
    return instance._chain ? _$1(obj).chain() : obj;
  }

  // Add your own custom functions to the Underscore object.
  function mixin(obj) {
    each(functions(obj), function(name) {
      var func = _$1[name] = obj[name];
      _$1.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_$1, args));
      };
    });
    return _$1;
  }

  // Add all mutator `Array` functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _$1.prototype[name] = function() {
      var obj = this._wrapped;
      if (obj != null) {
        method.apply(obj, arguments);
        if ((name === 'shift' || name === 'splice') && obj.length === 0) {
          delete obj[0];
        }
      }
      return chainResult(this, obj);
    };
  });

  // Add all accessor `Array` functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _$1.prototype[name] = function() {
      var obj = this._wrapped;
      if (obj != null) obj = method.apply(obj, arguments);
      return chainResult(this, obj);
    };
  });

  // Named Exports
  // =============

  var allExports = /*#__PURE__*/Object.freeze({
    __proto__: null,
    VERSION: VERSION,
    after: after,
    all: every,
    allKeys: allKeys,
    any: some,
    assign: extendOwn,
    before: before,
    bind: bind,
    bindAll: bindAll,
    chain: chain,
    chunk: chunk,
    clone: clone,
    collect: map,
    compact: compact,
    compose: compose,
    constant: constant,
    contains: contains,
    countBy: countBy,
    create: create,
    debounce: debounce,
    default: _$1,
    defaults: defaults,
    defer: defer,
    delay: delay,
    detect: find,
    difference: difference,
    drop: rest,
    each: each,
    escape: escape,
    every: every,
    extend: extend,
    extendOwn: extendOwn,
    filter: filter,
    find: find,
    findIndex: findIndex,
    findKey: findKey,
    findLastIndex: findLastIndex,
    findWhere: findWhere,
    first: first,
    flatten: flatten,
    foldl: reduce,
    foldr: reduceRight,
    forEach: each,
    functions: functions,
    get: get,
    groupBy: groupBy,
    has: has,
    head: first,
    identity: identity,
    include: contains,
    includes: contains,
    indexBy: indexBy,
    indexOf: indexOf,
    initial: initial,
    inject: reduce,
    intersection: intersection,
    invert: invert,
    invoke: invoke,
    isArguments: isArguments$1,
    isArray: isArray,
    isArrayBuffer: isArrayBuffer,
    isBoolean: isBoolean,
    isDataView: isDataView$1,
    isDate: isDate,
    isElement: isElement,
    isEmpty: isEmpty,
    isEqual: isEqual,
    isError: isError,
    isFinite: isFinite$1,
    isFunction: isFunction$1,
    isMap: isMap,
    isMatch: isMatch,
    isNaN: isNaN$1,
    isNull: isNull,
    isNumber: isNumber,
    isObject: isObject,
    isRegExp: isRegExp,
    isSet: isSet,
    isString: isString,
    isSymbol: isSymbol,
    isTypedArray: isTypedArray$1,
    isUndefined: isUndefined,
    isWeakMap: isWeakMap,
    isWeakSet: isWeakSet,
    iteratee: iteratee,
    keys: keys,
    last: last,
    lastIndexOf: lastIndexOf,
    map: map,
    mapObject: mapObject,
    matcher: matcher,
    matches: matcher,
    max: max,
    memoize: memoize,
    methods: functions,
    min: min,
    mixin: mixin,
    negate: negate,
    noop: noop,
    now: now,
    object: object,
    omit: omit,
    once: once,
    pairs: pairs,
    partial: partial,
    partition: partition,
    pick: pick,
    pluck: pluck,
    property: property,
    propertyOf: propertyOf,
    random: random,
    range: range,
    reduce: reduce,
    reduceRight: reduceRight,
    reject: reject,
    rest: rest,
    restArguments: restArguments,
    result: result,
    sample: sample,
    select: filter,
    shuffle: shuffle,
    size: size,
    some: some,
    sortBy: sortBy,
    sortedIndex: sortedIndex,
    tail: rest,
    take: first,
    tap: tap,
    template: template,
    templateSettings: templateSettings,
    throttle: throttle,
    times: times,
    toArray: toArray,
    toPath: toPath$1,
    transpose: unzip,
    unescape: unescape,
    union: union,
    uniq: uniq,
    unique: uniq,
    uniqueId: uniqueId,
    unzip: unzip,
    values: values,
    where: where,
    without: without,
    wrap: wrap,
    zip: zip
  });

  // Default Export
  // ==============
  // In this module, we mix our bundled exports into the `_` object and export
  // the result. This is analogous to setting `module.exports = _` in CommonJS.
  // Hence, this module is also the entry point of our UMD bundle and the package
  // entry point for CommonJS and AMD users. In other words, this is (the source
  // of) the module you are interfacing with when you do any of the following:
  //
  // ```js
  // // CommonJS
  // var _ = require('underscore');
  //
  // // AMD
  // define(['underscore'], function(_) {...});
  //
  // // UMD in the browser
  // // _ is available as a global variable
  // ```

  // Add all of the Underscore functions to the wrapper object.
  var _ = mixin(allExports);
  // Legacy Node.js API.
  _._ = _;

  /*-----------------------------------------------------------------------------
  | Each line is made of:
  |
  | - some text in single quotes  <= The internal code used by the app. Leave it.
  |                                  (Usually it is the wylie transliteration)
  |
  | - a colon                     <= If you forget any colon, the app won't work.
  |
  | - some text in single         <= How it will be converted in the end.
  |   or double quotes               If the text includes single quotes,
  |                                  then it is wrapped in double quotes.
  |
  | - a comma                     <= If you forget any comma, the app won't work.
  |
  | For instance, ཁྱེན will be converted by replacing each part one by one,
  | using these rules:
  |
  | - khaYata         => 'khy'
  | - drengbuMaNaRa   => 'e'
  | - naSuffix        => 'n'
  |
  | Resulting in 'khyen'.
  -----------------------------------------------------------------------------*/

  const baseRules = {
    // End equals start (sang-gyé, tak-ki, ...)
    // Value can be 'merge', 'dash', 'space', or 'leave'
    'endEqualsStart': 'dash',
    // End link char (as in pa-o or be-u)
    'endLinkChar': '-',
    // Vowels
    'a': 'a',
    // འ
    'i': 'i',
    // འི
    'o': 'o',
    // འོ
    'u': 'u',
    // འུ
    'ü': 'ü',
    // འུས
    'ö': 'ö',
    // འོས
    'drengbu': 'é',
    // འེ
    'drengbuMaNaRa': 'e',
    // མཁྱེན་ / drengbu and suffix ma, na, ra
    'drengbuGaBaLaNga': 'e',
    // འཕྲེང་ / drengbu and suffix ga, ba, la, nga
    'aNa': 'e',
    // རྒྱན་  / no vowel and suffix na
    'aLa': 'a',
    // རྒྱལ་  / no vowel and suffix la
    'aKikuI': "a'i",
    // པའི

    // Regular consonants
    'ka': 'k',
    // ཀ
    'kha': 'kh',
    // ཁ
    'ga': 'k',
    // ག
    'nga': 'ng',
    // ང
    'ca': 'ch',
    // ཅ
    'cha': "ch'",
    // ཆ
    'ja': 'ch',
    // ཇ
    'nya': 'ny',
    // ཉ
    'ta': 't',
    // ཏ
    'tha': 'th',
    // ཐ
    'da': 't',
    // ད
    'na': 'n',
    // ན
    'pa': 'p',
    // པ
    'pha': "p'",
    // ཕ
    'ba': 'p',
    // བ
    'ma': 'm',
    // མ
    'tsa': 'ts',
    // ཙ
    'tsha': "ts'",
    // ཚ
    'dza': 'dz',
    // ཛ
    'wa': 'w',
    // ཝ
    'zha': 'zh',
    // ཞ
    'za': 's',
    // ཟ
    'ya': 'y',
    // ཡ
    'ra': 'r',
    // ར
    'la': 'l',
    // ལ
    'sha': 'sh',
    // ཤ
    'sa': 's',
    // ས
    'ha': 'h',
    // ཧ

    // Modified consonants (with prefix or superscribed)
    'gaMod': 'g',
    // རྒ
    'jaMod': 'j',
    // རྗ
    'daMod': 'd',
    // རྡ
    'baMod': 'b',
    // རྦ
    'zaMod': 'z',
    // བཟའ

    // Ratas
    'rata1': 'tr',
    // ཏྲ  / 1st col with rata
    'rata2': "tr'",
    // ཁྲ  / 2nd col with rata
    'rata3': 'tr',
    // བྲ  / 3rd col with rata
    'rata3Mod': 'dr',
    // སྒྲ / 3rd col with rata and prefix/superscribed
    'hra': 'hr',
    // ཧྲ

    // Yatas
    'kaYata': 'ky',
    // ཀྱ
    'khaYata': 'khy',
    // ཁྱ
    'gaYata': 'ky',
    // གྱ
    'gaModYata': 'gy',
    // སྒྱ / ga with yata and prefix/superscribed
    'paYata': 'ch',
    // པྱ
    'phaYata': "ch'",
    // ཕྱ
    'baYata': 'ch',
    // བྱ
    'baModYata': 'j',
    // སྦྱ / ba with yata and prefix/superscribed
    'daoWaYata': 'y',
    // དབྱ

    // Latas
    'lata': 'l',
    // གླ
    'lataDa': 'd',
    // ཟླ

    // Special cases
    'lha': 'lh',
    // ལྷ
    'baAsWa': 'w',
    // དགའ་བ་

    // Suffixes
    'kaSuffix': 'k',
    // དག
    'ngaSuffix': 'ng',
    // དང
    'naSuffix': 'n',
    // དན
    'baSuffix': 'p',
    // དབ
    'maSuffix': 'm',
    // དམ
    'raSuffix': 'r',
    // དར
    'laSuffix': 'l' // དལ
  };

  /*-----------------------------------------------------------------------------
  | Each line is made of:
  |
  | - some text in single quotes  <= The internal code used by the app. Leave it.
  |                                  (Usually it is the wylie transliteration)
  |
  | - a colon                     <= If you forget any colon, the app won't work.
  |
  | - some text in single         <= How it will be converted in the end.
  |   or double quotes               If the text includes single quotes,
  |                                  then it is wrapped in double quotes.
  |
  | - a comma                     <= If you forget any comma, the app won't work.
  |
  | For instance, ཁྱེན will be converted by replacing each part one by one,
  | using these rules:
  |
  | - khaYata         => 'khy'
  | - drengbuMaNaRa   => 'e'
  | - naSuffix        => 'n'
  |
  | Resulting in 'khyen'.
  -----------------------------------------------------------------------------*/

  const englishLoose = {
    id: 'english-loose',
    name: 'English (loose)',
    rules: {
      // Linking char (as in pa-o or pe-u)
      'endLinkChar': "'",
      // Vowels
      'aKikuI': 'é',
      // པའི

      // Regular consonants
      'kha': 'k',
      // ཁ
      'ga': 'k',
      // ག
      'cha': 'ch',
      // ཆ
      'th': 't',
      // བ
      'ba': 'p',
      // བ
      'tsha': 'ts',
      // ཚ
      'ja': 'ch',
      // ཇ
      'pha': 'p',
      // ཕ
      'zha': 'sh',
      // ཞ

      // Ratas
      'rata2': 'tr',
      // ཁྲ  // 2nd column with rata

      // Yatas
      'gaYata': 'ky',
      // གྱ
      'phaYata': 'ch',
      // ཕྱ
      'baYata': 'ch' // བྱ
    },

    exceptions: {}
  };

  /*-----------------------------------------------------------------------------
  | Each line is made of:
  |
  | - some text in single quotes  <= The internal code used by the app. Leave it.
  |                                  (Usually it is the wylie transliteration)
  |
  | - a colon                     <= If you forget any colon, the app won't work.
  |
  | - some text in single         <= How it will be converted in the end.
  |   or double quotes               If the text includes single quotes,
  |                                  then it is wrapped in double quotes.
  |
  | - a comma                     <= If you forget any comma, the app won't work.
  |
  | For instance, ཁྱེན will be converted by replacing each part one by one,
  | using these rules:
  |
  | - khaYata         => 'khy'
  | - drengbuMaNaRa   => 'e'
  | - naSuffix        => 'n'
  |
  | Resulting in 'khyen'.
  -----------------------------------------------------------------------------*/

  const englishSemiStrict = {
    id: 'english-semi-strict',
    name: 'English (semi-strict)',
    rules: {
      // Vowels
      'aKikuI': 'é',
      // པའི

      // Regular consonants
      'cha': 'ch',
      // ཆ
      'tsha': 'ts',
      // ཚ

      // Yatas
      'phaYata': 'ch',
      // ཕྱ
      'baYata': 'ch' // བྱ
    },

    exceptions: {}
  };

  /*-----------------------------------------------------------------------------
  | Each line is made of:
  |
  | - some text in single quotes  <= The internal code used by the app. Leave it.
  |                                  (Usually it is the wylie transliteration)
  |
  | - a colon                     <= If you forget any colon, the app won't work.
  |
  | - some text in single         <= How it will be converted in the end.
  |   or double quotes               If the text includes single quotes,
  |                                  then it is wrapped in double quotes.
  |
  | - a comma                     <= If you forget any comma, the app won't work.
  |
  | For instance, ཁྱེན will be converted by replacing each part one by one,
  | using these rules:
  |
  | - khaYata         => 'khy'
  | - drengbuMaNaRa   => 'e'
  | - naSuffix        => 'n'
  |
  | Resulting in 'khyen'.
  -----------------------------------------------------------------------------*/

  const englishStrict = {
    id: 'english-strict',
    name: 'English (strict)',
    rules: {},
    exceptions: {}
  };

  /*-----------------------------------------------------------------------------
  | Each line is made of:
  |
  | - some text in single quotes  <= The internal code used by the app. Leave it.
  |                                  (Usually it is the wylie transliteration)
  |
  | - a colon                     <= If you forget any colon, the app won't work.
  |
  | - some text in single         <= How it will be converted in the end.
  |   or double quotes               If the text includes single quotes,
  |                                  then it is wrapped in double quotes.
  |
  | - a comma                     <= If you forget any comma, the app won't work.
  |
  | For instance, ཁྱེན will be converted by replacing each part one by one,
  | using these rules:
  |
  | - khaYata         => 'khy'
  | - drengbuMaNaRa   => 'e'
  | - naSuffix        => 'n'
  |
  | Resulting in 'khyen'.
  -----------------------------------------------------------------------------*/

  const french = {
    id: 'french',
    name: 'French',
    rules: {
      'doubleS': true,
      // Vowels
      'u': 'ou',
      // འུ
      'ü': 'u',
      // འུས
      'ö': 'eu',
      // འོས
      'aKikuI': 'é',
      // པའི

      // Regular consonants
      'ca': 'tch',
      // ཅ
      'cha': "tch'",
      // ཆ
      'ja': 'dj',
      // ཇ
      'tha': "t'",
      // ཐ
      'ba': 'p',
      // བ
      'tsha': "ts'",
      // ཚ
      'sha': 'ch',
      // ཤ
      'zha': 'sh',
      // ཞ

      // Modified consonants (with prefix or superscribed)
      'jaMod': 'dj',
      // རྗ
      'gaMod': 'gu',
      // རྒ

      // Ratas
      'rata2': "t'r",
      // ཁྲ  / 2nd col with rata

      // Yatas
      'gaModYata': 'gui',
      // སྒྱ / ga with yata and prefix/superscribed
      'paYata': 'tch',
      // པྱ
      'phaYata': "tch'",
      // ཕྱ
      'baYata': "tch'",
      // བྱ
      'baModYata': 'dj' // སྦྱ / ba with yata and prefix/superscribed
    },

    exceptions: {}
  };

  /*-----------------------------------------------------------------------------
  | Each line is made of:
  |
  | - some text in single quotes  <= The internal code used by the app. Leave it.
  |                                  (Usually it is the wylie transliteration)
  |
  | - a colon                     <= If you forget any colon, the app won't work.
  |
  | - some text in single         <= How it will be converted in the end.
  |   or double quotes               If the text includes single quotes,
  |                                  then it is wrapped in double quotes.
  |
  | - a comma                     <= If you forget any comma, the app won't work.
  |
  | For instance, ཁྱེན will be converted by replacing each part one by one,
  | using these rules:
  |
  | - khaYata         => 'khy'
  | - drengbuMaNaRa   => 'e'
  | - naSuffix        => 'n'
  |
  | Resulting in 'khyen'.
  -----------------------------------------------------------------------------*/

  const spanish = {
    id: 'spanish',
    name: 'Spanish',
    rules: {
      // Vowels
      'ü': 'u',
      // འུས
      'ö': 'o',
      // འོས
      'drengbu': 'e',
      // འེ
      'aKikuI': 'e',
      // འི

      // Regular consonants
      'kha': 'k',
      // ཁ
      'cha': 'ch',
      // ཆ
      'nya': 'ñ',
      // ཉ
      'tha': 't',
      // ཐ
      'pha': 'p',
      // ཕ
      'ba': 'p',
      // བ
      'tsha': 'ts',
      // ཚ
      'dza': 'ds',
      // ཛ
      'zha': 'sh',
      // ཞ

      // Modified consonants (with prefix or superscribed)
      'gaMod': 'gu',
      // གཇ
      'jaMod': 'y',
      // རྗ
      'zaMod': 's',
      // བཟ

      // Ratas
      'rata2': 'tr',
      // ཁྲ  / 2nd col with rata

      // Yatas
      'gaModYata': 'gui',
      // སྒྱ / ga with yata and prefix/superscribed
      'paYata': 'ch',
      // པྱ
      'phaYata': 'ch',
      // ཕྱ
      'baYata': 'ch',
      // བྱ
      'baModYata': 'y' // སྦྱ / ba with yata and prefix/superscribed
    },

    exceptions: {
      'ཁ་ཊྭཾ་ག': 'kat_vam_ga'
    }
  };

  //  ka  / kha  / ga  become ga
  //  bha / cha  / ja  become cha
  //  ta  / tha  / da  become ta
  //  pa  / pha  / ba  become pa
  //  kya / khya / gya become gya
  //  sa  / za         become sa
  //  tra / dra        become tra

  const englishSuperLoose = {
    id: 'english-super-loose',
    name: 'English SuperLoose (for phonetic search)',
    rules: {
      // End equals start (sang-gyé, tak-ki, ...)
      // Value can be 'merge', 'dash', 'space', or 'leave'
      'endEqualsStart': 'merge',
      // Linking char (as in pa-o or pe-u)
      'endLinkChar': "'",
      // Vowels
      'ü': 'u',
      // འུས
      'ö': 'o',
      // འོས
      'drengbu': 'e',
      // འེ
      'drengbuMaNaRa': 'e',
      // མཁྱེན་ / drengbu and suffix ma, na, ra
      'drengbuGaBaLaNga': 'e',
      // འཕྲེང་ / drengbu and suffix ga, ba, la, nga
      'aNa': 'e',
      // རྒྱན་  / no vowel and suffix na
      'aLa': 'e',
      // རྒྱལ་  / no vowel and suffix la
      'aKikuI': "e",
      // པའི

      // Regular consonants
      'ka': 'k',
      // ཀ
      'kha': 'k',
      // ཁ
      'tha': 't',
      // ཐ
      'ga': 'k',
      // ག
      'ba': 'p',
      // བ
      'cha': 'ch',
      // ཆ
      'tsha': 'ts',
      // ཚ
      'da': 't',
      // ད
      'pha': 'p',
      // ཕ
      'zha': 'sh',
      // ཞ
      'dza': 'ts',
      // ཛ

      // Modified consonants (with prefix or superscribed)
      'gaMod': 'k',
      // རྒ
      'jaMod': 'ch',
      // རྗ
      'daMod': 't',
      // རྡ
      'baMod': 'p',
      // རྦ
      'zaMod': 's',
      // བཟ

      // Ratas
      'rata1': 'tr',
      // ཏྲ  / 1st col with rata
      'rata2': 'tr',
      // ཁྲ  / 2nd col with rata
      'rata3': 'tr',
      // བྲ  / 3rd col with rata
      'rata3Mod': 'tr',
      // སྒྲ / 3rd col with rata and prefix/superscribed
      'hra': 'hr',
      // ཧྲ

      // Yatas
      'kaYata': 'k',
      // ཀྱ
      'khaYata': 'k',
      // ཁྱ
      'gaYata': 'k',
      // གྱ
      'gaModYata': 'k',
      // སྒྱ / ga with yata and prefix/superscribed
      'paYata': 'ch',
      // པྱ
      'phaYata': 'ch',
      // ཕྱ
      'baYata': 'ch',
      // བྱ
      'baModYata': 'ch',
      // སྦྱ / ba with yata and prefix/superscribed
      'daoWaYata': 'y',
      // དབྱ

      // Latas
      'lata': 'l',
      // གླ
      'lataDa': 't',
      // ཟླ

      // Special cases
      'lha': 'l',
      // ལྷ
      'baAsWa': 'p'
    },
    exceptions: {}
  };

  var defaultSettings$1 = [];
  defaultSettings$1.push(englishLoose);
  defaultSettings$1.push(englishSemiStrict);
  defaultSettings$1.push(englishStrict);
  defaultSettings$1.push(french);
  defaultSettings$1.push(spanish);
  defaultSettings$1.push(englishSuperLoose);

  var tibetanNormalizer = {

    normalize (text) {
      var normalized = this.normalizeCombinedLetters(text);
      normalized = this.normalizeTsheks(normalized);
      return normalized;
    },

    normalizeTsheks (text) {
      return text
        .replace(/(ཾ)([ཱཱཱེིོིྀུུ])/g, '$2$1') // Malformed: anusvara before vowel
        .replace(/༌/g, '་') // Alternative tshek
        .replace(/་+/g, '་'); // Multiple consecutive tsheks into one
    },

    normalizeCombinedLetters (text) {
      return text
        .replace(/[ ]/g, ' ')
        .replace(/ༀ/g, 'ཨོཾ')
        .replace(/ཀྵ/g, 'ཀྵ')
        .replace(/བྷ/g, 'བྷ')
        .replace(/ི+/g, 'ི')
        .replace(/ུ+/g, 'ུ')
        .replace(/ཱུ/g, 'ཱུ')
        .replace(/ཱི/g, 'ཱི')
        .replace(/ཱྀ/g, 'ཱྀ')
        .replace(/དྷ/g, 'དྷ')
        .replace(/གྷ/g, 'གྷ')
        .replace(/ཪླ/g, 'རླ')
        .replace(/ྡྷ/g, 'ྡྷ')
        .replace(//g, '࿓༅')
        .replace(//g, 'སྤྲ')
        .replace(//g, 'ུ')
        .replace(//g, 'ག')
        .replace(//g, 'ུ')
        .replace(//g, 'རྒྱ')
        .replace(//g, 'གྲ')
        .replace(//g, 'ུ')
        .replace(//g, 'ི')
        .replace(//g, 'བྱ')
        .replace(//g, 'སྲ')
        .replace(//g, 'སྒྲ')
        .replace(//g, 'ལྷ')
        .replace(//g, 'ོ')
        .replace(//g, 'གྱ')
        .replace(//g, 'རླ')
        .replace(//g, 'ཕྱ')
        .replace(//g, 'སྩ')
        .replace(//g, 'རྡ')
        .replace(//g, 'རྗ')
        .replace(//g, 'དྲྭ')
        .replace(//g, 'ཛྲ')
        .replace(//g, 'ལྷྭ')
        .replace(//g, 'སྤྱ')
        .replace(//g, 'བྷྱ')
        .replace(//g, 'གྷྣ')
        .replace(//g, 'གྷྲ')
        .replace(//g, 'ནྡྷ')
        .replace(//g, 'ཧྣ')
        .replace(//g, 'ཥྚ')
        .replace(//g, 'བྷྲ')
        .replace(//g, 'ཱུ')
        .replace(//g, 'ཱུ')
        .replace(//g, 'རྒྷ')
        .replace(//g, 'ྀ')
        .replace(//g, 'ཱ')
        .replace(//g, 'ཱ')
        .replace(//g, 'དྡྷྭ')
        .replace(//g, 'ིཾ')
        .replace(//g, 'ིཾ')
        .replace(//g, 'ངྷ')
    }

  };

  const removeMuteCharsAndNormalize = function (tibetan) {
    var normalized = tibetanNormalizer.normalize(tibetan);
    return normalized.replace(/[༵\u0F04-\u0F0A\u0F0D-\u0F1F\u0F3A-\u0F3F\u0FBE-\uF269]/g, '').trim().replace(/[༔ཿ]/g, '་').replace(/[ྃྂ]/g, 'ཾ').replace(/་$/g, '');
  };

  // Copied from Sugar

  String.prototype.first = function (num) {
    if (num == undefined) num = 1;
    return this.substr(0, num);
  };
  String.prototype.last = function (num) {
    if (num == undefined) num = 1;
    var start = this.length - num < 0 ? 0 : this.length - num;
    return this.substr(start);
  };
  String.prototype.capitalize = function (all) {
    var lastResponded;
    return this.toLowerCase().replace(all ? /[^']/g : /^\S/, function (lower) {
      var upper = lower.toUpperCase(),
        result;
      result = lastResponded ? lower : upper;
      lastResponded = upper !== lower;
      return result;
    });
  };
  String.prototype.to = function (num) {
    if (num == undefined) num = this.length;
    return this.slice(0, num);
  };
  String.prototype.pad = function (num, padding) {
    var half, front, back;
    num = checkRepeatRange(num);
    half = Math.max(0, num - this.length) / 2;
    front = Math.floor(half);
    back = Math.ceil(half);
    return padString(front, padding) + this + padString(back, padding);
  };
  function checkRepeatRange(num) {
    num = +num;
    if (num < 0 || num === Infinity) {
      throw new RangeError('Invalid number');
    }
    return num;
  }
  function padString(num, padding) {
    return repeatString(padding !== undefined ? padding : ' ', num);
  }
  function repeatString(str, num) {
    var result = '',
      str = str.toString();
    while (num > 0) {
      if (num & 1) {
        result += str;
      }
      if (num >>= 1) {
        str += str;
      }
    }
    return result;
  }
  function deepClone(object) {
    return JSON.parse(JSON.stringify(object));
  }

  const defaultSettingId = 'english-loose';
  const defaultsMissingRulesToBaseRules = function (setting) {
    setting.isDefault = true;
    _(setting.rules).defaults(baseRules);
    return setting;
  };
  const defaultSettings = defaultSettings$1.map(setting => defaultsMissingRulesToBaseRules(setting));
  const Settings = {
    defaultSettings: defaultSettings,
    defaultSettingId: defaultSettingId,
    settings: defaultSettings,
    all() {
      return this.settings;
    },
    default() {
      return this.find(this.defaultSettingId);
    },
    originalDefault() {
      return this.findOriginal(this.defaultSettingId);
    },
    find: function (settingId) {
      if (!settingId) return;
      if (settingId.toString().match(/^\d*$/)) settingId = parseInt(settingId);
      return _(this.settings).findWhere({
        id: settingId
      });
    },
    findOriginal: function (settingId) {
      var setting = _(defaultSettings).findWhere({
        id: settingId
      });
      return defaultsMissingRulesToBaseRules(setting);
    },
    update(settingId, name, rules, exceptions) {
      var setting = this.find(settingId);
      setting.name = name;
      setting.rules = rules;
      setting.exceptions = exceptions;
      this.updateStore();
    },
    create(fromSetting, name) {
      var id = this.maxId() + 1;
      this.settings.push({
        id: id,
        isCustom: true,
        isEditable: true,
        name: name || 'Rule set ' + id,
        rules: _(fromSetting && deepClone(fromSetting.rules) || {}).defaults(baseRules),
        exceptions: fromSetting && deepClone(fromSetting.exceptions) || {}
      });
      this.updateStore();
    },
    copy(setting) {
      this.create(setting, 'Copy of ' + setting.name);
    },
    import(setting) {
      this.create(setting, setting.name);
    },
    delete(setting) {
      this.settings = _(this.settings).without(setting);
      this.updateStore();
      Storage.get('selectedSettingId', undefined, value => {
        if (value == setting.id) Storage.set('selectedSettingId', defaultSettingId);
      });
    },
    replaceAllWith(newSettings) {
      this.settings = newSettings;
    },
    reset(callback) {
      this.settings = this.defaultSettings;
      this.updateStore(callback);
    },
    maxId() {
      return (this.settings.filter(setting => _(setting.id).isNumber()).max('id') || {
        id: 0
      }).id;
    },
    updateStore(callback) {
      Storage.set('settings', this.settings, value => {
        if (callback) callback(value);
      });
    },
    numberOfSpecificRules(setting) {
      return _(setting.rules).filter((value, key) => baseRules[key] != value).length;
    }
  };

  /*----------------------------------------------------------------------------
  | Each line defines one exception.
  |
  | If any of the values on the left of the colon is found in the line to be
  | converted, then it will be treated as if it was the value on the right
  | of the colon.
  |
  | Tibetan characters will be converted as they would be normally.
  | Latin characters will be inserted as-is within the transliteration.
  |
  | If using Latin characters, then between each syllable you need to add an
  | underscore to help the system determine how many syllables the word is made
  | of, even if it does not exactly match how the word is composed.
  |
  | For instance if you want to have སངས་རྒྱས་ always converted as 'sangye',
  | you would do:
  |
  | 'སངས་རྒྱས': 'san_gye'
  | but not
  | 'སངས་རྒྱས': 'sang_gye'
  |
  | If a line is defined with a left value that is included in another line with
  | a longer left value, then the longer one will be used.
  |
  | For instance if these two rules are defined:
  |
  | 'སངས': 'SAN'
  | 'སངས་རྒྱས': 'san_GYE'
  |
  | Then སངས་རྒྱས་ would be converted as sanGYE,  ignoring the first rule.
  ----------------------------------------------------------------------------*/

  const defaultGeneralExceptions = {
    // Mute suffixes
    'བདག': 'སྡ',
    'ཤོག': 'ཤོ',
    // Links between syllables
    'ཡ་མཚན': 'ཡམ་མཚན',
    'གོ་འཕང': 'གོམ་འཕང',
    'ཨོ་རྒྱན': 'ཨོར་རྒྱན',
    'རྒྱ་མཚོ': 'རྒྱམ་མཚོ',
    'མཁའ་འགྲོ': 'མཁའn_འགྲོ',
    'མཁའ་འགྲོའི': 'མཁའn_འགྲོའི',
    'མཁའ་འགྲོས': 'མཁའn_འགྲོས',
    'རྗེ་འབངས': 'རྗེམ་འབངས',
    'དགེ་འདུན': 'དགེན་འདུན',
    'འཕྲོ་འདུ': 'འཕྲོn_འདུ',
    'མི་འགྱུར': 'མིན་འགྱུར',
    'རྒྱ་མཚོའི': 'རྒྱམ་མཚོའི',
    'མཆོད་རྟེན': 'མཆོར་རྟེན',
    'སྤྲོ་བསྡུ': 'སྤྲོn_འདུ',
    'འོད་མཐའ་ཡས': 'འོན་མཐའ་ཡས',
    'རྡོ་རྗེ': 'རྡོར་རྗེ',
    'རྟ་མགྲིན': 'རྟམ་མགྲིན',
    'བཀའ་འགྱུར་': 'བཀའn་འགྱུར་',
    'ན་བཟའ་': 'ནམ་བཟའ་',
    'མ་འགགས་': 'མn་འགགས་',
    // Complicated spacing
    'ལ་གསོལ་བ་འདེབས': 'ལ་ གསོལ་བ་ འདེབས',
    // Mistakes that become so common we keep them
    'རབ་འབྱམས': 'རb_འབྱམས',
    // People and places
    'སྤྱན་རས་གཟིགས': 'སྤྱན་རས་གཟི',
    'ཚེ་དཔག་མེད': 'ཚེ་པ་མེད',
    // Sanskrit stuff
    'ༀ': 'ཨོམ ',
    'ཨཱ': 'འh ',
    'ཧཱུཾ': 'hའུང ',
    'བྷྲཱུཾ': 'bhrའུམ',
    'ཧྲཱི': 'ཧྲི ',
    'མ་ཎི': 'ma_ni',
    'རཾ་ཡཾ་ཁཾ': 'ram yam kham ',
    'ཧ་ཧོ་ཧྲཱི': 'ha ho hri ',
    'ཨ་ཨ་ཨ།': 'a a a ',
    'ཀྲི་ཡ': 'kri_ya',
    'ཨུ་པ': 'u_pa',
    'ཡོ་ག': 'yo_ga',
    'མ་ཧཱ': 'ma_ha',
    'ཨ་ནུ': 'a_nu',
    'ཨ་ཏི': 'a_ti',
    'བཾ': 'bam ',
    'ཨཾ': 'ang ',
    'ཀརྨ': 'ཀར་མ',
    'དྷུ': 'dhའུ',
    'དྷི': 'dhའི',
    'དྷ': 'dhའ',
    'བྷ': 'bh',
    'བྷ་ག': 'bhའ_རྒ',
    'བཛྲ': 'va_jra',
    'ཏནྟྲ': 'tan_tra',
    'སིདྡྷི': 'sid_dhi',
    'ཤཱཀྱ': 'sha_kya',
    'ཛྙཱ': 'རྒྱ',
    'པདྨ': 'པd_མ',
    'པདྨོ': 'པd_མོ',
    'པདྨེ': 'པd_མེ',
    'པཎྜི': 'པn_སྡི',
    'པཎྜིཏ': 'པn_སྡི_ཏ',
    'བཾ་རོ': 'བམ་རོ',
    'ཤྲཱི': 'ཤི་རི',
    'གུ་རུ': 'gའུ་རུ',
    'ཨུཏྤལ': 'ཨུt_པལ',
    'ཏདྱཐཱ': 'tའd_ཡ_ཏ',
    'སྭསྟི': 'svའ_stའི',
    'སྭ་སྟི': 'svའ_stའི',
    'ཝཱ་རཱ་ཧཱི': 'ཝ_ར_ཧི',
    'ཁ་ཊྭཾ་ག': 'ཀ_ཏང_ཀ',
    'ཨེ་མ་ཧོ': 'ཨེ_མ_ཧོ',
    'གུ་རུ': 'སྒུ་རུ',
    'སམྦྷ་ཝར': 'སམ_bhའ_ཝར',
    'དིཔྟ་ཙཀྲ': 'dའི_ptའ tsའk_trའ',
    'ཀྲོསྡ': 'krའོ_dhའ',
    'ༀ་ཨ་ར་པ་ཙ་ན་སྡིཿསྡིཿསྡིཿ': 'ༀ ཨ ར པ ཙ ན རྡི རྡི རྡི',
    'སརྦ': 'sའr_wའ',
    'བྷུ': 'bhའུ',
    'ས་པ་རི་ཝཱ་ར': 'ས་པ་རི་ཝ་ར',
    'ས་མ་ཡ': 'ས་མ་ཡ',
    'ས་མ་ཡ་ཛཿ': 'ས་མ་ཡ ཛ',
    'འལ་འོལ': 'འལ_-འོལ',
    'ཏིཥྛ་ལྷན༔': 'tish_tha lhan',
    'ཨ་ཏི་པཱུ་ཧོཿ': 'a_ti_pའུ ho',
    'པྲ་ཏཱིཙྪ་ཧོཿ': 'pra_ti_tsa ho',
    'ཨརྒྷཾ': 'ar_gham',
    'པཱ་དྱཾ': 'pa_dyam',
    'པུཥྤེ': 'pའུsh_པེ',
    'དྷཱུ་པེ': 'dhའུ_པེ',
    'ཨཱ་ལོ་ཀེ': 'a_lo_ཀེ',
    'གནྡྷེ': 'gan_dhཨེ',
    'ནཻ་ཝི་དྱ': 'nai_win_dyའེ',
    'ནཻ་ཝི་ཏྱ': 'nai_win_dyའེ',
    'ཤཔྡ': 'sha_pta',
    'པྲ་ཏཱིཙྪ་': 'pra_ti_tsa ',
    'པྲ་ཏཱིཙྪ་ཡེ': 'pra_ti_tsa_yའེ',
    'སྭཱ་ཧཱ': 'sva_ha',
    'སྭཱཧཱ': 'sva_ha',
    'དྷརྨ': 'dhar_ma',
    'དྷརྨཱ': 'dhar_ma',
    'དྷརྨ་པཱ་ལ': 'dhar_ma_pa_la',
    'དྷརྨཱ་པཱ་ལ': 'dhar_ma_pa_la',
    'ཨི་དཾ': 'i_dam',
    'བ་ལིངྟ': 'ba_ling_ta',
    'བ་ལིཾ་ཏ': 'ba_ling_ta',
    'པཉྩ': 'pañ_tsa',
    'ཨ་མྲྀ་ཏ': 'am_ri_ta',
    'ཨམྲྀ་ཏ': 'am_ri_ta',
    'ཀུཎྜ་ལཱི': 'kའུn_da_li',
    'རཀྟ': 'rak_ta',
    'པཱུ་ཛ': 'pའུ_ja',
    'ཁ་ཁ་ཁཱ་ཧི་ཁཱ་ཧི': 'kha kha kha_hi kha_hi',
    'མཎྜལ': 'man_da_la',
    'མཎྜ་ལ': 'man_da_la',
    'ཤྲཱི': 'shi_ri',
    'དྷེ་ཝ': 'dé_wa',
    'ཤཱནྟ': 'shen_ta',
    'ཀྲོ་དྷ': 'kro_dha',
    'དྷ་ཀ': 'སྡ_ཀ',
    'དྷཱ་ཀི་ནཱི': 'སྡ_ཀི_ནི',
    'ཌཱཀྐི་ནི': 'སྡ_ཀི_ནི',
    'ཌཱ་ཀི་ནཱི་': 'སྡ_ཀི_ནི',
    'དྷཱ་ཀི': 'སྡ_ཀི',
    'ཌཱ་ཀི': 'སྡ_ཀི',
    'ཌཱཀྐི': 'སྡ_ཀི',
    'འོག་མིན': 'འོ་མིན',
    'བ་སུ་དེ་ཝ': 'wa_sའུ dé_wa',
    'ནཱི་དྷི་པ་ཏི': 'ni_dhi_pa_ti',
    'བྷཱུ་མི་པ་ཏི': 'bhའུ_mi_pa_ti',
    'མ་ཧཱ་ཀཱ་ལ': 'ma_ha_ka_la',
    'མ་ཧཱ་ཀཱ་ལཱ': 'ma_ha_ka_la_ya',
    'ཏ་ཐཱ་ག་ཏ': 'ta_tha_ga_ta',
    'བྷྱོ': 'ba_yo',
    'བི་ཤྭ': 'bi_shའུ',
    'མུ་ཁེ་བྷྱ': 'mའུ_ké_bé',
    'ཨུདྒཏེ': 'འུt_ga_té',
    'སྥར': 'sa_par',
    'སྥ་ར་ཎ': 'ས_པ_ར_ན',
    'ག་ག་ན་ཁཾ': 'སྒ_སྒ_ན ཁམ',
    'ཏིཥྛ': 'tish_tha',
    'ཏིཥྛནྟུ': 'tish_then_tའུ',
    'ཀཱ་ཝཱ་ཙི': 'ཀ ཝ ཙི',
    'ཝཱཀ': 'ཝ_ཀ',
    'ཙིཏྟ': 'ཆི_tཏ',
    'རཀྵ': 'རk_ཤ',
    'བོ་དྷི': 'སྦོ_དྷི',
    'པཱཀྵ': 'པཱk_ཤ',
    'པུཎྱཻ་': 'པུ_ཉེ',
    'སྭ་བྷཱ་ཝ': 'so_bha_wa',
    'ཤུདྡྷྭ': 'shའུd_do',
    'ཤུདྡྷོ': 'shའུd_do',
    'ཤུདྡྷོ྅ཧཾ': 'shའུd_do hang',
    'ཀ་མ་ལཱ་ཡེ': 'ka_ma_la yé',
    'སྟྭཾ': 'tam',
    'རཏྣ': 'rat_na',
    'ཨཱརྻ': 'a_rya',
    'ཨཱརྻཱ': 'a_rya',
    'ཨཱརྱ': 'a_rya',
    'ཨཱརྱཱ': 'a_rya',
    'པདྨཱནྟ': 'pad_man_ta',
    'ཀྲྀཏ': 'krit ',
    'ཧྱ་གྲཱྀ་ཝ': 'ha_ya gri_wa',
    'བིགྷྣཱན': 'bi_gha_nen',
    'ཧ་ན་ཧ་ན་': 'hana hana',
    'ཕཊ྄': 'phet',
    'ཕཊ': 'phet',
    'མཉྫུ་གྷོ་ཥ': 'man_ju_go_sha',
    'དྷརྨཱ་ཎཾ': 'dhar_ma nam',
    'ཨ་ཀཱ་རོ': 'a_ka_ro',
    'ཨཱདྱ་ནུཏྤནྣ': 'adi anütpena',
    'ཏོཏྟ': 'to_ta',
    'ཏུཏྟཱ': 'tut_ta',
    'ཏུཏྟཱ་ར': 'tut_ta_ra',
    'རསྟུ': 'ར_sཏུ',
    'བཻ་ཌཱུརྻ': 'ben_du_rya',
    'སེངྒེ': 'སེང་སྒེ',
    'བྷནྡྷ': 'bhan_dha',
    'ས་དྷཱུ་': 'sa_dhཨུ',
    'རཀ': 'rak',
    'བྷ་ལིཾ་ཏ': 'ba_ling_ta',
    'དེ་བཱི': 'dé_vi',
    'ཤྭ་ན': 'ཤོ་ན',
    'ནཱ་གརྫུ་ན': 'na_gar_ju_na'
  };

  var t$1;
  const normalize = function (exceptions) {
    return _(exceptions).inject((hash, value, key) => {
      if (key.trim().length) {
        var normalizedKey = removeMuteCharsAndNormalize(key);
        var normalizedValue = removeMuteCharsAndNormalize(value);
        if (normalizedKey != normalizedValue) hash[normalizedKey] = value;
      }
      return hash;
    }, {});
  };
  var generalExceptions = normalize(defaultGeneralExceptions);
  var Exceptions = function (setting, converter, rulesUsed, exceptionsUsed) {
    t$1 = function (key) {
      let track = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var value = setting.rules[key];
      if (track) rulesUsed[key] = value;
      return value;
    };
    return {
      setting: setting,
      converter: converter,
      exceptionsUsed: exceptionsUsed,
      generalExceptions: generalExceptions,
      exceptions: _(_.clone(setting.exceptions)).defaults(generalExceptions),
      find(tibetan) {
        var exception;
        var phonetics;
        var spaceAfter = false;
        var modifiers = ['འོ', 'འི', 'ས', 'ར'];
        var modifier = undefined;
        var i = 0;
        while (!exception && i < modifiers.length) {
          var tibetanWithModifier = tibetan.match(new RegExp(`(.*)${modifiers[i]}$`));
          if (tibetanWithModifier) {
            var tibetanWithoutModifier = tibetanWithModifier[1];
            exception = this.tryException(tibetanWithoutModifier);
            if (exception) modifier = modifiers[i];
          }
          i++;
        }
        if (!exception) exception = this.tryException(tibetan);
        if (exception) {
          if (modifier) {
            if (modifier.match(/(འི|ས)/)) {
              if (exception.last() == 'a') exception = exception.to(-1) + t$1('drengbu');else if (exception.last() == 'o') exception = exception.to(-1) + t$1('ö');else if (exception.last() == 'u') exception = exception.to(-1) + t$1('ü');else if (!exception.last().match(/[ieéè]/)) exception += modifier;
            } else if (modifier == 'ར') {
              if (exception.last().match(/[eéè]/)) exception = exception.to(-1) + 'er';else if (exception.last().match(/[aiou]/)) exception += 'r';else exception += modifier;
            } else if (modifier == 'འོ') {
              exception = exception + t$1('endLinkChar') + t$1('o');
            } else exception += modifier;
          }
          phonetics = this.convertTibetanParts(exception);
          phonetics = this.removeDuplicateEndingLetters(phonetics);
          spaceAfter = phonetics.last() == ' ';
          var numberOfSyllables = 1;
          var tsheks = tibetan.match(/་/g);
          var syllableMarkers = phonetics.trim().match(/[_ ]/g);
          if (syllableMarkers) numberOfSyllables = syllableMarkers.length + 1;
          return {
            spaceAfter: spaceAfter,
            numberOfSyllables: numberOfSyllables,
            numberOfShifts: tsheks ? tsheks.length : 0,
            converted: phonetics.trim().replace(/_/g, '')
          };
        }
      },
      tryException(key) {
        var exception = this.exceptions[key];
        if (exception) {
          this.exceptionsUsed[key] = exception;
          return exception;
        }
      },
      removeDuplicateEndingLetters(text) {
        return text.replace(/(.?)\1*$/, '$1');
      },
      convertTibetanParts(text) {
        var nonTibetanChars = new RegExp(/[\-\_\' a-zA-ZⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯBⒷＢḂḄḆɃƂƁCⒸＣĆĈĊČÇḈƇȻꜾDⒹＤḊĎḌḐḒḎĐƋƊƉꝹEⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎFⒻＦḞƑꝻGⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾHⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍIⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗJⒿＪĴɈKⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢLⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀMⓂＭḾṀṂⱮƜNⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤOⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌPⓅＰṔṖƤⱣꝐꝒꝔQⓆＱꝖꝘɊRⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂSⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄTⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆUⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄVⓋＶṼṾƲꝞɅWⓌＷẀẂŴẆẄẈⱲXⓍＸẊẌYⓎＹỲÝŶỸȲẎŸỶỴƳɎỾZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢaⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐbⓑｂḃḅḇƀƃɓcⓒｃćĉċčçḉƈȼꜿↄdⓓｄḋďḍḑḓḏđƌɖɗꝺeⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝfⓕｆḟƒꝼgⓖｇǵĝḡğġǧģǥɠꞡᵹꝿhⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥiⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨıjⓙｊĵǰɉkⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣlⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇmⓜｍḿṁṃɱɯnⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥoⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵpⓟｐṕṗƥᵽꝑꝓꝕqⓠｑɋꝗꝙrⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃsⓢｓśṥŝṡšṧṣṩșşȿꞩꞅẛtⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇuⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉvⓥｖṽṿʋꝟʌwⓦｗẁẃŵẇẅẘẉⱳxⓧｘẋẍyⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿzⓩｚźẑżžẓẕƶȥɀⱬꝣǼǢꜺǄǅǽǣꜻǆ]+/);
        var nonTibetanPart = text.match(nonTibetanChars);
        if (nonTibetanPart) {
          var result = this.tr(text.slice(0, nonTibetanPart.index)) + nonTibetanPart[0];
          var rest = text.slice(nonTibetanPart.index + nonTibetanPart[0].length);
          if (rest) return result + this.convertTibetanParts(rest);else return result;
        } else return this.tr(text);
      },
      tr(word) {
        if (!word) return '';
        var tsheks = word.match(/་/);
        return this.converter.convert(word).replace(/ /g, '') + ''.pad(tsheks ? tsheks.length : 0, '_');
      }
    };
  };
  Exceptions.normalize = normalize;
  Exceptions.reinitializeFromDefaults = function () {
    Exceptions.generalExceptions = Exceptions.normalize(defaultGeneralExceptions);
  };
  Exceptions.generalExceptionsAsArray = function () {
    return _(Exceptions.generalExceptions).map(function (value, key) {
      return {
        key: key,
        value: value
      };
    });
  };
  Exceptions.updateGeneralExceptions = function (exceptions, callback) {
    var normalizedExceptions = Exceptions.normalize(exceptions);
    Exceptions.generalExceptions = normalizedExceptions;
    Storage.set('general-exceptions', normalizedExceptions, value => {
      if (callback) callback(value);
    });
  };
  Exceptions.resetGeneralExceptions = function (callback) {
    this.updateGeneralExceptions(defaultGeneralExceptions, callback);
  };

  const TibetanSyllableParser = function (syllable, options = {}) {
    var normalizedSyllable = syllable.replace(/ཱུ/g, 'ཱུ').replace(/ཱི/g, 'ཱི').replace(/ཱྀ/g, 'ཱྀ');
    return {
      options: _(options).defaults({
        keepMainAsSuperscribed: false
      }),
      prefix: undefined,
      suffix: undefined,
      secondSuffix: undefined,
      syllable: normalizedSyllable,
      aKikuI: false,
      completionU: false,
      // Returns the syllable without either wasur, achung, anusvara, honorific or chego
      simplifiedSyllable: function () {
        return this.syllable.replace(/[ྭཱཾ༵ྃྂ༸]/g, '');
      },
      length: function () {
        return this.simplifiedSyllable().length;
      },
      at: function (element, delta, options = {}) {
        var index;
        var syllable = this.simplifiedSyllable();
        if (options.fromEnd) index = _(syllable).lastIndexOf(element);else index = _(syllable).indexOf(element);
        return index >= 0 ? syllable[index + delta] : undefined;
      },
      vowel: function () {
        var match = this.syllable.match(/[ིྀེཻོཽུ]/);
        return match ? match[0] : undefined;
      },
      superscribed: function () {
        var match = this.syllable.match(/[ྐྒྔྗྙྟྡྣྦྨྩྫྕྤྷ]/);
        return match ? this.at(match[0], -1) : undefined;
      },
      subscribed: function () {
        var match = this.syllable.match(/[ྱྲླ]/);
        return match ? match[0] : undefined;
      },
      figureOutPrefixAndSuffixes: function () {
        this.figureOutPrefix();
        this.figureOutSuffixes();
      },
      figureOutPrefix: function () {
        if (this.superscribed()) this.prefix = this.at(this.superscribed(), -1);else this.prefix = this.at(this.root, -1);
      },
      figureOutSuffixes: function () {
        if (this.vowel()) this.suffix = this.at(this.vowel(), 1);else if (this.subscribed()) this.suffix = this.at(this.subscribed(), 1);else this.suffix = this.at(this.root, 1);
        this.secondSuffix = this.at(this.suffix, 1, {
          fromEnd: true
        });
      },
      convertMainAsRegularChar: function () {
        switch (this.root) {
          case 'ྐ':
            this.root = 'ཀ';
            break;
          case 'ྒ':
            this.root = 'ག';
            break;
          case 'ྔ':
            this.root = 'ང';
            break;
          case 'ྗ':
            this.root = 'ཇ';
            break;
          case 'ྙ':
            this.root = 'ཉ';
            break;
          case 'ྟ':
            this.root = 'ཏ';
            break;
          case 'ྡ':
            this.root = 'ད';
            break;
          case 'ྣ':
            this.root = 'ན';
            break;
          case 'ྦ':
            this.root = 'བ';
            break;
          case 'ྨ':
            this.root = 'མ';
            break;
          case 'ྩ':
            this.root = 'ཙ';
            break;
          case 'ྫ':
            this.root = 'ཛ';
            break;
          case 'ྕ':
            this.root = 'ཅ';
            break;
          case 'ྤ':
            this.root = 'པ';
            break;
          case 'ྷ':
            this.root = 'ཧ';
            break;
        }
      },
      isAnExceptionNowHandled: function () {
        switch (this.syllable) {
          case 'དབ':
            this.prefix = 'ད';
            this.root = 'བ';
            return true;
          case 'དགས':
            this.prefix = 'ད';
            this.root = 'ག';
            this.suffix = 'ས';
            return true;
          case 'དྭགས':
            this.root = 'ད';
            this.suffix = 'ག';
            this.secondSuffix = 'ས';
            return true;
          case 'དམས':
            this.prefix = 'ད';
            this.root = 'མ';
            this.suffix = 'ས';
            return true;
          case 'འགས':
            this.prefix = 'འ';
            this.root = 'ག';
            this.suffix = 'ས';
            return true;
          case 'མངས':
            this.prefix = 'མ';
            this.root = 'ང';
            this.suffix = 'ས';
            return true;
          default:
            return false;
        }
      },
      returnObject: function () {
        return {
          prefix: this.prefix,
          superscribed: this.superscribed(),
          root: this.root,
          subscribed: this.subscribed(),
          vowel: this.vowel(),
          suffix: this.suffix,
          secondSuffix: this.secondSuffix,
          wasur: this.wasur(),
          achung: this.achung(),
          anusvara: this.anusvara(),
          honorificMarker: this.honorificMarker(),
          chego: this.chego()
        };
      },
      secondLetterIsGaNgaBaMa: function () {
        return this.syllable[1].match(/[གངབམ]/);
      },
      handleDreldraAi: function () {
        if (this.length() > 2 && this.syllable.match(/འི$/)) {
          if (this.length() <= 3) this.syllable = this.syllable.replace(/འི$/, '');else this.syllable = this.syllable.replace(/འི$/, 'འ');
          this.aKikuI = true;
        }
      },
      handleEndingO: function () {
        if (this.length() > 2 && this.syllable.match(/འོ$/)) {
          this.syllable = this.syllable.replace(/འོ$/, 'འ');
          this.completionO = true;
        }
      },
      handleEndingU: function () {
        if (this.length() > 2 && this.syllable.match(/འུ$/)) {
          this.syllable = this.syllable.replace(/འུ$/, '');
          this.completionU = true;
        }
      },
      handleAndOrParticleAAng: function () {
        if (this.length() > 2 && this.syllable.match(/འང$/)) {
          this.syllable = this.syllable.replace(/འང$/, '');
          this.andOrParticleAAng = true;
        }
      },
      handleConcessiveParticleAAm: function () {
        if (this.length() > 2 && this.syllable.match(/འམ$/)) {
          this.syllable = this.syllable.replace(/འམ$/, '');
          this.concessiveParticleAAm = true;
        }
      },
      wasur: function () {
        var match = this.syllable.match('ྭ');
        if (match) return match[0];
      },
      achung: function () {
        var match = this.syllable.match(/[ཱྰ]/);
        if (match) return match[0];
      },
      anusvara: function () {
        var match = this.syllable.match(/[ཾྃྂ]/);
        if (match) return match[0];
      },
      honorificMarker: function () {
        var match = this.syllable.match('༵');
        if (match) return match[0];
      },
      chego: function () {
        var match = this.syllable.match('༸');
        if (match) return match[0];
      },
      parse: function () {
        if (this.isAnExceptionNowHandled()) return this.returnObject();
        this.handleDreldraAi();
        this.handleEndingU();
        this.handleEndingO();
        this.handleAndOrParticleAAng();
        this.handleConcessiveParticleAAm();
        if (this.length() == 1) this.root = _(this.simplifiedSyllable()).first();
        if (this.vowel()) this.root = this.at(this.vowel(), -1);
        if (this.wasur()) this.root = this.syllable[this.syllable.replace(/[ྲྱཱཾ༵ྃྂ]/g, '').indexOf(this.wasur()) - 1];else if (this.subscribed()) this.root = this.at(this.subscribed(), -1);else if (this.superscribed()) this.root = this.at(this.superscribed(), 1);
        if (!this.root) {
          if (this.length() == 2) {
            this.root = this.syllable[0];
            this.suffix = this.syllable[1];
          } else if (this.length() == 4) {
            this.prefix = this.syllable[0];
            this.root = this.syllable[1];
            this.suffix = this.syllable[2];
            this.secondSuffix = this.syllable[3];
          } else if (this.length() == 3) {
            if (!(_(this.syllable).last() == 'ས')) this.root = this.syllable[1];else if (!this.secondLetterIsGaNgaBaMa()) this.root = this.syllable[1];else if (this.secondLetterIsGaNgaBaMa()) this.root = this.syllable[0];else alert("There has been an error:\n\nThe syllable " + this.syllable + " could not be parsed.\n\nAre you sure it's correct?");
          }
        }
        this.figureOutPrefixAndSuffixes();
        if (this.aKikuI) this.suffix = 'འི';
        if (this.andOrParticleAAng) this.suffix = 'འང';
        if (this.concessiveParticleAAm) this.suffix = 'འམ';
        if (this.completionU) this.suffix = 'འུ';
        if (this.completionO) this.suffix = 'འོ';
        if (this.superscribed() && !this.options.keepMainAsSuperscribed) this.convertMainAsRegularChar();
        return this.returnObject();
      }
    };
  };

  var syllablesWithUnknownConsonant = [];
  var t, findException;
  const TibetanToPhonetics = function () {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var setting = assignValidSettingOrThrowException(options.setting);
    var rulesUsed = {};
    var exceptionsUsed = {};
    t = function (key) {
      let track = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var value = setting.rules[key];
      if (track) rulesUsed[key] = value;
      return value;
    };
    var converter = {
      setting: setting,
      options: options,
      rulesUsed: rulesUsed,
      exceptionsUsed: exceptionsUsed,
      resetRulesUsed() {
        this.rulesUsed = rulesUsed = {};
      },
      resetExceptionsUsed() {
        this.exceptionsUsed = exceptionsUsed = {};
      },
      convert: function (tibetan, options) {
        tibetan = removeMuteCharsAndNormalize(tibetan);
        tibetan = this.substituteWordsWith7AsCheGo(tibetan);
        tibetan = this.substituteNumbers(tibetan);
        var groups = this.splitBySpacesOrNumbers(tibetan);
        return groups.map((tibetanGroup, index) => {
          if (tibetanGroup.match(/^\d+$/)) return tibetanGroup;else {
            var group = new Group(tibetanGroup, rulesUsed).convert();
            if (options && options.capitalize || this.options.capitalize) group = group.capitalize();
            return group;
          }
        }).join(' ');
      },
      splitBySpacesOrNumbers(text) {
        return _(text.split(/(\d+)| /)).compact();
      },
      substituteNumbers(text) {
        _({
          '༠': '0',
          '༡': '1',
          '༢': '2',
          '༣': '3',
          '༤': '4',
          '༥': '5',
          '༦': '6',
          '༧': '7',
          '༨': '8',
          '༩': '9'
        }).each((arabic, tibetan) => {
          text = text.replace(new RegExp(tibetan, 'g'), arabic);
        });
        return text;
      },
      substituteWordsWith7AsCheGo(text) {
        return text.replace(/༧ཞབས/g, 'ཞབས').replace(/༧སྐྱབས/g, 'སྐྱབས');
      }
    };
    var exceptions = new Exceptions(setting, converter, rulesUsed, exceptionsUsed);
    findException = text => exceptions.find(text);
    return converter;
  };
  var Group = function (tibetan, rulesUsed) {
    return {
      tibetan: tibetan,
      group: '',
      convert: function () {
        var syllable;
        this.syllables = _.compact(tibetan.trim().split('་'));
        this.groupNumberOfSyllables = this.syllables.length;
        while (syllable = this.syllables.shift()) {
          var exception = this.findLongestException(syllable, this.syllables);
          if (exception) {
            this.group += exception.converted;
            if (exception.numberOfSyllables == 1) {
              if (exception.spaceAfter) this.group += ' ';
              this.handleSecondSyllable();
            } else this.group += ' ';
            this.shiftSyllables(exception.numberOfShifts);
          } else {
            if (this.isLastSyllableAndStartsWithBa(syllable)) this.group += this.BaAsWaWhenSecondSyllable(syllable);else {
              var firstSyllableConverted = new Syllable(syllable).convert();
              if (this.handleSecondSyllable(firstSyllableConverted, syllable)) ;else this.group += firstSyllableConverted;
            }
          }
        }
        return this.group.trim();
      },
      handleSecondSyllable: function (firstSyllableConverted, firstSyllableTibetan) {
        var secondSyllable = this.syllables.shift();
        if (secondSyllable) {
          var secondSyllableConverted;
          var secondException = this.findLongestException(secondSyllable, this.syllables);
          if (secondException) {
            this.shiftSyllables(secondException.numberOfShifts);
            secondSyllableConverted = secondException.converted;
          } else {
            var BaAsWaSyllableConverted;
            if (BaAsWaSyllableConverted = this.BaAsWaWhenSecondSyllable(secondSyllable)) secondSyllableConverted = BaAsWaSyllableConverted;else secondSyllableConverted = new Syllable(secondSyllable).convert();
          }
          if (firstSyllableConverted) {
            if (this.AngOrAm(firstSyllableTibetan) || new Syllable(firstSyllableTibetan).endingO()) {
              this.group += firstSyllableConverted + ' ';
              // Because *-am is two syllables, we add back the second syllable
              // to the array and return so that it gets processed as the first
              // syllable of the next pair.
              this.syllables.unshift(secondSyllable);
              return true;
            }
            firstSyllableConverted = this.connectWithDashIfNecessaryForReadability(firstSyllableConverted, secondSyllableConverted);
            firstSyllableConverted = this.handleDuplicateConnectingLetters(firstSyllableConverted, secondSyllableConverted);
            firstSyllableConverted = this.handleDoubleS(firstSyllableConverted, secondSyllableConverted);
            this.group += firstSyllableConverted;
          }
          this.group += secondSyllableConverted + ' ';
          return true;
        }
      },
      findLongestException: function (syllable) {
        var restOfSyllables = this.syllables;
        if (!restOfSyllables.length) return findException(syllable);else {
          var exception;
          for (var index = restOfSyllables.length; index >= 0; index--) {
            var subset = [syllable].concat(restOfSyllables.slice(0, index));
            if (!exception) exception = findException(subset.join('་'));
          }
          return exception;
        }
      },
      isLastSyllableAndStartsWithBa(syllable) {
        if (this.groupNumberOfSyllables > 1 && this.syllables.length == 0) return this.BaAsWaWhenSecondSyllable(syllable);
      },
      BaAsWaWhenSecondSyllable(syllable) {
        if (syllable == 'བ') return t('baAsWa') + t('a');else if (syllable == 'བར') return t('baAsWa') + t('a') + t('raSuffix');else if (syllable == 'བས') return t('baAsWa') + t('drengbu');else if (syllable == 'བའི') return t('baAsWa') + t('aKikuI');else if (syllable == 'བའོ') return t('baAsWa') + t('a') + t('endLinkChar') + t('o');else if (syllable == 'བོ') return t('baAsWa') + t('o');else if (syllable == 'བོར') return t('baAsWa') + t('o') + t('raSuffix');else if (syllable == 'བོས') return t('baAsWa') + t('ö');else if (syllable == 'བོའི') return t('baAsWa') + t('ö');else if (syllable == 'བའམ') return t('baAsWa') + t('a') + t('endLinkChar') + t('a') + t('maSuffix');else if (syllable == 'བའང') return t('baAsWa') + t('a') + t('endLinkChar') + t('a') + t('ngaSuffix');
      },
      AngOrAm(tibetan) {
        return tibetan.match(/.+འ[ངམ]$/);
      },
      connectWithDashIfNecessaryForReadability: function (firstSyllable, secondSyllable) {
        var twoVowels = this.endsWithVowel(firstSyllable) && this.startsWithVowel(secondSyllable);
        var aFollowedByN = firstSyllable.last() == 'a' && secondSyllable.first() == 'n';
        var oFollowedByN = firstSyllable.last() == 'o' && secondSyllable.first() == 'n';
        var gFollowedByN = firstSyllable.last() == 'g' && secondSyllable.first() == 'n';
        if (twoVowels || aFollowedByN || oFollowedByN || gFollowedByN) return firstSyllable + '-';else return firstSyllable;
      },
      handleDuplicateConnectingLetters: function (firstSyllable, secondSyllable) {
        var sameLetter = firstSyllable.last() == secondSyllable.first();
        var endEqualsStartRule = t('endEqualsStart', false);
        if (sameLetter) {
          rulesUsed['endEqualsStart'] = true;
          if (endEqualsStartRule == 'dash') return firstSyllable + '-';else if (endEqualsStartRule == 'space') return firstSyllable + ' ';else if (endEqualsStartRule == 'merge') return firstSyllable.slice(0, firstSyllable.length - 1);
        }
        return firstSyllable;
      },
      handleDoubleS: function (firstSyllable, secondSyllable) {
        if (t('doubleS', false) && this.endsWithVowel(firstSyllable) && secondSyllable.match(/^s[^h]/)) {
          rulesUsed['doubleS'] = true;
          return firstSyllable + 's';
        } else return firstSyllable;
      },
      shiftSyllables: function (numberOfShifts) {
        var that = this;
        _(numberOfShifts).times(function () {
          that.syllables.shift();
        });
      },
      startsWithVowel: function (string) {
        return string.match(/^[eo]?[aeiouéiöü]/);
      },
      endsWithVowel: function (string) {
        return string.match(/[eo]?[aeiouéiöü]$/);
      }
    };
  };
  var Syllable = function (syllable) {
    var parsed = new TibetanSyllableParser(syllable).parse();
    var object = _.omit(parsed, _.functions(parsed));
    return _(object).extend({
      syllable: syllable,
      convert: function () {
        var consonant = this.consonant();
        if (consonant == undefined) {
          syllablesWithUnknownConsonant.push(syllable);
          return '࿗';
        }
        return consonant + this.getVowel() + this.getSuffix() + this.endingO() + this.endingU();
      },
      consonant: function () {
        if (this.lata()) {
          if (this.root == 'ཟ') return t('lataDa');else return t('lata');
        }
        if (this.daoWa()) {
          if (this.yata()) return t('daoWaYata');else if (this.vowel) return '';else return t('wa');
        }
        switch (this.root) {
          case 'ཀ':
            if (this.rata()) return t('rata1');else if (this.yata()) return t('kaYata');else return t('ka');
          case 'ག':
            if (this.superscribed || this.prefix) {
              if (this.rata()) return t('rata3Mod');else if (this.yata()) return t('gaModYata');else if (t('gaMod', false) == 'gu') {
                // Exceptions for french & spanish
                if (this.getVowel() == 'a') return 'g'; // 'gage' and not 'guage'
                else if (this.getVowel() == 'o') return 'g'; // 'gong' and not 'guong'
                else if (this.getVowel() == 'u') return 'g'; // 'guru' and not 'guuru'
                else if (this.getVowel() == 'ou') return 'g'; // 'gourou' and not 'guourou'
              }

              return t('gaMod');
            } else if (this.rata()) return t('rata3');else if (this.yata()) return t('gaYata');else return t('ga');
          case 'ཁ':
            if (this.rata()) return t("rata2");else if (this.yata()) return t('khaYata');else return t('kha');
          case 'ང':
            return t('nga');
          case 'ཅ':
            return t('ca');
          case 'ཆ':
            return t('cha');
          case 'ཇ':
            if (this.superscribed || this.prefix) return t('jaMod');else return t('ja');
          case 'ཉ':
            return t('nya');
          case 'ཏ':
          case 'ཊ':
            if (this.rata()) return t('rata1');else return t('ta');
          case 'ད':
            if (this.superscribed || this.prefix) {
              if (this.rata()) return t('rata3Mod');else return t('daMod');
            } else if (this.rata()) return t('rata3');else return t('da');
          case 'ཌ':
            // Experimental, default case based on པཎ་ཌི་ for pandita, check if other cases are correct and/or useful
            if (this.superscribed || this.prefix) {
              if (this.rata()) return t('rata3Mod');else return t('daMod');
            } else if (this.rata()) return t('rata3');else return t('daMod');
          case 'ཐ':
            if (this.rata()) return t('rata2');else return t('tha');
          case 'ན':
          case 'ཎ':
            return t('na');
          case 'པ':
            if (this.rata()) return t('rata1');else if (this.yata()) return t('paYata');else return t('pa');
          case 'ཕ':
            if (this.rata()) return t('rata2');else if (this.yata()) return t('phaYata');else return t('pha');
          case 'བ':
            if (this.superscribed || this.prefix) {
              if (this.rata()) return t('rata3Mod');else if (this.yata()) return t('baModYata');else return t('baMod');
            } else if (this.rata()) return t('rata3');else if (this.yata()) return t('baYata');else return t('ba');
          case 'མ':
            if (this.yata()) return t('nya');else return t('ma');
          case 'ཙ':
            return t('tsa');
          case 'ཚ':
            return t('tsha');
          case 'ཛ':
            return t('dza');
          case 'ཝ':
            return t('wa');
          case 'ཞ':
            return t('zha');
          case 'ཟ':
            if (this.superscribed || this.prefix) return t('zaMod');else return t('za');
          case 'འ':
            return '';
          case 'ཡ':
            return t('ya');
          case 'ར':
            return t('ra');
          case 'ལ':
            return t('la');
          case 'ཤ':
          case 'ཥ':
            return t('sha');
          case 'ས':
            return t('sa');
          case 'ཧ':
            if (this.superscribed == 'ལ') return t('lha');
            if (this.rata()) return t('hra');else return t('ha');
          case 'ཨ':
            return '';
        }
      },
      getVowel: function () {
        switch (this.vowel) {
          case 'ི':
            return t('i');
          case 'ེ':
          case 'ཻ':
            if (this.suffix && this.suffix.match(/[མནཎར]/)) return t('drengbuMaNaRa');else if (this.suffix && this.suffix.match(/[གབལང]/)) return t('drengbuGaBaLaNga');else return t('drengbu');
          case 'ུ':
            if (this.aKikuIOrSuffixIsLaSaDaNa()) return t('ü');else return t('u');
          case 'ོ':
          case 'ཽ':
            if (this.aKikuIOrSuffixIsLaSaDaNa()) return t('ö');else return t('o');
          default:
            if (this.aKikuI()) return t('aKikuI');else if (this.suffix && this.suffix.match(/[སད]/)) return t('drengbu');else if (this.suffix && this.suffix.match(/[ནཎ]/)) return t('aNa');else if (this.suffix && this.suffix == 'ལ') return t('aLa');else return t('a');
        }
      },
      getSuffix: function () {
        if (this.anusvara) if (this.root.match(/[ཧ]/)) return t('ngaSuffix');else return t('maSuffix');
        switch (this.suffix) {
          case 'ག':
            return t('kaSuffix');
          case 'ང':
            return t('ngaSuffix');
          case 'ན':
            return t('naSuffix');
          case 'ཎ':
            return t('naSuffix');
          case 'བ':
            return this.daoWa() ? '' : t('baSuffix');
          case 'མ':
            return t('maSuffix');
          case 'ར':
            return t('raSuffix');
          case 'ལ':
            return t('laSuffix');
          case 'འང':
            return t('endLinkChar') + t('a') + t('ngaSuffix');
          case 'འམ':
            return t('endLinkChar') + t('a') + t('maSuffix');
          default:
            return '';
        }
      },
      suffixIsSaDa: function () {
        return this.aKikuI() || this.suffix && this.suffix.match(/[སད]/);
      },
      aKikuIOrSuffixIsLaSaDaNa: function () {
        return this.aKikuI() || this.suffix && this.suffix.match(/[ལསདནཎ]/);
      },
      daoWa: function () {
        return this.syllable.match(/^དབ[ྱ]?[ིེོུ]?[ངསགརལདའབནམ]?[ིས]?$/);
      },
      aKikuI: function () {
        return this.syllable.match(/འི$/);
      },
      endingO: function () {
        return this.ifMatchesAppendEndingChar(/འོ$/, t('o', false));
      },
      endingU: function () {
        return this.ifMatchesAppendEndingChar(/འུ$/, t('u', false));
      },
      ifMatchesAppendEndingChar: function (regex, char) {
        return this.syllable.length > 2 && this.syllable.match(regex) ? t('endLinkChar') + char : '';
      },
      rata: function () {
        return this.subscribed == 'ྲ';
      },
      yata: function () {
        return this.subscribed == 'ྱ';
      },
      lata: function () {
        return this.subscribed == 'ླ';
      }
    });
  };
  const assignValidSettingOrThrowException = function (setting) {
    if (typeof setting == 'object') {
      if (typeof setting.rules == 'object' && typeof setting.exceptions == 'object') {
        _(setting.rules).defaults(baseRules);
        return setting;
      } else throwBadArgumentsError("You passed an object but it doesn't return " + "objects for 'rules' and 'exceptions'.");
    } else if (typeof setting == 'string') {
      var existingSetting = Settings.find(setting);
      if (existingSetting) return existingSetting;else throwBadArgumentsError("There is no existing setting matching id '" + setting + "'");
    } else if (setting) throwBadArgumentsError("You passed " + typeof setting);else return Settings.default();
  };
  const throwBadArgumentsError = function (passedMessage) {
    throw new TypeError("Invalid value for 'setting' option\n+" + "------------------------------------\n" + passedMessage + "\n" + "------------------------------------\n" + "The 'setting' option accepts either:\n" + "- the name of a existing setting\n" + "- a setting object itself\n" + "- any object that quacks like a setting, meaning it returns objects " + "for 'rules' and 'exceptions'\n");
  };

  exports.Exceptions = Exceptions;
  exports.Settings = Settings;
  exports.TibetanToPhonetics = TibetanToPhonetics;
  exports.baseRules = baseRules;
  exports.defaultGeneralExceptions = defaultGeneralExceptions;
  exports.defaultSettings = defaultSettings$1;
  exports.removeMuteCharsAndNormalize = removeMuteCharsAndNormalize;
  exports.syllablesWithUnknownConsonant = syllablesWithUnknownConsonant;

}));
//# sourceMappingURL=bundle.umd.js.map
