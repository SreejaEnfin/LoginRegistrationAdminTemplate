require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("./db.js");
const urouter = require("./routes/users.routes");
const mrouter = require('./routes/meetings.routes.js');
const bodyparser = require('body-parser');

const app = express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

app.use('/users', urouter);
app.use('/meetings', mrouter);

app.listen(3000, ()=>{
    console.log("App is listening on port 3000");
})