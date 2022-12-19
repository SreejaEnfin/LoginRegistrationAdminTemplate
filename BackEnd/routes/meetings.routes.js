const express = require('express');
const cors = require('cors');
const mrouter = express.Router();
const yup = require('yup');
const objectId = require('mongoose').Types.ObjectId;
const {v4 : uuidv4} = require('uuid');
const mongoose = require('mongoose');

const Meetings = require('../models/meetings.models');

const app = express();

app.use(express.json());
app.use(cors());

const MeetingSchema = yup.object().shape({
    mname: yup.string().trim().required(),
    mstatus: yup.boolean().required(),
    mdate:yup.date().required()
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
            mstatus:parsedData.mstatus,
            mslug:uuidv4()
        });
        var result = await meetings.save();
        res.status(200).json({
            success:true,
            message:"Meetings Details added successfully",
            data:result
        });
    }
    catch(err){
        res.status(400).json({
            success:false,
            error:err.message
        });
    }
});





// get
mrouter.get('/', async(req, res)=>{
    try{
        
        const page = parseInt(req.query.page);
        const limit = req.query.limit;
        
        const startIndex = (page-1)*limit;
        
        const results = {}
        var pageDown = [];
        // let result = await Meetings.find().select("_id");
        results.finalData = await Meetings.find().populate([{path:'mhost', select:'ufname'}, {path:'mparticipants', select:'ufname'}]).limit(limit).skip(startIndex).exec();
        results.count = await Meetings.countDocuments();
        results.pageCount = Math.ceil(results.count/limit);
        for(i=1;i<=results.pageCount;i++){
          pageDown.push(i);
        }
        res.status(200).json({
            message:"Successfull collected data",
            data:results,
            pageDown:pageDown
        });
    }catch(e){
        res.status(400).json({
            message:"Failed to collect data",
            error:e.message
        })
    }
})
// add pagination

//  search by meeting name / slug with pagination
mrouter.get('/search', async(req, res)=>{
    try{
        
        const page = parseInt(req.query.page);
        const limit = req.query.limit;
        const searchText = req.query.search;
        
        const startIndex = (page-1)*limit;
        
        const results = {}
        var pageDown = [];
        // let result = await Meetings.find().select("_id");
        results.finalData = await Meetings.find({$or: [ {mname:{$regex:searchText, $options: 'i'}}, { mslug:{$regex:searchText, $options:'i'} } ] }).populate([{path:'mhost', select:'ufname'}, {path:'mparticipants', select:'ufname'}]).limit(limit).skip(startIndex).sort({mdate:1}).exec();

        results.count = await Meetings.countDocuments({$or: [ {mname:{$regex:searchText, $options: 'i'}}, { mslug:{$regex:searchText, $options:'i'} } ] });
        results.pageCount = Math.ceil(results.count/limit);
        for(i=1;i<=results.pageCount;i++){
          pageDown.push(i);
        }
        res.status(200).json({
            message:"Successfull collected data",
            data:results,
            pageDown:pageDown
        });
       
    }catch(e){
        res.status(400).json({
            message:"Failed to collect data",
            error:e.message
        })
    }
})

// delete
mrouter.delete('/:id', async(req, res)=>{
    try{
    if(objectId.isValid(req.params.id)){
        let result = await Meetings.findByIdAndRemove(req.params.id);
        res.json({
            status:true,
            message:"Successfully deleted",
            data:result
        })
    }
    else{
        throw new Error("Id not valid");
    }
}catch(e){
res.json({
    status:false,
    error:e.message
})
}
})

// update
mrouter.put('/:id', async(req, res)=>{
    try{
    if(objectId.isValid(req.params.id)){
            const parsedData = await MeetingSchema.validate(req.body);
            let meetings = {
                mname:parsedData.mname,
                mhost:req.body.mhost,
                mparticipants:req.body.mparticipants,
                mdate:parsedData.mdate,
                mstatus:parsedData.mstatus
            }
            let result = await Meetings.findByIdAndUpdate(req.params.id, {$set:meetings}, {new:true});
            res.status(200).json({
                message:"Successfully updated",
                data:result
            })
        }
        else{
            throw new Error("Id is not valid");
        }
    }catch(e){
        res.status(400).json({
            message:Error.message,
            err:e.message
        })
    }
    })

// delete but only edit the status and not remove the items from db
mrouter.put('/delete/:id', async(req, res)=>{
    try{
    if(objectId.isValid(req.params.id)){
            let meetings = {
                mstatus:false
            }
            let result = await Meetings.findByIdAndUpdate(req.params.id, {$set:meetings}, {new:true});
            result.rstatus="Deleted";
            res.status(200).json({
                message:"Meeting deleted and status changed to false",
                data:result,

            })
        }
        else{
            throw new Error("Id is not valid");
        }
    }catch(e){
        res.status(400).json({
            message:Error.message,
            err:e.message
        })
    }
    })


module.exports = mrouter;
  
