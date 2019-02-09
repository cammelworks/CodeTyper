'use strict';
{   
    //ユーザのログイン状態の確認
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log(user.displayName);
        } else {
            // No user is signed in.
            console.log("No user.");
        }
    });   
}