const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 3000;
const path = require('path');

const userRoutes = require('./api/routes/user');
const companyRoutes = require('./api/routes/company');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL_DEV, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if(err){
        console.log('Could Not connect to database ', err);
    } else{
        console.log('Connected to database: ');
    }
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(express.static(__dirname + '/public'));

app.use('/api/users', userRoutes);
app.use('/api/company', companyRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(port, () => {
    console.log('Listening on Port '+port);
});