var LayerUtil = {};

LayerUtil.runAction = function(action, actionSet) {
  if (!action) return;
  var idPly = charIDToTypeID( "Ply " );
  var desc12 = new ActionDescriptor();
  var idnull = charIDToTypeID( "null" );
  var ref9 = new ActionReference();
  var idActn = charIDToTypeID( "Actn" );
  ref9.putName( idActn, action || "Action" );
  var idASet = charIDToTypeID( "ASet" );
  ref9.putName( idASet, actionSet || "Stacker" );
  desc12.putReference( idnull, ref9 );
  executeAction( idPly, desc12, DialogModes.NO );
}

LayerUtil.checkBackground = function() {
  activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-1];
  if (activeDocument.activeLayer.isBackgroundLayer) {
    activeDocument.activeLayer.name = activeDocument.activeLayer.name;
  }
}

LayerUtil.deleteLayer = function(layer) {
  if(!layer.visisible) layer.visible = true;
  if(layer.locked) layer.locked = false;
  layer.remove();
}

LayerUtil.selectAllLayers = function() {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
  desc.putReference( charIDToTypeID('null'), ref );
  executeAction( stringIDToTypeID('selectAllLayers'), desc, DialogModes.NO );
}

LayerUtil.duplicateLayer = function(DocName) {
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

LayerUtil.mergeLayers = function() {
  LayerUtil.selectAllLayers() ;
  activeDocument.activeLayer.merge();
}


LayerUtil.restoreDefaultLayers = function(start, end) {
  for (var index = start; index <= end; index++) {
    var layer = activeDocument.layers[index];
    layer.blendMode = BlendMode.NORMAL;
    layer.visible = true;
    layer.opacity = 100;
  }
}

LayerUtil.hideLayers = function(i, j) {
  var end = j && j < activeDocument.layers.length ? j : activeDocument.layers.length;
  for (var index = i; index < end; index++) {
    var layer = activeDocument.layers[index];
    layer.visible = false;
  }
}


LayerUtil.applyNormalEffect = function(options, start, end) {
  for (var index = start; index <= end; index++) {
    var layer = activeDocument.layers[index];
    layer.blendMode = index == end ? BlendMode.NORMAL : options.blendMode;
    layer.visible = true;
    layer.opacity = 100;
  }
}

LayerUtil.applyCommetEffect = function(options, start, end) {
  var opacity = 100;
  var increments = 100 / (end - start + 1);
  for (var index = start; index <= end; index++) {
    var layer = activeDocument.layers[index];
    layer.blendMode = options.blendMode;
    layer.visible = true;
    layer.opacity = opacity;
    opacity -= increments;
  }
}

LayerUtil.applyReverseCommetEffect = function(options, start, end) {
  var opacity = 100;
  var increments = 100 / (end - start + 1);
  for (var index = end; index >= start; index--) {
    var layer = activeDocument.layers[index];
    layer.blendMode = index == end ? BlendMode.NORMAL : options.blendMode;
    layer.visible = true;
    layer.opacity = opacity;
    opacity -= increments;
  }
}

LayerUtil.applyEffect = function(options, i, j) {
  switch (options.effect) {
    case 'normal': return LayerUtil.applyNormalEffect(options, j, i);
    case 'reverseCommet': return LayerUtil.applyReverseCommetEffect(options, j, i);
    case "commet": return LayerUtil.applyCommetEffect(options, j, i);
  }
}

LayerUtil.setLayerLocked = function(layer, isLocked) {
  layer.allLocked = isLocked;
  layer.pixelsLocked = isLocked;
  layer.positionLocked = isLocked;
  layer.transparentPixelsLocked = isLocked;
}

LayerUtil.selectSingleLayer = function(layer) {
  var idslct = charIDToTypeID( "slct" );
  var desc8 = new ActionDescriptor();
  var idnull = charIDToTypeID( "null" );
  var ref3 = new ActionReference();
  var idLyr = charIDToTypeID( "Lyr " );
  ref3.putName( idLyr, layer.name );
  desc8.putReference( idnull, ref3 );
  var idMkVs = charIDToTypeID( "MkVs" );
  desc8.putBoolean( idMkVs, false );
  executeAction( idslct, desc8, DialogModes.NO );
}

LayerUtil.addToLayerSelection = function(layer) {
  var idslct = charIDToTypeID( "slct" );
  var desc18 = new ActionDescriptor();
  var idnull = charIDToTypeID( "null" );
  var ref11 = new ActionReference();
  var idLyr = charIDToTypeID( "Lyr " );
  ref11.putName( idLyr, layer.name );
  desc18.putReference( idnull, ref11 );
  var idselectionModifier = stringIDToTypeID( "selectionModifier" );
  var idselectionModifierType = stringIDToTypeID( "selectionModifierType" );
  var idaddToSelection = stringIDToTypeID( "addToSelection" );
  desc18.putEnumerated( idselectionModifier, idselectionModifierType, idaddToSelection );
  var idMkVs = charIDToTypeID( "MkVs" );
  desc18.putBoolean( idMkVs, false );
  executeAction( idslct, desc18, DialogModes.NO );
}

LayerUtil.putLayersIntoTimeline = function() {
  var idmakeFrameAnimation = stringIDToTypeID( "makeFrameAnimation" );
  executeAction( idmakeFrameAnimation, undefined, DialogModes.NO );
  var idanimationFramesFromLayers = stringIDToTypeID( "animationFramesFromLayers" );
  var desc2665 = new ActionDescriptor();
  executeAction( idanimationFramesFromLayers, desc2665, DialogModes.NO );
}
