var express = require('express')
var router = express.Router()

router.get('/prod', function (req, res) {
  res.send('hello prod')
})

router.get('/prod/add', function (req, res) {

})

router.get('/prod/info', function (req, res) {

})

module.exports = router
