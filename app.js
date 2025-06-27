const express = require('express');
const cros = require('cros');

const app= express();

app.use(cros());
app.use(express.json());

app.get('/', (req,res) => {
    res.send("guesthouse_booking_system");
});

module.exports = app;