//if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
//}

const express = require ('express')
const app = express()

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} in ${Date.now() - start}ms`);
  });
  next();
});


const expressLayouts = require ('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

app.use((req, res, next) => {
  res.locals.query = req.query;
  next();
});

//const indexRouter = require ('./routes/index') --> bessere Namensgebung
const routerIndex = require ('./routes/index')
//const routerAuthor = require ('./routes/authors')
//const routerBook = require ('./routes/books')
const routerOrder = require ('./routes/orders')
//const routerAdmin = require('./routes/admin')
const routerPages = require ('./routes/pages')

app.set('view engine', 'ejs')
app.set ('views', __dirname + '/views')
// Standardlayout setzen
app.set ('layout', 'layouts/simpleShop')


/*
// Middleware für spezielle Layouts
app.use('/admin', (req, res, next) => {
    res.locals.layout = 'layouts/admin';
    next();
  });
*/

app.use (expressLayouts)
app.use (methodOverride('_method'))
/******************************
** Cache Header (optional, aber gut)
** In Express kannst du für public aggressives Caching aktivieren (wenn du Versionierung nutzt):
** ursprünglich nur ->app.use (express.static('public')) 
*******************************/
app.use(express.static('public', {
  maxAge: '30d',
  immutable: true
}));
app.use (bodyParser.urlencoded({ limit: '10mb', extended: false }))


// START MONGODB THROUGH TERMINAL
// brew services start mongodb-community
//const mongoose = require('mongoose')
//mongoose.connect(process.env.DATABASE_URL)
//const db = mongoose.connection
//db.on('error', error => console.error(error))
//db.once('open', () => console.log('connected to mongoose'))

app.use('/', routerIndex)
//app.use('/authors', routerAuthor)
//app.use('/books', routerBook)
app.use('/orders', routerOrder)
//app.use('/admin', routerAdmin)
app.use('/', routerPages)


const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
  console.log(`🧠 Environment: ${ENV}`);
});