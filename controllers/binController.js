const reqBinRouter = require("express").Router();
const { createPgBin, generatePgKey } = require("../lib/javascripts/createPgBin");
const parseRequest = require("../lib/javascripts/parseRequest");
const { addReqDoc, getAllReqDocs_FromOneBin } = require('../lib/javascripts/mongoQuery.js');
require('dotenv').config();
const { keyNotFound } = require('../lib/javascripts/createPgBin');
const domain = process.env.DOMAIN;

// Hitting this API end point will create a new bin in postgres and mongoDB
// and redirect user 
async function createNewBin(req, res) {
  const key = await generatePgKey();
  console.log("Key generated successfully: ", key);
  await createPgBin(key);

  res.redirect(`/${key}/instructions`);
}

function showInstructions(req, res) {
  const key = req.params.id;
  
  res.render('instructions', {
    urlKey: key,
    domain: domain
  })
}

function viewOneBin(req, res) {
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

async function catchRequestInBin(req, res) {
  const key = req.params.id;
  const isInvalidKey = await keyNotFound(key);

  if (!isInvalidKey) {
    await addReqDoc(parseRequest(req), key);
    res.send("request was logged in the bin").status(200);
  } else {
    res.send("We couldn't find that key sorry ").status(400); // bin doesn't exist
  }
}


module.exports = {
  createNewBin,
  showInstructions,
  viewOneBin,
  catchRequestInBin
};