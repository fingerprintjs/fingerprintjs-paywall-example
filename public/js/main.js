var fpLoaded = function (fp) {
  var match = location.href.match(/articles\/(\d+)$/)
  if(!match){
    return
  }
  fp.get().then(function (res) {
    var query = {
      visitorId: res.visitorId,
      articleId: match[1]
    };
    $.getJSON("/paywall", query, function (res) {
      if(res.enabled){
        window.location.replace('https://dashboard.fingerprintjs.com/?utm_source=paywall');
      }
    });
  });
}
