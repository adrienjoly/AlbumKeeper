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
    "bcCol": new (function BandcampCollectionAlbumDetector(){
      this.findAlbumsFromNode = function(node){
        var albums = [];
        var cards = Array.prototype.slice.call(node.getElementsByClassName("collection-item-container"));
        for (var i in cards)
          if (cards[i].getAttribute("data-itemtype") === "album") {
            var album = new WebAlbum();
            console.log(cards[i].getElementsByClassName("collection-item-title")[0])
            album.title = getNodeText(cards[i].getElementsByClassName("collection-item-title")[0]);
            album.artist = getNodeText(cards[i].getElementsByClassName("collection-item-artist")[0]).replace("by ", "");
            album.url = cards[i].getElementsByClassName("item-link")[0].getAttribute("href");
            album.img = cards[i].getElementsByTagName("img")[0].getAttribute("src");
            albums.push(album);
          }
        return albums;
      };
    })(),
    "bc": new (function BandcampAlbumDetector(){
      this.findAlbumsFromNode = function(node){
        var album = new WebAlbum();
        Array.prototype.slice.call(node.getElementsByTagName("div")).map(function(div){
          var type = div.getAttribute("itemtype");

          // TODO: parse embedData (js var) from page's DOM

          if (div.id == "tralbumArt")
            album.img = div.getElementsByTagName("img")[0].getAttribute("src");
          else if (type == "http://schema.org/MusicGroup")
            album.artist = div.getElementsByTagName("meta")[0].getAttribute("content");
          else if (type == "http://schema.org/MusicAlbum") {
            var trackTitle = div.getElementsByClassName("trackTitle")[0];
            album.title = trackTitle ? getNodeText(trackTitle) : div.getElementsByTagName("meta")[0].getAttribute("content");
          }
        });
        return album.title && album.artist ? [album] : [];
      };
    })(),
  };

  function WebAlbum(){
    this.uri = null; // canonical source-based identifier of the album (format: `<source_id>/<album_id>`)
    this.url = null; // url of the album
    this.name = null; // compound name of the album (artist + title + ...)
    this.title = null; // title of the album (optional)
    this.artist = null; // name of the artist of this album (optional)
    this.year = null; // year of the release of this album (optional)
    this.img = null; // url of the album's cover art (optional)
    this.desc = null;  // personal description (and #tags) of the album (optional)
    this.str = null; // url of the stream that can be played (optional)
    this.src = null; // url on which the album was found / extracted from (optional)
    this.nbP = 0; // number of times this album was played
    this.priv = false; // album can only be played by user (authentication needed)
    //this.tracks = [{title,length,uri,str}];
  }
  WebAlbum.prototype.play = function(){}; // plays the albums's stream
  WebAlbum.prototype.getState = function(){}; // 0: empty (not defined), 5: valid (missing some data), 10: complete
  WebAlbum.prototype.consolidate = function(){
    this.name = this.name || (this.artist + " - " + this.title);
    return this;
  };

  this.findAlbumsFromNode = function(node){
    var albums = [];
    for (var i in SOURCES)
      albums = albums.concat(SOURCES[i].findAlbumsFromNode(node) || []);
    return albums;
  };

  this.createAlbum = function(map){
    var album = new WebAlbum();
    for (var f in map)
      if (album.hasOwnProperty(f))
        album[f] = map[f];
    return album;
  }

})();
