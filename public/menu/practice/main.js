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
    target.innerText = currentWord;
    scoreLabel.innerHTML = score;
    missLabel.innerHTML = miss;
    timerLabel.innerHTML = time;
    inputed.textContent = inputedText;
    target.appendChild(inputed);
    cursor.textContent = currentWord[currentLocation];
    target.appendChild(cursor);
    text.textContent = currentWord.substring(currentLocation);
    target.appendChild(text);
    target.classList.add("hidden");
  }
  init();

  //firebaseからの読み込み
  let reader = new FileReader();
  var storageRef = file_base.storage().ref();
  var filename = localStorage.getItem('filename');
  var fileRef = storageRef.child(filename).getDownloadURL().then(function(url) {
  //urlはダウンロード用url
    // CORSの構成が必要
    var xhr = new XMLHttpRequest();
    //blobで指定
    xhr.responseType = 'blob';
    //ファイル転送はxhrのonload内で抑える
    xhr.onload = function(event) {
      var blob = xhr.response;
      //readAsTextの引数はblob
      reader.readAsText(blob);
      //以下でファイルをcurrentWordに追加
      reader.onload = function(ev){
        currentWord = reader.result;
        cursor.textContent = currentWord[currentLocation];
        text.textContent = currentWord.substring(currentLocation + 1);
      }
    };
    xhr.open('GET', url);
    xhr.send();
  }).catch(function(error) {
    //エラー処理
  });

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
  //Tabキーの処理
  window.addEventListener("keydown", function(e) {
    if(e.key === "Tab"){
      e.preventDefault();
    }
    if((e.keyCode === 9) && (currentWord[currentLocation] === " ") &&
     (currentWord[currentLocation+1] === " ") &&
     (currentWord[currentLocation+2] === " ") &&
     (currentWord[currentLocation+3] === " ")){
      currentLocation += 4;
      inputedText += "    ";
      inputed.textContent = inputedText;
      cursor.textContent = currentWord[currentLocation];
      text.textContent = currentWord.substring(currentLocation+1);
      score++;
      scoreLabel.innerHTML = score;
    }
  })
  window.addEventListener('keypress', function(e) {
    if(e.key === " "){
      e.preventDefault();
    }
    //ゲーム開始
    if(!spaceKeyPressed) {
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
    //正しい文字を入力したときの処理
    if((String.fromCharCode(e.keyCode) === currentWord[currentLocation]) ||
    (e.keyCode === 13 && currentWord[currentLocation].charCodeAt(0) === 10)){
      currentLocation++;
      if(e.keyCode === 13){
        inputedText += "\n";
      }
      inputedText += String.fromCharCode(e.keyCode);
      inputed.textContent = inputedText;
      cursor.textContent = currentWord[currentLocation];
      text.textContent = currentWord.substring(currentLocation+1);
      score++;
      scoreLabel.innerHTML = score;
      // 次のコードへ
      if(currentLocation === currentWord.length){
        init();
      }
    //間違った文字を入力したときの処理
    }else {
      miss++;
      missLabel.innerHTML = miss;
    }
  })
}
