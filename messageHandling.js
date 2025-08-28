const fs = require("fs");
const axios = require("axios");
const path = require("path");
const {
  enviarPlantillaWhatsApp,
  enviarMensajeTexto,
} = require("./whatsappTemplates");

const seleccionesUsuario = {};

async function obtenerMenu() {
  const res = await axios.get('http://127.0.0.1/PEDIDOS/guardar_pedido.php');
  return res.data;
}


async function handleIncomingMessage(payload) {
  fs.appendFileSync(
    "debug_post_log.txt",
    `${new Date().toISOString()} - POST Request: ${JSON.stringify(payload)}\n`
  );

  const firstEntry = payload.entry?.[0];
  const firstChange = firstEntry?.changes?.[0];
  const firstMessage = firstChange?.value?.messages?.[0];

  if (!firstMessage) {
    console.log("Payload sin mensajes válidos");
    return;
  }

  const from = firstMessage.from;
  const text = firstMessage.text?.body?.toLowerCase() || "";


  // Obtener menú desde la base de datos
  const menu = await obtenerMenu();
  const pizzas = menu.pizzas;
  const bebidas = menu.bebidas;
  const complementos = menu.complementos;

  

  const saludos = ["hola", "holi", "ola", "buenos días", "buenas tardes", "buenas noches", "hey", "hello"];
  if (saludos.some(s => text.includes(s))) {
    await enviarPlantillaWhatsApp(from, "saludo");
    await enviarMensajeTexto(from, "Escribe la palabra 'pizza' amigo para comenzar ;)");
    return;
  }


  const palabrasPizza = ["pizza", "quiero pizza", "una pizza", "pizza por favor", "me gustaría una pizza"];
  if (palabrasPizza.some(p => text.includes(p))) {
    const pizzaParams = pizzas.map((p, i) => `${i + 1}.- ${p.nombre} $${p.precio}`);
    await enviarPlantillaWhatsApp(from, "pizzas_orden", pizzaParams);
    await enviarMensajeTexto(from, "si no quieres una pizza solo escribe que no, pero despues de que aparezca el menu de pizzas");
    return;
  }

  if(!seleccionesUsuario[from]) {
    seleccionesUsuario[from] = {
      pizza: null,
      bebida: null,
      complemento: null
    };
  }

  // Selección de pizza
  if (!seleccionesUsuario[from].pizza && (["1", "2", "3", "4", "5", "6"].includes(text.trim()) || text.trim() === "no")) {
    let pizzaSeleccionada = { nombre: "Sin pizza", precio: 0 };
    if (["1", "2", "3", "4", "5", "6"].includes(text.trim())) {
      pizzaSeleccionada = pizzas[parseInt(text.trim(), 10) - 1];
    }
    seleccionesUsuario[from].pizza = pizzaSeleccionada;

    // Mostrar menú de bebidas
   const bebidaParams = bebidas.map((b, i) => `${i + 1}.- ${b.nombre} $${b.precio}`);
   await enviarPlantillaWhatsApp(from, "bebdia_orden", bebidaParams); //dice bebdia por un error de ortografia en mis plantillas de meta
   await enviarMensajeTexto(from, "si no quieres bebida escribe que no tambien");
   return;
  }

  // Selección de bebida
  if (seleccionesUsuario[from].pizza && !seleccionesUsuario[from].bebida && (["1", "2", "3"].includes(text.trim()) || text.trim() === "no")) {
    let bebidaSeleccionada = { nombre: "Sin bebida", precio: 0 };
    if (["1", "2", "3"].includes(text.trim())) {
      bebidaSeleccionada = bebidas[parseInt(text.trim(), 10) - 1];
    }
    seleccionesUsuario[from].bebida = bebidaSeleccionada;

    // Mostrar menú de complementos
    const complementoParams = complementos.map((c, i) => `${i + 1}.- ${c.nombre} $${c.precio}`);
    await enviarPlantillaWhatsApp(from, "complemento_orden", complementoParams);
    return;
  }

  // Selección de complemento y guardar pedido
  if (
    seleccionesUsuario[from].pizza &&
    seleccionesUsuario[from].bebida &&
    !seleccionesUsuario[from].complemento &&
    (["1", "2", "3"].includes(text.trim()) || text.trim() === "no")
  ) {
    let complementoSeleccionado = { nombre: "Sin complemento", precio: 0 };
    if (["1", "2", "3"].includes(text.trim())) {
      complementoSeleccionado = complementos[parseInt(text.trim(), 10) - 1];
    }
    seleccionesUsuario[from].complemento = complementoSeleccionado;

    const total =
      Number(seleccionesUsuario[from].pizza?.precio ?? 0) +
      Number(seleccionesUsuario[from].bebida?.precio ?? 0) +
      Number(seleccionesUsuario[from].complemento?.precio ?? 0);

    const params = [
      seleccionesUsuario[from].pizza.nombre,
      seleccionesUsuario[from].bebida.nombre,
      seleccionesUsuario[from].complemento.nombre,
      total
    ];

    await enviarPlantillaWhatsApp(from, "orden_detalle", params);
    await enviarMensajeTexto(from, "Agradecemos mucho por ordenar, si quieres hacer un segundo pedido vuelve a mandar 'pizza' y selecciona lo que quieres");

    // Guardar pedido en la base de datos
    try {
      await axios.post('http://127.0.0.1/PEDIDOS/guardar_pedido.php', {
        telefono: from,
        pizza: seleccionesUsuario[from].pizza.nombre,
        precio_pizza: seleccionesUsuario[from].pizza.precio,
        bebida: seleccionesUsuario[from].bebida.nombre,
        precio_bebida: seleccionesUsuario[from].bebida.precio,
        complemento: seleccionesUsuario[from].complemento.nombre,
        precio_complemento: seleccionesUsuario[from].complemento.precio,
        total: total
      });
      console.log("pedido guardado");
    } catch (error) {
      console.log("Error al guardar el pedido", error.message);
    }
    seleccionesUsuario[from] = {
      pizza: null,
      bebida: null,
      complemento: null,
    };
    await enviarPlantillaWhatsApp(from, "saludo");
    return;
  }
  
  
  // Mensaje genérico si no se detecta acción
  await enviarMensajeTexto(from, "la neta no te entendi carnal :/");
}

module.exports = handleIncomingMessage;
