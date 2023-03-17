const path = require("path");
const express = require("express");
const router = express.Router();
const db_helper = require("../database/helper.js");
const utils = require("../utils/utils.js");
const DeviceDetector = require("node-device-detector");

// Root folder
const root_path = path.resolve(__dirname, "..");

// General website routes
router.get("/", (req, res) => {
  res.sendFile(path.resolve(root_path, "views", "index.html"), (err) => {
    if (err) {
      res.status(404).send("File not found");
    }
  });
});

router.get("/generate-api", (req, res) => {
  res.sendFile(path.resolve(root_path, "views", "generate-api.html"), (err) => {
    if (err) {
      res.status(404).send("File not found");
    }
  });
});

router.get("/get-stats", (req, res) => {
  res.sendFile(path.resolve(root_path, "views", "stats.html"), (err) => {
    if (err) {
      res.status(404).send("File not found");
    }
  });
});

router.get("/get-url-list", (req, res) => {
  res.sendFile(path.resolve(root_path, "views", "url-list.html"), (err) => {
    if (err) {
      res.status(404).send("File not found");
    }
  });
});


// General API routes
router.get("/api/generate-token", (req, res) => {
  // Generate a new API token
  var apiToken = utils.generateApiToken();
  // Insert the new API token in the database
  db_helper.newToken(apiToken).then((result) => {
    if (!result) {
      return res.json({
        message: "An error occured while trying to generate the API token.",
      });
    }
    return res.json({ apiToken: apiToken });
  });
});

router.post("/api/shrink-url", (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const url = req.body.url || null;
  const apiToken = req.body.apiToken || null;

  // If the url is not provided, return an error
  if (!url) {
    return res.json({ message: "The url is missing" });
  }

  // Check if the API token exist in the database (if provided)
  if (apiToken) {
    db_helper.tokenExist(apiToken).then((exist) => {
      if (!exist) {
        return res.json({ message: "The provided API token is invalid" });
      }
    });
  }

  // If everything is ok, create a new shorten url and check if it already exist in the database for the API token (if provided)
  var urlShort = utils.generateRandomUrlString(url);
  urlShort = req.headers.host + "/" + urlShort;

  // If everything is ok, insert the new shorten url in the database
  db_helper.newUrl(url, urlShort, apiToken).then((result) => {
    if (!result) {
      return res.json({
        message: "An error occured while trying to save the url.",
      });
    }
    return res.json({ shrinkedUrl: urlShort });
  });
});

router.get("/:id", async (req, res) => {
  var urlShortId = req.params.id;
  var hostName = req.headers.host;

  const referrer = req.headers.referer ? req.headers.referer : "Unknown";

  db_helper.getUrl(urlShortId, hostName).then(async (result) => {
    if (!result) {
      return res.redirect("/");
    }

    // Tracking section
    const detector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: false,
    });
    const userAgent = req.headers["user-agent"];
    const uaResult = detector.detect(userAgent);

    // Values to track
    const browserName = uaResult.client.name ? uaResult.client.name : "Unknown";
    const deviceTypeBrand = uaResult.device.model
      ? uaResult.device.model
      : "Unknown";
    const osName = uaResult.os.name ? uaResult.os.name : "Unknown";

    // Get the IP address by fetching from https://ipapi.co/json/
    var ipAddress = "";
    var country = "";
    await fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((json) => {
        ipAddress = json.ip;
        country = json.country_name;
      });

    // If there is no ID dont track
    if (!result.id) {
      return res.redirect(result.long_url);
    }
    // Insert the new tracking in the database
    db_helper
      .newTracking(
        result.id,
        ipAddress,
        country,
        deviceTypeBrand,
        browserName,
        referrer,
        osName
      )
      .then((result) => {
        if (!result) {
          return res.redirect("/");
        }
      });

    return res.redirect(result.long_url); // Redirect to the original url
  });
});

router.post("/api/get-stats", (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const apiToken = req.body.apiToken || null;

  // If the API token is not provided, return an error
  if (!apiToken) {
    return res.json({ message: "The API token is missing" });
  }

  // Check if the API token exist in the database
  db_helper.tokenExist(apiToken).then((exist) => {
    if (!exist) {
      return res.json({ message: "The provided API token is invalid" });
    }

    // If everything is ok, get the stats for the API token
    db_helper.getStats(apiToken).then((result) => {
      if (!result) {
        return res.json({
          message: "An error occured while trying to get the stats.",
        });
      }

      return res.json({ stats: result });
    });
  });
});

router.post("/api/get-url-list", (req, res) => {
  console.log(req.body);
  if (!req.body) return res.sendStatus(400);

  const apiToken = req.body.apiToken || null;

  // If the API token is not provided, return an error
  if (!apiToken) {
    return res.json({ message: "The API token is missing" });
  }

  // Check if the API token exist in the database
  db_helper.tokenExist(apiToken).then((exist) => {
    if (!exist) {
      return res.json({ message: "The provided API token is invalid" });
    }

    // If everything is ok, get the url list for the API token
    db_helper.getUrlList(apiToken).then((result) => {
      if (!result) {
        return res.json({
          message: "An error occured while trying to get the url list.",
        });
      }

      return res.json({ urlList: result });
    });
  });
});

module.exports = router;
