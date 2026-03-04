/**
 * Bot de Kahoot que se une con el PIN y responde.
 * Para acertar todas: pasa --quiz-id o --quiz-name (el nombre que sale cuando el host inicia el quiz).
 * Sin eso solo responde la primera opción (no sirve para trolear con todas bien).
 *
 * Uso:
 *   node bot.js <PIN> <nickname> [--quiz-id=UUID] [--quiz-name="Nombre del quiz"]
 *   npm run bot -- 1234567 MiNombre --quiz-name "Historia de España"
 *
 * Si Kahoot ha cambiado el protocolo (dominio play.kahoot.it, nuevo reto, etc.), la librería puede fallar al conectar.
 */

const Kahoot = require("kahoot.js-latest");
const COLORS = ["🔴", "🔵", "🟡", "🟢"];

function parseArgs() {
  const args = process.argv.slice(2);
  let pin = null;
  let nickname = null;
  let quizId = null;
  let quizName = null;
  for (const a of args) {
    if (a.startsWith("--quiz-id=")) quizId = a.slice("--quiz-id=".length).trim();
    else if (a.startsWith("--quiz-name=")) quizName = a.slice("--quiz-name=".length).trim();
    else if (pin === null) pin = a;
    else if (nickname === null) nickname = a;
  }
  return { pin, nickname, quizId, quizName };
}

async function fetchQuizById(quizId) {
  const url = `https://create.kahoot.it/rest/kahoots/${quizId}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

async function searchQuizByName(query, quizQuestionAnswers) {
  const url = "https://create.kahoot.it/rest/kahoots/";
  const params = new URLSearchParams({
    query,
    cursor: "0",
    limit: "30",
    orderBy: "relevance",
  });
  const res = await fetch(`${url}?${params}`);
  if (!res.ok) return null;
  const data = await res.json();
  const entities = data.entities || [];
  for (const e of entities) {
    const uuid = e.card?.uuid;
    if (!uuid) continue;
    const full = await fetchQuizById(uuid);
    if (!full || !full.questions) continue;
    if (quizQuestionAnswers && full.questions.length !== quizQuestionAnswers.length) continue;
    if (quizQuestionAnswers) {
      let match = true;
      for (let i = 0; i < full.questions.length; i++) {
        const choices = full.questions[i].choices || [];
        if (quizQuestionAnswers[i] !== undefined && choices.length !== quizQuestionAnswers[i]) {
          match = false;
          break;
        }
      }
      if (!match) continue;
    }
    return full;
  }
  return null;
}

function parseAnswers(quiz) {
  const allowed = ["quiz", "multiple_select_quiz"];
  const answers = [];
  for (const q of quiz.questions || []) {
    if (!allowed.includes(q.type)) {
      answers.push(0);
      continue;
    }
    const choices = q.choices || [];
    const idx = choices.findIndex((c) => c.correct);
    answers.push(idx >= 0 ? idx : 0);
  }
  return answers;
}

async function main() {
  const { pin, nickname, quizId, quizName } = parseArgs();
  if (!pin || !nickname) {
    console.log("Uso: node bot.js <PIN> <nickname> [--quiz-id=UUID] [--quiz-name=\"Nombre\"]");
    console.log("Ejemplo: node bot.js 1234567 Troll --quiz-name \"Cultura general\"");
    process.exit(1);
  }

  let answers = null;
  if (quizId) {
    const quiz = await fetchQuizById(quizId);
    if (quiz) {
      answers = parseAnswers(quiz);
      console.log("Respuestas cargadas por Quiz ID (" + answers.length + " preguntas).");
    } else {
      console.log("No se encontró el quiz con ese ID. Jugaré sin respuestas correctas.");
    }
  }

  const client = new Kahoot();
  let quizQuestionAnswers = null;

  client.on("Joined", () => {
    console.log("Unido al juego como:", nickname);
    if (!answers && quizName) console.log("Cuando empiece el quiz buscaré: \"" + quizName + "\"");
  });

  client.on("QuizStart", async (data) => {
    quizQuestionAnswers = data.quizQuestionAnswers || [];
    if (answers) return;
    if (quizName) {
      console.log("Buscando quiz por nombre...");
      const quiz = await searchQuizByName(quizName, quizQuestionAnswers);
      if (quiz) {
        answers = parseAnswers(quiz);
        console.log("Respuestas encontradas (" + answers.length + " preguntas).");
      } else {
        console.log("No se encontró un quiz que coincida. Responderé la primera opción.");
      }
    }
  });

  client.on("QuestionStart", (question) => {
    const idx = question.questionIndex;
    const choice = answers && answers[idx] !== undefined ? answers[idx] : 0;
    console.log("P" + (idx + 1) + " → " + COLORS[choice] + " (índice " + choice + ")");
    question.answer(choice);
  });

  client.on("QuizEnd", () => {
    console.log("Quiz terminado.");
    process.exit(0);
  });

  client.on("Disconnect", (reason) => {
    console.log("Desconectado:", reason);
    process.exit(1);
  });

  client.on("HandshakeFailed", () => {
    console.log("Error al conectar. Kahoot puede haber cambiado el protocolo o el PIN no es válido.");
    process.exit(1);
  });

  console.log("Conectando al PIN", pin, "...");
  try {
    await client.join(pin, nickname);
  } catch (e) {
    console.error("Error al unirse:", e?.description || e?.message || e);
    process.exit(1);
  }
}

main();
