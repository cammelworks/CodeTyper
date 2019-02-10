'use strict';
{   
    //ユーザのログイン状態の確認
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $("#Uname").html(user.displayName);
        } else {
            $("#Uname").html("GUEST");;
        }
    });   
}