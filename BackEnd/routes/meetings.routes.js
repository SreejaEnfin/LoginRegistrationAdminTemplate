const express = require('express');
const cors = require('cors');
const mrouter = express.Router();
const yup = require('yup');
const objectId = require('mongoose').objectId;

const Meetings = require('../models/meetings.models');

const app = express();

app.use(express.json());
app.use(cors());

const MeetingSchema = yup.object().shape({
    mname: yup.string().trim().required(),
    mhost:yup.array().required(),
    mparticipants: yup.array().required(),
    mdate: yup.string().required(),
    mstatus: yup.boolean().required(),
  });


// post
mrouter.post('/', async(req, res)=>{
    try{
        const parsedData = await MeetingSchema.validate(req.body);
        let meetings = new Meetings({
            mname:parsedData.mname,
            mhost:parsedData.mhost,
            mparticipants:parsedData.mparticipants,
            mdate:parsedData.mdate,
            mstatus:parsedData.mstatus
        });
        var result = await meetings.save();
        res.status(200).send({
            success:true,
            message:"Meetings Details added successfully",
            data:result
        });
    }
    catch(err){
        res.status(400).send({
            success:false,
            error:err.message
        });
    }
});


// get
mrouter.get('/', async(req, res)=>{
    try{
        let result = await Meetings.find();
        res.status(200).send({
            message:"Successfull collected data",
            data:result
        });
    }catch(e){
        res.status(400).send({
            message:"Failed to collect data",
            error:e
        })
    }
})

// delete
mrouter.delete('/:id', async(req, res)=>{
    try{
    if(objectId.isValid(req.params.id)){
        let result = await Meetings.findByIdAndRemove(req.params.id);
        res.send({
            status:true,
            message:"Successfully deleted",
            data:result
        })
    }
    else{
        throw new Error("Id not valid");
    }
}catch(e){
res.send({
    status:false,
    error:e.message
})
}
})


module.exports = mrouter;
  
