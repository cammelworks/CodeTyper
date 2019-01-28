'use strict';
{
    //FileAPIに対応しているかの確認
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // ブラウザはFileAPIに対応しています！
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    
    var storageRef = firebase.storage().ref();
    var databaseRef = firebase.database().ref("/c");
    var inputFile = document.getElementById('selfile');
    console.log(databaseRef.orderByValue());
    function upload2fire(ev) {
        var target = ev.target;
        var files = target.files;
        console.log(files);
        //ここで名前付け
        for(var i = 0, f; f = files[i]; i++){
            var fileRef  = storageRef.child(files[i].name+files[i].type);
            //データベースに同じファイルがあるか判定する。
            var checkRef = databaseRef.orderByValue().equalTo(files[i].name);
            if(checkRef === null){
                databaseRef.push({filename: files[i].name});
                console.log('Uploaded to Database!');
                console.log(checkRef);
            }else{
                console.log('That name already exists.');
                //alertで表示させたい
            }
            
            fileRef.put(files[i]).then(function(snapshot) {
                console.log('Uploaded to Firestore!');
            });
        }
    }
    inputFile.addEventListener('change', upload2fire, false);
}