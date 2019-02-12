'use strict';
{
    var signout = document.getElementById("signout");

    //ユーザの管理JQuery
    $(function() {
      //新規ユーザ登録
      $("#signup").click(function() {
        $("#userInfoTitle").html("アカウント作成");
        $("#username").removeClass("hidden");
        //マスクを適用
        $("body").append('<div id="mask"></div>');
        //画面中央を計算する関数を実行
        modalResize();
        //モーダルウィンドウの表示
        $("#modalAuth,#mask").fadeIn("slow");

        //okをクリックしたら登録して閉じる
        $("#ok").click(function(){
            var email = $("#email").val();
            var password = $("#password").val();
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function(error) {
                // エラー処理
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode+':'+errorMessage);
            });
            //閉じる
            $("#modalAuth, #mask").fadeOut("slow", function() {
              $("#mask").remove();
            })
        });

        //画面中央を計算する関数
        $(window).resize(modalResize);
        function modalResize(){
          var w = $(window).width();
          var h = $(window).height();
          var cw = $("#modalAuth").outerWidth();
          var ch = $("#modalAuth").outerHeight();
          //取得した値をcssに追加する
          $("#modalAuth").css({
              "left": ((w - cw)/2) + "px",
              "top": ((h - ch)/2) + "px"
          });
        }
      });

      //ログイン
      $("#login").click(function() {
        $("#userInfoTitle").html("ログイン");
        $("#username").addClass("hidden");
        //マスクを適用
        $("body").append('<div id="mask"></div>');
        //画面中央を計算する関数を実行
        modalResize();
        //モーダルウィンドウの表示
        $("#modalAuth,#mask").fadeIn("slow");

        //okをクリックしたら登録して閉じる
        $("#ok").click(function(){
            var email = $("#email").val();
            var password = $("#password").val();
            firebase.auth().signInWithEmailAndPassword(email, password).then(function(error) {
                // エラー処理
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode+':'+errorMessage);
            });
            //閉じる
            $("#modalAuth, #mask").fadeOut("slow", function() {
              $("#mask").remove();
            })
        });

        //画面中央を計算する関数
        $(window).resize(modalResize);
        function modalResize(){
          var w = $(window).width();
          var h = $(window).height();
          var cw = $("#modalAuth").outerWidth();
          var ch = $("#modalAuth").outerHeight();
          //取得した値をcssに追加する
          $("#modalAuth").css({
              "left": ((w - cw)/2) + "px",
              "top": ((h - ch)/2) + "px"
          });
        }
      });

      //サインアウト
      $("#signout").click(function(){
          firebase.auth().signOut();
      })

    });

    //ユーザのログイン状態の確認
    firebase.auth().onAuthStateChanged(function(user){
        if (user) {
            //新規、ログインの非表示
            $("#signup").addClass("hidden");
            $("#login").addClass("hidden");

            //ユーザ名、サインアウトの表示
            $("#signout").removeClass("hidden");
            $("#Uname").removeClass("hidden");

            //ユーザ名の登録
            if(user.displayName === null){
                var username = $("#username").val();
                //ユーザID
                //DBにユーザーを追加
                var userRef = firebase.database().ref("/user/"+user.uid);
                userRef.set({
                    username: username,
                });
                //authのアップデート
                user.updateProfile({
                    displayName: username,
                }).then(function(error){
                    //エラー処理
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode+':'+errorMessage);
                });

                //サインアウト、ユーザ名の非表示
                $("#Uname").html(username);
            }else{
                $("#Uname").html(user.displayName);
            }

        //GUEST
        } else {
            //サインアウト、ユーザ名の非表示
            $("#signout").addClass("hidden");
            $("#Uname").addClass("hidden");

            //新規、ログインの表示
            $("#signup").removeClass("hidden");
            $("#login").removeClass("hidden");
        }
    });

  $(function() {
    //言語によって説明文のレイアウトを変える
    var catchCopy = $("#catchCopy").html();
    var description = $("#description").html();
    var practiceModeDescription = $("#practiceModeDescription").html();
    var timeAttackModeDescription = $("#timeAttackModeDescription").html();
    var attention = $("#attention").html();

    $("#C").click(function() {
      $("#startCatchCopy").html("<span class='lightgreen'>int</span> <span class='skyblue'>Catchcopy()</span> {");
      $("#catchCopy").html(catchCopy);
      $("#endCatchCopy").html("}");
      $("#startDescription").html("<span class='lightgreen'>int</span> <span class='skyblue'>Description()</span> {");
      $("#description").html(description);
      $("#endDescription").html("}");
      $("#startPracticeModeDescription").html("<span class='lightgreen'>int</span> <span class='skyblue'>PracticeMode()</span> {");
      $("#practiceModeDescription").html(practiceModeDescription);
      $("#endPracticeModeDescription").html("}");
      $("#startTimeAttackModeDescription").html("<span class='lightgreen'>int</span> <span class='skyblue'>timeAttackMode()</span> {");
      $("#timeAttackModeDescription").html(timeAttackModeDescription);
      $("#endTimeAttackModeDescription").html("}");
      $("#startAttention").html("<span class='lightgreen'>int</span> <span class='skyblue'>Attention()</span> {");
      $("#attention").html(attention);
      $("#endAttention").html("}");
      $("#fileList").empty();
      localStorage.setItem('lang', "C");
      setFileList();
    });
    //Cをデフォルトで選択する
    $("#C").click();
    $("#C").css('border-bottom', 'none').css('background-color', '#282C34');

    $("#Java").click(function() {
      $("#startCatchCopy").html("<span class='pink'>class</span> <span class='skyblue'>Catchcopy()</span> {");
      $("#catchCopy").html(catchCopy);
      $("#endCatchCopy").html("}");
      $("#startDescription").html("<span class='pink'>class</span> <span class='skyblue'>Description()</span> {");
      $("#description").html(description);
      $("#endDescription").html("}");
      $("#startPracticeModeDescription").html("<span class='pink'>class</span> <span class='skyblue'>PracticeMode()</span></span> {");
      $("#practiceModeDescription").html(practiceModeDescription);
      $("#endPracticeModeDescription").html("}");
      $("#startTimeAttackModeDescription").html("<span class='pink'>class</span> <span class='skyblue'>timeAttackMode()</span> {");
      $("#timeAttackModeDescription").html(timeAttackModeDescription);
      $("#endTimeAttackModeDescription").html("}");
      $("#startAttention").html("<span class='pink'>class</span> <span class='skyblue'>Attention()</span> {");
      $("#attention").html(attention);
      $("#endAttention").html("}");
      $("#fileList").empty();
      localStorage.setItem('lang', "Java");
      setFileList();
    });

    $("#PHP").click(function() {
      $("#startCatchCopy").html("<? php");
      $("#catchCopy").html(catchCopy);
      $("#endCatchCopy").html(">");
      $("#startDescription").html("<? php");
      $("#description").html(description);
      $("#endDescription").html(">");
      $("#startPracticeModeDescription").html("<? php");
      $("#practiceModeDescription").html(practiceModeDescription);
      $("#endPracticeModeDescription").html(">");
      $("#startTimeAttackModeDescription").html("<? php");
      $("#timeAttackModeDescription").html(timeAttackModeDescription);
      $("#endTimeAttackModeDescription").html(">");
      $("#startAttention").html("<? php");
      $("#attention").html(attention);
      $("#endAttention").html(">");
      $("#fileList").empty();
      localStorage.setItem('lang', "PHP");
      setFileList();
    });

    $("#Others").click(function() {
      $("#startDescription").html("Description");
      $("#description").html(description);
      $("#endDescription").html("");
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
