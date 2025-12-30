const mongoose = require ('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    }
})

// authorSchema.pre('remove', function(next){
//     console.log("hakki")
//     Book.find({ author: this.id }, (err, books) =>{
//         if (err) {
//             next (err)
//         } else if (books.lenght >0) {
//             next (new Error ('This author has book still'))
//         } else {
//             next()
//         }
    
//     })
// })

// Middleware, um zu verhindern, dass ein Autor mit Büchern gelöscht wird
authorSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        const books = await Book.find({ author: this._id });
        if (books.length > 0) {
            return next(new Error('This author still has books and cannot be deleted.'));
        }
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Author', authorSchema)
