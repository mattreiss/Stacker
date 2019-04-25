#include "Stacker Scripts Only/Options.jsx"
#include "Stacker Scripts Only/Stack.jsx"
#include "Stacker Scripts Only/StackSupport.jsx"
#include "Stacker Scripts Only/Terminology.jsx"

var fileList;
var outputDir;

function stripOutInteger(o) {
  var r = String(o)
  r = r.substring(r.lastIndexOf("/") + 1);
  r = r.replace(/^\D+|\D+$/g, "");
  while (r.charAt(0) == "0"){
    r = r.substring(1);
  }
  return parseInt(r);
}

function readFileList(folder) {
  var selectedFileList = folder.getFiles(/\.(jpg|jpeg|cr2|ARW|psd)$/i);
  if (!selectedFileList || selectedFileList.length < 2) {
    return alert("Please select a folder with 2 or more files you want to stack");
  }
  var filteredFileList = [];
  var uniqueFiles = {};
  for (var i in selectedFileList) {
    var file = selectedFileList[i];
    if (!uniqueFiles[stripOutInteger(file)]) {
      uniqueFiles[stripOutInteger(file)] = true;
      var cleanFile = File(String(file).replace("._", ""));
      filteredFileList.push(cleanFile);
    }
  }
  filteredFileList.sort(function(a, b) {
    return stripOutInteger(a) - stripOutInteger(b);
  });
  return filteredFileList;
}

function getOutputDir() {
  return Folder.selectDialog( "Please select an output folder");
}

function printFileList() {
    var c = 0;
    var list = "";
    for (var i in fileList) {
      c++;
      if (c > 30) break;
      var file = fileList[i];
      list += file + "\n";
    }
    alert("fileList: \n" + list);
}

function Stacker(args) {
  if (app.documents && app.documents.length > 0) {
    return alert("Please close all open documents and run the script again!");
  }
  var selectedFolder;
  if (args.length < 1) {
    selectedFolder = Folder.selectDialog( "Please select input folder");
    if (selectedFolder !== null)  {
      fileList = readFileList(selectedFolder);
    }
    if (!fileList) {
      return;
    }
    getOptions(goStack);
  } else {
    selectedFolder = new Folder(args[0]);
    var options = (new Function( "return " + args[1]) )();
    function fixBlendMode() {
      switch (options.blendMode) {
        case 8: return BlendMode.LIGHTEN;
        case 4: return BlendMode.DARKEN;
        case 2: return BlendMode.Normal;
      }
    }
    options.blendMode = fixBlendMode();
    fileList = readFileList(selectedFolder);
    goStack(options);
  }

  function goStack(options) {
    outputDir = selectedFolder + "/stacks-of-" + options.stackLength;
    var f = new Folder(outputDir);
    if (!f.exists) {
      f.create()
    }
    var time = Date.now();
    alert("Stacking " + fileList.length + " files!")
    stack(fileList, outputDir, options);
    if (options.video) { // export stacked timelapse video
      fileList = readFileList(new Folder(outputDir + "/jpg"));
      exportVideo(fileList, options, outputDir, true);
    }
    time = (Date.now() - time) / (1000 * 60);
    alert("Finished Stacking in " + parseFloat(time).toFixed(2) + " minutes!");
  }
}
