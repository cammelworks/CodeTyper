'use strict';
{
    //FileAPIに対応しているかの確認
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // ブラウザはFileAPIに対応しています！
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    
    var storageRef = firebase.storage().ref();
    
    var inputFile = document.getElementById('selfile');
 
    function upload2fire(ev) {
        var target = ev.target;
        var files = target.files;
        console.log(files);
        //ここで名前付け
        for(var i = 0, f; f = files[i]; i++){
            var fileRef  = storageRef.child(files[i].name+files[i].type);
            
            fileRef.put(files[i]).then(function(snapshot) {
                console.log('Uploaded a file!');
            });
        }
    }
    inputFile.addEventListener('change', upload2fire, false);
}