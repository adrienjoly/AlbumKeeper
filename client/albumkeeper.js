AlbumsColl = new Meteor.Collection("albums");

Router.map(function() {
  this.route('home', {path: '/'})
  this.route('add');
});
 
// - - - - - - - -
// Album

Template.album.events({
  'click a': function () {
    console.log("play", this._id);
    Meteor.call("playAlbum", this._id);
  },
  'click .remove': function () {
    console.log("remove", this._id);
    if (confirm("are you sure?"))
      Meteor.call("removeAlbum", this._id);
  },
});

// - - - - - - - -
// Add Album screen

Template.addAlbum.events({
    'click input.submit' : function(event){
        event.preventDefault();
        //var albumUrl = document.getElementById("albumUrl").value;
        var albumData = {};
        var inputs = document.getElementsByClassName("container")[1].getElementsByTagName("input");
        Array.prototype.slice.call(inputs).map(function(input){
          albumData[input.name] = input.value;
        });
        //console.log(albumData);
        var album = webAlbumDetector.createAlbum(albumData);
        //console.log(album);
        Meteor.call("addAlbum", album, function(error, res){
          res = res || {error: "invalid response"};
          if (error || res.error)
            alert(error || res.error);
          else
            console.log('added album', res);
        });
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
