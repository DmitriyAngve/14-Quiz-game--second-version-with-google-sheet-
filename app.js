const url = "quiz.json";
const questions = [];
const output = document.querySelector(".output");
const btn = document.querySelector(".btn");
let cur = 0;
const player = {
  score: 0,
  answers: [],
};
const holder = [];
const totalOutput = document.querySelector("h1");

btn.addEventListener("click", (e) => {
  if (cur >= questions.length) {
    let html = `<hr><h1>Score = ${player.score}</h1>`;
    player.answers.forEach((el) => {
      let bg = el.correct ? "green" : "red";
      html += `<div style="background:${bg}">Question : ${capitalizeText(
        el.question
      )}? <br>`;
      html += `Response : ${el.response} (${el.correctAnswer})<br>`;
      html += `Result : ${el.correct} </div><br>`;
    });
    output.innerHTML = html;
  } else {
    newQuestion();
  }
  btn.style.display = "none";
});

window.addEventListener("DOMContentLoaded", () => {
  //console.log('ready');
  loadQuestions();
});

function capitalizeText(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function newQuestion() {
  updateScore();
  const el = questions[cur];
  el.options.sort(() => {
    return 0.5 - Math.random();
  });
  console.log(cur);
  console.log(questions.length);
  console.log(questions[cur]);
  output.innerHTML = "";
  const que1 = document.createElement("div");
  que1.classList.add("que");
  let strOutput = capitalizeText(el.question);
  console.log(strOutput);

  const ans1 = document.createElement("div");
  que1.textContent = strOutput + "?";
  holder.length = 0;
  el.options.forEach((ans) => {
    const div = document.createElement("div");
    holder.push(div);
    div.correctAnswer = el.correct;
    div.textContent = ans.response;
    div.classList.add("box");
    div.classList.add("boxCursor");
    div.correct = ans.correct;
    div.addEventListener("click", selOption);
    ans1.append(div);
  });
  output.append(que1);
  output.append(ans1);
}

function selOption(e) {
  //track the progress
  console.log(e);
  const tempObj = {
    question: questions[cur].question,
    response: e.target.textContent,
    correctAnswer: e.target.correctAnswer,
  };
  endTurn();
  if (e.target.correct) {
    player.score++;
    updateScore();
    tempObj.correct = true;
    e.target.style.backgroundColor = "green";
  } else {
    e.target.style.backgroundColor = "red";
    tempObj.correct = false;
  }
  player.answers.push(tempObj);
  e.target.style.color = "white";
  nextBtn();
  console.log(player);
}

function updateScore() {
  totalOutput.innerHTML = `${cur + 1} out of ${questions.length} Score: ${
    player.score
  }`;
}

function endTurn() {
  holder.forEach((el) => {
    el.removeEventListener("click", selOption);
    el.style.backgroundColor = "#ddd";
    el.classList.remove("boxCursor");
  });
}

function nextBtn() {
  btn.style.display = "block";
  cur++;
  if (cur >= questions.length) {
    btn.textContent = "See Score";
  } else {
    btn.textContent = "Next Question";
  }
}

function loadQuestions() {
  fetch(url)
    .then((rep) => rep.json())
    .then((data) => {
      //console.log(data);
      data.forEach((el) => {
        let temp = [];
        el.incorrect.forEach((ans) => {
          let tempObj = {
            response: ans,
            correct: false,
          };
          temp.push(tempObj);
        });
        let tempObj = {
          response: el.correct,
          correct: true,
        };
        temp.push(tempObj);
        //console.log(temp);
        let mainTemp = {
          question: el.question,
          options: temp,
          correct: el.correct,
        };
        questions.push(mainTemp);
      });
      console.log(questions);
      //document.write(JSON.stringify(questions));
    });
}
