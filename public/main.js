'use strict';
{
    var login = document.getElementById("login");
    var signup = document.getElementById("signup");
    var signout = document.getElementById("signout");
    
    var ok = document.getElementById("ok");
    //var cancel = document.getElementById("cancel");
    
    //var mask = document.getElementById("mask");
    var modal = document.getElementById("authModal");

    //新規ユーザの登録
    signup.addEventListener("click", function() {
      //mask.classList.remove("hidden");
      modal.classList.remove("hidden");
    });
    
    /*
    cancel.addEventListener("click", function() {
      location.reload();
    });

    mask.addEventListener("click", function() {
      cancel.click();
    });*/

    
    ok.addEventListener('click', function(e){
    
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(error) {
            // エラー処理
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode+':'+errorMessage);
        });
    });

    //既存ユーザのログイン
    login.addEventListener('click', function(e){
    
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
    
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
            if(user.displayName === null){
                //ユーザ名の登録
                var username = document.getElementById("username").value;
                user.updateProfile({
                    displayName: username
                }).then(function(error){
                    // エラー処理
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode+':'+errorMessage);
                }); 
                console.log("name added!");
            }else{
               console.log(user.displayName); 
            }
        } else {
            // No user is signed in.
            console.log("No user.");
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