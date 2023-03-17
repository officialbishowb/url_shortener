DROP TABLE IF EXISTS url_stats;
DROP TABLE IF EXISTS shortened_urls;
DROP TABLE IF EXISTS api_tokens;

CREATE TABLE `api_tokens` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL
);

CREATE TABLE `shortened_urls` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    long_url VARCHAR(255) NOT NULL,
    short_url VARCHAR(255) NOT NULL,
    token_id INT,
    FOREIGN KEY (token_id) REFERENCES api_tokens(id)
);

CREATE TABLE `url_stats` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shortened_url_id INT NOT NULL,
    ip_address VARCHAR(100) NOT NULL,
    country CHAR(255) NOT NULL,
    device_type VARCHAR(100) NOT NULL,
    browser VARCHAR(100) NOT NULL,
    os VARCHAR(100) NOT NULL,
    referrer VARCHAR(255) NOT NULL,
    click_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shortened_url_id) REFERENCES shortened_urls(id)
);
