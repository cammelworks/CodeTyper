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
  let lines;
  let h1 = document.getElementById('h1');

  h1.textContent = localStorage.getItem('filename');
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
    lines = 0;
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
  }
  //ロード開始
  info.classList.add("hiddenMask");
  target.classList.add("hiddenMask");
  start.classList.add("hiddenMask");
  init();
    
  //ユーザのログイン状態の確認
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $("#Uname").html(user.displayName);
    } else {
      $("#Uname").html("GUEST");
    }
  }); 

    
  //firebaseからの読み込み
  let reader = new FileReader();

  var storageRef = firebase.storage().ref("/" + localStorage.getItem('lang'));
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
      //ロード終了
      load.classList.add("hiddenMask");
      info.classList.remove("hiddenMask");
      target.classList.remove("hiddenMask");
      start.classList.remove("hiddenMask");
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
      if(cursorCount == 3){
        cursor.classList.toggle("cursor");
        cursorCount = 0;
      }
      //時間切れ
      if (time <= 0) {
        var accuracy = (score / (score + miss)) * 100;
        var wpm = (score / 30) * 60;
        resultLabel.innerHTML = "Time up!!<br>正答率: " + accuracy.toFixed(2) + "<br>WPM: " + wpm.toFixed(2);
        mask.classList.remove("hiddenMask");
        modal.classList.remove("hiddenModal");
        clearTimeout(timerId);
        return;
      }
      updateTimer();
    }, 100);
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
  //ゲーム終了時の処理
  function finish() {
    mask.classList.remove("hiddenMask");
    modal.classList.remove("hiddenModal");
    clearTimeout(timerId);
    var accuracy = (score / (score + miss)) * 100;
    var wpm = (score / 30) * 60;
    resultLabel.innerHTML = "正答率: " + accuracy.toFixed(2) + "<br>WPM: " + wpm.toFixed(2) + "<br>時間: " + (30-time).toFixed(2);
  }

  //タイピングゲーム中の処理
  //Tabキーの処理
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
        cursor.classList.remove("hidden");
        text.classList.remove("hidden");
        cursor.textContent = currentWord[currentLocation];
      }
      return;
    }
    //正しい文字を入力したときの処理
    if((String.fromCharCode(e.keyCode) === currentWord[currentLocation]) ||
    (e.keyCode === 13 && currentWord[currentLocation].charCodeAt(0) === 10)||
    (e.keyCode === 165 && currentWord[currentLocation].charCodeAt(0) === 92)){
      if(e.keyCode === 13){
        if(currentWord[currentLocation].charCodeAt(0) == 13){
          currentLocation++;
        }
        inputedText += "\n";
        autoScroll();
      }
      currentLocation++;
      inputedText += String.fromCharCode(e.keyCode);
      inputed.textContent = inputedText;
      cursor.textContent = currentWord[currentLocation];
      text.textContent = currentWord.substring(currentLocation+1);
      score++;
      cursor.classList.remove("miss");
      scoreLabel.innerHTML = score;
      cursor.classList.remove("miss");
      // 終了
      if(currentLocation === currentWord.length){
        finish();
      }
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
