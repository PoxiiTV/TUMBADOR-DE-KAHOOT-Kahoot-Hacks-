/**
 * Obtiene las respuestas correctas de un Kahoot por Quiz ID.
 * Úsalo si la web da error por CORS: node get-answers.js <quizId o enlace>
 * Ejemplo: node get-answers.js https://create.kahoot.it/kahoots/abc-123
 */

const quizIdArg = process.argv[2];
if (!quizIdArg) {
  console.log('Uso: node get-answers.js <Quiz ID o enlace del Kahoot>');
  process.exit(1);
}

const match = quizIdArg.match(/create\.kahoot\.it\/[^/]+\/([a-f0-9-]+)/i) ||
              quizIdArg.match(/kahoot\.it\/[^/]+\/([a-f0-9-]+)/i);
const quizId = match ? match[1] : quizIdArg.trim();

const COLORS = ['🔴', '🔵', '🟡', '🟢'];

async function main() {
  const url = `https://create.kahoot.it/rest/kahoots/${quizId}/card/?includeKahoot=true`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(res.status === 404 ? 'Quiz no encontrado.' : 'Error al cargar el quiz.');
    process.exit(1);
  }
  const data = await res.json();
  const kahoot = data.kahoot || data;
  const questions = kahoot.questions || [];
  if (!questions.length) {
    console.error('No hay preguntas en este quiz.');
    process.exit(1);
  }
  console.log('\n--- Respuestas correctas ---\n');
  questions.forEach((q, i) => {
    const choices = q.choices || [];
    const correctIndex = choices.findIndex(c => c.correct);
    const correct = correctIndex >= 0 ? choices[correctIndex] : null;
    const color = COLORS[correctIndex >= 0 ? correctIndex % 4 : 0];
    console.log(`P${i + 1}: ${color} ${correct ? correct.answer : '(sin respuesta)'}`);
  });
  console.log('');
}

main().catch(e => {
  console.error(e.message || e);
  process.exit(1);
});
