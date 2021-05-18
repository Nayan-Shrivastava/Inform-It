const jwt = require("jsonwebtoken");

const verifyUser = (req,res,callback) => {
    jwt.verify(req.token,process.env.SECRET_KEY,(err,authData) => {
        if(err){
            //console.log("error",err);
            res.status(403).json({
            isAuth : false,
            error : "unauthorized token",
            });
        }else{
            //console.log("inverify",authData);
            callback(authData);
            
        }
    });
};



const verifyToken = (req,res,next) => {
    const data = {
        isAuth : false,
        error : "Token not sent",
    }

    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader != 'undefined'){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];

        req.token = bearerToken;
        //console.log(bearerToken);
        next();
    }else{
        res.status(403).json(data);
    }

};

module.exports = {
  verifyToken,
  verifyUser
};


