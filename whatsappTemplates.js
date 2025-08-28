const axios = require("axios");
const fs = require("fs");

const templates = {
    SALUDO: "saludo",
    PIZZA: "pizza_orden",
    BEBIDA: "bebdia_orden",
    COMPLEMENTO: "complemento_orden",
    ORDEN: "orden_detalle",
};

// Utilidad para limpiar texto y asegurar longitud
function sanitize(text) {
  if (typeof text !== "string") text = String(text ?? "");
  const cleaned = text.replace(/[\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
  return cleaned.slice(0, 1024);
}

// Token de acceso generado en la consola de Meta
const accessToken = "EAARoWrLg4UcBPIFMwfkHmzezJY8Cn46sh8jcqnA5qZAY8DysfdyPxl5Sh99z2wsuLnU2lLbGqw2maKaXXkgSmUodNCpZBbkOjaV62ewcqLVCmGjNpD1qgBKbSqsWxN5tZAlCq61aaiUZAh4inmW1Ea6ypn5UKt0hjIgpLZA9eZBkdWIyHrmZCLJRFgkf65sWtNaYAZDZD";
const phoneNumberId = "736790849509065";

// Función para limpiar y validar el número
function procesarNumero(to) {
  if (!to) throw new Error("Número de destinatario no válido");
  return to.startsWith("521") ? to.replace(/^521/, "52") : to;
}
 
// Función genérica para construir y enviar payloads
async function enviarPayload(to, templateName, components = []) {
  const url = `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`;
  to = procesarNumero(to);

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: "en" },
      components,
    },
  };

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, payload, { headers });
    logExitoso(payload, response.data);
  } catch (error) {
    logError(payload, error);
  }
}

// Funciones específicas
async function enviarPlantillaWhatsApp(to, templateName, params = []) {
  const components = params.length
    ? [
        {
          type: "body",
          parameters: params.map(text => ({
            type: "text",
            text: sanitize(String(text ?? "")),
          })),
        },
      ]
    : [];
  await enviarPayload(to, templateName, components);
}

async function enviarPlantillaErrorGenerico(to, errorMessage) {
  const components = [
    {
      type: "body",
      parameters: [{ type: "text", text: errorMessage }],
    },
  ];
  await enviarPayload(to, templates.ERROR_GENERICO, components);
}

async function enviarMensajeTexto(to, text) {
  const url = `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to: procesarNumero(to),
    type: "text",
    text: { body: text },
  };

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, payload, { headers });
    logExitoso(payload, response.data);
  } catch (error) {
    logError(payload, error);
  }
}

// Funciones auxiliares para logging
function logExitoso(payload, responseData) {
  const logMessage = `${new Date().toISOString()} - Enviado: ${JSON.stringify(payload)}\nRespuesta: ${JSON.stringify(responseData)}\n`;
  fs.appendFileSync("template_log.txt", logMessage);
  console.log("Plantilla enviada exitosamente:", responseData);
}

function logError(payload, error) {
  const errorData = error.response?.data || error.message;
  const logMessage = `${new Date().toISOString()} - Error enviando: ${JSON.stringify(payload)}\nError: ${JSON.stringify(errorData)}\n`;
  fs.appendFileSync("template_log.txt", logMessage);
  console.error("Error enviando plantilla:", errorData);
}

module.exports = {
  templates,
  enviarPlantillaWhatsApp,
  enviarPlantillaErrorGenerico,
  enviarMensajeTexto,
};