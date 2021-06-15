function fpAgentLoaded() {
  var match = location.href.match(/articles\/(\d+)$/)
  if(!match){
    return
  }
  FingerprintJS.load({
    token: 'paywall',
    endpoint: 'https://f.fingerprintjs.com/',
  })
    .then(function (fp) {
      return fp.get()
    })
    .then(function (res) {
      var query = {
        visitorId: res.visitorId,
        articleId: match[1]
      };
      $.getJSON("/paywall", query, function (res) {
        if(res.enabled){
          $("#paywall-modal").modal({ keyboard: false, show: true, backdrop: "static" });
        }
      });
    })
}
