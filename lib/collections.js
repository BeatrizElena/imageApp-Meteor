Images = new Mongo.Collection("images");

// Set up security on Images collection
// this fx gets called everytime someone tries to inser an image
// the console msg goes to the server only
// return set to true means the user is allowed to insert or delete the image
Images.allow({
    // Enable inser
    insert:function(userId, doc) {
        console.log('testing security on image insert');
        return true;
    },
    // enable delete
    remove:function(userId, doc) {
        return true;
    },
    // enable update
    update:function(userId, doc) {
        return true;
    }
})

