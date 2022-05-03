const reqBinRouter = require("express").Router();
const { createPgBin, generatePgKey } = require("../lib/javascripts/createPgBin");
const parseRequest = require("../lib/javascripts/parseRequest");
const { addReqDoc, listAllBins, getAllReqDocs_FromOneBin, findSingleReqDoc_FromOneBin, deleteAllReqDocs_FromOneBin } = require('../lib/javascripts/mongoQuery.js');
require('dotenv').config();
const { keyNotFound } = require('../lib/javascripts/createPgBin');
const port = process.env.PORT;
const domain = process.env.DOMAIN;
const { spawn } = require('child_process');

function runChildProcess(command, optionsArray) {
  return new Promise((resolve, reject) => {
    const newProcess = spawn(command, optionsArray);  

    newProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
  
    newProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      if (/skipping/.test(data)) {
        resolve()
      } else {
        reject();
      }
    });
  
    newProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      console.log("The command was: ", optionsArray)
      resolve();
    });
  })
}

function resetDB(req, res) {
  runChildProcess('psql', ['-d', 'postgres', '-c', 'drop database if exists request_bin;'])
  .then(() => {return runChildProcess('psql', ['-d', 'postgres', '-c', 'create database request_bin;'])})
  .then(() => {return runChildProcess('psql', ['-d', 'request_bin', '-f', './lib/pgSchema.sql'])})
  .catch(_ => {
    console.log("An error occured.")
  })

  res.redirect(`/`);
}

// navigate here to delete all reqs from seed bin
function deleteSeed(req, res) {
  deleteAllReqDocs_FromOneBin(SEED_BIN).then(
    response => {
      console.log(response);
      res.send(response);
    }
  );
}

module.exports = {
  resetDB,
  deleteSeed
}