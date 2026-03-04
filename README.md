# 🎮 TUMBADOR DE KAHOOT (Kahoot "Hacks")

**Español** · [English](#-english)

Herramienta de escritorio y web para lanzar bots en partidas de Kahoot: entrar con un montón de nombres, modo ultra ataque y logs en tiempo real.

---

## ✨ Qué hace

- **🤖 Entrar bots**  
  Introduce el PIN del juego, el número de bots (por defecto 50) y opcionalmente una lista de nombres. Los bots se unen a la sala en paralelo. Si no pones nombres, se usan 50 nombres por defecto (comunes en España). Los nombres duplicados se evitan añadiendo sufijos (`.`, `2`, etc.).

- **⚡ Ultra ataque**  
  Bucle automático: 50 bots → esperar 4 s → sacar todos → repetir. Opción *"Enviar bots continuamente"* para mandar 50 bots cada 1 s (desactivada por defecto).

- **📋 Logs**  
  Pestaña universal con el último código (PIN) usado y la lista de actividad. Cualquier dispositivo que use el mismo servidor ve los mismos logs. Botón para limpiar el log.

El servidor escucha en el **puerto 32853** en **0.0.0.0**, así que puedes abrir la interfaz desde otro dispositivo en la red usando tu IP (por ejemplo `http://192.168.1.10:32853`).

---

## 📥 Descargar el .exe ya compilado

Puedes descargar el ejecutable listo para usar (sin instalar nada) desde las **Releases** del repositorio:

👉 **[Releases — TUMBADOR DE KAHOOT](https://github.com/PoxiiTV/TUMBADOR-DE-KAHOOT-Kahoot-Hacks-/releases)**

Con el **.exe no hace falta instalar Node.js ni ninguna otra dependencia**: el ejecutable lleva todo incluido (Electron + Node). Solo descargas el `.exe`, lo ejecutas y se abre la ventana de la app.

---

## 📋 Qué hace falta para que funcione

- **Si usas el .exe de Releases:** nada. Solo ejecutar el archivo.
- **Si quieres ejecutar el código o compilar tú el .exe:**  
  - **Node.js** (v16 o superior). [Descarga Node.js](https://nodejs.org/) si no lo tienes.  
  - Dependencias del proyecto (se instalan con `npm install`).

---

## 🚀 Cómo ejecutar el proyecto

### Opción 1: En el navegador (modo desarrollo)

1. Clona o descarga el repositorio.
2. En la carpeta del proyecto:
   ```bash
   npm install
   npm run web
   ```
3. Abre en el navegador: **http://localhost:32853**

### Opción 2: App de escritorio (Electron)

1. Instala dependencias (incluidas las de Electron):
   ```bash
   npm install
   ```
2. Lanza la aplicación con ventana:
   ```bash
   npm run electron
   ```
   Se abrirá una ventana con la misma interfaz que en el navegador.

### Opción 3: Ejecutable portable (.exe) — sin instalar nada

- Descarga el `.exe` desde [Releases](https://github.com/PoxiiTV/TUMBADOR-DE-KAHOOT-Kahoot-Hacks-/releases) o genera uno con `npm run build`.
- **No hace falta tener Node.js ni nada instalado**: el .exe es portable y lleva todo incluido.
- Ejecútalo y se abrirá la ventana de TUMBADOR. El primer arranque puede tardar un poco.

---

## 🔨 Cómo generar el .exe portable

Desde la carpeta del proyecto, con Node.js instalado:

```bash
npm install
npm run build
```

El ejecutable se generará en la carpeta **`dist`**, con un nombre similar a:

`TUMBADOR-Kahoot-Hacks-1.0.0.exe`

- **Icono:** La build usa el archivo **`icono.png`** en la raíz del proyecto como icono de la app. Si no existe, se usará el icono por defecto de Electron. Coloca tu `icono.png` (por ejemplo 256×256 px) en la raíz antes de ejecutar `npm run build`.

---

## 📁 Estructura del proyecto (resumen)

| Archivo / carpeta   | Uso |
|---------------------|-----|
| `electron.js`       | Proceso principal de Electron: inicia el servidor y abre la ventana. |
| `server.js`         | Servidor Express (API y archivos estáticos). |
| `runBots.js`        | Lógica de los bots (nombres por defecto, `runBots`, referencias a clientes). |
| `public/`           | Interfaz web (HTML, CSS, JS). |
| `icono.png`         | Icono de la aplicación (opcional; recomendado para el .exe). |

---

## ⚠️ Aviso legal y uso responsable

**El autor de este proyecto no se hace responsable del uso que se haga de este software.** Esta herramienta se distribuye "tal cual", solo con fines educativos y de entretenimiento. Quien la use es el único responsable de cumplir las leyes aplicables y las condiciones de uso de Kahoot y de cualquier plataforma o contexto en que se utilice. No fomentamos su uso para trampas en entornos académicos ni para perjudicar a terceros. **Usa bajo tu propia responsabilidad.**

---

## 📄 Licencia

Proyecto de código abierto. Si lo subes a GitHub, indica la licencia que prefieras (MIT, GPL, etc.) en el repositorio.

---

# 🌐 English

Desktop and web tool to run bots in Kahoot games: join with many names, ultra-attack mode, and real-time logs.

---

## ✨ What it does

- **🤖 Join bots**  
  Enter the game PIN, number of bots (default 50), and optionally a list of names. Bots join the lobby in parallel. If you don't provide names, 50 default names are used (common in Spain). Duplicate names are avoided by adding suffixes (`.`, `2`, etc.).

- **⚡ Ultra attack**  
  Automatic loop: 50 bots → wait 4 s → remove all → repeat. Option *"Send bots continuously"* to send 50 bots every 1 s (off by default).

- **📋 Logs**  
  Universal tab with the last PIN used and the activity list. Any device using the same server sees the same logs. Button to clear the log.

The server listens on **port 32853** on **0.0.0.0**, so you can open the interface from another device on the network using your IP (e.g. `http://192.168.1.10:32853`).

---

## 📥 Download the pre-built .exe

You can download the ready-to-use executable (no installation required) from the repository **Releases**:

👉 **[Releases — TUMBADOR DE KAHOOT](https://github.com/PoxiiTV/TUMBADOR-DE-KAHOOT-Kahoot-Hacks-/releases)**

**You do not need to install Node.js or any other dependency** when using the .exe: the executable is self-contained (Electron + Node). Just download the `.exe`, run it, and the app window opens.

---

## 📋 Requirements

- **If you use the .exe from Releases:** none. Just run the file.
- **If you want to run the source code or build the .exe yourself:**  
  - **Node.js** (v16 or newer). [Download Node.js](https://nodejs.org/) if you don't have it.  
  - Project dependencies (install with `npm install`).

---

## 🚀 How to run the project

### Option 1: In the browser (development)

1. Clone or download the repository.
2. In the project folder:
   ```bash
   npm install
   npm run web
   ```
3. Open in your browser: **http://localhost:32853**

### Option 2: Desktop app (Electron)

1. Install dependencies (including Electron):
   ```bash
   npm install
   ```
2. Launch the app with a window:
   ```bash
   npm run electron
   ```
   A window with the same interface as in the browser will open.

### Option 3: Portable .exe — no installation

- Download the `.exe` from [Releases](https://github.com/PoxiiTV/TUMBADOR-DE-KAHOOT-Kahoot-Hacks-/releases) or build one with `npm run build`.
- **No need for Node.js or anything else**: the .exe is portable and self-contained.
- Run it and the TUMBADOR window will open. The first launch may take a moment.

---

## 🔨 How to build the portable .exe

From the project folder, with Node.js installed:

```bash
npm install
npm run build
```

The executable will be in the **`dist`** folder, with a name like:

`TUMBADOR-Kahoot-Hacks-1.0.0.exe`

- **Icon:** The build uses **`icono.png`** in the project root as the app icon. If it doesn't exist, Electron's default icon is used. Place your `icono.png` (e.g. 256×256 px) in the root before running `npm run build`.

---

## 📁 Project structure (summary)

| File / folder   | Purpose |
|-----------------|---------|
| `electron.js`   | Electron main process: starts the server and opens the window. |
| `server.js`    | Express server (API and static files). |
| `runBots.js`   | Bot logic (default names, `runBots`, client references). |
| `public/`      | Web UI (HTML, CSS, JS). |
| `icono.png`    | App icon (optional; recommended for the .exe). |

---

## ⚠️ Legal disclaimer and responsible use

**The author of this project is not responsible for how this software is used.** This tool is provided "as is", for educational and entertainment purposes only. The user is solely responsible for complying with applicable laws and with Kahoot's and any other platform's terms of use. We do not encourage using it for cheating in academic settings or to harm others. **Use at your own risk.**

---

## 📄 License

Open-source project. If you publish it on GitHub, state the license you prefer (MIT, GPL, etc.) in the repository.
