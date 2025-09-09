//Creación de Rutas:
//Clases/Dependencias.
const express = require('express');
const routes = express.Router();
const Books = require('../models/books.models');

//Middleware:
const getBook = async(req, res, next) => {
    let book;
    const {id} = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message: 'El Id del libro no es valido.'
        });
    }

    try {
        book = await Books.findById(id);
        if (!book) {
            return res.status(404).json({
                message: 'Libro no encontrado.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }

    res.book = book;
    next();
};

//Rutas del Modelo.
//Obtener los Libros:
routes.get('/', async(req, res) => {
    try {
        const books = await Books.find();
        console.log('GET ALL,', books);
        if (books.length === 0) {
            return res.status(204).json([]);
        }
        res.json(books)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//Obtener un Libro:
routes.get('/:id', getBook, async(req, res) => {
    res.json(res.book);
});

// Crear los Libros:
routes.post('/', async(req, res) => {
    const {
        title, author, 
        gender, publication_date
    } = req?.body;

    if (!title || !author || !gender || !publication_date) {
        return res.status(400).json({
            message: 'Los campos del libro son obligatorios.'
        });
    }

    const book = new Books({
        title, author, 
        gender, publication_date
    });

    try {
        const newBooks = await book.save();
        console.log(newBooks);
        res.status(201).json(newBooks);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

//Actualizar el Libro:
routes.put('/:id', getBook, async(req, res) => {
    try {
        const book = res.book;

        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.gender = req.body.gender|| book.gender;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updateBook = await book.save();
        res.json(updateBook);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

//Actualizar algún campo del Libro:
routes.patch('/:id', getBook, async(req, res) => {
    if (!req.body.title && !req.body.author && !req.body.gender && !req.body.publication_date) {
        res.status(400).json({
            message: 'De los campos, al menos UNO debe ser editado.'
        });
    }
    
    try {
        const book = res.book;

        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.gender = req.body.gender|| book.gender;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updateBook = await book.save();
        res.json(updateBook);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

//Eliminar el Libro:
routes.delete('/:id', getBook, async(req, res) => {
    try {
        const book = res.book;
        await book.deleteOne();
        res.json({
            message: 'El libro '+book.title+' se elimino correctamente'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//Exportar las rutas:
module.exports = routes;