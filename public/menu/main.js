'use strict';
{   
    /* 
    var user = localStorage.getItem('userEmail'); 
    //var user = firebase.auth().currentUser;
    //var user = loginAuth.currentUser;
    console.log(user);
    */
    
    //ユーザのログイン状態の確認
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log(user.email);
        } else {
            // No user is signed in.
            console.log("No user.");
        }
    });   
}