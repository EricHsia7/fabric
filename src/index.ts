import { canvas, ctx, svg_canvas, svg_canvas_pen_layer, scale, width, height, resizeFabric, updatePenPath, registerElement, saveContent, loadContent } from './fabric/index.ts';
import { drawPath } from './fabric/canvas.ts';
import { newGroupOnSVG, drawPathOnSVG } from './fabric/svg.ts';

import { getCoordinateOnCircleBorder } from './graph/coordinate.ts';
import { segmentsToPath, distanceToSegment, simplifyPath, pathCommandToCoordinates } from './graph/path.ts';

import { mode, mover, move_start_x, move_start_y, move_end_x, move_end_y, move_offset_x, move_offset_y, offsetX, offsetY, touchData, touchData_a, touchData_b, start_timestamp, touch_point_identifier, pen_width_base, force_weight, speed_weight, pen_color, tole, currentPath, eraser_selected_element, eraser_hidden_element, eraser_d, eraser_color, setToolMode } from './tools/index.ts';
import { handleTouchStart_eraser, handleTouchMove_eraser, handleTouchEnd_eraser } from './tools/eraser.ts';
import { handleTouchStart_pen, handleTouchMove_pen, handleTouchEnd_pen } from './tools/pen.ts';
import { handleTouchStart_mover, handleTouchMove_mover, handleTouchEnd_mover } from './tools/mover.ts';

import { keys, supportsPassive, wheelOpt, wheelEvent, checkPassive, disableScroll, enableScroll } from './scroll/index.ts';

import './fabric/index.css';

var ripple = require('@erichsia7/ripple');
var localforage = require('localforage');

//for development

const ErrorStackParser = require('error-stack-parser');
const StackTrace = require('stacktrace-js');

window.onerror = async function (message, source, lineno, colno, error) {
  StackTrace.fromError(error).then(function (stackTrace) {
    var parsedStackTrace = stackTrace.map(function (frame) {
      return {
        functionName: frame.functionName,
        fileName: frame.fileName,
        lineNumber: frame.lineNumber,
        columnNumber: frame.columnNumber
      };
    });
    console.log('%c ----------', 'color: #888;');
    parsedStackTrace.forEach((e) => {
      console.error(`func: ${e.functionName}\npath: ${e.fileName}\nlocation: L${e.lineNumber} C${e.columnNumber}`);
    });
  });
};

window.fabric_initialize = function () {
  canvas.addEventListener(
    'touchstart',
    function (event) {
      if (0 <= mode <= 2) {
        disableScroll();
        if (mode === 0) {
          handleTouchStart_pen(event);
        }
        if (mode === 1) {
          handleTouchStart_eraser(event);
        }
        if (mode === 2) {
          mover = true;
          handleTouchStart_mover(event);
        }
      }
    },
    false
  );

  canvas.addEventListener(
    'touchmove',
    function (event) {
      if (mode === 0) {
        handleTouchMove_pen(event);
      }
      if (mode === 1) {
        handleTouchMove_eraser(event);
      }
      if (mode === 2 && mover) {
        handleTouchMove_mover(event);
      }
    },
    false
  );

  canvas.addEventListener(
    'touchend',
    function (event) {
      if (0 <= mode <= 2) {
        enableScroll();
        if (mode === 0) {
          handleTouchEnd_pen(event);
        }
        if (mode === 1) {
          handleTouchEnd_eraser(event);
        }
        if (mode === 2 && mover) {
          handleTouchEnd_mover(event);
          mover = false;
        }
      }
      saveContent();
      console.log(registration);
    },
    false
  );

  window.addEventListener('resize', function () {
    resizeFabric();
  });

  ripple.addTo('.tools_container button', '#fff', 370);

  document.querySelectorAll('.tools_container button[group="1"]').forEach((button) => {
    button.addEventListener('click', function () {
      var selectedMode = parseInt(button.getAttribute('m'));
      setToolMode(selectedMode);
    });
  });
  document.querySelectorAll('.tools_container button[group="0"]').forEach((button) => {
    button.addEventListener('click', function () {
      var selectedMode = parseInt(button.getAttribute('m'));
      replayHistory(selectedMode);
    });
  });
  resizeFabric();
  loadContent();
  disableScroll();
  checkPassive();
};
window.enableScroll = enableScroll;
window.disableScroll = disableScroll;
export default window.fabric_initialize;
