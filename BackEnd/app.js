const express = require('express');
const cors = require('cors');
const mongoose = require("./db.js");
const urouter = require("./routes/users.routes");

const app = express();
app.use(express.json());
app.use(cors());

app.use('/users', urouter);

app.listen(3000, ()=>{
    console.log("App is listening on port 3000");
})