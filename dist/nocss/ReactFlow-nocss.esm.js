import * as React from 'react';
import React__default, { useState, useRef, useMemo, useEffect, memo, useCallback, createContext as createContext$1, forwardRef, useContext } from 'react';
import cc from 'classcat';
import shallow from 'zustand/shallow';
import create from 'zustand';
import createContext from 'zustand/context';
import { zoomIdentity, zoom } from 'd3-zoom';
import { select, pointer } from 'd3-selection';
import { DraggableCore } from 'react-draggable';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
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

var getDimensions = function getDimensions(node) {
  return {
    width: node.offsetWidth,
    height: node.offsetHeight
  };
};
var clamp = function clamp(val) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  return Math.min(Math.max(val, min), max);
};
var clampPosition = function clampPosition(position, extent) {
  return {
    x: clamp(position.x, extent[0][0], extent[1][0]),
    y: clamp(position.y, extent[0][1], extent[1][1])
  };
};
var getHostForElement = function getHostForElement(element) {
  var _element$getRootNode, _window;

  return ((_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element)) || ((_window = window) === null || _window === void 0 ? void 0 : _window.document);
};
var getBoundsOfBoxes = function getBoundsOfBoxes(box1, box2) {
  return {
    x: Math.min(box1.x, box2.x),
    y: Math.min(box1.y, box2.y),
    x2: Math.max(box1.x2, box2.x2),
    y2: Math.max(box1.y2, box2.y2)
  };
};
var rectToBox = function rectToBox(_ref) {
  var x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height;
  return {
    x: x,
    y: y,
    x2: x + width,
    y2: y + height
  };
};
var boxToRect = function boxToRect(_ref2) {
  var x = _ref2.x,
      y = _ref2.y,
      x2 = _ref2.x2,
      y2 = _ref2.y2;
  return {
    x: x,
    y: y,
    width: x2 - x,
    height: y2 - y
  };
};
var getBoundsofRects = function getBoundsofRects(rect1, rect2) {
  return boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));
};
var isNumeric = function isNumeric(n) {
  return !isNaN(n) && isFinite(n);
};

