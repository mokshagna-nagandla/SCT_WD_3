const quizData = [
  { type: "MCQ", question: "Which is the largest planet in our solar system?", options: ["Earth", "Jupiter", "Saturn", "Mars"], answer: "Jupiter" },
  { type: "MCQ", question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], answer: "Hyper Text Markup Language" },
  { type: "Multi", question: "Which are JavaScript frameworks?", options: ["React", "Laravel", "Vue", "Django"], answer: ["React", "Vue"] },
  { type: "Text", question: "What is 15 + 27?", answer: "42" },
  { type: "MCQ", question: "Which company developed Python?", options: ["Microsoft", "Google", "Python Software Foundation", "Apple"], answer: "Python Software Foundation" },
  { type: "MCQ", question: "CSS is used for?", options: ["Structure", "Styling", "Logic", "Database"], answer: "Styling" },
  { type: "Text", question: "Capital of Japan?", answer: "Tokyo" },
  { type: "MCQ", question: "1 Byte =? Bits", options: ["4", "8", "16", "32"], answer: "8" },
  { type: "Multi", question: "Select programming languages:", options: ["Python", "HTML", "C++", "Photoshop"], answer: ["Python", "C++"] },
  { type: "MCQ", question: "Which is not an OS?", options: ["Windows", "Linux", "Chrome", "MacOS"], answer: "Chrome" }
];

let currentQ = 0;
let score = 0;
let correct = 0;
let wrong = 0;
let selectedAnswers = [];
let startTime = Date.now();
let timerInterval;

const questionText = document.getElementById('questionText');
const qType = document.getElementById('qType');
const optionsContainer = document.getElementById('optionsContainer');
const textInput = document.getElementById('textInput');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const skipBtn = document.getElementById('skipBtn');
const qNumber = document.getElementById('qNumber');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const progressDots = document.getElementById('progressDots');
const quizBody = document.getElementById('quizBody');
const resultScreen = document.getElementById('resultScreen');
const themeBtn = document.getElementById('themeBtn');

function initProgressDots() {
  progressDots.innerHTML = '';
  quizData.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('progress-dot');
    if (i === 0) dot.classList.add('active');
    progressDots.appendChild(dot);
  });
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');
  timerEl.textContent = `${mins}:${secs}`;
}

function loadQuestion() {
  const q = quizData[currentQ];
  questionText.textContent = q.question;
  qType.textContent = q.type === "MCQ"? "Single Choice" : q.type === "Multi"? "Multiple Select" : "Fill in the Blank";
  qNumber.textContent = `${currentQ + 1}/${quizData.length}`;

  document.querySelectorAll('.progress-dot').forEach((dot, i) => {
    dot.classList.remove('active');
    if (i === currentQ) dot.classList.add('active');
  });

  optionsContainer.innerHTML = '';
  textInput.style.display = 'none';
  selectedAnswers = [];

  if (q.type === "MCQ" || q.type === "Multi") {
    optionsContainer.style.display = 'grid';
    q.options.forEach(option => {
      const div = document.createElement('div');
      div.className = 'option';
      div.textContent = option;
      div.onclick = () => selectOption(div, option, q.type);
      optionsContainer.appendChild(div);
    });
  } else {
    optionsContainer.style.display = 'none';
    textInput.style.display = 'block';
    textInput.value = '';
  }

  submitBtn.style.display = 'block';
  nextBtn.style.display = 'none';
}

function selectOption(element, option, type) {
  if (type === "MCQ") {
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    selectedAnswers = [option];
  } else {
    element.classList.toggle('selected');
    if (selectedAnswers.includes(option)) {
      selectedAnswers = selectedAnswers.filter(a => a!== option);
    } else {
      selectedAnswers.push(option);
    }
  }
}

function submitAnswer() {
  const q = quizData[currentQ];
  let userAnswer = q.type === "Text"? textInput.value.trim() : selectedAnswers;

  if (userAnswer.length === 0 || userAnswer === "") {
    alert("Please answer the question!");
    return;
  }

  let isCorrect = false;
  if (q.type === "MCQ") isCorrect = userAnswer[0] === q.answer;
  if (q.type === "Multi") isCorrect = JSON.stringify(userAnswer.sort()) === JSON.stringify(q.answer.sort());
  if (q.type === "Text") isCorrect = userAnswer.toLowerCase() === q.answer.toLowerCase();

  if (q.type!== "Text") {
    document.querySelectorAll('.option').forEach(opt => {
      if (q.answer.includes(opt.textContent)) opt.classList.add('correct');
      if (opt.classList.contains('selected') &&!q.answer.includes(opt.textContent)) opt.classList.add('wrong');
    });
  }

  if (isCorrect) { score++; correct++; } else { wrong++; }
  scoreEl.textContent = score;

  document.querySelectorAll('.progress-dot')[currentQ].classList.add('completed');

  submitBtn.style.display = 'none';
  nextBtn.style.display = 'block';
}

function nextQuestion() {
  currentQ++;
  if (currentQ < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function skipQuestion() {
  wrong++;
  document.querySelectorAll('.progress-dot')[currentQ].classList.add('completed');
  nextQuestion();
}

function showResult() {
  clearInterval(timerInterval);
  quizBody.style.display = 'none';
  resultScreen.style.display = 'block';

  document.getElementById('finalScore').textContent = `${score}/${quizData.length}`;
  document.getElementById('correctCount').textContent = correct;
  document.getElementById('wrongCount').textContent = wrong;
  document.getElementById('timeTaken').textContent = timerEl.textContent;

  const percent = (score / quizData.length) * 100;
  document.getElementById('resultFeedback').textContent =
    percent >= 80? "Outstanding! 🔥" : percent >= 60? "Good Job! 👍" : "Keep Practicing! 💪";
}

function restartQuiz() {
  currentQ = 0; score = 0; correct = 0; wrong = 0;
  scoreEl.textContent = 0;
  startTime = Date.now();
  quizBody.style.display = 'block';
  resultScreen.style.display = 'none';
  initProgressDots();
  loadQuestion();
  timerInterval = setInterval(updateTimer, 1000);
}

// Theme toggle
themeBtn.addEventListener('click', () => {
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    themeBtn.textContent = '🌙';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeBtn.textContent = '☀️';
  }
});

submitBtn.addEventListener('click', submitAnswer);
nextBtn.addEventListener('click', nextQuestion);
skipBtn.addEventListener('click', skipQuestion);
document.getElementById('restartBtn').addEventListener('click', restartQuiz);

// Start
initProgressDots();
loadQuestion();
timerInterval = setInterval(updateTimer, 1000);