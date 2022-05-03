require('dotenv').config();

const { addReqDoc, listAllBins, getAllReqDocs_FromOneBin, findSingleReqDoc_FromOneBin, deleteAllReqDocs_FromOneBin } = require('./lib/javascripts/mongoQuery.js');
const parseRequest = require('./lib/javascripts/parseRequest');
const { keyNotFound } = require('./lib/javascripts/createPgBin');

const express = require('express');
const router = require("./api/routes");
const app = express();
const port = process.env.PORT;
const domain = process.env.DOMAIN;

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const binController = require("./controllers/binController");
//app.use("/api/req-bin", binController);
app.use("/", router)

app.get('/', (req, res) => {
  res.render('index');
});

app.get("/favicon.ico", (req, res) => {
  res.send().status(404);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
