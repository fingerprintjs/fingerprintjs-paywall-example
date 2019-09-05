var fpLoaded = function (fp) {
  var match = location.href.match(/articles\/(\d+)$/)
  if(!match){
    return
  }
  fp.send().then(function (res) {
    var query = {
      visitorId: res.visitorId,
      articleId: match[1]
    };
    $.getJSON("/paywall", query, function (res) {
      if(res.enabled){
        $("#paywall-modal").modal({ keyboard: false, show: true, backdrop: "static" });
      }
    });
  });
}
$("#subscribe-btn").on("click", function () {
  $("#paywall-1").addClass("hide");
  $("#paywall-2").removeClass("hide");
  setTimeout(function(){
    $("#contact-email").focus();
  },7000);
});

$("#contact-form").on("submit", function (e) {
  var $submit = $("#contact-submit");
  $submit.prop("disabled", true);
  e.preventDefault();
  var email = $("#contact-email").val();
  if (!email) {
    return alert("Please enter your email");
  }
  var payload = { email: email, name: email, website: email, comment: 'paywall.fpjs.dev' };
  $.ajax({
    url: "https://admin.fpjs.io/leads",
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(payload),
    success: function () {
      $('#paywall-modal').modal('hide');
      setTimeout(() => { alert('Thanks, we received your data') }, 300);
    },
  }).catch(function () {
    alert("Error occurred, contact us at: support@fpjs.io");
  }).always(function () {
    $submit.prop("disabled", false);
  });
});