const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/clients', require('./routes/clients'));

// Base Route
app.get('/', (req, res) => {
    res.send('FitLeap Admin API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
