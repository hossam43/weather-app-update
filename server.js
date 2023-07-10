// Setup empty JS object to act as endpoint for all routes
let projectData = {};
// Require Express to run server and routes
const express = require("express");
const app = express();

// Start up an instance of app
console.log("");
/* Middleware*/
const bodyParser = require("body-parser");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.json());
// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());
// Initialize the main project folder
app.use(express.static("website"));
// Setup Server
const port = 5000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
//Defines a route for handling POST requests to "/addweather"
app.post("/addweather", function (req, res) {
  // It assigns the request body (containing weather data) to the projectData
  projectData = req.body;
  console.log(req.body);
  //the server sends a response containing the updated projectData back to the client who made the request.
  res.send(projectData);
});

// Defines a route for handling GET requests to "/getweather"
app.get("/getweather", (req, res) => {
  console.log(projectData);
  res.send(projectData);
});
