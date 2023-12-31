var ripple = require('@erichsia7/ripple');
export var localforage = require('localforage');
export var { v4: uuidv4 } = require('uuid');
export var FontFaceObserver = require('fontfaceobserver');

import { tools_variables, setToolMode, setPenColor } from './tools/index.ts';
import { handleTouchStart_eraser, handleTouchMove_eraser, handleTouchEnd_eraser } from './tools/eraser.ts';
import { handleTouchStart_pen, handleTouchMove_pen, handleTouchEnd_pen } from './tools/pen.ts';
import { handleTouchStart_mover, handleTouchMove_mover, handleTouchEnd_mover } from './tools/mover.ts';
import { supportsPassive, wheelOpt, wheelEvent, checkPassive, disableScroll, enableScroll } from './scroll/index.ts';
import { setFabricColor, deleteFabricColor, initializeFabricColors, listFabricColors, updateFabricColorStyleTag, colorToHex, colorToCSS } from './tools/color.ts';
import { openColorPlate, closeColorPlate } from './tools/color-plate.ts';
import { canvas, resizeFabric, loadContent, saveContent, loadFont } from './fabric/index.ts';
import { replayHistory } from './fabric/history.ts';

import './fabric/index.css';

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
      if (0 <= tools_variables.mode <= 2) {
        disableScroll();
        if (tools_variables.mode === 0) {
          handleTouchStart_pen(event);
        }
        if (tools_variables.mode === 1) {
          handleTouchStart_eraser(event);
        }
        if (tools_variables.mode === 2) {
          tools_variables.mover = true;
          handleTouchStart_mover(event);
        }
      }
    },
    false
  );

  canvas.addEventListener(
    'touchmove',
    function (event) {
      if (tools_variables.mode === 0) {
        handleTouchMove_pen(event);
      }
      if (tools_variables.mode === 1) {
        handleTouchMove_eraser(event);
      }
      if (tools_variables.mode === 2 && tools_variables.mover) {
        handleTouchMove_mover(event);
      }
    },
    false
  );

  canvas.addEventListener(
    'touchend',
    function (event) {
      if (0 <= tools_variables.mode <= 2) {
        enableScroll();
        if (tools_variables.mode === 0) {
          handleTouchEnd_pen(event);
        }
        if (tools_variables.mode === 1) {
          handleTouchEnd_eraser(event);
        }
        if (tools_variables.mode === 2 && tools_variables.mover) {
          handleTouchEnd_mover(event);
          tools_variables.mover = false;
        }
      }
      saveContent();
    },
    false
  );

  window.addEventListener('resize', function () {
    resizeFabric();
  });

  //ripple.addTo('.tools_container button', 'var(--k-000000)', 370);

  document.querySelectorAll('.tools_container button[group="1"]').forEach((button) => {
    button.addEventListener('click', function () {
      var selectedMode = parseInt(button.getAttribute('m'));
      setToolMode(selectedMode);
    });
  });
  document.querySelectorAll('.tools_container button[group="0"]').forEach((button) => {
    button.addEventListener('click', function () {
      var selectedMode = String(button.getAttribute('m'));
      replayHistory(selectedMode);
    });
  });

  document.addEventListener(
    'dblclick',
    function (event) {
      event.preventDefault();
    },
    false
  );
  resizeFabric();
  loadContent();
  checkPassive();
  initializeFabricColors().then(function () {
    listFabricColors();
    updateFabricColorStyleTag();
  });

  document.querySelector('.tools_container button[group="2"]').addEventListener('click', function () {
    openColorPlate();
  });

  document.querySelector('.fabric_color_plate_close button').addEventListener('click', function () {
    closeColorPlate();
  });

  loadFont('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap', 'Noto Sans', 'googleFontsNotoSans');
  loadFont('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200', 'Material Symbols Rounded', 'googleFontsMaterialSymbols');
};

window.setPenColor = setPenColor;

export default window.fabric_initialize;
