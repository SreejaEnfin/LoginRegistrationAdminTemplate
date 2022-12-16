const User = require("../models/users.models");
const express = require('express');
const cors = require('cors');
const urouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const yup = require('yup');
const objectId = require('mongoose').Types.ObjectId;

const app = express();

app.use(express.json());
app.use(cors());

// yup validation

const createUserSchema = yup.object().shape({
  ufname: yup.string().trim().required(),
  ulname:yup.string().trim().required(),
  uemail: yup.string().trim().required(),
  upassword: yup.string().trim().required(),
  ucpassword: yup.string().trim().required(),
  urole:yup.number().required()
});


// signup
urouter.post('/signup', async(req, res)=>{
    try{
        const parsedData = await createUserSchema.validate(req.body);
        let pass = parsedData.upassword;
        let cpass = parsedData.ucpassword;
        if(pass===cpass){
            var hash = bcrypt.hashSync(pass,10);
        }
        else{
            throw new Error("Confirm Password should be same as Password");
        }
        let useremail = req.body.uemail;
        let resultforemail = await User.findOne({uemail: useremail});
        if(!resultforemail){
            let user = new User({
            ufname:req.body.ufname,
            ulname:req.body.ulname,
            uemail:parsedData.uemail,
            upassword:hash,
            urole:req.body.urole
        });
        var result = await user.save();
        res.status(200).json({
            "success":true,
            "data":result
        });
    }
    else{
        throw new Error("Email already exits");
    }

    }
    catch(err){
res.status(400).json({
    "success":false,
    error:err.message
});
    }
});


// login
urouter.post('/login', async(req, res)=>{
    let userData = req.body;
    try{
        let result = await User.findOne({uemail: userData.uemail});
            if(result){
                    if(bcrypt.compareSync(userData.upassword, result.upassword)){
                        let payload = {
                            id:result.ObjectId,
                            name:result.ufname,
                            email:result.uemail,
                            role:result.urole
                        }
                        let token = jwt.sign(payload, process.env.SECRET_KEY);
                        res.status(200).json({
                            "success":true,
                            "message":"Login Successfull",
                            data:token
                        });
                    }
                    else{
                        throw new Error("Password does not match");
                    }
                }
                else{
                    throw new Error("Email does not match");
                }
            }
    catch(e){
        res.status(400).json({
            "success":false,
            "Error":e.message
        })
    }
});

// get all users

urouter.get('/withpagination', async(req, res)=>{
    const page = parseInt(req.query.page);
    const limit = req.query.limit|4;
    
    const startIndex = (page-1)*limit;
    
    const results = {}
    var pageDown = [];
    try{  
    results.finalData = await User.find({}, {ufname:1, uemail:1, urole:1}).limit(limit).skip(startIndex).exec();
    results.count = await User.countDocuments();
        results.pageCount = Math.ceil(results.count/limit);
        for(i=1;i<=results.pageCount;i++){
          pageDown.push(i);
        }
  
    res.status(200).json({
        success:true,
        data:results
    });
}catch(err)
{
    res.status(400).json({
        success:false,
        data:err.message
    })
}
})

// only get

urouter.get('/', async(req, res)=>{
    try{
        var result = await User.find();
        res.status(200).json({
            message:"Successully collected",
            data:result
        })
    }catch(e){
        res.status(400).json({
            message:"Failed to collect",
            error:e
        })
    }
})

// delete
urouter.delete('/:id', async(req, res)=>{
    try{
    if(objectId.isValid(req.params.id)){
        let result = await User.findByIdAndRemove(req.params.id);
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

module.exports = urouter;