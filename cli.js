#!/usr/bin/env node
const path = require("path");
const defaultConfig = require("./src/default-config");
const fs = require("fs");
const SortEngine = require("./src/sort-engine");
const { program } = require("commander");



program.name("image-sort")
  .description("Sorts images into directories")

program.option("-i, --inputDir <dir>")
  .option("-c, --configurationFile <filename>")
  .option("-o, --outputDir <dir>")
  .option("-r, --removeFiles")
  .option("--debug")

program.parse();

let {inputDir, outputDir, configurationFile, removeFiles, debug} = program.opts();
if(debug){
  console.log("Program Opts: " + JSON.stringify({inputDir,outputDir, configurationFile, removeFiles, debug}, null, 2));
}
if(!inputDir){
  inputDir = process.cwd();
} else if(inputDir[0] === "."){
  inputDir = path.join(process.cwd(), inputDir);
}
if(!outputDir){
  outputDir = process.cwd();
} else if(outputDir[0] === "."){
  outputDir = path.join(process.cwd(), outputDir);
}

let config;
if(!configurationFile){
  config = defaultConfig;
} else {
  config = JSON.parse(fs.readFileSync(configurationFile));
}

new SortEngine(config, inputDir, outputDir, removeFiles, debug).sort();
