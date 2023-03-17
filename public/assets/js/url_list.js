function getTokeUrlList(e) {
  e.preventDefault();

  const $apiToken = $("#api-token");
  const $errorInfo = $(".error-info");
  const $urlList = $("#url-list");
  
  const apiToken = $apiToken.val();
  if (!apiToken) {
    $errorInfo.html("* Please enter a valid API token");
    $urlList.addClass("d-none");
    return false;
  }

  $.ajax({
    url: "/api/get-url-list",
    type: "POST",
    data: { apiToken },
    success: function (data) {
      if (data.message) {
        $errorInfo.html(`* ${data.message}`);
        $urlList.addClass("d-none");
      } else {
        $urlList.removeClass("d-none");
        $errorInfo.html("");
        $("#url-data").html(displayUrls(data.urlList));
      }
    },
    error: function (err) {
      $errorInfo.html("* Something went wrong!");
      $urlList.addClass("d-none");
    },
  });
}

function displayUrls(urlsList) {
  return urlsList.map(url => `<tr><td>${url.long_url}</td><td>${url.short_url}</td></tr>`).join('');
}
