import {encrypt, compare} from '../helpers/handleBcrypt.js'
import {conectar} from "../db.js"

export const login = (req, res) => {
    try{
        const {correo, password} = req.body

        if(correo === ""|| password === ""){

            console.log('Debe rellenar todos los campos')
            return res.status(201).json({
                message: 'Debe rellenar todos los campos'})

        }

        if(correo && password){
            conectar.query('SELECT * FROM user WHERE correo = ?', [correo], async (error, result) => {

                if (result.length > 0 && (await compare(password, result[0].password))) {
                    conectar.query('SELECT id,nombre,apellido,correo,tipo_u,celular,direccion,cod_pos,pais,departamento,ciudad  FROM user WHERE correo = ?', [correo], async (error, rows) => {
                       res.status(201).json(rows[0])
                    })
                }
                if (result.length === 0 || !(await compare(password, result[0].password))) {
                    return res.json({message:'Correo o contraseña incorrecta'})
                }
            })
        }
        else{
            console.log('Debe rellenar todos los campos')
            return res.status(201).json({
                message: 'Debe rellenar todos los campos'})
        }

    } catch (error) {
        return res.status(500).json({message: 'Error de conexión'})
    }

}
export const create_user = async (req, res) => {

    try {
        const {id, nombre, apellido, correo, password} = req.body

        console.log(id, nombre, apellido, correo, password)

        if(id === "" || nombre === ""|| apellido === ""|| correo === ""|| password === ""){

            console.log('Debe rellenar todos los campos')
                       return res.status(201).json({
                    message: 'Debe rellenar todos los campos'})

        }
        if(id !== "" || nombre !== "" || apellido !== "" || correo !== "" || password !== ""){
        const passwordHash = await encrypt(password)
            conectar.query('SELECT correo FROM user WHERE correo = ?', [correo], async (error, resultc) => {
            conectar.query('SELECT id FROM user WHERE id = ?', [id], async (error, resulti) => {

                if (resulti.length > 0) {

                    console.log('La identificacion ya se encuentra registrada')
                    return res.status(201).json({
                        message: 'La identificacion ya se encuentra registrada'})
                }

                if (resultc.length > 0){

                    console.log('El correo ya se encuentra registrado')
                return res.status(201).json({
                        message: 'El correo ya se encuentra registrado'})
                }

                else {
                 conectar.query('INSERT INTO user (id,nombre,apellido,correo,password,tipo_u) VALUES (?,?,?,?,?,"USUARIO")', [id, nombre, apellido, correo, passwordHash])

                    console.log('Usuario creado con éxito')
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
