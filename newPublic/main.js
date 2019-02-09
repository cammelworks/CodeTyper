'use strict';
{
  $(function() {
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
  });
}
