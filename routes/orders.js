const express = require ('express')
const router = express.Router()
// PAYPAL
const paypal = require('../services/paypal')
const mailer = require('../services/nodemailer')

/* hier bestimmen wir welches Produkt verkauft werden soll */
const products = require('../config/products');
const p = products.pinobeep_two_color_45v;

router.post('/pay', async(req, res) =>{
    try {
      const url = await paypal.createOrder()
      res.redirect(url)
    } catch (error) {
      res.send('Meine Error Meldung: ' + error)
    }
  })
  
// routes/orders.js
router.get('/complete-order', async (req, res) => {
  try {
    const capture = await paypal.capturePayment(req.query.token);

    const payer = capture.payer;
    const shipping = capture.purchase_units?.[0]?.shipping;
    const shippingAddress = shipping?.address;

    // ⚠️ Produktdaten kommen bei dir aktuell NICHT aus PayPal-Capture
    // daher hier erstmal statisch (später aus DB oder Session/Cart)
    const items = [
      {
        name: p.name,
        qty: 1,
        unitPrice: p.price,
        imagePath: 'public/images/'+ p.imageName,
        imageCid: 'product_img_1',
      },
    ];

    const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
    const shippingCost = 0;
    const total = subtotal + shippingCost;

    const order = {
      id: capture.id,
      status: capture.status,
      buyer: {
        firstName: payer?.name?.given_name,
        lastName: payer?.name?.surname,
        email: payer?.email_address || capture?.payment_source?.paypal?.email_address,
        payerId: payer?.payer_id,
      },
      shipping: {
        name: shipping?.name?.full_name,
        line1: shippingAddress?.address_line_1,
        city: shippingAddress?.admin_area_2,
        state: shippingAddress?.admin_area_1,
        zip: shippingAddress?.postal_code,
        country: shippingAddress?.country_code,
      },
      items,
      currency: 'EUR',
      subtotal: subtotal.toFixed(2),
      shippingCost: shippingCost.toFixed(2),
      total: total.toFixed(2),
      date: new Date().toLocaleString('de-DE'),
    };

    // 1) Mail an dich (Verkäufer)
    await mailer.nodeMailerSend({
      to: process.env.SELLER_EMAIL,
      subject: `Neue Bestellung ${order.id} – ${order.buyer.firstName} ${order.buyer.lastName}`,
      template: 'sellerOrder',
      context: { order },
    });

    // 2) Mail an Käufer (Bestätigung + Rechnung)
    await mailer.nodeMailerSend({
      to: [
        order.buyer.email,
       'ihyildiz@me.com'
      ],
      bcc: process.env.SELLER_EMAIL,
      subject: `Deine Bestellung bei pinoBeep – ${order.id}`,
      template: 'buyerConfirmation',
      context: { order },
      attachments: [
        {
          filename: 'product.jpg',
          path: order.items[0].imagePath,
          cid: order.items[0].imageCid,
        },
      ],
    });

    //res.send('Complete Order');
    res.redirect('/?order=success');
  } catch (error) {
    res.send('Meine Error Meldung: ' + error);
  }
});

router.get('/cancel-order', (req, res) => {
  console.log('User canceled the payment');
  res.redirect('/?order=cancelled');
});

  module.exports = router