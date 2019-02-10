'use strict';
{
  $(function() {
    //言語によって説明文のレイアウトを変える
    var description = $("#description").text();
    console.log(description);
    $("#C").click(function() {
      console.log("C clicked");
      $("#startDescription").text("int 説明() {");
      $("#description").text(description);
      $("#endDescription").text("}");
    });
    $("#Java").click(function() {
      console.log("Java clicked");
      $("#startDescription").text("class 説明() {");
      $("#description").text("フィールド " + description);
      $("#endDescription").text("}");
    });
    $("#PHP").click(function() {
      console.log("PHP clicked");
      $("#startDescription").text("<? php");
      $("#description").text(description);
      $("#endDescription").text(">");
    });
    $("#Others").click(function() {
      console.log("Others clicked");
      $("#startDescription").text("説明");
      $("#description").text(description);
      $("#endDescription").text("");
    });

    //選択された言語タグのスタイルを変える
    var languageList = $('.languages-container li');
    languageList.click(function(){
      languageList.css('border-bottom', '1px solid #181A1F').css('background-color', '#21252B');
      $(this).css('border-bottom', 'none').css('background-color', '#282C34');
    });

    //行番号の表示
    var line = 30;
    for(var i = 1; i <= line; i++){
      var lineNumber = $("#lineNumber").html();
      $("#lineNumber").html(lineNumber + i + "<br>");
    }
  });
}
