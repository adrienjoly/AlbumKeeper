AlbumsColl = new Meteor.Collection("albums");
 
Template.albums.items = function(){
    return AlbumsColl.find({},{sort:{'t':-1}});
};

Template.album.events({
  'click a.link': function () {
    console.log("play", this._id);
    //Session.set("selected_question", this._id);
    //if(Meteor.userId()){
      //var questionId = Session.get('selected_question');
      Meteor.call("playAlbum", this._id);
    //}
  },
  'click a.remove': function () {
    console.log("remove", this._id);
    //Session.set("selected_question", this._id);
    //if(Meteor.userId()){
      //var questionId = Session.get('selected_question');
      Meteor.call("removeAlbum", this._id);
    //}
  },
});

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