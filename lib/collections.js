Images = new Mongo.Collection("images");

// Set up security on Images collection
// this fx gets called everytime someone tries to inser an image
// the console msg goes to the server only
// return set to false means the user is not allowed to insert the image
Images.allow({
    insert:function(userId, doc) {
        console.log('testing security on image insert');
        return false;
    }
})

