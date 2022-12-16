const mongoose = require('mongoose');
const meetingSchema = new mongoose.Schema({
    mname:{
        type:String
    },
    mhost:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
}],
mparticipants:[{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
}],
mdate:{
    type:Date,
},
mstatus:
{
    type:Boolean
},
mslug:{
    type:String
}
});

const Meetings = mongoose.model('meet', meetingSchema);

module.exports = Meetings;