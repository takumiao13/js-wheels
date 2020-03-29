(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.createHistory = factory());
}(this, (function () { 'use strict';

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
