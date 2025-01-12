
import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarId from '../helpers/generarId.js';



const registrar =async (req,res)=>{
    //req.body recoje los datos enviados al servidor,
    //lee el JSON que le mandamos con postman, y lo 
    //pasa a un objeto, basicamente req.body es un objeto
    //con los datos que le mandamos al servidor.
    //Por eso podemos hacer destructuring.
    //const {email, password, nombre} = req.body;

    const {email} = req.body;
    //Prevenir usuarios duplicados
    //await porque una consulta a la base de datos puede tardar
    //y no queremos que se ejecute el siguiente codigo hasta que
    //no se haya completado la consulta.
    //findOne es un metodo de mongoose que busca un documento
    //en la base de datos que cumpla con la condicion que le pasamos
    //en este caso que el email sea igual al email que le pasamos
    //en el body.
    const existeUsuario = await Veterinario.findOne({email});

    //Si existe el usuario, el siguiente codigo crea un mensaje
    //de error, lo manda al cliente y termina la ejecucion
    //de la funcion.
    if(existeUsuario){

        const error = new Error('Usuario ya registrado');
        //res.status(400).json({msg: error.mesaage}),cambiamos
        //el status por 400 y creamos un objeto con el mensaje
        //de error, lo hacemos asi para posteriormente poder
        //recuperarlo en el frontend.
        return res.status(400).json({msg: error.message})
    }


   try {
    //Guardar un nuevo veterinario
    //Creamos una instancia de nuestro schema y que se complete
    //con los datos que le mandamos al servidor.
    const veterinario = new Veterinario(req.body);

    //Usamos async await por que el guardado en la base de datos
    //puede tardar un poco, y no queremos que se ejecute el siguiente
    //codigo hasta que se haya guardado el usuario en la base de datos.
    const veterinarioGuardado  = await veterinario.save();
    res.json(veterinarioGuardado);


   } catch (error) {
    console.log(error);
    
   }
    

    
};

const perfil = (req,res)=>{
    //req.veterinario , agregamos el objeto veterinario a req
    //en el middleware, por eso podemos acceder a el.
    const {veterinario} = req;
    
    res.json({perfil: veterinario});
};

const confirmar =async (req,res)=>{
    //Para leer datos de la URL usamos req.params
    //luego le aniadimos el nombre que le pusimos en la ruta
    //console.log(req.params.token);
    const {token} = req.params;

    //no devuelve los datos almacenados en mongo
    //que coincidan con el token que le pasamos, en usaurioConfirmar
    //tenenmos un objeto con esos datos.
    const usuarioConfirmar = await Veterinario.findOne({token});

    //si no existe el usuario con el token que le pasamos
    if(!usuarioConfirmar){
        const error =  new Error('Token no valido');
        return res.status(400).json({msg: error.message})
    }
    
    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({msg: 'Usuario Confirmado Correctamente'});
    } catch (error) {
        console.log(error);
        
    }
    
    
}


const autenticar =async (req,res)=>{
    const {email, password} = req.body;

    //Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email});

    if (!usuario) {
        const error =  new Error('El usuario no existe');
        return res.status(403).json({msg: error.message});
    };

    //Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error  =  new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message}); 
    };

    //Revisar el password
    if (await usuario.comprobarPassword(password)) {
        console.log(usuario);
        
        //Autenticar
        res.json({token: generarJWT(usuario.id)});
        
    }else{
        const error  =  new Error('El password es incorrecto');
        return res.status(403).json({msg: error.message}); 
        
    }
};

const olvidePassword =async (req,res)=>{
    const {email} = req.body;

    //encuentra el primero que coincida con email
    const existeVeterinario =await Veterinario.findOne({email});

    if (!existeVeterinario) {
        const error =  new Error('El usuario no existe');
        return res.status(400).json({msg: error.message})
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        res.json({msg:'Hemos enviado un email con las instrucciones'})
    } catch (error) {
        console.log(error);
        
    }
};

const comprobarToken = async (req,res)=>{
    const {token} = req.params;

    const tokenValido =  await Veterinario.findOne({token});

    if (tokenValido) {
        res.json({msg: 'Token valido y el usuario existe'});
    }else{
        const error =  new Error('Token no valido');
        return res.status(400).json({msg: error.message});
    }
};


const nuevoPassword = async (req,res)=>{
    const {token} = req.params;
    const {password} = req.body;

    const veterinario =  await Veterinario.findOne({token});
    if (!veterinario) {
        const error= new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();

        res.json({msg: 'Password modificado correctamente'});
        console.log(veterinario);
        
    } catch (error) {
        console.log(error);
        
    }
};



export{
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}