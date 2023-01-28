const User = require("../models/users.models");
const express = require('express');
const cors = require('cors');
const urouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const yup = require('yup');
const path = require('path');
const ejs = require('ejs');
const objectId = require('mongoose').Types.ObjectId;
const emailService = require("../utils/sendEmail");
const multer = require('multer');
const app = express();

// let upload = multer({dest:'uploads/'})
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads');
    },
    filename: (req, file, callback) => {
        callback(null, `IMG_${file.originalname}`);
    }
})

var upload = multer({ storage: storage });

urouter.use('/', express.static('public/uploads'));
// urouter.get('/public/uploads', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'public/uploads/', 'index.html'));
// });
// app.use(express.static('public'))

// yup validation

const createUserSchema = yup.object().shape({
    ufname: yup.string().trim().required(),
    ulname: yup.string().trim().required(),
    uemail: yup.string().trim().required(),
    upassword: yup.string().trim().required(),
    ucpassword: yup.string().trim().required(),
    urole: yup.number().required()
});


// signup
urouter.post('/signup', async (req, res) => {
    console.log("In Signup")
    try {
        const parsedData = await createUserSchema.validate(req.body);
        let pass = parsedData.upassword;
        let cpass = parsedData.ucpassword;
        if (pass === cpass) {
            var hash = bcrypt.hashSync(pass, 10);
        }
        else {
            throw new Error("Confirm Password should be same as Password");
        }
        let useremail = req.body.uemail;
        let resultforemail = await User.findOne({ uemail: useremail }, { ufname: 1, uemail: 1 });
        if (!resultforemail) {
            let user = new User({
                ufname: req.body.ufname,
                ulname: req.body.ulname,
                uemail: parsedData.uemail,
                upassword: hash,
                urole: req.body.urole
            });
            var result = await user.save();
            res.status(200).json({
                "success": true,
                "data": result
            });
        }
        else {
            throw new Error("Email already exits");
        }

    }
    catch (err) {
        res.status(400).json({
            "success": false,
            error: err.message
        });
    }
});




// login
urouter.post('/login', async (req, res) => {
    let userData = req.body;
    console.log(userData.uemail);
    try {
        let result = await User.findOne({ uemail: userData.uemail });
        console.log(result);
        if (result) {
            if (bcrypt.compareSync(userData.upassword, result.upassword)) {
                let payload = {
                    _id: result._id,
                    email: result.uemail,
                    name: result.ufname,
                    role: result.urole,
                    image: result.imgUrl
                }
                let token = jwt.sign(payload, process.env.SECRET_KEY);
                res.status(200).json({
                    "success": true,
                    "message": "Login Successfull",
                    data: token
                });
            }
            else {
                throw new Error("Password does not match");
            }
        }
        else {
            throw new Error("Email does not match");
        }
    }
    catch (e) {
        res.status(400).json({
            "success": false,
            "Error": e.message
        })
    }
});



// only get

urouter.get('/', async (req, res) => {
    try {
        var result = await User.find({ urole: 2 }, { ufname: 1, uemail: 1, urole: 1 });
        res.status(200).json({
            message: "Successully collected",
            data: result
        })
    } catch (e) {
        res.status(400).json({
            message: "Failed to collect",
            error: e
        })
    }
})


// forgot-password
urouter.post('/forgot-password', async (req, res) => {
    try {
        const email = req.query.email
        console.log(email);
        var result = await User.findOne({ uemail: email });
        if (!result) {
            throw new Error("Invalid Email");
        } else {
            console.log(result);
            let payload = {
                _id: result._id,
                email: result.uemail
            }
            let forgotToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '15m' });
            let newData = {
                forgotToken: forgotToken
            }
            // connecting ejs file
            const emailBodyPath = path.join(__dirname, '../views/resetPassword.ejs');
            console.log(emailBodyPath);
            const name = result.ufname;
            const urlPath = process.env.LOCAL_HOST_URL
            const emailBody = await ejs.renderFile(emailBodyPath, { name, forgotToken, urlPath });
            console.log(emailBody);
            // sending email
            await emailService.sendEmail(result.uemail, emailBody, "Reset Password")

            let resultData = await User.findByIdAndUpdate(result._id, { $set: newData }, { new: true });
            res.status(200).json({
                "message": "User found",
                data: forgotToken,
                updated: resultData
            })
        }
    }
    catch (e) {
        res.json({
            err: e.message
        })
    }
})

