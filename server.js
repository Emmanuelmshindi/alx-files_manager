const express = require("express");

const routes = require("./routes/index.js");

const app = express();

const PORT = process.env.port || 5000;

app.use('/status', routes);
app.use('/stats', routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
