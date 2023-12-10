const { Router} = require("express");
const EstadoEquipo = require("../models/EstadoEquipo");
const {validationResult, check} = require ("express-validator");
const { validateJWT } = require("../middleware/validar-jwt");
const{ validateRoleAdmin } = require("../middleware/validar-rol-admin");

const router = Router();

router.post("/", [validateJWT, validateRoleAdmin],[
    check("nombre", "invalid.nombre").not().isEmpty(),
    check("estado", "invalid.estado").isIn(["Activo", "Inactivo"])
], async function(req, res){

    try{

        const errors= validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json({mensaje: errors.array() })
            }
            let estadoEquipo = new EstadoEquipo();
            estadoEquipo.nombre = req.body.nombre;
            estadoEquipo.estado = req.body.estado;
            estadoEquipo.fechaCreacion = new Date();
            estadoEquipo.fechaActualizacion = new Date();

            estadoEquipo = await estadoEquipo.save();
            res.send(estadoEquipo);

    }catch(error){
        console.log(error);
        res.status(500).send("Ocurrio error al crear el estado del equipo")
    }

});

router.get("/", [validateJWT, validateRoleAdmin], async function(req, res){
    try {
        const estadosEquipos = await EstadoEquipo.find();
        res.send(estadosEquipos);

    }catch(error){
        console.log(error);
        res.status(500).send("Ocurrio un error")
    }
});


router.put("/:estadoEquipoId", [validateJWT, validateRoleAdmin], [
    check("nombre", "invalid.nombre").not().isEmpty(),
    check("estado", "invalid.estado").isIn(["Activo", "Inactivo"])
], async function(req, res){

    try{

        const errors= validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json({mensaje: errors.array() })
            }

            let estadoEquipo = await EstadoEquipo.findById(req.params.estadoEquipoId);
            if(!estadoEquipo) {
                return res.status(400).send("No existe tipo equipo");
            }


            estadoEquipo.nombre = req.body.nombre;
            estadoEquipo.estado = req.body.estado;
            estadoEquipo.fechaActualizacion = new Date();

            estadoEquipo = await estadoEquipo.save();
            res.send(estadoEquipo);

    }catch(error){
        console.log(error);
        res.status(500).send("Ocurrio error al actualizar el tipo de equipo")
    }

});

// eliminar 

router.delete('/:estadoEquipoId', [validateJWT, validateRoleAdmin], async (req, res) => {
    try {
      const { estadoEquipoId } = req.params;
      const estadoEquipo = await EstadoEquipo.findById(estadoEquipoId);
  
      if (!estadoEquipo) {
        return res.status(404).json({ mensaje: 'estadoEquipo no encontrado' });
      }
  
      await estadoEquipo.deleteOne(); 
      res.json({ mensaje: 'estadoEquipo eliminado correctamente' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al eliminar estadoEquipo' });
    }
  });

module.exports = router;