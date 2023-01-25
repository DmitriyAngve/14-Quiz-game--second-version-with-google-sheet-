// https://docs.google.com/spreadsheets/d/1mJrWCx0rdl3mR0ww8pW92xf4sk4Nautx9JgUMgN_U7U/gviz/tq?tqx=out:csv&sheet=Sheet1

const gameData = [];

const url =
  "https://docs.google.com/spreadsheets/d/1mJrWCx0rdl3mR0ww8pW92xf4sk4Nautx9JgUMgN_U7U/gviz/tq?tqx=out:json&sheet=Sheet";

function testData() {
  fetch(url)
    .then((res) => res.text())
    .then((data) => {
      data = data.substring(47).slice(0, -2);
      data = JSON.parse(data);
      sortmyData(data.table.rows);
    });
}

function sortmyData(arr) {
  arr.forEach((row, index) => {
    if (index != 0) {
      const myObj = {};
      console.log(row.c);
      myObj["question"] = row.c[0].v;
      myObj["correct"] = row.c[1].v;
      myObj["incorrect"] = [];
      for (let i = 2; i < 6; i++) {
        if (row.c[i] != null) {
          myObj["incorrect"].push(row.c[i].v);
          console.log(row.c[i].v);
        }
      }
      gameData.push(myObj);
    }
  });
  console.log(gameData);
}
