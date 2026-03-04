# 🎮 TUMBADOR DE KAHOOT (Kahoot "Hacks")

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

## 📋 Qué hace falta para que funcione

- **Node.js** (v16 o superior).  
  [Descarga Node.js](https://nodejs.org/) si no lo tienes.

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

### Opción 3: Ejecutable portable (.exe)

- Si ya tienes el `.exe` generado (por ejemplo `TUMBADOR-Kahoot-Hacks-1.0.0.exe`), solo tienes que **ejecutarlo**. No hace falta instalar Node.js en el PC donde lo ejecutas.  
- El primer arranque puede tardar un poco; después se abrirá la ventana de TUMBADOR.

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

## ⚠️ Uso responsable

Esta herramienta es para **divertirse con amigos** o en contextos donde tengas permiso. No la uses para trampas en clase o en situaciones donde afecte a otros de forma negativa. El uso es bajo tu propia responsabilidad.

---

## 📄 Licencia

Proyecto de código abierto. Si lo subes a GitHub, indica la licencia que prefieras (MIT, GPL, etc.) en el repositorio.
