'use strict';
{
    //FileAPIに対応しているかの確認
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // ブラウザはFileAPIに対応しています！
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    //ファイル名（拡張子なし取得用変数）
    var reg=/(.*)(?:\.([^.]+$))/;
    
    var storageRef = firebase.storage().ref();
    var inputFile = document.getElementById('selfile');
    function upload2fire(ev) {
        var target = ev.target;
        var files = target.files;
        //ここで名前付け
        for(var i = 0, f; f = files[i]; i++){
            //storage用(拡張子ありファイル名)
            var filesrc = files[i].name;
            //database用(拡張子なしファイル名)
            var filename = filesrc.match(reg)[1];
            var fileRef  = storageRef.child(filesrc);
            var databaseRef = firebase.database().ref("/c/"+filename);
            //set()で常に上書き
            //databaseへのアップロード
            databaseRef.set({
                filename: filesrc
            });
            console.log('Uploaded to Database!');
            //storageへのアップロード
            fileRef.put(files[i]).then(function(snapshot) {
                console.log('Uploaded to Firestore!');
            });
            
        }
    }
    inputFile.addEventListener('change', upload2fire, false);
}