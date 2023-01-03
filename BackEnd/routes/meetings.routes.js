const express = require('express');
const cors = require('cors');
const mrouter = express.Router();
const yup = require('yup');
const objectId = require('mongoose').Types.ObjectId;
const {v4 : uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
const format = require('date-fns/format');
const Meetings = require('../models/meetings.models');
const verifyToken = require("../utils/verifyToken");
const { fork }= require('child_process');
const { join } = require('path');
const User = require("../models/users.models");
const { Http2ServerRequest } = require('http2');



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
            mdate : parsedData.mdate,
            mstatus:parsedData.mstatus,
            mslug:uuidv4()
        });
        var result = await meetings.save();
        const results={};   
        // fork starts here
        const joinMeet = fork('join_meeting.js');


        results.hostData = await User.find({_id:result.mhost}, {uemail:1, ufname:1})
        console.log("Hosts: ", results.hostData);
        results.participantsData = await User.find({_id:result.mparticipants}, {uemail:1, ufname:1})
        console.log("Participants: ", results.participantsData);
        results.slug = result.mslug;
        console.log("Results: ", results);

        joinMeet.send(results);
        // fork ends here

        res.status(200).json({
            success:true,
            message:"Meetings Details added successfully",
            data:result
        });
    }
    catch(err){
        res.status(400).json({
            success:false,
            error:err
        });
    }
});



//  search by meeting name / slug with pagination
mrouter.get('/', async(req, res)=>{
    try{
        const page = parseInt(req.query.page);
        const filterText = req.query.filter;
        const limit = req.query.limit;
        const searchText = req.query.search;
        var query={};
        console.log("Filter Value:", filterText);
        console.log("Search Text:", searchText)
        if(searchText){
            query['$or']= [ {mname:{$regex:searchText, $options: 'i'}}, { mslug:{$regex:searchText, $options:'i'} }] 
        }

        if(filterText){
            console.log("FilterText is present")
            query['mstatus']=filterText
        }

        // if(searchText && filterText){
        //     query={$and:[{mstatus:filterText}, {$or:[{mname:{$regex:searchText, $options: 'i'}},{ mslug:{$regex:searchText, $options:'i'} }]}]}
        // }

        
        const startIndex = (page-1)*limit;
        
        const results = {};
        var pageDown = [];

        results.finalData = await Meetings.find(query).sort({_id:-1}).populate([{path:'mhost', select:'ufname'}, {path:'mparticipants', select:'ufname'}]).limit(limit).skip(startIndex).exec();
        console.log("After Filter", results.finalData);
        results.count = await Meetings.countDocuments(query);
        
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
    

// fetching details for user page
mrouter.get('/fetchdetails', verifyToken, async(req, res)=>{
    try{
        console.log("Hi Sreeja");
        console.log(req.userDetails);
        const page = parseInt(req.query.page);
        const limit = req.query.limit;

        const startIndex = (page-1)*limit;
        
        const results = {};
        var pageDown = [];
        var userPageDetailsId = req.userDetails._id;
        results.userDetails = userPageDetailsId;
        console.log(userPageDetailsId);

        results.finalData = await Meetings.find({$or: [ {mhost:userPageDetailsId}, { mparticipants:userPageDetailsId } ] }).limit(limit).skip(startIndex).exec();
        // .sort({_id:-1}).populate([{path:'mhost', select:'ufname'}, {path:'mparticipants', select:'ufname'}])
        console.log(results.finalData);
        console.log(results.finalData.length);

        results.count = await Meetings.countDocuments({$or: [ {mhost:userPageDetailsId}, { mparticipants:userPageDetailsId } ] });
        console.log(results.count);
        
        results.pageCount = Math.ceil(results.count/limit);
        
        for(i=1;i<=results.pageCount;i++){
          pageDown.push(i);
        }
        console.log(results);
        res.status(200).json({
            message:"Successfull collected data",
            data:results,
            pageDown:pageDown
        });
        
        }
        catch(e){
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

    // join meeting
    mrouter.get('/join-meeting/:slug', (req, res)=>{
        const slug = req.query.slug
        res.status(200).json({
            message:"Meeting started",
            slug:slug

        });
    })


module.exports = mrouter;
  
