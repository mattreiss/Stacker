function checkBackground() {
  activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-1];
  if (activeDocument.activeLayer.isBackgroundLayer) {
    activeDocument.activeLayer.name=activeDocument.activeLayer.name;
  }
}

function deleteLayer(layer) {
  if(!layer.visisible) layer.visible = true;
  if(layer.locked) layer.locked = false;
  layer.remove();
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

function applyReverseCommetEffect(options, start, end) {
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

function setLayerLocked(layer, isLocked) {
  layer.allLocked = isLocked;
  layer.pixelsLocked = isLocked;
  layer.positionLocked = isLocked;
  layer.transparentPixelsLocked = isLocked;
}

function selectSingleLayer(layer) {
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

function addToLayerSelection(layer) {
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

function putFilesIntoLayers(fileList, options, keepVisible) {
  for (var i = 0; i < fileList.length; i++) {
    open(fileList[i]);
    checkBackground();
    if (i > 0) {
      duplicateLayer(app.documents[0].name);
      app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    }
    var layer = activeDocument.layers[0];
    layer.name = 'Layer ' + i;
    layer.visible = keepVisible || false;
  }
  if (options.autoAlign) {
    selectAllLayers();
    alignLayersByContent(); // defined in StackSupport.jsx
  }
}

function putLayersIntoTimeline() {
  var idmakeFrameAnimation = stringIDToTypeID( "makeFrameAnimation" );
  executeAction( idmakeFrameAnimation, undefined, DialogModes.NO );
  var idanimationFramesFromLayers = stringIDToTypeID( "animationFramesFromLayers" );
  var desc2665 = new ActionDescriptor();
  executeAction( idanimationFramesFromLayers, desc2665, DialogModes.NO );

}

function exportVideo(fileList, options) {
  app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  putFilesIntoLayers(fileList, options, true);
  var video = options.video.split("@");
  var height = parseInt(video[0]);
  var fps = parseInt(video[1]);
  function getWidth() {
    switch(height) {
      case 2304: return 3936;
      case 1080: return 1920;
      case 720: return 1280;
    }
  }
  var width = getWidth();

  putLayersIntoTimeline();

  var idExpr = charIDToTypeID( "Expr" );
  var desc2685 = new ActionDescriptor();
  var idUsng = charIDToTypeID( "Usng" );
  var desc2686 = new ActionDescriptor();
  var iddirectory = stringIDToTypeID( "directory" );
  desc2686.putPath( iddirectory, new File( outputDir ) );
  var idsubdirectory = stringIDToTypeID( "subdirectory" );
  desc2686.putString( idsubdirectory, """video""" );
  var idNm = charIDToTypeID( "Nm  " );
  desc2686.putString( idNm, "stacker-" + options.video + ".mp4" );
  var idameFormatName = stringIDToTypeID( "ameFormatName" );
  desc2686.putString( idameFormatName, """H.264""" );
  var idamePresetName = stringIDToTypeID( "amePresetName" );
  desc2686.putString( idamePresetName, """1_High Quality.epr""" );
  var idWdth = charIDToTypeID( "Wdth" );
  desc2686.putInteger( idWdth, width );
  var idHght = charIDToTypeID( "Hght" );
  desc2686.putInteger( idHght, height );
  var idframeRate = stringIDToTypeID( "frameRate" );
  desc2686.putDouble( idframeRate, fps );
  var idpixelAspectRatio = stringIDToTypeID( "pixelAspectRatio" );
  var idpixelAspectRatio = stringIDToTypeID( "pixelAspectRatio" );
  var idDcmn = charIDToTypeID( "Dcmn" );
  desc2686.putEnumerated( idpixelAspectRatio, idpixelAspectRatio, idDcmn );
  var idfieldOrder = stringIDToTypeID( "fieldOrder" );
  var idvideoField = stringIDToTypeID( "videoField" );
  var idpreset = stringIDToTypeID( "preset" );
  desc2686.putEnumerated( idfieldOrder, idvideoField, idpreset );
  var idmanage = stringIDToTypeID( "manage" );
  desc2686.putBoolean( idmanage, true );
  var idallFrames = stringIDToTypeID( "allFrames" );
  desc2686.putBoolean( idallFrames, true );
  var idrenderAlpha = stringIDToTypeID( "renderAlpha" );
  var idalphaRendering = stringIDToTypeID( "alphaRendering" );
  var idNone = charIDToTypeID( "None" );
  desc2686.putEnumerated( idrenderAlpha, idalphaRendering, idNone );
  var idQlty = charIDToTypeID( "Qlty" );
  desc2686.putInteger( idQlty, 1 );
  var idvideoExport = stringIDToTypeID( "videoExport" );
  desc2685.putObject( idUsng, idvideoExport, desc2686 );
  executeAction( idExpr, desc2685, DialogModes.NO );
}

function applyEffect(options, i, j) {
  switch (options.effect) {
    case 'normal': return;
    case 'reverseCommet': return applyReverseCommetEffect(options, j, i);
    case "commet": return applyCommetEffect(options, j, i);
  }
}

function mainLoop(fileList, outputDir, options) {
  var fileCount = 0;
  var i = fileList.length - 1;
  if (options.stackGrowth) {
    for (var j = i - 1; j > i - options.stackLength; j -= options.displacement) {
      applyEffect(options, i, j);
      fileCount++;
      saveJpg(outputDir, fileCount);
    }
  }
  var j = i - options.stackLength;
  if (j < 0) j = 0;
  while (j >= 0) {
    applyEffect(options, i, j);
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
  putFilesIntoLayers(fileList, options);
  mainLoop(fileList, outputDir, options);
}
