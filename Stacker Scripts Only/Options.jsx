
var window;
var process;
var options = {
  blendMode: BlendMode.LIGHTEN,
  effect: "commet",
  stackLength: 30,
  autoAlign: false,
  action: null
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
  renderRadioButton(group, key, '15', 15);
  renderRadioButton(group, key, '30', 30);
  renderRadioButton(group, key, '60', 60);
  renderRadioButton(group, key, '120', 120);
  renderRadioButton(group, key, '240', 240);
}

function renderAutoAlignOptions() {
  var panel = renderPanel("Auto Align Images:");
  var group = renderGroup(panel);
  var key = "autoAlign";
  renderRadioButton(group, key, 'on', true);
  renderRadioButton(group, key, 'off', false);
}

function renderActionOptions() {
  var panel = renderPanel("Run Stacker Action:");
  var group = renderGroup(panel);
  var key = "action";
  renderRadioButton(group, key, 'Action', 'Action');
  renderRadioButton(group, key, 'none', null);
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
  renderActionOptions();
  renderSubmitButtons();
  window.show();
}
