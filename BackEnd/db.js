const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://sreejamohan444:cluster0@cluster0.mwlsecd.mongodb.net/LoginSignupDB", (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("DB Connected Successfully");
    }
})

module.exports = mongoose;