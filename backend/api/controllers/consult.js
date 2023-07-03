/**
 * CONTROLLER: CONSULTAS
 */

// === Importar
// Propio
const {dbConsult} = require('../database/db');
const { response } = require('express'); // Response de Express
const bcrypt = require('bcryptjs'); // BcryptJS

/**
 * Devuelve todas las consultas que realiza un codigo qr de la BD.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const getConsult = async( req , res ) => {
    // Pagina y registros por pagina.
    const desde      = Number( req.query.desde ) || 0; // En caso de que no venga nada o no sea un numero se inicializa a 0.
    const registropp = Number( process.env.DOCPAG );

    // Se obtiene el id del codigo QR desde la query
    const idQr = req.query.idQr;

    try {
        let query = `SELECT * FROM ${process.env.CONSULTTABLE} WHERE qrCode = ${idQr} LIMIT ${desde}, ${registropp}`;

        const consult = await dbConsult(query);
        
        res.status(200).json({
            msg: 'getConsult',
            consult,
            page:{
                desde,
                registropp,
                total: consult.length
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'Error al listar las consultas'
        });
    }
}

/**
 * Devuelve una llamada de un codigo Qr de la BD por ID.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const getConsultById = async( req , res ) => {
    // Se extrae el id del qr desde el path
    const uid = req.params.id;
    try {
        const query = `SELECT * FROM ${process.env.CONSULTTABLE} WHERE idConsult = ${uid}`;
        const consult = await dbConsult(query);

        if(consult.length !== 0){
            res.status(200).json({
                msg: 'getConsult',
                consult: consult[0]
            });
            return;
        }
        // Si no se encuentra
        else{
            res.status(404).json({
                msg: 'No se ha encontrado la llamada'
            });
        }
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'Error devolver la llamada'
        });
    }
}

/**
 * Crea una nueva llamada.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const createConsult = async( req , res = response ) => {
    // Cuando se le da a añadir llamada se redirige a la interfaz de configruacion de llamada con datos
    // predetermindados para que se cambien. Por ejemplo name = Nombre de la llamda

    // Por si se introducen los campos por llamada
    let {name, token, dateFrom, dateTo, filters, qrCode} = req.body;

    try {
        
        const query = `INSERT INTO ${process.env.CONSULTTABLE} (qrCode) sVALUES (${ qrCode })`;
        console.log(query)

        const consult = await dbConsult(query);

        res.status(200).json({
            msg: 'postLlamada',
            consult
        });
        
    } catch (error) {
        console.error(error);
        
        res.status(500).json({
            msg: 'Error al crear la llamada'
        });
    }
}

/**
 * Actualiza una llamada.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const updateConsult = async( req , res = response ) => {
    const uid = req.params.id;
    
    try{
        // Comprueba que haya una llamada con ese ID.
        let qrQuery = `SELECT * FROM ${process.env.CONSULTTABLE} WHERE idConsult=${uid}`;
        let consult = await dbConsult(qrQuery);

        if( consult.length === 0 ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Extrae los campos que se pueden enviar por el cuerpo de la peticion para realizar comprobaciones
        let { name, token, dateFrom, dateTo, filters} = req.body;
        let updateQuery = `UPDATE ${process.env.CONSULTTABLE} SET `;

        // En este array se van almacenando todos los campos a actualizar
        let updateFields = [];

        // Dependiendo de los campos que se envien la query es de una forma u otra.
        if(name){
            updateFields.push(`name = '${name}'`);
        }
        if(token){
            updateFields.push(`token = '${token}'`);
        }
        if(dateFrom){
            updateFields.push(`dateFrom = '${dateFrom}'`);
        }
        if(dateTo){
            updateFields.push(`dateTo = '${dateTo}'`);
        }
        if(filters){
            updateFields.push(`filters = '${filters}'`);
        }

        // Se unen los campos enviados por la peticion con una coma en el caso que haya mas de uno
        updateQuery += updateFields.join(','); 
        updateQuery += ` WHERE idConsult=${uid}`;
        
        // Se actualiza. 
        consult = await dbConsult(updateQuery);
        
        res.status( 200 ).json( consult );

    } catch(error){
        console.error(error);

        res.status(500).json({
            msg: 'ERROR al actualizar llamada'
        });
    }
}

/**
 * Elimina una llamada.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const deleteConsult = async(req, res) => {
    const uid = req.params.id;
    
    try{
        // Se comprueba que haya un codigo Qr con ese ID.
        let consultQuery = `SELECT * FROM ${process.env.CONSULTTABLE} WHERE idConsult=${uid}`;
        let consult = await dbConsult(consultQuery);
        if( consult.length === 0 ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Se elimina el codigo qr.
        let deleteQuery = `DELETE FROM ${process.env.CONSULTTABLE} WHERE idConsult=${uid}`;
        qr = await dbConsult(deleteQuery);

        res.status(200).json({
            msg:'Llamada eliminada',
            qr
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            msg: 'Error al borrar la llamada'
        });
    }
}

module.exports = {getConsult, getConsultById, createConsult, updateConsult, deleteConsult};