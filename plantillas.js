const axios = require("axios");
const fs = require("fs");

const plantillas = {
    //nombre genereico = "nombre que esta en meta"
    SALUDO: "saludo",
    PIZZA: "pizza_orden",
    BEBIDA: "bebdia_orden",
    COMPLEMENTO: "complemento_bebida",
    ORDEN: "orden_detalle",
    PAGO: "metodo_pago",
    CONFIRMACION_PAGO: "confirmacion_pago",
    ESTADO_PEDIDO: "estado_pedido",
    

};

//limpiar textos
function sanitize(text){
    const cleaned = text.replace(/[\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
    return cleaned.slice(0,1024);


}

const token = "EAARoWrLg4UcBPIFMwfkHmzezJY8Cn46sh8jcqnA5qZAY8DysfdyPxl5Sh99z2wsuLnU2lLbGqw2maKaXXkgSmUodNCpZBbkOjaV62ewcqLVCmGjNpD1qgBKbSqsWxN5tZAlCq61aaiUZAh4inmW1Ea6ypn5UKt0hjIgpLZA9eZBkdWIyHrmZCLJRFgkf65sWtNaYAZDZDEAARoWrLg4UcBPIFMwfkHmzezJY8Cn46sh8jcqnA5qZAY8DysfdyPxl5Sh99z2wsuLnU2lLbGqw2maKaXXkgSmUodNCpZBbkOjaV62ewcqLVCmGjNpD1qgBKbSqsWxN5tZAlCq61aaiUZAh4inmW1Ea6ypn5UKt0hjIgpLZA9eZBkdWIyHrmZCLJRFgkf65sWtNaYAZDZD";
const phoneNumber = "736790849509065";

//esta funcion va a limpiar el numero de telefono
function cleanPhone(to){
    if(!to) throw new Error("Numero invalido");
    return to.startsWith("521") ? to.replace(/^521/, "52") : to;

}

//construir el payload
async function enviarPayload(to, templateName, components = []) {
    const url = `https://graph.facebook.com/v22.0/${phoneNumber}/messages`;
    to = cleanPhone(to);

    const payload = {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
            name: templateName,
            language: {code: "es_MX"},
            components,
        }
    };

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.post(url, payload, {headers});
        logExito(payload, response.data);

    }catch (error) {
        logError(payload, error);

    }
}