function ownKeys$i(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$i(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$i(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$i(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function handleParentExpand(res, updateItem) {
  var parent = res.find(function (e) {
    return e.id === updateItem.parentNode;
  });

  if (parent) {
    var extendWidth = updateItem.position.x + updateItem.width - parent.width;
    var extendHeight = updateItem.position.y + updateItem.height - parent.height;

    if (extendWidth > 0 || extendHeight > 0 || updateItem.position.x < 0 || updateItem.position.y < 0) {
      parent.style = _objectSpread$i({}, parent.style) || {};

      if (extendWidth > 0) {
        if (!parent.style.width) {
          parent.style.width = parent.width;
        }

        parent.style.width += extendWidth;
      }

      if (extendHeight > 0) {
        if (!parent.style.height) {
          parent.style.height = parent.height;
        }

        parent.style.height += extendHeight;
      }

      if (updateItem.position.x < 0) {
        var xDiff = Math.abs(updateItem.position.x);
        parent.position.x = parent.position.x - xDiff;
        parent.style.width += xDiff;
        updateItem.position.x = 0;
      }

      if (updateItem.position.y < 0) {
        var yDiff = Math.abs(updateItem.position.y);
        parent.position.y = parent.position.y - yDiff;
        parent.style.height += yDiff;
        updateItem.position.y = 0;
      }

      parent.width = parent.style.width;
      parent.height = parent.style.height;
    }
  }
}

function applyChanges(changes, elements) {
  var initElements = [];
  return elements.reduce(function (res, item) {
    var currentChange = changes.find(function (c) {
      return c.id === item.id;
    });

    if (currentChange) {
      switch (currentChange.type) {
        case 'select':
          {
            res.push(_objectSpread$i(_objectSpread$i({}, item), {}, {
              selected: currentChange.selected
            }));
            return res;
          }

        case 'position':
          {
            var updateItem = _objectSpread$i({}, item);

            if (typeof currentChange.position !== 'undefined') {
              updateItem.position = currentChange.position;
            }

            if (typeof currentChange.dragging !== 'undefined') {
              updateItem.dragging = currentChange.dragging;
            }

            if (updateItem.expandParent) {
              handleParentExpand(res, updateItem);
            }

            res.push(updateItem);
            return res;
          }

        case 'dimensions':
          {
            var _updateItem = _objectSpread$i({}, item);

            if (typeof currentChange.dimensions !== 'undefined') {
              _updateItem.width = currentChange.dimensions.width;
              _updateItem.height = currentChange.dimensions.height;
            }

            if (_updateItem.expandParent) {
              handleParentExpand(res, _updateItem);
            }

            res.push(_updateItem);
            return res;
          }

        case 'remove':
          {
            return res;
          }
      }
    }

    res.push(item);
    return res;
  }, initElements);
}

function applyNodeChanges(changes, nodes) {
  return applyChanges(changes, nodes);
}
function applyEdgeChanges(changes, edges) {
  return applyChanges(changes, edges);
}
var createSelectionChange = function createSelectionChange(id, selected) {
  return {
    id: id,
    type: 'select',
    selected: selected
  };
};
function getSelectionChanges(items, selectedIds) {
  return items.reduce(function (res, item) {
    var willBeSelected = selectedIds.includes(item.id);

    if (!item.selected && willBeSelected) {
      item.selected = true;
      res.push(createSelectionChange(item.id, true));
    } else if (item.selected && !willBeSelected) {
      item.selected = false;
      res.push(createSelectionChange(item.id, false));
    }

    return res;
  }, []);
}

function ownKeys$h(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$h(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$h(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$h(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var getHandleBounds = function getHandleBounds(nodeElement, scale) {
  var bounds = nodeElement.getBoundingClientRect();
  return {
    source: getHandleBoundsByHandleType('.source', nodeElement, bounds, scale),
    target: getHandleBoundsByHandleType('.target', nodeElement, bounds, scale)
  };
};
var getHandleBoundsByHandleType = function getHandleBoundsByHandleType(selector, nodeElement, parentBounds, k) {
  var handles = nodeElement.querySelectorAll(selector);

  if (!handles || !handles.length) {
    return null;
  }

  var handlesArray = Array.from(handles);
  return handlesArray.map(function (handle) {
    var bounds = handle.getBoundingClientRect();
    var dimensions = getDimensions(handle);
    var handleId = handle.getAttribute('data-handleid');
    var handlePosition = handle.getAttribute('data-handlepos');
    return _objectSpread$h({
      id: handleId,
      position: handlePosition,
      x: (bounds.left - parentBounds.left) / k,
      y: (bounds.top - parentBounds.top) / k
    }, dimensions);
  });
};

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function ownKeys$g(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$g(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$g(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$g(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var isEdge = function isEdge(element) {
  return 'id' in element && 'source' in element && 'target' in element;
};
var isNode = function isNode(element) {
  return 'id' in element && !('source' in element) && !('target' in element);
};
var getOutgoers = function getOutgoers(node, nodes, edges) {
  if (!isNode(node)) {
    return [];
  }

  var outgoerIds = edges.filter(function (e) {
    return e.source === node.id;
  }).map(function (e) {
    return e.target;
  });
  return nodes.filter(function (n) {
    return outgoerIds.includes(n.id);
  });
};
var getIncomers = function getIncomers(node, nodes, edges) {
  if (!isNode(node)) {
    return [];
  }

  var incomersIds = edges.filter(function (e) {
    return e.target === node.id;
  }).map(function (e) {
    return e.source;
  });
  return nodes.filter(function (n) {
    return incomersIds.includes(n.id);
  });
};

var getEdgeId = function getEdgeId(_ref) {
  var source = _ref.source,
      sourceHandle = _ref.sourceHandle,
      target = _ref.target,
      targetHandle = _ref.targetHandle;
  return "reactflow__edge-".concat(source).concat(sourceHandle || '', "-").concat(target).concat(targetHandle || '');
};

var getMarkerId = function getMarkerId(marker) {
  if (typeof marker === 'undefined') {
    return '';
  }

  if (typeof marker === 'string') {
    return marker;
  }

  return Object.keys(marker).sort().map(function (key) {
    return "".concat(key, "=").concat(marker[key]);
  }).join('&');
};

var connectionExists = function connectionExists(edge, edges) {
  return edges.some(function (el) {
    return el.source === edge.source && el.target === edge.target && (el.sourceHandle === edge.sourceHandle || !el.sourceHandle && !edge.sourceHandle) && (el.targetHandle === edge.targetHandle || !el.targetHandle && !edge.targetHandle);
  });
};

var addEdge = function addEdge(edgeParams, edges) {
  if (!edgeParams.source || !edgeParams.target) {
    console.warn("Can't create edge. An edge needs a source and a target.");
    return edges;
  }

  var edge;

  if (isEdge(edgeParams)) {
    edge = _objectSpread$g({}, edgeParams);
  } else {
    edge = _objectSpread$g(_objectSpread$g({}, edgeParams), {}, {
      id: getEdgeId(edgeParams)
    });
  }

  if (connectionExists(edge, edges)) {
    return edges;
  }

  return edges.concat(edge);
};
var updateEdge = function updateEdge(oldEdge, newConnection, edges) {
  if (!newConnection.source || !newConnection.target) {
    console.warn("Can't create new edge. An edge needs a source and a target.");
    return edges;
  }

  var foundEdge = edges.find(function (e) {
    return e.id === oldEdge.id;
  });

  if (!foundEdge) {
    console.warn("The old edge with id=".concat(oldEdge.id, " does not exist."));
    return edges;
  } // Remove old edge and create the new edge with parameters of old edge.


  var edge = _objectSpread$g(_objectSpread$g({}, oldEdge), {}, {
    id: getEdgeId(newConnection),
    source: newConnection.source,
    target: newConnection.target,
    sourceHandle: newConnection.sourceHandle,
    targetHandle: newConnection.targetHandle
  });

  return edges.filter(function (e) {
    return e.id !== oldEdge.id;
  }).concat(edge);
};
var pointToRendererPoint = function pointToRendererPoint(_ref2, _ref3, snapToGrid, _ref4) {
  var x = _ref2.x,
      y = _ref2.y;

  var _ref5 = _slicedToArray(_ref3, 3),
      tx = _ref5[0],
      ty = _ref5[1],
      tScale = _ref5[2];

  var _ref6 = _slicedToArray(_ref4, 2),
      snapX = _ref6[0],
      snapY = _ref6[1];

  var position = {
    x: (x - tx) / tScale,
    y: (y - ty) / tScale
  };

  if (snapToGrid) {
    return {
      x: snapX * Math.round(position.x / snapX),
      y: snapY * Math.round(position.y / snapY)
    };
  }

  return position;
};
var getRectOfNodes = function getRectOfNodes(nodes) {
  var box = nodes.reduce(function (currBox, _ref7) {
    var positionAbsolute = _ref7.positionAbsolute,
        position = _ref7.position,
        width = _ref7.width,
        height = _ref7.height;
    return getBoundsOfBoxes(currBox, rectToBox({
      x: positionAbsolute ? positionAbsolute.x : position.x,
      y: positionAbsolute ? positionAbsolute.y : position.y,
      width: width || 0,
      height: height || 0
    }));
  }, {
    x: Infinity,
    y: Infinity,
    x2: -Infinity,
    y2: -Infinity
  });
  return boxToRect(box);
};
var getNodesInside = function getNodesInside(nodeInternals, rect) {
  var _ref8 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0, 1],
      _ref9 = _slicedToArray(_ref8, 3),
      tx = _ref9[0],
      ty = _ref9[1],
      tScale = _ref9[2];

  var partially = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var excludeNonSelectableNodes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var rBox = rectToBox({
    x: (rect.x - tx) / tScale,
    y: (rect.y - ty) / tScale,
    width: rect.width / tScale,
    height: rect.height / tScale
  });
  var visibleNodes = [];
  nodeInternals.forEach(function (node) {
    var positionAbsolute = node.positionAbsolute,
        width = node.width,
        height = node.height,
        dragging = node.dragging,
        _node$selectable = node.selectable,
        selectable = _node$selectable === void 0 ? true : _node$selectable;

    if (excludeNonSelectableNodes && !selectable) {
      return false;
    }

    var nBox = rectToBox(_objectSpread$g(_objectSpread$g({}, positionAbsolute), {}, {
      width: width || 0,
      height: height || 0
    }));
    var xOverlap = Math.max(0, Math.min(rBox.x2, nBox.x2) - Math.max(rBox.x, nBox.x));
    var yOverlap = Math.max(0, Math.min(rBox.y2, nBox.y2) - Math.max(rBox.y, nBox.y));
    var overlappingArea = Math.ceil(xOverlap * yOverlap);
    var notInitialized = typeof width === 'undefined' || typeof height === 'undefined' || width === null || height === null || dragging;
    var partiallyVisible = partially && overlappingArea > 0;
    var area = (width || 0) * (height || 0);
    var isVisible = notInitialized || partiallyVisible || overlappingArea >= area;

    if (isVisible) {
      visibleNodes.push(node);
    }
  });
  return visibleNodes;
};
var getConnectedEdges = function getConnectedEdges(nodes, edges) {
  var nodeIds = nodes.map(function (node) {
    return node.id;
  });
  return edges.filter(function (edge) {
    return nodeIds.includes(edge.source) || nodeIds.includes(edge.target);
  });
};
var getTransformForBounds = function getTransformForBounds(bounds, width, height, minZoom, maxZoom) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.1;
  var xZoom = width / (bounds.width * (1 + padding));
  var yZoom = height / (bounds.height * (1 + padding));
  var zoom = Math.min(xZoom, yZoom);
  var clampedZoom = clamp(zoom, minZoom, maxZoom);
  var boundsCenterX = bounds.x + bounds.width / 2;
  var boundsCenterY = bounds.y + bounds.height / 2;
  var x = width / 2 - boundsCenterX * clampedZoom;
  var y = height / 2 - boundsCenterY * clampedZoom;
  return [x, y, clampedZoom];
};
var getD3Transition = function getD3Transition(selection) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return selection.transition().duration(duration);
};

function ownKeys$f(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$f(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$f(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$f(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function calculateXYZPosition(node, nodeInternals, parentNodes, result) {
  var _result$x, _parentNode$position$, _parentNode$position, _result$y, _parentNode$position$2, _parentNode$position2, _parentNode$z, _node$z, _parentNode$z2, _node$z2;

  if (!node.parentNode) {
    return result;
  }

  var parentNode = nodeInternals.get(node.parentNode);
  return calculateXYZPosition(parentNode, nodeInternals, parentNodes, {
    x: ((_result$x = result.x) !== null && _result$x !== void 0 ? _result$x : 0) + ((_parentNode$position$ = (_parentNode$position = parentNode.position) === null || _parentNode$position === void 0 ? void 0 : _parentNode$position.x) !== null && _parentNode$position$ !== void 0 ? _parentNode$position$ : 0),
    y: ((_result$y = result.y) !== null && _result$y !== void 0 ? _result$y : 0) + ((_parentNode$position$2 = (_parentNode$position2 = parentNode.position) === null || _parentNode$position2 === void 0 ? void 0 : _parentNode$position2.y) !== null && _parentNode$position$2 !== void 0 ? _parentNode$position$2 : 0),
    z: ((_parentNode$z = parentNode.z) !== null && _parentNode$z !== void 0 ? _parentNode$z : 0) > ((_node$z = node.z) !== null && _node$z !== void 0 ? _node$z : 0) ? (_parentNode$z2 = parentNode.z) !== null && _parentNode$z2 !== void 0 ? _parentNode$z2 : 0 : (_node$z2 = node.z) !== null && _node$z2 !== void 0 ? _node$z2 : 0
  });
}

function createNodeInternals(nodes, nodeInternals) {
  var nextNodeInternals = new Map();
  var parentNodes = {};
  nodes.forEach(function (node) {
    var z = isNumeric(node.zIndex) ? node.zIndex : node.dragging || node.selected ? 1000 : 0;

    var internals = _objectSpread$f(_objectSpread$f(_objectSpread$f({}, nodeInternals.get(node.id)), node), {}, {
      positionAbsolute: {
        x: node.position.x,
        y: node.position.y
      },
      z: z
    });

    if (node.parentNode) {
      internals.parentNode = node.parentNode;
      parentNodes[node.parentNode] = true;
    }

    nextNodeInternals.set(node.id, internals);
  });
  nextNodeInternals.forEach(function (node) {
    if (node.parentNode && !nextNodeInternals.has(node.parentNode)) {
      throw new Error("Parent node ".concat(node.parentNode, " not found"));
    }

    if (node.parentNode || parentNodes[node.id]) {
      var _node$z3;

      var _calculateXYZPosition = calculateXYZPosition(node, nextNodeInternals, parentNodes, _objectSpread$f(_objectSpread$f({}, node.position), {}, {
        z: (_node$z3 = node.z) !== null && _node$z3 !== void 0 ? _node$z3 : 0
      })),
          x = _calculateXYZPosition.x,
          y = _calculateXYZPosition.y,
          z = _calculateXYZPosition.z;

      node.positionAbsolute = {
        x: x,
        y: y
      };
      node.z = z;

      if (parentNodes[node.id]) {
        node.isParent = true;
      }
    }
  });
  return nextNodeInternals;
}
function isParentSelected(node, nodeInternals) {
  if (!node.parentNode) {
    return false;
  }

  var parentNode = nodeInternals.get(node.parentNode);

  if (!parentNode) {
    return false;
  }

  if (parentNode.selected) {
    return true;
  }

  return isParentSelected(parentNode, nodeInternals);
}
function createPositionChange(_ref) {
  var node = _ref.node,
      diff = _ref.diff,
      dragging = _ref.dragging,
      nodeExtent = _ref.nodeExtent,
      nodeInternals = _ref.nodeInternals;
  var change = {
    id: node.id,
    type: 'position',
    dragging: !!dragging
  };

  if (diff) {
    var nextPosition = {
      x: node.position.x + diff.x,
      y: node.position.y + diff.y
    };
    var currentExtent = nodeExtent || node.extent;

    if (node.extent === 'parent' && node.parentNode && node.width && node.height) {
      var parent = nodeInternals.get(node.parentNode);
      currentExtent = parent !== null && parent !== void 0 && parent.width && parent !== null && parent !== void 0 && parent.height ? [[0, 0], [parent.width - node.width, parent.height - node.height]] : currentExtent;
    }

    change.position = currentExtent ? clampPosition(nextPosition, currentExtent) : nextPosition;
  }

  return change;
}
function fitView(get) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _get = get(),
      nodeInternals = _get.nodeInternals,
      width = _get.width,
      height = _get.height,
      minZoom = _get.minZoom,
      maxZoom = _get.maxZoom,
      d3Zoom = _get.d3Zoom,
      d3Selection = _get.d3Selection,
      fitViewOnInitDone = _get.fitViewOnInitDone,
      fitViewOnInit = _get.fitViewOnInit;

  if (options.initial && !fitViewOnInitDone && fitViewOnInit || !options.initial) {
    if (d3Zoom && d3Selection) {
      var nodes = Array.from(nodeInternals.values()).filter(function (n) {
        return options.includeHiddenNodes ? !n.parentNode && n.width && n.height : !n.parentNode && !n.hidden;
      });
      var nodesInitialized = nodes.every(function (n) {
        return n.width && n.height;
      });

      if (nodes.length > 0 && nodesInitialized) {
        var _options$minZoom, _options$maxZoom, _options$padding;

        var bounds = getRectOfNodes(nodes);

        var _getTransformForBound = getTransformForBounds(bounds, width, height, (_options$minZoom = options.minZoom) !== null && _options$minZoom !== void 0 ? _options$minZoom : minZoom, (_options$maxZoom = options.maxZoom) !== null && _options$maxZoom !== void 0 ? _options$maxZoom : maxZoom, (_options$padding = options.padding) !== null && _options$padding !== void 0 ? _options$padding : 0.1),
            _getTransformForBound2 = _slicedToArray(_getTransformForBound, 3),
            x = _getTransformForBound2[0],
            y = _getTransformForBound2[1],
            zoom = _getTransformForBound2[2];

        var nextTransform = zoomIdentity.translate(x, y).scale(zoom);

        if (typeof options.duration === 'number' && options.duration > 0) {
          d3Zoom.transform(getD3Transition(d3Selection, options.duration), nextTransform);
        } else {
          d3Zoom.transform(d3Selection, nextTransform);
        }

        return true;
      }
    }
  }

  return false;
}
function handleControlledNodeSelectionChange(nodeChanges, nodeInternals) {
  nodeChanges.forEach(function (change) {
    var node = nodeInternals.get(change.id);

    if (node) {
      nodeInternals.set(node.id, _objectSpread$f(_objectSpread$f({}, node), {}, {
        selected: change.selected
      }));
    }
  });
  return new Map(nodeInternals);
}
function handleControlledEdgeSelectionChange(edgeChanges, edges) {
  return edges.map(function (e) {
    var change = edgeChanges.find(function (change) {
      return change.id === e.id;
    });

    if (change) {
      e.selected = change.selected;
    }

    return e;
  });
}

var ConnectionMode;

(function (ConnectionMode) {
  ConnectionMode["Strict"] = "strict";
  ConnectionMode["Loose"] = "loose";
})(ConnectionMode || (ConnectionMode = {}));

var BackgroundVariant;

(function (BackgroundVariant) {
  BackgroundVariant["Lines"] = "lines";
  BackgroundVariant["Dots"] = "dots";
})(BackgroundVariant || (BackgroundVariant = {}));

var PanOnScrollMode;

(function (PanOnScrollMode) {
  PanOnScrollMode["Free"] = "free";
  PanOnScrollMode["Vertical"] = "vertical";
  PanOnScrollMode["Horizontal"] = "horizontal";
})(PanOnScrollMode || (PanOnScrollMode = {}));

var ConnectionLineType;

(function (ConnectionLineType) {
  ConnectionLineType["Bezier"] = "default";
  ConnectionLineType["Straight"] = "straight";
  ConnectionLineType["Step"] = "step";
  ConnectionLineType["SmoothStep"] = "smoothstep";
})(ConnectionLineType || (ConnectionLineType = {}));

var MarkerType;

(function (MarkerType) {
  MarkerType["Arrow"] = "arrow";
  MarkerType["ArrowClosed"] = "arrowclosed";
})(MarkerType || (MarkerType = {}));

var Position;

(function (Position) {
  Position["Left"] = "left";
  Position["Top"] = "top";
  Position["Right"] = "right";
  Position["Bottom"] = "bottom";
})(Position || (Position = {}));

var infiniteExtent = [[Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY], [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]];
var initialState = {
  width: 0,
  height: 0,
  transform: [0, 0, 1],
  nodeInternals: new Map(),
  edges: [],
  onNodesChange: null,
  onEdgesChange: null,
  hasDefaultNodes: false,
  hasDefaultEdges: false,
  selectedNodesBbox: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  d3Zoom: null,
  d3Selection: null,
  d3ZoomHandler: undefined,
  minZoom: 0.5,
  maxZoom: 2,
  translateExtent: infiniteExtent,
  nodeExtent: infiniteExtent,
  nodesSelectionActive: false,
  userSelectionActive: false,
  connectionNodeId: null,
  connectionHandleId: null,
  connectionHandleType: 'source',
  connectionPosition: {
    x: 0,
    y: 0
  },
  connectionMode: ConnectionMode.Strict,
  snapGrid: [15, 15],
  snapToGrid: false,
  nodesDraggable: true,
  nodesConnectable: true,
  elementsSelectable: true,
  fitViewOnInit: false,
  fitViewOnInitDone: false,
  fitViewOnInitOptions: undefined,
  multiSelectionActive: false,
  reactFlowVersion: "10.0.0-next.45" ,
  connectionStartHandle: null,
  connectOnClick: true
};

function ownKeys$e(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$e(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$e(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$e(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var _createContext = createContext(),
    Provider$1 = _createContext.Provider,
    useStore = _createContext.useStore,
    useStoreApi = _createContext.useStoreApi;

var createStore = function createStore() {
  return create(function (set, get) {
    return _objectSpread$e(_objectSpread$e({}, initialState), {}, {
      setNodes: function setNodes(nodes) {
        set({
          nodeInternals: createNodeInternals(nodes, get().nodeInternals)
        });
      },
      setEdges: function setEdges(edges) {
        var _get = get(),
            defaultEdgeOptions = _get.defaultEdgeOptions;

        if (defaultEdgeOptions) {
          set({
            edges: edges.map(function (e) {
              return _objectSpread$e(_objectSpread$e({}, defaultEdgeOptions), e);
            })
          });
        } else {
          set({
            edges: edges
          });
        }
      },
      setDefaultNodesAndEdges: function setDefaultNodesAndEdges(nodes, edges) {
        var hasDefaultNodes = typeof nodes !== 'undefined';
        var hasDefaultEdges = typeof edges !== 'undefined';
        var nodeInternals = hasDefaultNodes ? createNodeInternals(nodes, new Map()) : new Map();
        var nextEdges = hasDefaultEdges ? edges : [];
        set({
          nodeInternals: nodeInternals,
          edges: nextEdges,
          hasDefaultNodes: hasDefaultNodes,
          hasDefaultEdges: hasDefaultEdges
        });
      },
      updateNodeDimensions: function updateNodeDimensions(updates) {
        var _get2 = get(),
            onNodesChange = _get2.onNodesChange,
            transform = _get2.transform,
            nodeInternals = _get2.nodeInternals,
            fitViewOnInit = _get2.fitViewOnInit,
            fitViewOnInitDone = _get2.fitViewOnInitDone,
            fitViewOnInitOptions = _get2.fitViewOnInitOptions;

        var changes = updates.reduce(function (res, update) {
          var node = nodeInternals.get(update.id);

          if (node) {
            var dimensions = getDimensions(update.nodeElement);
            var doUpdate = !!(dimensions.width && dimensions.height && (node.width !== dimensions.width || node.height !== dimensions.height || update.forceUpdate));

            if (doUpdate) {
              var handleBounds = getHandleBounds(update.nodeElement, transform[2]);
              nodeInternals.set(node.id, _objectSpread$e(_objectSpread$e({}, node), {}, {
                handleBounds: handleBounds
              }, dimensions));
              res.push({
                id: node.id,
                type: 'dimensions',
                dimensions: dimensions
              });
            }
          }

          return res;
        }, []);
        var nextFitViewOnInitDone = fitViewOnInitDone || fitViewOnInit && !fitViewOnInitDone && fitView(get, _objectSpread$e({
          initial: true
        }, fitViewOnInitOptions));
        set({
          nodeInternals: new Map(nodeInternals),
          fitViewOnInitDone: nextFitViewOnInitDone
        });

        if ((changes === null || changes === void 0 ? void 0 : changes.length) > 0) {
          onNodesChange === null || onNodesChange === void 0 ? void 0 : onNodesChange(changes);
        }
      },
      updateNodePosition: function updateNodePosition(_ref) {
        var id = _ref.id,
            diff = _ref.diff,
            dragging = _ref.dragging;

        var _get3 = get(),
            onNodesChange = _get3.onNodesChange,
            nodeExtent = _get3.nodeExtent,
            nodeInternals = _get3.nodeInternals,
            hasDefaultNodes = _get3.hasDefaultNodes;

        if (hasDefaultNodes || onNodesChange) {
          var changes = [];
          nodeInternals.forEach(function (node) {
            if (node.selected) {
              if (!node.parentNode || !isParentSelected(node, nodeInternals)) {
                changes.push(createPositionChange({
                  node: node,
                  diff: diff,
                  dragging: dragging,
                  nodeExtent: nodeExtent,
                  nodeInternals: nodeInternals
                }));
              }
            } else if (node.id === id) {
              changes.push(createPositionChange({
                node: node,
                diff: diff,
                dragging: dragging,
                nodeExtent: nodeExtent,
                nodeInternals: nodeInternals
              }));
            }
          });

          if (changes !== null && changes !== void 0 && changes.length) {
            if (hasDefaultNodes) {
              var nodes = applyNodeChanges(changes, Array.from(nodeInternals.values()));
              var nextNodeInternals = createNodeInternals(nodes, nodeInternals);
              set({
                nodeInternals: nextNodeInternals
              });
            }

            onNodesChange === null || onNodesChange === void 0 ? void 0 : onNodesChange(changes);
          }
        }
      },
      // @TODO: can we unify addSelectedNodes and addSelectedEdges somehow?
      addSelectedNodes: function addSelectedNodes(selectedNodeIds) {
        var _changedEdges;

        var _get4 = get(),
            multiSelectionActive = _get4.multiSelectionActive,
            onNodesChange = _get4.onNodesChange,
            nodeInternals = _get4.nodeInternals,
            hasDefaultNodes = _get4.hasDefaultNodes,
            onEdgesChange = _get4.onEdgesChange,
            hasDefaultEdges = _get4.hasDefaultEdges,
            edges = _get4.edges;

        var changedNodes;
        var changedEdges = null;

        if (multiSelectionActive) {
          changedNodes = selectedNodeIds.map(function (nodeId) {
            return createSelectionChange(nodeId, true);
          });
        } else {
          changedNodes = getSelectionChanges(Array.from(nodeInternals.values()), selectedNodeIds);
          changedEdges = getSelectionChanges(edges, []);
        }

        if (changedNodes.length) {
          if (hasDefaultNodes) {
            set({
              nodeInternals: handleControlledNodeSelectionChange(changedNodes, nodeInternals)
            });
          }

          onNodesChange === null || onNodesChange === void 0 ? void 0 : onNodesChange(changedNodes);
        }

        if ((_changedEdges = changedEdges) !== null && _changedEdges !== void 0 && _changedEdges.length) {
          if (hasDefaultEdges) {
            set({
              edges: handleControlledEdgeSelectionChange(changedEdges, edges)
            });
          }

          onEdgesChange === null || onEdgesChange === void 0 ? void 0 : onEdgesChange(changedEdges);
        }
      },
      addSelectedEdges: function addSelectedEdges(selectedEdgeIds) {
        var _changedNodes;

        var _get5 = get(),
            multiSelectionActive = _get5.multiSelectionActive,
            onEdgesChange = _get5.onEdgesChange,
            edges = _get5.edges,
            hasDefaultEdges = _get5.hasDefaultEdges,
            nodeInternals = _get5.nodeInternals,
            hasDefaultNodes = _get5.hasDefaultNodes,
            onNodesChange = _get5.onNodesChange;

        var changedEdges;
        var changedNodes = null;

        if (multiSelectionActive) {
          changedEdges = selectedEdgeIds.map(function (edgeId) {
            return createSelectionChange(edgeId, true);
          });
        } else {
          changedEdges = getSelectionChanges(edges, selectedEdgeIds);
          changedNodes = getSelectionChanges(Array.from(nodeInternals.values()), []);
        }

        if (changedEdges.length) {
          if (hasDefaultEdges) {
            set({
              edges: handleControlledEdgeSelectionChange(changedEdges, edges)
            });
          }

          onEdgesChange === null || onEdgesChange === void 0 ? void 0 : onEdgesChange(changedEdges);
        }

        if ((_changedNodes = changedNodes) !== null && _changedNodes !== void 0 && _changedNodes.length) {
          if (hasDefaultNodes) {
            set({
              nodeInternals: handleControlledNodeSelectionChange(changedNodes, nodeInternals)
            });
          }

          onNodesChange === null || onNodesChange === void 0 ? void 0 : onNodesChange(changedNodes);
        }
      },
      unselectNodesAndEdges: function unselectNodesAndEdges() {
        var _get6 = get(),
            nodeInternals = _get6.nodeInternals,
            edges = _get6.edges,
            onNodesChange = _get6.onNodesChange,
            onEdgesChange = _get6.onEdgesChange,
            hasDefaultNodes = _get6.hasDefaultNodes,
            hasDefaultEdges = _get6.hasDefaultEdges;

        var nodes = Array.from(nodeInternals.values());
        var nodesToUnselect = nodes.map(function (n) {
          n.selected = false;
          return createSelectionChange(n.id, false);
        });
        var edgesToUnselect = edges.map(function (edge) {
          return createSelectionChange(edge.id, false);
        });

        if (nodesToUnselect.length) {
          if (hasDefaultNodes) {
            set({
              nodeInternals: handleControlledNodeSelectionChange(nodesToUnselect, nodeInternals)
            });
          }

          onNodesChange === null || onNodesChange === void 0 ? void 0 : onNodesChange(nodesToUnselect);
        }

        if (edgesToUnselect.length) {
          if (hasDefaultEdges) {
            set({
              edges: handleControlledEdgeSelectionChange(edgesToUnselect, edges)
            });
          }

          onEdgesChange === null || onEdgesChange === void 0 ? void 0 : onEdgesChange(edgesToUnselect);
        }
      },
      setMinZoom: function setMinZoom(minZoom) {
        var _get7 = get(),
            d3Zoom = _get7.d3Zoom,
            maxZoom = _get7.maxZoom;

        d3Zoom === null || d3Zoom === void 0 ? void 0 : d3Zoom.scaleExtent([minZoom, maxZoom]);
        set({
          minZoom: minZoom
        });
      },
      setMaxZoom: function setMaxZoom(maxZoom) {
        var _get8 = get(),
            d3Zoom = _get8.d3Zoom,
            minZoom = _get8.minZoom;

        d3Zoom === null || d3Zoom === void 0 ? void 0 : d3Zoom.scaleExtent([minZoom, maxZoom]);
        set({
          maxZoom: maxZoom
        });
      },
      setTranslateExtent: function setTranslateExtent(translateExtent) {
        var _get9 = get(),
            d3Zoom = _get9.d3Zoom;

        d3Zoom === null || d3Zoom === void 0 ? void 0 : d3Zoom.translateExtent(translateExtent);
        set({
          translateExtent: translateExtent
        });
      },
      resetSelectedElements: function resetSelectedElements() {
        var _get10 = get(),
            nodeInternals = _get10.nodeInternals,
            edges = _get10.edges,
            onNodesChange = _get10.onNodesChange,
            onEdgesChange = _get10.onEdgesChange,
            hasDefaultNodes = _get10.hasDefaultNodes,
            hasDefaultEdges = _get10.hasDefaultEdges;

        var nodes = Array.from(nodeInternals.values());
        var nodesToUnselect = nodes.filter(function (e) {
          return e.selected;
        }).map(function (n) {
          return createSelectionChange(n.id, false);
        });
        var edgesToUnselect = edges.filter(function (e) {
          return e.selected;
        }).map(function (e) {
          return createSelectionChange(e.id, false);
        });

        if (nodesToUnselect.length) {
          if (hasDefaultNodes) {
            set({
              nodeInternals: handleControlledNodeSelectionChange(nodesToUnselect, nodeInternals)
            });
          }

          onNodesChange === null || onNodesChange === void 0 ? void 0 : onNodesChange(nodesToUnselect);
        }

        if (edgesToUnselect.length) {
          if (hasDefaultEdges) {
            set({
              edges: handleControlledEdgeSelectionChange(edgesToUnselect, edges)
            });
          }

          onEdgesChange === null || onEdgesChange === void 0 ? void 0 : onEdgesChange(edgesToUnselect);
        }
      },
      setNodeExtent: function setNodeExtent(nodeExtent) {
        var _get11 = get(),
            nodeInternals = _get11.nodeInternals;

        nodeInternals.forEach(function (node) {
          node.positionAbsolute = clampPosition(node.position, nodeExtent);
        });
        set({
          nodeExtent: nodeExtent,
          nodeInternals: new Map(nodeInternals)
        });
      },
      reset: function reset() {
        return set(_objectSpread$e({}, initialState));
      }
    });
  });
};

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

var doc = typeof document !== 'undefined' ? document : null; // the keycode can be a string 'a' or an array of strings ['a', 'a+d']
// a string means a single key 'a' or a combination when '+' is used 'a+d'
// an array means different possibilites. Explainer: ['a', 'd+s'] here the
// user can use the single key 'a' or the combination 'd' + 's'

var useKeyPress = (function () {
  var keyCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    target: doc
  };

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      keyPressed = _useState2[0],
      setKeyPressed = _useState2[1]; // we need to remember the pressed keys in order to support combinations


  var pressedKeys = useRef(new Set([])); // keyCodes = array with single keys [['a']] or key combinations [['a', 's']]
  // keysToWatch = array with all keys flattened ['a', 'd', 'ShiftLeft']
  // used to check if we store event.code or event.key. When the code is in the list of keysToWatch
  // we use the code otherwise the key. Explainer: When you press the left "command" key, the code is "MetaLeft"
  // and the key is "Meta". We want users to be able to pass keys and codes so we assume that the key is meant when
  // we can't find it in the list of keysToWatch.

  var _useMemo = useMemo(function () {
    if (keyCode !== null) {
      var keyCodeArr = Array.isArray(keyCode) ? keyCode : [keyCode];
      var keys = keyCodeArr.filter(function (kc) {
        return typeof kc === 'string';
      }).map(function (kc) {
        return kc.split('+');
      });
      var keysFlat = keys.reduce(function (res, item) {
        return res.concat.apply(res, _toConsumableArray(item));
      }, []);
      return [keys, keysFlat];
    }

    return [[], []];
  }, [keyCode]),
      _useMemo2 = _slicedToArray(_useMemo, 2),
      keyCodes = _useMemo2[0],
      keysToWatch = _useMemo2[1];

  useEffect(function () {
    if (keyCode !== null) {
      var _options$target, _options$target2, _options$target3;

      var downHandler = function downHandler(event) {
        var keyOrCode = useKeyOrCode(event.code, keysToWatch);
        pressedKeys.current.add(event[keyOrCode]);

        if (isMatchingKey(event, keyCodes, pressedKeys.current)) {
          event.preventDefault();
          setKeyPressed(true);
        }
      };

      var upHandler = function upHandler(event) {
        var keyOrCode = useKeyOrCode(event.code, keysToWatch);

        if (isMatchingKey(event, keyCodes, pressedKeys.current)) {
          setKeyPressed(false);
        }

        pressedKeys.current["delete"](event[keyOrCode]);
      };

      var resetHandler = function resetHandler() {
        pressedKeys.current.clear();
        setKeyPressed(false);
      };

      options === null || options === void 0 ? void 0 : (_options$target = options.target) === null || _options$target === void 0 ? void 0 : _options$target.addEventListener('keydown', downHandler);
      options === null || options === void 0 ? void 0 : (_options$target2 = options.target) === null || _options$target2 === void 0 ? void 0 : _options$target2.addEventListener('keyup', upHandler);
      options === null || options === void 0 ? void 0 : (_options$target3 = options.target) === null || _options$target3 === void 0 ? void 0 : _options$target3.addEventListener('blur', resetHandler);
      return function () {
        var _options$target4, _options$target5, _options$target6;

        pressedKeys.current.clear();
        options === null || options === void 0 ? void 0 : (_options$target4 = options.target) === null || _options$target4 === void 0 ? void 0 : _options$target4.removeEventListener('keydown', downHandler);
        options === null || options === void 0 ? void 0 : (_options$target5 = options.target) === null || _options$target5 === void 0 ? void 0 : _options$target5.removeEventListener('keyup', upHandler);
        options === null || options === void 0 ? void 0 : (_options$target6 = options.target) === null || _options$target6 === void 0 ? void 0 : _options$target6.removeEventListener('blur', resetHandler);
      };
    }
  }, [keyCode, setKeyPressed]);
  return keyPressed;
}); // utils

function isMatchingKey(event, keyCodes, pressedKeys) {
  if (isInputDOMNode(event)) {
    return false;
  }

  return keyCodes // we only want to compare same sizes of keyCode definitions
  // and pressed keys. When the user specified 'Meta' as a key somewhere
  // this would also be truthy without this filter when user presses 'Meta' + 'r'
  .filter(function (keys) {
    return keys.length === pressedKeys.size;
  }) // since we want to support multiple possibilities only one of the
  // combinations need to be part of the pressed keys
  .some(function (keys) {
    return keys.every(function (k) {
      return pressedKeys.has(k);
    });
  });
}

function useKeyOrCode(eventCode, keysToWatch) {
  return keysToWatch.includes(eventCode) ? 'code' : 'key';
}

function isInputDOMNode(e) {
  var target = e === null || e === void 0 ? void 0 : e.target;
  return ['INPUT', 'SELECT', 'TEXTAREA'].includes(target === null || target === void 0 ? void 0 : target.nodeName) || (target === null || target === void 0 ? void 0 : target.hasAttribute('contenteditable'));
}

var selector$g = function selector(s) {
  return {
    resetSelectedElements: s.resetSelectedElements,
    onNodesChange: s.onNodesChange,
    onEdgesChange: s.onEdgesChange
  };
};

var useGlobalKeyHandler = (function (_ref) {
  var deleteKeyCode = _ref.deleteKeyCode,
      multiSelectionKeyCode = _ref.multiSelectionKeyCode;
  var store = useStoreApi();

  var _useStore = useStore(selector$g, shallow),
      resetSelectedElements = _useStore.resetSelectedElements,
      onNodesChange = _useStore.onNodesChange,
      onEdgesChange = _useStore.onEdgesChange;

  var deleteKeyPressed = useKeyPress(deleteKeyCode);
  var multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode);
  useEffect(function () {
    var _store$getState = store.getState(),
        nodeInternals = _store$getState.nodeInternals,
        edges = _store$getState.edges,
        hasDefaultNodes = _store$getState.hasDefaultNodes,
        hasDefaultEdges = _store$getState.hasDefaultEdges,
        onNodesDelete = _store$getState.onNodesDelete,
        onEdgesDelete = _store$getState.onEdgesDelete; // @TODO: work with nodeInternals instead of converting it to an array


    var nodes = Array.from(nodeInternals).map(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2);
          _ref3[0];
          var node = _ref3[1];

      return node;
    });
    var selectedNodes = nodes.filter(function (n) {
      return n.selected;
    });
    var selectedEdges = edges.filter(function (e) {
      return e.selected;
    });

    if (deleteKeyPressed && (selectedNodes || selectedEdges)) {
      var connectedEdges = getConnectedEdges(selectedNodes, edges);
      var edgesToRemove = [].concat(_toConsumableArray(selectedEdges), _toConsumableArray(connectedEdges));
      var edgeIdsToRemove = edgesToRemove.map(function (e) {
        return e.id;
      });

      if (hasDefaultNodes) {
        selectedNodes.forEach(function (node) {
          nodeInternals["delete"](node.id);
        });
      }

      if (hasDefaultEdges) {
        store.setState({
          nodeInternals: new Map(nodeInternals),
          edges: edges.filter(function (e) {
            return !edgeIdsToRemove.includes(e.id);
          })
        });
      }

      onNodesDelete === null || onNodesDelete === void 0 ? void 0 : onNodesDelete(selectedNodes);
      onEdgesDelete === null || onEdgesDelete === void 0 ? void 0 : onEdgesDelete(edgesToRemove);

      if (onNodesChange) {
        var nodeChanges = selectedNodes.map(function (n) {
          return {
            id: n.id,
            type: 'remove'
          };
        });
        onNodesChange(nodeChanges);
      }

      if (onEdgesChange) {
        var edgeChanges = edgeIdsToRemove.map(function (id) {
          return {
            id: id,
            type: 'remove'
          };
        });
        onEdgesChange(edgeChanges);
      }

      store.setState({
        nodesSelectionActive: false
      });
      resetSelectedElements();
    }
  }, [deleteKeyPressed, onNodesChange, onEdgesChange]);
  useEffect(function () {
    store.setState({
      multiSelectionActive: multiSelectionKeyPressed
    });
  }, [multiSelectionKeyPressed]);
});

function useResizeHandler(rendererNode) {
  var store = useStoreApi();
  useEffect(function () {
    var resizeObserver;

    var updateDimensions = function updateDimensions() {
      if (!rendererNode.current) {
        return;
      }

      var size = getDimensions(rendererNode.current);

      if (size.height === 0 || size.width === 0) {
        console.warn('The React Flow parent container needs a width and a height to render the graph.');
      }

      store.setState({
        width: size.width || 500,
        height: size.height || 500
      });
    };

    updateDimensions();
    window.onresize = updateDimensions;

    if (rendererNode.current) {
      resizeObserver = new ResizeObserver(function () {
        return updateDimensions();
      });
      resizeObserver.observe(rendererNode.current);
    }

    return function () {
      window.onresize = null;

      if (resizeObserver && rendererNode.current) {
        resizeObserver.unobserve(rendererNode.current);
      }
    };
  }, []);
}

var viewChanged = function viewChanged(prevViewport, eventViewport) {
  return prevViewport.x !== eventViewport.x || prevViewport.y !== eventViewport.y || prevViewport.zoom !== eventViewport.k;
};

var eventToFlowTransform = function eventToFlowTransform(eventViewport) {
  return {
    x: eventViewport.x,
    y: eventViewport.y,
    zoom: eventViewport.k
  };
};

var isWrappedWithClass = function isWrappedWithClass(event, className) {
  return event.target.closest(".".concat(className));
};

var selector$f = function selector(s) {
  return {
    d3Zoom: s.d3Zoom,
    d3Selection: s.d3Selection,
    d3ZoomHandler: s.d3ZoomHandler
  };
};

var ZoomPane = function ZoomPane(_ref) {
  var onMove = _ref.onMove,
      onMoveStart = _ref.onMoveStart,
      onMoveEnd = _ref.onMoveEnd,
      _ref$zoomOnScroll = _ref.zoomOnScroll,
      zoomOnScroll = _ref$zoomOnScroll === void 0 ? true : _ref$zoomOnScroll,
      _ref$zoomOnPinch = _ref.zoomOnPinch,
      zoomOnPinch = _ref$zoomOnPinch === void 0 ? true : _ref$zoomOnPinch,
      _ref$panOnScroll = _ref.panOnScroll,
      panOnScroll = _ref$panOnScroll === void 0 ? false : _ref$panOnScroll,
      _ref$panOnScrollSpeed = _ref.panOnScrollSpeed,
      panOnScrollSpeed = _ref$panOnScrollSpeed === void 0 ? 0.5 : _ref$panOnScrollSpeed,
      _ref$panOnScrollMode = _ref.panOnScrollMode,
      panOnScrollMode = _ref$panOnScrollMode === void 0 ? PanOnScrollMode.Free : _ref$panOnScrollMode,
      _ref$zoomOnDoubleClic = _ref.zoomOnDoubleClick,
      zoomOnDoubleClick = _ref$zoomOnDoubleClic === void 0 ? true : _ref$zoomOnDoubleClic,
      selectionKeyPressed = _ref.selectionKeyPressed,
      elementsSelectable = _ref.elementsSelectable,
      _ref$panOnDrag = _ref.panOnDrag,
      panOnDrag = _ref$panOnDrag === void 0 ? true : _ref$panOnDrag,
      _ref$defaultPosition = _ref.defaultPosition,
      defaultPosition = _ref$defaultPosition === void 0 ? [0, 0] : _ref$defaultPosition,
      _ref$defaultZoom = _ref.defaultZoom,
      defaultZoom = _ref$defaultZoom === void 0 ? 1 : _ref$defaultZoom,
      zoomActivationKeyCode = _ref.zoomActivationKeyCode,
      _ref$preventScrolling = _ref.preventScrolling,
      preventScrolling = _ref$preventScrolling === void 0 ? true : _ref$preventScrolling,
      children = _ref.children,
      noWheelClassName = _ref.noWheelClassName,
      noPanClassName = _ref.noPanClassName;
  var store = useStoreApi();
  var zoomPane = useRef(null);
  var prevTransform = useRef({
    x: 0,
    y: 0,
    zoom: 0
  });

  var _useStore = useStore(selector$f, shallow),
      d3Zoom = _useStore.d3Zoom,
      d3Selection = _useStore.d3Selection,
      d3ZoomHandler = _useStore.d3ZoomHandler;

  var zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);
  useResizeHandler(zoomPane);
  useEffect(function () {
    if (zoomPane.current) {
      var _store$getState = store.getState(),
          minZoom = _store$getState.minZoom,
          maxZoom = _store$getState.maxZoom,
          translateExtent = _store$getState.translateExtent;

      var d3ZoomInstance = zoom().scaleExtent([minZoom, maxZoom]).translateExtent(translateExtent);
      var selection = select(zoomPane.current).call(d3ZoomInstance);
      var clampedX = clamp(defaultPosition[0], translateExtent[0][0], translateExtent[1][0]);
      var clampedY = clamp(defaultPosition[1], translateExtent[0][1], translateExtent[1][1]);
      var clampedZoom = clamp(defaultZoom, minZoom, maxZoom);
      var updatedTransform = zoomIdentity.translate(clampedX, clampedY).scale(clampedZoom);
      d3ZoomInstance.transform(selection, updatedTransform);
      store.setState({
        d3Zoom: d3ZoomInstance,
        d3Selection: selection,
        d3ZoomHandler: selection.on('wheel.zoom'),
        // we need to pass transform because zoom handler is not registered when we set the initial transform
        transform: [clampedX, clampedY, clampedZoom]
      });
    }
  }, []);
  useEffect(function () {
    if (d3Selection && d3Zoom) {
      if (panOnScroll && !zoomActivationKeyPressed) {
        d3Selection.on('wheel', function (event) {
          if (isWrappedWithClass(event, noWheelClassName)) {
            return false;
          }

          event.preventDefault();
          event.stopImmediatePropagation();
          var currentZoom = d3Selection.property('__zoom').k || 1;

          if (event.ctrlKey && zoomOnPinch) {
            var point = pointer(event); // taken from https://github.com/d3/d3-zoom/blob/master/src/zoom.js

            var pinchDelta = -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * 10;

            var _zoom = currentZoom * Math.pow(2, pinchDelta);

            d3Zoom.scaleTo(d3Selection, _zoom, point);
            return;
          } // increase scroll speed in firefox
          // firefox: deltaMode === 1; chrome: deltaMode === 0


          var deltaNormalize = event.deltaMode === 1 ? 20 : 1;
          var deltaX = panOnScrollMode === PanOnScrollMode.Vertical ? 0 : event.deltaX * deltaNormalize;
          var deltaY = panOnScrollMode === PanOnScrollMode.Horizontal ? 0 : event.deltaY * deltaNormalize;
          d3Zoom.translateBy(d3Selection, -(deltaX / currentZoom) * panOnScrollSpeed, -(deltaY / currentZoom) * panOnScrollSpeed);
        }).on('wheel.zoom', null);
      } else if (typeof d3ZoomHandler !== 'undefined') {
        d3Selection.on('wheel', function (event) {
          if (!preventScrolling || isWrappedWithClass(event, noWheelClassName)) {
            return null;
          }

          event.preventDefault();
        }).on('wheel.zoom', d3ZoomHandler);
      }
    }
  }, [panOnScroll, panOnScrollMode, d3Selection, d3Zoom, d3ZoomHandler, zoomActivationKeyPressed, zoomOnPinch, preventScrolling, noWheelClassName]);
  useEffect(function () {
    if (d3Zoom) {
      if (selectionKeyPressed) {
        d3Zoom.on('zoom', null);
      } else {
        d3Zoom.on('zoom', function (event) {
          store.setState({
            transform: [event.transform.x, event.transform.y, event.transform.k]
          });

          if (onMove) {
            var flowTransform = eventToFlowTransform(event.transform);
            onMove(event.sourceEvent, flowTransform);
          }
        });
      }
    }
  }, [selectionKeyPressed, d3Zoom, onMove]);
  useEffect(function () {
    if (d3Zoom) {
      if (onMoveStart) {
        d3Zoom.on('start', function (event) {
          var flowTransform = eventToFlowTransform(event.transform);
          prevTransform.current = flowTransform;
          onMoveStart(event.sourceEvent, flowTransform);
        });
      } else {
        d3Zoom.on('start', null);
      }
    }
  }, [d3Zoom, onMoveStart]);
  useEffect(function () {
    if (d3Zoom) {
      if (onMoveEnd) {
        d3Zoom.on('end', function (event) {
          if (viewChanged(prevTransform.current, event.transform)) {
            var flowTransform = eventToFlowTransform(event.transform);
            prevTransform.current = flowTransform;
            onMoveEnd(event.sourceEvent, flowTransform);
          }
        });
      } else {
        d3Zoom.on('end', null);
      }
    }
  }, [d3Zoom, onMoveEnd]);
  useEffect(function () {
    if (d3Zoom) {
      d3Zoom.filter(function (event) {
        var zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
        var pinchZoom = zoomOnPinch && event.ctrlKey; // if all interactions are disabled, we prevent all zoom events

        if (!panOnDrag && !zoomScroll && !panOnScroll && !zoomOnDoubleClick && !zoomOnPinch) {
          return false;
        } // during a selection we prevent all other interactions


        if (selectionKeyPressed) {
          return false;
        } // if zoom on double click is disabled, we prevent the double click event


        if (!zoomOnDoubleClick && event.type === 'dblclick') {
          return false;
        } // if the target element is inside an element with the nowheel class, we prevent zooming


        if (isWrappedWithClass(event, noWheelClassName) && event.type === 'wheel') {
          return false;
        } // if the target element is inside an element with the nopan class, we prevent panning


        if (isWrappedWithClass(event, noPanClassName) && event.type !== 'wheel') {
          return false;
        }

        if (!zoomOnPinch && event.ctrlKey && event.type === 'wheel') {
          return false;
        } // when there is no scroll handling enabled, we prevent all wheel events


        if (!zoomScroll && !panOnScroll && !pinchZoom && event.type === 'wheel') {
          return false;
        } // if the pane is not movable, we prevent dragging it with mousestart or touchstart


        if (!panOnDrag && (event.type === 'mousedown' || event.type === 'touchstart')) {
          return false;
        } // default filter for d3-zoom


        return (!event.ctrlKey || event.type === 'wheel') && !event.button;
      });
    }
  }, [d3Zoom, zoomOnScroll, zoomOnPinch, panOnScroll, zoomOnDoubleClick, panOnDrag, selectionKeyPressed, elementsSelectable, zoomActivationKeyPressed]);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "react-flow__renderer react-flow__container",
    ref: zoomPane
  }, children);
};

function ownKeys$d(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$d(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$d(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$d(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function getMousePosition(event, containerBounds) {
  return {
    x: event.clientX - containerBounds.left,
    y: event.clientY - containerBounds.top
  };
}

var selector$e = function selector(s) {
  return {
    userSelectionActive: s.userSelectionActive,
    elementsSelectable: s.elementsSelectable
  };
};

var initialRect = {
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  draw: false
};
var UserSelection = /*#__PURE__*/memo(function (_ref) {
  var selectionKeyPressed = _ref.selectionKeyPressed;
  var store = useStoreApi();
  var prevSelectedNodesCount = useRef(0);
  var prevSelectedEdgesCount = useRef(0);
  var containerBounds = useRef();

  var _useState = useState(initialRect),
      _useState2 = _slicedToArray(_useState, 2),
      userSelectionRect = _useState2[0],
      setUserSelectionRect = _useState2[1];

  var _useStore = useStore(selector$e, shallow),
      userSelectionActive = _useStore.userSelectionActive,
      elementsSelectable = _useStore.elementsSelectable;

  var renderUserSelectionPane = userSelectionActive || selectionKeyPressed;
  var resetUserSelection = useCallback(function () {
    setUserSelectionRect(initialRect);
    store.setState({
      userSelectionActive: false
    });
    prevSelectedNodesCount.current = 0;
    prevSelectedEdgesCount.current = 0;
  }, []);
  var onMouseDown = useCallback(function (event) {
    var reactFlowNode = event.target.closest('.react-flow');
    containerBounds.current = reactFlowNode.getBoundingClientRect();
    var mousePos = getMousePosition(event, containerBounds.current);
    setUserSelectionRect({
      width: 0,
      height: 0,
      startX: mousePos.x,
      startY: mousePos.y,
      x: mousePos.x,
      y: mousePos.y,
      draw: true
    });
    store.setState({
      userSelectionActive: true,
      nodesSelectionActive: false
    });
  }, []);

  var onMouseMove = function onMouseMove(event) {
    var _userSelectionRect$st, _userSelectionRect$st2;

    if (!selectionKeyPressed || !userSelectionRect.draw || !containerBounds.current) {
      return;
    }

    var mousePos = getMousePosition(event, containerBounds.current);
    var startX = (_userSelectionRect$st = userSelectionRect.startX) !== null && _userSelectionRect$st !== void 0 ? _userSelectionRect$st : 0;
    var startY = (_userSelectionRect$st2 = userSelectionRect.startY) !== null && _userSelectionRect$st2 !== void 0 ? _userSelectionRect$st2 : 0;

    var nextUserSelectRect = _objectSpread$d(_objectSpread$d({}, userSelectionRect), {}, {
      x: mousePos.x < startX ? mousePos.x : startX,
      y: mousePos.y < startY ? mousePos.y : startY,
      width: Math.abs(mousePos.x - startX),
      height: Math.abs(mousePos.y - startY)
    });

    var _store$getState = store.getState(),
        nodeInternals = _store$getState.nodeInternals,
        edges = _store$getState.edges,
        transform = _store$getState.transform,
        onNodesChange = _store$getState.onNodesChange,
        onEdgesChange = _store$getState.onEdgesChange;

    var nodes = Array.from(nodeInternals).map(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2);
          _ref3[0];
          var node = _ref3[1];

      return node;
    });
    var selectedNodes = getNodesInside(nodeInternals, nextUserSelectRect, transform, false, true);
    var selectedEdgeIds = getConnectedEdges(selectedNodes, edges).map(function (e) {
      return e.id;
    });
    var selectedNodeIds = selectedNodes.map(function (n) {
      return n.id;
    });

    if (prevSelectedNodesCount.current !== selectedNodeIds.length) {
      prevSelectedNodesCount.current = selectedNodeIds.length;
      var changes = getSelectionChanges(nodes, selectedNodeIds);

      if (changes.length) {
        onNodesChange === null || onNodesChange === void 0 ? void 0 : onNodesChange(changes);
      }
    }

    if (prevSelectedEdgesCount.current !== selectedEdgeIds.length) {
      prevSelectedEdgesCount.current = selectedEdgeIds.length;

      var _changes = getSelectionChanges(edges, selectedEdgeIds);

      if (_changes.length) {
        onEdgesChange === null || onEdgesChange === void 0 ? void 0 : onEdgesChange(_changes);
      }
    }

    setUserSelectionRect(nextUserSelectRect);
  };

  var onMouseUp = useCallback(function () {
    store.setState({
      nodesSelectionActive: prevSelectedNodesCount.current > 0
    });
    resetUserSelection();
  }, []);
  var onMouseLeave = useCallback(function () {
    store.setState({
      nodesSelectionActive: false
    });
    resetUserSelection();
  }, []);

  if (!elementsSelectable || !renderUserSelectionPane) {
    return null;
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "react-flow__selectionpane react-flow__container",
    onMouseDown: onMouseDown,
    onMouseMove: onMouseMove,
    onMouseUp: onMouseUp,
    onMouseLeave: onMouseLeave
  }, userSelectionRect.draw && /*#__PURE__*/React__default.createElement("div", {
    className: "react-flow__selection react-flow__container",
    style: {
      width: userSelectionRect.width,
      height: userSelectionRect.height,
      transform: "translate(".concat(userSelectionRect.x, "px, ").concat(userSelectionRect.y, "px)")
    }
  }));
});

var selector$d = function selector(s) {
  return {
    transform: s.transform,
    selectedNodesBbox: s.selectedNodesBbox,
    userSelectionActive: s.userSelectionActive,
    selectedNodes: Array.from(s.nodeInternals).filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);
          _ref2[0];
          var n = _ref2[1];

      return n.selected;
    }).map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2);
          _ref4[0];
          var n = _ref4[1];

      return n;
    }),
    snapToGrid: s.snapToGrid,
    snapGrid: s.snapGrid,
    updateNodePosition: s.updateNodePosition
  };
};

function NodesSelection(_ref5) {
  var onSelectionDragStart = _ref5.onSelectionDragStart,
      onSelectionDrag = _ref5.onSelectionDrag,
      onSelectionDragStop = _ref5.onSelectionDragStop,
      onSelectionContextMenu = _ref5.onSelectionContextMenu,
      noPanClassName = _ref5.noPanClassName;

  var _useStore = useStore(selector$d, shallow),
      transform = _useStore.transform,
      userSelectionActive = _useStore.userSelectionActive,
      selectedNodes = _useStore.selectedNodes,
      snapToGrid = _useStore.snapToGrid,
      snapGrid = _useStore.snapGrid,
      updateNodePosition = _useStore.updateNodePosition;

  var _transform = _slicedToArray(transform, 3),
      tX = _transform[0],
      tY = _transform[1],
      tScale = _transform[2];

  var nodeRef = useRef(null);
  var grid = useMemo(function () {
    return snapToGrid ? snapGrid : [1, 1];
  }, [snapToGrid, snapGrid]);
  var style = useMemo(function () {
    return {
      transform: "translate(".concat(tX, "px,").concat(tY, "px) scale(").concat(tScale, ")")
    };
  }, [tX, tY, tScale]);
  var selectedNodesBbox = useMemo(function () {
    return getRectOfNodes(selectedNodes);
  }, [selectedNodes]);
  var innerStyle = useMemo(function () {
    return {
      width: selectedNodesBbox.width,
      height: selectedNodesBbox.height,
      top: selectedNodesBbox.y,
      left: selectedNodesBbox.x
    };
  }, [selectedNodesBbox]);

  var _onStart = useCallback(function (event) {
    onSelectionDragStart === null || onSelectionDragStart === void 0 ? void 0 : onSelectionDragStart(event, selectedNodes);
  }, [onSelectionDragStart, selectedNodes]);

  var _onDrag = useCallback(function (event, data) {
    updateNodePosition({
      diff: {
        x: data.deltaX,
        y: data.deltaY
      },
      dragging: true
    });
    onSelectionDrag === null || onSelectionDrag === void 0 ? void 0 : onSelectionDrag(event, selectedNodes);
  }, [onSelectionDrag, selectedNodes, updateNodePosition]);

  var _onStop = useCallback(function (event) {
    updateNodePosition({
      dragging: false
    });
    onSelectionDragStop === null || onSelectionDragStop === void 0 ? void 0 : onSelectionDragStop(event, selectedNodes);
  }, [selectedNodes, onSelectionDragStop]);

  var onContextMenu = useCallback(function (event) {
    onSelectionContextMenu === null || onSelectionContextMenu === void 0 ? void 0 : onSelectionContextMenu(event, selectedNodes);
  }, [onSelectionContextMenu, selectedNodes]);

  if (!(selectedNodes !== null && selectedNodes !== void 0 && selectedNodes.length) || userSelectionActive) {
    return null;
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: cc(['react-flow__nodesselection', 'react-flow__container', noPanClassName]),
    style: style
  }, /*#__PURE__*/React__default.createElement(DraggableCore, {
    scale: tScale,
    grid: grid,
    onStart: function onStart(event) {
      return _onStart(event);
    },
    onDrag: function onDrag(event, data) {
      return _onDrag(event, data);
    },
    onStop: function onStop(event) {
      return _onStop(event);
    },
    nodeRef: nodeRef,
    enableUserSelectHack: false
  }, /*#__PURE__*/React__default.createElement("div", {
    ref: nodeRef,
    className: "react-flow__nodesselection-rect",
    onContextMenu: onContextMenu,
    style: innerStyle
  })));
}

var NodesSelection$1 = /*#__PURE__*/memo(NodesSelection);

var selector$c = function selector(s) {
  return {
    resetSelectedElements: s.resetSelectedElements,
    nodesSelectionActive: s.nodesSelectionActive
  };
};

var FlowRenderer = function FlowRenderer(_ref) {
  var children = _ref.children,
      onPaneClick = _ref.onPaneClick,
      onPaneContextMenu = _ref.onPaneContextMenu,
      onPaneScroll = _ref.onPaneScroll,
      deleteKeyCode = _ref.deleteKeyCode,
      onMove = _ref.onMove,
      onMoveStart = _ref.onMoveStart,
      onMoveEnd = _ref.onMoveEnd,
      selectionKeyCode = _ref.selectionKeyCode,
      multiSelectionKeyCode = _ref.multiSelectionKeyCode,
      zoomActivationKeyCode = _ref.zoomActivationKeyCode,
      elementsSelectable = _ref.elementsSelectable,
      zoomOnScroll = _ref.zoomOnScroll,
      zoomOnPinch = _ref.zoomOnPinch,
      panOnScroll = _ref.panOnScroll,
      panOnScrollSpeed = _ref.panOnScrollSpeed,
      panOnScrollMode = _ref.panOnScrollMode,
      zoomOnDoubleClick = _ref.zoomOnDoubleClick,
      panOnDrag = _ref.panOnDrag,
      defaultPosition = _ref.defaultPosition,
      defaultZoom = _ref.defaultZoom,
      preventScrolling = _ref.preventScrolling,
      onSelectionDragStart = _ref.onSelectionDragStart,
      onSelectionDrag = _ref.onSelectionDrag,
      onSelectionDragStop = _ref.onSelectionDragStop,
      onSelectionContextMenu = _ref.onSelectionContextMenu,
      noWheelClassName = _ref.noWheelClassName,
      noPanClassName = _ref.noPanClassName;
  var store = useStoreApi();

  var _useStore = useStore(selector$c, shallow),
      resetSelectedElements = _useStore.resetSelectedElements,
      nodesSelectionActive = _useStore.nodesSelectionActive;

  var selectionKeyPressed = useKeyPress(selectionKeyCode);
  useGlobalKeyHandler({
    deleteKeyCode: deleteKeyCode,
    multiSelectionKeyCode: multiSelectionKeyCode
  });
  var onClick = useCallback(function (event) {
    onPaneClick === null || onPaneClick === void 0 ? void 0 : onPaneClick(event);
    resetSelectedElements();
    store.setState({
      nodesSelectionActive: false
    });
  }, [onPaneClick]);
  var onContextMenu = useCallback(function (event) {
    return onPaneContextMenu === null || onPaneContextMenu === void 0 ? void 0 : onPaneContextMenu(event);
  }, [onPaneContextMenu]);
  var onWheel = useCallback(function (event) {
    return onPaneScroll === null || onPaneScroll === void 0 ? void 0 : onPaneScroll(event);
  }, [onPaneScroll]);
  return /*#__PURE__*/React__default.createElement(ZoomPane, {
    onMove: onMove,
    onMoveStart: onMoveStart,
    onMoveEnd: onMoveEnd,
    selectionKeyPressed: selectionKeyPressed,
    elementsSelectable: elementsSelectable,
    zoomOnScroll: zoomOnScroll,
    zoomOnPinch: zoomOnPinch,
    panOnScroll: panOnScroll,
    panOnScrollSpeed: panOnScrollSpeed,
    panOnScrollMode: panOnScrollMode,
    zoomOnDoubleClick: zoomOnDoubleClick,
    panOnDrag: panOnDrag,
    defaultPosition: defaultPosition,
    defaultZoom: defaultZoom,
    zoomActivationKeyCode: zoomActivationKeyCode,
    preventScrolling: preventScrolling,
    noWheelClassName: noWheelClassName,
    noPanClassName: noPanClassName
  }, children, /*#__PURE__*/React__default.createElement(UserSelection, {
    selectionKeyPressed: selectionKeyPressed
  }), nodesSelectionActive && /*#__PURE__*/React__default.createElement(NodesSelection$1, {
    onSelectionDragStart: onSelectionDragStart,
    onSelectionDrag: onSelectionDrag,
    onSelectionDragStop: onSelectionDragStop,
    onSelectionContextMenu: onSelectionContextMenu,
    noPanClassName: noPanClassName
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "react-flow__pane react-flow__container",
    onClick: onClick,
    onContextMenu: onContextMenu,
    onWheel: onWheel
  }));
};

FlowRenderer.displayName = 'FlowRenderer';
var FlowRenderer$1 = /*#__PURE__*/memo(FlowRenderer);

function useVisibleNodes(onlyRenderVisible) {
  var nodes = useStore(useCallback(function (s) {
    return onlyRenderVisible ? getNodesInside(s.nodeInternals, {
      x: 0,
      y: 0,
      width: s.width,
      height: s.height
    }, s.transform, true) : Array.from(s.nodeInternals).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);
          _ref2[0];
          var node = _ref2[1];

      return node;
    });
  }, [onlyRenderVisible]));
  return nodes;
}

