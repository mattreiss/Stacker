#include "Stacker Scripts Only/Options.jsx"
#include "Stacker Scripts Only/Stack.jsx"
#include "Stacker Scripts Only/StackSupport.jsx"

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

function getFileList() {
  var selectedFolder = Folder.selectDialog( "Please select input folder");
  if (selectedFolder !== null)  {
    var selectedFileList = selectedFolder.getFiles(/\.(jpg|jpeg|cr2|ARW|psd)$/i);
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

function main() {
  if (app.documents && app.documents.length > 0) {
    return alert("Please close all open documents and run the script again!");
  }

  fileList = getFileList();
  if (!fileList) {
    return;
  }
  printFileList();

  outputDir = getOutputDir();
  if (!outputDir) {
    return;
  }

  // call imported functions
  getOptions(function(options) {
    stack(fileList, outputDir, options);
  });
}

main();
