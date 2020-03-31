(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.router = {}));
}(this, function (exports) { 'use strict';

    /**
     * Tokenize input string.
     */
    function lexer(str) {
        var tokens = [];
        var i = 0;
        while (i < str.length) {
            var char = str[i];
            if (char === "*" || char === "+" || char === "?") {
                tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
                continue;
            }
            if (char === "\\") {
                tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
                continue;
            }
            if (char === "{") {
                tokens.push({ type: "OPEN", index: i, value: str[i++] });
                continue;
            }
            if (char === "}") {
                tokens.push({ type: "CLOSE", index: i, value: str[i++] });
                continue;
            }
            if (char === ":") {
                var name = "";
                var j = i + 1;
                while (j < str.length) {
                    var code = str.charCodeAt(j);
                    if (
                    // `0-9`
                    (code >= 48 && code <= 57) ||
                        // `A-Z`
                        (code >= 65 && code <= 90) ||
                        // `a-z`
                        (code >= 97 && code <= 122) ||
                        // `_`
                        code === 95) {
                        name += str[j++];
                        continue;
                    }
                    break;
                }
                if (!name)
                    throw new TypeError("Missing parameter name at " + i);
                tokens.push({ type: "NAME", index: i, value: name });
                i = j;
                continue;
            }
            if (char === "(") {
                var count = 1;
                var pattern = "";
                var j = i + 1;
                if (str[j] === "?") {
                    throw new TypeError("Pattern cannot start with \"?\" at " + j);
                }
                while (j < str.length) {
                    if (str[j] === "\\") {
                        pattern += str[j++] + str[j++];
                        continue;
                    }
                    if (str[j] === ")") {
                        count--;
                        if (count === 0) {
                            j++;
                            break;
                        }
                    }
                    else if (str[j] === "(") {
                        count++;
                        if (str[j + 1] !== "?") {
                            throw new TypeError("Capturing groups are not allowed at " + j);
                        }
                    }
                    pattern += str[j++];
                }
                if (count)
                    throw new TypeError("Unbalanced pattern at " + i);
                if (!pattern)
                    throw new TypeError("Missing pattern at " + i);
                tokens.push({ type: "PATTERN", index: i, value: pattern });
                i = j;
                continue;
            }
            tokens.push({ type: "CHAR", index: i, value: str[i++] });
        }
        tokens.push({ type: "END", index: i, value: "" });
        return tokens;
    }
    /**
     * Parse a string for the raw tokens.
     */
    function parse(str, options) {
        if (options === void 0) { options = {}; }
        var tokens = lexer(str);
        var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
        var defaultPattern = "[^" + escapeString(options.delimiter || "/#?") + "]+?";
        var result = [];
        var key = 0;
        var i = 0;
        var path = "";
        var tryConsume = function (type) {
            if (i < tokens.length && tokens[i].type === type)
                return tokens[i++].value;
        };
        var mustConsume = function (type) {
            var value = tryConsume(type);
            if (value !== undefined)
                return value;
            var _a = tokens[i], nextType = _a.type, index = _a.index;
            throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
        };
        var consumeText = function () {
            var result = "";
            var value;
            // tslint:disable-next-line
            while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
                result += value;
            }
            return result;
        };
        while (i < tokens.length) {
            var char = tryConsume("CHAR");
            var name = tryConsume("NAME");
            var pattern = tryConsume("PATTERN");
            if (name || pattern) {
                var prefix = char || "";
                if (prefixes.indexOf(prefix) === -1) {
                    path += prefix;
                    prefix = "";
                }
                if (path) {
                    result.push(path);
                    path = "";
                }
                result.push({
                    name: name || key++,
                    prefix: prefix,
                    suffix: "",
                    pattern: pattern || defaultPattern,
                    modifier: tryConsume("MODIFIER") || ""
                });
                continue;
            }
            var value = char || tryConsume("ESCAPED_CHAR");
            if (value) {
                path += value;
                continue;
            }
            if (path) {
                result.push(path);
                path = "";
            }
            var open = tryConsume("OPEN");
            if (open) {
                var prefix = consumeText();
                var name_1 = tryConsume("NAME") || "";
                var pattern_1 = tryConsume("PATTERN") || "";
                var suffix = consumeText();
                mustConsume("CLOSE");
                result.push({
                    name: name_1 || (pattern_1 ? key++ : ""),
                    pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                    prefix: prefix,
                    suffix: suffix,
                    modifier: tryConsume("MODIFIER") || ""
                });
                continue;
            }
            mustConsume("END");
        }
        return result;
    }
    /**
     * Compile a string to a template function for the path.
     */
    function compile(str, options) {
        return tokensToFunction(parse(str, options), options);
    }
    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction(tokens, options) {
        if (options === void 0) { options = {}; }
        var reFlags = flags(options);
        var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
        // Compile all the tokens into regexps.
        var matches = tokens.map(function (token) {
            if (typeof token === "object") {
                return new RegExp("^(?:" + token.pattern + ")$", reFlags);
            }
        });
        return function (data) {
            var path = "";
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i];
                if (typeof token === "string") {
                    path += token;
                    continue;
                }
                var value = data ? data[token.name] : undefined;
                var optional = token.modifier === "?" || token.modifier === "*";
                var repeat = token.modifier === "*" || token.modifier === "+";
                if (Array.isArray(value)) {
                    if (!repeat) {
                        throw new TypeError("Expected \"" + token.name + "\" to not repeat, but got an array");
                    }
                    if (value.length === 0) {
                        if (optional)
                            continue;
                        throw new TypeError("Expected \"" + token.name + "\" to not be empty");
                    }
                    for (var j = 0; j < value.length; j++) {
                        var segment = encode(value[j], token);
                        if (validate && !matches[i].test(segment)) {
                            throw new TypeError("Expected all \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
                        }
                        path += token.prefix + segment + token.suffix;
                    }
                    continue;
                }
                if (typeof value === "string" || typeof value === "number") {
                    var segment = encode(String(value), token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
                    }
                    path += token.prefix + segment + token.suffix;
                    continue;
                }
                if (optional)
                    continue;
                var typeOfMessage = repeat ? "an array" : "a string";
                throw new TypeError("Expected \"" + token.name + "\" to be " + typeOfMessage);
            }
            return path;
        };
    }
    /**
     * Create path match function from `path-to-regexp` spec.
     */
    function match(str, options) {
        var keys = [];
        var re = pathToRegexp(str, keys, options);
        return regexpToFunction(re, keys, options);
    }
    /**
     * Create a path match function from `path-to-regexp` output.
     */
    function regexpToFunction(re, keys, options) {
        if (options === void 0) { options = {}; }
        var _a = options.decode, decode = _a === void 0 ? function (x) { return x; } : _a;
        return function (pathname) {
            var m = re.exec(pathname);
            if (!m)
                return false;
            var path = m[0], index = m.index;
            var params = Object.create(null);
            var _loop_1 = function (i) {
                // tslint:disable-next-line
                if (m[i] === undefined)
                    return "continue";
                var key = keys[i - 1];
                if (key.modifier === "*" || key.modifier === "+") {
                    params[key.name] = m[i].split(key.prefix + key.suffix).map(function (value) {
                        return decode(value, key);
                    });
                }
                else {
                    params[key.name] = decode(m[i], key);
                }
            };
            for (var i = 1; i < m.length; i++) {
                _loop_1(i);
            }
            return { path: path, index: index, params: params };
        };
    }
    /**
     * Escape a regular expression string.
     */
    function escapeString(str) {
        return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    }
    /**
     * Get the flags for a regexp from the options.
     */
    function flags(options) {
        return options && options.sensitive ? "" : "i";
    }
    /**
     * Pull out keys from a regexp.
     */
    function regexpToRegexp(path, keys) {
        if (!keys)
            return path;
        // Use a negative lookahead to match only capturing groups.
        var groups = path.source.match(/\((?!\?)/g);
        if (groups) {
            for (var i = 0; i < groups.length; i++) {
                keys.push({
                    name: i,
                    prefix: "",
                    suffix: "",
                    modifier: "",
                    pattern: ""
                });
            }
        }
        return path;
    }
    /**
     * Transform an array into a regexp.
     */
    function arrayToRegexp(paths, keys, options) {
        var parts = paths.map(function (path) { return pathToRegexp(path, keys, options).source; });
        return new RegExp("(?:" + parts.join("|") + ")", flags(options));
    }
    /**
     * Create a path regexp from string input.
     */
    function stringToRegexp(path, keys, options) {
        return tokensToRegexp(parse(path, options), keys, options);
    }
    /**
     * Expose a function for taking tokens and returning a RegExp.
     */
    function tokensToRegexp(tokens, keys, options) {
        if (options === void 0) { options = {}; }
        var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function (x) { return x; } : _d;
        var endsWith = "[" + escapeString(options.endsWith || "") + "]|$";
        var delimiter = "[" + escapeString(options.delimiter || "/#?") + "]";
        var route = start ? "^" : "";
        // Iterate over the tokens and create our regexp string.
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            if (typeof token === "string") {
                route += escapeString(encode(token));
            }
            else {
                var prefix = escapeString(encode(token.prefix));
                var suffix = escapeString(encode(token.suffix));
                if (token.pattern) {
                    if (keys)
                        keys.push(token);
                    if (prefix || suffix) {
                        if (token.modifier === "+" || token.modifier === "*") {
                            var mod = token.modifier === "*" ? "?" : "";
                            route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
                        }
                        else {
                            route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
                        }
                    }
                    else {
                        route += "(" + token.pattern + ")" + token.modifier;
                    }
                }
                else {
                    route += "(?:" + prefix + suffix + ")" + token.modifier;
                }
            }
        }
        if (end) {
            if (!strict)
                route += delimiter + "?";
            route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
        }
        else {
            var endToken = tokens[tokens.length - 1];
            var isEndDelimited = typeof endToken === "string"
                ? delimiter.indexOf(endToken[endToken.length - 1]) > -1
                : // tslint:disable-next-line
                    endToken === undefined;
            if (!strict) {
                route += "(?:" + delimiter + "(?=" + endsWith + "))?";
            }
            if (!isEndDelimited) {
                route += "(?=" + delimiter + "|" + endsWith + ")";
            }
        }
        return new RegExp(route, flags(options));
    }
    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     */
    function pathToRegexp(path, keys, options) {
        if (path instanceof RegExp)
            return regexpToRegexp(path, keys);
        if (Array.isArray(path))
            return arrayToRegexp(path, keys, options);
        return stringToRegexp(path, keys, options);
    }

    var dist_es2015 = /*#__PURE__*/Object.freeze({
        parse: parse,
        compile: compile,
        tokensToFunction: tokensToFunction,
        match: match,
        regexpToFunction: regexpToFunction,
        tokensToRegexp: tokensToRegexp,
        pathToRegexp: pathToRegexp
    });

    const { match: match$1 } = dist_es2015;
    const noop$1 = function() {};

    function Route(path, callback) {
      this.path = path;
      this._match = match$1(path);
      this._callback = callback || noop$1;
    }

    Route.prototype.match = function(path) {
      const matched = this._match(path);
      if (matched) {
        const { path, params } = matched;
        
        return {
          path,
          params,
          callback: this._callback
        }
      }

      return false;
    };

    var route = Route;

    function Router() {
      this.stack = [];
    }

    Router.prototype.route = function(path, callback) {
      const route$1 = new route(path, callback || noop);
      this.stack.push(route$1);
      return this;
    };

    Router.prototype.match = function(path) {
      let i, route, matched = false; 
      const stack = this.stack, len = stack.length;
      for (i = 0; i < len; i++) {
        route = stack[i];
        if (matched = route.match(path)) {
          break;
        }
      }
      return matched;
    };

    Router.prototype.update = function(path, location) {
      const matched = this.match(path);
      if (matched) {
        const { path, params, callback } = matched;
        const { search, hash } = location;
        callback({ path, params, search, hash });
      }
    };

    var router = Router;

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var history = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
       module.exports = factory() ;
    }(commonjsGlobal, (function () {
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            writable: true,
            configurable: true
          }
        });
        if (superClass) _setPrototypeOf(subClass, superClass);
      }

      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
        };
        return _getPrototypeOf(o);
      }

      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
        };

        return _setPrototypeOf(o, p);
      }

      function _isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === "function") return true;

        try {
          Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
          return true;
        } catch (e) {
          return false;
        }
      }

      function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null) return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;

        for (i = 0; i < sourceKeys.length; i++) {
          key = sourceKeys[i];
          if (excluded.indexOf(key) >= 0) continue;
          target[key] = source[key];
        }

        return target;
      }

      function _objectWithoutProperties(source, excluded) {
        if (source == null) return {};

        var target = _objectWithoutPropertiesLoose(source, excluded);

        var key, i;

        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

          for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
          }
        }

        return target;
      }

      function _assertThisInitialized(self) {
        if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return self;
      }

      function _possibleConstructorReturn(self, call) {
        if (call && (typeof call === "object" || typeof call === "function")) {
          return call;
        }

        return _assertThisInitialized(self);
      }

      function _createSuper(Derived) {
        return function () {
          var Super = _getPrototypeOf(Derived),
              result;

          if (_isNativeReflectConstruct()) {
            var NewTarget = _getPrototypeOf(this).constructor;

            result = Reflect.construct(Super, arguments, NewTarget);
          } else {
            result = Super.apply(this, arguments);
          }

          return _possibleConstructorReturn(this, result);
        };
      }

      var TransitionManager = /*#__PURE__*/function () {
        function TransitionManager() {
          _classCallCheck(this, TransitionManager);

          this.listeners = [];
        }

        _createClass(TransitionManager, [{
          key: "append",
          value: function append(fn) {
            var _this = this;

            var listeners = this.listeners;

            function listener() {
              fn.apply(void 0, arguments);
            }

            listeners.push(listener);
            return function () {
              _this.listeners = listeners.filter(function (item) {
                return item !== listener;
              });
            };
          }
        }, {
          key: "notify",
          value: function notify() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            this.listeners.forEach(function (listener) {
              return listener.apply(void 0, args);
            });
          }
        }, {
          key: "transitionTo",
          value: function transitionTo(location, callback) {
            callback(true);
          }
        }]);

        return TransitionManager;
      }();

      function parsePath(fragment) {
        var pathname = fragment || '/';
        var search = '';
        var hash = '';
        var hashIndex = pathname.indexOf('#');

        if (hashIndex !== -1) {
          hash = pathname.substr(hashIndex);
          pathname = pathname.substr(0, hashIndex);
        }

        var searchIndex = pathname.indexOf('?');

        if (searchIndex !== -1) {
          search = pathname.substr(searchIndex);
          pathname = pathname.substr(0, searchIndex);
        }

        return {
          pathname: pathname,
          search: search === '?' ? '' : search,
          hash: hash === '#' ? '' : hash
        };
      }
      function addLeadingSlash(path) {
        return path.charAt(0) === '/' ? path : '/' + path;
      }

      var BaseHistory = /*#__PURE__*/function () {
        function BaseHistory() {
          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          _classCallCheck(this, BaseHistory);

          this.options = options || {};
          this.transitionManager = new TransitionManager();
          this.location = window.location;
          this.history = window.history;
        }

        _createClass(BaseHistory, [{
          key: "subscribe",
          value: function subscribe(listener) {
            var self = this;
            var removeListener = this.transitionManager.append(listener);

            this._checkListener(1);

            return function unsubscribe() {
              removeListener();

              self._checkListener(-1);
            };
          }
        }, {
          key: "getLocation",
          value: function getLocation(fragment) {
            return parsePath(fragment);
          }
        }, {
          key: "go",
          value: function go(n) {
            return this.history.go(n);
          }
        }, {
          key: "forward",
          value: function forward() {
            return this.history.go(1);
          }
        }, {
          key: "back",
          value: function back() {
            return this.history.go(-1);
          }
        }]);

        return BaseHistory;
      }();

      var PopStateEvent = 'popstate';
      var BrowserHistory = /*#__PURE__*/function (_BaseHistory) {
        _inherits(BrowserHistory, _BaseHistory);

        var _super = _createSuper(BrowserHistory);

        function BrowserHistory(options) {
          var _this;

          _classCallCheck(this, BrowserHistory);

          _this = _super.call(this, options);
          _this.handlePopState = _this.handlePopState.bind(_assertThisInitialized(_this));
          return _this;
        }

        _createClass(BrowserHistory, [{
          key: "_checkListener",
          value: function _checkListener(delta) {
            var listeners = this.transitionManager.listeners;

            if (listeners.length === 1 && delta === 1) {
              window.addEventListener(PopStateEvent, this.handlePopState, false);
            } else if (listeners.length === 0) {
              window.removeEventListener(PopStateEvent, this.handlePopState, false);
            }
          }
        }, {
          key: "push",
          value: function push(fragment) {
            var _this2 = this;

            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var _options$replace = options.replace,
                replace = _options$replace === void 0 ? false : _options$replace;
            var url = fragment;
            var location = this.getLocation(fragment);
            this.transitionManager.transitionTo(null, function (ok) {
              _this2.history[replace ? 'replaceState' : 'pushState']({}, document.title, url);

              _this2.transitionManager.notify(location);
            });
          }
        }, {
          key: "handlePopState",
          value: function handlePopState() {
            var _this3 = this;

            var _window$location = window.location,
                pathname = _window$location.pathname,
                search = _window$location.search,
                hash = _window$location.hash;
            var fragment = pathname + search + hash;
            var location = this.getLocation(fragment);
            this.transitionManager.transitionTo(null, function (ok) {
              _this3.transitionTo.notify(location);
            });
          }
        }]);

        return BrowserHistory;
      }(BaseHistory);

      var HashChangeEvent = 'hashchange';
      var HashHistory = /*#__PURE__*/function (_BaseHistory) {
        _inherits(HashHistory, _BaseHistory);

        var _super = _createSuper(HashHistory);

        function HashHistory(options) {
          var _this;

          _classCallCheck(this, HashHistory);

          _this = _super.call(this, options);
          _this.handleHashChange = _this.handleHashChange.bind(_assertThisInitialized(_this));
          return _this;
        }

        _createClass(HashHistory, [{
          key: "_checkListener",
          value: function _checkListener(delta) {
            var listeners = this.transitionManager.listeners;

            if (listeners.length === 1 && delta === 1) {
              window.addEventListener(HashChangeEvent, this.handleHashChange, false);
            } else if (listeners.length === 0) {
              window.removeEventListener(HashChangeEvent, this.handleHashChange, false);
            }
          }
        }, {
          key: "push",
          value: function push(fragment) {
            var _this2 = this;

            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var _options$replace = options.replace,
                replace = _options$replace === void 0 ? false : _options$replace;
            this.transitionManager.transitionTo(null, function (ok) {
              if (replace) {
                var href = stripHash(location.href) + '#' + fragment;
                location.replace(href);
              } else {
                _this2.location.hash = fragment;
              }
            });
          }
        }, {
          key: "handleHashChange",
          value: function handleHashChange() {
            var _this3 = this;

            var fragment = addLeadingSlash(getHashPath());
            var location = this.getLocation(fragment);
            this.transitionManager.transitionTo(null, function (ok) {
              _this3.transitionManager.notify(location);
            });
          }
        }]);

        return HashHistory;
      }(BaseHistory);

      function stripHash(url) {
        var hashIndex = url.indexOf('#');
        return hashIndex === -1 ? url : url.slice(0, hashIndex);
      }

      function getHashPath() {
        // We can't use window.location.hash here because it's not
        // consistent across browsers - Firefox will pre-decode it!
        var href = window.location.href;
        var hashIndex = href.indexOf('#');
        return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
      }

      var createHistory = function createHistory(options) {
        var _options$mode = options.mode,
            mode = _options$mode === void 0 ? 'browser' : _options$mode,
            opts = _objectWithoutProperties(options, ["mode"]);

        var history;

        switch (mode) {
          case 'hash':
            history = new HashHistory(opts);
            break;

          case 'browser':
            history = new BrowserHistory(opts);
            break;
        }

        return history;
      };

      return createHistory;

    })));
    });

    function RouterDOM(options) {
      router.call(this, options);
      this.history = history({ mode: options.mode });
    }

    Object.setPrototypeOf(RouterDOM.prototype, router.prototype);

    RouterDOM.prototype.start = function() {
      return this.history.subscribe((location) => {
        const { pathname } = location;
        this.update(pathname, location);
      });
    };

    var routerDom = RouterDOM;

    var src = {
      Router: router,
      RouterDOM: routerDom
    };
    var src_1 = src.Router;
    var src_2 = src.RouterDOM;

    exports.Router = src_1;
    exports.RouterDOM = src_2;
    exports.default = src;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
