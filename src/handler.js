const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (req, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = req.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    let finished = false;

    if (pageCount === readPage) { finished = true; }

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        insertedAt,
        updatedAt,
    };

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
    }
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }).code(201);
    }
    return h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    }).code(500);
};

const getAllBooks = (req, h) => {
    const { name, reading, finished } = req.query;

    if (name === 'Dicoding' || name === 'dicoding') {
        const filterName = books.filter((filterBook) => {
            const isNameFiltered = new RegExp(name, 'gi');
            return isNameFiltered.test(filterBook.name);
        });

        return h.response({
            status: 'success',
            data: {
                books: filterName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        }).code(200);
    }

    const validReading = books.filter((isReading) => isReading.reading === true);
    if (reading === '1') {
        return h.response({
            status: 'success',
            data: {
                books: validReading.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        }).code(200);
    }

    const invalidReading = books.filter((isReading) => isReading.reading === false);
    if (reading === '0') {
        return h.response({
            status: 'success',
            data: {
                books: invalidReading.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        }).code(200);
    }

    const validFinished = books.filter((isFinished) => isFinished.finished === true);
    if (finished === '1') {
        return h.response({
            status: 'success',
            data: {
                books: validFinished.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
            },
        }).code(200);
    }

    const invalidFinished = books.filter((isFinished) => isFinished.finished === false);
    if (finished === '0') {
        return h.response({
            status: 'success',
            data: {
                books: invalidFinished.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
            },
        }).code(200);
    }

    return h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    }).code(200);
};

const getBookById = (req, h) => {
    const { bookId } = req.params;
    const book = books.filter((getBook) => getBook.id === bookId)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }
    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    }).code(404);
};

const editBookById = (req, h) => {
    const { bookId } = req.params;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = req.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((updateBook) => updateBook.id === bookId);
    let finished = false;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    if (pageCount === readPage) { finished = true; }

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            updatedAt,
        };
        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        }).code(200);
    }
    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
};

const deleteBookById = (req, h) => {
    const { bookId } = req.params;
    const index = books.findIndex((deleteBook) => deleteBook.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
};

module.exports = {
    addBook, getAllBooks, getBookById, editBookById, deleteBookById,
};
