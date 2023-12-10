const  mongoose = require("mongoose");

const getConnection = async () => {

    try{

        const url = "mongodb://usuario-1:aRv5RSEyVAi4VXk3@ac-zye2c3f-shard-00-00.qk30j7u.mongodb.net:27017,ac-zye2c3f-shard-00-01.qk30j7u.mongodb.net:27017,ac-zye2c3f-shard-00-02.qk30j7u.mongodb.net:27017/inventario?ssl=true&replicaSet=atlas-ga4we3-shard-0&authSource=admin&retryWrites=true&w=majority"

    await mongoose.connect(url)


        console.log(" La conexion ha diso exitosa")

    } catch (error){
        console.log(error)
    }

    
    
}

module.exports = {
    getConnection
}