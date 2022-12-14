const mongoose = require('mongoose');
const User = mongoose.model("user",{
    ufname:{
        type:String,
    },
    ulname:{
        type:String,
    },
    uemail:{
        type:String,
        unique:true,
    },
    upassword:{
        type:String
    },
    ucpassword:
    {
        type:String
    },
    urole:{
        type:Number,
    }
});

module.exports = User;