import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

const veterinarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,//campo obligatorio
        trim: true//quita los espacios en blanco
    },

    password:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true,
        unique: true,//no se puede repetir
        trim: true
    },

    telefono:{
        type: String,
        default: null,//por defecto es null, no es obligatorio
        trim: true
    },

    web:{
        type: String,
        default: null
    },

    token:{
        type: String,
        default: generarId()//genera un id unico
    },

    //para saber si el veterinario ha confirmado su cuenta
    confirmado:{
        type: Boolean,
        default: false
    },


});

//Antes de guardar un registro vamos a hashear la contraseña
veterinarioSchema.pre('save', async function(next){
    //si un password ya esta hasheado no lo volvemos a hashear
    if (!this.isModified('password') ) {
        //funciona como un return, hace que salgas de la funcion
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password =  await bcrypt.hash(this.password, salt);
    
});

//methods nos ayuda a crear funciones o metodos para este
//esquema, nombreSchema.methods.nombreFuncion
//El nombre de la funcion puede ser cualquiera.
veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    //nosotros hasheamos el password con bcrypt, de igual manera
    //usamos bcrypt para comprobar la contraseña hasheada con la que
    //que nos pasan el usuario.
    //Nos devuelve un booleano
    return await bcrypt.compare(passwordFormulario, this.password)
}

//registramos el schema en mongoose
//argumentos: (nombre del modelo, schema), el nombre puede ser cualquiera
const veterinario = mongoose.model('Veterinario', veterinarioSchema);
export default veterinario;//ahora lo podemos importar en otros archivos