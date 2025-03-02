const express = require ('express')
const router = express.Router()
// PAYPAL
const paypal = require('../services/paypal')

router.post('/pay', async(req, res) =>{
    try {
      const url = await paypal.createOrder()
      res.redirect(url)
    } catch (error) {
      res.send('Meine Error Meldung: ' + error)
    }
  })
  
router.get('/complete-order', async(req, res) =>{
    try {
        
        const capture = await paypal.capturePayment(req.query.token)
        console.log('E-Mail: ' + capture.payment_source.paypal.email_address)//.find(paypal => link.rel ==='approve').href)
        console.log('Vorname: ' + capture.payer.name.given_name)
        console.log('Name: ' + capture.payer.name.surname)
        console.log('Email ' + capture.payer.email_address)
        console.log('Payerid: ' + capture.payer.payer_id)
        //console.log('B-Adresse:', JSON.stringify(capture.payment_source.paypal.address, null, 2))
        
        const shippingAddress = capture.purchase_units[0].shipping.address;
        /*
            S-Adresse:  {
            address_line_1: 'Badensche Str. 24',
            admin_area_2: 'Berlin',
            admin_area_1: 'Berlin',
            postal_code: '10715',
            country_code: 'DE'
        */
        console.log('S-Adresse: ', shippingAddress);
        console.log('S-Adresse Line1: ', shippingAddress.address_line_1)

        console.log('Capture: ', capture)
        res.send('Complete Order')
    } catch (error) {
       //console.log(error)
        res.send('Meine Error Meldung: '+ error )
    }
})

router.get('/cancel-order', async(req, res) =>{
    res.redirect('/')
})

  module.exports = router