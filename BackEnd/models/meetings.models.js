const mongoose = require('mongoose');
const Meetings = mongoose.model("meeting",{
    mname:{
        type:String,
    },
    mhost:[{
        userId:{
            type:String,
        }
    }],
    mparticipants:[{
        userId:{
            type:String,
        }
    }],
    mdate:{
        type:String,
    },
    mstatus:
    {
        type:Boolean
    },
    
});

module.exports = Meetings;