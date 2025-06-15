//if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
//}

const express = require ('express')
const app = express()
const expressLayouts = require ('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')




//const indexRouter = require ('./routes/index') --> bessere Namensgebung
const routerIndex = require ('./routes/index')
const routerAuthor = require ('./routes/authors')
const routerBook = require ('./routes/books')
const routerOrder = require ('./routes/orders')
const routerAdmin = require('./routes/admin')

app.set('view engine', 'ejs')
app.set ('views', __dirname + '/views')
// Standardlayout setzen
app.set ('layout', 'layouts/default')

// Middleware für spezielle Layouts
app.use('/admin', (req, res, next) => {
    res.locals.layout = 'layouts/admin';
    next();
  });


app.use (expressLayouts)
app.use (methodOverride('_method'))
app.use (express.static('public'))
app.use (bodyParser.urlencoded({ limit: '10mb', extended: false }))


// START MONGODB THROUGH TERMINAL
// brew services start mongodb-community
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('connected to mongoose'))

app.use('/', routerIndex)
app.use('/authors', routerAuthor)
app.use('/books', routerBook)
app.use('/orders', routerOrder)
app.use('/admin', routerAdmin)


app.listen(process.env.PORT || 3000)