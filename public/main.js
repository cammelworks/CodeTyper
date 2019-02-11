'use strict';
{
  $(function() {
    //言語によって説明文のレイアウトを変える
    var catchCopy = $("#catchCopy").html();
    var description = $("#description").html();
    var practiceModeDescription = $("#practiceModeDescription").html();
    var timeAttackModeDescription = $("#timeAttackModeDescription").html();
    var attention = $("#attention").html();

    $("#C").click(function() {
      $("#startCatchCopy").text("int Catchcopy() {");
      $("#catchCopy").html(catchCopy);
      $("#endCatchCopy").text("}");
      $("#startDescription").text("int Description() {");
      $("#description").html(description);
      $("#endDescription").text("}");
      $("#startPracticeModeDescription").text("int PracticeMode() {");
      $("#practiceModeDescription").html(practiceModeDescription);
      $("#endPracticeModeDescription").text("}");
      $("#startTimeAttackModeDescription").text("int timeAttackMode() {");
      $("#timeAttackModeDescription").html(timeAttackModeDescription);
      $("#endTimeAttackModeDescription").text("}");
      $("#startAttention").text("int Attention() {");
      $("#attention").html(attention);
      $("#endAttention").text("}");
      $("#fileList").empty();
      localStorage.setItem('lang', "C");
      setFileList();
    });

    $("#Java").click(function() {
      $("#startCatchCopy").text("class Catchcopy() {");
      $("#catchCopy").html(catchCopy);
      $("#endCatchCopy").text("}");
      $("#startDescription").text("class Description() {");
      $("#description").html(description);
      $("#endDescription").text("}");
      $("#startPracticeModeDescription").text("class PracticeMode() {");
      $("#practiceModeDescription").html(practiceModeDescription);
      $("#endPracticeModeDescription").text("}");
      $("#startTimeAttackModeDescription").text("class timeAttackMode() {");
      $("#timeAttackModeDescription").html(timeAttackModeDescription);
      $("#endTimeAttackModeDescription").text("}");
      $("#startAttention").text("class Attention() {");
      $("#attention").html(attention);
      $("#endAttention").text("}");
      $("#fileList").empty();
      localStorage.setItem('lang', "Java");
      setFileList();
    });

    $("#PHP").click(function() {
      $("#startCatchCopy").text("<? php");
      $("#catchCopy").html(catchCopy);
      $("#endCatchCopy").text(">");
      $("#startDescription").text("<? php");
      $("#description").html(description);
      $("#endDescription").text(">");
      $("#startPracticeModeDescription").text("<? php");
      $("#practiceModeDescription").html(practiceModeDescription);
      $("#endPracticeModeDescription").text(">");
      $("#startTimeAttackModeDescription").text("<? php");
      $("#timeAttackModeDescription").html(timeAttackModeDescription);
      $("#endTimeAttackModeDescription").text(">");
      $("#startAttention").text("<? php");
      $("#attention").html(attention);
      $("#endAttention").text(">");
      $("#fileList").empty();
      localStorage.setItem('lang', "PHP");
      setFileList();
    });

    $("#Others").click(function() {
      $("#startDescription").text("Description");
      $("#description").text(description);
      $("#endDescription").text("");
      $("#fileList").empty();
    });

    //選択された言語タグのスタイルを変える
    var languageList = $('.languages-container li');
    languageList.click(function(){
      languageList.css('border-bottom', '1px solid #181A1F').css('background-color', '#21252B');
      $(this).css('border-bottom', 'none').css('background-color', '#282C34');
    });

    //行番号の表示
    var line = 70;
    for(var i = 1; i <= line; i++){
      var lineNumber = $("#lineNumber").html();
      $("#lineNumber").html(lineNumber + i + "<br>");
    }
  });

  //ファイルリストの作成
  function addList(filename){
      var divElement = document.createElement("div");
      //ボタン生成
      //ボタンクリック時にpracticeページに遷移
      divElement.innerHTML = '<button onclick="changePractice(\''+filename+'\');">'+filename+'</button>';
      //divElement.innerHTML = '<button onclick="A();">'+filename+'</button>';
      var parentObject = document.getElementById("fileList");
      parentObject.appendChild(divElement);
      //タイムアタック用にファイル名の配列を作成
      files.push(filename);
  }
  var btn;
  //localStorage内のfilenameの初期化
  localStorage.setItem('filename', " ");
  //ファイル名の配列の宣言
  var files = new Array();
  var count;

  //ファイルリストを作成
  function setFileList() {
    count = 0;
    var storageRef = firebase.storage().ref();
    var databaseRef = firebase.database().ref("/" + localStorage.getItem('lang'));
    //databaseの並び順を変えてボタン生成
    //onメソッドはブラウザのリロード時、データの追加時、更新時に発火
    databaseRef.orderByChild("filename").on('child_added',function(snapshot){
      addList(snapshot.val().filename);
      count++;
      changeButton();
    });
  }

  //選択されているボタンを表示
  function changeButton() {
    btn = $('button');
    btn.click(function(){
      btn.removeClass('active');
      $(this).addClass('active');
    });
  }

  //タイムアタックにページ遷移する際にローカルストレージにファイル名の配列とファイル数を追加
  var start = document.getElementById("start");
  var mode = "practice";
  $("#modeChange").click(function() {
    if(mode === "timeattack") {
      $("#title").text("Practiceモード");
      mode = "practice";
    } else if (mode === "practice"){
      $("#title").text("Time Attackモード");
      mode = "timeattack";
      localStorage.setItem('files', files);
      localStorage.setItem('count', count);
    }
  });

  //選択されたモードのゲーム開始
  start.addEventListener("click", function() {
    if(mode === "practice"){
      if(localStorage.getItem('filename') === " "){
        alert("ファイルを選択してください");
      } else {
        document.location.href='./practice/index.html';
      }
    } else if(mode === "timeattack"){
        document.location.href='./timeAttack/index.html';
    }
  })
}
