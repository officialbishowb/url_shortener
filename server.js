const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

// Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Import routes
const indexRoutes = require('./routes/index');


// Routes
app.use('/', indexRoutes);





// Serve static files from the 'public' directory
app.use(express.static('public'));


// Run the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});




