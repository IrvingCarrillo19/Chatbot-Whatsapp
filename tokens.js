//archivo challenge.js
const fs = require('fs');
const verifyToken = "Tacos123";

//ruta para manejar la verificacion get
module.exports = (req, res) => {
    const hubVerifyToken = req.query['hub.verify_token'];
    const hubChallenge = req.query['hub.challenge'];

    //logs para depuracion
    fs.appendFileSync(
        "debug_get_log.txt",
        `${new Date().toISOString()} - GET request: ${JSON.stringify(req.query)}\n`
    );
    if(hubVerifyToken === verifyToken){
        res.status(200).send(hubChallenge); //responde el desafio

    }else{
        fs.appendFileSync(
            "debug_get_log_res.txt",
            `${new Date().toISOString()} - Token request: ${JSON.stringify(req.query)}\n`
        );
        res.status(403).send("verificacion fallida");

    }
};