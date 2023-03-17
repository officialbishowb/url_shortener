const { json } = require("body-parser");
const db = require("./db.js");

async function tokenExist(token) {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM api_tokens WHERE token = ?", [token]);
    return rows.length > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function urlShortExist(shortUrl, token = null) {
  // Check if the shorten url already exist in the database for API token or not
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM urls WHERE short_url = ? AND token = ?", [
        shortUrl,
        token,
      ]);
    return rows.length > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function newUrl(long_url, shortUrl, token = null) {
  // Insert the new URL in the database

  // If the token exist get its id
  let token_id = null;
  if (token) {
    const [rows] = await db
      .promise()
      .query("SELECT id FROM api_tokens WHERE token = ?", [token]);
    token_id = rows[0].id;
  }

  try {
    const [rows] = await db
      .promise()
      .query(
        "INSERT INTO shortened_urls (long_url, short_url, token_id) VALUES (?, ?, ?)",
        [long_url, shortUrl, token_id]
      );
    return rows;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function newToken(token) {
  // Insert the new API token in the database
  try {
    const [rows] = await db
      .promise()
      .query("INSERT INTO api_tokens (token) VALUES (?)", [token]);
    return rows;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function getUrl(shortUrlId, hostname) {
  var shortUrl = hostname + "/" + shortUrlId;
  try {
    const [rows] = await db
      .promise()
      .query("SELECT id, long_url FROM shortened_urls WHERE short_url = ?", [
        shortUrl,
      ]);
    return { long_url: rows[0].long_url , id: rows[0].id };
  } catch (err) {
    console.error(err);
    return false;
  }
}


async function newTracking(shortened_url_id, ip_address, country, device_type, browser, referrer, os) {
  // Insert the new tracking in the database
  try {
    const [rows] = await db
      .promise()
      .query(
        "INSERT INTO url_stats (shortened_url_id, ip_address, country, device_type, browser, os, referrer) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [shortened_url_id, ip_address, country, device_type, browser, os, referrer]
      );
    return rows;
  } catch (err) {
    console.error(err);
    return false;
  }
}


async function getStats(token) {
  // Get the stats for the API token

  try {
    const [rows] = await db
      .promise()
      .query(
        `SELECT shortened_urls.short_url, COUNT(url_stats.shortened_url_id) as clicks, 
        url_stats.country, url_stats.device_type, url_stats.browser, url_stats.os, url_stats.referrer,
        DATE_FORMAT(url_stats.click_time, '%Y-%m-%d') as date 
        FROM url_stats
        INNER JOIN shortened_urls ON url_stats.shortened_url_id = shortened_urls.id
        INNER JOIN api_tokens ON shortened_urls.token_id = api_tokens.id
        WHERE api_tokens.token = ?
        GROUP BY shortened_urls.short_url, url_stats.country, url_stats.device_type, url_stats.browser, url_stats.os, url_stats.referrer, date
        ORDER BY date DESC;
      `,
        [token]
      );
    return rows;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function getUrlList(token) {
  // Get the list of URLs for the API token

  try {
    const [rows] = await db.promise().query(
      `SELECT shortened_urls.short_url, shortened_urls.long_url
      FROM shortened_urls
      INNER JOIN api_tokens ON shortened_urls.token_id = api_tokens.id
      WHERE api_tokens.token = ?
      ORDER BY shortened_urls.id DESC;
    `,
      [token]
    );
    return rows;
  } catch (err) {
    console.error(err);
    return false;
  }
}



module.exports = { tokenExist, urlShortExist, newUrl, newToken, getUrl, newTracking, getStats, getUrlList };
