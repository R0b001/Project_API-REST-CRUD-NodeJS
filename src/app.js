const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {config} = require('dotenv');
config();

const booksRoutes = require('./routes/books.routes');

//Uso de Express para los Middlewares:
const app = express();
app.use(bodyParser.json());

//Conectar la BD:
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME});
const db = mongoose.connection;

//Rutas de los Libros:
app.use('/books', booksRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Servidor en el puerto:', port);
});