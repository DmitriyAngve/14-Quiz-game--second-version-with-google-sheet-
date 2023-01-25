const sheetData = true;

const questions = []; // load all of the data into the questions array
const output = document.querySelector(".output");
const btn = document.querySelector(".btn");
let cur = 0; // current question
const player = { score: 0, answers: [] };

const totalOutput = document.querySelector("h1");
let holder = []; // hold all of the newly constructed elements

function downloadReport() {
  let file;
  let holder = `"Question", "Selection", "Correct", "Correct Answer"\n`;
  let filename = "quiz.csv";
  let prop = {
    type: "text/csv;charset=utf-8;",
  };
  player.answers.forEach((el) => {
    holder += `"${el.question}", "${el.response}", "${el.correct}", "${el.correctAnswer}"\n`;
  });
  // let's populate csv file
  file = new File([holder], filename, prop);
  let link = document.createElement("a");
  let url1 = window.URL.createObjectURL(file);
  console.log(url1);
  link.setAttribute("href", url1);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.append(link);
  link.click();
  document.body.remove(link);
  console.log(holder);
}

btn.addEventListener("click", (e) => {
  if (btn.textContent == "Donwload Report") {
    console.log("download");
    downloadReport();
  } else {
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
      btn.textContent = "Donwload Report";
      btn.style.backgroundColor = "green";
      btn.style.color = "white";
      btn.style.display = "block";
      output.innerHTML = html;
    } else {
      btn.style.display = "none";
      newQuestion();
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  //   console.log("ready");
  let data = {};
  if (sheetData) {
    const id = "1xbUaFbCn22PpcIEzol7pjfuwPxRDJeyxwnvO6L9j7Do";
    const sheetName = "quiz-2";
    const url =
      "https://docs.google.com/spreadsheets/d/" +
      id +
      "/gviz/tq?tqx=out:json&sheet=" +
      sheetName;
    fetch(url)
      .then((res) => res.text())
      .then((data) => {
        data = data.substring(47).slice(0, -2);
        data = JSON.parse(data);
        const gameData = sortmyData(data.table.rows);
        console.log(gameData);
        loadQuestions(gameData);
      });
  } else {
    const url = "quiz.json";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        loadQuestions(data);
      });
  }
});

function sortmyData(arr) {
  const gameData = [];
  arr.forEach((row, index) => {
    if (index != 0) {
      const myObj = {
        question: row.c[0].v,
        correct: row.c[1].v,
        incorrect: [],
      };
      // console.log(row.c);
      // myObj["question"] = row.c[0].v;
      // myObj["correct"] = row.c[1].v;
      // myObj["incorrect"] = [];
      for (let i = 2; i < 6; i++) {
        if (row.c[i] != null) {
          myObj["incorrect"].push(row.c[i].v);
          // console.log(row.c[i].v);
        }
      }
      gameData.push(myObj);
    }
  });
  return gameData;
}

function capitalizeText(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function newQuestion() {
  updateScore();
  const el = questions[cur]; // element object of the question
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

// Function for remove event listener (to handle click event)
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

function loadQuestions(data) {
  data.forEach((el) => {
    let temp = []; // Holder of the object information for the correct and the incorrect answers.

    // Loop through the incorrect answer array
    el.incorrect.forEach((ans) => {
      let tempObj = {
        response: ans,
        correct: false,
      }; // obj for holding information and set it up as an object
      temp.push(tempObj);
    });
    let tempObj = {
      response: el.correct,
      correct: true,
    }; // obj for holding information and set it up as an object
    temp.push(tempObj);
    console.log(temp);
    let mainTemp = {
      question: el.question,
      options: temp,
      correct: el.correct,
    };
    questions.push(mainTemp); // Populate an array
  });
  console.log(questions);
  //   document.write(JSON.stringify(questions));
}
