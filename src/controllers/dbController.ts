// import {deleteAllReqDocs_FromOneBin} from '../lib/javascripts/mongoQuery';
require('dotenv').config();
import { spawn } from 'child_process';
import { Request, Response } from 'express';

export function runChildProcess(command:string, optionsArray:string[]) {
  return new Promise((resolve, reject) => {
    const newProcess = spawn(command, optionsArray);  

    newProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
  
    newProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      if (/skipping/.test(data)) {
        resolve(null)
      } else {
        reject();
      }
    });
  
    newProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      console.log("The command was: ", optionsArray)
      resolve(null);
    });
  })
}

export function resetDBOnStartup() {
  "DB reset on startup."
  runChildProcess('psql', ['-d', 'postgres', '-c', 'drop database if exists request_bin;'])
  .then(() => {return runChildProcess('psql', ['-d', 'postgres', '-c', 'create database request_bin;'])})
  .then(() => {return runChildProcess('psql', ['-d', 'request_bin', '-f', __dirname+'/../lib/pgSchema.sql'])})
  .catch(_ => {
    console.log("An error occured.")
  })
}

export function resetDB(_:Request, res:Response) {
  console.log("pgDirName:", __dirname);
  runChildProcess('psql', ['-d', 'postgres', '-c', 'drop database if exists request_bin;'])
  .then(() => {return runChildProcess('psql', ['-d', 'postgres', '-c', 'create database request_bin;'])})
  .then(() => {return runChildProcess('psql', ['-d', 'request_bin', '-f', __dirname+'/../lib/pgSchema.sql'])})
  .catch(_ => {
    console.log("An error occured.")
  })

  res.redirect(`/`);
}

// navigate here to delete all reqs from seed bin
// function deleteSeed(req, res) {
//   deleteAllReqDocs_FromOneBin(SEED_BIN).then(
//     response => {
//       console.log(response);
//       res.send(response);
//     }
//   );
// }