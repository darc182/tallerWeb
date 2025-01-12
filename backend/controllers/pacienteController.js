import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) =>{
    //creamos un objeto de esquema y le pasamos los
    //datos que el usuario manda en el body
    const paciente = new Paciente(req.body);

    //paciente es una instancia del esquema.
    //.veterinario, es la columna que creamos en el esquema
    //ahi le pasamos el id del veterinario.
    //ahora cada paciente sabe que veterinario lo atendio
    paciente.veterinario = req.veterinario._id;
    try {
        //almacenamos en la base 
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
        
    } catch (error) {
        console.log(error);
        
    }
    
};

const obtenerPacientes = async (req, res)=>{
    const pacientes = await Paciente.find()
        .where('veterinario')
        .equals(req.veterinario);

    res.json(pacientes);
};


const obtenerPaciente = async (req,res) => {
    const {id} = req.params;
    const paciente =  await Paciente.findById(id);

    if (!paciente) {
        return res.status(404).json({msg: 'No encontrado'});
    }
    
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'Accion no valida'})
    }
    

    
    res.json(paciente);
    
    
};


const actualizarPaciente = async (req,res) => {
    const {id} = req.params;
    const paciente =  await Paciente.findById(id);

    if (!paciente) {
        return res.status(404).json({msg:'No encontrado'})
    }
    
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'Accion no valida'})
    }

   //Actualizar paciente
   paciente.nombre =  req.body.nombre || paciente.nombre;
   paciente.propietario = req.body.propietario ||  paciente.propietario;
   paciente.email = req.body.email || paciente.email;
   paciente.fecha = req.body.fecha || paciente.fecha;
   paciente.sintomas = req.body.sintomas || paciente.sintomas;

   try {
    const pacienteActualizado = await paciente.save();
    res.json(pacienteActualizado);
   } catch (error) {
    console.log(error);
    
   }
}


const eliminarPaciente = async (req,res) => {
    const {id} = req.params;
    const paciente =  await Paciente.findById(id);

    if (!paciente) {
        return res.status(404).json({msg:'No encontrado'})
    }
    
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'Accion no valida'})
    }

    try {
        await paciente.deleteOne();
        res.json({msg: 'Paciente Eliminado'});
    } catch (error) {
        console.log(error);
        
    }

};



export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}