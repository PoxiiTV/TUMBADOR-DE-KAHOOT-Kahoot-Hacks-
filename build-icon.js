/**
 * Genera icon.ico desde icono.png con margen transparente
 * para que en la barra de título de Windows no se corte el logo.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const toIco = require("to-ico");

const src = path.join(__dirname, "icono.png");
const out = path.join(__dirname, "icon.ico");
const SIZE = 256;
const PAD_RATIO = 0.22; // margen ~22% cada lado (logo ocupa ~56% del cuadrado)

if (!fs.existsSync(src)) {
  console.warn("No existe icono.png, no se genera icon.ico");
  process.exit(0);
}

async function run() {
  const img = sharp(src);
  const { width } = await img.metadata();
  const contentSize = Math.round(SIZE * (1 - PAD_RATIO * 2));
  const pad = Math.round((SIZE - contentSize) / 2);

  const padded = await img
    .resize(contentSize, contentSize)
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const ico = await toIco([padded], { resize: true });
  fs.writeFileSync(out, ico);
  console.log("icon.ico generado con margen (para que no se corte en la barra de título).");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
