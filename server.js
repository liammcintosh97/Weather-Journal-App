/* Dependencies  */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

/* Start Server */
//Start an instance of the app
const app = express();
//Spin up the server
const port = 8000;
app.listen(port, ()=>{console.log(`The server is running: listing on port ${port}`)});
//Initialize the main project folder
app.use(express.static('website'));

/* Middleware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/* Routing */
let projectData = [];

app.get("/getData", (req,res)=>{
  res.send(projectData);
});

app.post("/postData",(req,res)=>{
  projectData = req.body
  console.log(projectData);
  res.send(projectData);
})