// reset-password 
urouter.post('/reset-password', async (req, res) => {
    try {
        var pass = req.body.upassword;
        var hash = bcrypt.hashSync(pass, 10);
        const token = req.query.forgotToken;

        const resetVerify = jwt.verify(token, process.env.SECRET_KEY);
        console.log(resetVerify);
        if (resetVerify) {
            var resetUser = await User.findOne({ forgotToken: token })
            if (!resetUser) {
                throw new Error("No such user Exists");
            }
            console.log(resetUser);
            let afterReset = await User.updateOne({ _id: resetVerify._id }, {
                $set: {
                    forgotToken: '',
                    upassword: hash
                }
            });
            res.status(200).json({
                message: "Verified and updated successfully",
                "success": true
            })

        }
        else {
            throw new Error("User is not verified");
        }
    }
    catch (e) {
        res.json({
            e: Error.message
        })
    }
})

// delete
urouter.delete('/:id', async (req, res) => {
    try {
        if (objectId.isValid(req.params.id)) {
            let result = await User.findByIdAndRemove(req.params.id);
            res.json({
                "success": true,
                message: "Successfully deleted",
                data: result
            })
        }
        else {
            throw new Error("Id not valid");
        }
    } catch (e) {
        res.json({
            "success": false,
            error: e.message
        })
    }
})


// update
urouter.put('/:id', async (req, res) => {
    try {
        if (objectId.isValid(req.params.id)) {
            let user = {
                ufname: req.body.ufname,
                uemail: req.body.uemail,
                urole: req.body.urole,
            }
            const result = await User.findByIdAndUpdate(
                req.params.id,
                { $set: user },
                { new: true });
            res.status(200).json({
                message: 'Data updated',
                data: result,
                "success": true
            });
        }
        else {
            throw new Error("Id not valid");
        }
    } catch (e) {
        res.json({
            success: false,
            error: e.message
        })
    }

})

urouter.post('/edit-user/:id', async (req, res) => {
    try {
        if (objectId.isValid(req.params.id)) {
            let user = {
                imgUrl: req.query.url,
            }
            const url = req.body.imgUrl;
            console.log(req.params.id);
            console.log(req.query.url);
            const result = await User.findByIdAndUpdate(
                req.params.id,
                { $set: user },
                { new: true });
            res.status(200).json({
                message: 'Data updated',
                data: result,
                "success": true,
            });
        }
        else {
            throw new Error("Id not valid");
        }
    } catch (e) {
        console.log(e);
    }
})

urouter.post('/file/:id', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        console.log(file);
        var extn = file.originalname.split('.')[1];
        if (extn === 'jpeg' || extn === 'jpg' || extn === 'png') {
            if (objectId.isValid(req.params.id)) {
                console.log("hi in Image upload");
                console.log(req.params.id);
                console.log(file.filename);
                if (!file) {
                    throw new Error("No image");
                }
                else {
                    // res.send(file);
                    const newUser = {
                        imgUrl: file.path
                    }
                    console.log(newUser);
                    const result = await User.findByIdAndUpdate(
                        req.params.id,
                        { $set: newUser },
                        { new: true });
                    let payload = {
                        _id: result._id,
                        email: result.uemail,
                        name: result.ufname,
                        role: result.urole,
                        image: result.imgUrl
                    }
                    let token = jwt.sign(payload, process.env.SECRET_KEY);
                    res.status(200).json({
                        message: 'Data updated',
                        data: token,
                        "success": true
                    });
                }
            } else {
                throw new Error("Id not valid");
            }
        } else {
            throw new Error("Image not in required format");
        }
    } catch (e) {
        console.log(e);
        res.send(e);
    }
})

module.exports = urouter;