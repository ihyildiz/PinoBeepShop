const express = require ('express')
const router = express.Router()

router.get('/impressum', (req, res) => {
  res.render('impressum');
});

router.get('/agb', (req, res) => {
  res.render('agb');
});

router.get('/datenschutz', (req, res) => {
  res.render('datenschutz');
});

router.get('/widerruf', (req, res) => {
  res.render('widerruf');
});
module.exports = router