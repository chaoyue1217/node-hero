var express = require('express')
var heroController = require('../controllers/hero')
var router = express.Router()

router
  .get('/', heroController.showIndex)
  .get('/add', heroController.showAdd)
  .post('/add', heroController.doAdd)
  .get('/info', heroController.showInfo)
  .get('/edit', heroController.showEdit)
  .post('/edit', heroController.doEdit)
  .get('/heros', heroController.getHeros)
  .post('/upload', heroController.handleUpload)
  .get('/remove', heroController.doRemove)

module.exports = router












// function successCallback(data) {
  
// }

// $.ajax({
//   url: 'xxx',
//   success: function (data) {
    
//   },
//   success: successCallback
// })
