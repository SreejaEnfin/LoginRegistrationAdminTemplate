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
    error:Error
});
    }
});

// login
// urouter.post('/login', (req, res)=>{
//     let userData = req.body;
//     User.findOne({uemail:userData.uemail},(err, user)=>{
//         if(err){
//             res.json({
//                 "success":false,
//                 "data":err
//             })
//         }
//         else{
//             if(!user){
//                 res.status(401).json({
//                     "success":false,
//                     "message":"Invalid Email",
//                 })
//             }else if(!bcrypt.compareSync(userData.upassword, user.upassword)){
//                 res.status(401).json({
//                     "success":false,
//                     "message":"Invalid Password",
//                 })
//             }else{
//                 let payload = {
//                     id:user.ObjectId,
//                     name:user.uname,
//                     email:user.uemail
//                 }
//                 let token = jwt.sign(payload, "secretkey");
//                 res.status(200).json({
//                     "success":true,
//                     "message":"Login Successfull",
//                     "data":token
//                 });
//             }
//         }
//     });
// });

urouter.post('/login', async(req, res)=>{
    let userData = req.body;
    try{
        let result = await User.findOne({uemail: userData.uemail});
            if(result){
                    if(bcrypt.compareSync(userData.upassword, result.upassword)){
                        let payload = {
                            id:result.ObjectId,
                            name:result.uname,
                            email:result.uemail,
                            role:result.urole
                        }
                        let token = jwt.sign(payload, "secretkey");
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
urouter.get('/', async(req, res)=>{
    try{
    let result = await User.find();
    res.status(200).json({
        "success":true,
        "data":result
    });
}catch(err)
{
    res.status(400).json({
        "success":false,
        "data":err
    })
}
})

// delete
urouter.delete('/:id', async(req, res)=>{
    try{
    if(objectId.isValid(req.params.id)){
        let result = await User.findByIdAndRemove(req.params.id);
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

module.exports = urouter;