var ui = new firebaseui.auth.AuthUI(login_base.auth());

var uiConfig = {
  callbacks: {
    signInSuccess: function(currentUser, credential, redirectUrl) {
      // サインイン成功時のコールバック関数
      // 戻り値で自動的にリダイレクトするかどうかを指定
      return true;
    },
    uiShown: function() {
      // FirebaseUIウィジェット描画完了時のコールバック関数
      // 読込中で表示しているローダー要素を消す
      document.getElementById('loader').style.display = 'none';
    }
  },
  // リダイレクトではなく、ポップアップでサインインフローを表示
  signInFlow: 'popup',
  signInSuccessUrl: './index.html',
  signInOptions: [
    // サポートするプロバイダ(メールアドレス)を指定
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>'
};

ui.start('#firebaseui-auth-container', uiConfig);
