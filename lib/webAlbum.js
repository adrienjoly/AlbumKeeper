webAlbumDetector = new (function WebAlbumDetector(){

  function getNodeText(node){
    return node.innerText || node.textContent;
  }

  var SOURCES = {
    "gm": new (function GoogleMusicAlbumDetector(){
      this.findAlbumsFromNode = function(node){
        var albums = [];
        var cards = node.getElementsByClassName("card");
        cards = Array.prototype.slice.call(cards);
        for (var i in cards)
          if (cards[i].getAttribute("data-type") === "album") {
            var album = new WebAlbum();
            album.title = getNodeText(cards[i].getElementsByClassName("title")[0]);
            album.artist = getNodeText(cards[i].getElementsByClassName("sub-title")[0]);
            album.url = "https://play.google.com/music#/album/" + cards[i].getAttribute("data-id");
            album.img = cards[i].getElementsByTagName("img")[0].getAttribute("src");
            album.priv = true;
            albums.push(album);
          }
        return albums;
      };
    })(),
  };

  function WebAlbum(){
    this.uri = ""; // canonical source-based identifier of the album (format: `<source_id>/<album_id>`)
    this.url = ""; // url of the album
    this.name = ""; // compound name of the album (artist + title + ...)
    this.title = ""; // title of the album (optional)
    this.artist = ""; // name of the artist of this album (optional)
    this.year = ""; // year of the release of this album (optional)
    this.img = ""; // url of the album's cover art (optional)
    this.str = ""; // url of the stream that can be played (optional)
    this.src = ""; // url on which the album was found / extracted from (optional)
    this.nbP = 0; // number of times this album was played
    this.priv = false; // album can only be played by user (authentication needed)
    //this.tracks = [{title,length,uri,str}];
  }
  WebAlbum.prototype.play = function(){}; // plays the albums's stream
  WebAlbum.prototype.getState = function(){}; // 0: empty (not defined), 5: valid (missing some data), 10: complete
  WebAlbum.prototype.populate = function(){
    this.name = this.name || (this.artist + " - " + this.title);
  };

  this.findAlbumsFromNode = function(node){
    return SOURCES["gm"].findAlbumsFromNode(node);
  };

})();
