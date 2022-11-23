import {encrypt, compare} from '../helpers/handleBcrypt.js'
import {conectar} from "../db.js"

export const login = (req, res) => {
    try{
        const {correo, password} = req.body

        if(correo === ""|| password === ""){

            console.log('verifique los datos del formulario')
            return res.status(201).json({
                message: 'Verifique los datos del formulario'})

        }

        if(correo && password){
            conectar.query('SELECT * FROM user WHERE correo = ?', [correo], async (error, result) => {

                if (result.length > 0 && (await compare(password, result[0].password))) {
                    conectar.query('SELECT id,nombre,apellido,correo FROM user WHERE correo = ?', [correo], async (error, rows) => {
                        res.json(rows[0])
                    })
                }
                if (result.length === 0 || !(await compare(password, result[0].password))) {
                    return res.json({message:'Correo o contraseña incorrecta'})
                }
            })
        }
        else{
            console.log('verifique los datos del formulario')
            return res.status(201).json({
                message: 'Verifique los datos del formulario'})
        }

    } catch (error) {
        return res.status(500).json({message: 'Error de conexión'})
    }

}
export const create_user = async (req, res) => {

    try {
        const {id, nombre, apellido, correo, password, tipo_u} = req.body

        console.log(id, nombre, apellido, correo, password, tipo_u)

        if(id === "" || nombre === ""|| apellido === ""|| correo === ""|| password === ""|| tipo_u=== ""){

            console.log('verifique los datos del formulario')
                       return res.status(201).json({
                    message: 'Verifique los datos del formulario'})

        }
        if(id !== "" || nombre !== "" || apellido !== "" || correo !== "" || password !== "" || tipo_u!== ""){
        const passwordHash = await encrypt(password)
            conectar.query('SELECT correo FROM user WHERE correo = ?', [correo], async (error, resultc) => {
            conectar.query('SELECT id FROM user WHERE id = ?', [id], async (error, resulti) => {

                if (resulti.length > 0) {

                    console.log('Id registrado')
                    return res.status(201).json({
                        message: 'El ID ya se encuentra registrado'})
                }

                if (resultc.length > 0){

                    console.log('Correo registrado')
                return res.status(201).json({
                        message: 'El correo ya se encuentra registrado'})
                }

                else {
                 conectar.query('INSERT INTO user (id,nombre,apellido,correo,password,tipo_u) VALUES (?,?,?,?,?,?)', [id, nombre, apellido, correo, passwordHash, tipo_u])

                    console.log('Usuario creado')
                    return res.status(201).json({
                        message: 'Usuario creado con éxito'})
                }
            })
            })
        }



    } catch (error) {
        return res.status(500).json({message: 'Error de conexión'})


    }
}