var selector$b = function selector(s) {
  return {
    scale: s.transform[2],
    nodesDraggable: s.nodesDraggable,
    nodesConnectable: s.nodesConnectable,
    elementsSelectable: s.elementsSelectable,
    updateNodeDimensions: s.updateNodeDimensions,
    snapGrid: s.snapGrid,
    snapToGrid: s.snapToGrid,
    nodeInternals: s.nodeInternals
  };
};

var NodeRenderer = function NodeRenderer(props) {
  var _useStore = useStore(selector$b, shallow),
      scale = _useStore.scale,
      nodesDraggable = _useStore.nodesDraggable,
      nodesConnectable = _useStore.nodesConnectable,
      elementsSelectable = _useStore.elementsSelectable,
      updateNodeDimensions = _useStore.updateNodeDimensions,
      snapGrid = _useStore.snapGrid,
      snapToGrid = _useStore.snapToGrid;

  var nodes = useVisibleNodes(props.onlyRenderVisibleElements);
  var resizeObserverRef = useRef();
  var resizeObserver = useMemo(function () {
    if (typeof ResizeObserver === 'undefined') {
      return null;
    }

    var observer = new ResizeObserver(function (entries) {
      var updates = entries.map(function (entry) {
        return {
          id: entry.target.getAttribute('data-id'),
          nodeElement: entry.target,
          forceUpdate: true
        };
      });
      updateNodeDimensions(updates);
    });
    resizeObserverRef.current = observer;
    return observer;
  }, []);
  useEffect(function () {
    return function () {
      var _resizeObserverRef$cu;

      resizeObserverRef === null || resizeObserverRef === void 0 ? void 0 : (_resizeObserverRef$cu = resizeObserverRef.current) === null || _resizeObserverRef$cu === void 0 ? void 0 : _resizeObserverRef$cu.disconnect();
    };
  }, []);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "react-flow__nodes react-flow__container"
  }, nodes.map(function (node) {
    var _node$positionAbsolut, _node$positionAbsolut2, _node$positionAbsolut3, _node$positionAbsolut4, _node$z;

    var nodeType = node.type || 'default';

    if (!props.nodeTypes[nodeType]) {
      console.warn("Node type \"".concat(nodeType, "\" not found. Using fallback type \"default\"."));
    }

    var NodeComponent = props.nodeTypes[nodeType] || props.nodeTypes["default"];
    var isDraggable = !!(node.draggable || nodesDraggable && typeof node.draggable === 'undefined');
    var isSelectable = !!(node.selectable || elementsSelectable && typeof node.selectable === 'undefined');
    var isConnectable = !!(node.connectable || nodesConnectable && typeof node.connectable === 'undefined');
    return /*#__PURE__*/React__default.createElement(NodeComponent, {
      key: node.id,
      id: node.id,
      className: node.className,
      style: node.style,
      type: nodeType,
      data: node.data,
      sourcePosition: node.sourcePosition || Position.Bottom,
      targetPosition: node.targetPosition || Position.Top,
      hidden: node.hidden,
      xPos: (_node$positionAbsolut = (_node$positionAbsolut2 = node.positionAbsolute) === null || _node$positionAbsolut2 === void 0 ? void 0 : _node$positionAbsolut2.x) !== null && _node$positionAbsolut !== void 0 ? _node$positionAbsolut : 0,
      yPos: (_node$positionAbsolut3 = (_node$positionAbsolut4 = node.positionAbsolute) === null || _node$positionAbsolut4 === void 0 ? void 0 : _node$positionAbsolut4.y) !== null && _node$positionAbsolut3 !== void 0 ? _node$positionAbsolut3 : 0,
      dragging: !!node.dragging,
      snapGrid: snapGrid,
      snapToGrid: snapToGrid,
      selectNodesOnDrag: props.selectNodesOnDrag,
      onClick: props.onNodeClick,
      onMouseEnter: props.onNodeMouseEnter,
      onMouseMove: props.onNodeMouseMove,
      onMouseLeave: props.onNodeMouseLeave,
      onContextMenu: props.onNodeContextMenu,
      onNodeDoubleClick: props.onNodeDoubleClick,
      onNodeDragStart: props.onNodeDragStart,
      onNodeDrag: props.onNodeDrag,
      onNodeDragStop: props.onNodeDragStop,
      scale: scale,
      selected: !!node.selected,
      isDraggable: isDraggable,
      isSelectable: isSelectable,
      isConnectable: isConnectable,
      resizeObserver: resizeObserver,
      dragHandle: node.dragHandle,
      zIndex: (_node$z = node.z) !== null && _node$z !== void 0 ? _node$z : 0,
      isParent: !!node.isParent,
      noDragClassName: props.noDragClassName,
      noPanClassName: props.noPanClassName
    });
  }));
};

NodeRenderer.displayName = 'NodeRenderer';
var NodeRenderer$1 = /*#__PURE__*/memo(NodeRenderer);

var _excluded$4 = ["x", "y", "label", "labelStyle", "labelShowBg", "labelBgStyle", "labelBgPadding", "labelBgBorderRadius", "children", "className"];

