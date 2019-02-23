
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

function addToStack(file, layerName, blendMode) {
  open(file);
  checkBackground();
  duplicateLayer(app.documents[0].name);
  app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  activeDocument.layers[0].blendMode = blendMode;
  activeDocument.layers[0].name = layerName;
}

function applyCommetEffect() {
  var opacity = 100;
  var increments = 100 / activeDocument.layers.length;
  for (var i = 0; i < activeDocument.layers.length; i++) {
    activeDocument.layers[i].opacity = opacity;
    opacity -= increments;
  }
}


function alignLayers(alignFlag) {
  if (!alignFlag) return;
  selectAllLayers() ;
	alignLayersByContent();
}

function applyEffect(effect) {
  switch (effect) {
    case "commet": return applyCommetEffect();
  }
}

function runAction(action) {
  if (!action) return;
  var idPly = charIDToTypeID( "Ply " );
  var desc12 = new ActionDescriptor();
  var idnull = charIDToTypeID( "null" );
  var ref9 = new ActionReference();
  var idActn = charIDToTypeID( "Actn" );
  ref9.putName( idActn, action );
  var idASet = charIDToTypeID( "ASet" );
  ref9.putName( idASet, "Stacker" );
  desc12.putReference( idnull, ref9 );
  executeAction( idPly, desc12, DialogModes.NO );
}


function stack(fileList, outputDir, options) {
  alert("Stacking " + fileList.length + " files!")
  open(fileList[0]);
  checkBackground();
  for (var i = 1; i < fileList.length; i++) {
    addToStack(fileList[i], 'Layer ' + i,  options.blendMode);
    var isLastIndex = i + 1 == fileList.length;
    var isAtStackLength = i + 1 >= options.stackLength || isLastIndex;
    if (options.autoAlign && !isAtStackLength) continue;
    applyEffect(options.effect);
    alignLayers(options.autoAlign);
    runAction(options.action);
    activeDocument.layers[activeDocument.layers.length - 1].blendMode = BlendMode.NORMAL;
    saveJpg(outputDir, i);
    if (isAtStackLength && !isLastIndex) {
      activeDocument.layers[activeDocument.layers.length - 1].remove();
    }
  }
  alert("Finished Stacking!");
}
