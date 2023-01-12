const express = require('express');
const Message = require('../models/messages.models');
const crouter = express.Router();

crouter.get('/', async (req, res)=>{
try{
    const urlSlug = req.query.slug
    console.log("for messages",urlSlug);
    let result = await Message.find({room:urlSlug}).populate([{path:'sender', select:'ufname'}]);
    console.log("in chat routes:", result);
    res.json({
        data:result,
        success:true
    })
}catch(e){
    res.json({
        data:e,
        success:false
    })
}
})

module.exports = crouter;