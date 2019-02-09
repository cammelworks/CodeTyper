'use strict';
{
  $(function() {
    $("#C").click(function() {
      console.log("C clicked");
      $("#startDescription").text("int 説明() {");
      $("#endDescription").text("}");
    });
    $("#Java").click(function() {
      console.log("Java clicked");
      $("#startDescription").text("class 説明() {");
      $("#endDescription").text("}");
    });
    $("#PHP").click(function() {
      console.log("PHP clicked");
      $("#startDescription").text("<? php");
      $("#endDescription").text(">");
    });
    $("#Others").click(function() {
      console.log("Others clicked");
      $("#startDescription").text("説明");
      $("#endDescription").text("");
    });
  });
}
