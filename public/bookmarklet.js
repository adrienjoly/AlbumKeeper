// javascript:(function()%7Bdocument.body.appendChild(document.createElement('script')).src='http://localhost:3000/bookmarklet.js?'+(new%20Date()).getTime();;%7D)();

if (undefined == window.console)
  console = {log:function(){}};

console.log("AlbumKeeper bookmarklet");

(function(){

  var DIV_ID = 'akpBookmarklet';

  var onkeydownBackup = window.document.onkeydown;
  window.document.onkeydown = function(e){
    if ((e || event).keyCode == 27) {
      document.body.removeChild(document.getElementById(DIV_ID));
      window.document.onkeydown = onkeydownBackup;
    }
  };

  function loadJS(src, cb){
    var dep = document.createElement('script');
    dep.onload = cb;
    dep.src = src;
    document.body.appendChild(dep);
  }

  function loadCSS(src){
    var inc = document.createElement("link");
    inc.rel = "stylesheet";
    inc.type = "text/css";
    inc.href = src;
    document.head.appendChild(inc);
  }

  function htmlEntities(str) {
    return String(str || "").replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // minimal template engine, http://mir.aculo.us/2011/03/09/little-helpers-a-tweet-sized-javascript-templating-engine/
  function render(s,d){
    for(var p in d)
      s=s.replace(new RegExp('{'+p+'}','g'), htmlEntities(d[p]));
    return s.replace(/\{\w*\}/gi, ""); // remove un-populated slots
  }

  function renderAlbum(alb){
    alb.reqParams = [
      ["t", alb.title],
      ["a", alb.artist],
      ["u", alb.url],
      ["i", alb.img],
    ].map(function(v){
      return v[0] + "=" + encodeURIComponent(v[1]);
    }).join("&");
    return render([
      '<li>',
      '<div class="thumb" style="background-image:url({img})"></div>',
      '<a href="http://localhost:3000/add?{reqParams}" target="akpAddAlb">+</a>',
      '<p class="akpTit">{title}</p>',
      '<p class="akpArt">{artist}</p>',
      '</li>',
      ].join("\n"), alb);
  }

  (function init(){
    document.body.className = (document.body.className || "") + " akpParent";
    var div = document.getElementById(DIV_ID);
    if (!div) {
      document.body.appendChild(document.createElement('div')).id = DIV_ID;
      div = document.getElementById(DIV_ID);
    }
    div.innerHTML = [
      '<div class="akpHead">',
      'AlbumKeeper',
      '</div>',
      '<div class="akpBody">',
        '<ul></ul>',
      '</div>'
    ].join('\n');
    loadCSS('http://localhost:3000/bookmarklet.css?' + Date.now())
    loadJS('http://localhost:3000/lib/webAlbum.js?' + Date.now(), function(){
      //console.log("yeah!", webAlbumDetector);
      var list = div.getElementsByTagName("ul")[0];
      var albums = webAlbumDetector.findAlbumsFromNode(document.body);
      console.log("found albums", albums);
      for (var i in albums)
        list.innerHTML += renderAlbum(albums[i]);
    });
  })();

  /*
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  */

})();