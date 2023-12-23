export var mode: number = 0;

export var mover: boolean = false;
export var move_start_x: number = 0;
export var move_start_y: number = 0;
export var move_end_x: number = 0;
export var move_end_y: number = 0;
export var move_offset_x: number = 0;
export var move_offset_y: number = 0;
export var offsetX: number = 0;
export var offsetY: number = 0;

export var touchData: Array = [];
export var touchData_a: Array = [];
export var touchData_b: Array = [];
export var start_timestamp: number = 0;
export var touch_point_identifier: number = 0;

export var pen_width_base: number = 4;
export var force_weight: number = 0;
export var speed_weight: number = -0.7;
export var pen_color: any = {};
export var tole: number = Math.min(Math.log(pen_width_base) / Math.log(Math.pow(10, 0.88)), 0.7);

export var currentPath: object = { a: '', b: '', c: '' };
export var eraser_selected_element: object = {};
export var eraser_hidden_element: object = {};
export var eraser_d = 15;
export let eraser_color = '#888888';

export function setToolMode(m) {
  mode = m;
  function getSelector(m) {
    return document.querySelector(`.tools_container button[m="${m}"] span`);
  }
  for (var i = 0; i < 3; i++) {
    getSelector(i).classList.remove('filled');
  }
  getSelector(m).classList.add('filled');
}
