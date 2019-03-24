function checkBackground() {
  activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-1];
  if (activeDocument.activeLayer.isBackgroundLayer) {
    activeDocument.activeLayer.name=activeDocument.activeLayer.name;
  }
}

function mergeLayers() {
  selectAllLayers() ;
  activeDocument.activeLayer.merge();
}

function duplicateLayer(DocName) {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
  desc.putReference( charIDToTypeID('null'), ref );
  var ref2 = new ActionReference();
  ref2.putName( charIDToTypeID('Dcmn'), DocName);
  desc.putReference( charIDToTypeID('T   '), ref2 );
  desc.putInteger( charIDToTypeID('Vrsn'), 5 );
  executeAction( charIDToTypeID('Dplc'), desc, DialogModes.NO );
}

function selectAllLayers() {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
  desc.putReference( charIDToTypeID('null'), ref );
  executeAction( stringIDToTypeID('selectAllLayers'), desc, DialogModes.NO );
}

function saveJpg(dir, fileName) {
  var jpgFile = new File(dir + '/' + fileName + '.jpg');
  jpgSaveOptions = new JPEGSaveOptions();
  jpgSaveOptions.embedColorProfile = true;
  jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
  jpgSaveOptions.matte = MatteType.NONE;
  jpgSaveOptions.quality = 10;
  app.activeDocument.saveAs(jpgFile, jpgSaveOptions, true, Extension.LOWERCASE);
}


function applyCommetEffect(options, start, end) {
  var opacity = 100;
  var increments = 100 / (end - start + 1);
  for (var index = start; index <= end; index++) {
    var layer = activeDocument.layers[index];
    layer.blendMode = index == end ? BlendMode.NORMAL : options.blendMode;
    layer.visible = true;
    layer.opacity = opacity;
    opacity -= increments;
  }
}

function putFilesIntoLayers(fileList, options) {
  for (var i = 0; i < fileList.length; i++) {
    open(fileList[i]);
    checkBackground();
    if (i > 0) {
      duplicateLayer(app.documents[0].name);
      app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    }
    var layer = activeDocument.layers[0];
    layer.visible = false;
    layer.name = 'Layer ' + i;
  }
  if (options.autoAlign) {
    selectAllLayers();
  	alignLayersByContent(); // defined in StackSupport.jsx
  }
}

function mainLoop(fileList, outputDir, options) {
  var fileCount = 0;
  var i = fileList.length - 1;
  var j = i - options.stackLength;
  if (j < 0) j = 0;
  while (j >= 0) {
    switch (options.effect) {
      case "commet":
      default: applyCommetEffect(options, j, i);
    }
    fileCount++;
    saveJpg(outputDir, fileCount);
    var nextI = i - options.displacement;
    while (i > nextI) {
      activeDocument.layers[i].visible = false;
      i--;
      j--;
    }
  }
}

function stack(fileList, outputDir, options) {
  var time = Date.now();
  alert("Stacking " + fileList.length + " files!")
  putFilesIntoLayers(fileList, options);
  mainLoop(fileList, outputDir, options);
  time = (Date.now() - time) / (1000 * 60);
  alert("Finished Stacking in" + parseFloat(time).toFixed(2) + " minutes!");
}
