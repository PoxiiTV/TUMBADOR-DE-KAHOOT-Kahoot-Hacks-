/**
 * Lógica reutilizable para meter bots en un Kahoot.
 * Usado por bots.js (CLI) y por el servidor web.
 */

const Kahoot = require("kahoot.js-latest");

// 25 nombres masculinos + 25 femeninos más comunes en España (INE / uso habitual)
const NOMBRES_DEFAULT = [
  "Antonio",
  "Manuel",
  "José",
  "Francisco",
  "David",
  "Javier",
  "Daniel",
  "Juan",
  "Carlos",
  "Miguel",
  "Rafael",
  "Pablo",
  "Alejandro",
  "Pedro",
  "Sergio",
  "Fernando",
  "Diego",
  "Jorge",
  "Luis",
  "Alberto",
  "Jesús",
  "Raúl",
  "Andrés",
  "Francisco Javier",
  "José Antonio",
  "María",
  "Carmen",
  "Ana",
  "Laura",
  "Isabel",
  "Dolores",
  "Teresa",
  "Cristina",
  "Elena",
  "Paula",
  "Andrea",
  "Sara",
  "Lucía",
  "Marta",
  "Julia",
  "Claudia",
  "Sofía",
  "Patricia",
  "Irene",
  "Raquel",
  "Alicia",
  "Pilar",
  "Rosa",
  "María Carmen",
  "Ana María",
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Genera una lista de 'count' nombres a partir del array 'nameList'.
 * Si hacen falta más, repite con un número.
 */
function getNames(count, nameList) {
  const list = nameList && nameList.length ? nameList : NOMBRES_DEFAULT;
  const shuffled = shuffle([...list]);
  const names = [];
  for (let i = 0; i < count; i++) {
    if (i < shuffled.length) {
      names.push(String(shuffled[i]).trim() || "Bot " + (i + 1));
    } else {
      names.push((shuffled[i % shuffled.length] || "Bot") + " " + (i + 1));
    }
  }
  return names;
}

const DUPLICATE_SUFFIXES = [" .", " 2", " ,", " ·", " _", " 3", " x", " 4", " !", " 5"];

function isDuplicateNameError(e) {
  const msg = (e?.description || e?.message || "").toLowerCase();
  return msg.includes("duplicate") || msg.includes("nombre") && msg.includes("exist");
}

function joinOne(pin, name, index, total, callbacks) {
  return new Promise((resolve, reject) => {
    const client = new Kahoot();
    const timeout = setTimeout(() => {
      reject(new Error("timeout"));
    }, 15000);

    client.on("Joined", () => {
      clearTimeout(timeout);
      if (callbacks.onJoin) callbacks.onJoin({ name, index: index + 1, total });
      resolve(client);
    });

    client.on("Disconnect", () => {});
    client.on("HandshakeFailed", () => {
      clearTimeout(timeout);
      reject(new Error("HandshakeFailed"));
    });

    client.join(pin, name).catch((e) => {
      clearTimeout(timeout);
      reject(e);
    });
  });
}

/**
 * Ejecuta los bots. Varios entran en paralelo para que sea casi instantáneo.
 */
async function runBots(pin, options, callbacks) {
  const numBots = Math.max(1, parseInt(options.numBots, 10) || 5);
  const names = getNames(numBots, options.names);
  const joined = [];

  const refArray = options.refArray;
  async function tryJoinOne(i, name) {
    for (let attempt = 0; attempt <= DUPLICATE_SUFFIXES.length; attempt++) {
      const tryName = attempt === 0 ? name : name + DUPLICATE_SUFFIXES[attempt - 1];
      try {
        const client = await joinOne(pin, tryName, i, names.length, callbacks);
        joined.push(client);
        if (refArray) refArray.push(client);
        return;
      } catch (e) {
        if (isDuplicateNameError(e) && attempt < DUPLICATE_SUFFIXES.length) continue;
        if (callbacks.onError) callbacks.onError(e?.description || e?.message || "Error");
        return;
      }
    }
  }

  await Promise.all(names.map((name, i) => tryJoinOne(i, name)));

  if (callbacks.onDone) callbacks.onDone(joined.length);
  return joined;
}

module.exports = { runBots, getNames, NOMBRES_DEFAULT };
