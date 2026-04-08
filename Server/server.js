require('dotenv').config();  // ← PHẢI LÊN DÒNG 1

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/materials', require('./routes/materials'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/comments', require('./routes/comments'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));