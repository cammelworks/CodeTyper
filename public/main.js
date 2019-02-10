'use strict';
{
    var login = document.getElementById("login");
    var signup = document.getElementById("signup");
    var signout = document.getElementById("signout");
    
    //新規ユーザの登録
    //JQueryでモーダルウィンドウの実装
    $(function() {
      $("#signup").click(function() {
        //マスクを適用
        $("body").append('<div id="mask"></div>');

        //画面中央を計算する関数を実行
        modalResize();
        //モーダルウィンドウの表示
        $("#modalAuth,#mask").fadeIn("slow");
          
        //okをクリックしたら登録して閉じる
        $("#ok").click(function(){
            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function(error) {
                // エラー処理
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode+':'+errorMessage);
            });
            
            ///////////////////////////
            //ここでユーザ名も登録したい///
            //////////////////////////
            
            //閉じる
            $("#modalAuth, #mask").fadeOut("slow", function() {
              $("#mask").remove();
            })
        });  
        //closeをクリックしたら閉じる
        $("#close").click(function() {
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
    });    
    
    //常に表示されているフォーム
    var logINemail = document.getElementById("logINemail");
    var logINpassword = document.getElementById("logINpassword");
    
    //既存ユーザのログイン
    login.addEventListener('click', function(e){
    
        var email = logINemail.value;
        var password = logINpassword.value;
    
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // エラー処理
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode+':'+errorMessage);
        });
    });

    //サインアウト
    signout.addEventListener('click', function(e){
        firebase.auth().signOut();
    });

    //ユーザのログイン状態の確認
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            //非表示
            signup.classList.add("hidden");
            login.classList.add("hidden");
            logINemail.classList.add("hidden");
            logINpassword.classList.add("hidden");
            
            //サインアウトボタンの表示
            signout.classList.remove("hidden");
            
            if(user.displayName === null){
                //SignUpモーダルを閉じた後リロードしないといけないバグ
                
                //ユーザ名の登録
                var username = document.getElementById("username").value;
                user.updateProfile({
                    displayName: username
                }).then(function(error){
                    //エラー処理
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode+':'+errorMessage);
                }); 
                console.log("name added!");
            }else{
               $("#Uname").html(user.displayName); 
            }
        } else {
            //ログインしていない場合
            signout.classList.add("hidden");
            
            signup.classList.remove("hidden");
            login.classList.remove("hidden");
            logINemail.classList.remove("hidden");
            logINpassword.classList.remove("hidden");
            // ユーザがいなかったらGUEST
            $("#Uname").html("GUEST");
        }
    });
    /*
    //認証状態の永続性の変更
    login_base.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function() {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });
    */
    
    
}