// Cargar variables de entorno primero
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const { PORT } = require('./config/server');
const scenesRoutes = require('./routes/scenes.routes');
const routesRoutes = require("./routes/routes.routes");
const searchRoutes = require("./routes/search.routes");

app.use(cors());
app.use(express.json());

app.use('/api/scenes', scenesRoutes);
app.use('/api', routesRoutes);
app.use("/api/search", searchRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
