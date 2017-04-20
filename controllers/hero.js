var fs = require('fs')
var formidable = require('formidable')
var model = require('../models/hero')
var path = require('path')
var config = require('../config')

/**
 * 处理模块
 *   作用：将不同的请求对应的处理封装到一个一个的小函数中
 */

exports.handleUpload = function (req, res) {
  var form = new formidable.IncomingForm()
  form.uploadDir = config.upload_preview.abs
  form.keepExtensions = true
  form.parse(req, function (err, fields, files) {
    if (err) {
      return res.json({
        err_code: 500,
        message: err.message
      })
    }
    files.avatar.path = files.avatar.path.replace('\\', '/')
    // /public/upload/文件名
    var fileName = path.basename(files.avatar.path)
    var previewUrl = path.join(config.upload_preview.rel, fileName).replace('\\', '/')
    res.json({
      err_code: 0,
      result: '/' + previewUrl
    })
  })
}

exports.doRemove = function (req, res) {
  var id = req.query.id
  model.deleteById(id, function (err) {
    if (err) {
      return res.json({
        err_code: 500,
        message: err.message
      })
    }
    res.json({
      err_code: 0
    })
  })
}

exports.showIndex = function (req, res) {
  res.render('index')
}

exports.showInfo = function (req, res) {
  var id = req.query.id
  model.getById(id, function (err, hero) {
    if (err) {
      return res.json({
        err_code: 500,
        message: err.message
      })
    }
    res.render('info', {
      hero: hero
    })
  })
}

exports.showEdit = function (req, res) {
  var id = req.query.id
  model.getById(id, function (err, hero) {
    if (err) {
      return res.json({
        err_code: 500,
        message: err.message
      })
    }
    res.render('edit', {
      hero: hero
    })
  })
}

exports.doEdit = function (req, res) {
  var form = new formidable.IncomingForm()
  form.uploadDir = "./img/"
  form.keepExtensions = true
  form.parse(req, function (err, fields, files) {
    if (err) {
      return res.json({
        err_code: 500,
        message: err.message
      })
    }
    var body = fields

    if (files.avatar.size === 0) {
      // 使用原来的图片
      body.avatar = fields.origin_avatar
        // 将字节为 0 的空文件删除
      fs.unlink(files.avatar.path)

      // 这里放到定时器中有问题
      // setTimeout(function () {
      //   console.log(555)
      //   fs.unlink(files.avatar.path)
      // }, 1000)
    } else {
      // 使用新的上传的图片
      body.avatar = path.join('img/', path.basename(files.avatar.path))
    }

    model.updateById(body, function (err) {
      if (err) {
        return res.json({
          err_code: 500,
          message: err.message
        })
      }
      res.json({
        err_code: 0
      })
    })
  })
}

exports.showAdd = function (req, res) {
  res.render('add', {
    title: 'world'
  })
}

exports.doAdd = function (req, res) {
  // parse a file upload
  var form = new formidable.IncomingForm()

  // 配置上传的文件路径
  form.uploadDir = config.upload_dir.abs

  // 配置保持文件扩展名
  form.keepExtensions = true

  // 同时将普通数据放到了回调函数的 fields 中了（是一个对象）
  // 默认 formidable 将表单中的数据存储到了操作系统的临时目录中了
  // 同时将该文件的大小、路径等信息存储到了 files 对象中了
  form.parse(req, function (err, fields, files) {
    if (err) {
      throw err
    }
    var body = fields
    body.avatar = path.basename(files.avatar.path)

    model.add(body, function (err) {
      if (err) {
        return res.json({
          err_code: 500,
          message: err.message
        })
      }
      res.json({
        err_code: 0
      })
    })
  })
}

exports.getHeros = function (req, res) {
  model.getAll(function (err, data) {
    if (err) {
      return res.json({
        err_code: 500,
        message: err.message
      })
    }
    data.heros.forEach(function (hero) {
      hero.avatar = '/' + path.join(config.upload_dir.rel, hero.avatar).replace(/\\/g, '/')
    })
    res.json({
      err_code: 0,
      result: data
    })
  })
}

// 原来自己的写的：处理普通表单 post 提交（没有文件）
// exports.doAdd = function (req, res) {
//   console.log('doadd')
//   // 如果表单数据量越多，则发送的次数越多，如果比较少，可能一次就发过来了
//   // 所以接收表单数据的时候，需要通过监听 req 对象的 data 事件来取数据
//   // 也就是说，每当收到一段表单提交过来的数据，req 的 data 事件就会被触发一次，同时通过回调函数可以拿到该 段 的数据
//   var data = ''
//   req.on('data', function (chunk) {
//     // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
//     data += chunk
//   })

//   // 当接收表单提交的数据完毕之后，就可以进一步处理了
//   req.on('end', function () {
//     data = decodeURI(data)
//     var body = {}
//     data.split('&').forEach(function (item) {
//       var tmp = item.split('=')
//       body[tmp[0]] = tmp[1]
//     })
//     console.log(body)
//     fs.readFile('./data.json', 'utf8', function (err, data) {
//       if (err) {
//         res.end(JSON.stringify({
//           err_code: 500,
//           message: err.message
//         }))
//       }
//       data = JSON.parse(data)
//       data.heros.push({
//         id: 1,
//         name: body.name,
//         gender: body.gender,
//         avatar: 'img/131.jpg'
//       })
//       data = JSON.stringify(data, null, '  ')
//       fs.writeFile('./data.json', data, function (err) {
//         if (err) {
//           res.end(JSON.stringify({
//             err_code: 500,
//             message: err.message
//           }))
//         }
//         res.end(JSON.stringify({
//           err_code: 0
//         }))
//       })
//     })
//   })
// }

exports.handleStatic = function (req, res) {
  // /node_modules/jquery/dist/jquery.js
  // /node_modules/bootstrap/dist/js/bootstrap.js
  // /node_modules/bootstrap/dist/css/bootstrap.css
  var filePath = '.' + req.url
  fs.readFile(filePath, function (err, data) {
    if (err) {
      return res.end('404 Not Found.')
    }
    res.end(data)
  })
}
