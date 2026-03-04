const { app: electronApp, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");

const PORT = 32853;
let serverProcess = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 440,
    height: 780,
    minWidth: 380,
    minHeight: 500,
    title: "TUMBADOR DE KAHOOT (Kahoot Hacks)",
    icon: path.join(__dirname, "icono.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    show: false,
  });

  win.loadURL("http://localhost:" + PORT);
  win.once("ready-to-show", () => win.show());

  win.webContents.on("did-fail-load", (event, errorCode) => {
    if (errorCode === -3 || errorCode === -2) {
      win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(`
        <!DOCTYPE html><html><head><meta charset="utf-8"><title>TUMBADOR</title>
        <style>body{font-family:system-ui;background:#0d1117;color:#e6edf3;padding:24px;}</style></head><body>
        <h1>No se pudo conectar al servidor</h1>
        <p>El servidor interno no ha respondido. Cierra esta ventana y vuelve a abrir el programa.</p>
        </body></html>
      `));
    }
  });

  win.on("closed", () => {
    if (serverProcess) try { serverProcess.kill(); } catch (e) {}
    electronApp.quit();
  });
}

function waitForServer() {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + 20000;
    function tryConnect() {
      const req = http.get("http://127.0.0.1:" + PORT + "/api/default-names", (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        if (Date.now() > deadline) return reject(new Error("Servidor no respondió"));
        setTimeout(tryConnect, 250);
      });
      req.setTimeout(5000, () => req.destroy());
    }
    setTimeout(tryConnect, 400);
  });
}

function startServer() {
  const serverPath = path.join(__dirname, "server.js");
  serverProcess = spawn(process.execPath, [serverPath], {
    cwd: __dirname,
    env: { ...process.env, ELECTRON_RUN_AS_NODE: "1", PORT: String(PORT) },
    stdio: "ignore",
  });
  serverProcess.on("error", (err) => console.error("Error servidor:", err));
  serverProcess.unref();
}

electronApp.whenReady().then(() => {
  startServer();
  waitForServer()
    .then(createWindow)
    .catch((err) => {
      console.error(err);
      if (serverProcess) try { serverProcess.kill(); } catch (e) {}
      electronApp.quit();
    });
});

electronApp.on("window-all-closed", () => {
  if (serverProcess) try { serverProcess.kill(); } catch (e) {}
  electronApp.quit();
});
