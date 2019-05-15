Images = new Mongo.Collection("images");


if (Meteor.isClient) {
  // Add scroll event to set infinite scroll
  // Limit numbers of images ("imageLimit" is then used as a parameter to Images.find() below)
  Session.set("imageLimit", 8);
  // Set var to help us track if user's scroll is near bottom of window
  lastScrollTop = 0;

  // Meteor doesn't have a good way of doing infinite scroll, so use jQuery
  $(window).scroll(function(event){
    // test if we are near the bottom of the window
    if($(window).scrollTop() + $(window).height() > $(document).height()- 100){
      // find out where we are in the page
      var scrollTop = $(this).scrollTop();
      // test if we are scrolling down
      if(scrollTop > lastScrollTop) {
        // yes, we're heading down to the bottom of the page ...
        // so load 4 more images
        Session.set("imageLimit", Session.get("imageLimit") + 4);
      }
      lastScrollTop = scrollTop;
    }
  });

  // Modify signup field form to include a username
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });
  //template.images here is the same images name we have in the html file
  // After adding rating feature, add ability to sort by highest rating
  // Empty bracket means: find everything
  // rating:-1 means sort from highest to lowest
  Template.images.helpers({
    images:function(){
      if(Session.get("userFilter")){
        // if user set a filter, change which image is sent back
        // createdBy:Session.get("userFilter") is a Mongo filter
        return Images.find({createdBy:Session.get("userFilter")}, {sort:{createdOn:-1, rating:-1}});
        }
        else{
          return Images.find({}, {sort:{createdOn:-1, rating:-1}, limit:Session.get("imageLimit")});
        }
      },
      filtering_images:function(){
        if(Session.get("userFilter")){
          return true;
        }
        else{
          return false;
        }
      },
    getFilteredUser:function(){
      if(Session.get("userFilter")){
        var user = Meteor.users.findOne(
          {_id:Session.get("userFilter")});
        return user.username;
      }
      else {
        return false;
      }
    },
    getUser:function(user_id){
      var user = Meteor.users.findOne({_id:user_id});
      if(user){
        return user.username;
      }
      else {
        return "anon"
      }
    }
  });
  Template.body.helpers({username:function(){
    if(Meteor.user()){
      return Meteor.user().username
    }
    else {
      return "anonymous internet user!"
    }
  }}); 

   Template.images.events({
    'click .js-image':function(event){
        $(event.target).css("width", "50px");
    }, 
    'click .js-del-image':function(event){
      // get and store the mongo id for each image
       var image_id = this._id;
       console.log(image_id);
        
        // use jquery to hide the image component
        // then remove it at the end of the animation
        //  Add a mongo filter {"_id":image_id} to delete anything that matches that filter 
       $("#"+image_id).hide('slow', function(){
        Images.remove({"_id":image_id});
       })  
    }, 
    'click .js-rate-image':function(event){
      // find out which star user clicked on
      // with the package we're using, we need to access event.currentTarget
      // instead of event.target to get access to the db
      var rating = $(event.currentTarget).data("userrating");
      console.log("My rating is: "+rating);
      // find out which image is being rated
      var image_id = this.id;
      console.log("The image ID is: "+image_id);

      // pass the rating to the db and store it
      // the db function .update takes 2 arguments
      Images.update({_id:image_id}, {$set: {rating:rating}});
    }, 
    'click .js-show-image-form':function(event){
      $("#image_add_form").modal('show');
    },
    // when user clicks on createdBy, only images by the user clicked are shown
    'click .js-set-image-filter':function(event){
      Session.set('userFilter', this.createdBy);
    },
    // when user wants to clear her filter
    'click .js-unset-image-filter':function(event){
      Session.set('userFilter', undefined);
    }
   });

  Template.image_add_form.events({
    'submit .js-add-image':function(event){
      var img_src, img_alt;
      img_src = event.target.img_src.value;
      img_alt = event.target.img_alt.value;
      console.log("src: "+img_src+" alt:"+img_alt);

      // Add image being submitted to the db, if user is signed in
      // Attach username to the image submitted by the user
      if (Meteor.user()){
        Images.insert({
          img_src:img_src, 
          img_alt:img_alt, 
          createdOn:new Date(),
          createdBy:Meteor.user()._id
        });
      }
      // dismiss the modal
       $("#image_add_form").modal('show');
      return false;
    }
  });
}
