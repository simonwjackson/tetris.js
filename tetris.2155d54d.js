// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules\\parcel\\src\\builtins\\bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules\\parcel\\src\\builtins\\css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules\\parcel\\src\\builtins\\bundle-url.js"}],"src\\main.css":[function(require,module,exports) {

var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules\\parcel\\src\\builtins\\css-loader.js"}],"src\\utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Refactor as reducer
var createMatrix = exports.createMatrix = function createMatrix(w, h) {
  var matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
};

var rand = exports.rand = function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};
},{}],"src\\core.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createPiece = exports.createPiece = function createPiece(type) {
  switch (type) {
    case "O":
      return [[1, 1], [1, 1]];
      break;

    case "Z":
      return [[2, 2, 0], [0, 2, 2], [0, 0, 0]];
      break;

    case "S":
      return [[0, 3, 3], [3, 3, 0], [0, 0, 0]];
      break;

    case "J":
      return [[0, 1, 0], [0, 1, 0], [1, 1, 0]];
      break;

    case "L":
      return [[0, 2, 0], [0, 2, 0], [0, 2, 2]];
      break;

    case "I":
      return [[0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0], [0, 2, 0, 0]];
      break;

    case "T":
      return [[0, 0, 0], [3, 3, 3], [0, 3, 0]];
      break;
  }
};

var hasCollision = exports.hasCollision = function hasCollision(arena, player) {
  var m = player.matrix;
  var o = player.pos;

  return m.some(function (yVal, yIdx) {
    return yVal.some(function (xVal, xIdx) {
      if (m[yIdx][xIdx] !== 0 && (arena[yIdx + o.y] && arena[yIdx + o.y][xIdx + o.x]) !== 0) {
        return true;
      }

      return false;
    });
  });
};
},{}],"src\\tetris.js":[function(require,module,exports) {
'use strict';

require('./main.css');

var _utils = require('./utils');

var _core = require('./core');

/* HOTFIX: Parcel full reload for canvas */
if (module.hot) {
  module.hot.dispose(function () {
    window.location.reload();
    throw 'whatever';
  });
}

var scale = 20;
var border = scale * .1;
var colors = [null, 'hsl(203, 100%, 67%)', 'hsl(226, 96%, 56%)', 'hsl(0, 0%, 99%)'];
var canvas = document.getElementById('tetris');
var context = canvas.getContext('2d');
var arena = (0, _utils.createMatrix)(10, 20);
var player = {
  pos: {
    x: 0,
    y: 0
  },
  matrix: null,
  score: 0
};

var dropCounter = 0;
var dropInterval = 1000;
var lastDraw = 0;

// context.scale(10, 10)

var arenaSweep = function arenaSweep() {
  var rowCount = 1;
  outer: for (var y = arena.length - 1; y > 0; --y) {
    for (var x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }

    var row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;

    player.score += rowCount * 10;
    rowCount *= 2;
  }
};

var merge = function merge(arena, player) {
  player.matrix.map(function (row, y) {
    row.map(function (value, x) {
      if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value;
    });
  });
};

var playerDrop = function playerDrop() {
  player.pos.y++;

  if ((0, _core.hasCollision)(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore(player.score);
    player.pos.y = 0;
  }

  dropCounter = 0;
};

var updateScore = function updateScore(score) {
  document.getElementById('score').innerHTML = score;
};

var draw = function draw(player) {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, { x: 0, y: 0 }); // Existing blocks
  drawMatrix(player.matrix, player.pos); // Current block
};

var update = function update(player) {
  var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var deltaTimeDraw = time - lastDraw;
  lastDraw = time;

  dropCounter += deltaTimeDraw;
  if (dropCounter > dropInterval) playerDrop();

  draw(player);
  requestAnimationFrame(update.bind(null, player));
};

var drawMatrix = function drawMatrix(matrix, offset) {
  matrix.map(function (row, y) {
    row.map(function (value, x) {
      if (value !== 0) {
        drawSquare(colors[value], x, y, offset, scale, border);
      }
    });
  });
};

var drawSquare = function drawSquare(color, x, y, offset, scale, border) {
  var squareSize = scale - border;
  var startX = (x + offset.x) * scale;
  var startY = (y + offset.y) * scale;
  context.fillStyle = color;
  context.fillRect(startX, startY, squareSize, squareSize);
  context.fillStyle = 'white';
  context.fillRect(startX, startY, 2, 2);
  context.fillRect(startX + 2, startY + 2, 2, 4);
  context.fillRect(startX + 2, startY + 2, 4, 2);

  if (color === 'hsl(0, 0%, 99%)') {
    context.strokeStyle = colors[1];
    context.lineWidth = 3;
    context.strokeRect(startX + 1, startY + 1, squareSize - 2, squareSize - 2);
  }
};

var move = function move(direction) {
  player.pos.x += direction;
  if ((0, _core.hasCollision)(arena, player)) player.pos.x -= direction;
};

var rotate = function rotate(matrix, direction) {
  for (var yIdx = 0; yIdx < matrix.length; ++yIdx) {
    for (var xIdx = 0; xIdx < yIdx; ++xIdx) {
      var _ref = [matrix[yIdx][xIdx], matrix[xIdx][yIdx]];
      matrix[xIdx][yIdx] = _ref[0];
      matrix[yIdx][xIdx] = _ref[1];
    }
  }

  if (direction > 0) matrix.map(function (r) {
    return r.reverse();
  });else matrix.reverse();
};

var playerRotate = function playerRotate(direction) {
  var pos = player.pos.x;
  var offset = 1;
  rotate(player.matrix, direction);

  while ((0, _core.hasCollision)(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
  // const { x: pos } = player.pos
  // let offset = 1
  // rotate(player.matrix, direction) 
  // console.table(hasCollision(arena, matrix))
  // while (hasCollision(arena, matrix)) {
  //   player.pos.x += offset
  //   offset = -(offset + (offset > 0 ? 1 : -1))
  //   if (offset > player.matrix[0].length) {
  //     rotate(player.matrix, -dir)
  //     player.pos.x = pos
  //     return
  //   }
  // }
};

var playerReset = function playerReset() {
  var pieces = 'ILJOTSZ';
  var num = (0, _utils.rand)(0, pieces.length - 1);
  var letter = pieces[num];

  player.matrix = (0, _core.createPiece)(letter);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

  // Clear Screen
  if ((0, _core.hasCollision)(arena, player)) {
    arena.map(function (row) {
      return row.fill(0);
    });
    player.score = 0;
    updateScore();
  }
};

var bindControls = function bindControls(player) {
  document.addEventListener('keydown', function (_ref2) {
    var key = _ref2.key;

    switch (key) {
      case "ArrowLeft":
        move(-1);
        break;
      case "ArrowRight":
        move(1);
        break;
      case "ArrowDown":
        playerDrop();
        break;
      case "q":
        playerRotate(1);
        break;
      case "w":
        playerRotate(-1);
        break;
    }
  });
};

var init = function init() {
  bindControls(player);
  playerReset();
  updateScore(player.score);
};

init();
update(player);
},{"./main.css":"src\\main.css","./utils":"src\\utils.js","./core":"src\\core.js"}],"node_modules\\parcel\\src\\builtins\\hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '50032' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules\\parcel\\src\\builtins\\hmr-runtime.js","src\\tetris.js"], null)
//# sourceMappingURL=/tetris.2155d54d.map