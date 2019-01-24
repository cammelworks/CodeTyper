'use strict'
{
    var storageRef = firebase.storage().ref();
    // Create a reference to the file whose metadata we want to retrieve
    var fileRef = storageRef.child('.c');
    // Get metadata properties
    fileRef.getMetadata().then(function(metadata) {
        // Metadata now contains the metadata for 'images/forest.jpg'
        console.log(metadata);
    }).catch(function(error) {
    // Uh-oh, an error occurred!
    });
}