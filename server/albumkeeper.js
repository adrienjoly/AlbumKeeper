AlbumsColl = new Meteor.Collection("albums");
 
Meteor.startup(function () {
  // code to run on server at startup
});

Meteor.methods({
  addAlbum: function(album){
    console.log('Adding Album', album);
    var res = webAlbumDetector.createAlbum(album).consolidate();
    console.log('consolidated', res);
    return !res || res.error ? res : AlbumsColl.insert(res);
  },
  removeAlbum: function(id){
    console.log("remove album", id);
    AlbumsColl.remove(id);
  },
  playAlbum: function(id){
    console.log("play album", id);
    AlbumsColl.update(id, {$inc: {'nbP': 1}});
  },
});

// based on this guide: https://www.openshift.com/blogs/day-15-meteor-building-a-web-app-from-scratch-in-meteor

// To check the data base:
// $ meteor mongo

// To deploy the Meteor application on OpenShift: https://www.openshift.com/blogs/cloudy-with-a-chance-of-meteorjs

// or:
// $ meteor deploy albumkeeper
// => http://albumkeeper.meteor.com