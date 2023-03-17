# URL Shortener

This is a simple URL shortener written in Node.js. It uses a MySQL database to store the URLs.


## How to run it
1. Clone the repository
2. Run `npm install`
3. Create a MySQL database and import the run the 'create_tables.sql' file under the 'database' folder
4. Then enter your database credentials in the 'db.js' file under the 'database' folder
5. Run `npm start server.js` to start the server
6. After that you can access the website at `http://localhost:3000`


## Usage
1. Enter the URL you want to shorten in the input field
2. Enter the API key (optional) and click on the button to shorten the URL

Beside that it offers a page to generate API keys,  a page to view all shortened URLs and also a page to view the statistics.


## Bugs and feature requests
If you find a bug or have a feature request, please report them at this repository's under the issues section. You can contribute changes by forking the repository and submitting a pull request.