function ownKeys$c(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$c(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$c(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$c(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var EdgeText = function EdgeText(_ref) {
  var x = _ref.x,
      y = _ref.y,
      label = _ref.label,
      _ref$labelStyle = _ref.labelStyle,
      labelStyle = _ref$labelStyle === void 0 ? {} : _ref$labelStyle,
      _ref$labelShowBg = _ref.labelShowBg,
      labelShowBg = _ref$labelShowBg === void 0 ? true : _ref$labelShowBg,
      _ref$labelBgStyle = _ref.labelBgStyle,
      labelBgStyle = _ref$labelBgStyle === void 0 ? {} : _ref$labelBgStyle,
      _ref$labelBgPadding = _ref.labelBgPadding,
      labelBgPadding = _ref$labelBgPadding === void 0 ? [2, 4] : _ref$labelBgPadding,
      _ref$labelBgBorderRad = _ref.labelBgBorderRadius,
      labelBgBorderRadius = _ref$labelBgBorderRad === void 0 ? 2 : _ref$labelBgBorderRad,
      children = _ref.children,
      className = _ref.className,
      rest = _objectWithoutProperties(_ref, _excluded$4);

  var edgeRef = useRef(null);

  var _useState = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }),
      _useState2 = _slicedToArray(_useState, 2),
      edgeTextBbox = _useState2[0],
      setEdgeTextBbox = _useState2[1];

  var edgeTextClasses = cc(['react-flow__edge-textwrapper', className]);
  useEffect(function () {
    if (edgeRef.current) {
      var textBbox = edgeRef.current.getBBox();
      setEdgeTextBbox({
        x: textBbox.x,
        y: textBbox.y,
        width: textBbox.width,
        height: textBbox.height
      });
    }
  }, [label]);

  if (typeof label === 'undefined' || !label) {
    return null;
  }

  return /*#__PURE__*/React__default.createElement("g", _objectSpread$c({
    transform: "translate(".concat(x - edgeTextBbox.width / 2, " ").concat(y - edgeTextBbox.height / 2, ")"),
    className: edgeTextClasses
  }, rest), labelShowBg && /*#__PURE__*/React__default.createElement("rect", {
    width: edgeTextBbox.width + 2 * labelBgPadding[0],
    x: -labelBgPadding[0],
    y: -labelBgPadding[1],
    height: edgeTextBbox.height + 2 * labelBgPadding[1],
    className: "react-flow__edge-textbg",
    style: labelBgStyle,
    rx: labelBgBorderRadius,
    ry: labelBgBorderRadius
  }), /*#__PURE__*/React__default.createElement("text", {
    className: "react-flow__edge-text",
    y: edgeTextBbox.height / 2,
    dy: "0.3em",
    ref: edgeRef,
    style: labelStyle
  }, label), children);
};

var EdgeText$1 = /*#__PURE__*/memo(EdgeText);

var getMarkerEnd = function getMarkerEnd(markerType, markerEndId) {
  if (typeof markerEndId !== 'undefined' && markerEndId) {
    return "url(#".concat(markerEndId, ")");
  }

  return typeof markerType !== 'undefined' ? "url(#react-flow__".concat(markerType, ")") : 'none';
};
var LeftOrRight = [Position.Left, Position.Right];
var getCenter = function getCenter(_ref) {
  var sourceX = _ref.sourceX,
      sourceY = _ref.sourceY,
      targetX = _ref.targetX,
      targetY = _ref.targetY,
      _ref$sourcePosition = _ref.sourcePosition,
      sourcePosition = _ref$sourcePosition === void 0 ? Position.Bottom : _ref$sourcePosition,
      _ref$targetPosition = _ref.targetPosition,
      targetPosition = _ref$targetPosition === void 0 ? Position.Top : _ref$targetPosition;
  var sourceIsLeftOrRight = LeftOrRight.includes(sourcePosition);
  var targetIsLeftOrRight = LeftOrRight.includes(targetPosition); // we expect flows to be horizontal or vertical (all handles left or right respectively top or bottom)
  // a mixed edge is when one the source is on the left and the target is on the top for example.

  var mixedEdge = sourceIsLeftOrRight && !targetIsLeftOrRight || targetIsLeftOrRight && !sourceIsLeftOrRight;

  if (mixedEdge) {
    var _xOffset = sourceIsLeftOrRight ? Math.abs(targetX - sourceX) : 0;

    var _centerX = sourceX > targetX ? sourceX - _xOffset : sourceX + _xOffset;

    var _yOffset = sourceIsLeftOrRight ? 0 : Math.abs(targetY - sourceY);

    var _centerY = sourceY < targetY ? sourceY + _yOffset : sourceY - _yOffset;

    return [_centerX, _centerY, _xOffset, _yOffset];
  }

  var xOffset = Math.abs(targetX - sourceX) / 2;
  var centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
  var yOffset = Math.abs(targetY - sourceY) / 2;
  var centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
  return [centerX, centerY, xOffset, yOffset];
};

function getBezierPath(_ref) {
  var sourceX = _ref.sourceX,
      sourceY = _ref.sourceY,
      _ref$sourcePosition = _ref.sourcePosition,
      sourcePosition = _ref$sourcePosition === void 0 ? Position.Bottom : _ref$sourcePosition,
      targetX = _ref.targetX,
      targetY = _ref.targetY,
      _ref$targetPosition = _ref.targetPosition,
      targetPosition = _ref$targetPosition === void 0 ? Position.Top : _ref$targetPosition,
      centerX = _ref.centerX,
      centerY = _ref.centerY;

  var _getCenter = getCenter({
    sourceX: sourceX,
    sourceY: sourceY,
    targetX: targetX,
    targetY: targetY
  }),
      _getCenter2 = _slicedToArray(_getCenter, 2),
      _centerX = _getCenter2[0],
      _centerY = _getCenter2[1];

  var leftAndRight = [Position.Left, Position.Right];
  var cX = typeof centerX !== 'undefined' ? centerX : _centerX;
  var cY = typeof centerY !== 'undefined' ? centerY : _centerY;
  var path = "M".concat(sourceX, ",").concat(sourceY, " C").concat(sourceX, ",").concat(cY, " ").concat(targetX, ",").concat(cY, " ").concat(targetX, ",").concat(targetY);

  if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    path = "M".concat(sourceX, ",").concat(sourceY, " C").concat(cX, ",").concat(sourceY, " ").concat(cX, ",").concat(targetY, " ").concat(targetX, ",").concat(targetY);
  } else if (leftAndRight.includes(targetPosition)) {
    path = "M".concat(sourceX, ",").concat(sourceY, " Q").concat(sourceX, ",").concat(targetY, " ").concat(targetX, ",").concat(targetY);
  } else if (leftAndRight.includes(sourcePosition)) {
    path = "M".concat(sourceX, ",").concat(sourceY, " Q").concat(targetX, ",").concat(sourceY, " ").concat(targetX, ",").concat(targetY);
  }

  return path;
}
var BezierEdge = /*#__PURE__*/memo(function (_ref2) {
  var sourceX = _ref2.sourceX,
      sourceY = _ref2.sourceY,
      targetX = _ref2.targetX,
      targetY = _ref2.targetY,
      _ref2$sourcePosition = _ref2.sourcePosition,
      sourcePosition = _ref2$sourcePosition === void 0 ? Position.Bottom : _ref2$sourcePosition,
      _ref2$targetPosition = _ref2.targetPosition,
      targetPosition = _ref2$targetPosition === void 0 ? Position.Top : _ref2$targetPosition,
      label = _ref2.label,
      labelStyle = _ref2.labelStyle,
      labelShowBg = _ref2.labelShowBg,
      labelBgStyle = _ref2.labelBgStyle,
      labelBgPadding = _ref2.labelBgPadding,
      labelBgBorderRadius = _ref2.labelBgBorderRadius,
      style = _ref2.style,
      markerEnd = _ref2.markerEnd,
      markerStart = _ref2.markerStart;

  var _getCenter3 = getCenter({
    sourceX: sourceX,
    sourceY: sourceY,
    targetX: targetX,
    targetY: targetY,
    sourcePosition: sourcePosition,
    targetPosition: targetPosition
  }),
      _getCenter4 = _slicedToArray(_getCenter3, 2),
      centerX = _getCenter4[0],
      centerY = _getCenter4[1];

  var path = getBezierPath({
    sourceX: sourceX,
    sourceY: sourceY,
    sourcePosition: sourcePosition,
    targetX: targetX,
    targetY: targetY,
    targetPosition: targetPosition
  });
  var text = label ? /*#__PURE__*/React__default.createElement(EdgeText$1, {
    x: centerX,
    y: centerY,
    label: label,
    labelStyle: labelStyle,
    labelShowBg: labelShowBg,
    labelBgStyle: labelBgStyle,
    labelBgPadding: labelBgPadding,
    labelBgBorderRadius: labelBgBorderRadius
  }) : null;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("path", {
    style: style,
    d: path,
    className: "react-flow__edge-path",
    markerEnd: markerEnd,
    markerStart: markerStart
  }), text);
});

// The name indicates the direction of the path. "bottomLeftCorner" goes
// from bottom to the left and "leftBottomCorner" goes from left to the bottom.
// We have to consider the direction of the paths because of the animated lines.

var bottomLeftCorner = function bottomLeftCorner(x, y, size) {
  return "L ".concat(x, ",").concat(y - size, "Q ").concat(x, ",").concat(y, " ").concat(x + size, ",").concat(y);
};

var leftBottomCorner = function leftBottomCorner(x, y, size) {
  return "L ".concat(x + size, ",").concat(y, "Q ").concat(x, ",").concat(y, " ").concat(x, ",").concat(y - size);
};

var bottomRightCorner = function bottomRightCorner(x, y, size) {
  return "L ".concat(x, ",").concat(y - size, "Q ").concat(x, ",").concat(y, " ").concat(x - size, ",").concat(y);
};

var rightBottomCorner = function rightBottomCorner(x, y, size) {
  return "L ".concat(x - size, ",").concat(y, "Q ").concat(x, ",").concat(y, " ").concat(x, ",").concat(y - size);
};

var leftTopCorner = function leftTopCorner(x, y, size) {
  return "L ".concat(x + size, ",").concat(y, "Q ").concat(x, ",").concat(y, " ").concat(x, ",").concat(y + size);
};

var topLeftCorner = function topLeftCorner(x, y, size) {
  return "L ".concat(x, ",").concat(y + size, "Q ").concat(x, ",").concat(y, " ").concat(x + size, ",").concat(y);
};

var topRightCorner = function topRightCorner(x, y, size) {
  return "L ".concat(x, ",").concat(y + size, "Q ").concat(x, ",").concat(y, " ").concat(x - size, ",").concat(y);
};

var rightTopCorner = function rightTopCorner(x, y, size) {
  return "L ".concat(x - size, ",").concat(y, "Q ").concat(x, ",").concat(y, " ").concat(x, ",").concat(y + size);
};

function getSmoothStepPath(_ref) {
  var sourceX = _ref.sourceX,
      sourceY = _ref.sourceY,
      _ref$sourcePosition = _ref.sourcePosition,
      sourcePosition = _ref$sourcePosition === void 0 ? Position.Bottom : _ref$sourcePosition,
      targetX = _ref.targetX,
      targetY = _ref.targetY,
      _ref$targetPosition = _ref.targetPosition,
      targetPosition = _ref$targetPosition === void 0 ? Position.Top : _ref$targetPosition,
      _ref$borderRadius = _ref.borderRadius,
      borderRadius = _ref$borderRadius === void 0 ? 5 : _ref$borderRadius,
      centerX = _ref.centerX,
      centerY = _ref.centerY;

  var _getCenter = getCenter({
    sourceX: sourceX,
    sourceY: sourceY,
    targetX: targetX,
    targetY: targetY
  }),
      _getCenter2 = _slicedToArray(_getCenter, 4),
      _centerX = _getCenter2[0],
      _centerY = _getCenter2[1],
      offsetX = _getCenter2[2],
      offsetY = _getCenter2[3];

  var cornerWidth = Math.min(borderRadius, Math.abs(targetX - sourceX));
  var cornerHeight = Math.min(borderRadius, Math.abs(targetY - sourceY));
  var cornerSize = Math.min(cornerWidth, cornerHeight, offsetX, offsetY);
  var leftAndRight = [Position.Left, Position.Right];
  var cX = typeof centerX !== 'undefined' ? centerX : _centerX;
  var cY = typeof centerY !== 'undefined' ? centerY : _centerY;
  var firstCornerPath = null;
  var secondCornerPath = null;

  if (sourceX <= targetX) {
    firstCornerPath = sourceY <= targetY ? bottomLeftCorner(sourceX, cY, cornerSize) : topLeftCorner(sourceX, cY, cornerSize);
    secondCornerPath = sourceY <= targetY ? rightTopCorner(targetX, cY, cornerSize) : rightBottomCorner(targetX, cY, cornerSize);
  } else {
    firstCornerPath = sourceY < targetY ? bottomRightCorner(sourceX, cY, cornerSize) : topRightCorner(sourceX, cY, cornerSize);
    secondCornerPath = sourceY < targetY ? leftTopCorner(targetX, cY, cornerSize) : leftBottomCorner(targetX, cY, cornerSize);
  }

  if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    if (sourceX <= targetX) {
      firstCornerPath = sourceY <= targetY ? rightTopCorner(cX, sourceY, cornerSize) : rightBottomCorner(cX, sourceY, cornerSize);
      secondCornerPath = sourceY <= targetY ? bottomLeftCorner(cX, targetY, cornerSize) : topLeftCorner(cX, targetY, cornerSize);
    } else if (sourcePosition === Position.Right && targetPosition === Position.Left || sourcePosition === Position.Left && targetPosition === Position.Right || sourcePosition === Position.Left && targetPosition === Position.Left) {
      // and sourceX > targetX
      firstCornerPath = sourceY <= targetY ? leftTopCorner(cX, sourceY, cornerSize) : leftBottomCorner(cX, sourceY, cornerSize);
      secondCornerPath = sourceY <= targetY ? bottomRightCorner(cX, targetY, cornerSize) : topRightCorner(cX, targetY, cornerSize);
    }
  } else if (leftAndRight.includes(sourcePosition) && !leftAndRight.includes(targetPosition)) {
    if (sourceX <= targetX) {
      firstCornerPath = sourceY <= targetY ? rightTopCorner(targetX, sourceY, cornerSize) : rightBottomCorner(targetX, sourceY, cornerSize);
    } else {
      firstCornerPath = sourceY <= targetY ? leftTopCorner(targetX, sourceY, cornerSize) : leftBottomCorner(targetX, sourceY, cornerSize);
    }

    secondCornerPath = '';
  } else if (!leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    if (sourceX <= targetX) {
      firstCornerPath = sourceY <= targetY ? bottomLeftCorner(sourceX, targetY, cornerSize) : topLeftCorner(sourceX, targetY, cornerSize);
    } else {
      firstCornerPath = sourceY <= targetY ? bottomRightCorner(sourceX, targetY, cornerSize) : topRightCorner(sourceX, targetY, cornerSize);
    }

    secondCornerPath = '';
  }

  return "M ".concat(sourceX, ",").concat(sourceY).concat(firstCornerPath).concat(secondCornerPath, "L ").concat(targetX, ",").concat(targetY);
}
var SmoothStepEdge = /*#__PURE__*/memo(function (_ref2) {
  var sourceX = _ref2.sourceX,
      sourceY = _ref2.sourceY,
      targetX = _ref2.targetX,
      targetY = _ref2.targetY,
      label = _ref2.label,
      labelStyle = _ref2.labelStyle,
      labelShowBg = _ref2.labelShowBg,
      labelBgStyle = _ref2.labelBgStyle,
      labelBgPadding = _ref2.labelBgPadding,
      labelBgBorderRadius = _ref2.labelBgBorderRadius,
      style = _ref2.style,
      _ref2$sourcePosition = _ref2.sourcePosition,
      sourcePosition = _ref2$sourcePosition === void 0 ? Position.Bottom : _ref2$sourcePosition,
      _ref2$targetPosition = _ref2.targetPosition,
      targetPosition = _ref2$targetPosition === void 0 ? Position.Top : _ref2$targetPosition,
      markerEnd = _ref2.markerEnd,
      markerStart = _ref2.markerStart,
      _ref2$borderRadius = _ref2.borderRadius,
      borderRadius = _ref2$borderRadius === void 0 ? 5 : _ref2$borderRadius;

  var _getCenter3 = getCenter({
    sourceX: sourceX,
    sourceY: sourceY,
    targetX: targetX,
    targetY: targetY,
    sourcePosition: sourcePosition,
    targetPosition: targetPosition
  }),
      _getCenter4 = _slicedToArray(_getCenter3, 2),
      centerX = _getCenter4[0],
      centerY = _getCenter4[1];

  var path = getSmoothStepPath({
    sourceX: sourceX,
    sourceY: sourceY,
    sourcePosition: sourcePosition,
    targetX: targetX,
    targetY: targetY,
    targetPosition: targetPosition,
    borderRadius: borderRadius
  });
  var text = label ? /*#__PURE__*/React__default.createElement(EdgeText$1, {
    x: centerX,
    y: centerY,
    label: label,
    labelStyle: labelStyle,
    labelShowBg: labelShowBg,
    labelBgStyle: labelBgStyle,
    labelBgPadding: labelBgPadding,
    labelBgBorderRadius: labelBgBorderRadius
  }) : null;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("path", {
    style: style,
    className: "react-flow__edge-path",
    d: path,
    markerEnd: markerEnd,
    markerStart: markerStart
  }), text);
});

