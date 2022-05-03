import dotenv from 'dotenv';
dotenv.config();
// require('dotenv').config({ path: __dirname+'../.env' });
// console.log(__dirname);

import Express, { Response } from 'express';
import router from "./routes/routes";
import {resetDBOnStartup} from "./controllers/dbController";
const app = Express();
const port = process.env.PORT;

app.set("views", __dirname+"/views");
app.set("view engine", "pug");
app.use(Express.static(__dirname+'/public'));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use("/", router)

app.get('/', (_, res:Response) => {
  res.render('index');
});

app.get("/favicon.ico", (req, res) => {
  res.send().status(404);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
  resetDBOnStartup();
});