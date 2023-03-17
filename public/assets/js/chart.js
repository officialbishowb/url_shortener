function getTokenData(e) {
  e.preventDefault();

  const apiTokenInput = document.getElementById("api-token");
  const errorInfo = $(".error-info");
  const statsViewer = $(".stats-viewer");

  const apiToken = apiTokenInput.value;

  if (!apiToken) {
    errorInfo.html("* The API token is missing");
    // Clear the chart
    statsViewer.addClass("d-none");
  } else {
    errorInfo.html("");

    $.ajax({
      url: "/api/get-stats",
      type: "POST",
      data: { apiToken },
      success: ({ message, stats }) => {
        if (message) {
          errorInfo.html(`* ${message}`);
          // Clear the chart
          statsViewer.addClass("d-none");
        } else {
          errorInfo.html("");
          statsViewer.removeClass("d-none");
          showChart(stats);
        }
      },
      error: (err) => {
        console.log(err);
        errorInfo.html("* Something went wrong!");
        // Clear the chart
        statsViewer.addClass("d-none");
      },
    });
  }
}

function showChart(data) {
  const url_label = [];
  const url_clicks_lable = [];

  data.forEach(function (d) {
    url_label.push(d.short_url);
    url_clicks_lable.push(d.clicks);
  });

  const colors = [
    "rgba(255, 99, 132,",
    "rgba(54, 162, 235,",
    "rgba(255, 206, 86,",
    "rgba(75, 192, 192,",
    "rgba(153, 102, 255,",
    "rgba(255, 159, 64,",
  ];

  const backgroundColor = [];
  const borderColor = [];

  for (let i = 0; i < data.length; i++) {
    const colorIndex = i % colors.length;
    backgroundColor.push(colors[colorIndex] + " 0.2)");
    borderColor.push(colors[colorIndex] + " 1)");
  }

  var ctx = document.getElementById("url-stats").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: url_label,
      datasets: [
        {
          label: "# of clicks",
          data: url_clicks_lable,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Show the general stats such as total countries, browser, device type, os and referrer

  // Define the labels and data arrays for each statistic
  const totalCountriesLabel = [];
  const totalCountriesData = [];
  const totalBrowsersLabel = [];
  const totalBrowsersData = [];
  const totalDeviceTypesLabel = [];
  const totalDeviceTypesData = [];
  const totalOsLabel = [];
  const totalOsData = [];
  const totalReferrersLabel = [];
  const totalReferrersData = [];

  // Loop through the data and update the label and data arrays for each statistic
  for (let i = 0; i < data.length; i++) {
    addOrUpdateData(totalCountriesLabel, totalCountriesData, data[i].country);
    addOrUpdateData(totalBrowsersLabel, totalBrowsersData, data[i].browser);
    addOrUpdateData(totalDeviceTypesLabel, totalDeviceTypesData, data[i].device_type);
    addOrUpdateData(totalOsLabel, totalOsData, data[i].os, data[i].clicks);
    addOrUpdateData(totalReferrersLabel, totalReferrersData, data[i].referrer);
  }
 
    // Define the canvas contexts for each chart
  const countryCtx = document.getElementById("total-countries").getContext("2d");
  const browserCtx = document.getElementById("total-browsers").getContext("2d");
  const deviceTypeCtx = document.getElementById("total-device-types").getContext("2d");
  const osCtx = document.getElementById("total-os").getContext("2d");
  const referrerCtx = document.getElementById("total-referrers").getContext("2d");

  // Create an array of chart objects to draw
  const chartsToDraw = [
  createPieChart(countryCtx, totalCountriesLabel, totalCountriesData, "Countries"),
  createPieChart(browserCtx, totalBrowsersLabel, totalBrowsersData, "Browsers"),
  createPieChart(deviceTypeCtx, totalDeviceTypesLabel, totalDeviceTypesData, "Device Types"),
  createPieChart(osCtx, totalOsLabel, totalOsData, "Operating Systems"),
  createPieChart(referrerCtx, totalReferrersLabel, totalReferrersData, "Referrers")
  ];

  // Loop through each chart in the charts_to_draw array and call the update() method on each one
  for (let i = 0; i < chartsToDraw.length; i++) {
    chartsToDraw[i].update();
  }
}

function addOrUpdateData(labelArray, dataArray, categoryValue, count = 1) {
  const index = labelArray.indexOf(categoryValue);
  if (index === -1) {
    labelArray.push(categoryValue);
    dataArray.push(count);
  } else {
    dataArray[index] += count;
  }
}

function createPieChart(ctx, label, data, title) {
  var chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: label,
      datasets: [
        {
          label: title,
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  return chart;
}

function showStats(idToDisplay) {
  let defaultClass = "stat";

  // Display the clicked stat while hiding the others

  let allStats = $("." + defaultClass);
  for (let i = 0; i < allStats.length; i++) {
    if (allStats[i].id == idToDisplay) {
      $(allStats[i]).removeClass("d-none");
    } else {
      $(allStats[i]).addClass("d-none");
    }
  }
}
