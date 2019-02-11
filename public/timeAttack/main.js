'use strict';
{
  let currentWord;
  let currentLocation;
  let score;
  let miss;
  let target = document.getElementById("target");
  let info = document.getElementById("info");
  let scoreLabel = document.getElementById("score");
  let missLabel = document.getElementById("miss");
  let timerLabel = document.getElementById("timer");
  let mask = document.getElementById("mask");
  let modal = document.getElementById("modal");
  let resultLabel = document.getElementById("result");
  let again = document.getElementById("again");
  let returnMenu = document.getElementById("returnMenu");
  let load = document.getElementById("load");
  let time;
  let timerId;
  let initWord;
  let spaceKeyPressed;
  let inputedText;
  let startTime;
  let elapsedTime;
  let timeToAdd;
  let lines;

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
    time = 200;
    timeToAdd = 0;
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
    cursor.classList.add("hidden");
    text.classList.add("hidden");
    mask.classList.add("hiddenMask");
    modal.classList.add("hiddenModal");
    getCode()
  }

  var files = localStorage.getItem('files');
  var count = localStorage.getItem('count');
  //filesは連結した文字列になっているのでsplit(",")で配列に変換
  var fileArray = files.split(",");
  //firebaseからの読み込み
  let reader = new FileReader();
  var storageRef = file_base.storage().ref("/" + localStorage.getItem('lang'));

  function getCode(){
    //ロード開始
    // info.classList.add("hiddenMask");
    target.classList.add("hiddenMask");
    start.classList.add("hiddenMask");
    load.classList.remove("hiddenMask");
    //ランダムにファイルを指定
    var random = Math.floor(Math.random() * count);
    var filename = fileArray[random];
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
        //ロード終了
        // info.classList.remove("hiddenMask");
        target.classList.remove("hiddenMask");
        start.classList.remove("hiddenMask");
        load.classList.add("hiddenMask");

        //
        if(spaceKeyPressed){
          startTime = Date.now();
          timerId = setInterval(updateTimer, 100);
        }
      };
      xhr.open('GET', url);
      xhr.send();
    }).catch(function(error) {
      //エラー処理
    });
  }

  init();
  //タイマーの設置(intervalで実装)
  let cursorCount = 0;
  function updateTimer(){
    elapsedTime = (Date.now() - startTime + timeToAdd) / 1000;
    time = 200 - elapsedTime;
    cursorCount++;
    timerLabel.innerHTML = time.toFixed(1);
    if(cursorCount === 3){
      cursor.classList.toggle("cursor");
      cursorCount = 0;
    }
    if (time <= 0) {
      var accuracy = (score / (score + miss));
      var wpm = (score / 200) * 60;
      resultLabel.innerHTML = "<span id='score'>Time up!!</span><br>スコア: " + (wpm*accuracy*accuracy*accuracy).toFixed(0) + "<br>正答率: " + (accuracy * 100).toFixed(2) + "<br>ミスタイプ数: " +miss+"<br>WPM: " + wpm.toFixed(2);
      mask.classList.remove("hiddenMask");
      modal.classList.remove("hiddenModal");
      clearInterval(timerId);
      return;
    }
  }

  //オートスクロール
  function autoScroll() {
    lines++;
    if(lines > 10) {
      if(target.scrollTop < target.scrollHeight - target.clientHeight){
        target.scrollTop += 33;
      }
    }
  }
  //オート横スクロール
  function horizontalScroll() {
    if(letters > 10) {
      if(target.scrollLeft < target.scrollWidth - target.clientWidth){
        target.scrollLeft += 33;
      }
    }
  }
  //ゲーム終了時の処理
  function finish() {
    var accuracy = (score / (score + miss));
    var wpm = (score / 200) * 60;
    resultLabel.innerHTML = "<span id='score'>Time up!!</span><br>スコア: " + (wpm*accuracy*accuracy*accuracy).toFixed(0) + "<br>正答率: " + (accuracy * 100).toFixed(2) + "<br>ミスタイプ数: " +miss+"<br>WPM: " + wpm.toFixed(2);
    mask.classList.remove("hiddenMask");
    modal.classList.remove("hiddenModal");
    clearInterval(timerId);
    return;
  }

  var letters = 0;
  //タイピングゲーム中の処理
  window.addEventListener("keydown", function(e) {
    //ゲーム中断
    if(e.key === "Escape"){
      finish();
    }
    //字下げ時の処理
    if(e.key === "Tab"){
      e.preventDefault();
    }
    if((e.keyCode === 9) && (currentWord[currentLocation] === " ") &&
     (currentWord[currentLocation+1] === " ") &&
     (currentWord[currentLocation+2] === " ") &&
     (currentWord[currentLocation+3] === " ")){
      currentLocation += 4;
      letters += 4;
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
        startTime = Date.now();
        timerId = setInterval(updateTimer, 100);
        initWord = "";
        start.innerText = initWord;
        cursor.classList.remove("hidden");
        text.classList.remove("hidden");
        cursor.textContent = currentWord[currentLocation];
      }
      return;
    }
    //正しい文字を入力したときの処理
    if((e.keyCode === currentWord[currentLocation].charCodeAt(0)) ||
    (e.keyCode === 13 && currentWord[currentLocation].charCodeAt(0) === 10)||
    (e.keyCode === 165 && currentWord[currentLocation].charCodeAt(0) === 92)){
      letters++;
      if(e.keyCode === 13){
        letters = 0;
        target.scrollLeft = 0;
        if(currentWord[currentLocation].charCodeAt(0) === 13) {
          currentLocation++;
        }
        inputedText += "\n";
        autoScroll();
      }
      currentLocation++;
      horizontalScroll();
      // 次のコードへ
      if(currentLocation === currentWord.length){
        clearInterval(timerId);
        timeToAdd += Date.now() - startTime;
        lines = 0;
        inputedText = "";
        currentLocation = 0;
        getCode();
        inputed.textContent = inputedText;
        cursor.textContent = currentWord[currentLocation];
        text.textContent = currentWord.substring(currentLocation+1);
      }

      inputedText += String.fromCharCode(e.keyCode);
      inputed.textContent = inputedText;
      if(currentWord[currentLocation].charCodeAt(0) == 13 || currentWord[currentLocation].charCodeAt(0) == 10){
        cursor.innerHTML = "&#9166;\n";
        console.log();
      } else {
        cursor.textContent = currentWord[currentLocation];
      }
      text.textContent = currentWord.substring(currentLocation+1);
      score++;
      scoreLabel.innerHTML = score;
      cursor.classList.remove("miss");
    //間違った文字を入力したときの処理
    }else {
      miss++;
      missLabel.innerHTML = miss;
      cursor.classList.add("miss");
    }
  })

  again.addEventListener("click", function() {
    location.reload();
  });

  returnMenu.addEventListener("click", function() {
    document.location.href='../index.html';
  });
}
