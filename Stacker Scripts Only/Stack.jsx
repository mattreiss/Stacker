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


function restoreDefaultLayers(start, end) {
  for (var index = start; index <= end; index++) {
    var layer = activeDocument.layers[index];
    layer.blendMode = BlendMode.NORMAL;
    layer.visible = true;
    layer.opacity = 100;
  }
}


function applyNormalEffect(options, start, end) {
  for (var index = start; index <= end; index++) {
    var layer = activeDocument.layers[index];
    layer.blendMode = index == end ? BlendMode.NORMAL : options.blendMode;
    layer.visible = true;
    layer.opacity = 100;
  }
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

function openFileAsLayer(filePath) {
  var idPlc = charIDToTypeID( "Plc " );
  var desc516 = new ActionDescriptor();
  var idnull = charIDToTypeID( "null" );
  desc516.putPath( idnull, new File( filePath ) );
  var idFTcs = charIDToTypeID( "FTcs" );
  var idQCSt = charIDToTypeID( "QCSt" );
  var idQcsa = charIDToTypeID( "Qcsa" );
  desc516.putEnumerated( idFTcs, idQCSt, idQcsa );
  var idOfst = charIDToTypeID( "Ofst" );
  var desc517 = new ActionDescriptor();
  var idHrzn = charIDToTypeID( "Hrzn" );
  var idRlt = charIDToTypeID( "#Rlt" );
  desc517.putUnitDouble( idHrzn, idRlt, 0.000000 );
  var idVrtc = charIDToTypeID( "Vrtc" );
  var idRlt = charIDToTypeID( "#Rlt" );
  desc517.putUnitDouble( idVrtc, idRlt, 0.000000 );
  var idOfst = charIDToTypeID( "Ofst" );
  desc516.putObject( idOfst, idOfst, desc517 );
  executeAction( idPlc, desc516, DialogModes.NO );

  // =======================================================
  var idrasterizeLayer = stringIDToTypeID( "rasterizeLayer" );
  var desc518 = new ActionDescriptor();
  var idnull = charIDToTypeID( "null" );
  var ref440 = new ActionReference();
  var idLyr = charIDToTypeID( "Lyr " );
  var idOrdn = charIDToTypeID( "Ordn" );
  var idTrgt = charIDToTypeID( "Trgt" );
  ref440.putEnumerated( idLyr, idOrdn, idTrgt );
  desc518.putReference( idnull, ref440 );
  executeAction( idrasterizeLayer, desc518, DialogModes.NO );
}

function putFilesIntoLayers(fileList, options, keepVisible) {
  for (var i = 0; i < fileList.length; i++) {
    if (i == 0 || options.action) {
      open(fileList[i]);
      if (!keepVisible) {
        runAction(options.action)
      }
      checkBackground();
      if (i > 0) {
        duplicateLayer(app.documents[0].name);
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
      }
    } else {
      openFileAsLayer(fileList[i]);
    }
    var layer = activeDocument.layers[0];
    setLayerLocked(layer, false);
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

function exportVideo(fileList, options, outputDir, isExportingStacks) {
  if (isExportingStacks) {
    if (options.stackLength == 1) return;
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    putFilesIntoLayers(fileList, options, true);
  }
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

  var idExpr = charIDToTypeID( "Expr" );
    var desc4 = new ActionDescriptor();
    var idUsng = charIDToTypeID( "Usng" );
        var desc5 = new ActionDescriptor();
        var iddirectory = stringIDToTypeID( "directory" );
        desc5.putPath( iddirectory, new File( outputDir ) );
        var idNm = charIDToTypeID( "Nm  " );
        if (!isExportingStacks) {
          desc5.putString( idNm, "original-" + options.video + ".mp4" );
        } else {
          desc5.putString( idNm, "stacker-" + options.video + ".mp4" );
        }
        var idameFormatName = stringIDToTypeID( "ameFormatName" );
        desc5.putString( idameFormatName, """H.264""" );
        var idamePresetName = stringIDToTypeID( "amePresetName" );
        desc5.putString( idamePresetName, """1_High Quality.epr""" );
        var idWdth = charIDToTypeID( "Wdth" );
        desc5.putInteger( idWdth, width );
        var idHght = charIDToTypeID( "Hght" );
        desc5.putInteger( idHght, height );
        var idframeRate = stringIDToTypeID( "frameRate" );
        desc5.putDouble( idframeRate, fps );
        var idpixelAspectRatio = stringIDToTypeID( "pixelAspectRatio" );
        var idpixelAspectRatio = stringIDToTypeID( "pixelAspectRatio" );
        var idDcmn = charIDToTypeID( "Dcmn" );
        desc5.putEnumerated( idpixelAspectRatio, idpixelAspectRatio, idDcmn );
        var idfieldOrder = stringIDToTypeID( "fieldOrder" );
        var idvideoField = stringIDToTypeID( "videoField" );
        var idpreset = stringIDToTypeID( "preset" );
        desc5.putEnumerated( idfieldOrder, idvideoField, idpreset );
        var idmanage = stringIDToTypeID( "manage" );
        desc5.putBoolean( idmanage, true );
        var idallFrames = stringIDToTypeID( "allFrames" );
        desc5.putBoolean( idallFrames, true );
        var idrenderAlpha = stringIDToTypeID( "renderAlpha" );
        var idalphaRendering = stringIDToTypeID( "alphaRendering" );
        var idNone = charIDToTypeID( "None" );
        desc5.putEnumerated( idrenderAlpha, idalphaRendering, idNone );
        var idQlty = charIDToTypeID( "Qlty" );
        desc5.putInteger( idQlty, 1 );
    var idvideoExport = stringIDToTypeID( "videoExport" );
    desc4.putObject( idUsng, idvideoExport, desc5 );
executeAction( idExpr, desc4, DialogModes.NO );
}

function applyEffect(options, i, j) {
  switch (options.effect) {
    case 'normal': return applyNormalEffect(options, j, i);
    case 'reverseCommet': return applyReverseCommetEffect(options, j, i);
    case "commet": return applyCommetEffect(options, j, i);
  }
}

function processStacks(fileList, outputDir, options) {
  if (options.stackLength == 1) return;
  var fileCount = 0;
  var i = fileList.length - 1;
  if (options.stackGrowth) {
    for (var j = i - 1; j > i - options.stackLength && i > 0; j -= options.displacement) {
      applyEffect(options, i, j);
      fileCount++;
      saveJpg(outputDir, fileCount);
      if (fileCount % 2 == 0) {
        var nextI = i - options.displacement;
        while (i > nextI) {
          activeDocument.layers[i].visible = false;
          i--;
        }
      }
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
  processStacks(fileList, outputDir, options);
  if (options.video) { // export original timelapse video
    restoreDefaultLayers(0, fileList.length - 1);
    exportVideo(fileList, options, outputDir, false)
  }
}