function ownKeys$b(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$b(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$b(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$b(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var selector$a = function selector(s) {
  return {
    nodeInternals: s.nodeInternals,
    transform: s.transform
  };
};

var getSourceHandle = function getSourceHandle(handleId, sourceNode, connectionHandleType) {
  var _sourceNode$handleBou, _sourceNode$handleBou2;

  var handleTypeInverted = connectionHandleType === 'source' ? 'target' : 'source';
  var handleBound = ((_sourceNode$handleBou = sourceNode.handleBounds) === null || _sourceNode$handleBou === void 0 ? void 0 : _sourceNode$handleBou[connectionHandleType]) || ((_sourceNode$handleBou2 = sourceNode.handleBounds) === null || _sourceNode$handleBou2 === void 0 ? void 0 : _sourceNode$handleBou2[handleTypeInverted]);
  return handleId ? handleBound === null || handleBound === void 0 ? void 0 : handleBound.find(function (d) {
    return d.id === handleId;
  }) : handleBound === null || handleBound === void 0 ? void 0 : handleBound[0];
};

var ConnectionLine = (function (_ref) {
  var _sourceNode$current$h, _sourceNode$current$w, _sourceNode$current, _sourceNode$current$h2, _sourceNode$current2, _sourceNode$current$p, _sourceNode$current$p2;

  var connectionNodeId = _ref.connectionNodeId,
      connectionHandleId = _ref.connectionHandleId,
      connectionHandleType = _ref.connectionHandleType,
      connectionLineStyle = _ref.connectionLineStyle,
      connectionPositionX = _ref.connectionPositionX,
      connectionPositionY = _ref.connectionPositionY,
      _ref$connectionLineTy = _ref.connectionLineType,
      connectionLineType = _ref$connectionLineTy === void 0 ? ConnectionLineType.Bezier : _ref$connectionLineTy,
      isConnectable = _ref.isConnectable,
      CustomConnectionLineComponent = _ref.CustomConnectionLineComponent;
  var nodeId = connectionNodeId;
  var handleId = connectionHandleId;

  var _useStore = useStore(selector$a, shallow),
      nodeInternals = _useStore.nodeInternals,
      transform = _useStore.transform;

  var sourceNode = useRef(nodeInternals.get(nodeId));

  if (!sourceNode.current || !sourceNode.current || !isConnectable || !((_sourceNode$current$h = sourceNode.current.handleBounds) !== null && _sourceNode$current$h !== void 0 && _sourceNode$current$h[connectionHandleType])) {
    return null;
  }

  var sourceHandle = getSourceHandle(handleId, sourceNode.current, connectionHandleType);
  var sourceHandleX = sourceHandle ? sourceHandle.x + sourceHandle.width / 2 : ((_sourceNode$current$w = (_sourceNode$current = sourceNode.current) === null || _sourceNode$current === void 0 ? void 0 : _sourceNode$current.width) !== null && _sourceNode$current$w !== void 0 ? _sourceNode$current$w : 0) / 2;
  var sourceHandleY = sourceHandle ? sourceHandle.y + sourceHandle.height / 2 : (_sourceNode$current$h2 = (_sourceNode$current2 = sourceNode.current) === null || _sourceNode$current2 === void 0 ? void 0 : _sourceNode$current2.height) !== null && _sourceNode$current$h2 !== void 0 ? _sourceNode$current$h2 : 0;
  var sourceX = (((_sourceNode$current$p = sourceNode.current.positionAbsolute) === null || _sourceNode$current$p === void 0 ? void 0 : _sourceNode$current$p.x) || 0) + sourceHandleX;
  var sourceY = (((_sourceNode$current$p2 = sourceNode.current.positionAbsolute) === null || _sourceNode$current$p2 === void 0 ? void 0 : _sourceNode$current$p2.y) || 0) + sourceHandleY;
  var targetX = (connectionPositionX - transform[0]) / transform[2];
  var targetY = (connectionPositionY - transform[1]) / transform[2];
  var isRightOrLeft = (sourceHandle === null || sourceHandle === void 0 ? void 0 : sourceHandle.position) === Position.Left || (sourceHandle === null || sourceHandle === void 0 ? void 0 : sourceHandle.position) === Position.Right;
  var targetPosition = isRightOrLeft ? Position.Left : Position.Top;

  if (CustomConnectionLineComponent) {
    return /*#__PURE__*/React__default.createElement("g", {
      className: "react-flow__connection"
    }, /*#__PURE__*/React__default.createElement(CustomConnectionLineComponent, {
      sourceX: sourceX,
      sourceY: sourceY,
      sourcePosition: sourceHandle === null || sourceHandle === void 0 ? void 0 : sourceHandle.position,
      targetX: targetX,
      targetY: targetY,
      targetPosition: targetPosition,
      connectionLineType: connectionLineType,
      connectionLineStyle: connectionLineStyle,
      sourceNode: sourceNode.current,
      sourceHandle: sourceHandle
    }));
  }

  var dAttr = '';
  var pathParams = {
    sourceX: sourceX,
    sourceY: sourceY,
    sourcePosition: sourceHandle === null || sourceHandle === void 0 ? void 0 : sourceHandle.position,
    targetX: targetX,
    targetY: targetY,
    targetPosition: targetPosition
  };

  if (connectionLineType === ConnectionLineType.Bezier) {
    dAttr = getBezierPath(pathParams);
  } else if (connectionLineType === ConnectionLineType.Step) {
    dAttr = getSmoothStepPath(_objectSpread$b(_objectSpread$b({}, pathParams), {}, {
      borderRadius: 0
    }));
  } else if (connectionLineType === ConnectionLineType.SmoothStep) {
    dAttr = getSmoothStepPath(pathParams);
  } else {
    dAttr = "M".concat(sourceX, ",").concat(sourceY, " ").concat(targetX, ",").concat(targetY);
  }

  return /*#__PURE__*/React__default.createElement("g", {
    className: "react-flow__connection"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: dAttr,
    className: "react-flow__connection-path",
    style: connectionLineStyle
  }));
});

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

var _MarkerSymbols;

var ArrowSymbol = function ArrowSymbol(_ref) {
  var _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'none' : _ref$color,
      _ref$strokeWidth = _ref.strokeWidth,
      strokeWidth = _ref$strokeWidth === void 0 ? 1 : _ref$strokeWidth;
  return /*#__PURE__*/React__default.createElement("polyline", {
    stroke: color,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: strokeWidth,
    fill: "none",
    points: "-5,-4 0,0 -5,4"
  });
};

var ArrowClosedSymbol = function ArrowClosedSymbol(_ref2) {
  var _ref2$color = _ref2.color,
      color = _ref2$color === void 0 ? 'none' : _ref2$color,
      _ref2$strokeWidth = _ref2.strokeWidth,
      strokeWidth = _ref2$strokeWidth === void 0 ? 1 : _ref2$strokeWidth;
  return /*#__PURE__*/React__default.createElement("polyline", {
    stroke: color,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: strokeWidth,
    fill: color,
    points: "-5,-4 0,0 -5,4 -5,-4"
  });
};

var MarkerSymbols = (_MarkerSymbols = {}, _defineProperty(_MarkerSymbols, MarkerType.Arrow, ArrowSymbol), _defineProperty(_MarkerSymbols, MarkerType.ArrowClosed, ArrowClosedSymbol), _MarkerSymbols);
function useMarkerSymbol(type) {
  var symbol = useMemo(function () {
    var symbolExists = MarkerSymbols.hasOwnProperty(type);

    if (!symbolExists) {
      console.warn("marker type \"".concat(type, "\" doesn't exist."));
      return function () {
        return null;
      };
    }

    return MarkerSymbols[type];
  }, [type]);
  return symbol;
}

function ownKeys$a(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$a(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$a(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$a(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var Marker = function Marker(_ref) {
  var id = _ref.id,
      type = _ref.type,
      color = _ref.color,
      _ref$width = _ref.width,
      width = _ref$width === void 0 ? 12.5 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === void 0 ? 12.5 : _ref$height,
      _ref$markerUnits = _ref.markerUnits,
      markerUnits = _ref$markerUnits === void 0 ? 'strokeWidth' : _ref$markerUnits,
      strokeWidth = _ref.strokeWidth,
      _ref$orient = _ref.orient,
      orient = _ref$orient === void 0 ? 'auto' : _ref$orient;

  var _Symbol = useMarkerSymbol(type);

  return /*#__PURE__*/React__default.createElement("marker", {
    className: "react-flow__arrowhead",
    id: id,
    markerWidth: "".concat(width),
    markerHeight: "".concat(height),
    viewBox: "-10 -10 20 20",
    markerUnits: markerUnits,
    orient: orient,
    refX: "0",
    refY: "0"
  }, /*#__PURE__*/React__default.createElement(_Symbol, {
    color: color,
    strokeWidth: strokeWidth
  }));
};

var edgesSelector$1 = function edgesSelector(s) {
  return s.edges;
};

var MarkerDefinitions = function MarkerDefinitions(_ref2) {
  var defaultColor = _ref2.defaultColor;
  var edges = useStore(edgesSelector$1);
  var markers = useMemo(function () {
    var ids = [];
    return edges.reduce(function (markers, edge) {
      [edge.markerStart, edge.markerEnd].forEach(function (marker) {
        if (marker && _typeof(marker) === 'object') {
          var markerId = getMarkerId(marker);

          if (!ids.includes(markerId)) {
            markers.push(_objectSpread$a({
              id: markerId,
              color: marker.color || defaultColor
            }, marker));
            ids.push(markerId);
          }
        }
      });
      return markers.sort(function (a, b) {
        return a.id.localeCompare(b.id);
      });
    }, []);
  }, [edges, defaultColor]);
  return /*#__PURE__*/React__default.createElement("defs", null, markers.map(function (marker) {
    return /*#__PURE__*/React__default.createElement(Marker, {
      id: marker.id,
      key: marker.id,
      type: marker.type,
      color: marker.color,
      width: marker.width,
      height: marker.height,
      markerUnits: marker.markerUnits,
      strokeWidth: marker.strokeWidth,
      orient: marker.orient
    });
  }));
};

MarkerDefinitions.displayName = 'MarkerDefinitions';

function ownKeys$9(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$9(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$9(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$9(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var StepEdge = /*#__PURE__*/memo(function (props) {
  return /*#__PURE__*/React__default.createElement(SmoothStepEdge, _objectSpread$9(_objectSpread$9({}, props), {}, {
    borderRadius: 0
  }));
});

var StraightEdge = /*#__PURE__*/memo(function (_ref) {
  var sourceX = _ref.sourceX,
      sourceY = _ref.sourceY,
      targetX = _ref.targetX,
      targetY = _ref.targetY,
      label = _ref.label,
      labelStyle = _ref.labelStyle,
      labelShowBg = _ref.labelShowBg,
      labelBgStyle = _ref.labelBgStyle,
      labelBgPadding = _ref.labelBgPadding,
      labelBgBorderRadius = _ref.labelBgBorderRadius,
      style = _ref.style,
      markerEnd = _ref.markerEnd,
      markerStart = _ref.markerStart;
  var yOffset = Math.abs(targetY - sourceY) / 2;
  var centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
  var xOffset = Math.abs(targetX - sourceX) / 2;
  var centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
  var text = label ? /*#__PURE__*/React__default.createElement(EdgeText$1, {
    x: centerX,
    y: centerY,
    label: label,
    labelStyle: labelStyle,
    labelShowBg: labelShowBg,
    labelBgStyle: labelBgStyle,
    labelBgPadding: labelBgPadding,
    labelBgBorderRadius: labelBgBorderRadius
  }) : null;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("path", {
    style: style,
    className: "react-flow__edge-path",
    d: "M ".concat(sourceX, ",").concat(sourceY, "L ").concat(targetX, ",").concat(targetY),
    markerEnd: markerEnd,
    markerStart: markerStart
  }), text);
});

function checkElementBelowIsValid(event, connectionMode, isTarget, nodeId, handleId, isValidConnection, doc) {
  var elementBelow = doc.elementFromPoint(event.clientX, event.clientY);
  var elementBelowIsTarget = (elementBelow === null || elementBelow === void 0 ? void 0 : elementBelow.classList.contains('target')) || false;
  var elementBelowIsSource = (elementBelow === null || elementBelow === void 0 ? void 0 : elementBelow.classList.contains('source')) || false;
  var result = {
    elementBelow: elementBelow,
    isValid: false,
    connection: {
      source: null,
      target: null,
      sourceHandle: null,
      targetHandle: null
    },
    isHoveringHandle: false
  };

  if (elementBelow && (elementBelowIsTarget || elementBelowIsSource)) {
    result.isHoveringHandle = true; // in strict mode we don't allow target to target or source to source connections

    var isValid = connectionMode === ConnectionMode.Strict ? isTarget && elementBelowIsSource || !isTarget && elementBelowIsTarget : true;

    if (isValid) {
      var elementBelowNodeId = elementBelow.getAttribute('data-nodeid');
      var elementBelowHandleId = elementBelow.getAttribute('data-handleid');
      var connection = isTarget ? {
        source: elementBelowNodeId,
        sourceHandle: elementBelowHandleId,
        target: nodeId,
        targetHandle: handleId
      } : {
        source: nodeId,
        sourceHandle: handleId,
        target: elementBelowNodeId,
        targetHandle: elementBelowHandleId
      };
      result.connection = connection;
      result.isValid = isValidConnection(connection);
    }
  }

  return result;
}

function resetRecentHandle(hoveredHandle) {
  hoveredHandle === null || hoveredHandle === void 0 ? void 0 : hoveredHandle.classList.remove('react-flow__handle-valid');
  hoveredHandle === null || hoveredHandle === void 0 ? void 0 : hoveredHandle.classList.remove('react-flow__handle-connecting');
}

function onMouseDown(event, handleId, nodeId, setState, onConnect, isTarget, isValidConnection, connectionMode, elementEdgeUpdaterType, onEdgeUpdateEnd, onConnectStart, onConnectStop, onConnectEnd) {
  var reactFlowNode = event.target.closest('.react-flow'); // when react-flow is used inside a shadow root we can't use document

  var doc = getHostForElement(event.target);

  if (!doc) {
    return;
  }

  var elementBelow = doc.elementFromPoint(event.clientX, event.clientY);
  var elementBelowIsTarget = elementBelow === null || elementBelow === void 0 ? void 0 : elementBelow.classList.contains('target');
  var elementBelowIsSource = elementBelow === null || elementBelow === void 0 ? void 0 : elementBelow.classList.contains('source');

  if (!reactFlowNode || !elementBelowIsTarget && !elementBelowIsSource && !elementEdgeUpdaterType) {
    return;
  }

  var handleType = elementEdgeUpdaterType ? elementEdgeUpdaterType : elementBelowIsTarget ? 'target' : 'source';
  var containerBounds = reactFlowNode.getBoundingClientRect();
  var recentHoveredHandle;
  setState({
    connectionPosition: {
      x: event.clientX - containerBounds.left,
      y: event.clientY - containerBounds.top
    },
    connectionNodeId: nodeId,
    connectionHandleId: handleId,
    connectionHandleType: handleType
  });
  onConnectStart === null || onConnectStart === void 0 ? void 0 : onConnectStart(event, {
    nodeId: nodeId,
    handleId: handleId,
    handleType: handleType
  });

  function onMouseMove(event) {
    setState({
      connectionPosition: {
        x: event.clientX - containerBounds.left,
        y: event.clientY - containerBounds.top
      }
    });

    var _checkElementBelowIsV = checkElementBelowIsValid(event, connectionMode, isTarget, nodeId, handleId, isValidConnection, doc),
        connection = _checkElementBelowIsV.connection,
        elementBelow = _checkElementBelowIsV.elementBelow,
        isValid = _checkElementBelowIsV.isValid,
        isHoveringHandle = _checkElementBelowIsV.isHoveringHandle;

    if (!isHoveringHandle) {
      return resetRecentHandle(recentHoveredHandle);
    }

    var isOwnHandle = connection.source === connection.target;

    if (!isOwnHandle && elementBelow) {
      recentHoveredHandle = elementBelow;
      elementBelow.classList.add('react-flow__handle-connecting');
      elementBelow.classList.toggle('react-flow__handle-valid', isValid);
    }
  }

  function onMouseUp(event) {
    var _checkElementBelowIsV2 = checkElementBelowIsValid(event, connectionMode, isTarget, nodeId, handleId, isValidConnection, doc),
        connection = _checkElementBelowIsV2.connection,
        isValid = _checkElementBelowIsV2.isValid;

    onConnectStop === null || onConnectStop === void 0 ? void 0 : onConnectStop(event);

    if (isValid) {
      onConnect === null || onConnect === void 0 ? void 0 : onConnect(connection);
    }

    onConnectEnd === null || onConnectEnd === void 0 ? void 0 : onConnectEnd(event);

    if (elementEdgeUpdaterType && onEdgeUpdateEnd) {
      onEdgeUpdateEnd(event);
    }

    resetRecentHandle(recentHoveredHandle);
    setState({
      connectionNodeId: null,
      connectionHandleId: null,
      connectionHandleType: null
    });
    doc.removeEventListener('mousemove', onMouseMove);
    doc.removeEventListener('mouseup', onMouseUp);
  }

  doc.addEventListener('mousemove', onMouseMove);
  doc.addEventListener('mouseup', onMouseUp);
}

var shiftX = function shiftX(x, shift, position) {
  if (position === Position.Left) return x - shift;
  if (position === Position.Right) return x + shift;
  return x;
};

var shiftY = function shiftY(y, shift, position) {
  if (position === Position.Top) return y - shift;
  if (position === Position.Bottom) return y + shift;
  return y;
};

var EdgeAnchor = function EdgeAnchor(_ref) {
  var className = _ref.className,
      position = _ref.position,
      centerX = _ref.centerX,
      centerY = _ref.centerY,
      _ref$radius = _ref.radius,
      radius = _ref$radius === void 0 ? 10 : _ref$radius;
  return /*#__PURE__*/React__default.createElement("circle", {
    className: cc(['react-flow__edgeupdater', className]),
    cx: shiftX(centerX, radius, position),
    cy: shiftY(centerY, radius, position),
    r: radius,
    stroke: "transparent",
    fill: "transparent"
  });
};

var selector$9 = function selector(s) {
  return {
    addSelectedEdges: s.addSelectedEdges,
    connectionMode: s.connectionMode
  };
};

var wrapEdge = (function (EdgeComponent) {
  var EdgeWrapper = function EdgeWrapper(_ref) {
    var id = _ref.id,
        className = _ref.className,
        type = _ref.type,
        data = _ref.data,
        onClick = _ref.onClick,
        onEdgeDoubleClick = _ref.onEdgeDoubleClick,
        selected = _ref.selected,
        animated = _ref.animated,
        label = _ref.label,
        labelStyle = _ref.labelStyle,
        labelShowBg = _ref.labelShowBg,
        labelBgStyle = _ref.labelBgStyle,
        labelBgPadding = _ref.labelBgPadding,
        labelBgBorderRadius = _ref.labelBgBorderRadius,
        style = _ref.style,
        source = _ref.source,
        target = _ref.target,
        sourceX = _ref.sourceX,
        sourceY = _ref.sourceY,
        targetX = _ref.targetX,
        targetY = _ref.targetY,
        sourcePosition = _ref.sourcePosition,
        targetPosition = _ref.targetPosition,
        elementsSelectable = _ref.elementsSelectable,
        hidden = _ref.hidden,
        sourceHandleId = _ref.sourceHandleId,
        targetHandleId = _ref.targetHandleId,
        onContextMenu = _ref.onContextMenu,
        onMouseEnter = _ref.onMouseEnter,
        onMouseMove = _ref.onMouseMove,
        onMouseLeave = _ref.onMouseLeave,
        edgeUpdaterRadius = _ref.edgeUpdaterRadius,
        onEdgeUpdate = _ref.onEdgeUpdate,
        onEdgeUpdateStart = _ref.onEdgeUpdateStart,
        onEdgeUpdateEnd = _ref.onEdgeUpdateEnd,
        markerEnd = _ref.markerEnd,
        markerStart = _ref.markerStart;
    var store = useStoreApi();

    var _useStore = useStore(selector$9, shallow),
        addSelectedEdges = _useStore.addSelectedEdges,
        connectionMode = _useStore.connectionMode;

    var _useState = useState(false),
        _useState2 = _slicedToArray(_useState, 2),
        updating = _useState2[0],
        setUpdating = _useState2[1];

    var inactive = !elementsSelectable && !onClick;
    var handleEdgeUpdate = typeof onEdgeUpdate !== 'undefined';
    var edgeClasses = cc(['react-flow__edge', "react-flow__edge-".concat(type), className, {
      selected: selected,
      animated: animated,
      inactive: inactive,
      updating: updating
    }]);
    var edgeElement = useMemo(function () {
      var el = {
        id: id,
        source: source,
        target: target,
        type: type
      };

      if (sourceHandleId) {
        el.sourceHandle = sourceHandleId;
      }

      if (targetHandleId) {
        el.targetHandle = targetHandleId;
      }

      if (typeof data !== 'undefined') {
        el.data = data;
      }

      return el;
    }, [id, source, target, type, sourceHandleId, targetHandleId, data]);
    var onEdgeClick = useCallback(function (event) {
      if (elementsSelectable) {
        store.setState({
          nodesSelectionActive: false
        });
        addSelectedEdges([edgeElement.id]);
      }

      onClick === null || onClick === void 0 ? void 0 : onClick(event, edgeElement);
    }, [elementsSelectable, edgeElement, onClick]);
    var onEdgeDoubleClickHandler = useCallback(function (event) {
      onEdgeDoubleClick === null || onEdgeDoubleClick === void 0 ? void 0 : onEdgeDoubleClick(event, edgeElement);
    }, [edgeElement, onEdgeDoubleClick]);
    var onEdgeContextMenu = useCallback(function (event) {
      onContextMenu === null || onContextMenu === void 0 ? void 0 : onContextMenu(event, edgeElement);
    }, [edgeElement, onContextMenu]);
    var onEdgeMouseEnter = useCallback(function (event) {
      onMouseEnter === null || onMouseEnter === void 0 ? void 0 : onMouseEnter(event, edgeElement);
    }, [edgeElement, onContextMenu]);
    var onEdgeMouseMove = useCallback(function (event) {
      onMouseMove === null || onMouseMove === void 0 ? void 0 : onMouseMove(event, edgeElement);
    }, [edgeElement, onContextMenu]);
    var onEdgeMouseLeave = useCallback(function (event) {
      onMouseLeave === null || onMouseLeave === void 0 ? void 0 : onMouseLeave(event, edgeElement);
    }, [edgeElement, onContextMenu]);
    var handleEdgeUpdater = useCallback(function (event, isSourceHandle) {
      var nodeId = isSourceHandle ? target : source;
      var handleId = isSourceHandle ? targetHandleId : sourceHandleId;

      var isValidConnection = function isValidConnection() {
        return true;
      };

      var isTarget = isSourceHandle;
      onEdgeUpdateStart === null || onEdgeUpdateStart === void 0 ? void 0 : onEdgeUpdateStart(event, edgeElement);

      var _onEdgeUpdate = onEdgeUpdateEnd ? function (evt) {
        return onEdgeUpdateEnd(evt, edgeElement);
      } : undefined;

      var onConnectEdge = function onConnectEdge(connection) {
        var _store$getState = store.getState(),
            edges = _store$getState.edges;

        var edge = edges.find(function (e) {
          return e.id === id;
        });

        if (edge && onEdgeUpdate) {
          onEdgeUpdate(edge, connection);
        }
      };

      onMouseDown(event, handleId, nodeId, store.setState, onConnectEdge, isTarget, isValidConnection, connectionMode, isSourceHandle ? 'target' : 'source', _onEdgeUpdate, store.getState);
    }, [id, source, target, type, sourceHandleId, targetHandleId, edgeElement, onEdgeUpdate]);
    var onEdgeUpdaterSourceMouseDown = useCallback(function (event) {
      handleEdgeUpdater(event, true);
    }, [id, source, sourceHandleId, handleEdgeUpdater]);
    var onEdgeUpdaterTargetMouseDown = useCallback(function (event) {
      handleEdgeUpdater(event, false);
    }, [id, target, targetHandleId, handleEdgeUpdater]);
    var onEdgeUpdaterMouseEnter = useCallback(function () {
      return setUpdating(true);
    }, [setUpdating]);
    var onEdgeUpdaterMouseOut = useCallback(function () {
      return setUpdating(false);
    }, [setUpdating]);
    var markerStartUrl = useMemo(function () {
      return "url(#".concat(getMarkerId(markerStart), ")");
    }, [markerStart]);
    var markerEndUrl = useMemo(function () {
      return "url(#".concat(getMarkerId(markerEnd), ")");
    }, [markerEnd]);

    if (hidden) {
      return null;
    }

    return /*#__PURE__*/React__default.createElement("g", {
      className: edgeClasses,
      onClick: onEdgeClick,
      onDoubleClick: onEdgeDoubleClickHandler,
      onContextMenu: onEdgeContextMenu,
      onMouseEnter: onEdgeMouseEnter,
      onMouseMove: onEdgeMouseMove,
      onMouseLeave: onEdgeMouseLeave
    }, /*#__PURE__*/React__default.createElement(EdgeComponent, {
      id: id,
      source: source,
      target: target,
      selected: selected,
      animated: animated,
      label: label,
      labelStyle: labelStyle,
      labelShowBg: labelShowBg,
      labelBgStyle: labelBgStyle,
      labelBgPadding: labelBgPadding,
      labelBgBorderRadius: labelBgBorderRadius,
      data: data,
      style: style,
      sourceX: sourceX,
      sourceY: sourceY,
      targetX: targetX,
      targetY: targetY,
      sourcePosition: sourcePosition,
      targetPosition: targetPosition,
      sourceHandleId: sourceHandleId,
      targetHandleId: targetHandleId,
      markerStart: markerStartUrl,
      markerEnd: markerEndUrl
    }), handleEdgeUpdate && /*#__PURE__*/React__default.createElement("g", {
      onMouseDown: onEdgeUpdaterSourceMouseDown,
      onMouseEnter: onEdgeUpdaterMouseEnter,
      onMouseOut: onEdgeUpdaterMouseOut
    }, /*#__PURE__*/React__default.createElement(EdgeAnchor, {
      position: sourcePosition,
      centerX: sourceX,
      centerY: sourceY,
      radius: edgeUpdaterRadius
    })), handleEdgeUpdate && /*#__PURE__*/React__default.createElement("g", {
      onMouseDown: onEdgeUpdaterTargetMouseDown,
      onMouseEnter: onEdgeUpdaterMouseEnter,
      onMouseOut: onEdgeUpdaterMouseOut
    }, /*#__PURE__*/React__default.createElement(EdgeAnchor, {
      position: targetPosition,
      centerX: targetX,
      centerY: targetY,
      radius: edgeUpdaterRadius
    })));
  };

  EdgeWrapper.displayName = 'EdgeWrapper';
  return /*#__PURE__*/memo(EdgeWrapper);
});

function ownKeys$8(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$8(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$8(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$8(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function createEdgeTypes(edgeTypes) {
  var standardTypes = {
    "default": wrapEdge(edgeTypes["default"] || BezierEdge),
    straight: wrapEdge(edgeTypes.bezier || StraightEdge),
    step: wrapEdge(edgeTypes.step || StepEdge),
    smoothstep: wrapEdge(edgeTypes.step || SmoothStepEdge)
  };
  var wrappedTypes = {};
  var specialTypes = Object.keys(edgeTypes).filter(function (k) {
    return !['default', 'bezier'].includes(k);
  }).reduce(function (res, key) {
    res[key] = wrapEdge(edgeTypes[key] || BezierEdge);
    return res;
  }, wrappedTypes);
  return _objectSpread$8(_objectSpread$8({}, standardTypes), specialTypes);
}
function getHandlePosition(position, nodeRect) {
  var handle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var x = ((handle === null || handle === void 0 ? void 0 : handle.x) || 0) + nodeRect.x;
  var y = ((handle === null || handle === void 0 ? void 0 : handle.y) || 0) + nodeRect.y;
  var width = (handle === null || handle === void 0 ? void 0 : handle.width) || nodeRect.width;
  var height = (handle === null || handle === void 0 ? void 0 : handle.height) || nodeRect.height;

  switch (position) {
    case Position.Top:
      return {
        x: x + width / 2,
        y: y
      };

    case Position.Right:
      return {
        x: x + width,
        y: y + height / 2
      };

    case Position.Bottom:
      return {
        x: x + width / 2,
        y: y + height
      };

    case Position.Left:
      return {
        x: x,
        y: y + height / 2
      };
  }
}
function getHandle(bounds, handleId) {
  if (!bounds) {
    return null;
  } // there is no handleId when there are no multiple handles/ handles with ids
  // so we just pick the first one


  var handle = null;

  if (bounds.length === 1 || !handleId) {
    handle = bounds[0];
  } else if (handleId) {
    handle = bounds.find(function (d) {
      return d.id === handleId;
    });
  }

  return typeof handle === 'undefined' ? null : handle;
}
var getEdgePositions = function getEdgePositions(sourceNodeRect, sourceHandle, sourcePosition, targetNodeRect, targetHandle, targetPosition) {
  var sourceHandlePos = getHandlePosition(sourcePosition, sourceNodeRect, sourceHandle);
  var targetHandlePos = getHandlePosition(targetPosition, targetNodeRect, targetHandle);
  return {
    sourceX: sourceHandlePos.x,
    sourceY: sourceHandlePos.y,
    targetX: targetHandlePos.x,
    targetY: targetHandlePos.y
  };
};
function isEdgeVisible(_ref) {
  var sourcePos = _ref.sourcePos,
      targetPos = _ref.targetPos,
      sourceWidth = _ref.sourceWidth,
      sourceHeight = _ref.sourceHeight,
      targetWidth = _ref.targetWidth,
      targetHeight = _ref.targetHeight,
      width = _ref.width,
      height = _ref.height,
      transform = _ref.transform;
  var edgeBox = {
    x: Math.min(sourcePos.x, targetPos.x),
    y: Math.min(sourcePos.y, targetPos.y),
    x2: Math.max(sourcePos.x + sourceWidth, targetPos.x + targetWidth),
    y2: Math.max(sourcePos.y + sourceHeight, targetPos.y + targetHeight)
  };

  if (edgeBox.x === edgeBox.x2) {
    edgeBox.x2 += 1;
  }

  if (edgeBox.y === edgeBox.y2) {
    edgeBox.y2 += 1;
  }

  var viewBox = rectToBox({
    x: (0 - transform[0]) / transform[2],
    y: (0 - transform[1]) / transform[2],
    width: width / transform[2],
    height: height / transform[2]
  });
  var xOverlap = Math.max(0, Math.min(viewBox.x2, edgeBox.x2) - Math.max(viewBox.x, edgeBox.x));
  var yOverlap = Math.max(0, Math.min(viewBox.y2, edgeBox.y2) - Math.max(viewBox.y, edgeBox.y));
  var overlappingArea = Math.ceil(xOverlap * yOverlap);
  return overlappingArea > 0;
}
function getNodeData(nodeInternals, nodeId) {
  var _node$positionAbsolut, _node$positionAbsolut2, _node$positionAbsolut3, _node$positionAbsolut4;

  var node = nodeInternals.get(nodeId);
  var handleBounds = node === null || node === void 0 ? void 0 : node.handleBounds;
  var isInvalid = !node || !node.handleBounds || !node.width || !node.height || typeof ((_node$positionAbsolut = node.positionAbsolute) === null || _node$positionAbsolut === void 0 ? void 0 : _node$positionAbsolut.x) === 'undefined' || typeof ((_node$positionAbsolut2 = node.positionAbsolute) === null || _node$positionAbsolut2 === void 0 ? void 0 : _node$positionAbsolut2.y) === 'undefined';
  return [{
    x: (node === null || node === void 0 ? void 0 : (_node$positionAbsolut3 = node.positionAbsolute) === null || _node$positionAbsolut3 === void 0 ? void 0 : _node$positionAbsolut3.x) || 0,
    y: (node === null || node === void 0 ? void 0 : (_node$positionAbsolut4 = node.positionAbsolute) === null || _node$positionAbsolut4 === void 0 ? void 0 : _node$positionAbsolut4.y) || 0,
    width: (node === null || node === void 0 ? void 0 : node.width) || 0,
    height: (node === null || node === void 0 ? void 0 : node.height) || 0
  }, handleBounds || null, !isInvalid];
}

var defaultEdgeTree = [{
  level: 0,
  isMaxLevel: true,
  edges: []
}];

function groupEdgesByZLevel(edges, nodeInternals) {
  var maxLevel = -1;
  var levelLookup = edges.reduce(function (tree, edge) {
    var _nodeInternals$get, _nodeInternals$get2;

    var z = isNumeric(edge.zIndex) ? edge.zIndex : Math.max(((_nodeInternals$get = nodeInternals.get(edge.source)) === null || _nodeInternals$get === void 0 ? void 0 : _nodeInternals$get.z) || 0, ((_nodeInternals$get2 = nodeInternals.get(edge.target)) === null || _nodeInternals$get2 === void 0 ? void 0 : _nodeInternals$get2.z) || 0);

    if (tree[z]) {
      tree[z].push(edge);
    } else {
      tree[z] = [edge];
    }

    maxLevel = z > maxLevel ? z : maxLevel;
    return tree;
  }, {});
  var edgeTree = Object.entries(levelLookup).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        edges = _ref2[1];

    var level = +key;
    return {
      edges: edges,
      level: level,
      isMaxLevel: level === maxLevel
    };
  });

  if (edgeTree.length === 0) {
    return defaultEdgeTree;
  }

  return edgeTree;
}

function useVisibleEdges(onlyRenderVisible, nodeInternals) {
  var edges = useStore(useCallback(function (s) {
    if (!onlyRenderVisible) {
      return s.edges;
    }

    return s.edges.filter(function (e) {
      var sourceNode = nodeInternals.get(e.source);
      var targetNode = nodeInternals.get(e.target);
      return (sourceNode === null || sourceNode === void 0 ? void 0 : sourceNode.width) && (sourceNode === null || sourceNode === void 0 ? void 0 : sourceNode.height) && (targetNode === null || targetNode === void 0 ? void 0 : targetNode.width) && (targetNode === null || targetNode === void 0 ? void 0 : targetNode.height) && isEdgeVisible({
        sourcePos: sourceNode.position || {
          x: 0,
          y: 0
        },
        targetPos: targetNode.position || {
          x: 0,
          y: 0
        },
        sourceWidth: sourceNode.width,
        sourceHeight: sourceNode.height,
        targetWidth: targetNode.width,
        targetHeight: targetNode.height,
        width: s.width,
        height: s.height,
        transform: s.transform
      });
    });
  }, [onlyRenderVisible, nodeInternals]));
  return groupEdgesByZLevel(edges, nodeInternals);
}

var selector$8 = function selector(s) {
  return {
    connectionNodeId: s.connectionNodeId,
    connectionHandleId: s.connectionHandleId,
    connectionHandleType: s.connectionHandleType,
    connectionPosition: s.connectionPosition,
    nodesConnectable: s.nodesConnectable,
    elementsSelectable: s.elementsSelectable,
    width: s.width,
    height: s.height,
    connectionMode: s.connectionMode,
    nodeInternals: s.nodeInternals
  };
};

var EdgeRenderer = function EdgeRenderer(props) {
  var _useStore = useStore(selector$8, shallow),
      connectionNodeId = _useStore.connectionNodeId,
      connectionHandleId = _useStore.connectionHandleId,
      connectionHandleType = _useStore.connectionHandleType,
      connectionPosition = _useStore.connectionPosition,
      nodesConnectable = _useStore.nodesConnectable,
      elementsSelectable = _useStore.elementsSelectable,
      width = _useStore.width,
      height = _useStore.height,
      connectionMode = _useStore.connectionMode,
      nodeInternals = _useStore.nodeInternals;

  var edgeTree = useVisibleEdges(props.onlyRenderVisibleElements, nodeInternals);

  if (!width) {
    return null;
  }

  var connectionLineType = props.connectionLineType,
      defaultMarkerColor = props.defaultMarkerColor,
      connectionLineStyle = props.connectionLineStyle,
      connectionLineComponent = props.connectionLineComponent;
  var renderConnectionLine = connectionNodeId && connectionHandleType;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, edgeTree.map(function (_ref) {
    var level = _ref.level,
        edges = _ref.edges,
        isMaxLevel = _ref.isMaxLevel;
    return /*#__PURE__*/React__default.createElement("svg", {
      key: level,
      style: {
        zIndex: level
      },
      width: width,
      height: height,
      className: "react-flow__edges react-flow__container"
    }, isMaxLevel && /*#__PURE__*/React__default.createElement(MarkerDefinitions, {
      defaultColor: defaultMarkerColor
    }), /*#__PURE__*/React__default.createElement("g", null, edges.map(function (edge) {
      var _getNodeData = getNodeData(nodeInternals, edge.source),
          _getNodeData2 = _slicedToArray(_getNodeData, 3),
          sourceNodeRect = _getNodeData2[0],
          sourceHandleBounds = _getNodeData2[1],
          sourceIsValid = _getNodeData2[2];

      var _getNodeData3 = getNodeData(nodeInternals, edge.target),
          _getNodeData4 = _slicedToArray(_getNodeData3, 3),
          targetNodeRect = _getNodeData4[0],
          targetHandleBounds = _getNodeData4[1],
          targetIsValid = _getNodeData4[2];

      if (!sourceIsValid || !targetIsValid) {
        return null;
      }

      var edgeType = edge.type || 'default';
      var EdgeComponent = props.edgeTypes[edgeType] || props.edgeTypes["default"]; // when connection type is loose we can define all handles as sources

      var targetNodeHandles = connectionMode === ConnectionMode.Strict ? targetHandleBounds.target : targetHandleBounds.target || targetHandleBounds.source;
      var sourceHandle = getHandle(sourceHandleBounds.source, edge.sourceHandle || null);
      var targetHandle = getHandle(targetNodeHandles, edge.targetHandle || null);
      var sourcePosition = (sourceHandle === null || sourceHandle === void 0 ? void 0 : sourceHandle.position) || Position.Bottom;
      var targetPosition = (targetHandle === null || targetHandle === void 0 ? void 0 : targetHandle.position) || Position.Top;

      if (!sourceHandle) {
        console.warn("couldn't create edge for source handle id: ".concat(edge.sourceHandle, "; edge id: ").concat(edge.id));
        return null;
      }

      if (!targetHandle) {
        console.warn("couldn't create edge for target handle id: ".concat(edge.targetHandle, "; edge id: ").concat(edge.id));
        return null;
      }

      var _getEdgePositions = getEdgePositions(sourceNodeRect, sourceHandle, sourcePosition, targetNodeRect, targetHandle, targetPosition),
          sourceX = _getEdgePositions.sourceX,
          sourceY = _getEdgePositions.sourceY,
          targetX = _getEdgePositions.targetX,
          targetY = _getEdgePositions.targetY;

      return /*#__PURE__*/React__default.createElement(EdgeComponent, {
        key: edge.id,
        id: edge.id,
        className: cc([edge.className, props.noPanClassName]),
        type: edgeType,
        data: edge.data,
        selected: !!edge.selected,
        animated: !!edge.animated,
        hidden: !!edge.hidden,
        label: edge.label,
        labelStyle: edge.labelStyle,
        labelShowBg: edge.labelShowBg,
        labelBgStyle: edge.labelBgStyle,
        labelBgPadding: edge.labelBgPadding,
        labelBgBorderRadius: edge.labelBgBorderRadius,
        style: edge.style,
        source: edge.source,
        target: edge.target,
        sourceHandleId: edge.sourceHandle,
        targetHandleId: edge.targetHandle,
        markerEnd: edge.markerEnd,
        markerStart: edge.markerStart,
        sourceX: sourceX,
        sourceY: sourceY,
        targetX: targetX,
        targetY: targetY,
        sourcePosition: sourcePosition,
        targetPosition: targetPosition,
        elementsSelectable: elementsSelectable,
        onEdgeUpdate: props.onEdgeUpdate,
        onContextMenu: props.onEdgeContextMenu,
        onMouseEnter: props.onEdgeMouseEnter,
        onMouseMove: props.onEdgeMouseMove,
        onMouseLeave: props.onEdgeMouseLeave,
        onClick: props.onEdgeClick,
        edgeUpdaterRadius: props.edgeUpdaterRadius,
        onEdgeDoubleClick: props.onEdgeDoubleClick,
        onEdgeUpdateStart: props.onEdgeUpdateStart,
        onEdgeUpdateEnd: props.onEdgeUpdateEnd
      });
    }), renderConnectionLine && isMaxLevel && /*#__PURE__*/React__default.createElement(ConnectionLine, {
      connectionNodeId: connectionNodeId,
      connectionHandleId: connectionHandleId,
      connectionHandleType: connectionHandleType,
      connectionPositionX: connectionPosition.x,
      connectionPositionY: connectionPosition.y,
      connectionLineStyle: connectionLineStyle,
      connectionLineType: connectionLineType,
      isConnectable: nodesConnectable,
      CustomConnectionLineComponent: connectionLineComponent
    })));
  }));
};

EdgeRenderer.displayName = 'EdgeRenderer';
var EdgeRenderer$1 = /*#__PURE__*/memo(EdgeRenderer);

var selector$7 = function selector(s) {
  return s.transform;
};

function Viewport(_ref) {
  var children = _ref.children;
  var transform = useStore(selector$7);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "react-flow__viewport react-flow__container",
    style: {
      transform: "translate(".concat(transform[0], "px,").concat(transform[1], "px) scale(").concat(transform[2], ")")
    }
  }, children);
}

var initialViewportHelper = {
  zoomIn: function zoomIn() {},
  zoomOut: function zoomOut() {},
  zoomTo: function zoomTo(_) {},
  getZoom: function getZoom() {
    return 1;
  },
  setViewport: function setViewport(_) {},
  getViewport: function getViewport() {
    return {
      x: 0,
      y: 0,
      zoom: 1
    };
  },
  fitView: function fitView() {
  },
  setCenter: function setCenter(_, __) {},
  fitBounds: function fitBounds(_) {},
  project: function project(position) {
    return position;
  },
  initialized: false
};

var selector$6 = function selector(s) {
  return {
    d3Zoom: s.d3Zoom,
    d3Selection: s.d3Selection
  };
};

var useViewportHelper = function useViewportHelper() {
  var store = useStoreApi();

  var _useStore = useStore(selector$6, shallow),
      d3Zoom = _useStore.d3Zoom,
      d3Selection = _useStore.d3Selection;

  var viewportHelperFunctions = useMemo(function () {
    if (d3Selection && d3Zoom) {
      return {
        zoomIn: function zoomIn(options) {
          return d3Zoom.scaleBy(getD3Transition(d3Selection, options === null || options === void 0 ? void 0 : options.duration), 1.2);
        },
        zoomOut: function zoomOut(options) {
          return d3Zoom.scaleBy(getD3Transition(d3Selection, options === null || options === void 0 ? void 0 : options.duration), 1 / 1.2);
        },
        zoomTo: function zoomTo(zoomLevel, options) {
          return d3Zoom.scaleTo(getD3Transition(d3Selection, options === null || options === void 0 ? void 0 : options.duration), zoomLevel);
        },
        getZoom: function getZoom() {
          var _store$getState$trans = _slicedToArray(store.getState().transform, 3),
              zoom = _store$getState$trans[2];

          return zoom;
        },
        setViewport: function setViewport(transform, options) {
          var nextTransform = zoomIdentity.translate(transform.x, transform.y).scale(transform.zoom);
          d3Zoom.transform(getD3Transition(d3Selection, options === null || options === void 0 ? void 0 : options.duration), nextTransform);
        },
        getViewport: function getViewport() {
          var _store$getState$trans2 = _slicedToArray(store.getState().transform, 3),
              x = _store$getState$trans2[0],
              y = _store$getState$trans2[1],
              zoom = _store$getState$trans2[2];

          return {
            x: x,
            y: y,
            zoom: zoom
          };
        },
        fitView: function fitView$1(options) {
          return fitView(store.getState, options);
        },
        setCenter: function setCenter(x, y, options) {
          var _store$getState = store.getState(),
              width = _store$getState.width,
              height = _store$getState.height,
              maxZoom = _store$getState.maxZoom;

          var nextZoom = typeof (options === null || options === void 0 ? void 0 : options.zoom) !== 'undefined' ? options.zoom : maxZoom;
          var centerX = width / 2 - x * nextZoom;
          var centerY = height / 2 - y * nextZoom;
          var transform = zoomIdentity.translate(centerX, centerY).scale(nextZoom);
          d3Zoom.transform(getD3Transition(d3Selection, options === null || options === void 0 ? void 0 : options.duration), transform);
        },
        fitBounds: function fitBounds(bounds, options) {
          var _options$padding;

          var _store$getState2 = store.getState(),
              width = _store$getState2.width,
              height = _store$getState2.height,
              minZoom = _store$getState2.minZoom,
              maxZoom = _store$getState2.maxZoom;

          var _getTransformForBound = getTransformForBounds(bounds, width, height, minZoom, maxZoom, (_options$padding = options === null || options === void 0 ? void 0 : options.padding) !== null && _options$padding !== void 0 ? _options$padding : 0.1),
              _getTransformForBound2 = _slicedToArray(_getTransformForBound, 3),
              x = _getTransformForBound2[0],
              y = _getTransformForBound2[1],
              zoom = _getTransformForBound2[2];

          var transform = zoomIdentity.translate(x, y).scale(zoom);
          d3Zoom.transform(getD3Transition(d3Selection, options === null || options === void 0 ? void 0 : options.duration), transform);
        },
        project: function project(position) {
          var _store$getState3 = store.getState(),
              transform = _store$getState3.transform,
              snapToGrid = _store$getState3.snapToGrid,
              snapGrid = _store$getState3.snapGrid;

          return pointToRendererPoint(position, transform, snapToGrid, snapGrid);
        },
        initialized: true
      };
    }

    return initialViewportHelper;
  }, [d3Zoom, d3Selection]);
  return viewportHelperFunctions;
};

var _excluded$3 = ["initialized"];

function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$7(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function useReactFlow() {
  var _useViewportHelper = useViewportHelper(),
      viewportInitialized = _useViewportHelper.initialized,
      viewportHelperFunctions = _objectWithoutProperties(_useViewportHelper, _excluded$3);

  var store = useStoreApi();
  var getNodes = useCallback(function () {
    var _store$getState = store.getState(),
        nodeInternals = _store$getState.nodeInternals;

    var nodes = Array.from(nodeInternals.values());
    return nodes.map(function (n) {
      return _objectSpread$7({}, n);
    });
  }, []);
  var getNode = useCallback(function (id) {
    var _store$getState2 = store.getState(),
        nodeInternals = _store$getState2.nodeInternals;

    return nodeInternals.get(id);
  }, []);
  var getEdges = useCallback(function () {
    var _store$getState3 = store.getState(),
        _store$getState3$edge = _store$getState3.edges,
        edges = _store$getState3$edge === void 0 ? [] : _store$getState3$edge;

    return edges.map(function (e) {
      return _objectSpread$7({}, e);
    });
  }, []);
  var getEdge = useCallback(function (id) {
    var _store$getState4 = store.getState(),
        _store$getState4$edge = _store$getState4.edges,
        edges = _store$getState4$edge === void 0 ? [] : _store$getState4$edge;

    return edges.find(function (e) {
      return e.id === id;
    });
  }, []);
  var setNodes = useCallback(function (payload) {
    var _store$getState5 = store.getState(),
        nodeInternals = _store$getState5.nodeInternals,
        setNodes = _store$getState5.setNodes;

    var nodes = Array.from(nodeInternals.values());
    var nextNodes = typeof payload === 'function' ? payload(nodes) : payload;
    setNodes(nextNodes);
  }, []);
  var setEdges = useCallback(function (payload) {
    var _store$getState6 = store.getState(),
        _store$getState6$edge = _store$getState6.edges,
        edges = _store$getState6$edge === void 0 ? [] : _store$getState6$edge,
        setEdges = _store$getState6.setEdges;

    var nextEdges = typeof payload === 'function' ? payload(edges) : payload;
    setEdges(nextEdges);
  }, []);
  var addNodes = useCallback(function (payload) {
    var nodes = Array.isArray(payload) ? payload : [payload];

    var _store$getState7 = store.getState(),
        nodeInternals = _store$getState7.nodeInternals,
        setNodes = _store$getState7.setNodes;

    var currentNodes = Array.from(nodeInternals.values());
    var nextNodes = [].concat(_toConsumableArray(currentNodes), _toConsumableArray(nodes));
    setNodes(nextNodes);
  }, []);
  var addEdges = useCallback(function (payload) {
    var nextEdges = Array.isArray(payload) ? payload : [payload];

    var _store$getState8 = store.getState(),
        _store$getState8$edge = _store$getState8.edges,
        edges = _store$getState8$edge === void 0 ? [] : _store$getState8$edge,
        setEdges = _store$getState8.setEdges;

    setEdges([].concat(_toConsumableArray(edges), _toConsumableArray(nextEdges)));
  }, []);
  var toObject = useCallback(function () {
    var _store$getState9 = store.getState(),
        nodeInternals = _store$getState9.nodeInternals,
        _store$getState9$edge = _store$getState9.edges,
        edges = _store$getState9$edge === void 0 ? [] : _store$getState9$edge,
        transform = _store$getState9.transform;

    var nodes = Array.from(nodeInternals.values());

    var _transform = _slicedToArray(transform, 3),
        x = _transform[0],
        y = _transform[1],
        zoom = _transform[2];

    return {
      nodes: nodes.map(function (n) {
        return _objectSpread$7({}, n);
      }),
      edges: edges.map(function (e) {
        return _objectSpread$7({}, e);
      }),
      viewport: {
        x: x,
        y: y,
        zoom: zoom
      }
    };
  }, []);
  return _objectSpread$7(_objectSpread$7({}, viewportHelperFunctions), {}, {
    viewportInitialized: viewportInitialized,
    getNodes: getNodes,
    getNode: getNode,
    getEdges: getEdges,
    getEdge: getEdge,
    setNodes: setNodes,
    setEdges: setEdges,
    addNodes: addNodes,
    addEdges: addEdges,
    toObject: toObject
  });
}

function useOnInitHandler(onInit) {
  var ReactFlowInstance = useReactFlow();
  var isInitialized = useRef(false);
  useEffect(function () {
    if (!isInitialized.current && ReactFlowInstance.viewportInitialized && onInit) {
      setTimeout(function () {
        return onInit(ReactFlowInstance);
      }, 1);
      isInitialized.current = true;
    }
  }, [onInit, ReactFlowInstance.viewportInitialized]);
}

var GraphView = function GraphView(_ref) {
  var nodeTypes = _ref.nodeTypes,
      edgeTypes = _ref.edgeTypes,
      onMove = _ref.onMove,
      onMoveStart = _ref.onMoveStart,
      onMoveEnd = _ref.onMoveEnd,
      onInit = _ref.onInit,
      onNodeClick = _ref.onNodeClick,
      onEdgeClick = _ref.onEdgeClick,
      onNodeDoubleClick = _ref.onNodeDoubleClick,
      onEdgeDoubleClick = _ref.onEdgeDoubleClick,
      onNodeMouseEnter = _ref.onNodeMouseEnter,
      onNodeMouseMove = _ref.onNodeMouseMove,
      onNodeMouseLeave = _ref.onNodeMouseLeave,
      onNodeContextMenu = _ref.onNodeContextMenu,
      onNodeDragStart = _ref.onNodeDragStart,
      onNodeDrag = _ref.onNodeDrag,
      onNodeDragStop = _ref.onNodeDragStop,
      onSelectionDragStart = _ref.onSelectionDragStart,
      onSelectionDrag = _ref.onSelectionDrag,
      onSelectionDragStop = _ref.onSelectionDragStop,
      onSelectionContextMenu = _ref.onSelectionContextMenu,
      connectionLineType = _ref.connectionLineType,
      connectionLineStyle = _ref.connectionLineStyle,
      connectionLineComponent = _ref.connectionLineComponent,
      selectionKeyCode = _ref.selectionKeyCode,
      multiSelectionKeyCode = _ref.multiSelectionKeyCode,
      zoomActivationKeyCode = _ref.zoomActivationKeyCode,
      deleteKeyCode = _ref.deleteKeyCode,
      onlyRenderVisibleElements = _ref.onlyRenderVisibleElements,
      elementsSelectable = _ref.elementsSelectable,
      selectNodesOnDrag = _ref.selectNodesOnDrag,
      defaultZoom = _ref.defaultZoom,
      defaultPosition = _ref.defaultPosition,
      preventScrolling = _ref.preventScrolling,
      defaultMarkerColor = _ref.defaultMarkerColor,
      zoomOnScroll = _ref.zoomOnScroll,
      zoomOnPinch = _ref.zoomOnPinch,
      panOnScroll = _ref.panOnScroll,
      panOnScrollSpeed = _ref.panOnScrollSpeed,
      panOnScrollMode = _ref.panOnScrollMode,
      zoomOnDoubleClick = _ref.zoomOnDoubleClick,
      panOnDrag = _ref.panOnDrag,
      onPaneClick = _ref.onPaneClick,
      onPaneScroll = _ref.onPaneScroll,
      onPaneContextMenu = _ref.onPaneContextMenu,
      onEdgeUpdate = _ref.onEdgeUpdate,
      onEdgeContextMenu = _ref.onEdgeContextMenu,
      onEdgeMouseEnter = _ref.onEdgeMouseEnter,
      onEdgeMouseMove = _ref.onEdgeMouseMove,
      onEdgeMouseLeave = _ref.onEdgeMouseLeave,
      edgeUpdaterRadius = _ref.edgeUpdaterRadius,
      onEdgeUpdateStart = _ref.onEdgeUpdateStart,
      onEdgeUpdateEnd = _ref.onEdgeUpdateEnd,
      noDragClassName = _ref.noDragClassName,
      noWheelClassName = _ref.noWheelClassName,
      noPanClassName = _ref.noPanClassName;
  useOnInitHandler(onInit);
  return /*#__PURE__*/React__default.createElement(FlowRenderer$1, {
    onPaneClick: onPaneClick,
    onPaneContextMenu: onPaneContextMenu,
    onPaneScroll: onPaneScroll,
    deleteKeyCode: deleteKeyCode,
    selectionKeyCode: selectionKeyCode,
    multiSelectionKeyCode: multiSelectionKeyCode,
    zoomActivationKeyCode: zoomActivationKeyCode,
    elementsSelectable: elementsSelectable,
    onMove: onMove,
    onMoveStart: onMoveStart,
    onMoveEnd: onMoveEnd,
    zoomOnScroll: zoomOnScroll,
    zoomOnPinch: zoomOnPinch,
    zoomOnDoubleClick: zoomOnDoubleClick,
    panOnScroll: panOnScroll,
    panOnScrollSpeed: panOnScrollSpeed,
    panOnScrollMode: panOnScrollMode,
    panOnDrag: panOnDrag,
    defaultPosition: defaultPosition,
    defaultZoom: defaultZoom,
    onSelectionDragStart: onSelectionDragStart,
    onSelectionDrag: onSelectionDrag,
    onSelectionDragStop: onSelectionDragStop,
    onSelectionContextMenu: onSelectionContextMenu,
    preventScrolling: preventScrolling,
    noDragClassName: noDragClassName,
    noWheelClassName: noWheelClassName,
    noPanClassName: noPanClassName
  }, /*#__PURE__*/React__default.createElement(Viewport, null, /*#__PURE__*/React__default.createElement(EdgeRenderer$1, {
    edgeTypes: edgeTypes,
    onEdgeClick: onEdgeClick,
    onEdgeDoubleClick: onEdgeDoubleClick,
    connectionLineType: connectionLineType,
    connectionLineStyle: connectionLineStyle,
    connectionLineComponent: connectionLineComponent,
    onEdgeUpdate: onEdgeUpdate,
    onlyRenderVisibleElements: onlyRenderVisibleElements,
    onEdgeContextMenu: onEdgeContextMenu,
    onEdgeMouseEnter: onEdgeMouseEnter,
    onEdgeMouseMove: onEdgeMouseMove,
    onEdgeMouseLeave: onEdgeMouseLeave,
    onEdgeUpdateStart: onEdgeUpdateStart,
    onEdgeUpdateEnd: onEdgeUpdateEnd,
    edgeUpdaterRadius: edgeUpdaterRadius,
    defaultMarkerColor: defaultMarkerColor,
    noPanClassName: noPanClassName
  }), /*#__PURE__*/React__default.createElement(NodeRenderer$1, {
    nodeTypes: nodeTypes,
    onNodeClick: onNodeClick,
    onNodeDoubleClick: onNodeDoubleClick,
    onNodeMouseEnter: onNodeMouseEnter,
    onNodeMouseMove: onNodeMouseMove,
    onNodeMouseLeave: onNodeMouseLeave,
    onNodeContextMenu: onNodeContextMenu,
    onNodeDragStop: onNodeDragStop,
    onNodeDrag: onNodeDrag,
    onNodeDragStart: onNodeDragStart,
    selectNodesOnDrag: selectNodesOnDrag,
    onlyRenderVisibleElements: onlyRenderVisibleElements,
    noPanClassName: noPanClassName,
    noDragClassName: noDragClassName
  })));
};

GraphView.displayName = 'GraphView';
var GraphView$1 = /*#__PURE__*/memo(GraphView);

var selector$5 = function selector(s) {
  return {
    setNodes: s.setNodes,
    setEdges: s.setEdges,
    setDefaultNodesAndEdges: s.setDefaultNodesAndEdges,
    setMinZoom: s.setMinZoom,
    setMaxZoom: s.setMaxZoom,
    setTranslateExtent: s.setTranslateExtent,
    setNodeExtent: s.setNodeExtent,
    reset: s.reset
  };
};

function useStoreUpdater(value, setStoreState) {
  useEffect(function () {
    if (typeof value !== 'undefined') {
      setStoreState(value);
    }
  }, [value]);
}

function useDirectStoreUpdater(key, value, setState) {
  useEffect(function () {
    if (typeof value !== 'undefined') {
      // @ts-ignore
      setState(_defineProperty({}, key, value));
    }
  }, [value]);
}

var StoreUpdater = function StoreUpdater(_ref) {
  var nodes = _ref.nodes,
      edges = _ref.edges,
      defaultNodes = _ref.defaultNodes,
      defaultEdges = _ref.defaultEdges,
      onConnect = _ref.onConnect,
      onConnectStart = _ref.onConnectStart,
      onConnectStop = _ref.onConnectStop,
      onConnectEnd = _ref.onConnectEnd,
      nodesDraggable = _ref.nodesDraggable,
      nodesConnectable = _ref.nodesConnectable,
      minZoom = _ref.minZoom,
      maxZoom = _ref.maxZoom,
      nodeExtent = _ref.nodeExtent,
      onNodesChange = _ref.onNodesChange,
      onEdgesChange = _ref.onEdgesChange,
      elementsSelectable = _ref.elementsSelectable,
      connectionMode = _ref.connectionMode,
      snapGrid = _ref.snapGrid,
      snapToGrid = _ref.snapToGrid,
      translateExtent = _ref.translateExtent,
      connectOnClick = _ref.connectOnClick,
      defaultEdgeOptions = _ref.defaultEdgeOptions,
      fitView = _ref.fitView,
      fitViewOptions = _ref.fitViewOptions,
      onNodesDelete = _ref.onNodesDelete,
      onEdgesDelete = _ref.onEdgesDelete;

  var _useStore = useStore(selector$5, shallow),
      setNodes = _useStore.setNodes,
      setEdges = _useStore.setEdges,
      setDefaultNodesAndEdges = _useStore.setDefaultNodesAndEdges,
      setMinZoom = _useStore.setMinZoom,
      setMaxZoom = _useStore.setMaxZoom,
      setTranslateExtent = _useStore.setTranslateExtent,
      setNodeExtent = _useStore.setNodeExtent,
      reset = _useStore.reset;

  var store = useStoreApi();
  useEffect(function () {
    setDefaultNodesAndEdges(defaultNodes, defaultEdges);
    return function () {
      reset();
    };
  }, []);
  useDirectStoreUpdater('defaultEdgeOptions', defaultEdgeOptions, store.setState);
  useDirectStoreUpdater('connectionMode', connectionMode, store.setState);
  useDirectStoreUpdater('onConnect', onConnect, store.setState);
  useDirectStoreUpdater('onConnectStart', onConnectStart, store.setState);
  useDirectStoreUpdater('onConnectStop', onConnectStop, store.setState);
  useDirectStoreUpdater('onConnectEnd', onConnectEnd, store.setState);
  useDirectStoreUpdater('nodesDraggable', nodesDraggable, store.setState);
  useDirectStoreUpdater('nodesConnectable', nodesConnectable, store.setState);
  useDirectStoreUpdater('elementsSelectable', elementsSelectable, store.setState);
  useDirectStoreUpdater('snapToGrid', snapToGrid, store.setState);
  useDirectStoreUpdater('snapGrid', snapGrid, store.setState);
  useDirectStoreUpdater('onNodesChange', onNodesChange, store.setState);
  useDirectStoreUpdater('onEdgesChange', onEdgesChange, store.setState);
  useDirectStoreUpdater('connectOnClick', connectOnClick, store.setState);
  useDirectStoreUpdater('fitViewOnInit', fitView, store.setState);
  useDirectStoreUpdater('fitViewOnInitOptions', fitViewOptions, store.setState);
  useDirectStoreUpdater('onNodesDelete', onNodesDelete, store.setState);
  useDirectStoreUpdater('onEdgesDelete', onEdgesDelete, store.setState);
  useStoreUpdater(nodes, setNodes);
  useStoreUpdater(edges, setEdges);
  useStoreUpdater(defaultNodes, setNodes);
  useStoreUpdater(defaultEdges, setEdges);
  useStoreUpdater(minZoom, setMinZoom);
  useStoreUpdater(maxZoom, setMaxZoom);
  useStoreUpdater(translateExtent, setTranslateExtent);
  useStoreUpdater(nodeExtent, setNodeExtent);
  return null;
};

var NodeIdContext = /*#__PURE__*/createContext$1(null);
var Provider = NodeIdContext.Provider;
NodeIdContext.Consumer;

var _excluded$2 = ["type", "position", "isValidConnection", "isConnectable", "id", "onConnect", "children", "className"];

function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$6(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var alwaysValid = function alwaysValid() {
  return true;
};

var selector$4 = function selector(s) {
  return {
    onConnectAction: s.onConnect,
    onConnectStart: s.onConnectStart,
    onConnectStop: s.onConnectStop,
    onConnectEnd: s.onConnectEnd,
    connectionMode: s.connectionMode,
    connectionStartHandle: s.connectionStartHandle,
    connectOnClick: s.connectOnClick,
    hasDefaultEdges: s.hasDefaultEdges
  };
};

var Handle = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'source' : _ref$type,
      _ref$position = _ref.position,
      position = _ref$position === void 0 ? Position.Top : _ref$position,
      _ref$isValidConnectio = _ref.isValidConnection,
      isValidConnection = _ref$isValidConnectio === void 0 ? alwaysValid : _ref$isValidConnectio,
      _ref$isConnectable = _ref.isConnectable,
      isConnectable = _ref$isConnectable === void 0 ? true : _ref$isConnectable,
      id = _ref.id,
      onConnect = _ref.onConnect,
      children = _ref.children,
      className = _ref.className,
      rest = _objectWithoutProperties(_ref, _excluded$2);

  var store = useStoreApi();
  var nodeId = useContext(NodeIdContext);

  var _useStore = useStore(selector$4, shallow),
      onConnectAction = _useStore.onConnectAction,
      onConnectStart = _useStore.onConnectStart,
      onConnectStop = _useStore.onConnectStop,
      onConnectEnd = _useStore.onConnectEnd,
      connectionMode = _useStore.connectionMode,
      connectionStartHandle = _useStore.connectionStartHandle,
      connectOnClick = _useStore.connectOnClick,
      hasDefaultEdges = _useStore.hasDefaultEdges;

  var handleId = id || null;
  var isTarget = type === 'target';
  var onConnectExtended = useCallback(function (params) {
    var _store$getState = store.getState(),
        defaultEdgeOptions = _store$getState.defaultEdgeOptions;

    var edgeParams = _objectSpread$6(_objectSpread$6({}, defaultEdgeOptions), params);

    if (hasDefaultEdges) {
      var _store$getState2 = store.getState(),
          edges = _store$getState2.edges;

      store.setState({
        edges: addEdge(edgeParams, edges)
      });
    }

    onConnectAction === null || onConnectAction === void 0 ? void 0 : onConnectAction(edgeParams);
    onConnect === null || onConnect === void 0 ? void 0 : onConnect(edgeParams);
  }, [hasDefaultEdges, onConnectAction, onConnect]);
  var onMouseDownHandler = useCallback(function (event) {
    if (event.button === 0) {
      onMouseDown(event, handleId, nodeId, store.setState, onConnectExtended, isTarget, isValidConnection, connectionMode, undefined, undefined, onConnectStart, onConnectStop, onConnectEnd);
    }
  }, [handleId, nodeId, onConnectExtended, isTarget, isValidConnection, connectionMode, onConnectStart, onConnectStop, onConnectEnd]);
  var onClick = useCallback(function (event) {
    if (!connectionStartHandle) {
      onConnectStart === null || onConnectStart === void 0 ? void 0 : onConnectStart(event, {
        nodeId: nodeId,
        handleId: handleId,
        handleType: type
      });
      store.setState({
        connectionStartHandle: {
          nodeId: nodeId,
          type: type,
          handleId: handleId
        }
      });
    } else {
      var doc = getHostForElement(event.target);

      var _checkElementBelowIsV = checkElementBelowIsValid(event, connectionMode, connectionStartHandle.type === 'target', connectionStartHandle.nodeId, connectionStartHandle.handleId || null, isValidConnection, doc),
          connection = _checkElementBelowIsV.connection,
          isValid = _checkElementBelowIsV.isValid;

      onConnectStop === null || onConnectStop === void 0 ? void 0 : onConnectStop(event);

      if (isValid) {
        onConnectExtended(connection);
      }

      onConnectEnd === null || onConnectEnd === void 0 ? void 0 : onConnectEnd(event);
      store.setState({
        connectionStartHandle: null
      });
    }
  }, [connectionStartHandle, onConnectStart, onConnectExtended, onConnectStop, onConnectEnd, isTarget, nodeId, handleId, type]);
  var handleClasses = cc(['react-flow__handle', "react-flow__handle-".concat(position), 'nodrag', className, {
    source: !isTarget,
    target: isTarget,
    connectable: isConnectable,
    connecting: (connectionStartHandle === null || connectionStartHandle === void 0 ? void 0 : connectionStartHandle.nodeId) === nodeId && (connectionStartHandle === null || connectionStartHandle === void 0 ? void 0 : connectionStartHandle.handleId) === handleId && (connectionStartHandle === null || connectionStartHandle === void 0 ? void 0 : connectionStartHandle.type) === type
  }]);
  return /*#__PURE__*/React__default.createElement("div", _objectSpread$6({
    "data-handleid": handleId,
    "data-nodeid": nodeId,
    "data-handlepos": position,
    className: handleClasses,
    onMouseDown: onMouseDownHandler,
    onClick: connectOnClick ? onClick : undefined,
    ref: ref
  }, rest), children);
});
Handle.displayName = 'Handle';
var Handle$1 = /*#__PURE__*/memo(Handle);

var DefaultNode = function DefaultNode(_ref) {
  var data = _ref.data,
      isConnectable = _ref.isConnectable,
      _ref$targetPosition = _ref.targetPosition,
      targetPosition = _ref$targetPosition === void 0 ? Position.Top : _ref$targetPosition,
      _ref$sourcePosition = _ref.sourcePosition,
      sourcePosition = _ref$sourcePosition === void 0 ? Position.Bottom : _ref$sourcePosition;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Handle$1, {
    type: "target",
    position: targetPosition,
    isConnectable: isConnectable
  }), data === null || data === void 0 ? void 0 : data.label, /*#__PURE__*/React__default.createElement(Handle$1, {
    type: "source",
    position: sourcePosition,
    isConnectable: isConnectable
  }));
};

DefaultNode.displayName = 'DefaultNode';
var DefaultNode$1 = /*#__PURE__*/memo(DefaultNode);

var InputNode = function InputNode(_ref) {
  var data = _ref.data,
      isConnectable = _ref.isConnectable,
      _ref$sourcePosition = _ref.sourcePosition,
      sourcePosition = _ref$sourcePosition === void 0 ? Position.Bottom : _ref$sourcePosition;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, data === null || data === void 0 ? void 0 : data.label, /*#__PURE__*/React__default.createElement(Handle$1, {
    type: "source",
    position: sourcePosition,
    isConnectable: isConnectable
  }));
};

InputNode.displayName = 'InputNode';
var InputNode$1 = /*#__PURE__*/memo(InputNode);

var OutputNode = function OutputNode(_ref) {
  var data = _ref.data,
      isConnectable = _ref.isConnectable,
      _ref$targetPosition = _ref.targetPosition,
      targetPosition = _ref$targetPosition === void 0 ? Position.Top : _ref$targetPosition;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Handle$1, {
    type: "target",
    position: targetPosition,
    isConnectable: isConnectable
  }), data === null || data === void 0 ? void 0 : data.label);
};

OutputNode.displayName = 'OutputNode';
var OutputNode$1 = /*#__PURE__*/memo(OutputNode);

var GroupNode = function GroupNode() {
  return null;
};

GroupNode.displayName = 'GroupNode';

function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$5(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function useMemoizedMouseHandler(id, dragging, getState, handler) {
  var memoizedHandler = useCallback(function (event) {
    if (typeof handler !== 'undefined' && !dragging) {
      var node = getState().nodeInternals.get(id);
      handler(event, _objectSpread$5({}, node));
    }
  }, [handler, dragging, id]);
  return memoizedHandler;
}

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$4(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var selector$3 = function selector(s) {
  return {
    addSelectedNodes: s.addSelectedNodes,
    updateNodePosition: s.updateNodePosition,
    unselectNodesAndEdges: s.unselectNodesAndEdges,
    updateNodeDimensions: s.updateNodeDimensions
  };
};

var wrapNode = (function (NodeComponent) {
  var NodeWrapper = function NodeWrapper(_ref) {
    var id = _ref.id,
        type = _ref.type,
        data = _ref.data,
        scale = _ref.scale,
        xPos = _ref.xPos,
        yPos = _ref.yPos,
        selected = _ref.selected,
        onClick = _ref.onClick,
        onMouseEnter = _ref.onMouseEnter,
        onMouseMove = _ref.onMouseMove,
        onMouseLeave = _ref.onMouseLeave,
        onContextMenu = _ref.onContextMenu,
        onNodeDoubleClick = _ref.onNodeDoubleClick,
        onNodeDragStart = _ref.onNodeDragStart,
        onNodeDrag = _ref.onNodeDrag,
        onNodeDragStop = _ref.onNodeDragStop,
        style = _ref.style,
        className = _ref.className,
        isDraggable = _ref.isDraggable,
        isSelectable = _ref.isSelectable,
        isConnectable = _ref.isConnectable,
        selectNodesOnDrag = _ref.selectNodesOnDrag,
        sourcePosition = _ref.sourcePosition,
        targetPosition = _ref.targetPosition,
        hidden = _ref.hidden,
        snapToGrid = _ref.snapToGrid,
        snapGrid = _ref.snapGrid,
        dragging = _ref.dragging,
        resizeObserver = _ref.resizeObserver,
        dragHandle = _ref.dragHandle,
        zIndex = _ref.zIndex,
        isParent = _ref.isParent,
        noPanClassName = _ref.noPanClassName,
        noDragClassName = _ref.noDragClassName;
    var store = useStoreApi();

    var _useStore = useStore(selector$3, shallow),
        addSelectedNodes = _useStore.addSelectedNodes,
        unselectNodesAndEdges = _useStore.unselectNodesAndEdges,
        updateNodePosition = _useStore.updateNodePosition,
        updateNodeDimensions = _useStore.updateNodeDimensions;

    var nodeElement = useRef(null);
    var prevSourcePosition = useRef(sourcePosition);
    var prevTargetPosition = useRef(targetPosition);
    var prevType = useRef(type);
    var hasPointerEvents = isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;
    var nodeStyle = useMemo(function () {
      return _objectSpread$4({
        zIndex: zIndex,
        transform: "translate(".concat(xPos, "px,").concat(yPos, "px)"),
        pointerEvents: hasPointerEvents ? 'all' : 'none'
      }, style);
    }, [zIndex, xPos, yPos, hasPointerEvents, style]);
    var grid = useMemo(function () {
      return snapToGrid ? snapGrid : [1, 1];
    }, [snapToGrid, snapGrid === null || snapGrid === void 0 ? void 0 : snapGrid[0], snapGrid === null || snapGrid === void 0 ? void 0 : snapGrid[1]]);
    var onMouseEnterHandler = useMemoizedMouseHandler(id, dragging, store.getState, onMouseEnter);
    var onMouseMoveHandler = useMemoizedMouseHandler(id, dragging, store.getState, onMouseMove);
    var onMouseLeaveHandler = useMemoizedMouseHandler(id, dragging, store.getState, onMouseLeave);
    var onContextMenuHandler = useMemoizedMouseHandler(id, false, store.getState, onContextMenu);
    var onNodeDoubleClickHandler = useMemoizedMouseHandler(id, false, store.getState, onNodeDoubleClick);
    var onSelectNodeHandler = useCallback(function (event) {
      if (!isDraggable) {
        if (isSelectable) {
          store.setState({
            nodesSelectionActive: false
          });

          if (!selected) {
            addSelectedNodes([id]);
          }
        }

        if (onClick) {
          var node = store.getState().nodeInternals.get(id);
          onClick(event, _objectSpread$4({}, node));
        }
      }
    }, [isSelectable, selected, isDraggable, onClick, id]);
    var onDragStart = useCallback(function (event) {
      if (selectNodesOnDrag && isSelectable) {
        store.setState({
          nodesSelectionActive: false
        });

        if (!selected) {
          addSelectedNodes([id]);
        }
      } else if (!selectNodesOnDrag && !selected && isSelectable) {
        unselectNodesAndEdges();
        store.setState({
          nodesSelectionActive: false
        });
      }

      if (onNodeDragStart) {
        var node = store.getState().nodeInternals.get(id);
        onNodeDragStart(event, _objectSpread$4({}, node));
      }
    }, [id, selected, selectNodesOnDrag, isSelectable, onNodeDragStart]);
    var onDrag = useCallback(function (event, draggableData) {
      updateNodePosition({
        id: id,
        dragging: true,
        diff: {
          x: draggableData.deltaX,
          y: draggableData.deltaY
        }
      });

      if (onNodeDrag) {
        var _node$positionAbsolut, _node$positionAbsolut2;

        var node = store.getState().nodeInternals.get(id);
        onNodeDrag(event, _objectSpread$4(_objectSpread$4({}, node), {}, {
          dragging: true,
          position: {
            x: node.position.x + draggableData.deltaX,
            y: node.position.y + draggableData.deltaY
          },
          positionAbsolute: {
            x: (((_node$positionAbsolut = node.positionAbsolute) === null || _node$positionAbsolut === void 0 ? void 0 : _node$positionAbsolut.x) || 0) + draggableData.deltaX,
            y: (((_node$positionAbsolut2 = node.positionAbsolute) === null || _node$positionAbsolut2 === void 0 ? void 0 : _node$positionAbsolut2.y) || 0) + draggableData.deltaY
          }
        }));
      }
    }, [id, onNodeDrag]);
    var onDragStop = useCallback(function (event) {
      // onDragStop also gets called when user just clicks on a node.
      // Because of that we set dragging to true inside the onDrag handler and handle the click here
      var node;

      if (onClick || onNodeDragStop) {
        node = store.getState().nodeInternals.get(id);
      }

      if (!dragging) {
        if (isSelectable && !selectNodesOnDrag && !selected) {
          addSelectedNodes([id]);
        }

        if (onClick && node) {
          onClick(event, _objectSpread$4({}, node));
        }

        return;
      }

      updateNodePosition({
        id: id,
        dragging: false
      });

      if (onNodeDragStop && node) {
        onNodeDragStop(event, _objectSpread$4(_objectSpread$4({}, node), {}, {
          dragging: false
        }));
      }
    }, [id, isSelectable, selectNodesOnDrag, onClick, onNodeDragStop, dragging, selected]);
    useEffect(function () {
      if (nodeElement.current && !hidden) {
        var currNode = nodeElement.current;
        resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.observe(currNode);
        return function () {
          return resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.unobserve(currNode);
        };
      }
    }, [hidden]);
    useEffect(function () {
      // when the user programmatically changes the source or handle position, we re-initialize the node
      var typeChanged = prevType.current !== type;
      var sourcePosChanged = prevSourcePosition.current !== sourcePosition;
      var targetPosChanged = prevTargetPosition.current !== targetPosition;

      if (nodeElement.current && (typeChanged || sourcePosChanged || targetPosChanged)) {
        if (typeChanged) {
          prevType.current = type;
        }

        if (sourcePosChanged) {
          prevSourcePosition.current = sourcePosition;
        }

        if (targetPosChanged) {
          prevTargetPosition.current = targetPosition;
        }

        updateNodeDimensions([{
          id: id,
          nodeElement: nodeElement.current,
          forceUpdate: true
        }]);
      }
    }, [id, type, sourcePosition, targetPosition]);

    if (hidden) {
      return null;
    }

    var nodeClasses = cc(['react-flow__node', "react-flow__node-".concat(type), noPanClassName, className, {
      selected: selected,
      selectable: isSelectable,
      parent: isParent
    }]);
    return /*#__PURE__*/React__default.createElement(DraggableCore, {
      onStart: onDragStart,
      onDrag: onDrag,
      onStop: onDragStop,
      scale: scale,
      disabled: !isDraggable,
      cancel: ".".concat(noDragClassName),
      nodeRef: nodeElement,
      grid: grid,
      enableUserSelectHack: false,
      handle: dragHandle
    }, /*#__PURE__*/React__default.createElement("div", {
      className: nodeClasses,
      ref: nodeElement,
      style: nodeStyle,
      onMouseEnter: onMouseEnterHandler,
      onMouseMove: onMouseMoveHandler,
      onMouseLeave: onMouseLeaveHandler,
      onContextMenu: onContextMenuHandler,
      onClick: onSelectNodeHandler,
      onDoubleClick: onNodeDoubleClickHandler,
      "data-id": id
    }, /*#__PURE__*/React__default.createElement(Provider, {
      value: id
    }, /*#__PURE__*/React__default.createElement(NodeComponent, {
      id: id,
      data: data,
      type: type,
      xPos: xPos,
      yPos: yPos,
      selected: selected,
      isConnectable: isConnectable,
      sourcePosition: sourcePosition,
      targetPosition: targetPosition,
      dragging: dragging,
      dragHandle: dragHandle,
      zIndex: zIndex
    }))));
  };

  NodeWrapper.displayName = 'NodeWrapper';
  return /*#__PURE__*/memo(NodeWrapper);
});

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$3(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function createNodeTypes(nodeTypes) {
  var standardTypes = {
    input: wrapNode(nodeTypes.input || InputNode$1),
    "default": wrapNode(nodeTypes["default"] || DefaultNode$1),
    output: wrapNode(nodeTypes.output || OutputNode$1),
    group: wrapNode(nodeTypes.group || GroupNode)
  };
  var wrappedTypes = {};
  var specialTypes = Object.keys(nodeTypes).filter(function (k) {
    return !['input', 'default', 'output', 'group'].includes(k);
  }).reduce(function (res, key) {
    res[key] = wrapNode(nodeTypes[key] || DefaultNode$1);
    return res;
  }, wrappedTypes);
  return _objectSpread$3(_objectSpread$3({}, standardTypes), specialTypes);
}

var selector$2 = function selector(s) {
  return {
    selectedNodes: Array.from(s.nodeInternals.values()).filter(function (n) {
      return n.selected;
    }),
    selectedEdges: s.edges.filter(function (e) {
      return e.selected;
    })
  };
};

var areEqual = function areEqual(objA, objB) {
  var selectedNodeIdsA = objA.selectedNodes.map(function (n) {
    return n.id;
  });
  var selectedNodeIdsB = objB.selectedNodes.map(function (n) {
    return n.id;
  });
  var selectedEdgeIdsA = objA.selectedEdges.map(function (e) {
    return e.id;
  });
  var selectedEdgeIdsB = objB.selectedEdges.map(function (e) {
    return e.id;
  });
  return shallow(selectedNodeIdsA, selectedNodeIdsB) && shallow(selectedEdgeIdsA, selectedEdgeIdsB);
}; // This is just a helper component for calling the onSelectionChange listener.
// @TODO: Now that we have the onNodesChange and on EdgesChange listeners, do we still need this component?


function SelectionListener(_ref) {
  var onSelectionChange = _ref.onSelectionChange;

  var _useStore = useStore(selector$2, areEqual),
      selectedNodes = _useStore.selectedNodes,
      selectedEdges = _useStore.selectedEdges;

  useEffect(function () {
    onSelectionChange({
      nodes: selectedNodes,
      edges: selectedEdges
    });
  }, [selectedNodes, selectedEdges]);
  return null;
}

var SelectionListener$1 = /*#__PURE__*/memo(SelectionListener);

function Attribution(_ref) {
  var proOptions = _ref.proOptions,
      _ref$position = _ref.position,
      position = _ref$position === void 0 ? 'bottom-right' : _ref$position;

  if ((proOptions === null || proOptions === void 0 ? void 0 : proOptions.account) === 'paid-subscription' && proOptions !== null && proOptions !== void 0 && proOptions.hideAttribution) {
    return null;
  }

  var positionClasses = "".concat(position).split('-');
  return /*#__PURE__*/React__default.createElement("div", {
    className: cc(['react-flow__attribution'].concat(_toConsumableArray(positionClasses))),
    "data-message": "Please only hide this attribution when you have a pro account: reactflow.dev/pro"
  }, /*#__PURE__*/React__default.createElement("a", {
    href: "https://reactflow.dev",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "React Flow"));
}

var Wrapper = function Wrapper(_ref) {
  var children = _ref.children;
  var isWrapped = true;

  try {
    useStoreApi();
  } catch (e) {
    isWrapped = false;
  }

  if (isWrapped) {
    // we need to wrap it with a fragment because it's not allowed for children to be a ReactNode
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, children);
  }

  return /*#__PURE__*/React__default.createElement(Provider$1, {
    createStore: createStore
  }, children);
};

Wrapper.displayName = 'ReactFlowWrapper';

function useNodeOrEdgeTypes(nodeOrEdgeTypes, createTypes) {
  var typesKeysRef = useRef(null);
  var typesParsed = useMemo(function () {
    if (process.env.NODE_ENV === 'development') {
      var typeKeys = Object.keys(nodeOrEdgeTypes);

      if (shallow(typesKeysRef.current, typeKeys)) {
        console.warn("React Flow: It looks like that you created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.");
      }

      typesKeysRef.current = typeKeys;
    }

    return createTypes(nodeOrEdgeTypes);
  }, [nodeOrEdgeTypes]);
  return typesParsed;
}

var _excluded$1 = ["nodes", "edges", "defaultNodes", "defaultEdges", "className", "nodeTypes", "edgeTypes", "onNodeClick", "onEdgeClick", "onInit", "onMove", "onMoveStart", "onMoveEnd", "onConnect", "onConnectStart", "onConnectStop", "onConnectEnd", "onNodeMouseEnter", "onNodeMouseMove", "onNodeMouseLeave", "onNodeContextMenu", "onNodeDoubleClick", "onNodeDragStart", "onNodeDrag", "onNodeDragStop", "onNodesDelete", "onEdgesDelete", "onSelectionChange", "onSelectionDragStart", "onSelectionDrag", "onSelectionDragStop", "onSelectionContextMenu", "connectionMode", "connectionLineType", "connectionLineStyle", "connectionLineComponent", "deleteKeyCode", "selectionKeyCode", "multiSelectionKeyCode", "zoomActivationKeyCode", "snapToGrid", "snapGrid", "onlyRenderVisibleElements", "selectNodesOnDrag", "nodesDraggable", "nodesConnectable", "elementsSelectable", "minZoom", "maxZoom", "defaultZoom", "defaultPosition", "translateExtent", "preventScrolling", "nodeExtent", "defaultMarkerColor", "zoomOnScroll", "zoomOnPinch", "panOnScroll", "panOnScrollSpeed", "panOnScrollMode", "zoomOnDoubleClick", "panOnDrag", "onPaneClick", "onPaneScroll", "onPaneContextMenu", "children", "onEdgeUpdate", "onEdgeContextMenu", "onEdgeDoubleClick", "onEdgeMouseEnter", "onEdgeMouseMove", "onEdgeMouseLeave", "onEdgeUpdateStart", "onEdgeUpdateEnd", "edgeUpdaterRadius", "onNodesChange", "onEdgesChange", "noDragClassName", "noWheelClassName", "noPanClassName", "fitView", "fitViewOptions", "connectOnClick", "attributionPosition", "proOptions", "defaultEdgeOptions"];

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var defaultNodeTypes = {
  input: InputNode$1,
  "default": DefaultNode$1,
  output: OutputNode$1
};
var defaultEdgeTypes = {
  "default": BezierEdge,
  straight: StraightEdge,
  step: StepEdge,
  smoothstep: SmoothStepEdge
};
var initSnapGrid = [15, 15];
var initDefaultPosition = [0, 0];
var ReactFlow = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var nodes = _ref.nodes,
      edges = _ref.edges,
      defaultNodes = _ref.defaultNodes,
      defaultEdges = _ref.defaultEdges,
      className = _ref.className,
      _ref$nodeTypes = _ref.nodeTypes,
      nodeTypes = _ref$nodeTypes === void 0 ? defaultNodeTypes : _ref$nodeTypes,
      _ref$edgeTypes = _ref.edgeTypes,
      edgeTypes = _ref$edgeTypes === void 0 ? defaultEdgeTypes : _ref$edgeTypes,
      onNodeClick = _ref.onNodeClick,
      onEdgeClick = _ref.onEdgeClick,
      onInit = _ref.onInit,
      onMove = _ref.onMove,
      onMoveStart = _ref.onMoveStart,
      onMoveEnd = _ref.onMoveEnd,
      onConnect = _ref.onConnect,
      onConnectStart = _ref.onConnectStart,
      onConnectStop = _ref.onConnectStop,
      onConnectEnd = _ref.onConnectEnd,
      onNodeMouseEnter = _ref.onNodeMouseEnter,
      onNodeMouseMove = _ref.onNodeMouseMove,
      onNodeMouseLeave = _ref.onNodeMouseLeave,
      onNodeContextMenu = _ref.onNodeContextMenu,
      onNodeDoubleClick = _ref.onNodeDoubleClick,
      onNodeDragStart = _ref.onNodeDragStart,
      onNodeDrag = _ref.onNodeDrag,
      onNodeDragStop = _ref.onNodeDragStop,
      onNodesDelete = _ref.onNodesDelete,
      onEdgesDelete = _ref.onEdgesDelete,
      onSelectionChange = _ref.onSelectionChange,
      onSelectionDragStart = _ref.onSelectionDragStart,
      onSelectionDrag = _ref.onSelectionDrag,
      onSelectionDragStop = _ref.onSelectionDragStop,
      onSelectionContextMenu = _ref.onSelectionContextMenu,
      _ref$connectionMode = _ref.connectionMode,
      connectionMode = _ref$connectionMode === void 0 ? ConnectionMode.Strict : _ref$connectionMode,
      _ref$connectionLineTy = _ref.connectionLineType,
      connectionLineType = _ref$connectionLineTy === void 0 ? ConnectionLineType.Bezier : _ref$connectionLineTy,
      connectionLineStyle = _ref.connectionLineStyle,
      connectionLineComponent = _ref.connectionLineComponent,
      _ref$deleteKeyCode = _ref.deleteKeyCode,
      deleteKeyCode = _ref$deleteKeyCode === void 0 ? 'Backspace' : _ref$deleteKeyCode,
      _ref$selectionKeyCode = _ref.selectionKeyCode,
      selectionKeyCode = _ref$selectionKeyCode === void 0 ? 'Shift' : _ref$selectionKeyCode,
      _ref$multiSelectionKe = _ref.multiSelectionKeyCode,
      multiSelectionKeyCode = _ref$multiSelectionKe === void 0 ? 'Meta' : _ref$multiSelectionKe,
      _ref$zoomActivationKe = _ref.zoomActivationKeyCode,
      zoomActivationKeyCode = _ref$zoomActivationKe === void 0 ? 'Meta' : _ref$zoomActivationKe,
      _ref$snapToGrid = _ref.snapToGrid,
      snapToGrid = _ref$snapToGrid === void 0 ? false : _ref$snapToGrid,
      _ref$snapGrid = _ref.snapGrid,
      snapGrid = _ref$snapGrid === void 0 ? initSnapGrid : _ref$snapGrid,
      _ref$onlyRenderVisibl = _ref.onlyRenderVisibleElements,
      onlyRenderVisibleElements = _ref$onlyRenderVisibl === void 0 ? false : _ref$onlyRenderVisibl,
      _ref$selectNodesOnDra = _ref.selectNodesOnDrag,
      selectNodesOnDrag = _ref$selectNodesOnDra === void 0 ? true : _ref$selectNodesOnDra,
      nodesDraggable = _ref.nodesDraggable,
      nodesConnectable = _ref.nodesConnectable,
      elementsSelectable = _ref.elementsSelectable,
      minZoom = _ref.minZoom,
      maxZoom = _ref.maxZoom,
      _ref$defaultZoom = _ref.defaultZoom,
      defaultZoom = _ref$defaultZoom === void 0 ? 1 : _ref$defaultZoom,
      _ref$defaultPosition = _ref.defaultPosition,
      defaultPosition = _ref$defaultPosition === void 0 ? initDefaultPosition : _ref$defaultPosition,
      translateExtent = _ref.translateExtent,
      _ref$preventScrolling = _ref.preventScrolling,
      preventScrolling = _ref$preventScrolling === void 0 ? true : _ref$preventScrolling,
      nodeExtent = _ref.nodeExtent,
      _ref$defaultMarkerCol = _ref.defaultMarkerColor,
      defaultMarkerColor = _ref$defaultMarkerCol === void 0 ? '#b1b1b7' : _ref$defaultMarkerCol,
      _ref$zoomOnScroll = _ref.zoomOnScroll,
      zoomOnScroll = _ref$zoomOnScroll === void 0 ? true : _ref$zoomOnScroll,
      _ref$zoomOnPinch = _ref.zoomOnPinch,
      zoomOnPinch = _ref$zoomOnPinch === void 0 ? true : _ref$zoomOnPinch,
      _ref$panOnScroll = _ref.panOnScroll,
      panOnScroll = _ref$panOnScroll === void 0 ? false : _ref$panOnScroll,
      _ref$panOnScrollSpeed = _ref.panOnScrollSpeed,
      panOnScrollSpeed = _ref$panOnScrollSpeed === void 0 ? 0.5 : _ref$panOnScrollSpeed,
      _ref$panOnScrollMode = _ref.panOnScrollMode,
      panOnScrollMode = _ref$panOnScrollMode === void 0 ? PanOnScrollMode.Free : _ref$panOnScrollMode,
      _ref$zoomOnDoubleClic = _ref.zoomOnDoubleClick,
      zoomOnDoubleClick = _ref$zoomOnDoubleClic === void 0 ? true : _ref$zoomOnDoubleClic,
      _ref$panOnDrag = _ref.panOnDrag,
      panOnDrag = _ref$panOnDrag === void 0 ? true : _ref$panOnDrag,
      onPaneClick = _ref.onPaneClick,
      onPaneScroll = _ref.onPaneScroll,
      onPaneContextMenu = _ref.onPaneContextMenu,
      children = _ref.children,
      onEdgeUpdate = _ref.onEdgeUpdate,
      onEdgeContextMenu = _ref.onEdgeContextMenu,
      onEdgeDoubleClick = _ref.onEdgeDoubleClick,
      onEdgeMouseEnter = _ref.onEdgeMouseEnter,
      onEdgeMouseMove = _ref.onEdgeMouseMove,
      onEdgeMouseLeave = _ref.onEdgeMouseLeave,
      onEdgeUpdateStart = _ref.onEdgeUpdateStart,
      onEdgeUpdateEnd = _ref.onEdgeUpdateEnd,
      _ref$edgeUpdaterRadiu = _ref.edgeUpdaterRadius,
      edgeUpdaterRadius = _ref$edgeUpdaterRadiu === void 0 ? 10 : _ref$edgeUpdaterRadiu,
      onNodesChange = _ref.onNodesChange,
      onEdgesChange = _ref.onEdgesChange,
      _ref$noDragClassName = _ref.noDragClassName,
      noDragClassName = _ref$noDragClassName === void 0 ? 'nodrag' : _ref$noDragClassName,
      _ref$noWheelClassName = _ref.noWheelClassName,
      noWheelClassName = _ref$noWheelClassName === void 0 ? 'nowheel' : _ref$noWheelClassName,
      _ref$noPanClassName = _ref.noPanClassName,
      noPanClassName = _ref$noPanClassName === void 0 ? 'nopan' : _ref$noPanClassName,
      _ref$fitView = _ref.fitView,
      fitView = _ref$fitView === void 0 ? false : _ref$fitView,
      fitViewOptions = _ref.fitViewOptions,
      _ref$connectOnClick = _ref.connectOnClick,
      connectOnClick = _ref$connectOnClick === void 0 ? true : _ref$connectOnClick,
      attributionPosition = _ref.attributionPosition,
      proOptions = _ref.proOptions,
      defaultEdgeOptions = _ref.defaultEdgeOptions,
      rest = _objectWithoutProperties(_ref, _excluded$1);

  var nodeTypesParsed = useNodeOrEdgeTypes(nodeTypes, createNodeTypes);
  var edgeTypesParsed = useNodeOrEdgeTypes(edgeTypes, createEdgeTypes);
  var reactFlowClasses = cc(['react-flow', className]);
  return /*#__PURE__*/React__default.createElement("div", _objectSpread$2(_objectSpread$2({}, rest), {}, {
    ref: ref,
    className: reactFlowClasses
  }), /*#__PURE__*/React__default.createElement(Wrapper, null, /*#__PURE__*/React__default.createElement(GraphView$1, {
    onInit: onInit,
    onMove: onMove,
    onMoveStart: onMoveStart,
    onMoveEnd: onMoveEnd,
    onNodeClick: onNodeClick,
    onEdgeClick: onEdgeClick,
    onNodeMouseEnter: onNodeMouseEnter,
    onNodeMouseMove: onNodeMouseMove,
    onNodeMouseLeave: onNodeMouseLeave,
    onNodeContextMenu: onNodeContextMenu,
    onNodeDoubleClick: onNodeDoubleClick,
    onNodeDragStart: onNodeDragStart,
    onNodeDrag: onNodeDrag,
    onNodeDragStop: onNodeDragStop,
    nodeTypes: nodeTypesParsed,
    edgeTypes: edgeTypesParsed,
    connectionLineType: connectionLineType,
    connectionLineStyle: connectionLineStyle,
    connectionLineComponent: connectionLineComponent,
    selectionKeyCode: selectionKeyCode,
    deleteKeyCode: deleteKeyCode,
    multiSelectionKeyCode: multiSelectionKeyCode,
    zoomActivationKeyCode: zoomActivationKeyCode,
    onlyRenderVisibleElements: onlyRenderVisibleElements,
    selectNodesOnDrag: selectNodesOnDrag,
    defaultZoom: defaultZoom,
    defaultPosition: defaultPosition,
    preventScrolling: preventScrolling,
    zoomOnScroll: zoomOnScroll,
    zoomOnPinch: zoomOnPinch,
    zoomOnDoubleClick: zoomOnDoubleClick,
    panOnScroll: panOnScroll,
    panOnScrollSpeed: panOnScrollSpeed,
    panOnScrollMode: panOnScrollMode,
    panOnDrag: panOnDrag,
    onPaneClick: onPaneClick,
    onPaneScroll: onPaneScroll,
    onPaneContextMenu: onPaneContextMenu,
    onSelectionDragStart: onSelectionDragStart,
    onSelectionDrag: onSelectionDrag,
    onSelectionDragStop: onSelectionDragStop,
    onSelectionContextMenu: onSelectionContextMenu,
    onEdgeUpdate: onEdgeUpdate,
    onEdgeContextMenu: onEdgeContextMenu,
    onEdgeDoubleClick: onEdgeDoubleClick,
    onEdgeMouseEnter: onEdgeMouseEnter,
    onEdgeMouseMove: onEdgeMouseMove,
    onEdgeMouseLeave: onEdgeMouseLeave,
    onEdgeUpdateStart: onEdgeUpdateStart,
    onEdgeUpdateEnd: onEdgeUpdateEnd,
    edgeUpdaterRadius: edgeUpdaterRadius,
    defaultMarkerColor: defaultMarkerColor,
    noDragClassName: noDragClassName,
    noWheelClassName: noWheelClassName,
    noPanClassName: noPanClassName
  }), /*#__PURE__*/React__default.createElement(StoreUpdater, {
    nodes: nodes,
    edges: edges,
    defaultNodes: defaultNodes,
    defaultEdges: defaultEdges,
    onConnect: onConnect,
    onConnectStart: onConnectStart,
    onConnectStop: onConnectStop,
    onConnectEnd: onConnectEnd,
    nodesDraggable: nodesDraggable,
    nodesConnectable: nodesConnectable,
    elementsSelectable: elementsSelectable,
    minZoom: minZoom,
    maxZoom: maxZoom,
    nodeExtent: nodeExtent,
    onNodesChange: onNodesChange,
    onEdgesChange: onEdgesChange,
    snapToGrid: snapToGrid,
    snapGrid: snapGrid,
    connectionMode: connectionMode,
    translateExtent: translateExtent,
    connectOnClick: connectOnClick,
    defaultEdgeOptions: defaultEdgeOptions,
    fitView: fitView,
    fitViewOptions: fitViewOptions,
    onNodesDelete: onNodesDelete,
    onEdgesDelete: onEdgesDelete
  }), onSelectionChange && /*#__PURE__*/React__default.createElement(SelectionListener$1, {
    onSelectionChange: onSelectionChange
  }), children, /*#__PURE__*/React__default.createElement(Attribution, {
    proOptions: proOptions,
    position: attributionPosition
  })));
});
ReactFlow.displayName = 'ReactFlow';

var MiniMapNode = function MiniMapNode(_ref) {
  var x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height,
      style = _ref.style,
      color = _ref.color,
      strokeColor = _ref.strokeColor,
      strokeWidth = _ref.strokeWidth,
      className = _ref.className,
      borderRadius = _ref.borderRadius,
      shapeRendering = _ref.shapeRendering;

  var _ref2 = style || {},
      background = _ref2.background,
      backgroundColor = _ref2.backgroundColor;

  var fill = color || background || backgroundColor;
  return /*#__PURE__*/React__default.createElement("rect", {
    className: cc(['react-flow__minimap-node', className]),
    x: x,
    y: y,
    rx: borderRadius,
    ry: borderRadius,
    width: width,
    height: height,
    fill: fill,
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    shapeRendering: shapeRendering
  });
};

MiniMapNode.displayName = 'MiniMapNode';
var MiniMapNode$1 = /*#__PURE__*/memo(MiniMapNode);

var defaultWidth = 200;
var defaultHeight = 150;

var selector$1 = function selector(s) {
  return {
    width: s.width,
    height: s.height,
    transform: s.transform,
    nodeInternals: s.nodeInternals
  };
};

var MiniMap = function MiniMap(_ref) {
  var style = _ref.style,
      className = _ref.className,
      _ref$nodeStrokeColor = _ref.nodeStrokeColor,
      nodeStrokeColor = _ref$nodeStrokeColor === void 0 ? '#555' : _ref$nodeStrokeColor,
      _ref$nodeColor = _ref.nodeColor,
      nodeColor = _ref$nodeColor === void 0 ? '#fff' : _ref$nodeColor,
      _ref$nodeClassName = _ref.nodeClassName,
      nodeClassName = _ref$nodeClassName === void 0 ? '' : _ref$nodeClassName,
      _ref$nodeBorderRadius = _ref.nodeBorderRadius,
      nodeBorderRadius = _ref$nodeBorderRadius === void 0 ? 5 : _ref$nodeBorderRadius,
      _ref$nodeStrokeWidth = _ref.nodeStrokeWidth,
      nodeStrokeWidth = _ref$nodeStrokeWidth === void 0 ? 2 : _ref$nodeStrokeWidth,
      _ref$maskColor = _ref.maskColor,
      maskColor = _ref$maskColor === void 0 ? 'rgb(240, 242, 243, 0.7)' : _ref$maskColor;

  var _useStore = useStore(selector$1, shallow),
      containerWidth = _useStore.width,
      containerHeight = _useStore.height,
      transform = _useStore.transform,
      nodeInternals = _useStore.nodeInternals;

  var _transform = _slicedToArray(transform, 3),
      tX = _transform[0],
      tY = _transform[1],
      tScale = _transform[2];

  var mapClasses = cc(['react-flow__minimap', className]);
  var elementWidth = (style === null || style === void 0 ? void 0 : style.width) || defaultWidth;
  var elementHeight = (style === null || style === void 0 ? void 0 : style.height) || defaultHeight;
  var nodeColorFunc = nodeColor instanceof Function ? nodeColor : function () {
    return nodeColor;
  };
  var nodeStrokeColorFunc = nodeStrokeColor instanceof Function ? nodeStrokeColor : function () {
    return nodeStrokeColor;
  };
  var nodeClassNameFunc = nodeClassName instanceof Function ? nodeClassName : function () {
    return nodeClassName;
  };
  var hasNodes = nodeInternals && nodeInternals.size > 0; // @TODO: work with nodeInternals instead of converting it to an array

  var nodes = Array.from(nodeInternals).map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2);
        _ref3[0];
        var node = _ref3[1];

    return node;
  });
  var bb = getRectOfNodes(nodes);
  var viewBB = {
    x: -tX / tScale,
    y: -tY / tScale,
    width: containerWidth / tScale,
    height: containerHeight / tScale
  };
  var boundingRect = hasNodes ? getBoundsofRects(bb, viewBB) : viewBB;
  var scaledWidth = boundingRect.width / elementWidth;
  var scaledHeight = boundingRect.height / elementHeight;
  var viewScale = Math.max(scaledWidth, scaledHeight);
  var viewWidth = viewScale * elementWidth;
  var viewHeight = viewScale * elementHeight;
  var offset = 5 * viewScale;
  var x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
  var y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
  var width = viewWidth + offset * 2;
  var height = viewHeight + offset * 2;
  var shapeRendering = typeof window === 'undefined' || !!window.chrome ? 'crispEdges' : 'geometricPrecision';
  return /*#__PURE__*/React__default.createElement("svg", {
    width: elementWidth,
    height: elementHeight,
    viewBox: "".concat(x, " ").concat(y, " ").concat(width, " ").concat(height),
    style: style,
    className: mapClasses
  }, Array.from(nodeInternals).filter(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2);
        _ref5[0];
        var node = _ref5[1];

    return !node.hidden && node.width && node.height;
  }).map(function (_ref6) {
    var _nodeInternals$get;

    var _ref7 = _slicedToArray(_ref6, 2);
        _ref7[0];
        var node = _ref7[1];

    var positionAbsolute = (_nodeInternals$get = nodeInternals.get(node.id)) === null || _nodeInternals$get === void 0 ? void 0 : _nodeInternals$get.positionAbsolute;
    return /*#__PURE__*/React__default.createElement(MiniMapNode$1, {
      key: node.id,
      x: (positionAbsolute === null || positionAbsolute === void 0 ? void 0 : positionAbsolute.x) || 0,
      y: (positionAbsolute === null || positionAbsolute === void 0 ? void 0 : positionAbsolute.y) || 0,
      width: node.width,
      height: node.height,
      style: node.style,
      className: nodeClassNameFunc(node),
      color: nodeColorFunc(node),
      borderRadius: nodeBorderRadius,
      strokeColor: nodeStrokeColorFunc(node),
      strokeWidth: nodeStrokeWidth,
      shapeRendering: shapeRendering
    });
  }), /*#__PURE__*/React__default.createElement("path", {
    className: "react-flow__minimap-mask",
    d: "M".concat(x - offset, ",").concat(y - offset, "h").concat(width + offset * 2, "v").concat(height + offset * 2, "h").concat(-width - offset * 2, "z\n        M").concat(viewBB.x, ",").concat(viewBB.y, "h").concat(viewBB.width, "v").concat(viewBB.height, "h").concat(-viewBB.width, "z"),
    fill: maskColor,
    fillRule: "evenodd"
  }));
};

