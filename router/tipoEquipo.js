const { Router} = require("express");
const TipoEquipo = require("../models/TipoEquipo");
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
            let tipoEquipo = new TipoEquipo();
            tipoEquipo.nombre = req.body.nombre;
            tipoEquipo.estado = req.body.estado;
            tipoEquipo.fechaCreacion = new Date();
            tipoEquipo.fechaActualizacion = new Date();

            tipoEquipo = await tipoEquipo.save();
            res.send(tipoEquipo);

    }catch(error){
        console.log(error);
        res.status(500).send("Ocurrio error al crear la tipo de equipo")
    }

});

router.get("/", [validateJWT, validateRoleAdmin], async function(req, res){
    try {
        const tiposEquipos = await TipoEquipo.find();
        res.send(tiposEquipos);

    }catch(error){
        console.log(error);
        res.status(500).send("Ocurrio un error")
    }
});

//Actualizar
router.put("/:tipoEquipoId", [validateJWT, validateRoleAdmin], [
    check("nombre", "invalid.nombre").not().isEmpty(),
    check("estado", "invalid.estado").isIn(["Activo", "Inactivo"])
], async function(req, res){

    try{

        const errors= validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json({mensaje: errors.array() })
            }

            let tipoEquipo = await TipoEquipo.findById(req.params.tipoEquipoId);
            if(!tipoEquipo) {
                return res.status(400).send("No existe tipo equipo");
            }


            tipoEquipo.nombre = req.body.nombre;
            tipoEquipo.estado = req.body.estado;
            tipoEquipo.fechaActualizacion = new Date();

            tipoEquipo = await tipoEquipo.save();
            res.send(tipoEquipo);

    }catch(error){
        console.log(error);
        res.status(500).send("Ocurrio error al actualizar el tipo de equipo")
    }

});


// eliminar 
router.delete('/:tipoEquipoId', [validateJWT, validateRoleAdmin], async (req, res) => {
    try {
      const { tipoEquipoId } = req.params;
      const tipoEquipo = await TipoEquipo.findById(tipoEquipoId);
  
      if (!tipoEquipo) {
        return res.status(404).json({ mensaje: 'tipo Equipo no encontrado' });
      }
  
      await tipoEquipo.deleteOne(); 
      res.json({ mensaje: 'tipo Equipo eliminado correctamente' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al eliminar tipo Equipo' });
    }
  });





module.exports = router;