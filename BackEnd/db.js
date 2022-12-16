const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION_STRING, (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("DB Connected Successfully");
    }
})

module.exports = mongoose;