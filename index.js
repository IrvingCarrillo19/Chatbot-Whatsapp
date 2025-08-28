const express = require('express'); //importando los modulos necesarios
const cors = require('cors'); // permite que el servidor acepte peticiones de otros dominios
const path = require('path'); // permite trabajar con rutas de archivos y directorios
const axios = require('axios'); // permite hacer peticiones HTTP desde el servidor
const fs = require('fs'); //permite a los desarrolladores interactuar con el sistema de archivos del servidor donde se ejecuta la aplicacion
const app = express(); // creando una instancia de express
const tokens = require('./tokens'); //creamos una constante con el nombre para que lo mande a llamar 
app.use(express.json()) // permite que el servidor entienda los datos en formato JSON

//configuracion de cors
app.use(cors({
    origin: "http://localhost:3000", //PUERTO EN EL QUE SE EJECUTA
    methods: "GET, POST, PUT, DELETE", //METODOS QUE SE ALMACENAN EN LA API
    allowedHeaders: ["Content-Type", "Authorization"], //ESTO SE USARA PARA AUTORIZAR QUE PETICIONES SE APROBARAN
})
);

//RUTA PARA MANEJO DE VERIFICACIONES (GET)
app.get("/index.js", tokens);

//ruta para manejo de notificaciones entrantes (POST)
app.post("/index.js", messageHandling);

const apiBaseUrl = "http://localhost/META";

const authToken = "Bearer EAARoWrLg4UcBPIFMwfkHmzezJY8Cn46sh8jcqnA5qZAY8DysfdyPxl5Sh99z2wsuLnU2lLbGqw2maKaXXkgSmUodNCpZBbkOjaV62ewcqLVCmGjNpD1qgBKbSqsWxN5tZAlCq61aaiUZAh4inmW1Ea6ypn5UKt0hjIgpLZA9eZBkdWIyHrmZCLJRFgkf65sWtNaYAZDZD";


