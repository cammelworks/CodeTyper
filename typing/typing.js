'use strict';
{
  let currentWord;
  let currentLocation;
  let score;
  let miss;
  let timer;
  //let target = document.getElementById("target");
  let scoreLabel = document.getElementById("score");
  let missLabel = document.getElementById("miss");
  let timerLabel = document.getElementById("timer");
  let timerId;
  let initWord;
  let spaceKeyPressed;
  let fileSelected;

  //初期化
  function init(){
    initWord = "Press space bar to start";
    currentLocation = 0;
    score = 0;
    miss = 0;
    timer = 100;
    spaceKeyPressed = false;
    start.innerText = initWord;
    scoreLabel.innerHTML = score;
    missLabel.innerHTML = miss;
    timerLabel.innerHTML = timer;
    fileSelected = false;
  }
  init();

  //ファイルを読み込む
  let obj = document.getElementById("selfile");
  obj.addEventListener("change", function(evt) {
    let file = evt.target.files;
    let reader = new FileReader();
    reader.readAsText(file[0]);
    reader.onload = function(ev){
      fileSelected = true;
      currentWord = reader.result
      document.typing.target.value = currentWord;
    }
  })

  //タイマーの設置
  function updateTimer(){
    timerId = setTimeout(function() {
      timer--;
      timerLabel.innerHTML = timer;
      if(timer <= 0){
        let accuracy = (score + miss) === 0 ? "0.00" : ((score / (score + miss)) * 100).toFixed(2);
        alert(score + " letters, " + miss + " miss! " + accuracy + " %acuracy");
        clearTimeout(timerId);
        init();
        return;
      }
      updateTimer();
    }, 1000);
  }

  //
  // function setTarget() {
  //   currentWord = words[Math.floor(Math.random() * words.length)];
  //   target.innerText = currentWord;
  //   console.log(currentWord);
  //   currentLocation = 0;
  // }

  //クリックで開始するときの処理
  // window.addEventListener('click', function() {
  //   if(!isStarted){
  //     isStarted = true;
  //     setTarget();
  //     updateTimer();
  //   }
  // })

  //タイピングゲーム中の処理
  window.addEventListener('keypress', function(e) {
    if(!fileSelected){
      alert("ファイルを選択してください");
    }
    //console.log(String.fromCharCode(e.keyCode));
    if(!spaceKeyPressed) {
      if(String.fromCharCode(e.keyCode) === " "){
        spaceKeyPressed = true;
        updateTimer();
        initWord = "";
        start.innerText = initWord;
      }
      return;
    }
    console.log(currentWord[currentLocation].charCodeAt(0));
    if(String.fromCharCode(e.keyCode) === currentWord[currentLocation]){
      currentLocation++;
      if(e.keyCode === 10 || e.keyCode === 13){
        currentLocation++;
      }
      let placeholder = "";
      for(let i = 0; i < currentLocation; i++){
        placeholder += "_";
      }
      document.typing.target.value = placeholder + currentWord.substring(currentLocation);
      score++;
      scoreLabel.innerHTML = score;
      if(currentLocation === currentWord.length){
        setTarget();
      }
    }else {
      miss++;
      missLabel.innerHTML = miss;
    }
  })
}
