const express = require ('express')
const router = express.Router()
const Book = require('../models/book')

router.get ('/', async (req, res) => {
  //const c = process.env.DATABASE_URL
  //res.send("Hello World " + c)  
  //res.render('index')
  let books
  try {
    books = await Book.find().sort( { createAt:  'desc'}).limit(10).exec()
  } catch (error) {
    book =[]
  }
  res.render('index', {
    books: books
  })

})


module.exports = router