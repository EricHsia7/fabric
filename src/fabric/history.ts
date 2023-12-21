function log_changes(addition, deletion) {
  if (!(addition.length === 0 && deletion.length === 0)) {
    change_history.push({
      addition: addition,
      deletion: deletion
    });
    history_offset = 0;
  }
}

function replayHistory(mode) {
  if (mode === 'redo') {
    history_offset += 1;
  }
  var index = change_history.length - 1 + history_offset;
  if (index > change_history.length - 1 || index < 0) {
    if (mode === 'redo') {
      history_offset -= 1;
    }
    return '';
  }
  var prev = change_history[index] || { addition: [], deletion: [] };
  var prev_addition = prev.addition;
  var prev_deletion = prev.deletion;
  var prev_addition_len = prev_addition.length;
  var prev_deletion_len = prev_deletion.length;
  var hidden_element_identifier = [];
  var displayed_element_identifier = [];
  for (var i = 0; i < prev_addition_len; i++) {
    var k = prev_addition[i];

    var target = document.querySelector('svg#vector_fabric g#' + k);
    document.querySelector('svg#vector_fabric g#hidden_pen').appendChild(target);
    target.removeAttributeNS(null, 'opacity');
    hidden_element_identifier.push(k);
    registration[k].hidden = true;
  }
  for (var i = 0; i < prev_deletion_len; i++) {
    var k = prev_deletion[i];
    var target = document.querySelector('svg#vector_fabric g#' + k);
    document.querySelector('svg#vector_fabric g#pen').appendChild(target);

    displayed_element_identifier.push(k);
    registration[k].hidden = false;
  }
  change_history.splice(index, 1, { addition: displayed_element_identifier, deletion: hidden_element_identifier });
  if (mode === 'undo') {
    history_offset -= 1;
  }
  saveContent();
}
