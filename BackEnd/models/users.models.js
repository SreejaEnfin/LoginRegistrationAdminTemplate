const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    ufname:{
        type:String
    },
    ulname:{
        type:String
    },
    uemail:{
        type:String
    },
    upassword:{
        type:String
    },
    urole:{
        type:Number
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;