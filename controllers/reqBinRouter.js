const reqBinRouter = require("express").Router();
const { createPgBin, generatePgKey } = require("../lib/javascripts/createPgBin");
const parseRequest = require("../lib/javascripts/parseRequest");
const { spawn } = require('child_process');

// Hitting this API end point will create a new bin in postgres and mongoDB
// and redirect user 
reqBinRouter.get('/create-bin', async (req, res) => {
  const key = await generatePgKey();
  console.log("Key generated successfully: ", key);
  await createPgBin(key);

  res.redirect(`/${key}/instructions`);
});

function runChildProcess(command, optionsArray) {
  return new Promise((resolve, reject) => {
    const newProcess = spawn(command, optionsArray);  

    newProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
  
    newProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      reject();
    });
  
    newProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      console.log("The command was: ", optionsArray)
      resolve();
    });
  })
}

reqBinRouter.get('/reset-db', async (req, res) => {

  runChildProcess('psql', ['-d', 'postgres', '-c', 'drop database if exists request_bin;'])
  .then(() => {return runChildProcess('psql', ['-d', 'postgres', '-c', 'create database request_bin;'])})
  .then(() => {return runChildProcess('psql', ['-d', 'request_bin', '-f', './lib/pgSchema.sql'])})
  .catch(_ => {
    console.log("An error occured.")
  })

  res.redirect(`/`);
});

module.exports = reqBinRouter;