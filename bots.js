/**
 * Mete varios bots en un Kahoot con nombres divertidos (CLI).
 * Uso: node bots.js <PIN> [--bots=5]
 */

const { runBots, getNames } = require("./runBots");

function parseArgs() {
  const args = process.argv.slice(2);
  let pin = null;
  let bots = 5;
  for (const a of args) {
    if (a.startsWith("--bots=")) {
      const n = parseInt(a.slice("--bots=".length), 10);
      if (!isNaN(n) && n >= 1) bots = n;
    } else if (pin === null) pin = a;
  }
  return { pin, bots };
}

async function main() {
  const { pin, bots } = parseArgs();
  if (!pin) {
    console.log("Uso: node bots.js <PIN> [--bots=N]");
    console.log("  N = número de bots (1-100), por defecto 5");
    console.log("\nEjemplo: node bots.js 1234567 --bots=8");
    process.exit(1);
  }

  console.log("PIN:", pin);
  console.log("Enviando", bots, "bot(s)...\n");

  await runBots(
    pin,
    { numBots: bots },
    {
      onJoin: ({ name, index, total }) => console.log(`  [${index}/${total}] Entró: ${name}`),
      onError: (msg) => console.log("  Error:", msg),
      onDone: (count) => {
        console.log("\nListo. " + count + " bot(s) en el lobby.");
        console.log("Pulsa Ctrl+C para salir.");
      },
    }
  );

  process.on("SIGINT", () => process.exit(0));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
