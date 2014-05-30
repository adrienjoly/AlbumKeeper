AlbumsColl = new Meteor.Collection("albums");

Router.map(function() {
  this.route('home', {path: '/'})
  this.route('add');
});
 
// - - - - - - - -
// Album

Template.album.events({
  'click a.link': function () {
    console.log("play", this._id);
    Meteor.call("playAlbum", this._id);
  },
  'click a.remove': function () {
    console.log("remove", this._id);
    Meteor.call("removeAlbum", this._id);
  },
});

// - - - - - - - -
// Add Album screen

Template.addAlbum.events({
    'click input.submit' : function(event){
        event.preventDefault();
        var albumUrl = document.getElementById("albumUrl").value;
        Meteor.call("addAlbum", albumUrl, function(error, albumId){
          alert('added album with Id ' + albumId);
        });
        document.getElementById("albumUrl").value = "";
    }
});

Template.addAlbum.params = function() {
  return Router.current().params;
}

// - - - - - - - -
// Main screen

Template.albums.items = function(){
    return AlbumsColl.find({},{sort:{'t':-1}});
};
