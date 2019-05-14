Images = new Mongo.Collection("images");


if (Meteor.isClient) {
  //template.images here is the same images name we have in the html file
  // After adding rating feature, add ability to sort by highest rating
  // Empty bracket means: find everything
  // rating:-1 means sort from highest to lowest
  Template.images.helpers({images: Images.find({}, {sort:{createdOn:-1, rating:-1}})
  }); 

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
    }

   });

  Template.image_add_form.events({
    'submit .js-add-image':function(event){
      var img_src, img_alt;
      img_src = event.target.img_src.value;
      img_alt = event.target.img_alt.value;
      console.log("src: "+img_src+" alt:"+img_alt);

      // Add image being submitted to the db
      Images.insert({
        img_src:img_src, 
        img_alt:img_alt, 
        createdOn:new Date()
      });
      // dismiss the modal
       $("#image_add_form").modal('show');
      return false;
    }
  });
}
