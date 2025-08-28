const path = require('path'); // permite trabajar con rutas de archivos y directorios
const axios = require('axios'); // permite hacer peticiones HTTP desde el servidor
const fs = require('fs'); //permite a los desarrolladores interactuar con el sistema de archivos del servidor donde se ejecuta la aplicacion
const {
plantilla_saludo,
Pizza,//Estas son ejemplos, vas a poner el nombre del constructor
Bebida,
Complemento,
ordenDetalle,
pago,
confirmacionPago,
EstadoPedido,
} = require ("./plantillas");

module.exports = async(req, res) => {
    const info = req.body;
    fs.appendFileSync(
        "debug_post_log.txt"
        `${new Date().toISOString()} - Post request: ${JSON.stringify(info)}\n`
    );

    try {
        const mensaje = data?.entry?.[0]?.change?.[0]?.values?.mensaje?.[0]; //pueden ser muchas cosas vacias
        if(!mensaje) return res.status(400).send("no se encontraron mensajes");

        const from = mensaje.from;
        const text = mensaje.text?.body?.toLowerCase() || "";//el texto o puede ser algo o no puede ser nada
        const buttonReplay = mensaje.interactive?.button_replay?.id?.toLowerCase() || "";
        //diccionario de saludos
        const palabraClaveSaludo = [
            "hola", "buenos dias", "buen dia", "hello", "que tal", "buenas tardes", "Buenas noches", "saludos", "hey", 
            "como estas", "que onda",
            "hol",      // "hola"
            "bue",      // "buenas"
            "qui",      // "quién", "quihubo"
            "hey",      // saludo informal
            "ola",      // "hola" mal escrito
            "que",      // "qué tal", "qué onda"
            "kha",      // variante meme de "qué"
            "khe",      // variante meme de "qué"
            "sal",      // "saludos"
            "wen",      // "buenas" informal
            "hi",       // inglés
            "alo",      // "aló", como llamada
            "ey",       // informal
            "oie",      // "oye" mal escrito
            "oye",      // inicio típico
            "bro",      // informal, inicio de charla
            "man",      // informal, común en chats
            "amig",     // "amigo", "amiga"
            "banda",    // grupo
            "pleb",     // "plebes" informal
            "hell",     // "hello" o "hellooo"
            "habla",    // "hablamos", "hablas"
            "tenem",    // "tenemos que hablar"
            "neces",    // "necesito decirte algo"
            "podem",    // "podemos hablar"
        ];
        const palabraPizzaOrd = [
            "quier", "neces", "necesito", "mandeme", "ordenar", "compr", "1","2","3","4","5","6",
        ];
        const palabraBebidaOrd = [
            "coca", "pepsi", "agua mineral", "koka", "coka", "jugo", "pepis", "agua",
        ];
        const palabraCompOrd = [
            "pan de ajo", "pan", "papas", "pa", "1","2","3","4"
        ];
        const palabraOrdDetalle = [
            "mostrar orden", "orden", "cual fue mi orden?", "kua", "cua", "okay","ok"
            
        ];
        const palabrasPago = [
            "tajeta", "tarj", "taj", "jeta", "dinero normal", "efectivo", "Efektivo", "1","2"
        ];
        const palabrasConfPago = [
            "1","2","3"

        ];
        const palabrasEstPedido = [
            "confirmar", "mi orden", "donde", "?",
        ];

        let accion = "";
        let extractedValue = "";
        
        
        if(palabraClaveSaludo.some((saludo) => text.includes(saludo))){ //si saludo es igual a saludo debemos saludar
            accion = "saludo"; 
        }else if(palabraPizzaOrd.some((palabra)=> text.includes(palabra))){
            accion = "pizza";

        }else if (palabraBebidaOrd.some((palabra)=> text.includes(palabra))){
            accion = "bebida";

        }else if (palabraCompOrd.some((palabra) => text.includes(palabra))){
            accion = "complemento";
        
            
        }else if(palabraOrdDetalle.some((palabra) => text.includes(palabra))){
            accion = "ordenDetalle";

        }else if(palabrasPago.some((palabra) => text.includes(palabra))){
            accion = "pago";
        }else if(palabrasConfPago.some((palabra) => text.includes(palabra))) {
            accion = "confirmacionPago";
        }else if(palabrasEstPedido.some((palabra) => text.includes(palabra))){
            accion = "estadoPedido";
        }


        switch(accion){
            case "saludo":
                await plantilla_saludo(from, "saludo"); //PON EL NOMBRE DE LA PLANTILLA DE META
                break;
            case "pizza":
                await Pizza(from, "pizzas_orden");
                break;

            case "bebida":
                await Bebida(from, "bebdia_orden");
                break;
            
            case "complemento":
                await Complemento(from, "complemento_orden");
                break;

            case "ordenDetalle":
                await ordenDetalle(from, "orden_detalle");
                break;
            
            case "pago":
                await pago(from, "metodo_pago");
                break;
            
            case "confirmacionPago":
                await confirmacionPago(from,"confirmacion_pago");
                break;
            
            case "estadoPedido":
                await EstadoPedido(from, "estado_pedido");
                break;

                default:
                    console.log("no se encontro una accion");

            
                

        
        };
        res.status(200).send("EVENT_RECEIVED");


    } catch (error) {
        console.error("Error en el mensaje: ",error);
        res.status(500).send("Error del servidor");
    }

    

};

//nos quedamos en hacer los demas diccionarios para parametrizar las opciones recuerda que la pedir es practicamente el ordenar pizza o pedir pizza de pepperoni con todas las faltas posibles
//linea en caso de que haya botones. 
/*
 if(palabrasClaveSaludo.some((saludo) => text.include(saludo))){
   action= "saludo";
}else if(text.include("menu") || text.include("promo") || 
buttonReply === "btn_menu" ||buttonReply === "btn_promos"){
action ="menu";
}
 */

//else if(){
    //aqui vamos a meter mas acciones de ser necesarios
//}