MiniMap.displayName = 'MiniMap';
var index$2 = /*#__PURE__*/memo(MiniMap);

var _path$4;

function _extends$4() { _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$4.apply(this, arguments); }

var SvgPlus = function SvgPlus(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$4({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 32 32"
  }, props), _path$4 || (_path$4 = /*#__PURE__*/React.createElement("path", {
    d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z"
  })));
};

var _path$3;

function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }

var SvgMinus = function SvgMinus(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$3({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 32 5"
  }, props), _path$3 || (_path$3 = /*#__PURE__*/React.createElement("path", {
    d: "M0 0h32v4.2H0z"
  })));
};

var _path$2;

function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }

var SvgFitview = function SvgFitview(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$2({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 32 30"
  }, props), _path$2 || (_path$2 = /*#__PURE__*/React.createElement("path", {
    d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0 0 27.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94a.919.919 0 0 1-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z"
  })));
};

var _path$1;

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }

var SvgLock = function SvgLock(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$1({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 25 32"
  }, props), _path$1 || (_path$1 = /*#__PURE__*/React.createElement("path", {
    d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z"
  })));
};

var _path;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SvgUnlock = function SvgUnlock(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 25 32"
  }, props), _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047z"
  })));
};

var _excluded = ["children", "className"];

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var ControlButton = function ControlButton(_ref) {
  var children = _ref.children,
      className = _ref.className,
      rest = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/React__default.createElement("button", _objectSpread$1({
    type: "button",
    className: cc(['react-flow__controls-button', className])
  }, rest), children);
};

