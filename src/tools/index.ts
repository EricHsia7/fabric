export const mode: number = 0;

export const mover: boolean = false;
export const move_start_x: number = 0;
export const move_start_y: number = 0;
export const move_end_x: number = 0;
export const move_end_y: number = 0;
export const move_offset_x: number = 0;
export const move_offset_y: number = 0;
export const offsetX: number = 0;
export const offsetY: number = 0;

export const touchData: Array = [];
export const touchData_a: Array = [];
export const touchData_b: Array = [];
export const start_timestamp: number = 0;
export const touch_point_identifier: number = 0;

export const pen_width_base: number = 4;
export const force_weight: number = 0;
export const speed_weight: number = -0.7;
export const pen_color: string = '#000';
export const tole: number = Math.min(Math.log(pen_width_base) / Math.log(Math.pow(10, 0.88)), 0.7);

export const currentPath: object = { a: '', b: '', c: '' };
export const eraser_selected_element: object = {};
export const eraser_hidden_element: object = {};
export const eraser_d = 15;
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
