Images = new Mongo.Collection("images");

// Set up security on Images collection
// this fx gets called everytime someone tries to inser an image
// the console msg goes to the server only
// return set to true means the user is allowed to insert or delete the image
Images.allow({
    // Enable insert only if user is logged in and if her userId == userId coming from
    // the doc (doc.createdBy)
    insert:function(userId, doc) {
        // check if user is logged in
        if(Meteor.user()){ // if user is logged in
            console.log(doc);  
            // Force the image to be owned by the user
            doc.createdBy = userId;
            // if user tries to manipulate userId and insert images into another user's account
            // don't allow her, return false
            // else, if the user is logged in, the image has the correct userId
            if(userId != doc.createdBy) {
                return false;
            }
            else {
                return true;
            }
        }
        else { // if user is not logged in
            return false;
        }

    },
    // enable delete
    remove:function(userId, doc) {
        return doc.createdBy === userId;
    },
    // enable update
    update:function(userId, doc) {
        if(doc.createdBy === userId){
            return true;
        }
        else {
            return false
        }
    }
})

