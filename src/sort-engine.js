
let path = require("path");
let glob = require("glob");
let fs = require("fs");
let mkdirp = require("mkdirp");

class SortEngine{
  constructor(config, inputDir, outputDir, removeFiles,debug){
    this.config = config;
    this.inputDir = inputDir;
    this.outputDir = outputDir;
    this.removeFiles = removeFiles;
    this.debug = debug;
  }
  
  sort(){
    let inputFiles = this.buildFileList();
    let classifiedFiles = this.classify(inputFiles);
    console.log(this.sortNoSegs(classifiedFiles).segs);
  }
  
  buildFileList(){
    let fileList = [];
    if(this.debug){
      console.log("Extensions: " + this.config.fileExtensions.join(","));
    }
    for(let ext of this.config.fileExtensions){
      let globStr = path.join(this.inputDir, "**", "*." + ext);
      if(this.debug){
        console.log(globStr);
      }
      fileList = fileList.concat(glob.sync(globStr));
    }
    if(this.debug){
      console.log("FileList: " + fileList.join(","));
    }
    return fileList;
  }
  
  sortNoSegs(classified){
    let no_segs = classified.filter(({filePath, splitFile, base, baseSegmented, classification}) => {
      return classification[0] === "no_segs";
    });
    let segs = classified.filter(({filePath, splitFile, base, baseSegmented, classification}) => {
      return classification[0] !== "no_segs";
    });
    
    return {segs, no_segs};
  }
  
  classify(inputFiles){
    let segments = {};
    for(let segName in this.config.segments){
      if(segName !== "no_segs"){
        segments[segName] = this.config.segments[segName];
      }
    }
    if(this.debug){
      console.log("Segments: " + JSON.stringify(segments, null, 2))
    }
    
    let fileExtRemove = /(.+)\.[^\.]*$/
    
    let splitFiles = inputFiles.map((f) => {
      let split = f.split("/");
      let base = split[split.length - 1];
      
      let baseSegmented = base.split("_").map((s) => {
        if(fileExtRemove.test(s)){
          return fileExtRemove.exec(s)[1];
        }
        return s;
      });
      
      return { filePath: f, splitFile:split, base, baseSegmented};
    });
    
    let classified = splitFiles.map(({filePath, splitFile, base, baseSegmented}) => {
      let classifiedSegments = [];
      for(let segName in segments){
        if(segments[segName].not){
          let notted = false;
          for(let notSeg of segments[segName].not){
            let nopeSeg = segments[notSeg];
            for(let s of nopeSeg.elements){
              if(baseSegmented.indexOf(s) >= 0){
                notted = true;
                break;
              }
            }
            if(notted){
              break;
            }
          }
          if(notted){
            continue;
          }
        }
        for(let subSeg of segments[segName].elements){
          if(baseSegmented.indexOf(subSeg) >=0){
            classifiedSegments.push(segName)
          }
        }
      }
      
      return {filePath, splitFile, base, baseSegmented, classification: classifiedSegments.length > 0 ? classifiedSegments : ["no_segs"]}
    });
    
    return classified;
  }
}

module.exports = SortEngine;