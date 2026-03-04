/**
 * Servidor web para lanzar los bots desde el navegador.
 * npm run web → http://localhost:3000
 */

const express = require("express");
const path = require("path");
const { runBots, NOMBRES_DEFAULT } = require("./runBots");

const app = express();
const PORT = process.env.PORT || 32853;

let activeBots = [];
let lastUsedPin = null;
const globalLog = [];
const MAX_LOG = 80;

function addLog(msg, type = "info") {
  globalLog.push({ t: Date.now(), msg, type });
  if (globalLog.length > MAX_LOG) globalLog.shift();
}

app.use(express.json({ limit: "500kb" }));
const publicDir = typeof process.pkg !== "undefined"
  ? path.join(path.dirname(process.execPath), "public")
  : path.join(__dirname, "public");
app.use(express.static(publicDir));

app.get("/api/default-names", (req, res) => {
  res.json(NOMBRES_DEFAULT);
});

app.post("/api/start", async (req, res) => {
  const { pin, numBots = 5, names, append } = req.body;
  if (!pin || !String(pin).trim()) {
    return res.status(400).json({ error: "Falta el código (PIN)" });
  }
  const n = Math.max(1, parseInt(numBots, 10) || 5);
  const nameList = Array.isArray(names) ? names.map((x) => String(x).trim()).filter(Boolean) : null;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  function send(obj) {
    res.write("data: " + JSON.stringify(obj) + "\n\n");
  }

  const pinStr = String(pin).trim();
  lastUsedPin = pinStr;
  addLog("PIN " + pinStr + ": enviando " + n + " bots", "start");

  try {
    const opts = {
      numBots: n,
      names: nameList && nameList.length ? nameList : undefined,
      refArray: activeBots,
    };
    await runBots(pinStr, opts, {
      onJoin: (data) => send({ type: "joined", ...data }),
      onError: (msg) => send({ type: "error", msg }),
      onDone: (count) => send({ type: "done", count }),
    });
  } catch (e) {
    send({ type: "error", msg: e?.message || "Error" });
  } finally {
    res.end();
  }
});

app.post("/api/stop", (req, res) => {
  const toKick = [...activeBots];
  activeBots.length = 0;
  for (const client of toKick) {
    try {
      if (client && typeof client.leave === "function") client.leave();
    } catch (e) {}
  }
  addLog("Sacados " + toKick.length + " bots del lobby", "stop");
  res.json({ ok: true, count: toKick.length });
});

app.get("/api/logs", (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.json({ lastPin: lastUsedPin, logs: [...globalLog] });
});

app.post("/api/logs/clear", (req, res) => {
  globalLog.length = 0;
  res.json({ ok: true });
});

const onListen = () => {
  addLog("TUMBADOR listo", "info");
  console.log("Servidor: http://0.0.0.0:" + PORT);
  console.log("Acceso local: http://localhost:" + PORT);
  console.log("Acceso desde la red: http://TU_IP:" + PORT + " (sustituye TU_IP por tu IP pública o local)");
  if (require.main === module) {
    const url = "http://localhost:" + PORT;
    const { exec } = require("child_process");
    const cmd = process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;
    exec(cmd, () => {});
  }
};

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", onListen);
} else {
  module.exports = { app, PORT, onListen };
}
