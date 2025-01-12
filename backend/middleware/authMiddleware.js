import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';



const checkAuth = async (req, res, next) => {
    let token;  
    //req.headers es un objeto que contiene el token, el token
    //esta en la llave authorization.
    //Evaluamos si existe el token y si empieza con Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //obtenemos el token, pero este biene con la palabra
            //Bearer, por eso lo separamos con split y obtenemos
            //la segunda parte que solamente es el token.
            token = req.headers.authorization.split(' ')[1]; 
            //en decoded va a estar toda la info codificada en el token
            //en este caso solo el id del usuario.
            //decoded es un objeto. 
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //Traemos al usuario de la base de datos, lo buscamos por su id
            //Como trae todos los campos con selecet le indicamos que campos
            //no queremos que traiga.
            //agrergamos el objeto veterinario a req, para que en el controlador
            //podamos acceder a el.
            req.veterinario =  await Veterinario.findById(decoded.id).select(
                '-password -token -confirmado' 
            );
            
            return next();
            
            
        } catch (error) {
            const e = new Error('Token no valido');
            res.status(403).json({msg: e.message});
        }
        
    }

    //si no existe el token
    if (!token) {
        const error = new Error('Token no valido o inexistente');
        return res.status(403).json({msg: error.message});
    }
    
    next();
    
}

export default checkAuth;
