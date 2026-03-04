/**
 * Genera el .exe del servidor (Node puro). Al ejecutarlo, arranca el servidor
 * y abre el navegador en http://localhost:32853. La carpeta "public" va junto al .exe.
 */
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const root = __dirname;
const pkg = require(path.join(root, "package.json"));
const version = (pkg.version || "1.0.0").replace(/^\s+|\s+$/g, "");
const outDir = path.join(root, "dist");
const exeName = `TUMBADOR-Kahoot-Hacks-${version}.exe`;
const exePath = path.join(outDir, exeName);

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

console.log("Empaquetando servidor con pkg...");
execSync(
  `npx pkg "server.js" --targets node18-win-x64 --output "${exePath}"`,
  { cwd: root, stdio: "inherit" }
);

console.log("Copiando carpeta public...");
const publicDest = path.join(outDir, "public");
if (fs.existsSync(publicDest)) fs.rmSync(publicDest, { recursive: true });
fs.cpSync(path.join(root, "public"), publicDest, { recursive: true });

console.log("Listo: dist/" + exeName);
console.log("Al ejecutarlo se abre el navegador con la interfaz. Mantén la ventana del servidor abierta.");
process.exit(0);
