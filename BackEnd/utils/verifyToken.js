const jwt = require ('jsonwebtoken');
module.exports =(req, res, next)=>
{ 
    try{
        // console.log("Verify Token" ,req.headers['authorization']);
        const bearerHeader = req.headers['authorization'];

        // console.log("Bearer Header: " +bearerHeader);
        
        const bearerToken = bearerHeader.split(' ')[1];
        
        // console.log("Bearer Token: " +bearerToken);
        
        if(bearerToken){
            let doc = jwt.verify(bearerToken, process.env.SECRET_KEY);
                    // console.log("User found and verified");
                    // console.log(doc)
                    req.userDetails = doc;
                    // console.log(req.userDetails);
                    next();
        }
        else{
            throw new Error ("Invalid Token");
        }
    }
    catch
        {
            res.status(401).json({
                message:Error.message,
            })
        }
    }