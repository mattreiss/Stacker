
var window;
var process;
var options = {
  blendMode: BlendMode.LIGHTEN,
  effect: "commet",
  stackLength: 32,
  autoAlign: false,
  action: null,
  displacement: 1,
};

function renderRadioButton(element, key, label, value) {
  var radio = element.add("radiobutton", undefined, label);
  radio.alignment = "left";
  radio.value = options[key] == value;
  radio.onClick = function() {
    options[key] = value;
  }
}

function renderPanel(title, width, height) {
  var panel = window.add("panel", undefined, title, { borderStyle: "r" });
  panel.orientation = "column";
  panel.alignment = 'left';
  panel.preferredSize = [width || 200, height || 40];
  panel.spacing = 0;
  return panel;
}

function renderGroup(element) {
  var group = element.add('group');
  group.orientation = 'row';
  group.alignment="left";
  return group;
}

function renderBlendModeOptions() {
  var panel = renderPanel("Select Blend Mode:", 200, 60);
  var group = renderGroup(panel);
  var key = "blendMode";
  renderRadioButton(panel, key, 'Lighten', BlendMode.LIGHTEN);
  renderRadioButton(panel, key, 'Darken', BlendMode.DARKEN);
  renderRadioButton(panel, key, 'Screen', BlendMode.SCREEN);
  renderRadioButton(panel, key, 'Normal', BlendMode.NORMAL);
}

function renderEffectOptions() {
  var panel = renderPanel("Select Effect:");
  var group = renderGroup(panel);
  var key = "effect";
  renderRadioButton(group, key, 'Commet', 'commet');
  renderRadioButton(group, key, 'Normal', 'normal');
}

function renderStackLengthOptions() {
  var panel = renderPanel("Select Stack Length:");
  var group = renderGroup(panel);
  var key = "stackLength";
  var stackSizes = [2, 8, 16, 32, 64, 115, 128, 256];
  for (var i in stackSizes) {
    var stackSize = stackSizes[i];
    renderRadioButton(group, key, '' + stackSize, stackSize);
  }
}

function renderAutoAlignOptions() {
  var panel = renderPanel("Auto Align Images:");
  var group = renderGroup(panel);
  var key = "autoAlign";
  renderRadioButton(group, key, 'on', true);
  renderRadioButton(group, key, 'off', false);
}

function renderDisplacementOptions() {
  var panel = renderPanel("Displacement Between Frames:");
  var group = renderGroup(panel);
  var key = "displacement";
  var displacements = [1, 2, 4, 8, 16, 32];
  for (var i in displacements) {
    var displacement = displacements[i];
    renderRadioButton(group, key, '' + displacement, displacement);
  }
}


function renderSubmitButtons() {
  var group = window.add('group');
  var btn = group.add('button',undefined,"Process");
  btn.bounds = [10,80,190,101];
  btn.onClick = function() {
    window.close(1);
    process(options);
  };

  btn = group.add('button',undefined,"Cancel");
  btn.bounds = [210,80,390,101];
  btn.onClick = function() {
    window.close(1);
  };
}

function getOptions(cb) {
  window = new Window('dialog', 'Stacker Options');
  process = cb;
  renderBlendModeOptions();
  renderEffectOptions();
  renderStackLengthOptions();
  renderAutoAlignOptions();
  renderDisplacementOptions();
  renderSubmitButtons();
  window.show();
}
