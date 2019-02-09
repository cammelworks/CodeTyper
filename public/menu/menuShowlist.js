'use strict'
{

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
    var count = 0;
    var storageRef = firebase.storage().ref();
    var databaseRef = firebase.database().ref("/" + localStorage.getItem('lang'));
    //databaseの並び順を変えてボタン生成
    //onメソッドはブラウザのリロード時、データの追加時、更新時に発火
    databaseRef.orderByChild("filename").on('child_added',function(snapshot){
        addList(snapshot.val().filename);
        count++;
        changeButton();
    });

    //タイムアタックにページ遷移する際にローカルストレージにファイル名の配列とファイル数を追加
    var timeAttack = document.getElementById("timeAttack");
    timeAttack.addEventListener("click", function() {
      localStorage.setItem('files', files);
      localStorage.setItem('count', count);
      title.innerText = "TimeAttackモード";
      mode = "timeattack";
    })

    var practice = document.getElementById("practice");
    var start = document.getElementById("start");
    var title = document.getElementById("title");
    var mode = "practice";

    practice.addEventListener("click", function() {
      title.innerText = "Practiceモード";
      mode = "practice";
    })

    //選択されているボタンを表示
    function changeButton() {
      btn = $('button');
      btn.click(function(){
        btn.removeClass('active');
        $(this).addClass('active');
      });
    }

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