var isInteractiveSelector = function isInteractiveSelector(s) {
  return s.nodesDraggable && s.nodesConnectable && s.elementsSelectable;
};

var Controls = function Controls(_ref2) {
  var style = _ref2.style,
      _ref2$showZoom = _ref2.showZoom,
      showZoom = _ref2$showZoom === void 0 ? true : _ref2$showZoom,
      _ref2$showFitView = _ref2.showFitView,
      showFitView = _ref2$showFitView === void 0 ? true : _ref2$showFitView,
      _ref2$showInteractive = _ref2.showInteractive,
      showInteractive = _ref2$showInteractive === void 0 ? true : _ref2$showInteractive,
      fitViewOptions = _ref2.fitViewOptions,
      onZoomIn = _ref2.onZoomIn,
      onZoomOut = _ref2.onZoomOut,
      onFitView = _ref2.onFitView,
      onInteractiveChange = _ref2.onInteractiveChange,
      className = _ref2.className,
      children = _ref2.children;
  var store = useStoreApi();

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isVisible = _useState2[0],
      setIsVisible = _useState2[1];

  var isInteractive = useStore(isInteractiveSelector);

  var _useViewportHelper = useViewportHelper(),
      zoomIn = _useViewportHelper.zoomIn,
      zoomOut = _useViewportHelper.zoomOut,
      fitView = _useViewportHelper.fitView;

  var mapClasses = cc(['react-flow__controls', className]);
  var onZoomInHandler = useCallback(function () {
    zoomIn === null || zoomIn === void 0 ? void 0 : zoomIn();
    onZoomIn === null || onZoomIn === void 0 ? void 0 : onZoomIn();
  }, [zoomIn, onZoomIn]);
  var onZoomOutHandler = useCallback(function () {
    zoomOut === null || zoomOut === void 0 ? void 0 : zoomOut();
    onZoomOut === null || onZoomOut === void 0 ? void 0 : onZoomOut();
  }, [zoomOut, onZoomOut]);
  var onFitViewHandler = useCallback(function () {
    fitView === null || fitView === void 0 ? void 0 : fitView(fitViewOptions);
    onFitView === null || onFitView === void 0 ? void 0 : onFitView();
  }, [fitView, fitViewOptions, onFitView]);
  var onInteractiveChangeHandler = useCallback(function () {
    store.setState({
      nodesDraggable: !isInteractive,
      nodesConnectable: !isInteractive,
      elementsSelectable: !isInteractive
    });
    onInteractiveChange === null || onInteractiveChange === void 0 ? void 0 : onInteractiveChange(!isInteractive);
  }, [isInteractive, onInteractiveChange]);
  useEffect(function () {
    setIsVisible(true);
  }, []);

  if (!isVisible) {
    return null;
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: mapClasses,
    style: style
  }, showZoom && /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(ControlButton, {
    onClick: onZoomInHandler,
    className: "react-flow__controls-zoomin",
    title: "zoom in",
    "aria-label": "zoom in"
  }, /*#__PURE__*/React__default.createElement(SvgPlus, null)), /*#__PURE__*/React__default.createElement(ControlButton, {
    onClick: onZoomOutHandler,
    className: "react-flow__controls-zoomout",
    title: "zoom out",
    "aria-label": "zoom out"
  }, /*#__PURE__*/React__default.createElement(SvgMinus, null))), showFitView && /*#__PURE__*/React__default.createElement(ControlButton, {
    className: "react-flow__controls-fitview",
    onClick: onFitViewHandler,
    title: "fit view",
    "aria-label": "fit view"
  }, /*#__PURE__*/React__default.createElement(SvgFitview, null)), showInteractive && /*#__PURE__*/React__default.createElement(ControlButton, {
    className: "react-flow__controls-interactive",
    onClick: onInteractiveChangeHandler,
    title: "toggle interactivity",
    "aria-label": "toggle interactivity"
  }, isInteractive ? /*#__PURE__*/React__default.createElement(SvgUnlock, null) : /*#__PURE__*/React__default.createElement(SvgLock, null)), children);
};

