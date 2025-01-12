import express from 'express';
import { registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword } from '../controllers/veterinarioController.js'; 
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

//Area publica

//req es lo que se manda al servidro,
//res es lo que el servidor responde
router.post('/', registrar);

//Para recoger datos en la url usamos :cualquierNombre
//Esto se denomina routing dinamico
router.get('/confirmar/:token', confirmar)

router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);//valida el email
//router.get('/olvide-password/:token', comprobarToken);//leer el token
//router.post('/olvide-password/:token', nuevoPassword);//almacenar el nuevo password

//Cuando tenemos la misma ruta pero con diferentes verbos y
//funciones, podemos hacerlo de la siguiente manera.
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

//Area privada
router.get('/perfil', checkAuth,perfil);

export default router;