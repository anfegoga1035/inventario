const jwt = require("jsonwebtoken");

const validateJWT = (req, res, next) =>{
    const token = req.header("Authorization");
    if(!token) {
        return res.status(401).json({ mensaje: "Error no esta autorizado"});
    }

    try {
        
        const payload = jwt.verify(token, "123456");
        req.payload = payload;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({mensaje: "Error no estas autorizado!"})
    }
}

module.exports = {
    validateJWT
}