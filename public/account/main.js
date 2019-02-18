'use strict';
{
    //ユーザの管理JQuery
    $(function() {
      //画面中央を計算する関数    
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
      //サインアウト
      $("#signout").click(function(){
        //サインアウト処理  
        firebase.auth().signOut();
        //表示
        $(".closeButton").removeClass("hidden");  
        //非表示
        $("#userInfo").addClass("hidden");
        //マスクを適用
        $("body").append('<div id="mask"></div>');
        //画面中央を計算する関数を実行
        modalResize();
        //モーダルウィンドウの表示
        $("#modalAuth,#mask").fadeIn("slow");
          
        $("#userInfoTitle").html("サインアウトしました。");  
        //画面中央を計算する関数
        $(window).resize(modalResize);
        //closeをクリックしたら閉じる
        $(".close").click(function() {
          $("#modal, #modalAuth, #mask").fadeOut("slow", function() {
            $("#mask").remove();
            window.location.href = '../index.html';   
          })
        });   
      });
        
      //アカウントページへの移動
      $("#home").click(function(){
         window.location.href = '../index.html'; 
      }); 
    });    
    
    //ログインの確認
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          $("#Uname").html(user.displayName);
      } else {
          //GUESTのとき
      }
    });    
}