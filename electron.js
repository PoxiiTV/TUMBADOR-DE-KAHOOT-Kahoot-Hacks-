const { app: electronApp, BrowserWindow } = require("electron");
const path = require("path");

const PORT = 32853;

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

  win.on("closed", () => {
    electronApp.quit();
  });
}

electronApp.whenReady().then(() => {
  const { app: serverApp, onListen } = require("./server.js");
  serverApp.listen(PORT, "0.0.0.0", () => {
    onListen();
    createWindow();
  });
});

electronApp.on("window-all-closed", () => {
  electronApp.quit();
});
