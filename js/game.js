import { formatData } from "./helper.js";

const level = localStorage.getItem("level") || "medium";

const loader = document.querySelector("#loader");
const container = document.querySelector("#container");
const questionText = document.querySelector(".question");
const answersList = document.querySelectorAll(".answer-text");
const scoreNumber = document.querySelector("#score");
const nextButton = document.querySelector(".next-button");
const finishButton = document.querySelector(".finish-button");
const questionNumber = document.querySelector("#question-number");
const error = document.querySelector("#error");
const answersListArr = Array.from(answersList);

const CORRECT_BONUS = 10;
const URL = 
    `https://opentdb.com/api.php?amount=10&difficulty=${level}&type=multiple`;
let formattedData = null;
let questionIndex = 0;
let correctAnswer = null;
let score = 0;
let isAccepted = true;
let questionNo = 1;

const fetchData = async () => {
    try {
        const response = await fetch(URL);
    const json = await response.json();
    formattedData = formatData(json.results);
    start();
    } catch (err) {
        loader.style.display = "none";
        error.style.display = "block";
    }
};

const start = () => {
    showQuestion();
    loader.style.display = "none";
    container.style.display = "block";
};

const showQuestion = () => {
    const {question, answers, correctAnswerIndex } = 
    formattedData[questionIndex];
    correctAnswer = correctAnswerIndex;
    questionText.innerText = question;
    answersListArr.forEach((button, index) => {
        button.innerText = answers[index];
    });
};

const chekAnswer = (event, index) => {
    if (!isAccepted) return;
    isAccepted = false;

    const isCorrect = index === correctAnswer ? true : false;
    if (isCorrect) {
       event.target.classList.add("correct");
        score += CORRECT_BONUS;
        scoreNumber.innerText = score;
    } else { 
        event.target.classList.add("incorrect");
        answersList[correctAnswer].classList.add("correct");
    };
};

const nextHandler = () => {
    if (questionIndex < formattedData.length - 1) {
        questionIndex ++;
        isAccepted = true;
        removeClasses();
        showQuestion();
        questionNo ++;
        questionNumber.innerText = questionNo;
    }else {
        finishHandler();
    }
};

const removeClasses = () => {
    answersList.forEach((button) => {button.className = "answer-text"});
};

const finishHandler = () => {
    localStorage.setItem("score", JSON.stringify(score));
    window.location.assign("./end.html");
}

window.addEventListener("load", fetchData);
nextButton.addEventListener("click", nextHandler);
finishButton.addEventListener("click", finishHandler);
answersList.forEach((button, index) => {
    const handler = (event) => {chekAnswer(event, index)};
    button.addEventListener("click", handler);
    // button.addEventListener("click", () => chekAnswer(index));
});