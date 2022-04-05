const question = document.querySelector("#question");
const choices = Array.from(document.getElementsByClassName("choices-text"));
const progressText = document.querySelector("#progressText");
const scoresText = document.querySelector("#score");
const progressBarFull = document.querySelector("#progressBarFull");
const loader = document.querySelector("#loader");
const game = document.querySelector("#game");

let currentQuestions = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
)
  .then((response) => response.json())
  .then((loadedQuestionsObj) => {
    questions = loadedQuestionsObj.results.map((loadedQuestionsElement) => {
      const formattedQuestion = {
        question: loadedQuestionsElement.question,
      };

      const answerChoices = [...loadedQuestionsElement.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestionsElement.correct_answer
      );
      answerChoices.map((choice, index) => {
        formattedQuestion[`choice` + (index + 1)] = choice;
      });
      return formattedQuestion;
    });
    startGame();
  });

const CORECT_BONUS = 10;
const MAX_QUESTIONS = 5;

const startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

const getNewQuestion = () => {
  if (availableQuestions === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);

    return window.location.assign("end.html");
  }

  questionCounter++;
  progressText.innerHTML = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestions = availableQuestions[questionIndex];
  question.innerHTML = currentQuestions.question;
  choices.map((choice) => {
    const number = choice.dataset["number"];
    choice.innerHTML = currentQuestions["choice" + number];
  });
  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.map((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    const classToAplyy = selectedAnswer == currentQuestions.answer ? "correct" : "incorrect";
    if (classToAplyy === "correct") {
      incrementScore(CORECT_BONUS);
    }
    selectedChoice.parentElement.classList.add(classToAplyy);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToAplyy);
      getNewQuestion();
    }, 1000);
  });
});

const incrementScore = number => {
    score += number;
    scoresText.innerHTML = score;
    
}