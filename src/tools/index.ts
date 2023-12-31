export var tools_variables = {
  mode: 0,
  mover: false,
  move_start_x: 0,
  move_start_y: 0,
  move_end_x: 0,
  move_end_y: 0,
  move_offset_x: 0,
  move_offset_y: 0,
  offsetX: 0,
  offsetY: 0,
  touchData_x: { main: [], a: [], b: [] },
  start_timestamp: 0,
  touch_point_identifier: 0,
  pen_width_base: 4,
  force_weight: 0,
  speed_weight: -0.7,
  pen_color: '#000000',
  pen_color_id: 'fc-default-black-white',
  tole: Math.min(Math.log(4) / Math.log(Math.pow(10, 0.88)), 0.7),
  currentPath: { a: '', b: '', c: '' },
  eraser_selected_element: {},
  eraser_hidden_element: {},
  eraser_d: 15,
  eraser_color: '#888888',
  fabric_colors_cache: []
};

export function setToolMode(m) {
  tools_variables.mode = m * 1;
  function getSelector(m) {
    return document.querySelector(`.tools_container button[m="${m}"] span`);
  }
  for (var i = 0; i < 3; i++) {
    getSelector(i).classList.remove('filled');
  }
  getSelector(m).classList.add('filled');
}

export function getColorScheme() {
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const isDarkMode = darkModeQuery.matches;
  if (isDarkMode) {
    return 'dark';
  } else {
    return 'light';
  }
}

export function setPenColor(id) {
  var colorObj = tools_variables.fabric_colors_cache.filter((j) => (j.id === id ? true : false))[0];
  tools_variables.pen_color_id = colorObj ? colorObj.id : 'fc-default-black-white';
}
