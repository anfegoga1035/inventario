const { Router} = require("express");
const Marca = require("../models/Marca");
const {validationResult, check} = require ("express-validator");
const { validateJWT } = require("../middleware/validar-jwt");
const{ validateRoleAdmin } = require("../middleware/validar-rol-admin");

const router = Router();

router.post("/", [validateJWT, validateRoleAdmin], [
    check("nombre", "invalid.nombre").not().isEmpty(),
    check("estado", "invalid.estado").isIn(["Activo", "Inactivo"])
], async function(req, res){

    try{

        const errors= validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json({mensaje: errors.array() })
            }
            let marca = new Marca();
            marca.nombre = req.body.nombre;
            marca.estado = req.body.estado;
            marca.fechaCreacion = new Date();
            marca.fechaActualizacion = new Date();

            marca = await marca.save();
            res.send(marca);

    }catch(error){
        console.log(error);
        res.status(500).send("Ocurrio error al crear la marca")
    }

});

router.get("/",[validateJWT, validateRoleAdmin], async function(req, res){
    try {
        const marcas = await Marca.find();
        res.send(marcas);

    }catch(error){
        console.log(error);
        res.status(500).send("Ocurrio un error")
    }
});

//Actualizar
router.put("/:marcaId", [validateJWT, validateRoleAdmin], [
    check("nombre", "invalid.nombre").not().isEmpty(),
    check("estado", "invalid.estado").isIn(["Activo", "Inactivo"])
], async function(req, res){

    try{

        const errors= validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json({mensaje: errors.array() })
            }

            let marca = await Marca.findById(req.params.marcaId);
            if(!marca) {
                return res.status(400).send("No existe marca");
            }


            marca.nombre = req.body.nombre;
            marca.estado = req.body.estado;
            marca.fechaActualizacion = new Date();

            marca = await marca.save();
            res.send(marca);

    }catch(error){
        console.log(error);
        res.status(500).send("Ocurrio error al actualizar la marca")
    }

});

// eliminar 

router.delete('/:marcaId', [validateJWT, validateRoleAdmin], async (req, res) => {
    try {
      const { marcaId } = req.params;
      const marca = await Marca.findById(marcaId);
  
      if (!marca) {
        return res.status(404).json({ mensaje: 'Marca no encontrado' });
      }
  
      await marca.deleteOne(); 
      res.json({ mensaje: 'Marca eliminado correctamente' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al eliminar marca' });
    }
  });


module.exports = router;