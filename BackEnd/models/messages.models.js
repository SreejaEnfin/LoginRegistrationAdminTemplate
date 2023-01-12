const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    sender:[{
        type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
    }],
    date:{
        type:Date,
        default: Date.now
    },
    message:{
        type:String
    },
    room:{
        type:String
    }
})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;