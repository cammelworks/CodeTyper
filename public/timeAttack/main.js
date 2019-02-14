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
  let countLines;
  let lineMisses;
  let perfictLines;

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
    lineMisses = 0;
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

  //ユーザのログイン状態の確認
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var userRef = firebase.database().ref("/user/"+user.uid+"/timeAttack/"+localStorage.getItem('lang'));
      $("#Uname").html(user.displayName);

      //DBから自己ベストスコアを持ってくる
      //初めての場合は表示されない
      userRef.orderByChild("score").once("value",function(snapshot){
          if(snapshot.val() !== null){
            $("#myBest").html("MY BEST: "+snapshot.val().score);
          }
      });
    } else {
      $("#Uname").html("GUEST");
    }
  });

  var files = localStorage.getItem('files');
  var count = localStorage.getItem('count');
  //filesは連結した文字列になっているのでsplit(",")で配列に変換
  var fileArray = files.split(",");
  //firebaseからの読み込み
  let reader = new FileReader();
  var storageRef = firebase.storage().ref("/" + localStorage.getItem('lang'));

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
      finish();
    }
  }

  //オートスクロール
  function autoScroll() {
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
    clearInterval(timerId);
    var accuracy = (score / (score + miss));
    var wpm = (score / 200) * 60;
    var totalScore = wpm*accuracy*accuracy*accuracy;
    console.log(lines);
    console.log(lineMisses);
    mask.classList.remove("hiddenMask");
    modal.classList.remove("hiddenModal");

    //最後まで終わらせたときのみ結果を表示
    if(accuracy.toFixed(2) === "NaN"){
       resultLabel.innerHTML = "中断";
    }else{
      resultLabel.innerHTML = "<span id='score'>Time up!!</span><br>スコア: " +
      totalScore.toFixed(0) + "<br>正答率: " +
      (accuracy * 100).toFixed(2) + "<br>行正答率: " +
      perfictLines +"/" + countLines + "<br>ミスタイプ数: "
      +miss+"<br>WPM: " + wpm.toFixed(2);
    }
    //ログインしていたら
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //DBにスコアを追加
        var userRef = firebase.database().ref("/user/"+user.uid+"/timeAttack/"+localStorage.getItem('lang'));
        userRef.orderByChild("score").once("value",function(snapshot){
          //今回が初めて
          if(snapshot.val() === null && accuracy.toFixed(2) !== "NaN"){
            userRef.set({
               score : totalScore.toFixed(0)
            });
          }else{
            var myBest = snapshot.val().score;
            if(myBest < totalScore && accuracy.toFixed(2) !== "NaN"){
              console.log("自己ベスト");
              //自己ベスト更新
              userRef.set({
                score : totalScore.toFixed(0)
              });
              resultLabel.innerHTML = "<span id='score'>Time up!!</span><br>スコア: " +
              totalScore.toFixed(0) + "<br>正答率: " +
              (accuracy * 100).toFixed(2) + "<br>ミスタイプ数: "
              +miss+"<br>WPM: " + wpm.toFixed(2) + "<br>自己ベスト更新！！";
            }
          }
        });
      } else {
          //GUESTのとき
      }
    });
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
        lines = 0;
        countLines = 0;
        perfictLines = 0;
      }
      return;
    }
    //正しい文字を入力したときの処理
    if((e.keyCode === currentWord[currentLocation].charCodeAt(0)) ||
    (e.keyCode === 13 && currentWord[currentLocation].charCodeAt(0) === 10)||
    (e.keyCode === 165 && currentWord[currentLocation].charCodeAt(0) === 92)){
      letters++;
      if(e.keyCode === 13){
        if(lineMisses == 0) {
          perfictLines++;
          console.log("perfect");
        }
        letters = 0;
        lineMisses = 0;
        target.scrollLeft = 0;
        if(currentWord[currentLocation].charCodeAt(0) === 13) {
          currentLocation++;
        }
        inputedText += "\n";
        lines++;
        countLines++;
        autoScroll();
      }
      currentLocation++;
      horizontalScroll();
      // 次のコードへ
      if(currentLocation === currentWord.length){
        clearInterval(timerId);
        timeToAdd += Date.now() - startTime;
        lines = 0;
        lineMisses = 0;
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
      lineMisses++;
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
