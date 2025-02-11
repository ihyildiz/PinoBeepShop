const express = require ('express')
const router = express.Router()

router.get ('/', (req, res) => {
  //const c = process.env.DATABASE_URL
  //res.send("Hello World " + c)  
  res.render('index')
})


module.exports = router