AlbumsColl = new Meteor.Collection("albums");

Router.map(function() {
  this.route('home', {path: '/'})
  this.route('add');
  this.route('edit', {
    path: '/edit/:_id',
    data: function(){
      return AlbumsColl.findOne(this.params._id);
    },
  });
  this.route('tag', {
    path: '/tag/:tag',
    data: function(){
      return AlbumsColl.findOne({tag:this.params.tag});
    },
  });
});
 
// - - - - - - - -
// Events

Template.album.events({
  'click .album > a.link': function () {
    console.log("play", this._id);
    Meteor.call("playAlbum", this._id);
  },
  'click .edit': function () {
    console.log("edit", this._id);
    Router.go("/edit/" + this._id);
  },
  'click .remove': function () {
    console.log("remove", this._id);
    if (confirm("are you sure?"))
      Meteor.call("removeAlbum", this._id);
  },
});

function toggleClass(el, className, toggle){
  el.className = (el.className.replace(new RegExp(className, "g"), " ") + (toggle ? " " + className : "")).replace(/\s+/g, " ");
}

Template.home.events({
  'keyup #filter': function (event) {
    var filter = new RegExp(event.target.value, "gi");
    Array.prototype.slice.call(document.getElementsByClassName("album")).map(function(alb){
      var elTitle = alb.getElementsByClassName("title")[0];
      var elArtist = alb.getElementsByClassName("artist")[0];
      var match = (elTitle.innerHTML + " " + elArtist.innerHTML).match(filter);
      toggleClass(alb, "hidden", !match);
    });
  },
});

// - - - - - - - -
// Population

Template.albums.items = function(){
    var criteria = {};
    var tag = Router.current().params.tag;
    if (tag)
      criteria.tags = tag;
    return AlbumsColl.find(criteria, {sort: {t: -1}});
};

Template.tag.params = function(){
    return Router.current().params;
};

Template.albumFields.params = function() {
  return Router.current().params;
}

// - - - - - - - -
// Album Manipulation

function createAlbumFromFields(form){
  var albumData = {};
  Array.prototype.slice.call(form.getElementsByTagName("input")).map(function(input){
    albumData[input.name] = input.value;
  });
  return webAlbumDetector.createAlbum(albumData);
}

function responseHandler(error, res){
  res = res || {error: "invalid response"};
  if (error || res.error)
    alert(error || res.error);
  else {
    console.log('returned', res);
    Router.go("home");
  }
}

Template.add.events({
    'click input.submit' : function(event){
        event.preventDefault();
        var album = createAlbumFromFields(document.getElementById("addContainer"));
        Meteor.call("addAlbum", album, responseHandler);
    }
});

Template.edit.events({
    'click input.submit' : function(event){
        event.preventDefault();
        var album = createAlbumFromFields(document.getElementById("editContainer"));
        album._id = Router.current().params._id;
        console.log(album._id);
        Meteor.call("saveAlbum", album, responseHandler);
    }
});
