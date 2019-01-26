#include "Stacker Scripts Only/Options.jsx"
#include "Stacker Scripts Only/Stack.jsx"

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
    let fileList = selectedFolder.getFiles(/\.(jpg|jpeg|cr2|ARW|psd)$/i);
    if (!fileList || fileList.length < 2) {
      return alert("Please select a folder with 2 or more files you want to stack");
    }
    fileList.sort(function(a, b) {
      return stripOutInteger(a) - stripOutInteger(b);
    });
    printFileList(fileList);
    return fileList
  }
}

function getOutputDir() {
  return Folder.selectDialog( "Please select an output folder");
}

function printFileList(fileList) {
    var c = 0;
    var list = "";
    for (var i in fileList) {
      c++;
      if (c > 20) break;
      var file = fileList[i];
      list += stripOutInteger(file) + "\n";
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
