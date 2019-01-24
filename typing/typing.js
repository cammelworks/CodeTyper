'use strict';
{
  let currentWord;
  let currentLocation;
  let score;
  let miss;
  let target = document.getElementById("target");
  let scoreLabel = document.getElementById("score");
  let missLabel = document.getElementById("miss");
  let timerLabel = document.getElementById("timer");
  let time;
  let timerId;
  let initWord;
  let spaceKeyPressed;
  let fileSelected;
  let inputedText;

  const inputed = document.createElement("span");
  inputed.classList.add("inputed");
  const cursor = document.createElement("span");
  const text = document.createElement("span");
  //初期化
  function init(){
    initWord = "Press space bar to start";
    currentWord = "";
    inputedText = "";
    currentLocation = 0;
    score = 0;
    miss = 0;
    time = 30;
    spaceKeyPressed = false;
    start.innerText = initWord;
    // document.typing.target.value = currentWord;
    target.innerText = currentWord;
    scoreLabel.innerHTML = score;
    missLabel.innerHTML = miss;
    timerLabel.innerHTML = time;
    fileSelected = false;
    inputed.textContent = inputedText;
    target.appendChild(inputed);
    cursor.textContent = currentWord[currentLocation];
    target.appendChild(cursor);
    text.textContent = currentWord.substring(currentLocation);
    target.appendChild(text);
    target.classList.add("hidden");
  }
  init();

  //ファイルの読み込み
  let obj = document.getElementById("selfile");
  obj.addEventListener("change", function(evt) {
    let file = evt.target.files;
    let reader = new FileReader();
    reader.readAsText(file[0]);
    reader.onload = function(ev){
      fileSelected = true;
      currentWord = reader.result
      // document.typing.target.value = currentWord;
      // target.innerText = currentWord;
      cursor.textContent = currentWord[currentLocation];
      text.textContent = currentWord.substring(currentLocation + 1);
    }
  })

  //タイマーの設置
  let cursorCount = 0;
  function updateTimer(){
    timerId = setTimeout(function() {
      time -= 0.1;
      cursorCount++;
      timerLabel.innerHTML = time.toFixed(1);
      if(cursorCount == 5){
        cursor.classList.toggle("cursor");
        cursorCount = 0;
      }
      if (time <= 0) {
        let accuracy = (score + miss) === 0 ? "0.00" : ((score / (score + miss)) * 100).toFixed(2);
        alert("Time is up!\n" + score + " letters, " + miss + " miss! " + accuracy + " %acuracy");
        clearTimeout(timerId);
        init();
        return;
      }
      updateTimer();
    }, 100);
  }

  //タイピングゲーム中の処理
  window.addEventListener("keydown", function(e) {
    if(e.key === "Tab"){
      e.preventDefault();
    }
    console.log((e.keyCode === 9) && (currentWord[currentLocation] === " ") &&
     (currentWord[currentLocation+1] === " ") &&
     (currentWord[currentLocation+2] === " ") &&
     (currentWord[currentLocation+3] === " "));
    if((e.keyCode === 9) && (currentWord[currentLocation] === " ") &&
     (currentWord[currentLocation+1] === " ") &&
     (currentWord[currentLocation+2] === " ") &&
     (currentWord[currentLocation+3] === " ")){
      currentLocation += 4;
      inputedText += "    ";
      // document.typing.target.value = placeholder + currentWord.substring(currentLocation);
      // target.innerText = inputedText + currentWord.substring(currentLocation);
      inputed.textContent = inputedText;
      cursor.textContent = currentWord[currentLocation];
      text.textContent = currentWord.substring(currentLocation+1);
      score++;
      scoreLabel.innerHTML = score;
    }
  })
  window.addEventListener('keypress', function(e) {
    if(!fileSelected){
      alert("ファイルを選択してください");
    }
    //ゲーム開始
    if(!spaceKeyPressed) {
      if(!fileSelected){
        return;
      }
      if(String.fromCharCode(e.keyCode) === " "){
        spaceKeyPressed = true;
        updateTimer();
        initWord = "";
        start.innerText = initWord;
        target.classList.remove("hidden");
        cursor.textContent = currentWord[currentLocation];
      }
      return;
    }

    if((String.fromCharCode(e.keyCode) === currentWord[currentLocation]) ||
    (e.keyCode === 13 && currentWord[currentLocation].charCodeAt(0) === 10)){
      currentLocation++;
      if(e.keyCode === 13){
        inputedText += "\n";
      }
      // let placeholder = "";
      // for(let i = 0; i < currentLocation; i++){
      //   placeholder += "_";
      // }
      inputedText += String.fromCharCode(e.keyCode);
      // document.typing.target.value = placeholder + currentWord.substring(currentLocation);
      // target.innerText = inputedText + currentWord.substring(currentLocation);
      inputed.textContent = inputedText;
      cursor.textContent = currentWord[currentLocation];
      text.textContent = currentWord.substring(currentLocation+1);
      score++;
      scoreLabel.innerHTML = score;
      // 次のコードへ
      if(currentLocation === currentWord.length){
        init();
      }
    }else {
      miss++;
      missLabel.innerHTML = miss;
    }
  })
}
