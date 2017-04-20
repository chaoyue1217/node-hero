var fs = require('fs')
var path = require('path')

/**
 * model 文件模块
 * 作用：专门提供对数据处理的 API ，其它一切不关心
 */

var dataPath = path.join(__dirname, '../data.json')

function getAll(callback) {
  fs.readFile(dataPath, function (err, data) {
    if (err) {
      return callback(err)
    }
    callback(null, JSON.parse(data))
  })
}

function saveHeros(data, callback) {
  fs.writeFile(dataPath, JSON.stringify(data), function (err) {
      if (err) {
        return callback(err)
      }
      callback(null)
    })
    // fs.writeFile(dataPath, JSON.stringify(data), callback)
}

exports.getAll = getAll

exports.getById = function (id, callback) {
  id = parseInt(id)
  getAll(function (err, data) {
    if (err) {
      return callback(err)
    }
    var heros = data.heros
      // forEach 一旦开启，无法停止
    heros.some(function (hero) {
      if (hero.id === id) {
        callback(null, hero)
        return true // 这里 return true 的目的是为了让 some 函数终止遍历
      }
    })
  })
}

exports.add = function (hero, callback) {
  getAll(function (err, data) {
    if (err) {
      return callback(err)
    }

    var heros = data.heros
    hero.id = heros.length === 0 ? 1 : heros[heros.length - 1].id + 1
    heros.push(hero)

    data = JSON.stringify(data, null, '  ')

    fs.writeFile(dataPath, data, function (err) {
      if (err) {
        return callback(err)
      }
      callback(null)
    })
  })
}

exports.deleteById = function (id, callback) {
  id = parseInt(id)
  getAll(function (err, data) {
    if (err) {
      return callback(err)
    }
    data.heros.some(function (hero, index) {
      if (hero.id === id) {
        data.heros.splice(index, 1)
        saveHeros(data, function (err) {
          if (err) {
            return callback(err)
          }
          callback(null)
        })
        return true
      }
    })
  })
}

exports.updateById = function (hero, callback) {
  hero.id = parseInt(hero.id)
  getAll(function (err, data) {
    if (err) {
      return callback(err)
    }
    data.heros.some(function (item) {
      if (item.id === hero.id) {
        for (var key in hero) {
          item[key] = hero[key]
        }
        // 这里改完数据之后，要把数据重新写到 data.json 文件中
        saveHeros(data, function (err) {
            if (err) {
              return callback(err)
            }
            callback(null)
          })
          // saveHeros(data, callback)
        return true
      }
    })
  })
}
