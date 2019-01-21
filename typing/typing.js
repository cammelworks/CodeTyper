'use strict';
{
  let words = ["apple","sky", "orange", "grape"];
  let currentWord;
  let currentLocation;
  let score;
  let miss;
  let timer;
  let target = document.getElementById("target");
  let scoreLabel = document.getElementById("score");
  let missLabel = document.getElementById("miss");
  let timerLabel = document.getElementById("timer");
  let isStarted;
  let timerId;

  function init(){
    currentWord = "click to start";
    currentLocation = 0;
    score = 0;
    miss = 0;
    timer = 10;
    target.innerHTML = currentWord;
    scoreLabel.innerHTML = score;
    missLabel.innerHTML = miss;
    timerLabel.innerHTML = timer;
    isStarted = false;
  }

  init();

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
  function setTarget() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    target.innerHTML = currentWord;
    currentLocation = 0;
  }

  window.addEventListener('click', function() {
    if(!isStarted){
      isStarted = true;
      setTarget();
      updateTimer();
    }
  })

  window.addEventListener('keyup', function(e) {
    if(!isStarted) {
      return;
    }
    if(String.fromCharCode(e.keyCode) === currentWord[currentLocation].toUpperCase()){
      currentLocation++;
      let placeholder = "";
      for(let i = 0; i < currentLocation; i++){
        placeholder += "_";
      }
      target.innerHTML = placeholder + currentWord.substring(currentLocation);
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
