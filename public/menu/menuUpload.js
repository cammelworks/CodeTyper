'use strict';
{
    //FileAPIに対応しているかの確認
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // ブラウザはFileAPIに対応しています！
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    //ファイル名（拡張子なし取得用変数）
    var reg=/(.*)(?:\.([^.]+$))/;
    var form=document.getElementById("form");
    var noteTitle=document.getElementById("noteTitle");
    var note=document.getElementById("note");
    var fileCount;

    var storageRef  = login_base.storage();
    var inputFile = document.getElementById('selfile');
    var filesrc = new Array();
    var submit = document.createElement("div");
    var buttons = document.getElementById("buttons");

    function getExtension(filesrc) {
      switch (filesrc.match(reg)[2]) {
        case "c":
          return "C";
        case "java":
          return "Java";
        case "py":
          return "Python";
        default:
          return ;
      }
    }

    //firebaseへアップロード
    function upload2fire() {
      for(var i = 0; i < fileCount; i++){
        //拡張子なしファイル名
        var filename = filesrc[i].match(reg)[1];
        //拡張子から言語を取得
        var fileEx = getExtension(filesrc[i]);
        var description = document.getElementById(filesrc[i]).value;
        console.log(fileEx);
        var databaseRef = login_base.database().ref("/"+fileEx+"/"+filename);
        //set()で常に上書き
        //databaseへのアップロード
        databaseRef.set({
          filename: filesrc[i],
          description: description
        });
        console.log('Uploaded to Database!');
      }
      var pElements = document.getElementsByClassName("codeDescription");
      submit.classList.add("hidden");
      for (var i = 0; i < pElements.length; i++) {
        pElements[i].classList.add("hidden");
      }
      var space = document.createElement("div");
      space.classList.add("space");
      space.innerText = " ";
      buttons.insertBefore(space, buttons.lastElementChild);
      note.innerText ="ファイルのアップロードが完了しました.";
    }

    //ファイルの説明の入力フォーム作成
    function getDescription(ev) {
        var target = ev.target;
        var files = target.files;

        noteTitle.innerText ="";
        note.innerText ="ファイルの説明を入力してください.";
        var selfiles = document.getElementById("selfiles");
        selfiles.classList.add("hidden");
        //ここで名前付け
        for(fileCount = 0; files[fileCount]; fileCount++){
            //storage用(拡張子ありファイル名)
            filesrc[fileCount] = files[fileCount].name;
            //database用(拡張子なしファイル名)
            //説明入力欄の作成
            var pElement = document.createElement("p");
            pElement.classList.add("codeDescription");
            pElement.innerHTML = filesrc[fileCount] + ': <input type="text" id=' + filesrc[fileCount] + ' value="" />';
            form.appendChild(pElement);

            var fileRef = storageRef.ref("/"+getExtension(filesrc[fileCount])).child(filesrc[fileCount]);
            //storageへのアップロード
            fileRef.put(files[fileCount]).then(function(snapshot) {
              console.log('Uploaded to Firestore!');
            });
        }
        submit.classList.add("submit");
        submit.innerHTML = "送信";
        buttons.insertBefore(submit, buttons.lastElementChild);
    }
    inputFile.addEventListener('change', getDescription, false);
    submit.addEventListener("click", upload2fire);

    //JQueryでモーダルウィンドウの実装
    $(function() {
      $("#Ubutton").click(function() {
        //マスクを適用
        $("body").append('<div id="mask"></div>');

        //画面中央を計算する関数を実行
        modalResize();
        //モーダルウィンドウの表示
        $("#modal,#mask").fadeIn("slow");
        //closeをクリックしたら閉じる
        $("#close").click(function() {
            $("#modal, #mask").fadeOut("slow", function() {
              $("#mask").remove();
            })
        });
        //画面中央を計算する関数
        $(window).resize(modalResize);
        function modalResize(){
          var w = $(window).width();
          var h = $(window).height();
          var cw = $("#modal").outerWidth();
          var ch = $("#modal").outerHeight();
          //取得した値をcssに追加する
          $("#modal").css({
              "left": ((w - cw)/2) + "px",
              "top": ((h - ch)/2) + "px"
          });
        }
      });
    });

}
