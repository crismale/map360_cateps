const express = require('express');
const cors = require('cors');
const app = express();
const { PORT } = require('./config/server');
const scenesRoutes = require('./routes/scenes.routes');

app.use(cors());
app.use(express.json());

app.use('/api/scenes', scenesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
