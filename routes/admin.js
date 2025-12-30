const express = require('express')
const router = express.Router()
const mailer = require('../services/nodemailer')

router.get('/', (req, res) => {
  res.render('admin/dashboard', { title: 'Admin Dashboard' })
})


router.get('/mail', async (req, res) => {
    const result = await mailer.nodeMailerSend('ihyildiz@icloud.com',"thanksMsg")
    res.send(result ? 'Send successful' : 'Send failed')
  })


module.exports = router