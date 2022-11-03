import {encrypt, compare} from '../helpers/handleBcrypt.js'
import {conectar} from "../db.js"

export const login = (req, res) => {
    try{
        const {correo, password} = req.body

        if(correo && password){
            conectar.query('SELECT * FROM user WHERE correo = ?', [correo], async (error, result) => {

                if (result.length > 0 && (await compare(password, result[0].password))) {
                    conectar.query('SELECT id,nombre,apellido,correo FROM user WHERE correo = ?', [correo], async (error, rows) => {
                        res.json(rows[0])

                    })
                }
                if (result.length === 0 || !(await compare(password, result[0].password))) {
                    res.send('Correo o contraseña incorrecta')
                }
            })
        }
    } catch (error) {
        return res.status(500).json({message: 'Error de conexión'})
    }

}


export const create_user = async (req, res) => {

    try {
        const {id, nombre, apellido, correo, password, tipo_u} = req.body
        const passwordHash = await encrypt(password)
        conectar.query('SELECT correo FROM user WHERE correo = ?', [correo], async (error, resultc) => {
        conectar.query('SELECT id FROM user WHERE id = ?', [id], async (error, resulti) => {

                if (resulti.length > 0) {
                    return res.status(401).json({
                        message: 'El ID ya se encuentra registrado'})
                }

                if (resultc.length > 0){
                return res.status(401).json({
                        message: 'El correo ya se encuentra registrado'})
                }

                else {
                  conectar.query('INSERT INTO user (id,nombre,apellido,correo,password,tipo_u) VALUES (?,?,?,?,?,?)', [id, nombre, apellido, correo, passwordHash, tipo_u])
                    return res.status(201).json({
                        message: 'Usuario creado con éxito'})
                }
            })
            })

    } catch (error) {
        return res.status(500).json({message: 'Error de conexión'})


    }
}

