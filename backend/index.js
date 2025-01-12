//Creacion del servidor
import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';

//En app va a estar toda la funcionalidad para crear el servidor
const app =  express();
app.use(express.json());//le decimos a express que vamos a enviarles JSON
dotenv.config();

conectarDB();




app.use("/api/veterinarios", veterinarioRoutes);

app.use("/api/pacientes", pacienteRoutes);

const PORT = process.env.PORT || 4000;

//De esta manera arrancamos el servidor en el puerto 4000
//Si todo va bien se ejecuta lo que esta en el callback
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    
})