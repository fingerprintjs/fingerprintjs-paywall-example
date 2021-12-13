function fpAgentLoaded() {
  var match = location.href.match(/articles\/(\d+)$/)
  if(!match){
    return
  }
  FingerprintJS.load({
    token: fpjsToken,
    endpoint: 'https://g.fingerprintjs.com/',
    tlsEndpoint:'https://demo.fpaux.net/',
    debug: FingerprintJS.makeRemoteDebugger({
      clientId: fpjsRollbarClientId,
      token: fpjsRollbarToken
    })
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
