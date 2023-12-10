const {Router} = require ("express");
const Usuario = require ("../models/Usuario");
const {validationResult, check} = require ("express-validator");
const bycript = require ("bcryptjs");
const { validateJWT } = require("../middleware/validar-jwt");
const{ validateRoleAdmin } = require("../middleware/validar-rol-admin");



const router = Router ();

//crear usuario
router.post("/", [validateJWT, validateRoleAdmin], [
check("nombre", "invalid.nombre").not().isEmpty(),
check("email", "invalid.email").isEmail(),
check("password", "password.nombre").not().isEmpty(),
check("rol", "invalid.rol").isIn(["Administrador", "Docente"]),
check("estado", "invalid.estado").isIn(["Activo", "Inactivo"])
], async function(req, res){

    try{

        const errors= validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({mensaje: errors.array() })
        }

        const existeUsuario = await Usuario.findOne({ email: req.body.email})
        if (existeUsuario){
            return res.status(400).send("Email ya existe")
        }

        let usuario = new Usuario();
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;
        usuario.rol = req.body.rol;

        const salt = bycript.genSaltSync();
        const password = bycript.hashSync(req.body.password, salt);
        usuario.password = password

        usuario.fechaCreacion = new Date();
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();
        res.send(usuario);


    }catch(error){
        console.log(error);
        res.status(500).send(" Ocurrio un erro al crear usuario")
    }

});

//listar usuarios

router.get("/", [validateJWT, validateRoleAdmin], async function(req, res){
    try{
        const usuarios = await Usuario.find();
        res.send(usuarios);

    }catch(error){
        console.log(error);
        res.status(500).send("Ocurrio un error")
    }
});

//Actualizar usuario

router.put("/:usuarioId" ,[validateJWT, validateRoleAdmin], [
    check("nombre", "invalid.nombre").not().isEmpty(),
    check("email", "invalid.email").isEmail(),
    check("password", "password.nombre").not().isEmpty(),
    check("rol", "invalid.rol").isIn(["Administrador", "Docente"]),
    check("estado", "invalid.estado").isIn(["Activo", "Inactivo"])
    ], async function(req, res){
    
        try{
    
            const errors= validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json({mensaje: errors.array() })
            }

            let usuario = await Usuario.findById(req.params.usuarioId);
            if(!usuario){
                return res.status(400).send("usuario no existe");

            }
    
                        
            usuario.nombre = req.body.nombre;
            usuario.email = req.body.email;
            usuario.estado = req.body.estado;
            usuario.rol = req.body.rol;
            usuario.password = req.body.password;                  
            usuario.fechaActualizacion = new Date();
    
            usuario = await usuario.save();
            res.send(usuario);
    
    
        }catch(error){
            console.log(error);
            res.status(500).send(" Ocurrio un erro al actualizar usuario")
        }
    
    });

    // eliminar 

router.delete('/:usuarioId', [validateJWT, validateRoleAdmin], async (req, res) => {
    try {
      const { usuarioId } = req.params;
      const usuario = await usuario.findById(usuarioId);
  
      if (!usuario) {
        return res.status(404).json({ mensaje: 'usuario no encontrado' });
      }
  
      await usuario.deleteOne(); 
      res.json({ mensaje: 'usuario eliminado correctamente' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al eliminar usuario' });
    }
  });

module.exports = router;