Controls.displayName = 'Controls';
var index$1 = /*#__PURE__*/memo(Controls);

var createGridLinesPath = function createGridLinesPath(size, strokeWidth, stroke) {
  return /*#__PURE__*/React__default.createElement("path", {
    stroke: stroke,
    strokeWidth: strokeWidth,
    d: "M".concat(size / 2, " 0 V").concat(size, " M0 ").concat(size / 2, " H").concat(size)
  });
};
var createGridDotsPath = function createGridDotsPath(size, fill) {
  return /*#__PURE__*/React__default.createElement("circle", {
    cx: size,
    cy: size,
    r: size,
    fill: fill
  });
};

var _defaultColors;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var defaultColors = (_defaultColors = {}, _defineProperty(_defaultColors, BackgroundVariant.Dots, '#81818a'), _defineProperty(_defaultColors, BackgroundVariant.Lines, '#eee'), _defaultColors);

var transformSelector = function transformSelector(s) {
  return s.transform;
};

var Background = function Background(_ref) {
  var _ref$variant = _ref.variant,
      variant = _ref$variant === void 0 ? BackgroundVariant.Dots : _ref$variant,
      _ref$gap = _ref.gap,
      gap = _ref$gap === void 0 ? 15 : _ref$gap,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 0.4 : _ref$size,
      color = _ref.color,
      style = _ref.style,
      className = _ref.className;

  var _useStore = useStore(transformSelector),
      _useStore2 = _slicedToArray(_useStore, 3),
      x = _useStore2[0],
      y = _useStore2[1],
      scale = _useStore2[2]; // when there are multiple flows on a page we need to make sure that every background gets its own pattern.


  var patternId = useMemo(function () {
    return "pattern-".concat(Math.floor(Math.random() * 100000));
  }, []);
  var bgClasses = cc(['react-flow__background', 'react-flow__container', className]);
  var scaledGap = gap * scale;
  var xOffset = x % scaledGap;
  var yOffset = y % scaledGap;
  var isLines = variant === BackgroundVariant.Lines;
  var bgColor = color ? color : defaultColors[variant];
  var path = isLines ? createGridLinesPath(scaledGap, size, bgColor) : createGridDotsPath(size * scale, bgColor);
  return /*#__PURE__*/React__default.createElement("svg", {
    className: bgClasses,
    style: _objectSpread(_objectSpread({}, style), {}, {
      width: '100%',
      height: '100%'
    })
  }, /*#__PURE__*/React__default.createElement("pattern", {
    id: patternId,
    x: xOffset,
    y: yOffset,
    width: scaledGap,
    height: scaledGap,
    patternUnits: "userSpaceOnUse"
  }, path), /*#__PURE__*/React__default.createElement("rect", {
    x: "0",
    y: "0",
    width: "100%",
    height: "100%",
    fill: "url(#".concat(patternId, ")")
  }));
};

Background.displayName = 'Background';
var index = /*#__PURE__*/memo(Background);

var ReactFlowProvider = function ReactFlowProvider(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React__default.createElement(Provider$1, {
    createStore: createStore
  }, children);
};

ReactFlowProvider.displayName = 'ReactFlowProvider';

var selector = function selector(state) {
  return state.updateNodeDimensions;
};

function useUpdateNodeInternals() {
  var updateNodeDimensions = useStore(selector);
  return useCallback(function (id) {
    var nodeElement = document.querySelector(".react-flow__node[data-id=\"".concat(id, "\"]"));

    if (nodeElement) {
      updateNodeDimensions([{
        id: id,
        nodeElement: nodeElement,
        forceUpdate: true
      }]);
    }
  }, []);
}

var nodesSelector = function nodesSelector(state) {
  return Array.from(state.nodeInternals.values());
};

function useNodes() {
  var nodes = useStore(nodesSelector);
  return nodes;
}

var edgesSelector = function edgesSelector(state) {
  return state.edges;
};

function useEdges() {
  var edges = useStore(edgesSelector);
  return edges;
}

var viewportSelector = function viewportSelector(state) {
  return {
    x: state.transform[0],
    y: state.transform[1],
    zoom: state.transform[2]
  };
};

function useViewport() {
  var viewport = useStore(viewportSelector, shallow);
  return viewport;
}

// const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

function createUseItemsState(applyChangesFunction) {
  return function (initialItems) {
    var _useState = useState(initialItems),
        _useState2 = _slicedToArray(_useState, 2),
        items = _useState2[0],
        setItems = _useState2[1];

    var onItemsChange = useCallback(function (changes) {
      return setItems(function (items) {
        return applyChangesFunction(changes, items);
      });
    }, []);
    return [items, setItems, onItemsChange];
  };
}

var useNodesState = createUseItemsState(applyNodeChanges);
var useEdgesState = createUseItemsState(applyEdgeChanges);

export { index as Background, BackgroundVariant, BezierEdge, ConnectionLineType, ConnectionMode, ControlButton, index$1 as Controls, EdgeText$1 as EdgeText, Handle$1 as Handle, MarkerType, index$2 as MiniMap, PanOnScrollMode, Position, ReactFlowProvider, SmoothStepEdge, StepEdge, StraightEdge, addEdge, applyEdgeChanges, applyNodeChanges, ReactFlow as default, getBezierPath, getConnectedEdges, getCenter as getEdgeCenter, getIncomers, getMarkerEnd, getOutgoers, getRectOfNodes, getSmoothStepPath, getTransformForBounds, isEdge, isNode, updateEdge, useEdges, useEdgesState, useKeyPress, useNodes, useNodesState, useReactFlow, useStore, useStoreApi, useUpdateNodeInternals, useViewport };
//# sourceMappingURL=ReactFlow-nocss.esm.js.map
