'use strict'
{

    function addList(filename){
        var divElement = document.createElement("div");
        //ボタン生成
        //ボタンクリック時にpracticeページに遷移
        //divElement.innerHTML = '<input type="button" value="'+filename+'" onclick="changePractice('+filename+')">';
        divElement.innerHTML = '<button onclick="changePractice(\''+filename+'\');">'+filename+'</button>';
        //divElement.innerHTML = '<button onclick="A();">'+filename+'</button>';
        var parentObject = document.getElementById("fileList");
        parentObject.appendChild(divElement);
        //タイムアタック用にファイル名の配列を作成
        files.push(filename);
    }
    //ファイル名の配列の宣言
    var files = new Array();
    var count = 0;
    var storageRef = firebase.storage().ref();
    var databaseRef = firebase.database().ref("/" + localStorage.getItem('lang'));
    //databaseの並び順を変えてボタン生成
    //onメソッドはブラウザのリロード時、データの追加時、更新時に発火
    console.log(localStorage.getItem('lang'));
    databaseRef.orderByChild("filename").on('child_added',function(snapshot){
        console.log(snapshot.val().filename);
        addList(snapshot.val().filename);
        count++;
    });

    function changePractice(filename){
        document.location.href='./practice/index.html';
        localStorage.setItem('filename', filename);
    }

    function toTimeAttack(){
      document.location.href='./timeAttack/index.html';
    }
    //タイムアタックにページ遷移する際にローカルストレージにファイル名の配列とファイル数を追加
    var timeAttack = document.getElementById("timeAttack");
    timeAttack.addEventListener("click", function() {
      localStorage.setItem('files', files);
      localStorage.setItem('count', count);
    })
}
