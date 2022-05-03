const reqBinRouter = require("express").Router();
import { createPgBin, generatePgKey } from "../lib/javascripts/createPgBin";
import { parseRequest } from "../lib/javascripts/parseRequest";
import { addReqDoc, getAllReqDocs_FromOneBin } from '../lib/javascripts/mongoQuery';
import { keyNotFound } from '../lib/javascripts/createPgBin';
import { Request, Response } from 'express';
require('dotenv').config();

const domain = process.env.DOMAIN;

// Hitting this API end point will create a new bin in postgres and mongoDB
// and redirect user 
export async function createNewBin(_:Request, res:Response) {
  const key = await generatePgKey();
  console.log("Key generated successfully: ", key);
  await createPgBin(key);

  res.redirect(`/${key}/instructions`);
}

export function showInstructions(req, res) {
  const key = req.params.id;
  
  res.render('instructions', {
    urlKey: key,
    domain: domain
  })
}

export function viewOneBin(req:Request, res:Response) {
  //call to dbs to get all documents in a collection
  //response needs to be passed to display view below instead of []
  const key = req.params.id;

  getAllReqDocs_FromOneBin(key).then(
    response => {
      console.log(`There are ${response.length} records.`);
      res.render('view', {
        requests: response
      });
    }
  );
};

export async function catchRequestInBin(req:Request, res:Response) {
  const key = req.params.id;
  const isInvalidKey = await keyNotFound(key);

  if (!isInvalidKey) {
    await addReqDoc(parseRequest(req), key);
    res.send("request was logged in the bin").status(200);
  } else {
    res.send("We couldn't find that key sorry ").status(400); // bin doesn't exist
  }
}