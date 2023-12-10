const jwt = require("jsonwebtoken");

const validateRoleAdmin = (req, res, next) =>{
    if(req.payload.rol != "Administrador") {
        return res.status(401).json({mensaje: "Error no esta autorizado"});

    }
    next();
}

module.exports = {
    validateRoleAdmin
}